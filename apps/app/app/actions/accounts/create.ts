"use server";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import type { AccountCategory, ActionOnDeath } from "@repo/database";

type CreateAccountInput = {
  category: AccountCategory;
  platformName: string;
  platformIcon?: string;
  username?: string;
  email?: string;
  actionOnDeath: ActionOnDeath;
  transferToId?: string;
  notes?: string;
};

export const createAccount = async (
  input: CreateAccountInput
): Promise<
  | { data: Awaited<ReturnType<typeof database.digitalAccount.create>> }
  | { error: unknown }
> => {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const profile = await database.userProfile.findUnique({
      where: { clerkUserId: userId },
    });

    if (!profile) {
      throw new Error("Profile not found. Please complete onboarding first.");
    }

    // Validate transferToId if action is TRANSFER
    if (input.actionOnDeath === "TRANSFER" && input.transferToId) {
      const contact = await database.trustedContact.findUnique({
        where: { id: input.transferToId, userId: profile.id },
      });
      if (!contact) {
        throw new Error("Transfer contact not found");
      }
    }

    const account = await database.digitalAccount.create({
      data: {
        userId: profile.id,
        category: input.category,
        platformName: input.platformName,
        platformIcon: input.platformIcon,
        username: input.username,
        email: input.email,
        actionOnDeath: input.actionOnDeath,
        transferToId: input.transferToId,
        notes: input.notes,
      },
    });

    return { data: account };
  } catch (error) {
    return { error };
  }
};

"use server";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import type { AccountCategory, ActionOnDeath } from "@repo/database";

type UpdateAccountInput = {
  id: string;
  category?: AccountCategory;
  platformName?: string;
  platformIcon?: string;
  username?: string;
  email?: string;
  actionOnDeath?: ActionOnDeath;
  transferToId?: string | null;
  notes?: string;
};

export const updateAccount = async (
  input: UpdateAccountInput
): Promise<
  | { data: Awaited<ReturnType<typeof database.digitalAccount.update>> }
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
      throw new Error("Profile not found");
    }

    // Verify ownership
    const existing = await database.digitalAccount.findUnique({
      where: { id: input.id, userId: profile.id },
    });

    if (!existing) {
      throw new Error("Account not found");
    }

    const { id, ...updateData } = input;

    const account = await database.digitalAccount.update({
      where: { id },
      data: updateData,
    });

    return { data: account };
  } catch (error) {
    return { error };
  }
};

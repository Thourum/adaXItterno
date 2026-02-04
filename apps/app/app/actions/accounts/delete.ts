"use server";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";

export const deleteAccount = async (
  accountId: string
): Promise<{ data: { success: boolean } } | { error: unknown }> => {
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
      where: { id: accountId, userId: profile.id },
    });

    if (!existing) {
      throw new Error("Account not found");
    }

    await database.digitalAccount.delete({
      where: { id: accountId },
    });

    return { data: { success: true } };
  } catch (error) {
    return { error };
  }
};

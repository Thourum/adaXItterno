"use server";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";

export const deleteContact = async (
  contactId: string
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
    const existing = await database.trustedContact.findUnique({
      where: { id: contactId, userId: profile.id },
    });

    if (!existing) {
      throw new Error("Contact not found");
    }

    await database.trustedContact.delete({
      where: { id: contactId },
    });

    return { data: { success: true } };
  } catch (error) {
    return { error };
  }
};

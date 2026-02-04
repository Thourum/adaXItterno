"use server";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { del } from "@repo/storage";

export const deleteDocument = async (
  documentId: string
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

    // Check if account is locked
    if (profile.status === "DECEASED") {
      throw new Error("This account has been locked. No modifications allowed.");
    }
    if (profile.status === "INACTIVE") {
      throw new Error("This account has been deactivated.");
    }

    // Verify ownership and get file URL
    const existing = await database.document.findUnique({
      where: { id: documentId, userId: profile.id },
    });

    if (!existing) {
      throw new Error("Document not found");
    }

    // Delete from storage
    try {
      await del(existing.fileUrl);
    } catch {
      // Continue even if storage deletion fails
    }

    // Delete from database
    await database.document.delete({
      where: { id: documentId },
    });

    return { data: { success: true } };
  } catch (error) {
    return { error };
  }
};

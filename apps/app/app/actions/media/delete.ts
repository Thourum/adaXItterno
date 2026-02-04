"use server";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { del } from "@repo/storage";

export const deleteMediaItem = async (
  itemId: string
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

    // Verify ownership and get file URL
    const existing = await database.mediaItem.findUnique({
      where: { id: itemId, userId: profile.id },
    });

    if (!existing) {
      throw new Error("Media item not found");
    }

    // Delete from storage
    try {
      await del(existing.fileUrl);
    } catch {
      // Continue even if storage deletion fails
    }

    // Delete from database
    await database.mediaItem.delete({
      where: { id: itemId },
    });

    return { data: { success: true } };
  } catch (error) {
    return { error };
  }
};

export const deleteMediaFolder = async (
  folderId: string
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
    const existing = await database.mediaFolder.findUnique({
      where: { id: folderId, userId: profile.id },
      include: { items: true },
    });

    if (!existing) {
      throw new Error("Folder not found");
    }

    // Delete all media files from storage
    for (const item of existing.items) {
      try {
        await del(item.fileUrl);
      } catch {
        // Continue even if storage deletion fails
      }
    }

    // Delete folder (cascades to items due to onDelete: SetNull, but items remain orphaned)
    // Actually need to delete items first
    await database.mediaItem.deleteMany({
      where: { folderId },
    });

    await database.mediaFolder.delete({
      where: { id: folderId },
    });

    return { data: { success: true } };
  } catch (error) {
    return { error };
  }
};

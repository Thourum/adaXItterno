"use server";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";

export const listMediaFolders = async (): Promise<
  | { data: Awaited<ReturnType<typeof database.mediaFolder.findMany>> }
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
      return { data: [] };
    }

    const folders = await database.mediaFolder.findMany({
      where: { userId: profile.id },
      include: {
        _count: { select: { items: true } },
        accessList: { include: { contact: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return { data: folders };
  } catch (error) {
    return { error };
  }
};

export const listMediaItems = async (
  folderId?: string
): Promise<
  | { data: Awaited<ReturnType<typeof database.mediaItem.findMany>> }
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
      return { data: [] };
    }

    const items = await database.mediaItem.findMany({
      where: {
        userId: profile.id,
        ...(folderId ? { folderId } : {}),
      },
      include: {
        folder: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { data: items };
  } catch (error) {
    return { error };
  }
};

export const getMediaFolder = async (
  folderId: string
): Promise<
  | { data: Awaited<ReturnType<typeof database.mediaFolder.findUnique>> }
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

    const folder = await database.mediaFolder.findUnique({
      where: { id: folderId, userId: profile.id },
      include: {
        items: true,
        accessList: { include: { contact: true } },
      },
    });

    return { data: folder };
  } catch (error) {
    return { error };
  }
};

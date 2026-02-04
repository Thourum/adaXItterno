"use server";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { put } from "@repo/storage";

type CreateMediaItemInput = {
  name: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  folderId?: string;
};

export const createMediaItem = async (
  input: CreateMediaItemInput
): Promise<
  | { data: Awaited<ReturnType<typeof database.mediaItem.create>> }
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

    // Check if account is locked
    if (profile.status === "DECEASED") {
      throw new Error("This account has been locked. No modifications allowed.");
    }
    if (profile.status === "INACTIVE") {
      throw new Error("This account has been deactivated.");
    }

    // Validate folder if provided
    if (input.folderId) {
      const folder = await database.mediaFolder.findUnique({
        where: { id: input.folderId, userId: profile.id },
      });
      if (!folder) {
        throw new Error("Folder not found");
      }
    }

    const mediaItem = await database.mediaItem.create({
      data: {
        userId: profile.id,
        name: input.name,
        fileUrl: input.fileUrl,
        fileType: input.fileType,
        fileSize: input.fileSize,
        folderId: input.folderId,
      },
    });

    return { data: mediaItem };
  } catch (error) {
    return { error };
  }
};

export const uploadMediaFile = async (
  formData: FormData
): Promise<{ data: { url: string } } | { error: unknown }> => {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if account is locked
    const profile = await database.userProfile.findUnique({
      where: { clerkUserId: userId },
    });
    if (profile?.status === "DECEASED") {
      throw new Error("This account has been locked. No modifications allowed.");
    }
    if (profile?.status === "INACTIVE") {
      throw new Error("This account has been deactivated.");
    }

    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file provided");
    }

    const blob = await put(`media/${userId}/${file.name}`, file, {
      access: "public",
    });

    return { data: { url: blob.url } };
  } catch (error) {
    return { error };
  }
};

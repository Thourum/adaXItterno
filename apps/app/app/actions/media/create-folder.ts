"use server";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";

type CreateFolderInput = {
  name: string;
  description?: string;
};

export const createMediaFolder = async (
  input: CreateFolderInput
): Promise<
  | { data: Awaited<ReturnType<typeof database.mediaFolder.create>> }
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

    const folder = await database.mediaFolder.create({
      data: {
        userId: profile.id,
        name: input.name,
        description: input.description,
      },
    });

    return { data: folder };
  } catch (error) {
    return { error };
  }
};

export const updateMediaFolder = async (
  input: { id: string; name?: string; description?: string }
): Promise<
  | { data: Awaited<ReturnType<typeof database.mediaFolder.update>> }
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

    // Check if account is locked
    if (profile.status === "DECEASED") {
      throw new Error("This account has been locked. No modifications allowed.");
    }
    if (profile.status === "INACTIVE") {
      throw new Error("This account has been deactivated.");
    }

    // Verify ownership
    const existing = await database.mediaFolder.findUnique({
      where: { id: input.id, userId: profile.id },
    });

    if (!existing) {
      throw new Error("Folder not found");
    }

    const { id, ...updateData } = input;

    const folder = await database.mediaFolder.update({
      where: { id },
      data: updateData,
    });

    return { data: folder };
  } catch (error) {
    return { error };
  }
};

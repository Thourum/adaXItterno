"use server";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { put, del } from "@repo/storage";

type UploadDocumentInput = {
  name: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  isWill?: boolean;
};

export const createDocument = async (
  input: UploadDocumentInput
): Promise<
  | { data: Awaited<ReturnType<typeof database.document.create>> }
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

    const document = await database.document.create({
      data: {
        userId: profile.id,
        name: input.name,
        description: input.description,
        fileUrl: input.fileUrl,
        fileType: input.fileType,
        fileSize: input.fileSize,
        isWill: input.isWill ?? false,
      },
    });

    return { data: document };
  } catch (error) {
    return { error };
  }
};

export const uploadDocumentFile = async (
  formData: FormData
): Promise<{ data: { url: string } } | { error: unknown }> => {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file provided");
    }

    const blob = await put(`documents/${userId}/${file.name}`, file, {
      access: "public",
    });

    return { data: { url: blob.url } };
  } catch (error) {
    return { error };
  }
};

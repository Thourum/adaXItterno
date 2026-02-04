"use server";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";

type UpdateDocumentInput = {
  id: string;
  name?: string;
  description?: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  isWill?: boolean;
};

export const updateDocument = async (
  input: UpdateDocumentInput
): Promise<
  | { data: Awaited<ReturnType<typeof database.document.update>> }
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
    const existing = await database.document.findUnique({
      where: { id: input.id, userId: profile.id },
    });

    if (!existing) {
      throw new Error("Document not found");
    }

    const { id, ...updateData } = input;

    const document = await database.document.update({
      where: { id },
      data: updateData,
    });

    return { data: document };
  } catch (error) {
    return { error };
  }
};

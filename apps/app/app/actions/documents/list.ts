"use server";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";

export const listDocuments = async (
  options?: { isWill?: boolean }
): Promise<
  | { data: Awaited<ReturnType<typeof database.document.findMany>> }
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

    const documents = await database.document.findMany({
      where: {
        userId: profile.id,
        ...(options?.isWill !== undefined ? { isWill: options.isWill } : {}),
      },
      include: {
        accessList: {
          include: { contact: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return { data: documents };
  } catch (error) {
    return { error };
  }
};

export const getDocument = async (
  documentId: string
): Promise<
  | { data: Awaited<ReturnType<typeof database.document.findUnique>> }
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

    const document = await database.document.findUnique({
      where: { id: documentId, userId: profile.id },
      include: {
        accessList: {
          include: { contact: true },
        },
      },
    });

    return { data: document };
  } catch (error) {
    return { error };
  }
};

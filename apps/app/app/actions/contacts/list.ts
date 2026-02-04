"use server";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";

export const listContacts = async (): Promise<
  | { data: Awaited<ReturnType<typeof database.trustedContact.findMany>> }
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

    const contacts = await database.trustedContact.findMany({
      where: { userId: profile.id },
      orderBy: { createdAt: "desc" },
    });

    return { data: contacts };
  } catch (error) {
    return { error };
  }
};

export const getContact = async (
  contactId: string
): Promise<
  | { data: Awaited<ReturnType<typeof database.trustedContact.findUnique>> }
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

    const contact = await database.trustedContact.findUnique({
      where: { id: contactId, userId: profile.id },
      include: {
        documentAccess: { include: { document: true } },
        mediaFolderAccess: { include: { folder: true } },
        accountAccess: { include: { account: true } },
      },
    });

    return { data: contact };
  } catch (error) {
    return { error };
  }
};

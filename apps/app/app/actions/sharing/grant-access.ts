"use server";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";

type GrantDocumentAccessInput = {
  documentId: string;
  contactIds: string[];
};

type GrantFolderAccessInput = {
  folderId: string;
  contactIds: string[];
};

type GrantAccountAccessInput = {
  accountId: string;
  contactIds: string[];
};

export const grantDocumentAccess = async (
  input: GrantDocumentAccessInput
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

    // Verify document ownership
    const document = await database.document.findUnique({
      where: { id: input.documentId, userId: profile.id },
    });

    if (!document) {
      throw new Error("Document not found");
    }

    // Verify all contacts belong to user
    const contacts = await database.trustedContact.findMany({
      where: { id: { in: input.contactIds }, userId: profile.id },
    });

    if (contacts.length !== input.contactIds.length) {
      throw new Error("One or more contacts not found");
    }

    // Create access records
    await database.documentAccess.createMany({
      data: input.contactIds.map((contactId) => ({
        documentId: input.documentId,
        contactId,
      })),
      skipDuplicates: true,
    });

    return { data: { success: true } };
  } catch (error) {
    return { error };
  }
};

export const grantFolderAccess = async (
  input: GrantFolderAccessInput
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

    // Verify folder ownership
    const folder = await database.mediaFolder.findUnique({
      where: { id: input.folderId, userId: profile.id },
    });

    if (!folder) {
      throw new Error("Folder not found");
    }

    // Verify all contacts belong to user
    const contacts = await database.trustedContact.findMany({
      where: { id: { in: input.contactIds }, userId: profile.id },
    });

    if (contacts.length !== input.contactIds.length) {
      throw new Error("One or more contacts not found");
    }

    // Create access records
    await database.mediaFolderAccess.createMany({
      data: input.contactIds.map((contactId) => ({
        folderId: input.folderId,
        contactId,
      })),
      skipDuplicates: true,
    });

    return { data: { success: true } };
  } catch (error) {
    return { error };
  }
};

export const grantAccountAccess = async (
  input: GrantAccountAccessInput
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

    // Verify account ownership
    const account = await database.digitalAccount.findUnique({
      where: { id: input.accountId, userId: profile.id },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    // Verify all contacts belong to user
    const contacts = await database.trustedContact.findMany({
      where: { id: { in: input.contactIds }, userId: profile.id },
    });

    if (contacts.length !== input.contactIds.length) {
      throw new Error("One or more contacts not found");
    }

    // Create access records
    await database.accountAccess.createMany({
      data: input.contactIds.map((contactId) => ({
        accountId: input.accountId,
        contactId,
      })),
      skipDuplicates: true,
    });

    return { data: { success: true } };
  } catch (error) {
    return { error };
  }
};

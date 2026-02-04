"use server";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";

export const revokeDocumentAccess = async (
  documentId: string,
  contactId: string
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

    // Verify document ownership
    const document = await database.document.findUnique({
      where: { id: documentId, userId: profile.id },
    });

    if (!document) {
      throw new Error("Document not found");
    }

    await database.documentAccess.delete({
      where: {
        documentId_contactId: {
          documentId,
          contactId,
        },
      },
    });

    return { data: { success: true } };
  } catch (error) {
    return { error };
  }
};

export const revokeFolderAccess = async (
  folderId: string,
  contactId: string
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

    // Verify folder ownership
    const folder = await database.mediaFolder.findUnique({
      where: { id: folderId, userId: profile.id },
    });

    if (!folder) {
      throw new Error("Folder not found");
    }

    await database.mediaFolderAccess.delete({
      where: {
        folderId_contactId: {
          folderId,
          contactId,
        },
      },
    });

    return { data: { success: true } };
  } catch (error) {
    return { error };
  }
};

export const revokeAccountAccess = async (
  accountId: string,
  contactId: string
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

    // Verify account ownership
    const account = await database.digitalAccount.findUnique({
      where: { id: accountId, userId: profile.id },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    await database.accountAccess.delete({
      where: {
        accountId_contactId: {
          accountId,
          contactId,
        },
      },
    });

    return { data: { success: true } };
  } catch (error) {
    return { error };
  }
};

export const updateDocumentSharing = async (
  documentId: string,
  contactIds: string[]
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

    // Verify document ownership
    const document = await database.document.findUnique({
      where: { id: documentId, userId: profile.id },
    });

    if (!document) {
      throw new Error("Document not found");
    }

    // Delete all existing access
    await database.documentAccess.deleteMany({
      where: { documentId },
    });

    // Create new access records
    if (contactIds.length > 0) {
      await database.documentAccess.createMany({
        data: contactIds.map((contactId) => ({
          documentId,
          contactId,
        })),
      });
    }

    return { data: { success: true } };
  } catch (error) {
    return { error };
  }
};

export const updateFolderSharing = async (
  folderId: string,
  contactIds: string[]
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

    // Verify folder ownership
    const folder = await database.mediaFolder.findUnique({
      where: { id: folderId, userId: profile.id },
    });

    if (!folder) {
      throw new Error("Folder not found");
    }

    // Delete all existing access
    await database.mediaFolderAccess.deleteMany({
      where: { folderId },
    });

    // Create new access records
    if (contactIds.length > 0) {
      await database.mediaFolderAccess.createMany({
        data: contactIds.map((contactId) => ({
          folderId,
          contactId,
        })),
      });
    }

    return { data: { success: true } };
  } catch (error) {
    return { error };
  }
};

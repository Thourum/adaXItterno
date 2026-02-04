"use server";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import type { RelationshipType, ContactRole } from "@repo/database";

type UpdateContactInput = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  relationship?: RelationshipType;
  role?: ContactRole;
};

export const updateContact = async (
  input: UpdateContactInput
): Promise<
  | { data: Awaited<ReturnType<typeof database.trustedContact.update>> }
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
    const existing = await database.trustedContact.findUnique({
      where: { id: input.id, userId: profile.id },
    });

    if (!existing) {
      throw new Error("Contact not found");
    }

    const { id, ...updateData } = input;

    const contact = await database.trustedContact.update({
      where: { id },
      data: updateData,
    });

    return { data: contact };
  } catch (error) {
    return { error };
  }
};

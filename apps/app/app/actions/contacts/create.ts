"use server";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import type { RelationshipType, ContactRole } from "@repo/database";

type CreateContactInput = {
  name: string;
  email?: string;
  phone?: string;
  relationship: RelationshipType;
  role: ContactRole;
};

export const createContact = async (
  input: CreateContactInput
): Promise<
  | { data: Awaited<ReturnType<typeof database.trustedContact.create>> }
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

    const contact = await database.trustedContact.create({
      data: {
        userId: profile.id,
        name: input.name,
        email: input.email,
        phone: input.phone,
        relationship: input.relationship,
        role: input.role,
      },
    });

    return { data: contact };
  } catch (error) {
    return { error };
  }
};

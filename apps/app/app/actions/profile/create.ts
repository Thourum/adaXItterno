"use server";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";

type CreateProfileInput = {
  fullName: string;
  dateOfBirth?: Date;
  email: string;
  phone?: string;
  countryOfResidence?: string;
};

export const createProfile = async (
  input: CreateProfileInput
): Promise<
  | { data: Awaited<ReturnType<typeof database.userProfile.create>> }
  | { error: unknown }
> => {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if profile already exists
    const existing = await database.userProfile.findUnique({
      where: { clerkUserId: userId },
    });

    if (existing) {
      throw new Error("Profile already exists");
    }

    const profile = await database.userProfile.create({
      data: {
        clerkUserId: userId,
        fullName: input.fullName,
        dateOfBirth: input.dateOfBirth,
        email: input.email,
        phone: input.phone,
        countryOfResidence: input.countryOfResidence,
        onboardingComplete: false,
      },
    });

    return { data: profile };
  } catch (error) {
    return { error };
  }
};

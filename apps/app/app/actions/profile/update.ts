"use server";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";

type UpdateProfileInput = {
  fullName?: string;
  dateOfBirth?: Date;
  email?: string;
  phone?: string;
  countryOfResidence?: string;
  onboardingComplete?: boolean;
};

export const updateProfile = async (
  input: UpdateProfileInput
): Promise<
  | { data: Awaited<ReturnType<typeof database.userProfile.update>> }
  | { error: unknown }
> => {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const profile = await database.userProfile.update({
      where: { clerkUserId: userId },
      data: input,
    });

    return { data: profile };
  } catch (error) {
    return { error };
  }
};

export const completeOnboarding = async (): Promise<
  | { data: Awaited<ReturnType<typeof database.userProfile.update>> }
  | { error: unknown }
> => {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const profile = await database.userProfile.update({
      where: { clerkUserId: userId },
      data: { onboardingComplete: true },
    });

    return { data: profile };
  } catch (error) {
    return { error };
  }
};

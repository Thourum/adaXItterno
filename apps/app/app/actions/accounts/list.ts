"use server";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import type { AccountCategory } from "@repo/database";

export const listAccounts = async (
  category?: AccountCategory
): Promise<
  | { data: Awaited<ReturnType<typeof database.digitalAccount.findMany>> }
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

    const accounts = await database.digitalAccount.findMany({
      where: {
        userId: profile.id,
        ...(category ? { category } : {}),
      },
      include: {
        accessList: {
          include: { contact: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return { data: accounts };
  } catch (error) {
    return { error };
  }
};

export const getAccount = async (
  accountId: string
): Promise<
  | { data: Awaited<ReturnType<typeof database.digitalAccount.findUnique>> }
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

    const account = await database.digitalAccount.findUnique({
      where: { id: accountId, userId: profile.id },
      include: {
        accessList: {
          include: { contact: true },
        },
      },
    });

    return { data: account };
  } catch (error) {
    return { error };
  }
};

export const getAccountStats = async (): Promise<
  | { data: Record<AccountCategory, number> }
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
      return {
        data: {
          SOCIAL_MEDIA: 0,
          EMAIL_COMMUNICATION: 0,
          FINANCIAL: 0,
          CRYPTO: 0,
          SUBSCRIPTIONS: 0,
          OTHER: 0,
        },
      };
    }

    const stats = await database.digitalAccount.groupBy({
      by: ["category"],
      where: { userId: profile.id },
      _count: true,
    });

    const result: Record<AccountCategory, number> = {
      SOCIAL_MEDIA: 0,
      EMAIL_COMMUNICATION: 0,
      FINANCIAL: 0,
      CRYPTO: 0,
      SUBSCRIPTIONS: 0,
      OTHER: 0,
    };

    for (const stat of stats) {
      result[stat.category] = stat._count;
    }

    return { data: result };
  } catch (error) {
    return { error };
  }
};

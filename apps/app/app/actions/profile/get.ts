"use server";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";

export const getProfile = async (): Promise<
  | { data: Awaited<ReturnType<typeof database.userProfile.findUnique>> }
  | { error: unknown }
> => {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const profile = await database.userProfile.findUnique({
      where: { clerkUserId: userId },
      include: {
        trustedContacts: true,
        _count: {
          select: {
            digitalAccounts: true,
            documents: true,
            mediaItems: true,
          },
        },
      },
    });

    return { data: profile };
  } catch (error) {
    return { error };
  }
};

export const getProfileWithStats = async (): Promise<
  | {
      data: {
        profile: Awaited<ReturnType<typeof database.userProfile.findUnique>>;
        stats: {
          totalAccounts: number;
          totalDocuments: number;
          totalMedia: number;
          totalContacts: number;
          accountsByCategory: Record<string, number>;
        };
      };
    }
  | { error: unknown }
> => {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const profile = await database.userProfile.findUnique({
      where: { clerkUserId: userId },
      include: {
        trustedContacts: true,
      },
    });

    if (!profile) {
      return {
        data: {
          profile: null,
          stats: {
            totalAccounts: 0,
            totalDocuments: 0,
            totalMedia: 0,
            totalContacts: 0,
            accountsByCategory: {},
          },
        },
      };
    }

    const [accountsCount, documentsCount, mediaCount, accountsByCategory] =
      await Promise.all([
        database.digitalAccount.count({ where: { userId: profile.id } }),
        database.document.count({ where: { userId: profile.id } }),
        database.mediaItem.count({ where: { userId: profile.id } }),
        database.digitalAccount.groupBy({
          by: ["category"],
          where: { userId: profile.id },
          _count: true,
        }),
      ]);

    const categoryStats = accountsByCategory.reduce(
      (acc, item) => {
        acc[item.category] = item._count;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      data: {
        profile,
        stats: {
          totalAccounts: accountsCount,
          totalDocuments: documentsCount,
          totalMedia: mediaCount,
          totalContacts: profile.trustedContacts.length,
          accountsByCategory: categoryStats,
        },
      },
    };
  } catch (error) {
    return { error };
  }
};

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header } from "./components/header";
import { DashboardContent } from "./components/dashboard-content";

const title = "Dashboard - Digital Legacy";
const description = "Manage your digital legacy";

export const metadata: Metadata = {
  title,
  description,
};

const App = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user has completed onboarding
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

  // Redirect to onboarding if no profile or onboarding incomplete
  if (!profile || !profile.onboardingComplete) {
    redirect("/onboarding");
  }

  // Get account stats by category
  const accountStats = await database.digitalAccount.groupBy({
    by: ["category"],
    where: { userId: profile.id },
    _count: true,
  });

  const categoryStats = {
    SOCIAL_MEDIA: 0,
    EMAIL_COMMUNICATION: 0,
    FINANCIAL: 0,
    CRYPTO: 0,
    SUBSCRIPTIONS: 0,
    OTHER: 0,
  };

  for (const stat of accountStats) {
    categoryStats[stat.category] = stat._count;
  }

  // Get recent documents
  const recentDocuments = await database.document.findMany({
    where: { userId: profile.id },
    take: 3,
    orderBy: { updatedAt: "desc" },
  });

  // Check for will document
  const hasWill = await database.document.findFirst({
    where: { userId: profile.id, isWill: true },
  });

  return (
    <>
      <Header page="Dashboard" pages={["Home"]}>
        <span className="text-sm text-muted-foreground">
          Welcome back, {profile.fullName}
        </span>
      </Header>
      <DashboardContent
        profile={profile}
        categoryStats={categoryStats}
        recentDocuments={recentDocuments}
        hasWill={!!hasWill}
        totalContacts={profile.trustedContacts.length}
        totalAccounts={profile._count.digitalAccounts}
        totalDocuments={profile._count.documents}
        totalMedia={profile._count.mediaItems}
      />
    </>
  );
};

export default App;

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header } from "../components/header";
import { AccountsOverview } from "./components/accounts-overview";

export const metadata: Metadata = {
  title: "Digital Accounts - Digital Legacy",
  description: "Manage your digital accounts",
};

const AccountsPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await database.userProfile.findUnique({
    where: { clerkUserId: userId },
  });

  if (!profile || !profile.onboardingComplete) {
    redirect("/onboarding");
  }

  const accounts = await database.digitalAccount.findMany({
    where: { userId: profile.id },
    include: {
      accessList: { include: { contact: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const contacts = await database.trustedContact.findMany({
    where: { userId: profile.id },
  });

  const stats = await database.digitalAccount.groupBy({
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

  for (const stat of stats) {
    categoryStats[stat.category] = stat._count;
  }

  return (
    <>
      <Header page="Digital Accounts" pages={["Home", "Accounts"]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <AccountsOverview
          accounts={accounts}
          contacts={contacts}
          categoryStats={categoryStats}
        />
      </div>
    </>
  );
};

export default AccountsPage;

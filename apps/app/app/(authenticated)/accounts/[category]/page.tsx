import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { Header } from "../../components/header";
import { CategoryAccountsList } from "./components/category-accounts-list";
import type { AccountCategory } from "@repo/database";

const categoryMap: Record<string, { key: AccountCategory; title: string; description: string }> = {
  "social-media": {
    key: "SOCIAL_MEDIA",
    title: "Social Media",
    description: "Facebook, Instagram, LinkedIn, X, TikTok, and more",
  },
  "email-communication": {
    key: "EMAIL_COMMUNICATION",
    title: "Email & Communication",
    description: "Gmail, Outlook, WhatsApp, Telegram, and more",
  },
  financial: {
    key: "FINANCIAL",
    title: "Financial",
    description: "Bank accounts, PayPal, Wise, and more",
  },
  crypto: {
    key: "CRYPTO",
    title: "Crypto",
    description: "Coinbase, Binance, wallet addresses, and more",
  },
  subscriptions: {
    key: "SUBSCRIPTIONS",
    title: "Subscriptions",
    description: "Netflix, Spotify, Adobe, and more",
  },
  other: {
    key: "OTHER",
    title: "Other Accounts",
    description: "Custom entries and miscellaneous accounts",
  },
};

type PageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryInfo = categoryMap[category];

  if (!categoryInfo) {
    return { title: "Not Found" };
  }

  return {
    title: `${categoryInfo.title} - Digital Legacy`,
    description: categoryInfo.description,
  };
}

const CategoryPage = async ({ params }: PageProps) => {
  const { category } = await params;
  const categoryInfo = categoryMap[category];

  if (!categoryInfo) {
    notFound();
  }

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
    where: {
      userId: profile.id,
      category: categoryInfo.key,
    },
    include: {
      accessList: { include: { contact: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const contacts = await database.trustedContact.findMany({
    where: { userId: profile.id },
  });

  return (
    <>
      <Header
        page={categoryInfo.title}
        pages={["Home", "Accounts", categoryInfo.title]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <CategoryAccountsList
          accounts={accounts}
          contacts={contacts}
          category={categoryInfo.key}
          categoryTitle={categoryInfo.title}
          categoryDescription={categoryInfo.description}
        />
      </div>
    </>
  );
};

export default CategoryPage;

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Button } from "@repo/design-system/components/ui/button";
import { Badge } from "@repo/design-system/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/ui/tabs";
import {
  ArrowRightIcon,
  BitcoinIcon,
  CreditCardIcon,
  KeyIcon,
  MailIcon,
  PlusIcon,
  ShareIcon,
  TvIcon,
} from "lucide-react";
import type { DigitalAccount, TrustedContact, AccountCategory } from "@repo/database";
import { AccountFormDialog } from "./account-form-dialog";
import { AccountCard } from "./account-card";

type AccountWithAccess = DigitalAccount & {
  accessList: { contact: TrustedContact }[];
};

type AccountsOverviewProps = {
  accounts: AccountWithAccess[];
  contacts: TrustedContact[];
  categoryStats: Record<AccountCategory, number>;
};

const categories = [
  {
    key: "SOCIAL_MEDIA" as const,
    title: "Social Media",
    description: "Facebook, Instagram, LinkedIn, X, TikTok",
    icon: ShareIcon,
    href: "/accounts/social-media",
    color: "bg-blue-500",
  },
  {
    key: "EMAIL_COMMUNICATION" as const,
    title: "Email & Communication",
    description: "Gmail, Outlook, WhatsApp, Telegram",
    icon: MailIcon,
    href: "/accounts/email-communication",
    color: "bg-green-500",
  },
  {
    key: "FINANCIAL" as const,
    title: "Financial",
    description: "Bank accounts, PayPal, Wise",
    icon: CreditCardIcon,
    href: "/accounts/financial",
    color: "bg-yellow-500",
  },
  {
    key: "CRYPTO" as const,
    title: "Crypto",
    description: "Coinbase, Binance, wallet addresses",
    icon: BitcoinIcon,
    href: "/accounts/crypto",
    color: "bg-orange-500",
  },
  {
    key: "SUBSCRIPTIONS" as const,
    title: "Subscriptions",
    description: "Netflix, Spotify, Adobe",
    icon: TvIcon,
    href: "/accounts/subscriptions",
    color: "bg-purple-500",
  },
  {
    key: "OTHER" as const,
    title: "Other",
    description: "Custom entries",
    icon: KeyIcon,
    href: "/accounts/other",
    color: "bg-gray-500",
  },
];

export function AccountsOverview({
  accounts,
  contacts,
  categoryStats,
}: AccountsOverviewProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const recentAccounts = accounts.slice(0, 6);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Digital Accounts</h2>
          <p className="text-sm text-muted-foreground">
            Manage instructions for your online accounts
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="recent">Recent ({accounts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link key={category.key} href={category.href}>
                <Card className="transition-colors hover:bg-muted/50 h-full">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div
                      className={`rounded-lg p-2 text-white ${category.color}`}
                    >
                      <category.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">
                        {category.title}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {category.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {categoryStats[category.key]}
                      </Badge>
                      <ArrowRightIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          {recentAccounts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <KeyIcon className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No accounts yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Start by adding your first digital account
                </p>
                <Button
                  className="mt-4"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Account
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentAccounts.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  contacts={contacts}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AccountFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        contacts={contacts}
      />
    </>
  );
}

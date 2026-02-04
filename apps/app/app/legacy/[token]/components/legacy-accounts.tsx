"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Badge } from "@repo/design-system/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/ui/tabs";
import {
  BitcoinIcon,
  CreditCardIcon,
  KeyIcon,
  MailIcon,
  ShareIcon,
  TvIcon,
  MoreHorizontalIcon,
  ArrowRightLeftIcon,
  Trash2Icon,
  HeartIcon,
} from "lucide-react";
import type { DigitalAccount, AccountCategory, ActionOnDeath } from "@repo/database";

type LegacyAccountsProps = {
  accounts: DigitalAccount[];
};

const categoryConfig: Record<
  AccountCategory,
  { label: string; icon: React.ElementType }
> = {
  SOCIAL_MEDIA: { label: "Social Media", icon: ShareIcon },
  EMAIL_COMMUNICATION: { label: "Email & Communication", icon: MailIcon },
  FINANCIAL: { label: "Financial", icon: CreditCardIcon },
  CRYPTO: { label: "Crypto", icon: BitcoinIcon },
  SUBSCRIPTIONS: { label: "Subscriptions", icon: TvIcon },
  OTHER: { label: "Other", icon: MoreHorizontalIcon },
};

const actionConfig: Record<
  ActionOnDeath,
  { label: string; icon: React.ElementType; variant: "default" | "destructive" | "secondary" }
> = {
  DELETE: { label: "Delete", icon: Trash2Icon, variant: "destructive" },
  TRANSFER: { label: "Transfer", icon: ArrowRightLeftIcon, variant: "default" },
  MEMORIALIZE: { label: "Memorialize", icon: HeartIcon, variant: "secondary" },
};

export function LegacyAccounts({ accounts }: LegacyAccountsProps) {
  if (accounts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <KeyIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">
            No digital accounts have been shared with you.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group accounts by category
  const accountsByCategory = accounts.reduce(
    (acc, account) => {
      const category = account.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(account);
      return acc;
    },
    {} as Record<AccountCategory, DigitalAccount[]>
  );

  const categories = Object.keys(accountsByCategory) as AccountCategory[];

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100">
            Digital Account Instructions
          </CardTitle>
          <CardDescription className="text-blue-800 dark:text-blue-200">
            Below are the digital accounts and the instructions left for each
            one. Follow the specified action (Delete, Transfer, or Memorialize)
            for each account.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="flex-wrap h-auto gap-1">
          {categories.map((category) => {
            const config = categoryConfig[category];
            const CategoryIcon = config.icon;
            return (
              <TabsTrigger
                key={category}
                value={category}
                className="flex items-center gap-1"
              >
                <CategoryIcon className="h-4 w-4" />
                {config.label} ({accountsByCategory[category].length})
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accountsByCategory[category].map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function AccountCard({ account }: { account: DigitalAccount }) {
  const categoryConfig2 = categoryConfig[account.category];
  const actionCfg = actionConfig[account.actionOnDeath];
  const CategoryIcon = categoryConfig2.icon;
  const ActionIcon = actionCfg.icon;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            {account.platformIcon ? (
              <img
                src={account.platformIcon}
                alt=""
                className="h-6 w-6"
              />
            ) : (
              <CategoryIcon className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base truncate">
              {account.platformName}
            </CardTitle>
            {account.username && (
              <p className="text-xs text-muted-foreground truncate">
                @{account.username}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {account.email && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Email:</span> {account.email}
          </p>
        )}

        <div className="flex items-center gap-2">
          <Badge variant={actionCfg.variant} className="flex items-center gap-1">
            <ActionIcon className="h-3 w-3" />
            {actionCfg.label}
          </Badge>
        </div>

        {account.notes && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Instructions:
            </p>
            <p className="text-sm bg-muted p-2 rounded">{account.notes}</p>
          </div>
        )}

        <div className="pt-2 border-t text-xs text-muted-foreground">
          Last updated {new Date(account.updatedAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

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
  AlertTriangleIcon,
  ArrowRightIcon,
  BitcoinIcon,
  CreditCardIcon,
  FileTextIcon,
  ImageIcon,
  KeyIcon,
  MailIcon,
  PlusIcon,
  ShareIcon,
  TvIcon,
  UsersIcon,
} from "lucide-react";

type CategoryStats = {
  SOCIAL_MEDIA: number;
  EMAIL_COMMUNICATION: number;
  FINANCIAL: number;
  CRYPTO: number;
  SUBSCRIPTIONS: number;
  OTHER: number;
};

type Document = {
  id: string;
  name: string;
  isWill: boolean;
  updatedAt: Date;
};

type DashboardContentProps = {
  profile: {
    fullName: string;
  };
  categoryStats: CategoryStats;
  recentDocuments: Document[];
  hasWill: boolean;
  totalContacts: number;
  totalAccounts: number;
  totalDocuments: number;
  totalMedia: number;
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

export function DashboardContent({
  categoryStats,
  recentDocuments,
  hasWill,
  totalContacts,
  totalAccounts,
  totalDocuments,
  totalMedia,
}: DashboardContentProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Digital Accounts
            </CardTitle>
            <KeyIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAccounts}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDocuments}</div>
            <p className="text-xs text-muted-foreground">
              {hasWill ? "Including your will" : "No will uploaded yet"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Media Files</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMedia}</div>
            <p className="text-xs text-muted-foreground">Photos and videos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Trusted Contacts
            </CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContacts}</div>
            <p className="text-xs text-muted-foreground">
              People with access
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Important Notice */}
      {!hasWill && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <AlertTriangleIcon className="h-5 w-5" />
              Important: No Will Uploaded
            </CardTitle>
            <CardDescription className="text-amber-700 dark:text-amber-300">
              Consider uploading your legal will to ensure your wishes are
              clearly documented. This document will be marked with special
              visibility for your executors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="border-amber-500">
              <Link href="/documents">
                <PlusIcon className="mr-2 h-4 w-4" />
                Upload Will
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Service Categories */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Service Categories</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/accounts">
              View All
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.key} href={category.href}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className={`rounded-lg p-2 text-white ${category.color}`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{category.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {category.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {categoryStats[category.key]}
                  </Badge>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Documents */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Documents</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/documents">
                  View All
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentDocuments.length === 0 ? (
              <div className="text-center py-6">
                <FileTextIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No documents yet
                </p>
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link href="/documents">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Upload Document
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileTextIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Updated {new Date(doc.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {doc.isWill && (
                      <Badge variant="destructive">Will</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to manage your digital legacy
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/accounts">
                <PlusIcon className="mr-2 h-4 w-4" />
                Add New Account
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/documents">
                <FileTextIcon className="mr-2 h-4 w-4" />
                Upload Document
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/media">
                <ImageIcon className="mr-2 h-4 w-4" />
                Add Photos/Videos
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/contacts">
                <UsersIcon className="mr-2 h-4 w-4" />
                Manage Contacts
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

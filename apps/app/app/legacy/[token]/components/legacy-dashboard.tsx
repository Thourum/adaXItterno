"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/design-system/components/ui/tabs";
import {
  FileTextIcon,
  ImageIcon,
  KeyIcon,
  ShieldIcon,
  HeartIcon,
  UserIcon,
} from "lucide-react";
import type {
  TrustedContact,
  UserProfile,
  Document,
  MediaFolder,
  MediaItem,
  DigitalAccount,
} from "@repo/database";
import { LegacyDocuments } from "./legacy-documents";
import { LegacyMedia } from "./legacy-media";
import { LegacyAccounts } from "./legacy-accounts";

type LegacyDashboardProps = {
  contact: TrustedContact & { user: UserProfile };
  deceasedUser: UserProfile;
  isExecutor: boolean;
  documents: Document[];
  mediaFolders: (MediaFolder & { items: MediaItem[] })[];
  accounts: DigitalAccount[];
  unorganizedMedia: MediaItem[];
};

export function LegacyDashboard({
  contact,
  deceasedUser,
  isExecutor,
  documents,
  mediaFolders,
  accounts,
  unorganizedMedia,
}: LegacyDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const willDocument = documents.find((d) => d.isWill);
  const otherDocuments = documents.filter((d) => !d.isWill);
  const totalMediaItems =
    mediaFolders.reduce((acc, folder) => acc + folder.items.length, 0) +
    unorganizedMedia.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <HeartIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {deceasedUser.fullName}&apos;s Digital Legacy
                </h1>
                <p className="text-sm text-muted-foreground">
                  Passed on{" "}
                  {deceasedUser.deceasedAt
                    ? new Date(deceasedUser.deceasedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "Unknown date"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={isExecutor ? "default" : "secondary"}
                className="flex items-center gap-1"
              >
                {isExecutor ? (
                  <>
                    <ShieldIcon className="h-3 w-3" />
                    Executor
                  </>
                ) : (
                  <>
                    <UserIcon className="h-3 w-3" />
                    Recipient
                  </>
                )}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Welcome, {contact.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">
              Documents ({documents.length})
            </TabsTrigger>
            <TabsTrigger value="media">
              Media ({totalMediaItems})
            </TabsTrigger>
            <TabsTrigger value="accounts">
              Accounts ({accounts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Important Notice */}
            <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
              <CardHeader>
                <CardTitle className="text-amber-900 dark:text-amber-100">
                  {isExecutor
                    ? "You are the Executor"
                    : "You are a Recipient"}
                </CardTitle>
                <CardDescription className="text-amber-800 dark:text-amber-200">
                  {isExecutor
                    ? `As the executor, you have access to all of ${deceasedUser.fullName}'s digital legacy. This includes all documents, photos, videos, and account information. You are responsible for carrying out their wishes.`
                    : `${deceasedUser.fullName} has specifically shared certain items with you. You can view these items below, but you cannot make any changes.`}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Will Document - Highlighted */}
            {willDocument && (
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileTextIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Legal Will</CardTitle>
                      <CardDescription>
                        Important document - Please review
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <a
                    href={willDocument.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <FileTextIcon className="h-4 w-4" />
                    View {willDocument.name}
                  </a>
                  {willDocument.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {willDocument.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Documents
                  </CardTitle>
                  <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{documents.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {willDocument ? "Including legal will" : "No will uploaded"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Photos & Videos
                  </CardTitle>
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalMediaItems}</div>
                  <p className="text-xs text-muted-foreground">
                    In {mediaFolders.length} folder
                    {mediaFolders.length !== 1 ? "s" : ""}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Digital Accounts
                  </CardTitle>
                  <KeyIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{accounts.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Across various platforms
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Access */}
            {!isExecutor && (
              <Card>
                <CardHeader>
                  <CardTitle>Items Shared With You</CardTitle>
                  <CardDescription>
                    {deceasedUser.fullName} specifically chose to share these
                    items with you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {documents.length === 0 &&
                      totalMediaItems === 0 &&
                      accounts.length === 0 && (
                        <p className="text-muted-foreground text-center py-8">
                          No items have been shared with you yet.
                        </p>
                      )}
                    {documents.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveTab("documents")}
                        className="w-full text-left p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileTextIcon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              {documents.length} Document
                              {documents.length !== 1 ? "s" : ""}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Click to view
                            </p>
                          </div>
                        </div>
                      </button>
                    )}
                    {totalMediaItems > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveTab("media")}
                        className="w-full text-left p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              {totalMediaItems} Media Item
                              {totalMediaItems !== 1 ? "s" : ""}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Click to view
                            </p>
                          </div>
                        </div>
                      </button>
                    )}
                    {accounts.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveTab("accounts")}
                        className="w-full text-left p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <KeyIcon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              {accounts.length} Account
                              {accounts.length !== 1 ? "s" : ""}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Click to view
                            </p>
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="documents">
            <LegacyDocuments documents={documents} />
          </TabsContent>

          <TabsContent value="media">
            <LegacyMedia
              folders={mediaFolders}
              unorganizedMedia={unorganizedMedia}
              isExecutor={isExecutor}
            />
          </TabsContent>

          <TabsContent value="accounts">
            <LegacyAccounts accounts={accounts} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          <p>
            This is a read-only view. No changes can be made to this digital
            legacy.
          </p>
        </div>
      </footer>
    </div>
  );
}

import { database } from "@repo/database";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegacyDashboard } from "./components/legacy-dashboard";

export const metadata: Metadata = {
  title: "Legacy Access - Afterly",
  description: "Access shared digital legacy",
};

type LegacyPageProps = {
  params: Promise<{ token: string }>;
};

const LegacyPage = async ({ params }: LegacyPageProps) => {
  const { token } = await params;

  // Validate the token
  const accessToken = await database.legacyAccessToken.findUnique({
    where: { token },
    include: {
      contact: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!accessToken) {
    notFound();
  }

  // Check if token has expired
  if (accessToken.expiresAt && accessToken.expiresAt < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Access Link Expired
          </h1>
          <p className="text-muted-foreground">
            This access link has expired. Please contact the executor for a new
            link.
          </p>
        </div>
      </div>
    );
  }

  // Update last used timestamp
  await database.legacyAccessToken.update({
    where: { id: accessToken.id },
    data: { lastUsedAt: new Date() },
  });

  const contact = accessToken.contact;
  const deceasedUser = contact.user;

  // Verify user is actually deceased
  if (deceasedUser.status !== "DECEASED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Access Not Available
          </h1>
          <p className="text-muted-foreground">
            This digital legacy is not currently accessible.
          </p>
        </div>
      </div>
    );
  }

  // Fetch data based on role
  const isExecutor = contact.role === "EXECUTOR";

  // For EXECUTOR: Get ALL data
  // For RECIPIENT: Get only explicitly shared data
  let documents;
  let mediaFolders;
  let accounts;

  if (isExecutor) {
    // Executors see everything
    documents = await database.document.findMany({
      where: { userId: deceasedUser.id },
      orderBy: [{ isWill: "desc" }, { updatedAt: "desc" }],
    });

    mediaFolders = await database.mediaFolder.findMany({
      where: { userId: deceasedUser.id },
      include: {
        items: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    accounts = await database.digitalAccount.findMany({
      where: { userId: deceasedUser.id },
      orderBy: [{ category: "asc" }, { platformName: "asc" }],
    });
  } else {
    // Recipients only see explicitly shared items
    const documentAccess = await database.documentAccess.findMany({
      where: { contactId: contact.id },
      include: { document: true },
    });
    documents = documentAccess.map((da) => da.document);

    const folderAccess = await database.mediaFolderAccess.findMany({
      where: { contactId: contact.id },
      include: {
        folder: {
          include: { items: true },
        },
      },
    });
    mediaFolders = folderAccess.map((fa) => fa.folder);

    const accountAccess = await database.accountAccess.findMany({
      where: { contactId: contact.id },
      include: { account: true },
    });
    accounts = accountAccess.map((aa) => aa.account);
  }

  // Get unorganized media items for executor
  let unorganizedMedia: Awaited<ReturnType<typeof database.mediaItem.findMany>> = [];
  if (isExecutor) {
    unorganizedMedia = await database.mediaItem.findMany({
      where: {
        userId: deceasedUser.id,
        folderId: null,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <LegacyDashboard
      contact={contact}
      deceasedUser={deceasedUser}
      isExecutor={isExecutor}
      documents={documents}
      mediaFolders={mediaFolders}
      accounts={accounts}
      unorganizedMedia={unorganizedMedia}
    />
  );
};

export default LegacyPage;

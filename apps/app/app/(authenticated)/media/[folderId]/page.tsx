import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { Header } from "../../components/header";
import { FolderContents } from "./components/folder-contents";

type PageProps = {
  params: Promise<{ folderId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { folderId } = await params;

  const folder = await database.mediaFolder.findUnique({
    where: { id: folderId },
  });

  if (!folder) {
    return { title: "Folder Not Found" };
  }

  return {
    title: `${folder.name} - Digital Legacy`,
    description: folder.description || "View folder contents",
  };
}

const FolderPage = async ({ params }: PageProps) => {
  const { folderId } = await params;
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

  const folder = await database.mediaFolder.findUnique({
    where: { id: folderId, userId: profile.id },
    include: {
      items: { orderBy: { createdAt: "desc" } },
      accessList: { include: { contact: true } },
    },
  });

  if (!folder) {
    notFound();
  }

  const contacts = await database.trustedContact.findMany({
    where: { userId: profile.id },
  });

  return (
    <>
      <Header
        page={folder.name}
        pages={["Home", "Media", folder.name]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <FolderContents folder={folder} contacts={contacts} />
      </div>
    </>
  );
};

export default FolderPage;

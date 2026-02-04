import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header } from "../components/header";
import { MediaGallery } from "./components/media-gallery";

export const metadata: Metadata = {
  title: "Pictures & Videos - Digital Legacy",
  description: "Manage your photos and videos",
};

const MediaPage = async () => {
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

  const folders = await database.mediaFolder.findMany({
    where: { userId: profile.id },
    include: {
      _count: { select: { items: true } },
      accessList: { include: { contact: true } },
      items: { take: 4 },
    },
    orderBy: { updatedAt: "desc" },
  });

  const unorganizedItems = await database.mediaItem.findMany({
    where: { userId: profile.id, folderId: null },
    orderBy: { createdAt: "desc" },
  });

  const contacts = await database.trustedContact.findMany({
    where: { userId: profile.id },
  });

  return (
    <>
      <Header page="Pictures & Videos" pages={["Home", "Media"]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <MediaGallery
          folders={folders}
          unorganizedItems={unorganizedItems}
          contacts={contacts}
        />
      </div>
    </>
  );
};

export default MediaPage;

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header } from "../components/header";
import { DocumentsList } from "./components/documents-list";

export const metadata: Metadata = {
  title: "Documents - Digital Legacy",
  description: "Manage your important documents",
};

const DocumentsPage = async () => {
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

  const documents = await database.document.findMany({
    where: { userId: profile.id },
    include: {
      accessList: { include: { contact: true } },
    },
    orderBy: [{ isWill: "desc" }, { updatedAt: "desc" }],
  });

  const contacts = await database.trustedContact.findMany({
    where: { userId: profile.id },
  });

  return (
    <>
      <Header page="Documents" pages={["Home", "Documents"]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DocumentsList documents={documents} contacts={contacts} />
      </div>
    </>
  );
};

export default DocumentsPage;

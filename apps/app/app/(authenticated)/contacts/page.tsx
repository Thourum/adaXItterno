import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header } from "../components/header";
import { ContactsList } from "./components/contacts-list";

export const metadata: Metadata = {
  title: "Trusted Contacts - Digital Legacy",
  description: "Manage your trusted contacts",
};

const ContactsPage = async () => {
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

  const contacts = await database.trustedContact.findMany({
    where: { userId: profile.id },
    include: {
      _count: {
        select: {
          documentAccess: true,
          mediaFolderAccess: true,
          accountAccess: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Header page="Trusted Contacts" pages={["Home", "Contacts"]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <ContactsList contacts={contacts} />
      </div>
    </>
  );
};

export default ContactsPage;

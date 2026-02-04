import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { OnboardingWizard } from "./components/onboarding-wizard";

export const metadata: Metadata = {
  title: "Welcome - Digital Legacy",
  description: "Set up your digital legacy account",
};

const OnboardingPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user already has a profile
  const profile = await database.userProfile.findUnique({
    where: { clerkUserId: userId },
    include: { trustedContacts: true },
  });

  // If onboarding is complete, redirect to dashboard
  if (profile?.onboardingComplete) {
    redirect("/");
  }

  // Determine current step based on profile state
  let initialStep = 1;
  if (profile) {
    initialStep = profile.trustedContacts.length > 0 ? 3 : 2;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <OnboardingWizard
          initialStep={initialStep}
          hasProfile={!!profile}
          hasContacts={profile ? profile.trustedContacts.length > 0 : false}
        />
      </div>
    </div>
  );
};

export default OnboardingPage;

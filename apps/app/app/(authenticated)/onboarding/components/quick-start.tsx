"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/design-system/components/ui/button";
import { completeOnboarding } from "@/app/actions/profile/update";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  FileTextIcon,
  ImageIcon,
  KeyIcon,
  Loader2Icon,
} from "lucide-react";
import Link from "next/link";

type QuickStartProps = {
  onBack: () => void;
};

const quickActions = [
  {
    title: "Add your first account",
    description: "Start by adding a social media or email account",
    icon: KeyIcon,
    href: "/accounts",
    color: "text-blue-500",
  },
  {
    title: "Upload a document",
    description: "Upload important documents like your will or insurance",
    icon: FileTextIcon,
    href: "/documents",
    color: "text-green-500",
  },
  {
    title: "Add photos or videos",
    description: "Preserve memories for your loved ones",
    icon: ImageIcon,
    href: "/media",
    color: "text-purple-500",
  },
];

export function QuickStart({ onBack }: QuickStartProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const hasCompletedOnboarding = useRef(false);

  // Automatically mark onboarding as complete when reaching step 3
  // This allows users to navigate to quick action links without being redirected back
  useEffect(() => {
    const markOnboardingComplete = async () => {
      if (hasCompletedOnboarding.current) return;
      hasCompletedOnboarding.current = true;

      const result = await completeOnboarding();
      if ("error" in result) {
        console.error("Failed to complete onboarding:", result.error);
      }
    };

    markOnboardingComplete();
  }, []);

  const handleGoToDashboard = async () => {
    setIsLoading(true);
    router.push("/");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle2Icon className="mx-auto h-16 w-16 text-green-500" />
        <h3 className="mt-4 text-xl font-semibold">You&apos;re all set!</h3>
        <p className="mt-2 text-muted-foreground">
          Your digital legacy account is ready. Here are some things you can do
          next:
        </p>
      </div>

      <div className="grid gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted"
          >
            <div className={`rounded-full bg-muted p-3 ${action.color}`}>
              <action.icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{action.title}</h4>
              <p className="text-sm text-muted-foreground">
                {action.description}
              </p>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-muted-foreground" />
          </Link>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleGoToDashboard} disabled={isLoading}>
          {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}

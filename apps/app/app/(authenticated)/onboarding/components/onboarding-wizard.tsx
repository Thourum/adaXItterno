"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Progress } from "@repo/design-system/components/ui/progress";
import { BasicInfoForm } from "./basic-info-form";
import { ContactsForm } from "./contacts-form";
import { QuickStart } from "./quick-start";

type OnboardingWizardProps = {
  initialStep: number;
  hasProfile: boolean;
  hasContacts: boolean;
};

const steps = [
  { title: "Basic Information", description: "Tell us about yourself" },
  { title: "Trusted Contacts", description: "Add someone you trust" },
  { title: "Quick Start", description: "Get started with your legacy" },
];

export function OnboardingWizard({
  initialStep,
  hasProfile,
  hasContacts,
}: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome to Digital Legacy</CardTitle>
        <CardDescription>
          Let&apos;s set up your account in a few simple steps
        </CardDescription>
        <div className="pt-4">
          <Progress value={progress} className="h-2" />
          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
            {steps.map((step, index) => (
              <span
                key={step.title}
                className={
                  index + 1 <= currentStep ? "text-primary font-medium" : ""
                }
              >
                {index + 1}. {step.title}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {currentStep === 1 && (
          <BasicInfoForm onNext={handleNext} hasProfile={hasProfile} />
        )}
        {currentStep === 2 && (
          <ContactsForm
            onNext={handleNext}
            onBack={handleBack}
            hasContacts={hasContacts}
          />
        )}
        {currentStep === 3 && <QuickStart onBack={handleBack} />}
      </CardContent>
    </Card>
  );
}

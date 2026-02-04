import type { Dictionary } from "@repo/internationalization";
import { FileText, ShieldCheck, Share2 } from "lucide-react";
import { mediaPath, MEDIA } from "../lib/media";

type HowItWorksProps = {
  dictionary: Dictionary;
};

const STEPS = [
  {
    number: "01",
    icon: FileText,
    title: "Document Your Digital Life",
    description:
      "Easily list your important accounts, digital assets, and final wishes in our guided interface.",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Secure Your Plan",
    description:
      "We use bank-level encryption (AES-256) to ensure your data is completely safe and private.",
  },
  {
    number: "03",
    icon: Share2,
    title: "Share Your Legacy",
    description:
      "Designate trusted contacts who will receive access to specific parts of your plan only when the time comes.",
  },
];

export const HowItWorks = ({ dictionary }: HowItWorksProps) => {
  const sectionTag =
    dictionary.web.home.howItWorks?.sectionTag ?? "How It Works";
  const title =
    dictionary.web.home.howItWorks?.sectionTitle ??
    "Simple, Secure, and Supportive";

  return (
    <section
      id="how-it-works"
      className="bg-[var(--afterly-bg-sand)] py-16 text-center md:py-24"
    >
      <div className="container mx-auto px-6 md:px-10">
        <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
          {sectionTag}
        </span>
        <h2 className="mb-12 text-3xl font-semibold text-[var(--afterly-text-dark)] md:text-4xl lg:text-5xl">
          {title}
        </h2>
        <div className="mx-auto mb-12 max-w-4xl overflow-hidden rounded-[var(--afterly-radius-card)] shadow-[var(--afterly-shadow)] md:mb-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaPath(MEDIA.howItWorks)}
            alt=""
            className="h-auto w-full object-cover"
          />
        </div>
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3 md:gap-10">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="relative rounded-[var(--afterly-radius-card)] bg-white p-8 text-left shadow-sm transition hover:-translate-y-2 hover:shadow-[var(--afterly-shadow)] md:p-10"
            >
              <span
                className="absolute right-6 top-6 text-5xl font-bold leading-none text-[var(--primary)]/20 lg:text-6xl"
                aria-hidden
              >
                {step.number}
              </span>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--afterly-bg-sand)] text-[var(--primary)]">
                <step.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-[var(--afterly-text-dark)]">
                {step.title}
              </h3>
              <p className="text-base leading-relaxed text-[var(--afterly-text-gray)]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

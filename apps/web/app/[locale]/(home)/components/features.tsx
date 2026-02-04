import { Database, BookOpen, Shield, Users } from "lucide-react";
import { mediaPath, MEDIA } from "../lib/media";

const FEATURES = [
  {
    icon: Database,
    title: "Digital Asset Inventory",
    description:
      "Catalog everything from crypto wallets to photo libraries in one organized place.",
  },
  {
    icon: Shield,
    title: "Secure Vault Storage",
    description:
      "Store documents, passwords, and heartfelt letters with military-grade security.",
  },
  {
    icon: BookOpen,
    title: "Legacy Instructions",
    description:
      "Leave clear instructions for how you want your social media profiles handled.",
  },
  {
    icon: Users,
    title: "Trusted Contact Management",
    description:
      'Assign different "Deputies" for different parts of your estate easily.',
  },
];

export const Features = () => (
  <section className="relative overflow-hidden px-6 py-20 md:px-10 lg:py-28">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${mediaPath(MEDIA.featuresBg)})` }}
      aria-hidden
    />
    <div
      className="absolute inset-0 z-[1] bg-[var(--afterly-bg-warm)]/95"
      aria-hidden
    />
    <div className="container relative z-[2] mx-auto">
      <h2 className="mb-12 text-center text-3xl font-semibold text-[var(--afterly-text-dark)] md:text-4xl lg:text-5xl">
        Everything You Need
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="flex h-[320px] flex-col items-center justify-center rounded-[var(--afterly-radius-card)] border border-black/5 bg-white p-8 text-center shadow-lg"
          >
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
              <feature.icon className="h-8 w-8" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-[var(--afterly-text-dark)]">
              {feature.title}
            </h3>
            <p className="text-sm leading-relaxed text-[var(--afterly-text-gray)]">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

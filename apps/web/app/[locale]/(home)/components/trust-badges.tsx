import { CreditCard, ShieldCheck, Users, Briefcase } from "lucide-react";

const BADGES = [
  { icon: CreditCard, label: "Bank-Level Encryption" },
  { icon: ShieldCheck, label: "SOC 2 Certified" },
  { icon: Users, label: "Trusted by 50,000+ Families" },
  { icon: Briefcase, label: "Recommended by Insurance Advisors" },
];

export const TrustBadges = () => (
  <section className="border-b border-black/5 bg-white py-14">
    <div className="container mx-auto flex flex-wrap justify-center gap-10 px-6 md:gap-16 md:px-10">
      {BADGES.map((badge) => (
        <div
          key={badge.label}
          className="flex items-center gap-4 font-medium text-[var(--afterly-text-gray)]"
        >
          <span className="flex h-10 w-10 items-center justify-center text-[#81B29A]">
            <badge.icon className="h-7 w-7" />
          </span>
          {badge.label}
        </div>
      ))}
    </div>
  </section>
);

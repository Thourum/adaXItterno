import { DollarSign, Heart, Settings } from "lucide-react";

const CARDS = [
  {
    icon: DollarSign,
    title: "Revenue Opportunity",
    description:
      "Unlock new revenue streams by offering premium digital legacy services as an add-on or bundled benefit to your existing policies.",
  },
  {
    icon: Heart,
    title: "Customer Retention",
    description:
      "Deepen client relationships and increase lifetime value by addressing modern needs. Be the partner that protects their entire legacy.",
  },
  {
    icon: Settings,
    title: "Easy Integration",
    description:
      "Seamlessly connect with your existing policy management systems via our robust API. Get up and running in weeks, not months.",
  },
];

export const ValueProp = () => (
  <section className="bg-white px-6 py-20 md:px-16 lg:px-24 lg:py-28">
    <div className="container mx-auto">
      <div className="grid gap-12 md:grid-cols-3 md:gap-16">
        {CARDS.map((card) => (
          <div
            key={card.title}
            className="rounded-xl bg-[var(--afterly-bg-warm)] p-8 text-center transition hover:-translate-y-1 md:p-10"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--afterly-coral-light)] text-white">
              <card.icon className="h-9 w-9" />
            </div>
            <h3 className="mb-4 text-2xl font-bold text-[var(--afterly-text-dark)]">
              {card.title}
            </h3>
            <p className="text-base leading-relaxed text-[var(--afterly-text-gray)]">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

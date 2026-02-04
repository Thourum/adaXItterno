import { Button } from "@repo/design-system/components/ui/button";
import type { Dictionary } from "@repo/internationalization";
import { Play, MoveRight } from "lucide-react";
import Link from "next/link";
import { env } from "@/env";
import { mediaPath, MEDIA } from "../lib/media";

type HeroProps = {
  dictionary: Dictionary;
};

export const Hero = ({ dictionary }: HeroProps) => (
  <section className="relative flex min-h-[500px] items-center overflow-hidden md:min-h-[600px] lg:min-h-[800px]">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${mediaPath(MEDIA.hero)})` }}
      aria-hidden
    />
    <div
      className="absolute inset-0 z-[1]"
      style={{
        background:
          "linear-gradient(90deg, var(--afterly-bg-warm) 20%, rgba(253, 252, 248, 0.85) 45%, rgba(253, 252, 248, 0.2) 60%, transparent 100%)",
      }}
    />
    <div className="container relative z-[2] mx-auto px-6 py-16 md:px-10">
      <div className="max-w-[650px] md:ml-0 lg:ml-[80px]">
        <h1
          className="mb-6 text-4xl font-semibold leading-tight tracking-tight text-[var(--afterly-text-dark)] md:text-5xl lg:text-6xl xl:text-[68px]"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          {dictionary.web.home.hero?.headline ?? "Peace of Mind for Your Digital Legacy"}
        </h1>
        <p className="mb-10 max-w-[580px] text-lg leading-relaxed text-[var(--afterly-text-gray)] md:text-xl lg:text-2xl">
          {dictionary.web.home.hero?.subheadline ?? "Decide what happens to your digital accounts and assets. Protect your family's access to what matters most."}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button
            asChild
            className="rounded-full bg-[var(--primary)] px-8 py-6 text-base font-semibold text-white shadow-lg transition hover:bg-[var(--primary-hover)] hover:-translate-y-0.5 md:text-lg"
            size="lg"
          >
            <Link href={env.NEXT_PUBLIC_APP_URL ?? "/contact"}>
              Start Your Free Plan <MoveRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Link
            href="#how-it-works"
            className="flex items-center gap-3 font-semibold text-[var(--afterly-text-dark)] transition hover:opacity-80"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md text-[var(--primary)]">
              <Play className="h-6 w-6 fill-current" />
            </span>
            Watch How It Works (2 min)
          </Link>
        </div>
      </div>
    </div>
  </section>
);

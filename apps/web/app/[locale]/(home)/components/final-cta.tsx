import { Button } from "@repo/design-system/components/ui/button";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { mediaPath, MEDIA } from "../lib/media";

export const FinalCta = () => (
  <section className="relative flex min-h-[500px] items-center justify-center overflow-hidden py-24 text-center text-white md:min-h-[600px]">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${mediaPath(MEDIA.ctaLegacy)})` }}
      aria-hidden
    />
    <div
      className="absolute inset-0 bg-[var(--afterly-text-dark)]/60"
      aria-hidden
    />
    <div className="container relative z-[2] mx-auto max-w-3xl px-6">
      <h2 className="mb-6 text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
        Start Your Legacy Plan Today
      </h2>
      <p className="mb-10 text-xl opacity-95 md:text-2xl">
        Your family deserves clarity. Start free, no credit card required.
      </p>
      <Button
        asChild
        className="rounded-full bg-[var(--primary)] px-10 py-6 text-lg font-semibold text-white shadow-lg transition hover:bg-[var(--primary-hover)]"
      >
        <Link href="/contact">
          Get Started Free <MoveRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
    </div>
  </section>
);

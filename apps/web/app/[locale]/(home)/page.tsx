import { showBetaFeature } from "@repo/feature-flags";
import { getDictionary } from "@repo/internationalization";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { Features } from "./components/features";
import { FinalCta } from "./components/final-cta";
import { Hero } from "./components/hero";
import { HowItWorks } from "./components/how-it-works";
import { ProblemSolution } from "./components/problem-solution";
import { Testimonial } from "./components/testimonial";
import { TrustBadges } from "./components/trust-badges";
import { ValueProp } from "./components/value-prop";

type HomeProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: HomeProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return createMetadata(dictionary.web.home.meta);
};

const Home = async ({ params }: HomeProps) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const betaFeature = await showBetaFeature();

  return (
    <>
      {betaFeature && (
        <div className="w-full bg-black py-2 text-center text-white">
          Beta feature now available
        </div>
      )}
      <Hero dictionary={dictionary} />
      <ProblemSolution dictionary={dictionary} />
      <HowItWorks dictionary={dictionary} />
      <ValueProp />
      <Features />
      <Testimonial />
      <TrustBadges />
      <FinalCta />
    </>
  );
};

export default Home;

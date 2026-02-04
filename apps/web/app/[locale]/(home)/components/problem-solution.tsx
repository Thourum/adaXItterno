import type { Dictionary } from "@repo/internationalization";
import { mediaPath, MEDIA } from "../lib/media";

type ProblemSolutionProps = {
  dictionary: Dictionary;
};

export const ProblemSolution = ({ dictionary }: ProblemSolutionProps) => {
  const tag = dictionary.web.home.problemSolution?.tag ?? "The Problem";
  const title =
    dictionary.web.home.problemSolution?.title ??
    "What happens to your photos, emails, social media, and online accounts when you're gone?";
  const description =
    dictionary.web.home.problemSolution?.description ??
    "In today's digital world, our most precious memories and assets are stored online. Without a plan, they can be lost forever or locked away. Afterly helps you create a clear, secure plan, so your loved ones have the access and closure they need during difficult times.";

  return (
    <section className="bg-white px-6 py-20 md:px-16 lg:flex lg:items-center lg:gap-24 lg:px-24 lg:py-28">
      <div className="mb-10 flex-1 overflow-hidden rounded-[var(--afterly-radius-card)] shadow-[var(--afterly-shadow)] lg:mb-0 lg:h-[500px] xl:h-[600px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaPath(MEDIA.digitalAssets)}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1">
        <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
          {tag}
        </span>
        <h2 className="mb-6 text-3xl font-semibold leading-tight text-[var(--afterly-text-dark)] md:text-4xl lg:text-5xl">
          {title}
        </h2>
        <p className="text-lg leading-relaxed text-[var(--afterly-text-gray)] md:text-xl">
          {description}
        </p>
      </div>
    </section>
  );
};

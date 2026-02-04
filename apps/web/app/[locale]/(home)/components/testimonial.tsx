import { mediaPath, MEDIA } from "../lib/media";

export const Testimonial = () => (
  <section className="flex flex-col bg-white px-6 py-20 md:flex-row md:items-center md:gap-20 md:px-16 lg:gap-28 lg:px-24 lg:py-28">
    <div className="relative mb-10 md:mb-0 md:max-w-[500px]">
      <div
        className="absolute -left-5 -top-5 h-full w-full rounded-[var(--afterly-radius-card)] bg-[var(--afterly-bg-sand)]"
        aria-hidden
      />
      <div className="relative overflow-hidden rounded-[var(--afterly-radius-card)] shadow-[var(--afterly-shadow)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaPath(MEDIA.testimonial)}
          alt=""
          className="h-auto w-full object-cover"
        />
      </div>
    </div>
    <div className="flex-1">
      <div className="mb-5 text-6xl font-serif text-gray-300">&quot;</div>
      <blockquote className="mb-8 text-2xl font-semibold leading-snug text-[var(--afterly-text-dark)] md:text-3xl lg:text-4xl">
        After my father passed, we spent months trying to access his accounts. I
        don&apos;t want my family to go through that. Afterly gave me peace of
        mind.
      </blockquote>
      <div>
        <p className="text-xl font-bold text-[var(--afterly-text-dark)]">
          Jennifer M.
        </p>
        <p className="text-[var(--primary)] font-medium">
          Afterly Member since 2021
        </p>
      </div>
    </div>
  </section>
);

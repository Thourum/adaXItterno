/** Base path for images in public/media. Use with encodeURIComponent for filenames with spaces. */
export function mediaPath(filename: string): string {
  return `/media/${encodeURIComponent(filename)}`;
}

export const MEDIA = {
  hero: "Image 1 - Hero Section Peace of Mind.png",
  featuresBg: "Image 2 - Feature Section Protect What Matters.png",
  trustPartners: "Image 3 - Trust Section Insurance Partners.png",
  howItWorks: "Image 4 - How It Works Simple Steps.png",
  testimonial: "Image 5 - Testimonial Real Stories.png",
  partnerSection: "Image 6 - Insurance Partner Section.png",
  digitalAssets: "Image 7 - Digital Assets Overview.png",
  ctaLegacy: "Image 8 - CTA Start Your Legacy.png",
} as const;

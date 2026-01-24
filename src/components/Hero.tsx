/**
 * Hero Component
 * Full-screen hero section for landing pages with title, tagline, description, and CTAs
 */

interface HeroProps {
  title: string;
  tagline: string;
  description: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
}

export default function Hero({ title, tagline, description, primaryCta, secondaryCta }: HeroProps) {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-4xl">
        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-[var(--color-primary-400)] to-[var(--color-primary-600)] bg-clip-text text-transparent">
          {title}
        </h1>

        {/* Tagline */}
        <p className="text-2xl md:text-3xl text-[var(--color-neutral-300)] mb-6">{tagline}</p>

        {/* Description */}
        <p className="text-lg md:text-xl text-[var(--color-neutral-400)] mb-8 max-w-2xl mx-auto">
          {description}
        </p>

        {/* CTAs */}
        {(primaryCta || secondaryCta) && (
          <div className="flex gap-4 justify-center flex-wrap">
            {primaryCta && (
              <a
                href={primaryCta.href}
                className="px-8 py-4 bg-[var(--color-primary-500)] text-white rounded-lg hover:bg-[var(--color-primary-600)] transition-colors font-semibold text-lg"
              >
                {primaryCta.label}
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className="px-8 py-4 border-2 border-[var(--color-primary-500)] text-[var(--color-primary-500)] rounded-lg hover:bg-[var(--color-primary-500)] hover:text-white transition-colors font-semibold text-lg"
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Hero Component - Enhanced with Magical Animations
 * Full-screen hero section with:
 * - Animated gradient background
 * - Interactive particles
 * - Gradient animated text
 * - Smooth scroll indicator
 */

import type { ReactElement } from 'react';
import ParticlesBackground from './ParticlesBackground';

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

export default function Hero({
  title,
  tagline,
  description,
  primaryCta,
  secondaryCta,
}: HeroProps): ReactElement {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[var(--color-primary-900)] via-[var(--color-neutral-950)] to-[var(--color-secondary-900)] animate-gradient-shift" />

      {/* Particles Background */}
      <ParticlesBackground />

      {/* Content */}
      <div className="text-center max-w-4xl relative z-10">
        {/* Title with Animated Gradient */}
        <h1
          className="text-5xl md:text-7xl font-bold mb-4 animate-gradient-text bg-gradient-to-r from-[var(--color-primary-400)] via-[var(--color-secondary-400)] to-[var(--color-primary-600)] bg-clip-text text-transparent"
          style={{ backgroundSize: '200% auto' }}
        >
          {title}
        </h1>

        {/* Tagline with Fade-in */}
        <p
          className="text-2xl md:text-3xl text-[var(--color-neutral-300)] mb-6 animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          {tagline}
        </p>

        {/* Description with Fade-in */}
        <p
          className="text-lg md:text-xl text-[var(--color-neutral-400)] mb-8 max-w-2xl mx-auto animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          {description}
        </p>

        {/* CTAs with Enhanced Hover Effects */}
        {(primaryCta || secondaryCta) && (
          <div
            className="flex gap-4 justify-center flex-wrap animate-fade-in-up"
            style={{ animationDelay: '0.6s' }}
          >
            {primaryCta && (
              <a
                href={primaryCta.href}
                className="group relative px-8 py-4 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white rounded-lg font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[var(--color-primary-500)]/50"
              >
                <span className="relative z-10">{primaryCta.label}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-secondary-600)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className="group relative px-8 py-4 border-2 border-[var(--color-primary-500)] text-[var(--color-primary-500)] rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[var(--color-primary-500)]/30 hover:border-transparent"
              >
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  {secondaryCta.label}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Animated Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <div className="flex flex-col items-center gap-2">
          <svg
            className="w-6 h-6 text-[var(--color-primary-400)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
          <p className="text-sm text-[var(--color-neutral-400)]" style={{ opacity: 0.8 }}>
            Découvrir
          </p>
        </div>
      </div>
    </section>
  );
}

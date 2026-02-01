import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from '@tsparticles/engine';

/**
 * ParticlesBackground Component
 *
 * Animated particle system for hero background (tsParticles v3)
 * - 80 particles with connections
 * - Mouse interaction (repulse on hover)
 * - Responsive to theme (primary color)
 * - Optimized with @tsparticles/slim (25KB)
 */

interface ParticlesBackgroundProps {
  /** Particle color (hex). Defaults to primary-400 */
  color?: string;
  /** Number of particles. Defaults to 80 */
  particleCount?: number;
  /** Enable mouse interaction. Defaults to true */
  interactive?: boolean;
}

export default function ParticlesBackground({
  color = '#38bdf8',
  particleCount = 80,
  interactive = true,
}: ParticlesBackgroundProps): ReactElement | null {
  const [init, setInit] = useState(false);

  // Init particles engine once
  useEffect(() => {
    void initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = {
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: {
          enable: false,
        },
        onHover: {
          enable: interactive,
          mode: 'repulse',
        },
      },
      modes: {
        repulse: {
          distance: 120,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: color,
      },
      links: {
        color: color,
        distance: 150,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: {
          default: 'bounce',
        },
        random: false,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
        },
        value: particleCount,
      },
      opacity: {
        value: 0.4,
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  };

  if (!init) {
    return null; // Don't render until engine loaded
  }

  return <Particles id="tsparticles" options={options} className="absolute inset-0 -z-10" />;
}

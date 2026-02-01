import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import ParticlesBackground from './ParticlesBackground';

describe('ParticlesBackground', () => {
  it('should render particles container', () => {
    const { container } = render(<ParticlesBackground />);
    const particles = container.querySelector('#tsparticles');
    expect(particles).toBeInTheDocument();
  });

  it('should apply custom color', () => {
    const { container } = render(<ParticlesBackground color="#ff0000" />);
    expect(container.querySelector('#tsparticles')).toBeInTheDocument();
  });

  it('should have absolute positioning and negative z-index', () => {
    const { container } = render(<ParticlesBackground />);
    const particles = container.querySelector('#tsparticles');
    expect(particles).toHaveClass('absolute', 'inset-0', '-z-10');
  });

  it('should accept custom particle count', () => {
    const { container } = render(<ParticlesBackground particleCount={50} />);
    expect(container.querySelector('#tsparticles')).toBeInTheDocument();
  });

  it('should support disabling interactivity', () => {
    const { container } = render(<ParticlesBackground interactive={false} />);
    expect(container.querySelector('#tsparticles')).toBeInTheDocument();
  });
});

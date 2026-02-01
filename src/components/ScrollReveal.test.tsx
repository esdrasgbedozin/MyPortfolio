/**
 * ScrollReveal Component Tests
 * Phase 3: Scroll Animations
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ScrollReveal from './ScrollReveal';

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

describe('ScrollReveal', () => {
  it('should render children', () => {
    render(
      <ScrollReveal>
        <div>Test Content</div>
      </ScrollReveal>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <ScrollReveal className="custom-class">
        <div>Test</div>
      </ScrollReveal>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should have initial hidden state styles', () => {
    const { container } = render(
      <ScrollReveal>
        <div>Test</div>
      </ScrollReveal>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.opacity).toBe('0');
    expect(wrapper.style.transform).toContain('translateY');
  });

  it('should accept custom duration', () => {
    const { container } = render(
      <ScrollReveal duration={1000}>
        <div>Test</div>
      </ScrollReveal>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.transition).toContain('1000ms');
  });

  it('should accept custom delay', () => {
    const { container } = render(
      <ScrollReveal delay={500}>
        <div>Test</div>
      </ScrollReveal>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.transitionDelay).toBe('500ms');
  });

  it('should accept custom distance', () => {
    const { container } = render(
      <ScrollReveal distance={80}>
        <div>Test</div>
      </ScrollReveal>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.transform).toContain('80px');
  });
});

/**
 * TextReveal Component
 * Animates text by revealing each character with a cascading effect.
 * Uses IntersectionObserver to trigger only when visible.
 *
 * @module components/TextReveal
 */

import { useEffect, useRef, useState } from 'react';

interface TextRevealProps {
  text: string;
  /** Delay between each character in ms (default 30) */
  charDelay?: number;
  /** Initial delay before animation starts in ms (default 0) */
  startDelay?: number;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export default function TextReveal({
  text,
  charDelay = 30,
  startDelay = 0,
  className = '',
  as: Tag = 'h2',
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const chars = text.split('');

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLHeadingElement>}
      className={className}
      aria-label={text}
    >
      {chars.map((char, i) => (
        <span
          key={i}
          className={isVisible ? 'text-reveal-char' : ''}
          style={{
            animationDelay: isVisible ? `${startDelay + i * charDelay}ms` : '0ms',
            opacity: isVisible ? undefined : 0,
          }}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Tag>
  );
}

/**
 * CursorGlow Component
 * Renders a soft radial gradient glow that follows the mouse cursor.
 * Uses requestAnimationFrame for 60fps smoothness.
 * Automatically hidden on touch devices (no mouse).
 *
 * @module components/CursorGlow
 */

import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -200, y: -200 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Skip on touch-only devices
    if (typeof window === 'undefined') {
      return;
    }
    const isTouchOnly = window.matchMedia('(hover: none)').matches;
    if (isTouchOnly) {
      return;
    }

    const glow = glowRef.current;
    if (!glow) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      if (glow) {
        glow.style.transform = `translate(${posRef.current.x - 200}px, ${posRef.current.y - 200}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);
    glow.style.opacity = '1';

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="cursor-glow"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0,
        transition: 'opacity 0.5s ease',
        willChange: 'transform',
      }}
    />
  );
}

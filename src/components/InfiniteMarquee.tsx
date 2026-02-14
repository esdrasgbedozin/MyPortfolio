/**
 * InfiniteMarquee Component
 * CSS-only infinite horizontal scrolling marquee for tech logos/items.
 * Pauses on hover. Fully accessible (aria-hidden decorative).
 *
 * @module components/InfiniteMarquee
 */

interface MarqueeItem {
  label: string;
  icon?: string;
}

interface InfiniteMarqueeProps {
  items: MarqueeItem[];
  /** Speed in seconds for one full cycle (default 40s) */
  speed?: number;
  /** Reverse direction */
  reverse?: boolean;
  className?: string;
}

export default function InfiniteMarquee({
  items,
  speed = 40,
  reverse = false,
  className = '',
}: InfiniteMarqueeProps) {
  // Duplicate items to create seamless loop
  const duplicated = [...items, ...items];

  return (
    <div className={`marquee-container ${className}`} aria-hidden="true">
      <div
        className="marquee-track"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {duplicated.map((item, i) => (
          <div
            key={`${item.label}-${i}`}
            className="flex items-center gap-2 px-6 py-3 mx-2 rounded-full bg-neutral-800/60 border border-neutral-700/40 backdrop-blur-sm whitespace-nowrap select-none"
          >
            {item.icon && <span className="text-lg">{item.icon}</span>}
            <span className="text-sm font-medium text-neutral-300">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

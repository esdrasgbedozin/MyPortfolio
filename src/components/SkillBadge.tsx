/**
 * SkillBadge Component
 * Enhanced Badge with technology logos/icons
 */

import type { LucideIcon } from 'lucide-react';
import type { ReactElement } from 'react';

interface SkillBadgeProps {
  children: string;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'success';
}

const variantStyles = {
  primary: 'bg-primary-500/20 text-primary-300 border-primary-500/30',
  secondary: 'bg-neutral-700/50 text-neutral-300 border-neutral-600/50',
  success: 'bg-green-500/20 text-green-300 border-green-500/30',
};

export default function SkillBadge({
  children,
  icon: Icon,
  variant = 'primary',
}: SkillBadgeProps): ReactElement {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary-400/70 ${variantStyles[variant]}`}
    >
      {Icon && <Icon size={16} aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}

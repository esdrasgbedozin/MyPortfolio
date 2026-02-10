/**
 * SkillBadge Component
 * Enhanced Badge with technology logos/icons from react-icons
 */

import type { IconType } from 'react-icons';
import type { ReactElement } from 'react';
import { getTechIcon } from '../data/techIcons';

interface SkillBadgeProps {
  children: string;
  icon?: IconType;
  variant?: 'primary' | 'secondary' | 'success';
}

const variantStyles = {
  primary: 'bg-primary-500/20 text-primary-300 border-primary-500/30',
  secondary: 'bg-neutral-700/50 text-neutral-300 border-neutral-600/50',
  success: 'bg-green-500/20 text-green-300 border-green-500/30',
};

export default function SkillBadge({
  children,
  icon,
  variant = 'primary',
}: SkillBadgeProps): ReactElement {
  // Auto-detect icon from technology name if not provided
  const Icon = icon || getTechIcon(children);

  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary-400/70 ${variantStyles[variant]}`}
    >
      {Icon && <Icon size={20} aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}

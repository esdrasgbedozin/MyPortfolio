/**
 * Timeline Component
 * Timeline verticale avec animations au scroll
 * Phase 4: Signature Elements
 */

import ScrollReveal from './ScrollReveal';
import type { ReactElement, ReactNode } from 'react';

export interface TimelineItem {
  /**
   * Titre de l'événement
   */
  title: string;

  /**
   * Date ou période
   */
  date: string;

  /**
   * Description détaillée
   */
  description: string;

  /**
   * Icône optionnelle (React node)
   */
  icon?: ReactNode;

  /**
   * Type d'événement (affecte la couleur)
   */
  type?: 'work' | 'education' | 'achievement' | 'certification';
}

interface TimelineProps {
  /**
   * Liste des événements de la timeline
   */
  items: TimelineItem[];

  /**
   * Position de la ligne (gauche ou centre)
   * @default 'left'
   */
  linePosition?: 'left' | 'center';

  /**
   * Classes CSS additionnelles
   */
  className?: string;
}

const typeColors = {
  work: 'from-primary-500 to-primary-400',
  education: 'from-purple-500 to-purple-400',
  achievement: 'from-green-500 to-green-400',
  certification: 'from-yellow-500 to-yellow-400',
};

export default function Timeline({
  items,
  linePosition = 'left',
  className = '',
}: TimelineProps): ReactElement {
  return (
    <div className={`relative ${className}`}>
      {/* Vertical Line */}
      <div
        className={`absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-400 via-purple-500 to-transparent ${
          linePosition === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-4'
        }`}
      />

      {/* Timeline Items */}
      <div className="space-y-12">
        {items.map((item, index) => {
          const isEven = index % 2 === 0;
          const alignment = linePosition === 'center' && !isEven ? 'flex-row-reverse' : 'flex-row';

          return (
            <ScrollReveal key={index} delay={index * 100} distance={40}>
              <div
                className={`flex ${alignment} items-center gap-4 md:gap-8 ${
                  linePosition === 'center' ? '' : 'ml-8 md:ml-12'
                }`}
              >
                {/* Timeline Dot */}
                <div
                  className={`relative flex-shrink-0 ${linePosition === 'center' ? 'order-2' : ''}`}
                >
                  <div
                    className={`w-8 h-8 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${
                      typeColors[item.type ?? 'work']
                    } flex items-center justify-center shadow-lg ring-4 ring-black/20`}
                  >
                    {item.icon || <div className="w-3 h-3 rounded-full bg-white/90" />}
                  </div>

                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 blur-xl opacity-30 animate-pulse" />
                </div>

                {/* Content Card */}
                <div
                  className={`flex-1 glass-effect rounded-xl p-6 hover:border-primary-400/50 transition-all group ${
                    linePosition === 'center' && isEven ? 'text-right' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-neutral-100 group-hover:text-primary-300 transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-sm text-neutral-500 font-mono">{item.date}</span>
                  </div>
                  <p className="text-neutral-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}

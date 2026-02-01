/**
 * ProjectCard Component
 * Displays a project with title, description, technologies, status, and optional links
 * Phase 2: Enhanced with Glassmorphism + 3D Tilt effect
 */

import Tilt from 'react-parallax-tilt';
import type { ReactElement } from 'react';

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  period: string;
  status: 'production' | 'development' | 'archived' | 'prototype';
  demoUrl?: string;
  repositoryUrl?: string;
}

const statusColors = {
  production: 'bg-green-500/20 text-green-400 border-green-500/30',
  development: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  archived: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  prototype: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

export default function ProjectCard({
  title,
  description,
  technologies,
  period,
  status,
  demoUrl,
  repositoryUrl,
}: ProjectCardProps): ReactElement {
  return (
    <Tilt
      tiltMaxAngleX={8}
      tiltMaxAngleY={8}
      perspective={1000}
      scale={1.02}
      transitionSpeed={450}
      glareEnable={true}
      glareMaxOpacity={0.15}
      glareColor="#38bdf8"
      glarePosition="all"
      className="w-full"
    >
      <article className="glass-effect card-elevated group relative overflow-hidden rounded-xl p-6 h-full transition-all duration-300 border border-white/10 hover:border-primary-400/50">
        {/* Gradient Border Animation (hidden, appears on hover) */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-xl p-[1px] bg-gradient-to-r from-primary-400 via-purple-500 to-primary-400 bg-[length:200%_100%] animate-[gradientShift_3s_linear_infinite]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-[var(--color-neutral-100)] group-hover:text-primary-300 transition-colors">
              {title}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status]}`}
            >
              {status}
            </span>
          </div>

          {/* Description */}
          <p className="text-[var(--color-neutral-400)] mb-4 leading-relaxed">{description}</p>

          {/* Technologies */}
          {technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  data-testid="tech-badge"
                  className="px-3 py-1 bg-neutral-800/50 backdrop-blur-sm text-[var(--color-neutral-300)] rounded-md text-sm border border-neutral-700/50 hover:border-primary-400/50 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
            <span className="text-sm text-[var(--color-neutral-500)]">{period}</span>

            {/* Links */}
            {(demoUrl || repositoryUrl) && (
              <div className="flex gap-3">
                {demoUrl && (
                  <a
                    href={demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--color-primary-500)] hover:text-[var(--color-primary-400)] transition-all hover:translate-x-1"
                  >
                    Demo →
                  </a>
                )}
                {repositoryUrl && (
                  <a
                    href={repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--color-primary-500)] hover:text-[var(--color-primary-400)] transition-all hover:translate-x-1"
                  >
                    Code →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </article>
    </Tilt>
  );
}

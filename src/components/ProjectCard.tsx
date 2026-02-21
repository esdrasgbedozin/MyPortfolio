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
      tiltMaxAngleX={6}
      tiltMaxAngleY={6}
      perspective={1200}
      scale={1.02}
      transitionSpeed={500}
      glareEnable={true}
      glareMaxOpacity={0.08}
      glareColor="#94a3b8"
      glarePosition="all"
      className="w-full h-full"
    >
      <article className="glass-effect card-elevated group relative overflow-hidden rounded-xl p-6 h-full transition-all duration-500 border border-[var(--color-neutral-50)]/10 hover:border-neutral-400/25 hover:shadow-lg hover:shadow-primary-400/5">
        {/* Subtle glow on hover */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-primary-400/5 via-transparent to-purple-500/5" />

        {/* Content Container — flex column for uniform height */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-[var(--color-neutral-50)] group-hover:text-neutral-50 transition-colors duration-300">
              {title}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border shrink-0 ml-3 ${statusColors[status]}`}
            >
              {status}
            </span>
          </div>

          {/* Description */}
          <p className="text-neutral-300 mb-4 leading-relaxed">{description}</p>

          {/* Technologies */}
          {technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  data-testid="tech-badge"
                  className="px-3 py-1 bg-neutral-800/50 backdrop-blur-sm text-neutral-300 rounded-md text-sm border border-neutral-700/50 group-hover:border-neutral-600/50 transition-colors duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Footer — pushed to bottom */}
          <div className="flex justify-between items-center mt-auto pt-4 border-t border-[var(--color-neutral-50)]/10">
            <span className="text-sm text-neutral-400">{period}</span>

            {/* Links */}
            {(demoUrl || repositoryUrl) && (
              <div className="flex gap-3">
                {demoUrl && (
                  <a
                    href={demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-400 hover:text-primary-300 transition-all duration-300 hover:translate-x-1 font-medium"
                  >
                    Demo →
                  </a>
                )}
                {repositoryUrl && (
                  <a
                    href={repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-400 hover:text-primary-300 transition-all duration-300 hover:translate-x-1 font-medium"
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

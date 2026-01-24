/**
 * ProjectCard Component
 * Displays a project with title, description, technologies, status, and optional links
 */

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
}: ProjectCardProps) {
  return (
    <article className="bg-[var(--color-neutral-900)] border border-[var(--color-neutral-800)] rounded-lg p-6 hover:border-[var(--color-primary-500)] transition-colors hover:shadow-lg hover:shadow-[var(--color-primary-500)]/10">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-[var(--color-neutral-100)]">{title}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status]}`}
        >
          {status}
        </span>
      </div>

      {/* Description */}
      <p className="text-[var(--color-neutral-400)] mb-4">{description}</p>

      {/* Technologies */}
      {technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech) => (
            <span
              key={tech}
              data-testid="tech-badge"
              className="px-3 py-1 bg-[var(--color-neutral-800)] text-[var(--color-neutral-300)] rounded-md text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-[var(--color-neutral-800)]">
        <span className="text-sm text-[var(--color-neutral-500)]">{period}</span>

        {/* Links */}
        {(demoUrl || repositoryUrl) && (
          <div className="flex gap-3">
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--color-primary-500)] hover:text-[var(--color-primary-400)] transition-colors"
              >
                Demo →
              </a>
            )}
            {repositoryUrl && (
              <a
                href={repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--color-primary-500)] hover:text-[var(--color-primary-400)] transition-colors"
              >
                Code →
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

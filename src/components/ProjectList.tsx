/**
 * ProjectList Component - Epic 5.2 (FE-072)
 *
 * Container React Island qui gère :
 * - State des filtres actifs
 * - Filtrage dynamique des projets
 * - Rendu de ProjectFilter + ProjectCards
 *
 * @module components/ProjectList
 */

import { useState, useMemo } from 'react';
import { ProjectFilter, type FilterValue } from './ProjectFilter';
import ProjectCard from './ProjectCard';

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  category: string;
  period: string;
  status: 'production' | 'development' | 'archived' | 'prototype';
  demoUrl?: string;
  repositoryUrl?: string;
}

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const [activeFilter, setActiveFilter] = useState<FilterValue | null>(null);

  // Extract unique technologies and categories from projects
  const technologies = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach((project) => {
      project.technologies.forEach((tech) => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, [projects]);

  const categories = useMemo(() => {
    const catSet = new Set<string>();
    projects.forEach((project) => {
      catSet.add(project.category);
    });
    return Array.from(catSet).sort();
  }, [projects]);

  // Filter projects based on active filter
  const filteredProjects = useMemo(() => {
    if (!activeFilter) {
      return projects;
    }

    return projects.filter((project) => {
      if (activeFilter.type === 'technology') {
        return project.technologies.includes(activeFilter.value);
      }
      if (activeFilter.type === 'category') {
        return project.category === activeFilter.value;
      }
      return true;
    });
  }, [projects, activeFilter]);

  const handleFilterChange = (filter: FilterValue | null) => {
    setActiveFilter(filter);
  };

  return (
    <div className="project-list">
      {/* Filter Component */}
      <ProjectFilter
        technologies={technologies}
        categories={categories}
        onFilterChange={handleFilterChange}
      />

      {/* Results Count */}
      <div className="mb-6 text-[var(--color-neutral-400)]">
        {filteredProjects.length === projects.length ? (
          <p>Showing all {projects.length} projects</p>
        ) : (
          <p>
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
        )}
      </div>

      {/* Project Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <ProjectCard
              key={`${project.title}-${index}`}
              title={project.title}
              description={project.description}
              technologies={project.technologies}
              period={project.period}
              status={project.status}
              demoUrl={project.demoUrl}
              repositoryUrl={project.repositoryUrl}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-[var(--color-neutral-400)]">
            <p className="text-lg">No projects found with the selected filter.</p>
            <button
              onClick={() => handleFilterChange(null)}
              className="mt-4 px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-lg hover:bg-[var(--color-primary-600)] transition-colors"
              type="button"
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

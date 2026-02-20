/**
 * ProjectFilter Component - Epic 5.2 (FE-071)
 *
 * React Island pour filtrer les projets par technologie ou catégorie.
 * - Boutons All / Technologies / Categories
 * - Un seul filtre actif à la fois
 * - Callback onFilterChange pour notifier le parent
 *
 * @module components/ProjectFilter
 */

import { useState } from 'react';

export interface FilterValue {
  type: 'technology' | 'category';
  value: string;
}

interface ProjectFilterProps {
  technologies: string[];
  categories: string[];
  onFilterChange: (filter: FilterValue | null) => void;
}

export function ProjectFilter({ technologies, categories, onFilterChange }: ProjectFilterProps) {
  const [activeFilter, setActiveFilter] = useState<FilterValue | null>(null);

  const handleFilterClick = (filter: FilterValue | null) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  const isActive = (type: string, value?: string): boolean => {
    if (type === 'all') {
      return activeFilter === null;
    }
    return activeFilter?.type === type && activeFilter?.value === value;
  };

  return (
    <div className="project-filter mb-8">
      <div className="flex flex-wrap gap-3">
        {/* All Button */}
        <button
          onClick={() => handleFilterClick(null)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isActive('all')
              ? 'bg-[var(--color-primary-500)] text-white active'
              : 'bg-[var(--color-neutral-800)] text-[var(--color-neutral-200)] hover:bg-[var(--color-neutral-700)]'
          }`}
          type="button"
        >
          All
        </button>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <span className="text-[var(--color-neutral-400)] text-sm self-center mr-2">
            Categories:
          </span>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleFilterClick({ type: 'category', value: category })}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                isActive('category', category)
                  ? 'bg-[var(--color-primary-500)] text-white active'
                  : 'bg-[var(--color-neutral-800)] text-[var(--color-neutral-200)] hover:bg-[var(--color-neutral-700)]'
              }`}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Technology Filters */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <span className="text-[var(--color-neutral-400)] text-sm self-center mr-2">
            Technologies:
          </span>
          {technologies.map((tech) => (
            <button
              key={tech}
              onClick={() => handleFilterClick({ type: 'technology', value: tech })}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive('technology', tech)
                  ? 'bg-[var(--color-primary-500)] text-white active'
                  : 'bg-[var(--color-neutral-800)] text-[var(--color-neutral-200)] hover:bg-[var(--color-neutral-700)]'
              }`}
              type="button"
            >
              {tech}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

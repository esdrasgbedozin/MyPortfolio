/**
 * FE-070: TEST - ProjectFilter component
 *
 * Critère de Fin: Test filtrage par technologie (RED)
 *
 * Epic 5.2: Project Filters
 * Phase: TDD RED
 *
 * Tests:
 * - Render filter buttons (All, categories, technologies)
 * - Click filter updates active state
 * - Filter callback called with selected filter
 * - Multiple filters can be selected
 * - Clear filters button resets all
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectFilter } from './ProjectFilter';

describe('ProjectFilter - Epic 5.2 FE-070', () => {
  const mockOnFilterChange = vi.fn();

  const mockTechnologies = ['Astro', 'React', 'TypeScript', 'Python', 'FastAPI'];

  const mockCategories = ['web', 'mobile', 'backend'];

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it('should render All button', () => {
    // ACT
    render(
      <ProjectFilter
        technologies={mockTechnologies}
        categories={mockCategories}
        onFilterChange={mockOnFilterChange}
      />
    );

    // ASSERT
    const allButton = screen.getByRole('button', { name: /all/i });
    expect(allButton).toBeDefined();
  });

  it('should render technology filter buttons', () => {
    // ACT
    render(
      <ProjectFilter
        technologies={mockTechnologies}
        categories={mockCategories}
        onFilterChange={mockOnFilterChange}
      />
    );

    // ASSERT
    const astroButton = screen.getByRole('button', { name: /astro/i });
    const reactButton = screen.getByRole('button', { name: /react/i });
    const pythonButton = screen.getByRole('button', { name: /python/i });

    expect(astroButton).toBeDefined();
    expect(reactButton).toBeDefined();
    expect(pythonButton).toBeDefined();
  });

  it('should render category filter buttons', () => {
    // ACT
    render(
      <ProjectFilter
        technologies={mockTechnologies}
        categories={mockCategories}
        onFilterChange={mockOnFilterChange}
      />
    );

    // ASSERT
    const webButton = screen.getByRole('button', { name: /web/i });
    const mobileButton = screen.getByRole('button', { name: /mobile/i });
    const backendButton = screen.getByRole('button', { name: /backend/i });

    expect(webButton).toBeDefined();
    expect(mobileButton).toBeDefined();
    expect(backendButton).toBeDefined();
  });

  it('should highlight All button by default', () => {
    // ACT
    render(
      <ProjectFilter
        technologies={mockTechnologies}
        categories={mockCategories}
        onFilterChange={mockOnFilterChange}
      />
    );

    // ASSERT
    const allButton = screen.getByRole('button', { name: /all/i });
    expect(allButton.className).toContain('active'); // Active state class
  });

  it('should call onFilterChange with technology when technology button clicked', () => {
    // ARRANGE
    render(
      <ProjectFilter
        technologies={mockTechnologies}
        categories={mockCategories}
        onFilterChange={mockOnFilterChange}
      />
    );

    // ACT
    const astroButton = screen.getByRole('button', { name: /astro/i });
    fireEvent.click(astroButton);

    // ASSERT
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      type: 'technology',
      value: 'Astro',
    });
  });

  it('should call onFilterChange with category when category button clicked', () => {
    // ARRANGE
    render(
      <ProjectFilter
        technologies={mockTechnologies}
        categories={mockCategories}
        onFilterChange={mockOnFilterChange}
      />
    );

    // ACT
    const webButton = screen.getByRole('button', { name: /web/i });
    fireEvent.click(webButton);

    // ASSERT
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      type: 'category',
      value: 'web',
    });
  });

  it('should call onFilterChange with null when All button clicked', () => {
    // ARRANGE
    render(
      <ProjectFilter
        technologies={mockTechnologies}
        categories={mockCategories}
        onFilterChange={mockOnFilterChange}
      />
    );

    const astroButton = screen.getByRole('button', { name: /astro/i });
    fireEvent.click(astroButton); // Select a filter first

    // ACT
    const allButton = screen.getByRole('button', { name: /all/i });
    fireEvent.click(allButton);

    // ASSERT
    expect(mockOnFilterChange).toHaveBeenLastCalledWith(null); // Clear filter
  });

  it('should highlight active filter button', () => {
    // ARRANGE
    render(
      <ProjectFilter
        technologies={mockTechnologies}
        categories={mockCategories}
        onFilterChange={mockOnFilterChange}
      />
    );

    // ACT
    const reactButton = screen.getByRole('button', { name: /react/i });
    fireEvent.click(reactButton);

    // ASSERT
    expect(reactButton.className).toContain('active');
  });

  it('should remove highlight from All button when filter selected', () => {
    // ARRANGE
    render(
      <ProjectFilter
        technologies={mockTechnologies}
        categories={mockCategories}
        onFilterChange={mockOnFilterChange}
      />
    );

    const allButton = screen.getByRole('button', { name: /all/i });
    expect(allButton.className).toContain('active'); // Initially active

    // ACT
    const reactButton = screen.getByRole('button', { name: /react/i });
    fireEvent.click(reactButton);

    // ASSERT
    expect(allButton.className).not.toContain('active');
  });

  it('should only allow one filter active at a time', () => {
    // ARRANGE
    render(
      <ProjectFilter
        technologies={mockTechnologies}
        categories={mockCategories}
        onFilterChange={mockOnFilterChange}
      />
    );

    const reactButton = screen.getByRole('button', { name: /react/i });
    const pythonButton = screen.getByRole('button', { name: /python/i });

    // ACT
    fireEvent.click(reactButton);
    expect(reactButton.className).toContain('active');

    fireEvent.click(pythonButton);

    // ASSERT
    expect(pythonButton.className).toContain('active');
    expect(reactButton.className).not.toContain('active'); // React no longer active
  });
});

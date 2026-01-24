import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import ProjectCard from './ProjectCard';

describe('ProjectCard Component', () => {
  const mockProject = {
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with React and Node.js',
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    period: '2024',
    status: 'production' as const,
  };

  describe('Content Display', () => {
    it('should render project title', () => {
      const { getByRole } = render(<ProjectCard {...mockProject} />);

      const heading = getByRole('heading', { level: 3 });
      expect(heading.textContent).toBe('E-Commerce Platform');
    });

    it('should render project description', () => {
      const { getByText } = render(<ProjectCard {...mockProject} />);

      expect(getByText('Full-stack e-commerce solution with React and Node.js')).toBeDefined();
    });

    it('should render period', () => {
      const { getByText } = render(<ProjectCard {...mockProject} />);

      expect(getByText('2024')).toBeDefined();
    });

    it('should render status badge', () => {
      const { getByText } = render(<ProjectCard {...mockProject} />);

      expect(getByText('production')).toBeDefined();
    });
  });

  describe('Technologies Display', () => {
    it('should render all technologies as badges', () => {
      const { getByText } = render(<ProjectCard {...mockProject} />);

      expect(getByText('React')).toBeDefined();
      expect(getByText('Node.js')).toBeDefined();
      expect(getByText('PostgreSQL')).toBeDefined();
    });

    it('should render no technologies when array is empty', () => {
      const { container } = render(<ProjectCard {...mockProject} technologies={[]} />);

      const techBadges = container.querySelectorAll('[data-testid="tech-badge"]');
      expect(techBadges).toHaveLength(0);
    });
  });

  describe('Optional Links', () => {
    it('should render demo link when provided', () => {
      const { getByRole } = render(
        <ProjectCard {...mockProject} demoUrl="https://demo.example.com" />
      );

      const link = getByRole('link', { name: /demo/i });
      expect(link.getAttribute('href')).toBe('https://demo.example.com');
    });

    it('should render repository link when provided', () => {
      const { getByRole } = render(
        <ProjectCard {...mockProject} repositoryUrl="https://github.com/user/repo" />
      );

      const link = getByRole('link', { name: /repository|code/i });
      expect(link.getAttribute('href')).toBe('https://github.com/user/repo');
    });

    it('should render no links when not provided', () => {
      const { queryAllByRole } = render(<ProjectCard {...mockProject} />);

      const links = queryAllByRole('link');
      expect(links).toHaveLength(0);
    });
  });

  describe('Status Variants', () => {
    it('should render production status', () => {
      const { getByText } = render(<ProjectCard {...mockProject} status="production" />);

      expect(getByText('production')).toBeDefined();
    });

    it('should render development status', () => {
      const { getByText } = render(<ProjectCard {...mockProject} status="development" />);

      expect(getByText('development')).toBeDefined();
    });

    it('should render archived status', () => {
      const { getByText } = render(<ProjectCard {...mockProject} status="archived" />);

      expect(getByText('archived')).toBeDefined();
    });
  });

  describe('Card Structure', () => {
    it('should have article semantic element', () => {
      const { container } = render(<ProjectCard {...mockProject} />);

      const article = container.querySelector('article');
      expect(article).toBeDefined();
    });

    it('should have hover effect classes', () => {
      const { container } = render(<ProjectCard {...mockProject} />);

      const article = container.querySelector('article');
      expect(article?.className).toContain('transition');
    });
  });
});

/**
 * Content Collections Configuration
 * Epic 4.1 - FE-054
 *
 * Définit les schemas Zod pour les collections de contenu (projets, certifications, skills)
 */

import { defineCollection, z } from 'astro:content';

// Schema Project (FE-055)
const projectCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()),
    technologies: z.array(z.string()),
    category: z.enum(['web', 'mobile', 'backend', 'devops', 'data', 'other']),
    startDate: z.date(),
    endDate: z.date().optional(),
    status: z.enum(['completed', 'in-progress', 'planned']),
    githubUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
  }),
});

// Schema Certification (FE-056)
const certificationCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    organization: z.string(),
    date: z.date(),
    expiryDate: z.date().optional(),
    credentialId: z.string().optional(),
    credentialUrl: z.string().url().optional(),
    logo: z.string().optional(),
    description: z.string().optional(),
  }),
});

// Schema Skill (FE-057)
const skillCollection = defineCollection({
  type: 'data',
  schema: z.object({
    category: z.string(),
    skills: z.array(
      z.object({
        name: z.string(),
        level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
        years: z.number().optional(),
        logo: z.string().optional(),
      })
    ),
  }),
});

// Export collections
export const collections = {
  projects: projectCollection,
  certifications: certificationCollection,
  skills: skillCollection,
};

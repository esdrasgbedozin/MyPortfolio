/**
 * Technology Icons Mapping
 * Maps technology names to their official icons from react-icons (Simple Icons)
 */

import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiSharp, // C#
  SiMysql,
  SiReact,
  SiAstro,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiSpring,
  SiVercel,
  SiDocker,
  SiKubernetes,
  SiGithubactions,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiTerraform,
  SiGit,
  SiGithub,
  SiJenkins,
  SiGitlab,
  SiAngular,
  SiVuedotjs,
  SiDjango,
  SiFlask,
  SiFastapi,
  SiSpringboot,
  SiDotnet,
  SiPhp,
  SiGo,
  SiRust,
  SiGraphql,
  SiApachekafka,
  SiRabbitmq,
  SiElasticsearch,
  SiPrometheus,
  SiGrafana,
} from 'react-icons/si';
import { FaCloud, FaAws } from 'react-icons/fa'; // FontAwesome for cloud icons
import type { IconType } from 'react-icons';

export const techIcons: Record<string, IconType> = {
  // Langages
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  Python: SiPython,
  Java: SiJavascript, // Fallback to JavaScript icon for Java
  'C#': SiSharp,
  SQL: SiMysql,
  PHP: SiPhp,
  Go: SiGo,
  Rust: SiRust,

  // Frameworks & Libs
  React: SiReact,
  Astro: SiAstro,
  'Next.js': SiNextdotjs,
  'Node.js': SiNodedotjs,
  Express: SiExpress,
  'Spring Boot': SiSpringboot,
  Spring: SiSpring,
  Angular: SiAngular,
  'Vue.js': SiVuedotjs,
  Django: SiDjango,
  Flask: SiFlask,
  FastAPI: SiFastapi,
  '.NET': SiDotnet,

  // Cloud & DevOps
  Azure: FaCloud, // Using FontAwesome cloud icon for Azure
  AWS: FaAws,
  Vercel: SiVercel,
  Docker: SiDocker,
  Kubernetes: SiKubernetes,
  'GitHub Actions': SiGithubactions,
  Terraform: SiTerraform,
  Git: SiGit,
  GitHub: SiGithub,
  Jenkins: SiJenkins,
  GitLab: SiGitlab,

  // Databases
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  Redis: SiRedis,
  'SQL Server': SiMysql, // Using MySQL icon as fallback for SQL Server

  // Messaging & Streaming
  Kafka: SiApachekafka,
  RabbitMQ: SiRabbitmq,
  GraphQL: SiGraphql,

  // Monitoring
  Elasticsearch: SiElasticsearch,
  Prometheus: SiPrometheus,
  Grafana: SiGrafana,
};

/**
 * Get icon for a technology
 */
export function getTechIcon(techName: string): IconType | undefined {
  return techIcons[techName];
}

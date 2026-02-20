/**
 * TechMarquee - Pre-configured InfiniteMarquee with real technology logos
 * Uses react-icons/si (Simple Icons) for authentic brand logos.
 *
 * @module components/TechMarquee
 */

import {
  SiReact,
  SiTypescript,
  SiPython,
  SiAstro,
  SiDocker,
  SiGooglecloud,
  SiNodedotjs,
  SiJenkins,
  SiTailwindcss,
  SiPostgresql,
  SiTerraform,
  SiFastapi,
  SiGit,
  SiSap,
} from 'react-icons/si';
import InfiniteMarquee from './InfiniteMarquee';

const techItems = [
  { label: 'React', icon: <SiReact color="#61DAFB" /> },
  { label: 'TypeScript', icon: <SiTypescript color="#3178C6" /> },
  { label: 'Python', icon: <SiPython color="#3776AB" /> },
  { label: 'Astro', icon: <SiAstro color="#FF5D01" /> },
  { label: 'Docker', icon: <SiDocker color="#2496ED" /> },
  { label: 'GCP', icon: <SiGooglecloud color="#4285F4" /> },
  { label: 'Node.js', icon: <SiNodedotjs color="#5FA04E" /> },
  { label: 'Jenkins', icon: <SiJenkins color="#D24939" /> },
  { label: 'Tailwind CSS', icon: <SiTailwindcss color="#06B6D4" /> },
  { label: 'PostgreSQL', icon: <SiPostgresql color="#4169E1" /> },
  { label: 'Terraform', icon: <SiTerraform color="#844FBA" /> },
  { label: 'FastAPI', icon: <SiFastapi color="#009688" /> },
  { label: 'Git', icon: <SiGit color="#F05032" /> },
  { label: 'SAP HANA', icon: <SiSap color="#0FAAFF" /> },
];

interface TechMarqueeProps {
  speed?: number;
  className?: string;
}

export default function TechMarquee({ speed = 35, className = '' }: TechMarqueeProps) {
  return <InfiniteMarquee items={techItems} speed={speed} className={className} />;
}

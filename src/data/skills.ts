export type Skill = {
  name: string;
  /** simpleicons slug, resolved to a local inline SVG at build time where possible. */
  slug: string;
  color: string;
  category: 'cloud' | 'backend' | 'frontend' | 'ops' | 'data';
  /** Drives the System Monitor "load" bars. Self-assessed proficiency 0-100. */
  load: number;
};

export const skills: Skill[] = [
  { name: 'AWS', slug: 'amazonwebservices', color: '#FF9900', category: 'cloud', load: 82 },
  { name: 'Docker', slug: 'docker', color: '#2496ED', category: 'ops', load: 90 },
  { name: 'Kubernetes', slug: 'kubernetes', color: '#326CE5', category: 'ops', load: 68 },
  { name: 'GitHub Actions', slug: 'githubactions', color: '#2088FF', category: 'ops', load: 85 },
  { name: 'Linux', slug: 'linux', color: '#FCC624', category: 'ops', load: 88 },
  { name: 'Nginx', slug: 'nginx', color: '#009639', category: 'ops', load: 74 },
  { name: 'Apache', slug: 'apache', color: '#E34234', category: 'ops', load: 66 },
  { name: 'Git', slug: 'git', color: '#F05032', category: 'ops', load: 90 },
  { name: 'GitHub', slug: 'github', color: '#FFFFFF', category: 'ops', load: 90 },
  { name: 'Prometheus', slug: 'prometheus', color: '#E6522C', category: 'ops', load: 62 },
  { name: 'Grafana', slug: 'grafana', color: '#F46800', category: 'ops', load: 62 },
  { name: 'Spring Boot', slug: 'springboot', color: '#6DB33F', category: 'backend', load: 78 },
  { name: 'Laravel', slug: 'laravel', color: '#FF2D20', category: 'backend', load: 72 },
  { name: 'Node.js', slug: 'nodedotjs', color: '#339933', category: 'backend', load: 80 },
  { name: 'NestJS', slug: 'nestjs', color: '#E0234E', category: 'backend', load: 64 },
  { name: 'Go', slug: 'go', color: '#00ADD8', category: 'backend', load: 55 },
  { name: 'Python', slug: 'python', color: '#3776AB', category: 'backend', load: 84 },
  { name: 'React', slug: 'react', color: '#61DAFB', category: 'frontend', load: 82 },
  { name: 'Next.js', slug: 'nextdotjs', color: '#FFFFFF', category: 'frontend', load: 70 },
  { name: 'MySQL', slug: 'mysql', color: '#4479A1', category: 'data', load: 78 },
  { name: 'PostgreSQL', slug: 'postgresql', color: '#4169E1', category: 'data', load: 72 },
  { name: 'Snowflake', slug: 'snowflake', color: '#29B5E8', category: 'data', load: 58 },
];

export const ctfPlatforms = ['PicoCTF', 'TryHackMe', 'Hack The Box'] as const;

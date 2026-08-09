export type Experience = {
  id: string;
  role: string;
  company: string;
  href: string;
  period: string;
  /** Drives the fake `systemctl`/`ps` uptime columns in the terminal. */
  since: string;
  current: boolean;
  description: string;
  skills: string[];
};

export const experience: Experience[] = [
  {
    id: 'innobot-health',
    role: 'Intern Software Engineer',
    company: 'Innobot Health',
    href: 'https://www.linkedin.com/company/wemixt/posts/?feedView=all',
    period: 'Mar 2026 - Present',
    since: '2026-03-01',
    current: true,
    description:
      'Working on healthcare automation solutions focused on Robotic Process Automation (RPA), Python-based scripting, and workflow optimization. Contributing to streamlining operational processes in areas such as eligibility checks, authorization workflows, claims processing, and other repetitive healthcare operations through automation and system integration.',
    skills: [
      'Python',
      'Web Scraping',
      'Snowflake',
      'Salesforce',
      'PostgreSQL',
      'AWS',
      'GitLab CI',
    ],
  },
  {
    id: 'wemixt',
    role: 'Intern Software Engineer',
    company: 'WEMIXT',
    href: 'https://www.linkedin.com/company/wemixt/posts/?feedView=all',
    period: 'Feb 2025 - Aug 2025',
    since: '2025-02-01',
    current: false,
    description:
      'Handled both DevOps and development responsibilities. Built internal tools and APIs using Laravel and Node.js. Designed and managed CI/CD pipelines using GitHub Actions and Docker. Conducted knowledge-sharing sessions such as "Docker Zero to Hero" to upskill the team. Took charge of containerizing applications with Docker Compose and deploying them on AWS EC2, ensuring efficient delivery and high system reliability.',
    skills: ['Docker', 'DevOps', 'QA Testing', 'Tech Talks'],
  },
  {
    id: 'rotaract',
    role: 'Member of IT Avenue',
    company: 'Rotaract',
    href: 'https://www.linkedin.com/company/moraspirit-initiative/posts/?feedView=all',
    period: 'Sep 2025 - Present',
    since: '2025-09-01',
    current: true,
    description:
      "I recently joined the Rotaract Club's IT Avenue, where I'm getting familiar with the team, ongoing initiatives, and the club's digital infrastructure. Leveraging my experience in DevOps, I've contributed to migration projects, streamlining deployments, and improving system reliability. I'm excited to continue enhancing automation, scalability, and efficiency across the club's tech operations.",
    skills: [
      'Team collaboration and communication',
      'Backend',
      'DevOps',
      'Prometheus',
      'Grafana',
    ],
  },
  {
    id: 'moraspirit',
    role: 'Member of the Web and Tech Pillar',
    company: 'Moraspirit',
    href: 'https://www.linkedin.com/company/moraspirit-initiative/posts/?feedView=all',
    period: 'Jun 2025 - Present',
    since: '2025-06-01',
    current: true,
    description:
      'I recently joined Moraspirit as a member of the Web and Tech Pillar. Currently, I am familiarizing myself with the team, company culture, and ongoing projects. I am excited to learn, grow my skills, and contribute to future projects soon.',
    skills: [
      'Team collaboration and communication',
      'Problem-solving mindset',
      'Backend',
    ],
  },
];

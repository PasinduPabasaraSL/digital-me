export type ProjectLink = {
  label: string;
  href: string;
  kind: 'live' | 'source' | 'image';
};

export type Project = {
  id: string;
  name: string;
  /** Shown as the container name in `docker ps` and the pod name in `kubectl`. */
  slug: string;
  description: string;
  tech: string[];
  links: ProjectLink[];
  /** Fake but stable port used by the terminal's docker output. */
  port: number;
  namespace: 'production' | 'labs' | 'university';
};

export const projects: Project[] = [
  {
    id: 'seekersconnect',
    name: 'SeekersConnect',
    slug: 'seekersconnect',
    description:
      'Developed SeekersConnect, a job posting and skill development platform designed to connect job seekers with relevant opportunities.',
    tech: ['React', 'Tailwind CSS', 'Spring Boot', 'MySQL', 'Vercel'],
    port: 8080,
    namespace: 'production',
    links: [
      { label: 'View Project', href: 'https://seekersconnect-frontend.vercel.app/', kind: 'live' },
      {
        label: 'Frontend Code',
        href: 'https://github.com/PasinduPabasaraSL/seekersconnect-frontend/',
        kind: 'source',
      },
      {
        label: 'Backend Code',
        href: 'https://github.com/PasinduPabasaraSL/seekersconnect-backend/',
        kind: 'source',
      },
    ],
  },
  {
    id: 'docbucket',
    name: 'DocBucket',
    slug: 'docbucket',
    description:
      'Developed the backend of DocBucket using Java EE for secure document storage, user authentication, and efficient file management.',
    tech: ['JavaEE', 'Hibernate'],
    port: 8081,
    namespace: 'production',
    links: [
      { label: 'GitHub', href: 'https://github.com/PasinduPabasaraSL/docbucket-backend', kind: 'source' },
    ],
  },
  {
    id: 's3-web-project',
    name: 's3-web-project',
    slug: 's3-web-project',
    description:
      'Deployed a static website using AWS S3 and CloudFront with CI/CD via GitHub Actions. Enabled HTTPS, fixed mobile access issues, and achieved global distribution with secure delivery.',
    tech: ['AWS S3', 'CloudFront', 'CI/CD'],
    port: 443,
    namespace: 'production',
    links: [
      { label: 'View Project', href: 'https://lnkd.in/eCQq-cJS', kind: 'live' },
      { label: 'GitHub', href: 'https://github.com/PasinduPabasaraSL/s3-web-project', kind: 'source' },
    ],
  },
  {
    id: 'serverless-ip-logger',
    name: 'Serverless IP Logger',
    slug: 'ip-logger',
    description:
      'Built a serverless IP logger using AWS Lambda, API Gateway, and CloudWatch Logs. Captures client IPs from HTTP requests and logs them securely. Deployed fully serverless with real-time logging and zero server management.',
    tech: ['AWS Lambda', 'API Gateway', 'CloudWatch Logs', 'Serverless'],
    port: 3000,
    namespace: 'production',
    links: [
      {
        label: 'View Project',
        href: 'https://oa8azu505g.execute-api.ap-southeast-1.amazonaws.com/ip_logger',
        kind: 'live',
      },
    ],
  },
  {
    id: 'zen-garden',
    name: 'Zen Garden',
    slug: 'zen-garden',
    description:
      'Built a full-stack app with React (Vite) and Node.js, containerized using Docker & Docker Compose. Automated CI/CD with GitHub Actions and pushed images to Docker Hub.',
    tech: ['React', 'Docker'],
    port: 5173,
    namespace: 'labs',
    links: [
      { label: 'GitHub', href: 'https://lnkd.in/eTqZnqX6', kind: 'source' },
      { label: 'Frontend Image', href: 'https://lnkd.in/e8dRqhyH', kind: 'image' },
      { label: 'Backend Image', href: 'https://lnkd.in/ecZhFVEW', kind: 'image' },
    ],
  },
  {
    id: 'coffeearena',
    name: 'CoffeeArena',
    slug: 'coffee-arena',
    description:
      'Designed and built a fully responsive coffee shop website using HTML and CSS as part of a university course. Features include a mobile-friendly layout, hamburger menu, and a clean, modern UI with a coffee-themed palette.',
    tech: ['HTML', 'CSS', 'Responsive Design', 'Vercel'],
    port: 8082,
    namespace: 'university',
    links: [
      { label: 'View Project', href: 'https://lnkd.in/eSedmZ7B', kind: 'live' },
      { label: 'GitHub', href: 'https://github.com/PasinduPabasaraSL/coffee-arena', kind: 'source' },
    ],
  },
  {
    id: 'planetvisits',
    name: 'PlanetVisits',
    slug: 'planetvisits',
    description:
      'Responsive travel website with dark theme, built using HTML, CSS, and JavaScript. Features smooth navigation and a mobile-friendly hamburger menu.',
    tech: ['HTML', 'CSS', 'Responsive Design', 'Vercel'],
    port: 8083,
    namespace: 'university',
    links: [
      { label: 'View Project', href: 'https://lnkd.in/emfGwiKQ', kind: 'live' },
      { label: 'GitHub', href: 'https://github.com/PasinduPabasaraSL/planetvisits', kind: 'source' },
    ],
  },
  {
    id: 'fb-clone',
    name: 'Facebook Clone UI (Mobile)',
    slug: 'fb-clone',
    description:
      'Built a mobile UI clone of Facebook using React Native. Focused on recreating key interface screens including the user feed, post creation, and interactive buttons. No backend functionality included.',
    tech: ['React Native', 'Mobile Development'],
    port: 19000,
    namespace: 'labs',
    links: [
      { label: 'GitHub', href: 'https://github.com/PasinduPabasaraSL/fb-clone', kind: 'source' },
    ],
  },
  {
    id: 'hand-gesture-shape-match',
    name: 'Hand Gesture Shape Match',
    slug: 'gesture-match',
    description:
      'An interactive computer vision game using MediaPipe and OpenCV where you use hand pinch gestures to drag and drop shapes into matching buckets. Features multiple levels, a timer, scoring system, and progress saving.',
    tech: ['Python', 'OpenCV', 'MediaPipe', 'Game Development'],
    port: 7860,
    namespace: 'labs',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/PasinduPabasaraSL/hand-gesture-shape-match',
        kind: 'source',
      },
    ],
  },
];

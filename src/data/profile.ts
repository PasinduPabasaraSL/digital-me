export const profile = {
  name: 'Pasindu Pabasara',
  firstName: 'Pasindu',
  username: 'pasindu',
  hostname: 'ubuntu',
  title: 'Intern Software Engineer & DevOps Enthusiast',
  role: 'DevOps · Cloud · Cybersecurity',
  location: 'Sri Lanka',
  quote: 'Deploy like a pro. Monitor like a detective.',
  avatar: '/assets/about_photo.jpg',
  hero: '/assets/1.jpg',
  email: 'pabasarapasindu365@gmail.com',
  bio: `I am an IT undergraduate specializing in DevOps, cloud infrastructure, and cybersecurity, with a strong background in backend development and software engineering. I design and manage scalable, secure, and automated systems, leveraging Docker, Kubernetes, Infrastructure-as-Code, and AWS, while implementing efficient CI/CD pipelines and resilient cloud environments. In parallel, I actively develop expertise in cybersecurity and DevSecOps through CTF challenges and platforms like PicoCTF, TryHackMe, and Hack The Box, focusing on ethical hacking, system hardening, and vulnerability assessment. I excel in collaborative, results-driven teams and am committed to delivering solutions that integrate automation, scalability, and security, continuously exploring emerging technologies to drive meaningful impact.`,
} as const;

/**
 * The CV lives in `public/`, which Vite copies to the site root untouched, so
 * `href` is the filename with a leading slash. Replace the file in place to
 * publish a new version and update `updated` to match.
 */
export const resume = {
  href: '/Pasindu-Pabasara-CV.pdf',
  filename: 'Pasindu-Pabasara-CV.pdf',
  updated: 'August 2026',
} as const;

export type SocialLink = {
  label: string;
  href: string;
  handle: string;
};

export const socials: SocialLink[] = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/pasindu-pabasara-781822307/',
    handle: 'pasindu-pabasara',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/PasinduPabasaraSL',
    handle: 'PasinduPabasaraSL',
  },
  {
    label: 'Medium',
    href: 'https://medium.com/@pabasarapasindu365',
    handle: '@pabasarapasindu365',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/pasindu5914?utm_source=qr&igsh=MW1uOWRhcXl2b3R0ag==',
    handle: 'pasindu5914',
  },
  {
    label: 'Email',
    href: `mailto:${profile.email}`,
    handle: profile.email,
  },
];

/** Powers the contact form. FormSubmit relays to the address without a backend. */
export const contactEndpoint = `https://formsubmit.co/${profile.email}`;

import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { experience } from './src/data/experience.ts';
import { gallery } from './src/data/gallery.ts';
import { profile, resume, socials } from './src/data/profile.ts';
import { projects } from './src/data/projects.ts';
import { skills } from './src/data/skills.ts';

const escape = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * The desktop is a pile of absolutely-positioned divs built at runtime, which
 * non-JS crawlers cannot read. Rather than pay for full SSR, this renders the
 * same content once at build time into the shipped index.html, outside #root
 * so React never touches it.
 */
function seoContent(): Plugin {
  return {
    name: 'inject-seo-content',
    transformIndexHtml() {
      const body = `
<div id="seo-content" class="sr-only-seo">
  <h1>${escape(profile.name)} — ${escape(profile.title)}</h1>
  <p>${escape(profile.bio)}</p>
  <blockquote>${escape(profile.quote)}</blockquote>

  <h2>Skills</h2>
  <ul>${skills.map((skill) => `<li>${escape(skill.name)}</li>`).join('')}</ul>

  <h2>Professional Experience</h2>
  ${experience
    .map(
      (job) => `<article>
    <h3>${escape(job.role)} — ${escape(job.company)}</h3>
    <p>${escape(job.period)}</p>
    <p>${escape(job.description)}</p>
    <ul>${job.skills.map((skill) => `<li>${escape(skill)}</li>`).join('')}</ul>
  </article>`,
    )
    .join('')}

  <h2>Projects</h2>
  ${projects
    .map(
      (project) => `<article>
    <h3>${escape(project.name)}</h3>
    <p>${escape(project.description)}</p>
    <ul>${project.tech.map((tech) => `<li>${escape(tech)}</li>`).join('')}</ul>
    <ul>${project.links
      .map(
        (link) =>
          `<li><a href="${escape(link.href)}">${escape(link.label)}</a></li>`,
      )
      .join('')}</ul>
  </article>`,
    )
    .join('')}

  <h2>Gallery</h2>
  <ul>${gallery
    .map((item) => `<li><a href="${escape(item.href)}">${escape(item.caption)}</a></li>`)
    .join('')}</ul>

  <h2>Curriculum Vitae</h2>
  <p><a href="${escape(resume.href)}">Download ${escape(profile.name)}'s CV (PDF)</a></p>

  <h2>Contact</h2>
  <ul>${socials
    .map(
      (social) =>
        `<li><a href="${escape(social.href)}">${escape(social.label)}: ${escape(social.handle)}</a></li>`,
    )
    .join('')}</ul>
</div>`;

      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: profile.name,
        jobTitle: profile.title,
        description: profile.bio,
        email: `mailto:${profile.email}`,
        address: { '@type': 'PostalAddress', addressCountry: profile.location },
        knowsAbout: skills.map((skill) => skill.name),
        sameAs: socials
          .filter((social) => social.href.startsWith('http'))
          .map((social) => social.href),
      };

      return [
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          children: JSON.stringify(structuredData),
          injectTo: 'head',
        },
        { tag: 'div', children: body, injectTo: 'body' },
      ];
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoContent()],
  resolve: {
    alias: [{ find: /^@\//, replacement: new URL('./src/', import.meta.url).pathname }],
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        // Keep the shell (boot, dock, window manager) in the entry chunk so the
        // desktop paints immediately; every app is a lazy chunk fetched on open.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('scheduler')) return 'react';
            return 'vendor';
          }
        },
      },
    },
  },
});

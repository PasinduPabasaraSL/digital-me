import type { ReactNode } from 'react';
import { UBUNTU_ASCII } from './ascii';
import { experience } from '@/data/experience';
import { gallery } from '@/data/gallery';
import { contactEndpoint, profile, resume, socials } from '@/data/profile';
import { projects } from '@/data/projects';
import { ctfPlatforms, skills } from '@/data/skills';

export type CommandContext = {
  openApp: (appId: string) => void;
  clear: () => void;
};

const O = ({ children }: { children: ReactNode }) => (
  <span className="text-ubuntu-orange">{children}</span>
);
const G = ({ children }: { children: ReactNode }) => (
  <span className="text-[#8ae234]">{children}</span>
);
const B = ({ children }: { children: ReactNode }) => (
  <span className="text-[#729fcf]">{children}</span>
);
const Y = ({ children }: { children: ReactNode }) => (
  <span className="text-[#fce94f]">{children}</span>
);
const Dim = ({ children }: { children: ReactNode }) => (
  <span className="text-white/45">{children}</span>
);

function monthsSince(iso: string) {
  const start = new Date(iso);
  const now = new Date();
  return Math.max(
    1,
    (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()),
  );
}

function humanUptime(iso: string) {
  const months = monthsSince(iso);
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years && rest) return `${years}y ${rest}mo`;
  if (years) return `${years}y`;
  return `${rest || 1}mo`;
}

function neofetch(): ReactNode[] {
  const info: [string, ReactNode][] = [
    ['', <G key="host">{`${profile.username}@${profile.hostname}`}</G>],
    ['', <Dim key="rule">{'-'.repeat(profile.username.length + profile.hostname.length + 1)}</Dim>],
    ['OS', 'Ubuntu 24.04.2 LTS x86_64'],
    ['Host', `${profile.name} — ${profile.role}`],
    ['Kernel', '6.8.0-generic'],
    ['Uptime', 'IT undergraduate, always compiling'],
    ['Packages', `${projects.length} projects, ${skills.length} technologies`],
    ['Shell', 'bash 5.2.21'],
    ['Resolution', 'Sri Lanka'],
    ['DE', 'GNOME 46'],
    ['WM', 'Mutter'],
    ['Theme', 'Yaru-dark'],
    ['Icons', 'Yaru'],
    ['Terminal', 'gnome-terminal'],
    ['CPU', 'DevOps · Cloud · Cybersecurity'],
    ['Memory', `${experience.length} roles / ${gallery.length} events`],
    ['Email', profile.email],
  ];

  const rows = Math.max(UBUNTU_ASCII.length, info.length);

  return Array.from({ length: rows }, (_, index) => {
    const art = UBUNTU_ASCII[index] ?? '';
    const entry = info[index];
    return (
      <div key={index} className="flex whitespace-pre">
        <span className="text-ubuntu-orange">{art.padEnd(42)}</span>
        {entry &&
          (entry[0] ? (
            <span>
              <G>{entry[0]}</G>
              <span className="text-white/80">: {entry[1]}</span>
            </span>
          ) : (
            <span>{entry[1]}</span>
          ))}
      </div>
    );
  });
}

function dockerPs(): ReactNode[] {
  const header = 'CONTAINER ID   IMAGE                     STATUS         PORTS';
  return [
    <span key="h" className="text-white/50">
      {header}
    </span>,
    ...projects.map((project, index) => (
      <div key={project.id} className="whitespace-pre">
        <Y>{(0xa1f3c2 + index * 7919).toString(16).slice(0, 12).padEnd(15)}</Y>
        <span className="text-white/85">{`pasindu/${project.slug}`.padEnd(26)}</span>
        <G>{'Up'.padEnd(3)}</G>
        <span className="text-white/70">{`${8 + index} months`.padEnd(11)}</span>
        <B>{`0.0.0.0:${project.port}->${project.port}/tcp`}</B>
      </div>
    )),
    '',
    <Dim key="tip">Run `open files` to browse project sources.</Dim>,
  ];
}

function kubectlPods(): ReactNode[] {
  return [
    <span key="h" className="text-white/50">
      {'NAMESPACE     NAME                          READY   STATUS    RESTARTS   AGE'}
    </span>,
    ...projects.map((project, index) => (
      <div key={project.id} className="whitespace-pre">
        <span className="text-white/60">{project.namespace.padEnd(14)}</span>
        <span className="text-white/85">{`${project.slug}-${(0x5f2 + index * 37).toString(16)}`.padEnd(30)}</span>
        <span className="text-white/70">{'1/1'.padEnd(8)}</span>
        <G>{'Running'.padEnd(10)}</G>
        <span className="text-white/70">{'0'.padEnd(11)}</span>
        <span className="text-white/70">{`${20 + index * 13}d`}</span>
      </div>
    )),
  ];
}

function systemctlStatus(): ReactNode[] {
  const lines: ReactNode[] = [];
  experience.forEach((job, index) => {
    lines.push(
      <div key={`${job.id}-head`} className="whitespace-pre-wrap">
        <span className={job.current ? 'text-[#8ae234]' : 'text-white/40'}>●</span>{' '}
        <span className="font-bold text-white">{job.company.toLowerCase().replace(/\s+/g, '-')}.service</span>
        <span className="text-white/70"> — {job.role}</span>
      </div>,
    );
    lines.push(
      <div key={`${job.id}-loaded`} className="whitespace-pre-wrap text-white/70">
        {'     Loaded: loaded (/etc/career/'}
        {job.id}
        {'.service; enabled)'}
      </div>,
    );
    lines.push(
      <div key={`${job.id}-active`} className="whitespace-pre-wrap text-white/70">
        {'     Active: '}
        {job.current ? <G>active (running)</G> : <Dim>inactive (completed)</Dim>}
        {` since ${job.period.split(' - ')[0]}; ${humanUptime(job.since)}`}
      </div>,
    );
    lines.push(
      <div key={`${job.id}-desc`} className="whitespace-pre-wrap text-white/60">
        {'       Docs: '}
        {job.description}
      </div>,
    );
    lines.push(
      <div key={`${job.id}-tags`} className="whitespace-pre-wrap">
        {'     CGroup: '}
        <B>{job.skills.join(', ')}</B>
      </div>,
    );
    if (index < experience.length - 1) lines.push('');
  });
  return lines;
}

function htop(): ReactNode[] {
  return [
    <Dim key="h">Self-assessed proficiency — press `q` in your imagination to quit.</Dim>,
    '',
    ...skills
      .slice()
      .sort((a, b) => b.load - a.load)
      .map((skill) => {
        const filled = Math.round(skill.load / 5);
        return (
          <div key={skill.name} className="whitespace-pre">
            <span className="text-white/85">{skill.name.padEnd(16)}</span>
            <span className="text-white/40">[</span>
            <G>{'|'.repeat(filled)}</G>
            <span className="text-white/25">{' '.repeat(20 - filled)}</span>
            <span className="text-white/40">]</span>
            <span className="text-white/60">{` ${skill.load}%`}</span>
          </div>
        );
      }),
  ];
}

function listProjects(): ReactNode[] {
  return [
    <Dim key="total">{`total ${projects.length}`}</Dim>,
    ...projects.map((project) => (
      <div key={project.id} className="whitespace-pre-wrap">
        <span className="text-white/50">{'drwxr-xr-x  pasindu  '}</span>
        <B>{project.slug.padEnd(20)}</B>
        <span className="text-white/60">{project.tech.join(', ')}</span>
      </div>
    )),
    '',
    <Dim key="hint">Use `cat &lt;project&gt;` for details, or `open files` for the GUI.</Dim>,
  ];
}

function projectDetail(slug: string): ReactNode[] {
  const project = projects.find(
    (item) => item.slug === slug || item.id === slug || item.name.toLowerCase() === slug,
  );
  if (!project) {
    return [<span key="e" className="text-terminal-red">{`cat: ${slug}: No such file or directory`}</span>];
  }
  return [
    <span key="n" className="text-lg font-bold text-ubuntu-orange">
      {project.name}
    </span>,
    <span key="d" className="text-white/80">
      {project.description}
    </span>,
    '',
    <div key="t">
      <G>Stack</G>
      <span className="text-white/80">: {project.tech.join(' · ')}</span>
    </div>,
    ...project.links.map((link) => (
      <div key={link.href}>
        <G>{link.label}</G>
        <span className="text-white/80">: </span>
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#729fcf] underline underline-offset-2 hover:text-ubuntu-orange"
        >
          {link.href}
        </a>
      </div>
    )),
  ];
}

const HELP: [string, string][] = [
  ['help', 'show this list'],
  ['neofetch', 'system summary — start here'],
  ['whoami', 'who is behind this machine'],
  ['about', 'the long version'],
  ['ls', 'list projects'],
  ['cat <project>', 'details for one project'],
  ['docker ps', 'projects as running containers'],
  ['kubectl get pods', 'projects as pods'],
  ['systemctl status', 'work experience as services'],
  ['htop', 'skills as resource usage'],
  ['gallery', 'events and talks'],
  ['resume', 'download my CV'],
  ['contact', 'how to reach me'],
  ['social', 'links'],
  ['ctf', 'security practice platforms'],
  ['open <app>', 'launch a desktop app'],
  ['date', 'current date'],
  ['clear', 'clear the screen'],
];

export function runCommand(raw: string, ctx: CommandContext): ReactNode[] {
  const input = raw.trim();
  if (!input) return [];

  const [command, ...args] = input.split(/\s+/);
  const arg = args.join(' ').toLowerCase();
  const cmd = command.toLowerCase();

  switch (cmd) {
    case 'help':
      return [
        <Dim key="h">Available commands:</Dim>,
        '',
        ...HELP.map(([name, description]) => (
          <div key={name} className="whitespace-pre">
            <O>{name.padEnd(20)}</O>
            <span className="text-white/70">{description}</span>
          </div>
        )),
      ];

    case 'neofetch':
    case 'fastfetch':
      return neofetch();

    case 'whoami':
      return [
        <span key="w" className="text-white/85">
          {profile.username}
        </span>,
        <Dim key="t">{`${profile.name} — ${profile.title}`}</Dim>,
      ];

    case 'about':
      return [
        <p key="b" className="max-w-[75ch] whitespace-pre-wrap text-white/85">
          {profile.bio}
        </p>,
        '',
        <span key="q" className="italic text-ubuntu-orange">
          “{profile.quote}”
        </span>,
      ];

    case 'ls':
    case 'dir':
      return listProjects();

    case 'cat':
      if (!arg) return [<span key="e" className="text-terminal-red">cat: missing operand</span>];
      if (arg === 'about.md' || arg === 'about') return runCommand('about', ctx);
      return projectDetail(arg);

    case 'docker':
      if (arg.startsWith('ps')) return dockerPs();
      return [
        <Dim key="d">{`Usage: docker ps`}</Dim>,
      ];

    case 'kubectl':
      if (arg.includes('pod')) return kubectlPods();
      return [<Dim key="k">Usage: kubectl get pods</Dim>];

    case 'systemctl':
      return systemctlStatus();

    case 'htop':
    case 'top':
    case 'skills':
      return htop();

    case 'gallery':
      return [
        <Dim key="h">{`${gallery.length} events`}</Dim>,
        '',
        ...gallery.map((item) => (
          <div key={item.id}>
            <O>▸ </O>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/85 underline-offset-2 hover:text-ubuntu-orange hover:underline"
            >
              {item.caption}
            </a>
          </div>
        )),
      ];

    case 'ctf':
    case 'security':
      return [
        <span key="h" className="text-white/85">
          Practising offensive and defensive security on:
        </span>,
        ...ctfPlatforms.map((platform) => (
          <div key={platform}>
            <O>▸ </O>
            <span className="text-white/85">{platform}</span>
          </div>
        )),
        '',
        <Dim key="f">Focus: ethical hacking, system hardening, vulnerability assessment.</Dim>,
      ];

    case 'contact':
      return [
        <div key="e">
          <G>email</G>
          <span className="text-white/80">
            :{'    '}
            <a
              href={`mailto:${profile.email}`}
              className="text-[#729fcf] underline underline-offset-2 hover:text-ubuntu-orange"
            >
              {profile.email}
            </a>
          </span>
        </div>,
        <Dim key="f">{`form:     ${contactEndpoint}`}</Dim>,
        '',
        <Dim key="t">Run `open contact` for the mail client.</Dim>,
      ];

    case 'social':
    case 'links':
      return socials.map((social) => (
        <div key={social.label}>
          <G>{social.label.padEnd(10)}</G>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#729fcf] underline underline-offset-2 hover:text-ubuntu-orange"
          >
            {social.handle}
          </a>
        </div>
      ));

    case 'resume':
    case 'cv': {
      // Kick off the download and open the viewer, so the command does the
      // obvious thing whether the visitor wants to read it or keep it.
      const link = document.createElement('a');
      link.href = resume.href;
      link.download = resume.filename;
      link.click();
      ctx.openApp('resume');
      return [
        <span key="d" className="text-white/85">{`Downloading ${resume.filename}…`}</span>,
        <Dim key="u">{`Last updated ${resume.updated}. Opening the viewer too.`}</Dim>,
      ];
    }

    case 'open':
    case 'xdg-open': {
      const known = ['terminal', 'files', 'about', 'resume', 'experience', 'gallery', 'monitor', 'firefox', 'contact', 'settings', 'trash'];
      if (known.includes(arg)) {
        ctx.openApp(arg);
        return [<Dim key="o">{`Launching ${arg}…`}</Dim>];
      }
      return [
        <span key="e" className="text-terminal-red">{`open: unknown application '${arg}'`}</span>,
        <Dim key="l">{`Try: ${known.join(', ')}`}</Dim>,
      ];
    }

    case 'date':
      return [<span key="d" className="text-white/85">{new Date().toString()}</span>];

    case 'pwd':
      return [<span key="p" className="text-white/85">/home/{profile.username}</span>];

    case 'echo':
      return [<span key="e" className="text-white/85">{args.join(' ')}</span>];

    case 'sudo':
      return [
        <span key="s" className="text-terminal-red">
          {`[sudo] password for ${profile.username}:`}
        </span>,
        <Dim key="j">Nice try. This one runs unprivileged.</Dim>,
      ];

    case 'exit':
    case 'logout':
      return [<Dim key="e">Close the window with the ✕ button — this shell has no way out.</Dim>];

    case 'clear':
      ctx.clear();
      return [];

    default:
      return [
        <span key="e" className="text-terminal-red">
          {`${cmd}: command not found`}
        </span>,
        <Dim key="h">Type `help` for the list of commands.</Dim>,
      ];
  }
}

export const COMPLETIONS = [
  'help', 'neofetch', 'whoami', 'about', 'ls', 'cat', 'docker ps', 'kubectl get pods',
  'systemctl status', 'htop', 'skills', 'gallery', 'resume', 'cv', 'ctf', 'contact',
  'social', 'open', 'date', 'pwd', 'echo', 'clear',
];

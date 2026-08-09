import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import {
  BriefcaseIcon,
  FilesIcon,
  FirefoxIcon,
  GalleryIcon,
  MailIcon,
  MonitorIcon,
  ResumeIcon,
  SettingsIcon,
  TerminalIcon,
  TextEditorIcon,
  TrashIcon,
} from '@/components/icons/AppIcons';

export type AppDefinition = {
  id: string;
  title: string;
  /**
   * What the app actually holds. Several titles are Ubuntu in-jokes
   * ("Career Services", "about.md") that tell a first-time visitor nothing,
   * so this is shown on hover and under the icon in the app grid.
   */
  description: string;
  /**
   * Extra search terms for the app grid, covering what a visitor would type
   * rather than what the app is called — "photos", "cv", "email".
   */
  keywords?: string[];
  Icon: ComponentType<{ className?: string }>;
  Component: LazyExoticComponent<ComponentType>;
  defaultSize: { w: number; h: number };
  /** Dock placement: 'main' is the top group, 'system' sits below the divider. */
  group: 'main' | 'system';
};

export const apps: AppDefinition[] = [
  {
    id: 'terminal',
    title: 'Terminal',
    description: 'Explore my background by command',
    keywords: ['shell', 'bash', 'console', 'cli', 'neofetch'],
    Icon: TerminalIcon,
    Component: lazy(() => import('./Terminal/Terminal')),
    defaultSize: { w: 800, h: 500 },
    group: 'main',
  },
  {
    id: 'files',
    title: 'Files',
    description: 'Browse my projects',
    keywords: ['projects', 'work', 'portfolio', 'nautilus'],
    Icon: FilesIcon,
    Component: lazy(() => import('./Files/Files')),
    defaultSize: { w: 920, h: 580 },
    group: 'main',
  },
  {
    id: 'about',
    title: 'about.md',
    description: 'About me',
    keywords: ['about', 'bio', 'who', 'profile'],
    Icon: TextEditorIcon,
    Component: lazy(() => import('./About/About')),
    defaultSize: { w: 780, h: 600 },
    group: 'main',
  },
  {
    id: 'resume',
    title: 'Resume',
    description: 'Read or download my CV',
    keywords: ['resume', 'cv', 'curriculum vitae', 'pdf', 'download', 'hire'],
    Icon: ResumeIcon,
    Component: lazy(() => import('./Resume/Resume')),
    defaultSize: { w: 860, h: 680 },
    group: 'main',
  },
  {
    id: 'experience',
    title: 'Career Services',
    description: 'Work experience',
    keywords: ['experience', 'jobs', 'career', 'internship'],
    Icon: BriefcaseIcon,
    Component: lazy(() => import('./Experience/Experience')),
    defaultSize: { w: 880, h: 620 },
    group: 'main',
  },
  {
    id: 'gallery',
    title: 'My Gallery',
    description: 'Events, talks and volunteering',
    keywords: ['photos', 'pictures', 'images', 'gallery', 'events'],
    Icon: GalleryIcon,
    Component: lazy(() => import('./Gallery/Gallery')),
    defaultSize: { w: 1000, h: 640 },
    group: 'main',
  },
  {
    id: 'monitor',
    title: 'System Monitor',
    description: 'My skills, shown as system load',
    keywords: ['skills', 'tech', 'stack', 'tools'],
    Icon: MonitorIcon,
    Component: lazy(() => import('./Monitor/Monitor')),
    defaultSize: { w: 900, h: 600 },
    group: 'main',
  },
  {
    id: 'firefox',
    title: 'Firefox',
    description: 'My links and live projects',
    keywords: ['browser', 'links', 'social', 'linkedin', 'github', 'medium'],
    Icon: FirefoxIcon,
    Component: lazy(() => import('./Firefox/Firefox')),
    defaultSize: { w: 1000, h: 640 },
    group: 'main',
  },
  {
    id: 'contact',
    title: 'Mail',
    description: 'Send me a message',
    keywords: ['contact', 'email', 'hire', 'message'],
    Icon: MailIcon,
    Component: lazy(() => import('./Contact/Contact')),
    defaultSize: { w: 640, h: 600 },
    group: 'main',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Appearance and accent colour',
    keywords: ['preferences', 'theme', 'wallpaper', 'accent'],
    Icon: SettingsIcon,
    Component: lazy(() => import('./Settings/Settings')),
    defaultSize: { w: 820, h: 560 },
    group: 'main',
  },
  {
    id: 'trash',
    title: 'Trash',
    description: 'Bad practices I threw out',
    keywords: ['bin', 'deleted', 'rubbish'],
    Icon: TrashIcon,
    Component: lazy(() => import('./Trash/Trash')),
    defaultSize: { w: 680, h: 460 },
    group: 'system',
  },
];

export const appMap = new Map(apps.map((app) => [app.id, app]));

export function getApp(id: string): AppDefinition | undefined {
  return appMap.get(id);
}

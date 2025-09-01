import dynamic from 'next/dynamic';
import { AppConfig } from '@/types/desktop';

// Lazy load components to improve initial bundle size
const ProjectsApp = dynamic(() => import('@/components/apps/ProjectsApp'), { ssr: false });
const AboutApp = dynamic(() => import('@/components/apps/AboutApp'), { ssr: false });
const SkillsApp = dynamic(() => import('@/components/apps/SkillsApp'), { ssr: false });
const ContactApp = dynamic(() => import('@/components/apps/ContactApp'), { ssr: false });
const SettingsApp = dynamic(() => import('@/components/apps/SettingsApp'), { ssr: false });
const ExtrasApp = dynamic(() => import('@/components/apps/ExtrasApp'), { ssr: false });

export const DOCK_APPS: AppConfig[] = [
  {
    id: 'projects',
    name: 'Projects',
    icon: '/icons/projects.svg',
    component: ProjectsApp,
    defaultSize: { width: 950, height: 800 },
    minSize: { width: 600, height: 400 },
    resizable: true,
    draggable: true,
  },
  {
    id: 'about',
    name: 'About Me',
    icon: '/icons/aboutme.svg',
    component: AboutApp,
    defaultSize: { width: 800, height: 600 },
    minSize: { width: 500, height: 400 },
    resizable: true,
    draggable: true,
  },
  {
    id: 'skills',
    name: 'Skills',
    icon: '/icons/skills.png',
    component: SkillsApp,
    defaultSize: { width: 1000, height: 650 },
    minSize: { width: 600, height: 450 },
    resizable: true,
    draggable: true,
  },
  {
    id: 'contact',
    name: 'Contact',
    icon: '/icons/contacts.svg',
    component: ContactApp,
    defaultSize: { width: 700, height: 500 },
    minSize: { width: 500, height: 400 },
    resizable: true,
    draggable: true,
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: '/icons/settings.svg',
    component: SettingsApp,
    defaultSize: { width: 1000, height: 800 },
    minSize: { width: 500, height: 400 },
    resizable: true,
    draggable: true,
  },
  {
    id: 'extras',
    name: 'Extras',
    icon: '/icons/extras.svg',
    component: ExtrasApp,
    defaultSize: { width: 850, height: 700 },
    minSize: { width: 500, height: 400 },
    resizable: true,
    draggable: true,
  },
];

export const NOTIFICATION_MESSAGES = [
  {
    title: 'Welcome!',
    message: 'Thanks for visiting my portfolio',
    type: 'info' as const,
  },
  {
    title: 'New Project',
    message: 'Check out my latest work in Projects',
    type: 'success' as const,
  },
  {
    title: 'System Update',
    message: 'Portfolio optimized for better performance',
    type: 'info' as const,
  },
  {
    title: 'Easter Egg Found',
    message: 'Try typing "help" in the terminal',
    type: 'success' as const,
  },
] as const;

export const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;

export const WINDOW_CONSTRAINTS = {
  minX: 0,
  minY: 0,
  maxX: () => window.innerWidth - 300,
  maxY: () => window.innerHeight - 200,
} as const;
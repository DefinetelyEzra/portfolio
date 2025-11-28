import dynamic from 'next/dynamic';
import { AppConfig } from '@/types/desktop';

// Factory function for lazy loading with consistent options
const createLazyApp = (importFn: () => Promise<any>) =>
  dynamic(importFn, {
    ssr: false,
    loading: () => null // Simple loading handled in Window component
  });

// Lazy load components only when needed using factory functions
const getProjectsApp = () => createLazyApp(() => import('@/components/apps/ProjectsApp'));
const getAboutApp = () => createLazyApp(() => import('@/components/apps/AboutApp'));
const getSkillsApp = () => createLazyApp(() => import('@/components/apps/SkillsApp'));
const getContactApp = () => createLazyApp(() => import('@/components/apps/ContactApp'));
const getSettingsApp = () => createLazyApp(() => import('@/components/apps/SettingsApp'));
const getExtrasApp = () => createLazyApp(() => import('@/components/apps/ExtrasApp'));

// Memoized app configurations to prevent recreation
export const DOCK_APPS: readonly AppConfig[] = [
  {
    id: 'projects',
    name: 'Projects',
    icon: '/icons/projects.svg',
    component: getProjectsApp(), // Component loaded only when app is opened
    defaultSize: { width: 950, height: 800 },
    minSize: { width: 600, height: 400 },
    resizable: true,
    draggable: true,
  },
  {
    id: 'about',
    name: 'About Me',
    icon: '/icons/aboutme.svg',
    component: getAboutApp(),
    defaultSize: { width: 800, height: 600 },
    minSize: { width: 500, height: 400 },
    resizable: true,
    draggable: true,
  },
  {
    id: 'skills',
    name: 'Skills',
    icon: '/icons/skills.png',
    component: getSkillsApp(),
    defaultSize: { width: 1000, height: 650 },
    minSize: { width: 600, height: 450 },
    resizable: true,
    draggable: true,
  },
  {
    id: 'contact',
    name: 'Contact',
    icon: '/icons/contacts.svg',
    component: getContactApp(),
    defaultSize: { width: 700, height: 500 },
    minSize: { width: 500, height: 400 },
    resizable: true,
    draggable: true,
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: '/icons/settings.svg',
    component: getSettingsApp(),
    defaultSize: { width: 1000, height: 800 },
    minSize: { width: 500, height: 400 },
    resizable: true,
    draggable: true,
  },
  {
    id: 'extras',
    name: 'Extras',
    icon: '/icons/extras.svg',
    component: getExtrasApp(),
    defaultSize: { width: 850, height: 700 },
    minSize: { width: 500, height: 400 },
    resizable: true,
    draggable: true,
  },
] as const;

// Predefined notification messages
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

// Breakpoint constants
export const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;

// Window constraints with safe window access
export const WINDOW_CONSTRAINTS = {
  minX: 0,
  minY: 0,
  maxX: () => (globalThis.window === undefined ? 1024 : window.innerWidth - 300),
  maxY: () => (globalThis.window === undefined ? 768 : window.innerHeight - 200),
} as const;

// Export app IDs as constants for type safety
export const APP_IDS = {
  PROJECTS: 'projects',
  ABOUT: 'about',
  SKILLS: 'skills',
  CONTACT: 'contact',
  SETTINGS: 'settings',
  EXTRAS: 'extras',
} as const;

// Helper to get app by ID
export const getAppById = (id: string) =>
  DOCK_APPS.find(app => app.id === id);

// Helper to check if app exists
export const isValidAppId = (id: string): id is AppConfig['id'] =>
  DOCK_APPS.some(app => app.id === id);
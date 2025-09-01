import { CalendarEvent, CalendarEventType, FunFact } from '@/types/calendar';

/**
 * Get the days for a calendar month view (including days from prev/next month)
 */
export function getCalendarDays(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);
  
  // Start from the beginning of the week containing the first day
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  
  // End at the end of the week containing the last day
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
  
  const days: Date[] = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return days;
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Format a date for display
 */
export function formatDateForDisplay(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get portfolio events and milestones
 */
export function getPortfolioEvents(): CalendarEvent[] {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  return [
    // Project Milestones
    {
      id: 'portfolio-launch',
      title: 'Portfolio Website Launch',
      description: 'Launched this interactive macOS-style portfolio website with advanced animations and widget system.',
      date: new Date(currentYear, currentMonth - 2, 15),
      type: 'project' as CalendarEventType,
      metadata: {
        projectId: 'portfolio',
        tags: ['React', 'TypeScript', 'Next.js', 'Framer Motion'],
        link: '/'
      }
    },
    {
      id: 'widget-system',
      title: 'Widget System Implementation',
      description: 'Implemented a fully functional widget system with drag & drop, resizing, and persistence.',
      date: new Date(currentYear, currentMonth - 1, 8),
      type: 'milestone' as CalendarEventType,
      metadata: {
        projectId: 'portfolio',
        tags: ['Widgets', 'State Management', 'UX'],
      }
    },
    
    // Skill Acquisitions
    {
      id: 'typescript-mastery',
      title: 'TypeScript Advanced Features',
      description: 'Mastered advanced TypeScript features including conditional types, mapped types, and template literals.',
      date: new Date(currentYear, currentMonth - 3, 22),
      type: 'skill' as CalendarEventType,
      metadata: {
        skillLevel: 90,
        tags: ['TypeScript', 'Advanced Types'],
      }
    },
    {
      id: 'animation-skills',
      title: 'Animation & Micro-interactions',
      description: 'Enhanced skills in creating smooth animations and delightful micro-interactions using Framer Motion.',
      date: new Date(currentYear, currentMonth - 1, 12),
      type: 'skill' as CalendarEventType,
      metadata: {
        skillLevel: 85,
        tags: ['Animation', 'UX', 'Framer Motion'],
      }
    },
    
    // Future Events
    {
      id: 'next-project-planning',
      title: 'Next Project: AI Dashboard',
      description: 'Planning and research phase for an AI-powered analytics dashboard project.',
      date: new Date(currentYear, currentMonth + 1, 5),
      type: 'project' as CalendarEventType,
      metadata: {
        tags: ['AI', 'Dashboard', 'Planning'],
      }
    },
    {
      id: 'skill-upgrade-react19',
      title: 'React 19 Features Study',
      description: 'Studying and implementing React 19 new features and improvements.',
      date: new Date(currentYear, currentMonth + 1, 20),
      type: 'skill' as CalendarEventType,
      metadata: {
        skillLevel: 75,
        tags: ['React', 'Latest Features'],
      }
    },
    
    // Recurring Events
    {
      id: 'weekly-skill-practice',
      title: 'Weekly Coding Practice',
      description: 'Regular coding practice and algorithm solving session.',
      date: new Date(currentYear, currentMonth, getNextFriday().getDate()),
      type: 'personal' as CalendarEventType,
      isRecurring: true,
      metadata: {
        tags: ['Practice', 'Algorithms'],
      }
    }
  ];
}

/**
 * Get random fun facts for empty dates
 */
export function getRandomFunFact(): string {
  const funFacts: FunFact[] = [
    {
      id: 'fact-1',
      text: 'This portfolio uses over 50 custom animations!',
      category: 'tech'
    },
    {
      id: 'fact-2',
      text: 'The widget system supports unlimited widgets with persistence.',
      category: 'portfolio'
    },
    {
      id: 'fact-3',
      text: 'Every interaction has been carefully crafted for the best UX.',
      category: 'personal'
    },
    {
      id: 'fact-4',
      text: 'There are hidden Easter eggs throughout the site. Keep exploring!',
      category: 'random',
      isEasterEgg: true
    },
    {
      id: 'fact-5',
      text: 'The desktop wallpaper can cycle automatically with customizable speed.',
      category: 'tech'
    },
    {
      id: 'fact-6',
      text: 'This calendar widget updates in real-time with portfolio milestones.',
      category: 'portfolio'
    },
    {
      id: 'fact-7',
      text: 'The glassmorphism effects adapt to your system theme preferences.',
      category: 'tech'
    },
    {
      id: 'fact-8',
      text: 'The notification system mimics real macOS notifications.',
      category: 'tech'
    },
    {
      id: 'fact-9',
      text: 'The dock has realistic bounce animations and hover effects.',
      category: 'portfolio'
    },
    {
      id: 'fact-10',
      text: 'This project uses TypeScript for 100% type safety.',
      category: 'tech'
    }
  ];
  
  return funFacts[Math.floor(Math.random() * funFacts.length)].text;
}

/**
 * Helper function to get the next Friday
 */
function getNextFriday(): Date {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
  
  const nextFriday = new Date(today);
  nextFriday.setDate(today.getDate() + daysUntilFriday);
  
  return nextFriday;
}

/**
 * Get events for a specific month
 */
export function getEventsForMonth(year: number, month: number): CalendarEvent[] {
  const events = getPortfolioEvents();
  return events.filter(event => 
    event.date.getFullYear() === year && 
    event.date.getMonth() === month
  );
}

/**
 * Get the number of events for a specific date
 */
export function getEventCountForDate(date: Date, events: CalendarEvent[]): number {
  return events.filter(event => isSameDay(event.date, date)).length;
}

/**
 * Sort events by date and importance
 */
export function sortEventsByImportance(events: CalendarEvent[]): CalendarEvent[] {
  const importanceOrder: Record<CalendarEventType, number> = {
    'milestone': 1,
    'project': 2,
    'skill': 3,
    'personal': 4,
  };
  
  return [...events].sort((a, b) => {
    const importanceA = importanceOrder[a.type] || 5;
    const importanceB = importanceOrder[b.type] || 5;
    
    if (importanceA !== importanceB) {
      return importanceA - importanceB;
    }
    
    return a.date.getTime() - b.date.getTime();
  });
}
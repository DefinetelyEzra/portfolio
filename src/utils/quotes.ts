export interface Quote {
  readonly text: string;
  readonly author: string;
  readonly category: 'tech' | 'motivation' | 'personal' | 'easter-egg';
  readonly isPersonal?: boolean;
}

export const QUOTES: readonly Quote[] = [
  // Tech Quotes
  {
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House",
    category: 'tech'
  },
  {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
    category: 'tech'
  },
  {
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
    category: 'tech'
  },
  {
    text: "The best error message is the one that never shows up.",
    author: "Thomas Fuchs",
    category: 'tech'
  },
  {
    text: "Programming is not about what you know; it's about what you can figure out.",
    author: "Chris Pine",
    category: 'tech'
  },
  {
    text: "Clean code always looks like it was written by someone who cares.",
    author: "Robert C. Martin",
    category: 'tech'
  },
  {
    text: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
    category: 'tech'
  },
  {
    text: "Make it work, make it right, make it fast.",
    author: "Kent Beck",
    category: 'tech'
  },

  // Motivational Quotes
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: 'motivation'
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    category: 'motivation'
  },
  {
    text: "Stay hungry, stay foolish.",
    author: "Steve Jobs",
    category: 'motivation'
  },
  {
    text: "Your limitation, it's only your imagination.",
    author: "Anonymous",
    category: 'motivation'
  },
  {
    text: "Push yourself, because no one else is going to do it for you.",
    author: "Anonymous",
    category: 'motivation'
  },
  {
    text: "Great things never come from comfort zones.",
    author: "Anonymous",
    category: 'motivation'
  },
  {
    text: "Dream it. Wish it. Do it.",
    author: "Anonymous",
    category: 'motivation'
  },
  {
    text: "Success doesn't just find you. You have to go out and get it.",
    author: "Anonymous",
    category: 'motivation'
  },

  // Personal/Portfolio Quotes
  {
    text: "Building digital experiences that bridge creativity and functionality.",
    author: "Your Portfolio Philosophy",
    category: 'personal',
    isPersonal: true
  },
  {
    text: "Every pixel has a purpose, every interaction tells a story.",
    author: "My Design Approach",
    category: 'personal',
    isPersonal: true
  },
  {
    text: "Code is poetry written in logic.",
    author: "My Coding Philosophy",
    category: 'personal',
    isPersonal: true
  },

  // Easter Eggs 
  {
    text: "You've been clicking quotes for a while... I like your curiosity!",
    author: "Secret Message #1",
    category: 'easter-egg'
  },
  {
    text: "Konami Code enthusiast detected. ↑↑↓↓←→←→BA",
    author: "Secret Message #2",
    category: 'easter-egg'
  },
  {
    text: "If you're reading this, you found the hidden quote rotation!",
    author: "Secret Message #3",
    category: 'easter-egg'
  },
  {
    text: "42 - The answer to life, the universe, and everything...",
    author: "Secret Message #4",
    category: 'easter-egg'
  },
] as const;

export const QUOTE_REFRESH_INTERVALS = {
  slow: 120000,    // 2 minutes
  normal: 60000,   // 1 minute
  fast: 30000,     // 30 seconds
  manual: 0        // No auto-refresh
} as const;

export const EASTER_EGG_THRESHOLDS = {
  firstEasterEgg: 10,    // After 10 manual refreshes
  secretRotation: 25,    // After 25 total refreshes
  konamiCode: 50         // After 50 refreshes or special input
} as const;

/**
 * Get a random quote from the specified categories
 */
export function getRandomQuote(
  categories: readonly Quote['category'][] = ['tech', 'motivation', 'personal'],
  excludeEasterEggs = true
): Quote {
  try {
    let filteredQuotes = QUOTES.filter(quote => 
      categories.includes(quote.category)
    );

    if (excludeEasterEggs) {
      filteredQuotes = filteredQuotes.filter(quote => 
        quote.category !== 'easter-egg'
      );
    }

    if (filteredQuotes.length === 0) {
      // Fallback to all non-easter-egg quotes
      filteredQuotes = QUOTES.filter(quote => quote.category !== 'easter-egg');
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    return filteredQuotes[randomIndex] || QUOTES[0];
  } catch (error) {
    console.warn('Error getting random quote:', error);
    // Return the first quote as fallback
    return QUOTES[0];
  }
}

/**
 * Get an easter egg quote based on refresh count
 */
export function getEasterEggQuote(refreshCount: number): Quote | null {
  try {
    const easterEggs = QUOTES.filter(quote => quote.category === 'easter-egg');
    
    if (refreshCount >= EASTER_EGG_THRESHOLDS.konamiCode) {
      return easterEggs[4] || null; // "This portfolio was crafted with..."
    } else if (refreshCount >= EASTER_EGG_THRESHOLDS.secretRotation) {
      return easterEggs[2] || null; // "If you're reading this..."
    } else if (refreshCount >= EASTER_EGG_THRESHOLDS.firstEasterEgg) {
      return easterEggs[0] || null; // "You've been clicking quotes..."
    }
    
    return null;
  } catch (error) {
    console.warn('Error getting easter egg quote:', error);
    return null;
  }
}

/**
 * Get quotes by category
 */
export function getQuotesByCategory(category: Quote['category']): readonly Quote[] {
  try {
    return QUOTES.filter(quote => quote.category === category);
  } catch (error) {
    console.warn('Error getting quotes by category:', error);
    return [];
  }
}
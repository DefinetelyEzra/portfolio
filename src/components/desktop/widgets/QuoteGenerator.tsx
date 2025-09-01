import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Quote as QuoteIcon, Heart, Sparkles } from 'lucide-react';
import BaseWidget from './BaseWidget';
import { WidgetState } from '@/types/widget';
import { getRandomQuote, getEasterEggQuote, Quote, QUOTE_REFRESH_INTERVALS } from '@/utils/quotes';
import { useDesktopStore } from '@/store/desktopStore';

interface QuoteGeneratorProps {
  readonly widget: WidgetState;
  readonly onClose: () => void;
}

interface QuoteSettings {
  autoRefresh: boolean;
  refreshInterval: keyof typeof QUOTE_REFRESH_INTERVALS;
  categories: readonly Quote['category'][];
  showAuthor: boolean;
  animationType: 'flip' | 'fade' | 'slide';
  enableEasterEggs: boolean;
}

const DEFAULT_SETTINGS: QuoteSettings = {
  autoRefresh: true,
  refreshInterval: 'normal',
  categories: ['tech', 'motivation', 'personal'],
  showAuthor: true,
  animationType: 'flip',
  enableEasterEggs: true,
};

const getThemeStyles = (currentTheme: string) => ({
  background: currentTheme === 'dark'
    ? 'from-gray-900 via-gray-800 to-gray-700'
    : 'from-indigo-50 via-white to-purple-50',

  text: {
    primary: currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-800',
    secondary: currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    muted: 'text-gray-500',
    accent: currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600',
    author: currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500',
  },

  button: {
    idle: currentTheme === 'dark'
      ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20'
      : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50',
    disabled: currentTheme === 'dark'
      ? 'text-gray-600 cursor-not-allowed'
      : 'text-gray-400 cursor-not-allowed',
  },

  categories: {
    tech: currentTheme === 'dark'
      ? 'bg-blue-900/30 text-blue-400'
      : 'bg-blue-100 text-blue-600',
    motivation: currentTheme === 'dark'
      ? 'bg-green-900/30 text-green-400'
      : 'bg-green-100 text-green-600',
    personal: currentTheme === 'dark'
      ? 'bg-purple-900/30 text-purple-400'
      : 'bg-purple-100 text-purple-600',
    'easter-egg': currentTheme === 'dark'
      ? 'bg-yellow-900/30 text-yellow-400'
      : 'bg-yellow-100 text-yellow-600',
  },

  easterEgg: {
    text: currentTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
    sparkle: 'text-yellow-500',
    stats: currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400',
  },

  heart: 'text-red-400',
});

export default function QuoteGenerator({
  widget,
  onClose,
}: QuoteGeneratorProps) {
  const settings = { ...DEFAULT_SETTINGS, ...widget.settings } as QuoteSettings;
  const { currentTheme } = useDesktopStore();
  const styles = getThemeStyles(currentTheme);

  const [currentQuote, setCurrentQuote] = useState<Quote>(() =>
    getRandomQuote(settings.categories)
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  // Handle quote refresh with animation
  const refreshQuote = useCallback((isManual = true) => {
    try {
      setIsRefreshing(true);

      setTimeout(() => {
        let newQuote: Quote;
        let isEasterEgg = false;

        // Check for easter eggs on manual refresh
        if (isManual && settings.enableEasterEggs) {
          const newRefreshCount = refreshCount + 1;
          setRefreshCount(newRefreshCount);

          const easterEggQuote = getEasterEggQuote(newRefreshCount);
          if (easterEggQuote && Math.random() < 0.3) { // 30% chance to show easter egg when available
            newQuote = easterEggQuote;
            isEasterEgg = true;
            setShowEasterEgg(true);

            // Hide easter egg indicator after 3 seconds
            setTimeout(() => setShowEasterEgg(false), 3000);
          } else {
            newQuote = getRandomQuote(settings.categories);
          }
        } else {
          newQuote = getRandomQuote(settings.categories);
        }

        setCurrentQuote(newQuote);
        setIsRefreshing(false);

        // Add a subtle notification for easter eggs
        if (isEasterEgg && typeof window !== 'undefined') {
          // Could trigger a desktop notification here if needed
          console.log('🎉 Easter egg quote discovered!');
        }
      }, 300); // Delay for animation
    } catch (error) {
      console.error('Error refreshing quote:', error);
      setIsRefreshing(false);
    }
  }, [refreshCount, settings.categories, settings.enableEasterEggs]);

  // Auto-refresh timer
  useEffect(() => {
    if (!settings.autoRefresh || settings.refreshInterval === 'manual') {
      return;
    }

    const interval = QUOTE_REFRESH_INTERVALS[settings.refreshInterval];
    const timer = setInterval(() => {
      refreshQuote(false); // Auto refresh doesn't count toward easter eggs
    }, interval);

    return () => clearInterval(timer);
  }, [settings.autoRefresh, settings.refreshInterval, settings.categories, refreshQuote]);

  // Animation variants
  const quoteVariants = {
    flip: {
      initial: { rotateY: -90, opacity: 0 },
      animate: { rotateY: 0, opacity: 1 },
      exit: { rotateY: 90, opacity: 0 }
    },
    fade: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 }
    },
    slide: {
      initial: { x: -20, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 20, opacity: 0 }
    }
  };

  const currentVariant = quoteVariants[settings.animationType];

  return (
    <BaseWidget
      widget={widget}
      title='Some Quotes'
      onClose={onClose}
    >
      <div className="h-full flex flex-col p-4 relative overflow-hidden quote-generator">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center gap-2 ${styles.text.secondary}`}>
            <QuoteIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Daily Wisdom</span>
            {showEasterEgg && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className={`flex items-center gap-1 ${styles.easterEgg.sparkle}`}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            )}
          </div>

          <button
            onClick={() => refreshQuote(true)}
            disabled={isRefreshing}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${isRefreshing
                ? styles.button.disabled
                : styles.button.idle
              }
            `}
            aria-label="Refresh quote"
          >
            <RefreshCw
              className={`w-4 h-4 transition-transform duration-300 ${isRefreshing ? 'animate-spin' : ''
                }`}
            />
          </button>
        </div>

        {/* Quote Content */}
        <div className="flex-1 flex items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuote.text}
              variants={currentVariant}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                duration: 0.3,
                ease: "easeInOut"
              }}
              className="space-y-3"
              style={{ perspective: '1000px' }}
            >
              {/* Quote Text */}
              <blockquote className={`
                leading-relaxed
                ${widget.size.width < 350 ? 'text-sm' : 'text-base'}
                ${currentQuote.category === 'easter-egg'
                  ? `${styles.easterEgg.text} font-medium`
                  : styles.text.primary
                }
              `}>
                &ldquo;{currentQuote.text}&rdquo;
              </blockquote>

              {/* Author */}
              {settings.showAuthor && (
                <cite className={`
                  block ${styles.text.author} text-sm not-italic
                  ${currentQuote.isPersonal ? 'flex items-center justify-center gap-1' : ''}
                `}>
                  — {currentQuote.author}
                  {currentQuote.isPersonal && (
                    <Heart className={`w-3 h-3 ${styles.heart}`} />
                  )}
                </cite>
              )}

              {/* Category Indicator */}
              <div className="flex justify-center">
                <span className={`
                  inline-block px-2 py-1 rounded-full text-xs
                  ${styles.categories[currentQuote.category] || styles.categories.tech}
                `}>
                  {currentQuote.category === 'easter-egg' ? '✨ Special' : currentQuote.category}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Stats Footer */}
        {settings.enableEasterEggs && refreshCount > 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-2"
          >
            <span className={`text-xs ${styles.easterEgg.stats}`}>
              Refreshed {refreshCount} times
              {refreshCount >= 10 && ' 🎉'}
            </span>
          </motion.div>
        )}
      </div>
    </BaseWidget>
  );
}
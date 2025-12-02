'use client';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, FileText, Code, User, Mail, Star, Folder } from 'lucide-react';
import { useDesktopStore } from '@/store/desktopStore';
interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: 'apps' | 'projects' | 'skills' | 'content';
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
}
interface SearchSpotlightSettings {
  showSuggestions: boolean;
  maxResults: number;
  searchCategories: string[];
  animateResults: boolean;
}
const getThemeStyles = (currentTheme: string) => ({
  background: currentTheme === 'dark'
    ? 'from-gray-900 via-gray-800 to-gray-700'
    : 'from-indigo-50 via-white to-purple-50',
  searchInput: currentTheme === 'dark'
    ? 'bg-gray-800/90 border-gray-700/50 text-gray-100 placeholder-gray-400'
    : 'bg-white/90 border-gray-200/50 text-gray-900 placeholder-gray-500',
  resultsContainer: currentTheme === 'dark'
    ? 'bg-gray-800/95 border-gray-700/50'
    : 'bg-white/95 border-gray-200/50',
  resultItem: {
    base: currentTheme === 'dark'
      ? 'hover:bg-blue-900/20 text-gray-100'
      : 'hover:bg-blue-50 text-gray-900',
    selected: currentTheme === 'dark'
      ? 'bg-blue-900/30'
      : 'bg-blue-100',
    iconBg: currentTheme === 'dark'
      ? 'bg-gray-700'
      : 'bg-gray-100'
  },
  text: {
    primary: currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900',
    secondary: currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    muted: currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400',
    accent: currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600',
  },
  footerBg: currentTheme === 'dark'
    ? 'bg-gray-900/50 border-gray-700/50'
    : 'bg-gray-50/50 border-gray-200/50',
  clearButton: currentTheme === 'dark'
    ? 'text-gray-400 hover:text-gray-300'
    : 'text-gray-400 hover:text-gray-600'
});
const SearchResultItem: React.FC<{
  result: SearchResult & { index: number };
  isSelected: boolean;
  onClick: (result: SearchResult) => void;
  animateResults: boolean;
  styles: ReturnType<typeof getThemeStyles>;
}> = ({ result, isSelected, onClick, animateResults, styles }) => {
  const categoryIcons = {
    apps: <Command className="w-3 h-3 opacity-60" />,
    projects: <Code className="w-3 h-3 opacity-60" />,
    skills: <Star className="w-3 h-3 opacity-60" />,
    content: <FileText className="w-3 h-3 opacity-60" />,
  };
  return (
    <motion.button
      initial={animateResults ? { opacity: 0, x: -20 } : undefined}
      animate={animateResults ? { opacity: 1, x: 0 } : undefined}
      transition={animateResults ? { delay: result.index * 0.05 } : undefined}
      onClick={() => onClick(result)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${styles.resultItem.base} ${isSelected ? styles.resultItem.selected : 'bg-transparent'}`}
    >
      <div className={`shrink-0 flex items-center justify-center w-8 h-8 ${styles.resultItem.iconBg} rounded-md`}>
        {result.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className={`font-medium ${styles.text.primary} truncate`}>{result.title}</h4>
          <span className={styles.text.secondary}>
            {categoryIcons[result.category]}
          </span>
        </div>
        <p className={`text-sm ${styles.text.secondary} truncate`}>{result.description}</p>
      </div>
    </motion.button>
  );
};
export default function SearchSpotlight() {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { openWindow, currentTheme } = useDesktopStore();
  const styles = getThemeStyles(currentTheme);
  const settings: SearchSpotlightSettings = {
    showSuggestions: true,
    maxResults: 6,
    searchCategories: ['apps', 'projects', 'skills', 'content'],
    animateResults: true,
  };
  const searchableContent: SearchResult[] = useMemo(
    () => [
      {
        id: 'about-app',
        title: 'About',
        description: 'Learn more about me and my background',
        category: 'apps',
        icon: <User className={`w-4 h-4 ${styles.text.accent}`} />,
        action: () => openWindow('about'),
        keywords: ['about', 'bio', 'background', 'personal', 'me', 'developer'],
      },
      {
        id: 'projects-app',
        title: 'Projects',
        description: 'View my portfolio projects and work',
        category: 'apps',
        icon: <Folder className={`w-4 h-4 ${styles.text.accent}`} />,
        action: () => openWindow('projects'),
        keywords: ['projects', 'portfolio', 'work', 'development', 'code'],
      },
      {
        id: 'skills-app',
        title: 'Skills',
        description: 'Explore my technical skills and expertise',
        category: 'apps',
        icon: <Star className={`w-4 h-4 ${styles.text.accent}`} />,
        action: () => openWindow('skills'),
        keywords: ['skills', 'tech', 'technology', 'expertise', 'programming'],
      },
      {
        id: 'contact-app',
        title: 'Contact',
        description: 'Get in touch with me',
        category: 'apps',
        icon: <Mail className={`w-4 h-4 ${styles.text.accent}`} />,
        action: () => openWindow('contact'),
        keywords: ['contact', 'email', 'reach', 'touch', 'message', 'connect'],
      },
      {
        id: 'settings-app',
        title: 'Settings',
        description: 'Customize your desktop experience',
        category: 'apps',
        icon: <Command className={`w-4 h-4 ${styles.text.accent}`} />,
        action: () => openWindow('settings'),
        keywords: ['settings', 'preferences', 'customize', 'configure', 'options'],
      },
      {
        id: 'project-1',
        title: 'React Portfolio Website',
        description: 'This interactive macOS-style portfolio',
        category: 'projects',
        icon: <Code className={`w-4 h-4 ${styles.text.accent}`} />,
        action: () => openWindow('projects'),
        keywords: ['react', 'portfolio', 'website', 'macos', 'interactive', 'nextjs'],
      },
      {
        id: 'skill-react',
        title: 'React & Next.js',
        description: 'Frontend development expertise',
        category: 'skills',
        icon: <Star className={`w-4 h-4 ${styles.text.accent}`} />,
        action: () => openWindow('skills'),
        keywords: ['react', 'nextjs', 'frontend', 'javascript', 'typescript', 'jsx'],
      },
    ],
    [openWindow, styles.text.accent]
  );
  const matchesQuery = (item: SearchResult, words: string[]) => {
    return words.some((word) =>
      item.title.toLowerCase().includes(word) ||
      item.description.toLowerCase().includes(word) ||
      item.keywords.some((keyword) => keyword.toLowerCase().includes(word))
    );
  };
  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    const normalizedQuery = query.toLowerCase().trim();
    const words = normalizedQuery.split(' ').filter((word) => word.length > 0);
    return searchableContent
      .filter((item) => {
        if (!settings.searchCategories.includes(item.category)) return false;
        return matchesQuery(item, words);
      })
      .slice(0, settings.maxResults)
      .map((item, index) => ({ ...item, index }));
  }, [query, searchableContent, settings.searchCategories, settings.maxResults]);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isExpanded || filteredResults.length === 0) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          handleResultClick(filteredResults[selectedIndex]);
        }
        break;
      case 'Escape':
        setQuery('');
        setIsExpanded(false);
        inputRef.current?.blur();
        break;
    }
  };
  const handleResultClick = (result: SearchResult) => {
    result.action();
    setQuery('');
    setIsExpanded(false);
    setSelectedIndex(0);
    inputRef.current?.blur();
  };
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults.length]);
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      data-tutorial="search-spotlight"
      className="fixed top-5 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="relative">
        <div className={`relative flex items-center ${styles.searchInput} backdrop-blur-sm rounded-lg border shadow-lg`}>
          <Search className={`w-5 h-5 ${styles.text.secondary} ml-3 shrink-0`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => setTimeout(() => setIsExpanded(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder="Search apps, projects, skills..."
            className="flex-1 bg-transparent px-3 py-3 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className={`p-2 ${styles.clearButton} transition-colors`}
            >
              <Command className="w-4 h-4" />
            </button>
          )}
        </div>
        <AnimatePresence>
          {isExpanded && filteredResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`absolute top-full left-0 right-0 mt-2 ${styles.resultsContainer} backdrop-blur-md rounded-lg border shadow-xl overflow-hidden z-60`}
            >
              <div className="max-h-72 overflow-y-auto">
                {filteredResults.map((result) => (
                  <SearchResultItem
                    key={result.id}
                    result={result}
                    isSelected={result.index === selectedIndex}
                    onClick={handleResultClick}
                    animateResults={settings.animateResults}
                    styles={styles}
                  />
                ))}
              </div>
              <div className={`border-t ${styles.footerBg} px-4 py-2`}>
                <p className={`text-xs ${styles.text.muted}`}>
                  Use ↑↓ to navigate • Enter to select • Esc to close
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isExpanded && query.trim() && filteredResults.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute top-full left-0 right-0 mt-2 ${styles.resultsContainer} backdrop-blur-md rounded-lg border shadow-xl p-4 z-60`}
            >
              <div className={`text-center ${styles.text.secondary}`}>
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No results found for &lsquo;{query}&rsquo;</p>
                <p className={`text-xs mt-1 ${styles.text.muted}`}>Try searching for apps, projects, or skills</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
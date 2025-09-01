'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Zap, RotateCw, Info, Star } from 'lucide-react';
import BaseWidget from './BaseWidget';
import { BaseWidgetProps } from '@/types/widget';
import { SKILLS_DATA, getRandomSkill, getSkillLevelInfo, getCategoryInfo, Skill } from '@/utils/skillsData';
import { useDesktopStore } from '@/store/desktopStore';

// Define GaugeDisplayProps to pass required data as props
interface GaugeDisplayProps {
  currentSkill: Skill;
  displayLevel: number;
  isBoosting: boolean;
  styles: ReturnType<typeof getThemeStyles>;
}

const getThemeStyles = (currentTheme: string) => ({
  background: currentTheme === 'dark'
    ? 'from-gray-900 via-gray-800 to-gray-700'
    : 'from-indigo-50 via-white to-purple-50',

  widget: {
    background: currentTheme === 'dark'
      ? 'bg-gray-800/95'
      : 'bg-white/95',
    border: currentTheme === 'dark'
      ? 'border-gray-700/20'
      : 'border-white/20',
  },

  text: {
    primary: currentTheme === 'dark' ? 'text-white' : 'text-gray-900',
    secondary: currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700',
    muted: currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    accent: currentTheme === 'dark' ? 'text-indigo-400' : 'text-indigo-500',
    details: currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600',
  },

  gauge: {
    background: currentTheme === 'dark' ? 'text-gray-700' : 'text-gray-200',
    centerText: currentTheme === 'dark' ? 'text-white' : 'text-gray-900',
  },

  button: {
    base: currentTheme === 'dark'
      ? 'hover:bg-gray-700'
      : 'hover:bg-gray-100',
    icon: currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500',
  },

  boost: {
    gradient: currentTheme === 'dark'
      ? 'from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800'
      : 'from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700',
    text: 'text-white',
  },

  details: {
    border: currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    background: currentTheme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50/50',
  },

  sparkle: {
    color: 'text-yellow-400',
    glow: '#FFD700',
  },
});

// GaugeDisplay component 
const GaugeDisplay = ({ currentSkill, displayLevel, isBoosting, styles }: GaugeDisplayProps) => {
  const radius = 42;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (displayLevel / 100) * circumference;

  return (
    <div className="relative w-[100px] h-[100px] mx-auto mb-3">
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className={styles.gauge.background}
        />
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          stroke={currentSkill.color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: strokeDashoffset,
            stroke: isBoosting ? styles.sparkle.glow : currentSkill.color,
          }}
          transition={{
            strokeDashoffset: { duration: 1, ease: "easeOut" },
            stroke: { duration: 0.3 },
          }}
          style={{
            strokeDasharray,
            filter: isBoosting ? `drop-shadow(0 0 6px ${styles.sparkle.glow}66)` : 'none',
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          className="text-lg mb-1"
          animate={{ scale: isBoosting ? 1.2 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {currentSkill.icon}
        </motion.div>
        <motion.div
          className={`text-sm font-bold ${styles.gauge.centerText}`}
          animate={{
            scale: isBoosting ? 1.1 : 1,
            color: isBoosting ? styles.sparkle.glow : undefined,
          }}
          transition={{ duration: 0.3 }}
        >
          {Math.round(displayLevel)}%
        </motion.div>
      </div>

      {/* Boost sparkles */}
      <AnimatePresence>
        {isBoosting && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`sparkle-${currentSkill.name}-${i}`}
                className={`absolute ${styles.sparkle.color} text-xs pointer-events-none`}
                initial={{
                  scale: 0,
                  x: 50,
                  y: 50,
                  opacity: 1,
                }}
                animate={{
                  scale: [0, 1, 0],
                  x: 50 + Math.cos(i * 60 * Math.PI / 180) * 30,
                  y: 50 + Math.sin(i * 60 * Math.PI / 180) * 30,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
              >
                ✨
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function SkillMeter({ widget, onClose }: Readonly<BaseWidgetProps>) {
  const { currentTheme } = useDesktopStore();
  const styles = getThemeStyles(currentTheme);
  
  const [currentSkill, setCurrentSkill] = useState<Skill>(SKILLS_DATA[0]);
  const [isBoosting, setIsBoosting] = useState(false);
  const [boostValue, setBoostValue] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [rotationTimer, setRotationTimer] = useState<NodeJS.Timeout | null>(null);

  // Get settings with defaults
  const settings = useMemo(() => ({
    autoRotate: widget.settings.autoRotate ?? true,
    rotationInterval: (widget.settings.rotationInterval as number) ?? 15,
    showBoostEffect: widget.settings.showBoostEffect ?? true,
    displayMode: widget.settings.displayMode ?? 'gauge',
    theme: widget.settings.theme ?? 'auto',
    showDetails: widget.settings.showDetails ?? true,
    categories: (widget.settings.categories as string[]) ?? ['all'],
  }), [widget.settings]);

  // Filter skills based on selected categories
  const availableSkills = useMemo(() => {
    if (settings.categories.includes('all')) return SKILLS_DATA;
    return SKILLS_DATA.filter(skill =>
      settings.categories.some((cat: string) => skill.category === cat)
    );
  }, [settings.categories]);

  const rotationTimerRef = useRef<NodeJS.Timeout | null>(null); 

  const rotateSkill = useCallback(() => {
    if (availableSkills.length <= 1) return;
    setTimeout(() => {
      const newSkill = getRandomSkill(currentSkill.name);
      setCurrentSkill(availableSkills.includes(newSkill) ? newSkill : availableSkills[Math.floor(Math.random() * availableSkills.length)]);
    }, 300);
  }, [currentSkill.name, availableSkills]);

  // Set up auto-rotation timer
  useEffect(() => {
    if (settings.autoRotate && availableSkills.length > 1) {
      const timer = setInterval(rotateSkill, settings.rotationInterval * 1000);
      rotationTimerRef.current = timer;  
      return () => clearInterval(timer);
    } else if (rotationTimerRef.current) {
      clearInterval(rotationTimerRef.current);
      rotationTimerRef.current = null;  
    }
  }, [settings.autoRotate, settings.rotationInterval, rotateSkill, availableSkills.length]);

  // Boost effect
  const handleBoost = useCallback(() => {
    if (!settings.showBoostEffect || isBoosting) return;

    setIsBoosting(true);
    setBoostValue(5); // Temporary boost

    setTimeout(() => {
      setBoostValue(0);
      setIsBoosting(false);
    }, 2000);
  }, [settings.showBoostEffect, isBoosting]);

  // Manual skill rotation
  const handleManualRotate = useCallback(() => {
    if (availableSkills.length <= 1) return;

    // Reset auto-rotation timer
    if (rotationTimer) {
      clearInterval(rotationTimer);
    }

    rotateSkill();

    // Restart auto-rotation if enabled
    if (settings.autoRotate) {
      const timer = setInterval(rotateSkill, settings.rotationInterval * 1000);
      setRotationTimer(timer);
    }
  }, [availableSkills.length, rotationTimer, rotateSkill, settings.autoRotate, settings.rotationInterval]);

  // Get current skill info
  const skillLevel = getSkillLevelInfo(currentSkill.level);
  const categoryInfo = getCategoryInfo(currentSkill.category);
  const displayLevel = Math.min(100, currentSkill.level + boostValue);

  return (
    <BaseWidget
      widget={widget}
      onClose={onClose}
      title="Skill Meter"
      className={`${styles.widget.background} backdrop-blur-sm border ${styles.widget.border} shadow-lg`}
    >
      <div className="p-4 h-full flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className={`w-4 h-4 ${styles.text.accent}`} />
            <span className={`text-sm font-medium ${styles.text.secondary}`}>
              Skill Meter
            </span>
          </div>

          <div className="flex items-center space-x-1">
            {/* Manual rotate button */}
            <button
              onClick={handleManualRotate}
              className={`p-1 rounded-md ${styles.button.base} transition-colors`}
              title="Next Skill"
            >
              <RotateCw className={`w-3 h-3 ${styles.button.icon}`} />
            </button>

            {/* Details toggle */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`p-1 rounded-md ${styles.button.base} transition-colors`}
              title="Toggle Details"
            >
              <Info className={`w-3 h-3 ${styles.button.icon}`} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSkill.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {/* Gauge */}
              <GaugeDisplay
                currentSkill={currentSkill}
                displayLevel={displayLevel}
                isBoosting={isBoosting}
                styles={styles}
              />

              {/* Skill Name */}
              <motion.h3
                className={`text-sm font-semibold ${styles.text.primary} mb-1 line-clamp-1`}
                animate={{ color: isBoosting ? styles.sparkle.glow : undefined }}
                transition={{ duration: 0.3 }}
              >
                {currentSkill.name}
              </motion.h3>

              {/* Skill Level Badge */}
              <div
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2"
                style={{
                  backgroundColor: skillLevel.bgColor,
                  color: skillLevel.color,
                }}
              >
                <Star className="w-3 h-3 mr-1" />
                {skillLevel.label}
              </div>

              {/* Category */}
              {categoryInfo && (
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <span className="text-xs">{categoryInfo.icon}</span>
                  <span className={`text-xs ${styles.text.muted}`}>
                    {categoryInfo.name}
                  </span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Details Panel */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`mt-2 pt-2 border-t ${styles.details.border} text-xs ${styles.text.details} w-full`}
              >
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Experience:</span>
                    <span className="font-medium">
                      {currentSkill.yearsExperience} years
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Projects:</span>
                    <span className="font-medium">{currentSkill.projects}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Boost Button */}
        {settings.showBoostEffect && (
          <div className="mt-auto w-full pb-4">
            <button
              onClick={handleBoost}
              disabled={isBoosting}
              className={`w-full py-2 px-3 rounded-lg bg-gradient-to-r ${styles.boost.gradient} ${styles.boost.text} text-xs font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              <Zap className="w-3 h-3 inline-block mr-1" />
              {isBoosting ? 'Boosting...' : 'Boost Meter!'}
            </button>
          </div>
        )}
      </div>
    </BaseWidget>
  );
}
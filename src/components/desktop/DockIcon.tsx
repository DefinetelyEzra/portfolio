'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { DockIconProps } from '@/types/desktop';
import { useAudioContext } from '@/components/ui/AudioProvider';

export default function DockIcon({ app, isActive, onClick, onContextMenu }: Readonly<DockIconProps>) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { playHoverSound, playClickSound } = useAudioContext();

  const handleHoverStart = () => {
    setIsHovered(true);
    playHoverSound();
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    playClickSound();
    onClick();
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 px-3 py-1 bg-gray-800/90 backdrop-blur-sm text-white text-sm rounded-lg whitespace-nowrap"
          >
            {app.name}
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800/90" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon */}
      <motion.button
        className="relative w-16 h-16 flex items-center justify-center focus:outline-none group"
        onClick={handleClick}
        onContextMenu={onContextMenu}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {/* Icon Background */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/10 shadow-lg" />

        {/* Icon Image or Fallback */}
        <div className="relative w-12 h-12 rounded-xl overflow-hidden">
          {imageError ? (
            // Fallback gradient icon with first letter
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xl font-semibold">
                {app.name.charAt(0).toUpperCase()}
              </span>
            </div>
          ) : (
            <Image
              src={app.icon}
              alt={app.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              sizes="48px"
            />
          )}
        </div>

        {/* Hover Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />

        {/* Click Ripple Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-white/20"
          initial={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 1, opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>

      {/* Active Indicator */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -bottom-1 w-1 h-1 bg-white rounded-full shadow-lg"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
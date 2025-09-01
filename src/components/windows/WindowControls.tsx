'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Square } from 'lucide-react';

interface WindowControlsProps {
  readonly onClose: () => void;
  readonly onMinimize: () => void;
  readonly onMaximize: () => void;
}

export default function WindowControls({ onClose, onMinimize, onMaximize }: WindowControlsProps) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Close Button */}
      <motion.button
        className="relative w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        onHoverStart={() => setHoveredButton('close')}
        onHoverEnd={() => setHoveredButton(null)}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          variants={iconVariants}
          initial="hidden"
          animate={hoveredButton === 'close' ? 'visible' : 'hidden'}
          transition={{ duration: 0.2 }}
        >
          <X className="w-2 h-2 text-red-800" />
        </motion.div>
      </motion.button>

      {/* Minimize Button */}
      <motion.button
        className="relative w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300"
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        onHoverStart={() => setHoveredButton('minimize')}
        onHoverEnd={() => setHoveredButton(null)}
        onClick={(e) => {
          e.stopPropagation();
          onMinimize();
        }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          variants={iconVariants}
          initial="hidden"
          animate={hoveredButton === 'minimize' ? 'visible' : 'hidden'}
          transition={{ duration: 0.2 }}
        >
          <Minus className="w-2 h-2 text-yellow-800" />
        </motion.div>
      </motion.button>

      {/* Maximize Button */}
      <motion.button
        className="relative w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300"
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        onHoverStart={() => setHoveredButton('maximize')}
        onHoverEnd={() => setHoveredButton(null)}
        onClick={(e) => {
          e.stopPropagation();
          onMaximize();
        }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          variants={iconVariants}
          initial="hidden"
          animate={hoveredButton === 'maximize' ? 'visible' : 'hidden'}
          transition={{ duration: 0.2 }}
        >
          <Square className="w-2 h-2 text-green-800" />
        </motion.div>
      </motion.button>
    </div>
  );
}
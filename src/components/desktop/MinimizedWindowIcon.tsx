'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { AppConfig } from '@/types/desktop';

interface MinimizedWindowIconProps {
    readonly app: AppConfig;
    readonly onClick: () => void;
}

export default function MinimizedWindowIcon({ app, onClick }: MinimizedWindowIconProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);

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
                        {app.name} (Minimized)
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800/90" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Minimized Window Icon */}
            <motion.button
                className="relative w-14 h-10 flex items-center justify-center focus:outline-none group"
                onClick={onClick}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
            >
                {/* Window Preview Background */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-sm border border-gray-600/50 shadow-lg" />

                {/* Window Header */}
                <div className="absolute top-0 left-0 right-0 h-3 rounded-t-lg bg-gradient-to-r from-gray-600 to-gray-700 border-b border-gray-600/50" />

                {/* Window Controls */}
                <div className="absolute top-1 left-1.5 flex space-x-1">
                    <div className="w-1 h-1 rounded-full bg-red-400" />
                    <div className="w-1 h-1 rounded-full bg-yellow-400" />
                    <div className="w-1 h-1 rounded-full bg-green-400" />
                </div>

                {/* App Icon */}
                <div className="relative w-6 h-6 rounded-md overflow-hidden mt-1">
                    {!imageError ? (
                        <Image
                            src={app.icon}
                            alt={app.name}
                            fill
                            className="object-cover"
                            onError={() => setImageError(true)}
                            sizes="24px"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">
                                {app.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                {/* Hover Glow Effect */}
                <motion.div
                    className="absolute inset-0 rounded-lg bg-white/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                />

                {/* Click Ripple Effect */}
                <motion.div
                    className="absolute inset-0 rounded-lg bg-white/20"
                    initial={{ scale: 0, opacity: 0 }}
                    whileTap={{ scale: 1, opacity: [0, 0.5, 0] }}
                    transition={{ duration: 0.3 }}
                />

                {/* Minimized Indicator */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-blue-400 rounded-full" />
            </motion.button>
        </div>
    );
}
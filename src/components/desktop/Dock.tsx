'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useDesktopStore } from '@/store/desktopStore';
import { DOCK_APPS } from '@/utils/constants';
import DockIcon from './DockIcon';
import MinimizedWindowIcon from './MinimizedWindowIcon';

export default function Dock() {
    const { openWindow, restoreWindow, windows } = useDesktopStore();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const dockRef = useRef<HTMLDivElement>(null);

    const getActiveApps = () => {
        return windows.filter(w => !w.isMinimized).map(w => w.appId);
    };

    const calculateScale = (index: number) => {
        if (hoveredIndex === null) return 1;

        const distance = Math.abs(index - hoveredIndex);

        if (distance === 0) return 1.6;
        if (distance === 1) return 1.3;
        if (distance === 2) return 1.1;

        return 1;
    };

    const calculateTranslateY = (index: number) => {
        if (hoveredIndex === null) return 0;

        const distance = Math.abs(index - hoveredIndex);

        if (distance === 0) return -12;
        if (distance === 1) return -8;
        if (distance === 2) return -4;

        return 0;
    };

    const activeApps = getActiveApps();

    const getMinimizedWindows = () => {
        return windows.filter(w => w.isMinimized);
    };

    const handleIconClick = (appId: string) => {
        const minimizedWindow = windows.find(w => w.appId === appId && w.isMinimized);
        if (minimizedWindow) {
            restoreWindow(minimizedWindow.id);
        } else {
            openWindow(appId);
        }
    };

    return (
        <motion.div
            ref={dockRef}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6, type: 'spring', stiffness: 100 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
            onMouseLeave={() => setHoveredIndex(null)}
        >
            <div className="flex items-end space-x-1 px-3 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
                {DOCK_APPS.map((app, index) => (
                    <motion.div
                        key={app.id}
                        className="relative"
                        animate={{
                            scale: calculateScale(index),
                            y: calculateTranslateY(index),
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        onHoverStart={() => setHoveredIndex(index)}
                        data-dock-icon={app.id} // Add this for animation targeting
                    >
                        <DockIcon
                            app={app}
                            isActive={activeApps.includes(app.id)}
                            onClick={() => handleIconClick(app.id)}
                            onContextMenu={(e) => {
                                e.preventDefault();
                            }}
                        />
                    </motion.div>
                ))}

                {/* Minimized Windows Section */}
                {getMinimizedWindows().map((window) => {
                    const app = DOCK_APPS.find(a => a.id === window.appId);
                    if (!app) return null;

                    return (
                        <MinimizedWindowIcon
                            key={window.id}
                            app={app}
                            onClick={() => restoreWindow(window.id)}
                        />
                    );
                })}
            </div>

            {/* Dock Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent rounded-2xl blur-xl -z-10" />
        </motion.div>
    );
}
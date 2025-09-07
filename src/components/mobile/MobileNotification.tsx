'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, ChevronUp, Info } from 'lucide-react';

export default function MobileNotification() {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
        // Check if notification was already shown in this session
        const notificationShownThisSession = sessionStorage.getItem('notification-shown-this-session');

        if (!hasShown && !notificationShownThisSession) {
            const timer = setTimeout(() => {
                setIsVisible(true);
                setHasShown(true);
                sessionStorage.setItem('notification-shown-this-session', 'true');
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [hasShown]);

    useEffect(() => {
        if (isVisible && !isExpanded) {
            const autoDismissTimer = setTimeout(() => {
                handleDismiss();
            }, 5000);

            return () => clearTimeout(autoDismissTimer);
        }
    }, [isVisible, isExpanded]);

    const handleDismiss = () => {
        setIsVisible(false);
        setIsExpanded(false);
    };

    const handleTap = () => {
        if (!isExpanded) {
            setIsExpanded(true);
        }
    };

    const handleSwipeUp = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.y < -50 && info.velocity.y < -100) {
            handleDismiss();
        }
    };

    const handleBackdropTap = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleDismiss();
        }
    };

    const shortInstructions = "Tap apps to Open • Explore and Discover";
    const fullInstructions = [
        "Welcome to my Portfolio(Mobile)!",
        "",
        "Navigation Tips:",
        "• Tap any app icon to open it",
        "• Use the back or home button in apps to return",
        "• Swipe up or tap outside of this notification to dismiss",
        "",
        "Explore and discover the developer(me)!",
        "Access the site on desktop for a more robust experience"
    ];

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Backdrop for expanded state */}
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
                            onClick={handleBackdropTap}
                        />
                    )}

                    {/* Notification */}
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 30
                        }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={0.2}
                        onDragEnd={handleSwipeUp}
                        onClick={handleTap}
                        className={`
                            fixed z-50 cursor-pointer
                            ${isExpanded
                                ? 'top-1/2 left-6 right-6 transform -translate-y-1/2 cursor-default'
                                : 'top-12 left-4 right-4'
                            }
                        `}
                    >
                        <motion.div
                            layout
                            className={`
                                bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl
                                rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50
                                ${isExpanded ? 'p-6' : 'p-4'}
                                transition-all duration-300
                            `}
                            style={{
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.1)'
                            }}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <Info className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            Portfolio Guide
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            now
                                        </p>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDismiss();
                                        }}
                                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    </motion.button>
                                )}
                            </div>

                            {/* Content */}
                            <AnimatePresence mode="wait">
                                {isExpanded ? (
                                    <motion.div
                                        key="expanded"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="space-y-2">
                                            {fullInstructions.map((line) => (
                                                <p
                                                    key={line || `empty-${Math.random()}`}
                                                    className={`
                                                        ${line === "" ? "h-1" : ""}
                                                        ${line.startsWith("Welcome") ? "text-lg font-medium text-gray-900 dark:text-white" : ""}
                                                        ${line.startsWith("Navigation") ? "font-semibold text-gray-800 dark:text-gray-200" : ""}
                                                        ${line.startsWith("•") ? "text-gray-700 dark:text-gray-300 ml-2" : ""}
                                                        ${line.startsWith("Explore") ? "text-blue-600 dark:text-blue-400 font-medium" : ""}
                                                        ${!line.startsWith("Welcome") && !line.startsWith("Navigation") && !line.startsWith("•") && !line.startsWith("Explore") && line !== "" ? "text-gray-600 dark:text-gray-400" : ""}
                                                    `}
                                                >
                                                    {line}
                                                </p>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="collapsed"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                                            {shortInstructions}
                                        </p>

                                        {/* Tap to expand indicator */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Tap to expand
                                            </span>
                                            <div className="flex items-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
                                                <span>Swipe up to dismiss</span>
                                                <ChevronUp className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Drag indicator for collapsed state */}
                            {!isExpanded && (
                                <div className="flex justify-center mt-2">
                                    <div className="w-8 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
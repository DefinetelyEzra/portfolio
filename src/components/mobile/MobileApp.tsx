'use client';

import { useCallback, useEffect, useState, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { MOBILE_APPS } from '@/utils/mobileConstants';
import { MobileAppConfig } from '@/types/mobile';
import Image from 'next/image';
import MobileAppWrapper from '../apps/MobileAppWrapper';

interface MobileAppProps {
    appId: string;
    onClose: () => void;
    onHome: () => void;
}

// Loading fallback component
const AppLoadingFallback = ({ appName }: { appName: string }) => (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-gray-600 dark:text-gray-400 text-sm">Loading {appName}...</div>
        </div>
    </div>
);

export default function MobileApp({ appId, onClose, onHome }: Readonly<MobileAppProps>) {
    const [isLoading, setIsLoading] = useState(true);

    const app = useMemo(() =>
        MOBILE_APPS.find(a => a.id === appId) as MobileAppConfig | undefined,
        [appId]
    );

    useEffect(() => {
        // Set notification flag
        sessionStorage.setItem('notification-shown-this-session', 'true');

        const timer = setTimeout(() => setIsLoading(false), 150);
        return () => clearTimeout(timer);
    }, []);

    const handleBack = useCallback(() => {
        onClose();
    }, [onClose]);

    const handleHomeGesture = useCallback(() => {
        onHome();
    }, [onHome]);

    // Early return for app not found
    if (!app) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black flex items-center justify-center"
            >
                <div className="text-white text-center">
                    <div className="text-xl mb-3">App Not Found</div>
                    <button
                        onClick={handleHomeGesture}
                        className="text-blue-400 underline text-sm px-4 py-2 rounded"
                    >
                        Return Home
                    </button>
                </div>
            </motion.div>
        );
    }

    const AppComponent = app.component;

    // Optimized animation variants
    const slideVariants = {
        initial: { x: '100%' },
        animate: {
            x: 0,
            transition: {
                type: 'spring' as const,
                stiffness: 400,
                damping: 25,
                mass: 0.8
            }
        },
        exit: {
            x: '100%',
            transition: {
                type: 'spring' as const,
                stiffness: 500,
                damping: 30
            }
        }
    };

    const contentVariants = {
        loading: { opacity: 0 },
        loaded: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.2 }
        }
    };

    return (
        <motion.div
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-white dark:bg-black flex flex-col w-full"
        >
            {/* App Header */}
            <div className="flex items-center justify-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 relative">
                <button
                    onClick={handleBack}
                    className="absolute left-4 flex items-center space-x-2 text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-2 py-1 transition-colors duration-150"
                >
                    <ChevronLeft size={18} />
                    <span className="text-sm">Back</span>
                </button>

                <div className="flex items-center space-x-2">
                    <Image
                        src={app.icon}
                        alt={app.name}
                        width={20}
                        height={20}
                        className="w-5 h-5"
                        priority 
                    />
                    <h1 className="text-base font-semibold text-gray-900 dark:text-white">
                        {app.name}
                    </h1>
                </div>
            </div>

            {/* App Content */}
            <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            variants={contentVariants}
                            initial="loading"
                            animate="loading"
                            exit="loading"
                        >
                            <AppLoadingFallback appName={app.name} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            variants={contentVariants}
                            initial="loading"
                            animate="loaded"
                            className="absolute inset-0"
                        >
                            <div className="h-full mobile-app-container">
                                <Suspense fallback={<AppLoadingFallback appName={app.name} />}>
                                    <MobileAppWrapper>
                                        <AppComponent />
                                    </MobileAppWrapper>
                                </Suspense>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Home Indicator */}
            <div className="flex justify-center pb-2">
                <div className="w-32 h-0.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>
        </motion.div>
    );
}
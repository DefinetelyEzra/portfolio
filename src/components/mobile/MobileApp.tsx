'use client';

import { useCallback, useEffect, useState } from 'react';
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

export default function MobileApp({ appId, onClose, onHome }: Readonly<MobileAppProps>) {
    const [app, setApp] = useState<MobileAppConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        sessionStorage.setItem('notification-shown-this-session', 'true');
    }, []);

    useEffect(() => {
        const foundApp = MOBILE_APPS.find(a => a.id === appId) as MobileAppConfig | undefined;
        setApp(foundApp || null);

        // Simulate loading time for smooth transition
        const timer = setTimeout(() => setIsLoading(false), 300);
        return () => clearTimeout(timer);
    }, [appId]);

    const handleBack = useCallback(() => {
        onClose();
    }, [onClose]);

    const handleHomeGesture = useCallback(() => {
        onHome();
    }, [onHome]);

    if (!app) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="text-2xl mb-2">App Not Found</div>
                    <button
                        onClick={handleHomeGesture}
                        className="text-blue-400 underline"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    const AppComponent = app.component;

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-white dark:bg-black flex flex-col w-full"
        >


            {/* App Header */}
            <div className="flex items-center justify-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 relative">
                <button
                    onClick={handleBack}
                    className="absolute left-4 flex items-center space-x-2 text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-2 py-1 transition-colors"
                >
                    <ChevronLeft size={20} />
                    <span>Back</span>
                </button>

                <div className="flex items-center space-x-2">
                    <Image
                        src={app.icon}
                        alt={app.name}
                        width={24}
                        height={24}
                        className="w-6 h-6"
                    />
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
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
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900"
                        >
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                <div className="text-gray-600 dark:text-gray-400">Loading {app.name}...</div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="absolute inset-0"
                        >
                            <div className="h-full mobile-app-container">
                                <MobileAppWrapper>
                                    <AppComponent />
                                </MobileAppWrapper>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Home Indicator */}
            <div className="flex justify-center pb-2">
                <div className="w-32 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>
        </motion.div>
    );
}
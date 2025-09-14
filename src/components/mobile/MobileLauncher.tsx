'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { MOBILE_APPS, MOBILE_GRID, MOBILE_GESTURES } from '@/utils/mobileConstants';
import MobileAppIcon from './MobileAppIcon';
import MobileWidgets from './widgets/MobileWidgets';
import { useDesktopStore } from '@/store/desktopStore';
import { useMobileStore } from '@/store/mobileStore';
import { MobileAppConfig } from '@/types/mobile';
import { isMobile } from '@/utils/deviceDetection';
import MobileNotification from './MobileNotification';

interface MobileLauncherProps {
    onAppOpen: (appId: string) => void;
}

export default function MobileLauncher({ onAppOpen }: Readonly<MobileLauncherProps>) {
    const [currentPage, setCurrentPage] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const { addNotification } = useDesktopStore();
    const constraintsRef = useRef<HTMLDivElement>(null);
    const { settings } = useMobileStore();

    const paginationData = useMemo(() => {
        const totalApps = MOBILE_APPS.length;
        const appsPerPage = MOBILE_GRID.COLUMNS * MOBILE_GRID.ROWS_PER_SCREEN;
        const totalPages = Math.ceil(totalApps / appsPerPage);
        return { totalApps, appsPerPage, totalPages };
    }, []);

    const paginatedApps = useMemo(() => {
        const pages = [];
        for (let i = 0; i < paginationData.totalPages; i++) {
            const startIdx = i * paginationData.appsPerPage;
            const endIdx = (i + 1) * paginationData.appsPerPage;
            pages.push(MOBILE_APPS.slice(startIdx, endIdx));
        }
        return pages;
    }, [paginationData]);

    useEffect(() => {
        sessionStorage.removeItem('app-navigation-active');

        if (isMobile() && settings.wallpaper) {
            const body = document.body;
            const style = body.style;

            style.backgroundImage = `url(${settings.wallpaper})`;
            style.backgroundSize = 'cover';
            style.backgroundPosition = 'center';
            style.backgroundRepeat = 'no-repeat';
            style.backgroundAttachment = 'fixed';
        }

        setIsInitialized(true);

        return () => {
            if (isMobile()) {
                document.body.style.backgroundImage = '';
                document.body.style.backgroundSize = '';
                document.body.style.backgroundPosition = '';
                document.body.style.backgroundRepeat = '';
                document.body.style.backgroundAttachment = '';
            }
        };
    }, [settings.wallpaper]);

    const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
        setIsDragging(false);

        const threshold = MOBILE_GESTURES.SWIPE_THRESHOLD;
        if (Math.abs(info.offset.x) < threshold) return;

        setCurrentPage(prev => {
            if (info.offset.x > threshold && prev > 0) {
                return prev - 1;
            } else if (info.offset.x < -threshold && prev < paginationData.totalPages - 1) {
                return prev + 1;
            }
            return prev;
        });
    }, [paginationData.totalPages]);

    const handleAppClick = useCallback((appId: string) => {
        const app = MOBILE_APPS.find(a => a.id === appId);
        if (app) {
            sessionStorage.setItem('app-navigation-active', 'true');
            onAppOpen(appId);

            addNotification({
                title: `Opening ${app.name}`,
                message: '',
                type: 'info',
                duration: 1500,
            });
        }
    }, [onAppOpen, addNotification]);

    const handlePageIndicatorClick = useCallback((pageIndex: number) => {
        setCurrentPage(pageIndex);
    }, []);

    const pageIndicators = useMemo(() => {
        if (paginationData.totalPages <= 1) return null;

        return (
            <div className="flex justify-center space-x-2 pb-8">
                {Array.from({ length: paginationData.totalPages }, (_, i) => (
                    <motion.div
                        key={`page-${i}`}
                        className={`w-2 h-2 rounded-full cursor-pointer ${i === currentPage ? 'bg-white' : 'bg-white/30'
                            }`}
                        animate={{ scale: i === currentPage ? 1.2 : 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        onClick={() => handlePageIndicatorClick(i)}
                    />
                ))}
            </div>
        );
    }, [paginationData.totalPages, currentPage, handlePageIndicatorClick]);

    if (!isInitialized) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const backgroundStyle = settings.wallpaper
        ? { backgroundImage: `url(${settings.wallpaper})` }
        : { background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #be185d 100%)' };

    return (
        <div
            className="fixed inset-0"
            style={{
                ...backgroundStyle,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Welcome Notification */}
            <MobileNotification />

            {/* Widget Area */}
            <div className="pt-16 pb-4">
                <MobileWidgets />
            </div>

            {/* App Grid */}
            <div className="flex-1 relative overflow-hidden" ref={constraintsRef}>
                <motion.div
                    className="flex h-full"
                    drag="x"
                    dragConstraints={constraintsRef}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={handleDragEnd}
                    animate={{ x: -currentPage * (typeof window !== 'undefined' ? window.innerWidth : 375) }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    style={{ width: `${paginationData.totalPages * 100}%` }}
                >
                    {paginatedApps.map((pageApps) => {
                        const pageKey = pageApps.map(app => app.id).join('-');
                        return (
                            <div
                                key={pageKey} 
                                className="flex-shrink-0 w-full px-6"
                                style={{ width: `${100 / paginationData.totalPages}%` }}
                            >
                                <div
                                    className="grid gap-4 h-full content-start pt-8"
                                    style={{
                                        gridTemplateColumns: `repeat(${MOBILE_GRID.COLUMNS}, 1fr)`,
                                        gridTemplateRows: `repeat(${MOBILE_GRID.ROWS_PER_SCREEN}, 1fr)`,
                                    }}
                                >
                                    {pageApps.map((app: MobileAppConfig) => (
                                        <MobileAppIcon
                                            key={app.id}
                                            app={app}
                                            onClick={() => handleAppClick(app.id)}
                                            disabled={isDragging}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </motion.div>
            </div>

            {/* Page Indicators */}
            <div className="absolute bottom-0 left-0 right-0">
                {pageIndicators}
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="w-32 h-1 bg-white/50 rounded-full" />
            </div>
        </div>
    );
}
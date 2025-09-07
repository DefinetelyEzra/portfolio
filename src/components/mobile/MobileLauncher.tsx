'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
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
    const { addNotification } = useDesktopStore();
    const constraintsRef = useRef<HTMLDivElement>(null);
    const { settings } = useMobileStore();

    useEffect(() => {
        sessionStorage.removeItem('app-navigation-active');

        if (isMobile() && settings.wallpaper) {
            document.body.style.backgroundImage = `url(${settings.wallpaper})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundAttachment = 'fixed';
        }

        return () => {
            if (isMobile()) {
                document.body.style.backgroundImage = '';
            }
        };
    }, [settings.wallpaper]);

    // Calculate total pages
    const totalApps = MOBILE_APPS.length;
    const appsPerPage = MOBILE_GRID.COLUMNS * MOBILE_GRID.ROWS_PER_SCREEN;
    const totalPages = Math.ceil(totalApps / appsPerPage);

    // Handle page navigation
    const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
        setIsDragging(false);

        if (Math.abs(info.offset.x) < MOBILE_GESTURES.SWIPE_THRESHOLD) return;

        if (info.offset.x > MOBILE_GESTURES.SWIPE_THRESHOLD && currentPage > 0) {
            setCurrentPage(currentPage - 1);
        } else if (info.offset.x < -MOBILE_GESTURES.SWIPE_THRESHOLD && currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    }, [currentPage, totalPages]);

    // Handle app launch
    const handleAppClick = useCallback((appId: string) => {
        const app = MOBILE_APPS.find(a => a.id === appId);
        if (app) {
            sessionStorage.setItem('app-navigation-active', 'true');

            onAppOpen(appId);
            addNotification({
                title: `Opening ${app.name}`,
                message: '',
                type: 'info',
                duration: 2000,
            });
        }
    }, [onAppOpen, addNotification]);

    // Page indicator dots
    const renderPageIndicators = () => {
        if (totalPages <= 1) return null;

        return (
            <div className="flex justify-center space-x-2 pb-8">
                {Array.from({ length: totalPages }, (_, i) => (
                    <motion.div
                        key={i}
                        className={`w-2 h-2 rounded-full ${i === currentPage ? 'bg-white' : 'bg-white/30'
                            }`}
                        animate={{ scale: i === currentPage ? 1.2 : 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        onClick={() => setCurrentPage(i)}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="fixed inset-0" style={{
            backgroundImage: settings.wallpaper ? `url(${settings.wallpaper})` : 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #be185d 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>

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
                    animate={{ x: -currentPage * window.innerWidth }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    style={{ width: `${totalPages * 100}%` }}
                >
                    {Array.from({ length: totalPages }, (_, pageIndex) => (
                        <div
                            key={pageIndex}
                            className="flex-shrink-0 w-full px-6"
                            style={{ width: `${100 / totalPages}%` }}
                        >
                            <div
                                className="grid gap-4 h-full content-start pt-8"
                                style={{
                                    gridTemplateColumns: `repeat(${MOBILE_GRID.COLUMNS}, 1fr)`,
                                    gridTemplateRows: `repeat(${MOBILE_GRID.ROWS_PER_SCREEN}, 1fr)`,
                                }}
                            >
                                {(MOBILE_APPS as MobileAppConfig[])
                                    .slice(
                                        pageIndex * appsPerPage,
                                        (pageIndex + 1) * appsPerPage
                                    )
                                    .map((app) => (
                                        <MobileAppIcon
                                            key={app.id}
                                            app={app}
                                            onClick={() => handleAppClick(app.id)}
                                            disabled={isDragging}
                                        />
                                    ))}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Page Indicators */}
            <div className="absolute bottom-0 left-0 right-0">
                {renderPageIndicators()}
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="w-32 h-1 bg-white/50 rounded-full" />
            </div>
        </div>
    );
}
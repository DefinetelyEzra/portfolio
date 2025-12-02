'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Menu, X } from 'lucide-react';
import { useDesktopStore } from '@/store/desktopStore';
import { isMobile } from '@/utils/deviceDetection';
import Link from 'next/link';

interface WebNavbarProps {
    readonly activeSection: string;
}

export default function WebNavbar({ activeSection }: WebNavbarProps) {
    const { currentTheme } = useDesktopStore();
    const isDark = currentTheme === 'dark';
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileDevice, setIsMobileDevice] = useState(false);

    const navItems = [
        { id: 'hero', label: 'Home' },
        { id: 'about', label: 'About' },
        { id: 'projects', label: 'Projects' },
        { id: 'skills', label: 'Skills' },
        { id: 'contact', label: 'Contact' },
    ];

    // Check if mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobileDevice(isMobile());
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Helper function to get navbar background class
    const getNavbarBackgroundClass = () => {
        if (!isScrolled) return 'bg-transparent';

        return isDark
            ? 'bg-gray-900/95 backdrop-blur-lg shadow-lg'
            : 'bg-white/95 backdrop-blur-lg shadow-lg';
    };

    // Helper function to get text color for nav items
    const getNavItemTextColor = (itemId: string) => {
        if (activeSection === itemId) {
            return isDark ? 'text-blue-400' : 'text-blue-600';
        }

        return isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900';
    };

    // Helper function to get mobile menu item background
    const getMobileMenuItemBackground = (itemId: string) => {
        if (activeSection === itemId) {
            return isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600';
        }

        return isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100';
    };

    // Helper function to get macOS button style
    const getMacOSButtonStyle = () => {
        return isDark
            ? 'bg-gray-800 hover:bg-gray-700 text-blue-400'
            : 'bg-gray-100 hover:bg-gray-200 text-blue-600';
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 80;
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({ top: elementPosition, behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getNavbarBackgroundClass()}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => scrollToSection('hero')}
                        >
                            <div className="w-10 h-10 bg-linear-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-lg flex items-center justify-center shrink-0">
                                <span className="text-white text-lg font-bold">OA</span>
                            </div>
                            <span className={`font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Odunayo Agunbiade
                            </span>
                        </motion.div>

                        {/* Desktop Navigation - Hidden on mobile */}
                        {!isMobileDevice && (
                            <div className="hidden md:flex items-center gap-8">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollToSection(item.id)}
                                        className={`text-sm font-medium transition-colors relative ${getNavItemTextColor(item.id)}`}
                                    >
                                        {item.label}
                                        {activeSection === item.id && (
                                            <motion.div
                                                layoutId="activeSection"
                                                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500"
                                            />
                                        )}
                                    </button>
                                ))}

                                {/* macOS View Button - Desktop Only */}
                                <Link href="/">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${getMacOSButtonStyle()}`}
                                    >
                                        <Monitor className="w-4 h-4" />
                                        <span className="text-sm">macOS View</span>
                                    </motion.button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`md:hidden p-2 rounded-lg ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25 }}
                        className={`fixed top-16 right-0 bottom-0 w-64 z-40 md:hidden ${isDark ? 'bg-gray-900' : 'bg-white'
                            } shadow-xl`}
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`text-left py-2 px-4 rounded-lg font-medium transition-colors ${getMobileMenuItemBackground(item.id)}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                            {/* No macOS button in mobile menu */}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
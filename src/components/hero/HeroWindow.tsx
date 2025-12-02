'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Sparkles,
    ArrowRight,
    User,
    Briefcase,
    Code,
    Mail,
    MapPin,
    Calendar,
    Trophy,
    Target,
    TrendingUp,
    Globe
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useDesktopStore } from '@/store/desktopStore';

const ReopenButton = ({ handleReopen, isDark }: { handleReopen: () => void; isDark: boolean }) => (
    <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleReopen}
        className={`fixed top-6 right-6 z-15 p-3 rounded-full shadow-xl backdrop-blur-sm transition-colors ${isDark
            ? 'bg-gray-800/90 hover:bg-gray-700/90 text-blue-400'
            : 'bg-white/90 hover:bg-gray-50/90 text-blue-600'
            }`}
        title="Show Overview"
    >
        <Sparkles className="w-5 h-5" />
    </motion.button>
);

const Header = ({ isDark, handleClose }: { isDark: boolean; handleClose: () => void }) => (
    <div className={`relative p-8 border-b shrink-0 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700 opacity-10" />

        <button
            onClick={handleClose}
            className={`absolute top-4 right-4 p-2 rounded-lg transition-colors z-10 ${isDark
                ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
        >
            <X className="w-5 h-5" />
        </button>

        <div className="relative">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-linear-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl font-bold">OA</span>
                </div>
                <div>
                    <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Odunayo Agunbiade
                    </h1>
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        ML Enthusiast • Fullstack Engineer • Problem Solver
                    </p>
                </div>
            </div>

            <div className={`flex flex-wrap items-center gap-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Lagos, Nigeria</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className={`px-2 py-1 rounded-full ${isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'}`}>
                        Available for opportunities
                    </span>
                </div>
            </div>
        </div>
    </div>
);

const QuickStats = ({ isDark }: { isDark: boolean }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
            { icon: Trophy, label: 'Projects', value: '10+', color: 'text-yellow-500' },
            { icon: Target, label: 'Students Mentored', value: '100+', color: 'text-blue-500' },
            { icon: Code, label: 'Technologies', value: '15+', color: 'text-purple-500' },
            { icon: TrendingUp, label: 'Years Experience', value: '3+', color: 'text-green-500' },
        ].map((stat) => (
            <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`p-4 rounded-xl text-center ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                    }`}
            >
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                </div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                </div>
            </motion.div>
        ))}
    </div>
);

const AboutSummary = ({ isDark }: { isDark: boolean }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-xl mb-8 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
            }`}
    >
        <h2 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            About Me
        </h2>
        <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            I'm a driven Computer Science undergraduate with a burning passion for machine learning and fullstack development.
            I thrive on solving complex problems with code, crafting AI-driven solutions and scalable web applications.
            Currently contributing to VR-based educational tools at PAU VHCI Lab while mentoring students in programming.
        </p>
    </motion.div>
);

const ExplorePortfolio = ({ isDark, handleNavigate }: { isDark: boolean; handleNavigate: (appId: string) => void }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
    >
        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Explore My Portfolio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
                {
                    id: 'projects',
                    icon: Briefcase,
                    title: 'Projects',
                    description: 'AI, VR & Fullstack Development',
                    gradient: 'from-blue-500 to-cyan-500'
                },
                {
                    id: 'skills',
                    icon: Code,
                    title: 'Skills',
                    description: 'Technical expertise & tools',
                    gradient: 'from-purple-500 to-pink-500'
                },
                {
                    id: 'about',
                    icon: User,
                    title: 'About Me',
                    description: 'Background & experience',
                    gradient: 'from-green-500 to-teal-500'
                },
                {
                    id: 'contact',
                    icon: Mail,
                    title: 'Contact',
                    description: 'Get in touch with me',
                    gradient: 'from-orange-500 to-red-500'
                },
            ].map((link) => (
                <motion.button
                    key={link.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavigate(link.id)}
                    className={`p-4 rounded-xl text-left transition-all group ${isDark
                        ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                        : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
                        }`}
                >
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 bg-linear-to-br ${link.gradient} rounded-lg flex items-center justify-center shrink-0`}>
                            <link.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {link.title}
                                </h3>
                                <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isDark ? 'text-gray-400' : 'text-gray-500'
                                    }`} />
                            </div>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {link.description}
                            </p>
                        </div>
                    </div>
                </motion.button>
            ))}
        </div>
    </motion.div>
);

const ConnectWithMe = ({ isDark }: { isDark: boolean }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`p-6 rounded-xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
            }`}
    >
        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Connect With Me
        </h2>
        <div className="flex flex-wrap gap-3">
            {[
                { icon: FaGithub, label: 'GitHub', url: 'https://github.com/DefinetelyEzra', color: 'hover:text-purple-500' },
                { icon: FaLinkedin, label: 'LinkedIn', url: '#', color: 'hover:text-blue-500' },
                { icon: Globe, label: 'Website', url: '#', color: 'hover:text-green-500' },
            ].map((social) => (
                <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                        } ${social.color}`}
                >
                    <social.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{social.label}</span>
                </a>
            ))}
        </div>
    </motion.div>
);

const KeyTechnologies = ({ isDark }: { isDark: boolean }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
    >
        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Key Technologies
        </h2>
        <div className="flex flex-wrap gap-2">
            {['Python', 'React', 'TypeScript', 'Unity', 'Flask', 'PostgreSQL', 'AWS', 'Docker', 'TensorFlow'].map((tech) => (
                <span
                    key={tech}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${isDark
                        ? 'bg-blue-900/30 text-blue-300 border border-blue-800/50'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                >
                    {tech}
                </span>
            ))}
        </div>
    </motion.div>
);

const Footer = ({ isDark, handleClose }: { isDark: boolean; handleClose: () => void }) => (
    <div className={`p-6 border-t shrink-0 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Click any section above to explore
                </p>
                <a
                    href="/web"
                    className={`text-sm font-medium flex items-center gap-1 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                        }`}
                >
                    <Globe className="w-4 h-4" />
                    View Web Version
                </a>
            </div>
            <button
                onClick={handleClose}
                className="px-6 py-2 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all"
            >
                Start Exploring
            </button>
        </div>
    </div>
);

const HeroContent = ({ isDark, handleClose, handleNavigate }: { isDark: boolean; handleClose: () => void; handleNavigate: (appId: string) => void }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-20000 flex items-center justify-center p-4"
        style={{ pointerEvents: 'auto' }}
    >
        {/* Backdrop */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
        />

        {/* Hero Window */}
        <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full max-w-5xl max-h-[85vh] ${isDark ? 'bg-gray-900' : 'bg-white'
                } rounded-2xl shadow-2xl overflow-hidden flex flex-col`}
        >
            <Header isDark={isDark} handleClose={handleClose} />
            <div className="flex-1 overflow-y-auto p-8">
                <QuickStats isDark={isDark} />
                <AboutSummary isDark={isDark} />
                <ExplorePortfolio isDark={isDark} handleNavigate={handleNavigate} />
                <ConnectWithMe isDark={isDark} />
                <KeyTechnologies isDark={isDark} />
            </div>
            <Footer isDark={isDark} handleClose={handleClose} />
        </motion.div>
    </motion.div>
);

export default function HeroWindow() {
    const [isVisible, setIsVisible] = useState(false);
    const [hasSeenHero, setHasSeenHero] = useState(false);
    const [hasClickedButton, setHasClickedButton] = useState(false);
    const { openWindow, currentTheme } = useDesktopStore();

    const isDark = currentTheme === 'dark';

    useEffect(() => {

        // Check if user has clicked any button
        const buttonClicked = localStorage.getItem('portfolio-button-clicked');
        if (buttonClicked) {
            setHasClickedButton(true);
        }

        // Check if user has seen hero
        const heroSeen = localStorage.getItem('portfolio-hero-seen');
        if (heroSeen) {
            setHasSeenHero(true);
            return;
        }

        // Show hero after a short delay
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        localStorage.setItem('portfolio-hero-seen', 'true');
        localStorage.setItem('portfolio-button-clicked', 'true');
        setHasSeenHero(true);
        setIsVisible(false);
    };

    const handleReopen = () => {
        setIsVisible(true);
    };

    const handleNavigate = (appId: string) => {
        openWindow(appId);
        handleClose();
    };

    if (hasSeenHero && !isVisible) {
        // Floating reopen button positioned under the web view toggle
        return (
            <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    boxShadow: hasClickedButton === false ? [
                        '0 0 0 0 rgba(59, 130, 246, 0.7)',
                        '0 0 0 10px rgba(59, 130, 246, 0)',
                        '0 0 0 0 rgba(59, 130, 246, 0.7)',
                    ] : undefined
                }}
                transition={{
                    boxShadow: {
                        duration: 2,
                        repeat: hasClickedButton === false ? Infinity : 0,
                        ease: 'easeInOut'
                    }
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    setHasClickedButton(true);
                    localStorage.setItem('portfolio-button-clicked', 'true');
                    handleReopen();
                }}
                className={`fixed top-[84px] right-6 z-15 p-3 rounded-full shadow-xl backdrop-blur-sm transition-colors ${isDark
                    ? 'bg-gray-800/90 hover:bg-gray-700/90 text-blue-400'
                    : 'bg-white/90 hover:bg-gray-50/90 text-blue-600'
                    }`}
                title="Show Overview"
            >
                <Sparkles className="w-5 h-5" />
            </motion.button>
        );
    }

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <HeroContent isDark={isDark} handleClose={handleClose} handleNavigate={handleNavigate} />
        </AnimatePresence>
    );
}
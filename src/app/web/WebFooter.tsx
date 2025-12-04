'use client';

import { Mail } from 'lucide-react';
import { FaBriefcase, FaGithub, FaLinkedin } from 'react-icons/fa';
import { useDesktopStore } from '@/store/desktopStore';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function WebFooter() {
    const { currentTheme } = useDesktopStore();
    const isDark = currentTheme === 'dark';
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef);

    const socialLinks = [
        { icon: FaGithub, url: 'https://github.com/DefinetelyEzra', label: 'GitHub', gradient: 'from-gray-700 to-gray-900' },
        { icon: FaLinkedin, url: 'https://linkedin.com/in/odunayo-agunbiade-155440315', label: 'LinkedIn', gradient: 'from-blue-600 to-blue-800' },
        { icon: FaBriefcase, url: 'https://jobberman.com/profile/Odunayo-Agunbiade', label: 'Jobberman', gradient: 'from-purple-600 to-pink-600' },
        { icon: Mail, url: 'mailto:ezraagun@gmail.com', label: 'Email', gradient: 'from-orange-600 to-red-600' },
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderSocialLink = (social: typeof socialLinks[0], index: number) => {
        const Icon = social.icon;
        return (
            <motion.a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                    scale: 1.2,
                    y: -5,
                }}
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-full transition-all bg-linear-to-br ${social.gradient} text-white shadow-lg hover:shadow-xl`}
                title={social.label}
                aria-label={social.label}
            >
                <Icon className="w-5 h-5" />
            </motion.a>
        );
    };

    const renderBrandLogo = () => (
        <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="w-12 h-12 bg-linear-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-lg flex items-center justify-center relative group"
        >
            <motion.div
                className="absolute inset-0 rounded-lg bg-linear-to-br from-blue-400 to-purple-600 opacity-0"
                whileHover={{ opacity: 0.5, scale: 1.2 }}
                transition={{ duration: 0.3 }}
            />
            <span className="text-white text-xl font-bold relative z-10">OA</span>
        </motion.div>
    );

    const renderBackToTop = () => (
        <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            className={`px-6 py-2 rounded-full font-medium transition-all ${isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
            aria-label="Back to top"
        >
            Back to Top ↑
        </motion.button>
    );

    const renderCopyright = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5 }}
            className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
        >
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                className="flex items-center justify-center gap-2 text-sm"
            >
                Made with{' '}
                <motion.span
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                    }}
                    className="text-red-500"
                    aria-label="love"
                >
                    ❤️
                </motion.span>
                by Odunayo Agunbiade
            </motion.p>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: 0.2 }}
                className="text-xs mt-2"
            >
                © {new Date().getFullYear()} All rights reserved.
            </motion.p>
        </motion.div>
    );

    const renderBackgroundGradients = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
                className="absolute -top-40 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    x: [-50, 50, -50],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                }}
            />
            <motion.div
                className="absolute -top-40 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
                animate={{
                    scale: [1.2, 1, 1.2],
                    x: [50, -50, 50],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                }}
            />
        </div>
    );

    const renderCornerElements = () => (
        <>
            <motion.div
                className="absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr from-blue-500/10 to-transparent"
                animate={{
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                }}
            />
            <motion.div
                className="absolute bottom-0 right-0 w-32 h-32 bg-linear-to-tl from-purple-500/10 to-transparent"
                animate={{
                    opacity: [1, 0.5, 1],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                }}
            />
        </>
    );

    return (
        <footer
            ref={sectionRef}
            className={`py-12 relative overflow-hidden ${isDark ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'}`}
            role="contentinfo"
        >
            {renderBackgroundGradients()}

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col items-center gap-8">
                    {/* Brand with animated elements */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="flex items-center gap-3">
                            {renderBrandLogo()}
                            <div>
                                <motion.h3
                                    whileHover={{ x: 5 }}
                                    className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                                >
                                    Odunayo Agunbiade
                                </motion.h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Decision is where nature ends and consciousness begins
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Animated divider */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: '100%' } : { width: 0 }}
                        transition={{ duration: 1 }}
                        className={`h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'} max-w-md`}
                    />

                    {/* Social Links with enhanced interactions */}
                    <div className="flex items-center gap-3 flex-wrap justify-center">
                        {socialLinks.map(renderSocialLink)}
                    </div>

                    {/* Back to top button */}
                    {renderBackToTop()}

                    {/* Copyright with stagger animation */}
                    {renderCopyright()}
                </div>
            </div>

            {/* Decorative corner elements */}
            {renderCornerElements()}
        </footer>
    );
}
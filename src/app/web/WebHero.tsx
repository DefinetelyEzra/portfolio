'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useDesktopStore } from '@/store/desktopStore';

export default function WebHero() {
    const { currentTheme } = useDesktopStore();
    const isDark = currentTheme === 'dark';

    const scrollToAbout = () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className={`min-h-screen flex items-center justify-center relative overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-linear-to-br from-blue-50 via-white to-purple-50'
            }`}>
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Avatar */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="mb-8"
                    >
                        <div className="w-32 h-32 mx-auto bg-linear-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-full flex items-center justify-center shadow-2xl">
                            <span className="text-white text-5xl font-bold">OA</span>
                        </div>
                    </motion.div>

                    {/* Name */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`text-5xl md:text-7xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
                            }`}
                    >
                        Odunayo Agunbiade
                    </motion.h1>

                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`text-xl md:text-2xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}
                    >
                        ML Enthusiast • Fullstack Engineer • Problem Solver
                    </motion.p>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className={`text-lg max-w-2xl mx-auto mb-12 ${isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}
                    >
                        Building AI-driven solutions and scalable web applications that make a difference.
                        Currently contributing to VR-based educational tools and mentoring the next generation of developers.
                    </motion.p>

                    {/* Social Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center justify-center gap-4 mb-12"
                    >
                        {[
                            { icon: FaGithub, url: 'https://github.com/DefinetelyEzra', label: 'GitHub' },
                            { icon: FaLinkedin, url: 'https://linkedin.com/in/odunayo-agunbiade-155440315', label: 'LinkedIn' },
                            { icon: Mail, url: 'mailto:ezraagun@gmail.com', label: 'Email' },
                        ].map((social) => (
                            <motion.a
                                key={social.label}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-3 rounded-full transition-colors ${isDark
                                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                        : 'bg-white hover:bg-gray-100 text-gray-700 shadow-md'
                                    }`}
                                title={social.label}
                            >
                                <social.icon className="w-5 h-5" />
                            </motion.a>
                        ))}
                    </motion.div>

                    {/* CTA Button */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        onClick={scrollToAbout}
                        className="group"
                    >
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                Scroll to explore
                            </span>
                            <motion.div
                                animate={{ y: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <ArrowDown className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                            </motion.div>
                        </div>
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}
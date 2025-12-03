'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, Mail, Sparkles } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useDesktopStore } from '@/store/desktopStore';
import { useEffect, useRef, useState } from 'react';

export default function WebHero() {
    const { currentTheme } = useDesktopStore();
    const isDark = currentTheme === 'dark';
    const heroRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Smooth mouse tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    // Parallax transforms - use state dimensions
    const rotateX = useTransform(smoothMouseY, [0, dimensions.height || 1], [20, -20]);
    const rotateY = useTransform(smoothMouseX, [0, dimensions.width || 1], [-20, 20]);

    // Set dimensions on mount
    useEffect(() => {
        if (globalThis.window !== undefined) {
            setDimensions({
                width: globalThis.window.innerWidth,
                height: globalThis.window.innerHeight,
            });

            const handleResize = () => {
                setDimensions({
                    width: globalThis.window.innerWidth,
                    height: globalThis.window.innerHeight,
                });
            };

            globalThis.window.addEventListener('resize', handleResize);
            return () => globalThis.window.removeEventListener('resize', handleResize);
        }
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        globalThis.window.addEventListener('mousemove', handleMouseMove);
        return () => globalThis.window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    const scrollToAbout = () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Generate unique keys for particles
    const particleKeys = Array.from({ length: 20 }, (_, i) => `particle-${i}`);

    return (
        <section
            ref={heroRef}
            className={`min-h-screen flex items-center justify-center relative overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-linear-to-br from-blue-50 via-white to-purple-50'
                }`}
        >
            {/* Animated 3D Background Layers */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Layer 1 - Deep background */}
                <motion.div
                    style={{
                        x: useTransform(smoothMouseX, [0, dimensions.width || 1], [-50, 50]),
                        y: useTransform(smoothMouseY, [0, dimensions.height || 1], [-50, 50]),
                    }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
                />

                {/* Layer 2 - Mid ground */}
                <motion.div
                    style={{
                        x: useTransform(smoothMouseX, [0, dimensions.width || 1], [50, -50]),
                        y: useTransform(smoothMouseY, [0, dimensions.height || 1], [50, -50]),
                    }}
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
                />

                {/* Floating particles */}
                {particleKeys.map((key, i) => (
                    <motion.div
                        key={key}
                        className={`absolute w-2 h-2 rounded-full ${isDark ? 'bg-blue-400/30' : 'bg-purple-400/30'
                            }`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Content with 3D transforms */}
            <motion.div
                className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* 3D Avatar with glow */}
                    <motion.div
                        initial={{ scale: 0, rotateY: 180 }}
                        animate={{ scale: 1, rotateY: 0 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        whileHover={{ scale: 1.1, rotateY: 360 }}
                        className="mb-8 relative"
                    >
                        <div className="w-32 h-32 mx-auto bg-linear-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-full flex items-center justify-center shadow-2xl relative">
                            {/* Animated glow ring */}
                            <motion.div
                                className="absolute inset-0 rounded-full bg-linear-to-r from-blue-400 to-purple-600 opacity-0"
                                animate={{
                                    opacity: [0, 0.5, 0],
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                            />
                            <span className="text-white text-5xl font-bold relative z-10">OA</span>

                            {/* Sparkle effect */}
                            <motion.div
                                className="absolute -top-2 -right-2"
                                animate={{
                                    rotate: [0, 360],
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                }}
                            >
                                <Sparkles className="w-6 h-6 text-yellow-400" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Name with text reveal */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 text-reveal overflow-visible ${isDark ? 'text-white' : 'text-gray-900'}`} 
                    >
                        <span className="inline-block">
                            <motion.span
                                className="inline-block bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient"
                            >
                                ODUNAYO AGUNBIADE
                            </motion.span>
                        </span>
                    </motion.h1>

                    {/* Tagline with gradient */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`text-base sm:text-lg md:text-xl lg:text-2xl mb-8 px-4 ${isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}
                    >
                        ML Enthusiast • Fullstack Engineer • Problem Solver
                    </motion.p>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className={`text-base sm:text-lg max-w-2xl mx-auto mb-12 px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}
                    >
                        Building AI-driven solutions and scalable web applications that make a difference.
                        Currently contributing to VR-based educational tools and mentoring the next generation of developers.
                    </motion.p>

                    {/* Social Links with magnetic effect */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center justify-center gap-4 mb-12"
                    >
                        {[
                            { icon: FaGithub, url: 'https://github.com/DefinetelyEzra', label: 'GitHub', color: 'from-gray-700 to-gray-900' },
                            { icon: FaLinkedin, url: 'https://linkedin.com/in/odunayo-agunbiade-155440315', label: 'LinkedIn', color: 'from-blue-600 to-blue-800' },
                            { icon: Mail, url: 'mailto:ezraagun@gmail.com', label: 'Email', color: 'from-purple-600 to-pink-600' },
                        ].map((social) => (
                            <motion.a
                                key={social.label}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{
                                    scale: 1.2,
                                    rotate: [0, -5, 5, 0],
                                }}
                                whileTap={{ scale: 0.9 }}
                                className={`magnetic-element p-4 rounded-full transition-all duration-300 bg-linear-to-br ${social.color} text-white shadow-lg hover:shadow-2xl`}
                                title={social.label}
                            >
                                <social.icon className="w-6 h-6" />
                            </motion.a>
                        ))}
                    </motion.div>

                    {/* CTA with pulse animation */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        onClick={scrollToAbout}
                        className="group relative"
                    >
                        <motion.div
                            className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-50"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0.8, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                            }}
                        />
                        <div className="relative flex items-center gap-2 text-sm font-medium">
                            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                Scroll to explore
                            </span>
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <ArrowDown className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                            </motion.div>
                        </div>
                    </motion.button>
                </motion.div>
            </motion.div>
        </section>
    );
}
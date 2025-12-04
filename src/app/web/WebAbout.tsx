'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, MapPin, Trophy, Target, TrendingUp, Code, Sparkles } from 'lucide-react';
import { useDesktopStore } from '@/store/desktopStore';

const stats = [
    { icon: Trophy, label: 'Projects Completed', value: '10+', color: 'from-yellow-500 to-orange-500' },
    { icon: Target, label: 'Students Mentored', value: '100+', color: 'from-blue-500 to-cyan-500' },
    { icon: Code, label: 'Technologies', value: '15+', color: 'from-purple-500 to-pink-500' },
    { icon: TrendingUp, label: 'Years Experience', value: '3+', color: 'from-green-500 to-emerald-500' },
];

const timeline = [
    {
        year: '2026',
        title: 'Bachelor of Computer Science',
        company: 'Pan-Atlantic University',
        current: false,
        gradient: 'from-blue-600 to-purple-700',
    },
    {
        year: '2024',
        title: 'Lab Intern',
        company: 'PAU VHCI Lab',
        current: false,
        gradient: 'from-purple-600 to-pink-700',
    },
    {
        year: '2020',
        title: 'Student/Teaching Assistant',
        company: 'University of Regina',
        current: false,
        gradient: 'from-indigo-600 to-blue-700',
    },
];

interface HeaderProps {
    isInView: boolean;
    isDark: boolean;
}

function Header({ isInView, isDark }: Readonly<HeaderProps>) {
    return (
        <div className="text-center mb-16">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 mb-4"
            >
                <Sparkles className="w-6 h-6 text-blue-500" />
                <span className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    Get to know me
                </span>
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.2 }}
                className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
                About Me
            </motion.h2>

            <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: '5rem' } : { width: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="h-1 bg-linear-to-r from-blue-500 to-purple-500 mx-auto mb-6"
            />

            <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.6 }}
                className={`text-lg max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            >
                Passionate about transforming ideas into reality through code and innovation
            </motion.p>
        </div>
    );
}

interface StatsGridProps {
    isInView: boolean;
    isDark: boolean;
}

function StatsGrid({ isInView, isDark }: Readonly<StatsGridProps>) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                    animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: 0, scale: 0.8, rotateY: -90 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{
                        scale: 1.05,
                        rotateY: 5,
                        z: 50,
                    }}
                    className={`group p-6 rounded-2xl text-center relative overflow-hidden cursor-pointer ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                        }`}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Gradient overlay on hover */}
                    <motion.div
                        className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />

                    {/* Icon with bounce animation */}
                    <motion.div
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.3 }}
                        className="relative mb-3 flex items-center justify-center"
                    >
                        <div className={`w-8 h-8 bg-linear-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                            <stat.icon className="w-5 h-5 text-white" />
                        </div>
                    </motion.div>

                    <motion.div
                        className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
                        whileHover={{ scale: 1.1 }}
                    >
                        {stat.value}
                    </motion.div>

                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {stat.label}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

interface BioSectionProps {
    isInView: boolean;
    isDark: boolean;
}

function BioSection({ isInView, isDark }: Readonly<BioSectionProps>) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className={`p-8 rounded-2xl mb-16 relative overflow-hidden ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                }`}
        >
            {/* Animated gradient border */}
            <motion.div
                className="absolute inset-0 rounded-2xl opacity-50"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)',
                }}
                animate={{
                    x: ['-100%', '200%'],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    {/* OA Icon */}
                    <motion.div
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.3 }}
                        className="w-12 h-12 bg-linear-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-full flex items-center justify-center transition-all duration-300"
                    >
                        <span className="text-white text-xl font-bold">OA</span>
                    </motion.div>
                    <div>
                        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Odunayo Agunbiade
                        </h3>
                        <div className={`flex items-center gap-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                Lagos, Nigeria
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Available for opportunities
                            </span>
                        </div>
                    </div>
                </div>

                <div className={`space-y-4 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {[
                        "I'm a driven Computer Science undergraduate with a burning passion for machine learning and fullstack development. I thrive on solving complex problems with code, crafting AI-driven solutions and scalable web applications that make a tangible difference.",
                        "At Pan-Atlantic University's VHCI Lab, I built VR tools that enhance education, while my experience as a student mentor has sharpened my communication and leadership skills. These experiences have shaped me into someone who values collaboration and thrives in dynamic, fast-paced environments.",
                        "My ultimate goal is to harness my problem-solving skills to uplift communities, transform Nigeria, and one day impact the world. Every line of code I write is a step toward building solutions that empower, connect, and inspire."
                    ].map((text, i) => (
                        <motion.p
                            key={text.slice(0, 20)}
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                        >
                            {text}
                        </motion.p>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

interface TimelineSectionProps {
    isInView: boolean;
    isDark: boolean;
}

function TimelineSection({ isInView, isDark }: Readonly<TimelineSectionProps>) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.5, duration: 0.6 }}
        >
            <h3 className={`text-2xl font-bold mb-8 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                My Journey
            </h3>

            <div className="relative">
                {/* Animated connection line */}
                <motion.div
                    initial={{ height: 0 }}
                    animate={isInView ? { height: '100%' } : { height: 0 }}
                    transition={{ delay: 0.8, duration: 1.5 }}
                    className="absolute left-8 top-0 w-0.5 bg-linear-to-b from-blue-500 via-purple-500 to-pink-500"
                />

                <div className="space-y-6">
                    {timeline.map((item, index) => (
                        <motion.div
                            key={`${item.year}-${item.company}`}
                            initial={{ opacity: 0, x: -50 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                            transition={{ delay: 0.6 + index * 0.2, duration: 0.5 }}
                            whileHover={{ x: 10 }}
                            className="flex items-start gap-4"
                        >
                            {/* Date badge */}
                            <motion.div
                                whileHover={{ scale: 1.15 }}
                                transition={{ duration: 0.3 }}
                                className={`shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold shadow-lg relative z-10 bg-linear-to-br ${item.gradient}`}
                            >
                                {item.year}
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className={`flex-1 p-6 rounded-xl ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {item.title}
                                    </h4>
                                    {item.current && (
                                        <motion.span
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className={`text-xs font-medium px-2 py-1 rounded-full ${isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'
                                                }`}
                                        >
                                            Current
                                        </motion.span>
                                    )}
                                </div>
                                <p className={`font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                    {item.company}
                                </p>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default function WebAbout() {
    const { currentTheme } = useDesktopStore();
    const isDark = currentTheme === 'dark';
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: false, margin: '-100px' });

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start']
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

    return (
        <section
            ref={sectionRef}
            className={`py-20 relative overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
            {/* Animated background blobs */}
            <motion.div
                style={{ y, opacity }}
                className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
            />
            <motion.div
                style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]) }}
                className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.6 }}
                >
                    <Header isInView={isInView} isDark={isDark} />
                    <StatsGrid isInView={isInView} isDark={isDark} />
                    <BioSection isInView={isInView} isDark={isDark} />
                    <TimelineSection isInView={isInView} isDark={isDark} />
                </motion.div>
            </div>
        </section>
    );
}
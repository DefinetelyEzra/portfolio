'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, MapPin, Trophy, Target, TrendingUp, Code } from 'lucide-react';
import { useDesktopStore } from '@/store/desktopStore';

export default function WebAbout() {
    const { currentTheme } = useDesktopStore();
    const isDark = currentTheme === 'dark';
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const stats = [
        { icon: Trophy, label: 'Projects Completed', value: '10+', color: 'text-yellow-500' },
        { icon: Target, label: 'Students Mentored', value: '100+', color: 'text-blue-500' },
        { icon: Code, label: 'Technologies', value: '15+', color: 'text-purple-500' },
        { icon: TrendingUp, label: 'Years Experience', value: '3+', color: 'text-green-500' },
    ];

    const timeline = [
        {
            year: '2026',
            title: 'Bachelor of Computer Science',
            company: 'Pan-Atlantic University',
            current: false,
        },
        {
            year: '2024',
            title: 'Lab Intern',
            company: 'PAU VHCI Lab',
            current: true,
        },
        {
            year: '2020',
            title: 'Student/Teaching Assistant',
            company: 'University of Regina',
            current: false,
        },
    ];

    return (
        <section
            ref={ref}
            className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                            About Me
                        </h2>
                        <div className="w-20 h-1 bg-linear-to-r from-blue-500 to-purple-500 mx-auto mb-6" />
                        <p className={`text-lg max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                            Passionate about transforming ideas into reality through code and innovation
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className={`p-6 rounded-xl text-center ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                                <div className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {stat.value}
                                </div>
                                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bio Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className={`p-8 rounded-2xl mb-16 ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-linear-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-full flex items-center justify-center">
                                <span className="text-white text-xl font-bold">OA</span>
                            </div>
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
                            <p>
                                I'm a driven Computer Science undergraduate with a burning passion for machine learning and fullstack development.
                                I thrive on solving complex problems with code, crafting AI-driven solutions and scalable web applications that make a tangible difference.
                            </p>
                            <p>
                                At Pan-Atlantic University's VHCI Lab, I built VR tools that enhance education,
                                while my experience as a student mentor has sharpened my communication and leadership skills.
                                These experiences have shaped me into someone who values collaboration and thrives in dynamic,
                                fast-paced environments.
                            </p>
                            <p>
                                My ultimate goal is to harness my problem-solving skills to uplift communities,
                                transform Nigeria, and one day impact the world. Every line of code I write is a step toward building
                                solutions that empower, connect, and inspire.
                            </p>
                        </div>
                    </motion.div>

                    {/* Timeline */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        <h3 className={`text-2xl font-bold mb-8 text-center ${isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                            My Journey
                        </h3>
                        <div className="space-y-6">
                            {timeline.map((item, index) => (
                                <motion.div
                                    key={`${item.year}-${item.company}`}
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                                    className="flex items-start gap-4"
                                >
                                    <div className={`shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${item.current
                                        ? 'bg-linear-to-br from-green-500 to-teal-600'
                                        : 'bg-linear-to-br from-blue-600 to-purple-700'
                                        }`}>
                                        {item.year}
                                    </div>
                                    <div className={`flex-1 p-6 rounded-xl ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                                        }`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {item.title}
                                            </h4>
                                            {item.current && (
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'
                                                    }`}>Current</span>
                                            )}
                                        </div>
                                        <p className={`font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                            {item.company}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
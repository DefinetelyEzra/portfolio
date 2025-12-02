'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code, Database, Cloud, Globe, Cpu, BarChart } from 'lucide-react';
import { useDesktopStore } from '@/store/desktopStore';

export default function WebSkills() {
    const { currentTheme } = useDesktopStore();
    const isDark = currentTheme === 'dark';
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const skillCategories = [
        {
            icon: Code,
            title: 'Languages',
            skills: [
                { name: 'Python', level: 90 },
                { name: 'JavaScript/TypeScript', level: 85 },
                { name: 'Java', level: 80 },
                { name: 'C++', level: 85 },
                { name: 'Rust', level: 75 },
                { name: 'C#', level: 80 },
            ],
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: Globe,
            title: 'Web & Mobile',
            skills: [
                { name: 'React', level: 88 },
                { name: 'Next.js', level: 85 },
                { name: 'Flask', level: 85 },
                { name: 'Node.js', level: 80 },
            ],
            color: 'from-green-500 to-teal-500',
        },
        {
            icon: Database,
            title: 'Databases',
            skills: [
                { name: 'PostgreSQL', level: 85 },
                { name: 'MySQL', level: 80 },
                { name: 'MongoDB', level: 75 },
            ],
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: Cpu,
            title: '3D & VR',
            skills: [
                { name: 'Unity', level: 85 },
                { name: 'Blender', level: 80 },
                { name: 'Oculus SDK', level: 75 },
            ],
            color: 'from-orange-500 to-red-500',
        },
        {
            icon: Cloud,
            title: 'Cloud & DevOps',
            skills: [
                { name: 'AWS', level: 75 },
                { name: 'Docker', level: 80 },
                { name: 'Kubernetes', level: 70 },
            ],
            color: 'from-indigo-500 to-purple-500',
        },
        {
            icon: BarChart,
            title: 'Data Science',
            skills: [
                { name: 'Pandas', level: 80 },
                { name: 'NumPy', level: 80 },
                { name: 'Scikit-learn', level: 75 },
            ],
            color: 'from-yellow-500 to-orange-500',
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
                            Technical Skills
                        </h2>
                        <div className="w-20 h-1 bg-linear-to-r from-blue-500 to-purple-500 mx-auto mb-6" />
                        <p className={`text-lg max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                            Expertise across different technologies and domains
                        </p>
                    </div>

                    {/* Skills Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {skillCategories.map((category, categoryIndex) => (
                            <motion.div
                                key={category.title}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ delay: categoryIndex * 0.1, duration: 0.5 }}
                                className={`p-6 rounded-2xl ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                {/* Category Header */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`w-12 h-12 bg-linear-to-br ${category.color} rounded-lg flex items-center justify-center`}>
                                        <category.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {category.title}
                                    </h3>
                                </div>

                                {/* Skills List */}
                                <div className="space-y-4">
                                    {category.skills.map((skill, skillIndex) => (
                                        <div key={skill.name}>
                                            <div className="flex justify-between mb-2">
                                                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {skill.name}
                                                </span>
                                                <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {skill.level}%
                                                </span>
                                            </div>
                                            <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'
                                                }`}>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={isInView ? { width: `${skill.level}%` } : {}}
                                                    transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05 + 0.3, duration: 0.8 }}
                                                    className={`h-full bg-linear-to-r ${category.color}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
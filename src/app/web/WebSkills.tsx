'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code, Database, Cloud, Globe, Cpu, BarChart } from 'lucide-react';
import { useDesktopStore } from '@/store/desktopStore';

interface Skill {
    name: string;
    level: number;
}

interface SkillCategory {
    icon: typeof Code;
    title: string;
    skills: Skill[];
    color: string;
}

export default function WebSkills() {
    const { currentTheme } = useDesktopStore();
    const isDark = currentTheme === 'dark';
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef);

    const skillCategories: SkillCategory[] = [
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

    const renderBackgroundOrbs = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {skillCategories.map((category, i) => (
                <motion.div
                    key={`orb-${category.title}`}
                    className={`absolute w-64 h-64 rounded-full blur-3xl opacity-20 bg-linear-to-br ${category.color}`}
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -100, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 15 + i * 2,
                        repeat: Infinity,
                        delay: i * 2,
                    }}
                    style={{
                        left: `${(i % 3) * 33}%`,
                        top: `${Math.floor(i / 3) * 50}%`,
                    }}
                />
            ))}
        </div>
    );

    const renderSkillItem = (categoryIndex: number, skill: Skill, skillIndex: number) => {
        const skillAnimationDelay = categoryIndex * 0.1 + skillIndex * 0.05;

        return (
            <div key={skill.name}>
                <div className="flex justify-between mb-2">
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ delay: skillAnimationDelay }}
                        className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                        {skill.name}
                    </motion.span>
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: skillAnimationDelay + 0.2 }}
                        className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                        {skill.level}%
                    </motion.span>
                </div>

                {/* Progress bar with glow effect */}
                <div className={`h-2 rounded-full overflow-hidden relative ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                        transition={{
                            delay: skillAnimationDelay + 0.3,
                            duration: 0.8,
                            ease: 'easeOut',
                        }}
                        className={`h-full bg-linear-to-r ${skillCategories[categoryIndex].color} relative`}
                    />
                </div>
            </div>
        );
    };

    const renderSkillCategory = (category: SkillCategory, categoryIndex: number) => {
        const IconComponent = category.icon;

        return (
            <motion.div
                key={category.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ delay: categoryIndex * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className={`p-6 rounded-2xl relative overflow-hidden ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}
            >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        className={`w-12 h-12 bg-linear-to-br ${category.color} rounded-lg flex items-center justify-center`}
                    >
                        <IconComponent className="w-6 h-6 text-white" />
                    </motion.div>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {category.title}
                    </h3>
                </div>

                {/* Skills List */}
                <div className="space-y-4">
                    {category.skills.map((skill, skillIndex) =>
                        renderSkillItem(categoryIndex, skill, skillIndex)
                    )}
                </div>
            </motion.div>
        );
    };

    const renderHeader = () => (
        <div className="text-center mb-16">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 mb-4"
            >
                <span className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    What I Know
                </span>
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.2 }}
                className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
                Technical Skills
            </motion.h2>

            <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: '5rem' } : { width: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="h-1 bg-linear-to-r from-green-500 to-teal-500 mx-auto mb-6"
            />

            <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.6 }}
                className={`text-lg max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            >
                Expertise across different technologies and domains
            </motion.p>
        </div>
    );

    return (
        <section
            ref={sectionRef}
            className={`py-20 relative overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
            {renderBackgroundOrbs()}

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.6 }}
                >
                    {renderHeader()}

                    {/* Skills Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {skillCategories.map(renderSkillCategory)}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
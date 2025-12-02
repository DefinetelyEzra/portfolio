'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Eye } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { useDesktopStore } from '@/store/desktopStore';

export default function WebProjects() {
    const { currentTheme } = useDesktopStore();
    const isDark = currentTheme === 'dark';
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const projects = [
        {
            title: 'SCARLET - AI Productivity Assistant',
            description: 'Fullstack web application leveraging AI for personalized time management with custom NLP model for parsing tasks and forecasting productivity.',
            tags: ['Python', 'Flask', 'PostgreSQL', 'React', 'NLP', 'AI'],
            icon: '🧠',
            githubUrl: 'https://github.com/DefinetelyEzra/project_buffer',
            status: 'ongoing',
            gradient: 'from-purple-600 to-blue-600',
        },
        {
            title: 'Virtual Reality Museum',
            description: 'Immersive VR experience recreating the Yemisi Shyllon Museum to enhance cultural accessibility with accurate 3D models.',
            tags: ['Unity', 'Blender', 'C#', 'Oculus Quest', 'VR'],
            icon: '🥽',
            status: 'completed',
            gradient: 'from-pink-600 to-purple-600',
        },
        {
            title: 'Educational VR Tools',
            description: 'VR-based educational tools developed during lab internship, focusing on interactive learning outcomes.',
            tags: ['Unity', 'VR', 'Education', 'C#'],
            icon: '🎓',
            status: 'completed',
            gradient: 'from-green-600 to-teal-600',
        },
        {
            title: 'Programming Tutorial System',
            description: 'Interactive learning platform with quizzes and exercises for programming education.',
            tags: ['C++', 'Rust', 'C', 'Education'],
            icon: '💻',
            status: 'completed',
            gradient: 'from-orange-600 to-red-600',
        },
    ];

    return (
        <section
            ref={ref}
            className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
            id="projects"
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
                            My Projects
                        </h2>
                        <div className="w-20 h-1 bg-linear-to-r from-blue-500 to-purple-500 mx-auto mb-6" />
                        <p className={`text-lg max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                            AI, VR, and Fullstack Development projects that solve real-world problems
                        </p>
                    </div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.title}
                                initial={{ opacity: 0, y: 50 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className={`group rounded-2xl overflow-hidden transition-all hover:scale-[1.02] ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-md'
                                    }`}
                            >
                                {/* Project Header */}
                                <div className={`relative h-48 bg-linear-to-br ${project.gradient} overflow-hidden`}>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-8xl opacity-20">{project.icon}</span>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${project.status === 'ongoing'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-blue-500 text-white'
                                            }`}>
                                            {project.status === 'ongoing' ? 'In Progress' : 'Completed'}
                                        </span>
                                    </div>
                                </div>

                                {/* Project Content */}
                                <div className="p-6">
                                    <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {project.title}
                                    </h3>
                                    <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {project.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className={`text-xs px-2 py-1 rounded-full ${isDark
                                                    ? 'bg-gray-700 text-gray-300'
                                                    : 'bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark
                                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                    }`}
                                            >
                                                <FaGithub className="w-4 h-4" />
                                                Code
                                            </a>
                                        )}
                                        <button
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                                                }`}
                                        >
                                            {project.tags.includes('VR') ? <Eye className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                                            {project.tags.includes('VR') ? 'View' : 'Demo'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
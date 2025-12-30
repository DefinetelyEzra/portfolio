'use client';

import { motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { ExternalLink, Eye } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { useDesktopStore } from '@/store/desktopStore';

interface Project {
    title: string;
    description: string;
    tags: string[];
    icon: string;
    githubUrl?: string;
    status: string;
    gradient: string;
    accentColor: string;
}

export default function WebProjects() {
    const { currentTheme } = useDesktopStore();
    const isDark = currentTheme === 'dark';
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    const projects: Project[] = [
        {
            title: 'SCARLET - AI Productivity Assistant',
            description: 'Fullstack web application leveraging AI for personalized time management with custom NLP model for parsing tasks and forecasting productivity.',
            tags: ['Python', 'Flask', 'PostgreSQL', 'React', 'NLP', 'AI'],
            icon: '🧠',
            githubUrl: 'https://github.com/DefinetelyEzra/project_buffer',
            status: 'ongoing',
            gradient: 'from-purple-600 to-blue-600',
            accentColor: 'purple',
        },
        {
            title: 'Virtual Reality Museum',
            description: 'Immersive VR experience recreating the Yemisi Shyllon Museum to enhance cultural accessibility with accurate 3D models.',
            tags: ['Unity', 'Blender', 'C#', 'Oculus Quest', 'VR'],
            icon: '🥽',
            status: 'completed',
            gradient: 'from-pink-600 to-purple-600',
            accentColor: 'pink',
        },
        {
            title: 'Educational VR Tools',
            description: 'VR-based educational tools developed during lab internship, focusing on interactive learning outcomes.',
            tags: ['Unity', 'VR', 'Education', 'C#'],
            icon: '🎓',
            status: 'completed',
            gradient: 'from-green-600 to-teal-600',
            accentColor: 'green',
        },
        {
            title: 'Programming Tutorial System',
            description: 'Interactive learning platform with quizzes and exercises for programming education.',
            tags: ['C++', 'Rust', 'C', 'Education'],
            icon: '💻',
            status: 'completed',
            gradient: 'from-orange-600 to-red-600',
            accentColor: 'orange',
        },
    ];

    return (
        <section
            ref={sectionRef}
            className={`py-20 relative overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
            id="projects"
        >
            {/* Animated background grid */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(${isDark ? '#374151' : '#e5e7eb'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#374151' : '#e5e7eb'} 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                }} />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Header */}
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 mb-4"
                        >
                            <span className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                                My Work
                            </span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ delay: 0.2 }}
                            className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
                        >
                            My Projects
                        </motion.h2>

                        <motion.div
                            initial={{ width: 0 }}
                            animate={isInView ? { width: '5rem' } : { width: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="h-1 bg-linear-to-r from-purple-500 to-pink-500 mx-auto mb-6"
                        />

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ delay: 0.6 }}
                            className={`text-lg max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                        >
                            AI, VR, and Fullstack Development projects that solve real-world problems
                        </motion.p>
                    </div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {projects.map((project, index) => (
                            <ProjectCard
                                key={project.title}
                                project={project}
                                index={index}
                                isInView={isInView}
                                isDark={isDark}
                                isHovered={hoveredCard === index}
                                onHover={() => setHoveredCard(index)}
                                onLeave={() => setHoveredCard(null)}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

interface ProjectCardProps {
    project: Project;
    index: number;
    isInView: boolean;
    isDark: boolean;
    isHovered: boolean;
    onHover: () => void;
    onLeave: () => void;
}

function ProjectCard({
    project,
    index,
    isInView,
    isDark,
    isHovered,
    onHover,
    onLeave
}: Readonly<ProjectCardProps>) {
    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
    const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
        onLeave();
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={onHover}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX: isHovered ? rotateX : 0,
                rotateY: isHovered ? rotateY : 0,
                transformStyle: 'preserve-3d',
            }}
            whileHover={{ scale: 1.02 }}
            className={`group rounded-2xl overflow-hidden transition-all ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-md'
                }`}
        >
            <ProjectHeader project={project} isHovered={isHovered} />
            <ProjectContent project={project} isHovered={isHovered} isDark={isDark} isInView={isInView} index={index} />
        </motion.div>
    );
}

interface ProjectHeaderProps {
    project: Project;
    isHovered: boolean;
}

function ProjectHeader({ project, isHovered }: Readonly<ProjectHeaderProps>) {
    return (
        <div className={`relative h-48 bg-linear-to-br ${project.gradient} overflow-hidden`}>
            {/* Animated mesh gradient */}
            <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: 'reverse',
                }}
                style={{
                    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                    backgroundSize: '200% 200%',
                }}
            />

            {/* Floating icon - REMOVED SPIN ANIMATION */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                    y: isHovered ? -10 : 0,
                    rotateZ: isHovered ? 5 : 0,
                    scale: isHovered ? 1.2 : 1,
                }}
                transition={{ duration: 0.3 }}
            >
                <motion.span
                    className="text-8xl opacity-20"
                    animate={{
                        scale: isHovered ? 1.2 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                >
                    {project.icon}
                </motion.span>
            </motion.div>

            {/* Status badge */}
            <div className="absolute top-4 right-4">
                <motion.span
                    whileHover={{ scale: 1.1 }}
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${project.status === 'ongoing'
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 text-white'
                        }`}
                >
                    {project.status === 'ongoing' ? 'In Progress' : 'Completed'}
                </motion.span>
            </div>

            {/* Corner accent */}
            <motion.div
                className="absolute top-0 left-0 w-20 h-20 bg-white/10"
                style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
                animate={{
                    scale: isHovered ? 1.5 : 1,
                }}
                transition={{ duration: 0.3 }}
            />
        </div>
    );
}

interface ProjectContentProps {
    project: Project;
    isHovered: boolean;
    isDark: boolean;
    isInView: boolean;
    index: number;
}

function ProjectContent({ project, isHovered, isDark, isInView, index }: Readonly<ProjectContentProps>) {
    return (
        <div className="p-6">
            <motion.h3
                className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
                animate={{
                    x: isHovered ? 5 : 0,
                }}
            >
                {project.title}
            </motion.h3>

            <motion.p
                className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                animate={{
                    x: isHovered ? 5 : 0,
                }}
                transition={{ delay: 0.05 }}
            >
                {project.description}
            </motion.p>

            <ProjectTags tags={project.tags} isInView={isInView} index={index} isDark={isDark} />
            <ProjectActions project={project} isDark={isDark} />
        </div>
    );
}

interface ProjectTagsProps {
    tags: string[];
    isInView: boolean;
    index: number;
    isDark: boolean;
}

function ProjectTags({ tags, isInView, index, isDark }: Readonly<ProjectTagsProps>) {
    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, i) => (
                <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                    transition={{ delay: index * 0.1 + i * 0.05 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className={`text-xs px-2 py-1 rounded-full ${isDark
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-100 text-gray-700'
                        }`}
                >
                    {tag}
                </motion.span>
            ))}
        </div>
    );
}

interface ProjectActionsProps {
    project: Project;
    isDark: boolean;
}

function ProjectActions({ project, isDark }: Readonly<ProjectActionsProps>) {
    return (
        <div className="flex gap-3">
            {project.githubUrl && (
                <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                >
                    <FaGithub className="w-4 h-4" />
                    Code
                </motion.a>
            )}
            <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-linear-to-r ${project.gradient} text-white`}
            >
                {project.tags.includes('VR') ? <Eye className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                {project.tags.includes('VR') ? 'View' : 'Demo'}
            </motion.button>
        </div>
    );
}
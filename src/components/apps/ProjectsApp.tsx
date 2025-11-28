'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Play, Eye } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { useDesktopStore } from '@/store/desktopStore';
import ComingSoon from '../ComingSoon';

const getThemeStyles = (currentTheme: string) => ({
    background: currentTheme === 'dark'
        ? 'from-gray-900 via-gray-800 to-gray-700'
        : 'from-gray-50 to-white',

    cardBackground: currentTheme === 'dark'
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200',

    text: {
        primary: currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900',
        secondary: currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600',
        muted: 'text-gray-500',
    },

    input: currentTheme === 'dark'
        ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-blue-400 focus:border-blue-400'
        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500',

    select: currentTheme === 'dark'
        ? 'bg-gray-800 border-gray-600 text-gray-100 focus:ring-blue-400'
        : 'bg-white border-gray-200 text-gray-900 focus:ring-blue-500',

    button: {
        active: currentTheme === 'dark'
            ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
            : 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600',
        inactive: currentTheme === 'dark'
            ? 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50',
    },

    projectCard: currentTheme === 'dark'
        ? 'bg-gray-800 border-gray-700 hover:shadow-xl hover:shadow-gray-900/20'
        : 'bg-white border-gray-200 hover:shadow-md',

    headerBorder: currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200',
});

interface Project {
    id: string;
    title: string;
    description: string;
    image: string;
    tags: string[];
    demoUrl?: string;
    githubUrl?: string;
    featured: boolean;
    status: 'completed' | 'ongoing';
    year: string;
    comingSoon?: boolean;
}

const PROJECTS: Project[] = [
    {
        id: '1',
        title: 'SCARLET - AI Productivity Assistant',
        description: 'Fullstack web application leveraging AI for personalized time management and productivity tracking with custom NLP model for parsing tasks and forecasting productivity.',
        image: 'public/projects/scarlet.jpg',
        tags: ['Python', 'Flask', 'PostgreSQL', 'React', 'NLP', 'AI'],
        demoUrl: 'coming soon',
        githubUrl: 'https://github.com/DefinetelyEzra/project_buffer',
        featured: true,
        status: 'ongoing',
        year: '2025',
        comingSoon: true
    },
    {
        id: '2',
        title: 'Virtual Reality Museum - Yemisi Shyllon Recreation',
        description: 'Immersive VR experience recreating the Yemisi Shyllon Museum to enhance cultural accessibility with accurate 3D models and optimized performance for mobile VR platforms.',
        image: '/projects/vr-museum.jpg',
        tags: ['Unity', 'Blender', 'C#', 'Oculus Quest', 'VR', '3D Modeling'],
        demoUrl: 'coming soon',
        featured: true,
        status: 'completed',
        year: '2024',
        comingSoon: true
    },
    {
        id: '3',
        title: 'Educational VR Tools',
        description: 'VR-based educational tools developed during lab internship, focusing on interactive learning outcomes and immersive educational experiences.',
        image: '/projects/edu-vr.jpg',
        tags: ['Unity', 'VR', 'Education', 'C#', 'Human-Computer Interaction'],
        featured: false,
        status: 'completed',
        year: '2024',
    },
    {
        id: '4',
        title: 'Programming Tutorial System',
        description: 'Interactive learning platform with quizzes, exercises, and lab content for programming education, developed during teaching assistant role.',
        image: '/projects/tutorial.jpg',
        tags: ['C++', 'Rust', 'C', 'Education', 'Web Development'],
        featured: false,
        status: 'completed',
        year: '2020',
    },
];

const getTagColors = (currentTheme: string) => {
    const isDark = currentTheme === 'dark';

    const darkTheme = {
        Python: 'bg-yellow-900/40 text-yellow-300 border border-yellow-800',
        Flask: 'bg-red-900/40 text-red-300 border border-red-800',
        PostgreSQL: 'bg-indigo-900/40 text-indigo-300 border border-indigo-800',
        React: 'bg-blue-900/40 text-blue-300 border border-blue-800',
        NLP: 'bg-green-900/40 text-green-300 border border-green-800',
        AI: 'bg-purple-900/40 text-purple-300 border border-purple-800',
        Unity: 'bg-gray-700 text-gray-300 border border-gray-600',
        Blender: 'bg-orange-900/40 text-orange-300 border border-orange-800',
        'C#': 'bg-emerald-900/40 text-emerald-300 border border-emerald-800',
        'Oculus Quest': 'bg-cyan-900/40 text-cyan-300 border border-cyan-800',
        VR: 'bg-pink-900/40 text-pink-300 border border-pink-800',
        '3D Modeling': 'bg-teal-900/40 text-teal-300 border border-teal-800',
        'C++': 'bg-blue-900/40 text-blue-300 border border-blue-800',
        Rust: 'bg-red-900/40 text-red-300 border border-red-800',
        C: 'bg-gray-700 text-gray-300 border border-gray-600',
        Education: 'bg-green-900/40 text-green-300 border border-green-800',
        'Human-Computer Interaction': 'bg-purple-900/40 text-purple-300 border border-purple-800',
        'Web Development': 'bg-indigo-900/40 text-indigo-300 border border-indigo-800',
    };

    const lightTheme = {
        Python: 'bg-yellow-100 text-yellow-800',
        Flask: 'bg-red-100 text-red-800',
        PostgreSQL: 'bg-indigo-100 text-indigo-800',
        React: 'bg-blue-100 text-blue-800',
        NLP: 'bg-green-100 text-green-800',
        AI: 'bg-purple-100 text-purple-800',
        Unity: 'bg-gray-100 text-gray-800',
        Blender: 'bg-orange-100 text-orange-800',
        'C#': 'bg-emerald-100 text-emerald-800',
        'Oculus Quest': 'bg-cyan-100 text-cyan-800',
        VR: 'bg-pink-100 text-pink-800',
        '3D Modeling': 'bg-teal-100 text-teal-800',
        'C++': 'bg-blue-100 text-blue-800',
        Rust: 'bg-red-100 text-red-800',
        C: 'bg-gray-100 text-gray-800',
        Education: 'bg-green-100 text-green-800',
        'Human-Computer Interaction': 'bg-purple-100 text-purple-800',
        'Web Development': 'bg-indigo-100 text-indigo-800',
    };

    return isDark ? darkTheme : lightTheme;
};

export default function ProjectsApp() {
    const { currentTheme } = useDesktopStore();
    const styles = getThemeStyles(currentTheme);
    const tagColors = getTagColors(currentTheme);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);
    const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'ongoing'>('all');
    const [showComingSoon, setShowComingSoon] = useState(false);
    const [comingSoonProject, setComingSoonProject] = useState<Project | null>(null);

    const allTags = Array.from(new Set(PROJECTS.flatMap(p => p.tags))).sort((a, b) => a.localeCompare(b));

    const filteredProjects = PROJECTS.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = !selectedTag || project.tags.includes(selectedTag);
        const matchesFeatured = !showOnlyFeatured || project.featured;
        const matchesStatus = statusFilter === 'all' || project.status === statusFilter;

        return matchesSearch && matchesTag && matchesFeatured && matchesStatus;
    });

    const handleDemoClick = (project: Project) => {
        if (project.comingSoon) {
            setComingSoonProject(project);
            setShowComingSoon(true);
        } else {
            window.open(project.demoUrl, '_blank');
        }
    };

    const getProjectGradient = (project: Project): string => {
        if (project.tags.includes('AI')) {
            return 'from-purple-600 via-blue-600 to-indigo-700';
        }
        if (project.tags.includes('VR')) {
            return 'from-pink-600 via-purple-600 to-indigo-700';
        }
        return 'from-blue-600 via-indigo-600 to-purple-700';
    };

    return (
        <div className={`h-full flex flex-col bg-linear-to-br ${styles.background}`}>
            {/* Header */}
            <div className={`p-6 border-b ${styles.headerBorder}`}>
                <h1 className={`text-2xl font-bold ${styles.text.primary} mb-2`}>My Projects</h1>
                <p className={`${styles.text.secondary} mb-4`}>AI, VR, and Fullstack Development</p>

                {/* Search and Filters */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${styles.text.secondary} w-4 h-4`} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${styles.input}`}
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 flex-wrap">
                        <select
                            value={selectedTag || ''}
                            onChange={(e) => setSelectedTag(e.target.value || null)}
                            className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${styles.select}`}
                        >
                            <option value="">All Technologies</option>
                            {allTags.map(tag => (
                                <option key={tag} value={tag}>{tag}</option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'completed' | 'ongoing')}
                            className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${styles.select}`}
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="ongoing">Ongoing</option>
                        </select>

                        <button
                            onClick={() => setShowOnlyFeatured(!showOnlyFeatured)}
                            className={`px-3 py-2 rounded-lg border transition-colors flex items-center gap-2 ${showOnlyFeatured ? styles.button.active : styles.button.inactive}`}
                        >
                            <Filter className="w-4 h-4" />
                            Featured
                        </button>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="flex-1 p-6 overflow-y-auto">
                {filteredProjects.length === 0 ? (
                    <div className="text-center py-12">
                        <p className={styles.text.secondary}>No projects found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredProjects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.3 }}
                                className={`${styles.projectCard} rounded-xl shadow-sm border overflow-hidden transition-all group`}
                            >
                                {/* Project Image */}
                                <div className="relative h-48 bg-linear-to-br from-blue-500 via-purple-600 to-indigo-700 overflow-hidden">
                                    {/* Project Icon */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-white text-6xl font-bold opacity-20">
                                            {(() => {
                                                if (project.tags.includes('VR')) return '🥽';
                                                if (project.tags.includes('AI')) return '🧠';
                                                return '💻';
                                            })()}
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold ${project.status === 'ongoing'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-blue-500 text-white'
                                        }`}>
                                        {project.status === 'ongoing' ? 'In Progress' : 'Completed'}
                                    </div>

                                    {/* Featured Badge */}
                                    {project.featured && (
                                        <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                            ⭐ Featured
                                        </div>
                                    )}

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                                        {project.demoUrl && (
                                            <button
                                                onClick={() => handleDemoClick(project)}
                                                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
                                            >
                                                {project.tags.includes('VR') ? <Eye className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                <span>{project.tags.includes('VR') ? 'View' : 'Demo'}</span>
                                            </button>
                                        )}
                                        {project.githubUrl && (
                                            <button
                                                onClick={() => window.open(project.githubUrl, '_blank')}
                                                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
                                            >
                                                <FaGithub className="w-4 h-4" />
                                                <span>Code</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Project Content */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className={`text-xl font-semibold ${styles.text.primary}`}>
                                            {project.title}
                                        </h3>
                                        <span className={`text-sm font-medium ${styles.text.muted}`}>{project.year}</span>
                                    </div>
                                    <p className={`${styles.text.secondary} mb-4 line-clamp-3`}>
                                        {project.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${tagColors[tag as keyof typeof tagColors] || (currentTheme === 'dark' ? 'bg-gray-700 text-gray-300 border border-gray-600' : 'bg-gray-100 text-gray-800')}`}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {/* Coming Soon Modal */}
                                {showComingSoon && comingSoonProject && (
                                    <div className="absolute inset-0 z-50">
                                        <ComingSoon
                                            title={`${comingSoonProject.title} Demo`}
                                            subtitle="Launch Coming Soon"
                                            description={`The demo for ${comingSoonProject.title} is currently being prepared. This ${comingSoonProject.tags.includes('VR') ? 'VR experience' : 'application'} will be available for testing soon.`}
                                            variant="default"
                                            gradient={getProjectGradient(comingSoonProject)}
                                            showBackButton={true}
                                            onBack={() => {
                                                setShowComingSoon(false);
                                                setComingSoonProject(null);
                                            }}
                                            targetDate={new Date('2025-11-15T00:00:00')}
                                        />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
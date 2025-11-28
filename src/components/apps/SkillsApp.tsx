'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Code, Database, Cpu, Zap, Star, Trophy, Target, TrendingUp, Globe, Cloud, BarChart } from 'lucide-react';
import { useDesktopStore } from '@/store/desktopStore';

interface Skill {
  name: string;
  level: number;
  category: string;
  yearsExperience: number;
  projects: number;
  color: string;
  icon?: string;
}

const getThemeStyles = (currentTheme: string) => {
  const isDark = currentTheme === 'dark';

  const darkTheme = {
    background: 'from-gray-900 via-gray-800 to-gray-700',
    cardBackground: 'bg-gray-800 border-gray-700',
    cardHover: 'hover:bg-gray-750 hover:border-gray-600',
    text: {
      primary: 'text-gray-100',
      secondary: 'text-gray-400',
      muted: 'text-gray-500',
    },
    headerBorder: 'border-gray-700',
    statsCard: 'bg-gray-800 border-gray-700',
    filterButton: {
      active: 'bg-indigo-600 text-white',
      inactive: 'bg-gray-700 text-gray-300 hover:bg-gray-600',
    },
    viewToggle: {
      container: 'bg-gray-700',
      active: 'bg-gray-800 shadow-sm',
      inactive: 'text-gray-400',
    },
    progressBar: {
      background: 'bg-gray-700',
    },
    skillLevel: {
      expert: 'bg-green-900/50 text-green-300',
      advanced: 'bg-blue-900/50 text-blue-300',
      intermediate: 'bg-yellow-900/50 text-yellow-300',
      beginner: 'bg-gray-700 text-gray-300',
    },
    categoryIcon: 'from-indigo-600 to-purple-700',
  };

  const lightTheme = {
    background: 'from-purple-50 via-white to-indigo-50',
    cardBackground: 'bg-white border-gray-200',
    cardHover: 'hover:shadow-md',
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      muted: 'text-gray-500',
    },
    headerBorder: 'border-gray-200',
    statsCard: 'bg-white border-gray-100',
    filterButton: {
      active: 'bg-indigo-500 text-white',
      inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    },
    viewToggle: {
      container: 'bg-gray-100',
      active: 'bg-white shadow-sm',
      inactive: 'text-gray-600',
    },
    progressBar: {
      background: 'bg-gray-200',
    },
    skillLevel: {
      expert: 'bg-green-100 text-green-600',
      advanced: 'bg-blue-100 text-blue-600',
      intermediate: 'bg-yellow-100 text-yellow-600',
      beginner: 'bg-gray-100 text-gray-600',
    },
    categoryIcon: 'from-indigo-500 to-purple-600',
  };

  return isDark ? darkTheme : lightTheme;
};

const skillsData: Skill[] = [
  // Programming Languages
  { name: 'Python', level: 90, category: 'Languages', yearsExperience: 3, projects: 3, color: 'bg-yellow-500', icon: '🐍' },
  { name: 'JavaScript/TypeScript', level: 85, category: 'Languages', yearsExperience: 2, projects: 2, color: 'bg-yellow-400', icon: '⚡' },
  { name: 'Java', level: 80, category: 'Languages', yearsExperience: 2, projects: 2, color: 'bg-red-500', icon: '☕' },
  { name: 'C++', level: 85, category: 'Languages', yearsExperience: 3, projects: 3, color: 'bg-blue-600', icon: '🔷' },
  { name: 'Rust', level: 75, category: 'Languages', yearsExperience: 4, projects: 1, color: 'bg-orange-600', icon: '🦀' },
  { name: 'C#', level: 80, category: 'Languages', yearsExperience: 1, projects: 1, color: 'bg-purple-600', icon: '🎯' },
  { name: 'SQL', level: 85, category: 'Languages', yearsExperience: 4, projects: 10, color: 'bg-indigo-500', icon: '🗄️' },
  { name: 'Solidity', level: 70, category: 'Languages', yearsExperience: 1, projects: 1, color: 'bg-teal-500', icon: '🔗' },

  // Web & Mobile Development
  { name: 'React', level: 88, category: 'Web & Mobile', yearsExperience: 3, projects: 3, color: 'bg-cyan-500', icon: '⚛️' },
  { name: 'Flask', level: 85, category: 'Web & Mobile', yearsExperience: 1, projects: 1, color: 'bg-teal-500', icon: '🌶️' },
  { name: 'SQLAlchemy', level: 80, category: 'Web & Mobile', yearsExperience: 1, projects: 1, color: 'bg-green-600', icon: '🔗' },
  { name: 'OpenGL', level: 70, category: 'Web & Mobile', yearsExperience: 1, projects: 3, color: 'bg-red-600', icon: '🎨' },
  { name: 'SDL', level: 75, category: 'Web & Mobile', yearsExperience: 1, projects: 2, color: 'bg-blue-700', icon: '🎮' },
  { name: 'Web3.js', level: 70, category: 'Web & Mobile', yearsExperience: 1, projects: 2, color: 'bg-purple-500', icon: '🌐' },

  // Databases
  { name: 'PostgreSQL', level: 85, category: 'Databases', yearsExperience: 2, projects: 8, color: 'bg-blue-800', icon: '🐘' },
  { name: 'MySQL', level: 80, category: 'Databases', yearsExperience: 2, projects: 6, color: 'bg-orange-500', icon: '🗃️' },
  { name: 'PgAdmin', level: 75, category: 'Databases', yearsExperience: 1, projects: 5, color: 'bg-teal-600', icon: '⚙️' },

  // 3D & VR Tools
  { name: 'Unity', level: 85, category: '3D & VR', yearsExperience: 2, projects: 1, color: 'bg-white', icon: '🎯' },
  { name: 'Blender', level: 80, category: '3D & VR', yearsExperience: 1, projects: 2, color: 'bg-orange-600', icon: '🎨' },

  // Cloud & DevOps
  { name: 'AWS', level: 75, category: 'Cloud & DevOps', yearsExperience: 1, projects: 1, color: 'bg-orange-500', icon: '☁️' },
  { name: 'Azure', level: 70, category: 'Cloud & DevOps', yearsExperience: 1, projects: 1, color: 'bg-blue-500', icon: '☁️' },
  { name: 'Docker', level: 80, category: 'Cloud & DevOps', yearsExperience: 2, projects: 3, color: 'bg-cyan-600', icon: '🐳' },
  { name: 'Kubernetes', level: 70, category: 'Cloud & DevOps', yearsExperience: 1, projects: 1, color: 'bg-blue-600', icon: '⚓' },
  { name: 'Terraform', level: 70, category: 'Cloud & DevOps', yearsExperience: 1, projects: 1, color: 'bg-purple-600', icon: '🏗️' },

  // Data Science
  { name: 'Pandas', level: 80, category: 'Data Science', yearsExperience: 2, projects: 2, color: 'bg-green-500', icon: '🐼' },
  { name: 'NumPy', level: 80, category: 'Data Science', yearsExperience: 2, projects: 2, color: 'bg-blue-500', icon: '📊' },
  { name: 'Tableau', level: 75, category: 'Data Science', yearsExperience: 1, projects: 3, color: 'bg-teal-500', icon: '📈' },
  { name: 'Scikit-learn', level: 75, category: 'Data Science', yearsExperience: 1, projects: 1, color: 'bg-orange-600', icon: '🤖' },
  { name: 'Jupyter', level: 85, category: 'Data Science', yearsExperience: 2, projects: 3, color: 'bg-yellow-500', icon: '📓' },

  // Web3
  { name: 'Ethereum', level: 70, category: 'Web3', yearsExperience: 1, projects: 2, color: 'bg-indigo-600', icon: '💎' },
  { name: 'Hardhat', level: 70, category: 'Web3', yearsExperience: 1, projects: 2, color: 'bg-blue-700', icon: '🔨' },
  { name: 'Truffle', level: 70, category: 'Web3', yearsExperience: 1, projects: 2, color: 'bg-brown-500', icon: '🍫' },

  // Tools & Methodologies
  { name: 'Git/GitHub', level: 90, category: 'Tools', yearsExperience: 3, projects: 20, color: 'bg-gray-900', icon: '🐙' },
  { name: 'Jira', level: 80, category: 'Tools', yearsExperience: 2, projects: 1, color: 'bg-blue-500', icon: '📋' },
  { name: 'Trello', level: 80, category: 'Tools', yearsExperience: 2, projects: 1, color: 'bg-teal-600', icon: '📅' },
  { name: 'Agile Development', level: 85, category: 'Methodologies', yearsExperience: 1, projects: 10, color: 'bg-green-500', icon: '🏃' },
  { name: 'Scrum', level: 80, category: 'Methodologies', yearsExperience: 2, projects: 1, color: 'bg-red-600', icon: '🔄' },
  { name: 'Test-Driven Development', level: 80, category: 'Methodologies', yearsExperience: 2, projects: 1, color: 'bg-red-500', icon: '🧪' },
  { name: 'API Development', level: 85, category: 'Methodologies', yearsExperience: 2, projects: 4, color: 'bg-blue-500', icon: '🔌' },

];

const categories = Array.from(new Set(skillsData.map(skill => skill.category)));

const getSkillLevel = (level: number, currentTheme: string) => {
  const styles = getThemeStyles(currentTheme);
  if (level >= 90) return { label: 'Expert', classes: styles.skillLevel.expert };
  if (level >= 80) return { label: 'Advanced', classes: styles.skillLevel.advanced };
  if (level >= 70) return { label: 'Intermediate', classes: styles.skillLevel.intermediate };
  return { label: 'Beginner', classes: styles.skillLevel.beginner };
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Languages': return Code;
    case 'Web & Mobile': return Zap;
    case 'Databases': return Database;
    case '3D & VR': return Cpu;
    case 'Cloud & DevOps': return Cloud;
    case 'Data Science': return BarChart;
    case 'Web3': return Globe;
    case 'Tools': return Target;
    case 'Methodologies': return TrendingUp;
    default: return Star;
  }
};

export default function SkillsApp() {
  const { currentTheme } = useDesktopStore();
  const styles = getThemeStyles(currentTheme);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'chart'>('grid');

  const filteredSkills = selectedCategory
    ? skillsData.filter(skill => skill.category === selectedCategory)
    : skillsData;

  const totalProjects = skillsData.reduce((sum, skill) => sum + skill.projects, 0);
  const avgExperience = Math.round(skillsData.reduce((sum, skill) => sum + skill.yearsExperience, 0) / skillsData.length * 10) / 10;
  const expertSkills = skillsData.filter(skill => skill.level >= 90).length;

  return (
    <div className={`h-full flex flex-col bg-linear-to-br ${styles.background}`}>
      {/* Header */}
      <div className={`p-6 border-b ${styles.headerBorder}`}>
        <h1 className={`text-2xl font-bold ${styles.text.primary} mb-2`}>Technical Skills</h1>
        <p className={`${styles.text.secondary} mb-6`}>My expertise across different technologies and domains</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className={`${styles.statsCard} rounded-lg p-4 shadow-sm border`}>
            <div className="flex items-center space-x-2 mb-1">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span className={`text-sm ${styles.text.secondary}`}>Expert Skills</span>
            </div>
            <div className={`text-2xl font-bold ${styles.text.primary}`}>{expertSkills}</div>
          </div>
          <div className={`${styles.statsCard} rounded-lg p-4 shadow-sm border`}>
            <div className="flex items-center space-x-2 mb-1">
              <Target className="w-4 h-4 text-blue-600" />
              <span className={`text-sm ${styles.text.secondary}`}>Total Projects(mini)</span>
            </div>
            <div className={`text-2xl font-bold ${styles.text.primary}`}>{totalProjects}</div>
          </div>
          <div className={`${styles.statsCard} rounded-lg p-4 shadow-sm border`}>
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className={`text-sm ${styles.text.secondary}`}>Avg Experience</span>
            </div>
            <div className={`text-2xl font-bold ${styles.text.primary}`}>{avgExperience}y</div>
          </div>
          <div className={`${styles.statsCard} rounded-lg p-4 shadow-sm border`}>
            <div className="flex items-center space-x-2 mb-1">
              <Star className="w-4 h-4 text-purple-600" />
              <span className={`text-sm ${styles.text.secondary}`}>Categories</span>
            </div>
            <div className={`text-2xl font-bold ${styles.text.primary}`}>{categories.length}</div>
          </div>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedCategory === null ? styles.filterButton.active : styles.filterButton.inactive
                }`}
            >
              All Skills
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedCategory === category ? styles.filterButton.active : styles.filterButton.inactive
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className={`flex ${styles.viewToggle.container} rounded-lg p-1`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${viewMode === 'grid' ? styles.viewToggle.active : styles.viewToggle.inactive
                }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${viewMode === 'chart' ? styles.viewToggle.active : styles.viewToggle.inactive
                }`}
            >
              Chart
            </button>
          </div>
        </div>
      </div>

      {/* Skills Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill, index) => {
              const skillLevel = getSkillLevel(skill.level, currentTheme);
              return (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className={`${styles.cardBackground} rounded-xl p-6 shadow-sm border ${styles.cardHover} transition-shadow`}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-2xl">{skill.icon}</div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${styles.text.primary}`}>{skill.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${skillLevel.classes}`}>
                        {skillLevel.label}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className={`flex justify-between text-sm ${styles.text.secondary} mb-1`}>
                      <span>Proficiency</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className={`w-full ${styles.progressBar.background} rounded-full h-2`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ delay: index * 0.05 + 0.2, duration: 0.8 }}
                        className={`h-2 rounded-full ${skill.color}`}
                      />
                    </div>
                  </div>

                  {/* Skill Details */}
                  <div className={`flex justify-between text-sm ${styles.text.secondary}`}>
                    <span>{skill.yearsExperience} years exp.</span>
                    <span>{skill.projects} projects</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map((category, categoryIndex) => {
              const categorySkills = skillsData.filter(skill => skill.category === category);
              const CategoryIcon = getCategoryIcon(category);

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.1, duration: 0.3 }}
                  className={`${styles.cardBackground} rounded-xl p-6 shadow-sm border`}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className={`w-10 h-10 bg-linear-to-br ${styles.categoryIcon} rounded-lg flex items-center justify-center`}>
                      <CategoryIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className={`text-xl font-bold ${styles.text.primary}`}>{category}</h3>
                  </div>

                  <div className="space-y-4">
                    {categorySkills.map((skill, skillIndex) => (
                      <div key={skill.name} className="flex items-center space-x-4">
                        <div className="w-32 shrink-0">
                          <span className={`text-sm font-medium ${styles.text.primary}`}>{skill.name}</span>
                        </div>
                        <div className="flex-1">
                          <div className={`w-full ${styles.progressBar.background} rounded-full h-2`}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05, duration: 0.8 }}
                              className={`h-2 rounded-full ${skill.color}`}
                            />
                          </div>
                        </div>
                        <div className="w-16 text-right">
                          <span className={`text-sm font-medium ${styles.text.secondary}`}>{skill.level}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
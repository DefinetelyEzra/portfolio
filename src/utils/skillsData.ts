export interface Skill {
  readonly name: string;
  readonly level: number; // 0-100
  readonly category: string;
  readonly yearsExperience: number;
  readonly projects: number;
  readonly color: string;
  readonly icon: string;
  readonly description?: string;
}

export interface SkillCategory {
  readonly name: string;
  readonly color: string;
  readonly icon: string;
  readonly description: string;
}

export const SKILL_CATEGORIES: readonly SkillCategory[] = [
  {
    name: 'Languages',
    color: '#3B82F6',
    icon: '💻',
    description: 'Programming languages and syntax'
  },
  {
    name: 'Web & Mobile',
    color: '#10B981',
    icon: '🌐',
    description: 'Frontend and mobile development'
  },
  {
    name: 'Databases',
    color: '#8B5CF6',
    icon: '🗄️',
    description: 'Database management and design'
  },
  {
    name: '3D & VR',
    color: '#F59E0B',
    icon: '🥽',
    description: '3D modeling and virtual reality'
  },
  {
    name: 'Tools',
    color: '#EF4444',
    icon: '🔧',
    description: 'Development tools and utilities'
  },
  {
    name: 'Methodologies',
    color: '#06B6D4',
    icon: '⚡',
    description: 'Development practices and approaches'
  },
  {
    name: 'Soft Skills',
    color: '#F97316',
    icon: '🤝',
    description: 'Communication and leadership'
  }
] as const;

// Curated skills data based on your SkillsApp
export const SKILLS_DATA: readonly Skill[] = [
  // Top skills for widget rotation (most impressive/relevant)
  {
    name: 'Python',
    level: 90,
    category: 'Languages',
    yearsExperience: 3,
    projects: 8,
    color: '#3776AB',
    icon: '🐍',
    description: 'Expert in data science, web development, and automation'
  },
  {
    name: 'React',
    level: 88,
    category: 'Web & Mobile',
    yearsExperience: 2,
    projects: 15,
    color: '#61DAFB',
    icon: '⚛️',
    description: 'Building modern, interactive user interfaces'
  },
  {
    name: 'TypeScript',
    level: 85,
    category: 'Languages',
    yearsExperience: 2,
    projects: 12,
    color: '#3178C6',
    icon: '📘',
    description: 'Type-safe JavaScript for scalable applications'
  },
  {
    name: 'Git/GitHub',
    level: 90,
    category: 'Tools',
    yearsExperience: 3,
    projects: 20,
    color: '#F05032',
    icon: '🐙',
    description: 'Version control and collaborative development'
  },
  {
    name: 'PostgreSQL',
    level: 85,
    category: 'Databases',
    yearsExperience: 2,
    projects: 8,
    color: '#336791',
    icon: '🐘',
    description: 'Advanced database design and optimization'
  },
  {
    name: 'Unity',
    level: 85,
    category: '3D & VR',
    yearsExperience: 2,
    projects: 5,
    color: '#FFFFFF',
    icon: '🎯',
    description: 'Game development and VR experiences'
  },
  {
    name: 'Leadership',
    level: 85,
    category: 'Soft Skills',
    yearsExperience: 3,
    projects: 5,
    color: '#DC2626',
    icon: '👑',
    description: 'Leading teams and driving project success'
  },
  {
    name: 'Team Collaboration',
    level: 90,
    category: 'Soft Skills',
    yearsExperience: 3,
    projects: 15,
    color: '#059669',
    icon: '🤝',
    description: 'Building effective, productive teams'
  },
  {
    name: 'C++',
    level: 85,
    category: 'Languages',
    yearsExperience: 3,
    projects: 5,
    color: '#00599C',
    icon: '🔷',
    description: 'System programming and performance optimization'
  },
  {
    name: 'Flask',
    level: 85,
    category: 'Web & Mobile',
    yearsExperience: 2,
    projects: 8,
    color: '#528C97',
    icon: '🌶️',
    description: 'Lightweight web framework for Python'
  },
  {
    name: 'Agile Development',
    level: 85,
    category: 'Methodologies',
    yearsExperience: 2,
    projects: 10,
    color: '#2563EB',
    icon: '🏃',
    description: 'Iterative development and continuous improvement'
  },
  {
    name: 'Mentorship',
    level: 90,
    category: 'Soft Skills',
    yearsExperience: 2,
    projects: 3,
    color: '#7C3AED',
    icon: '🎓',
    description: 'Guiding and developing talent'
  },
] as const;

// Helper functions
export function getSkillsByCategory(category: string): readonly Skill[] {
  if (category === 'all') return SKILLS_DATA;
  return SKILLS_DATA.filter(skill => skill.category === category);
}

export function getRandomSkill(excludeSkill?: string): Skill {
  const availableSkills = excludeSkill 
    ? SKILLS_DATA.filter(skill => skill.name !== excludeSkill)
    : SKILLS_DATA;
  
  const randomIndex = Math.floor(Math.random() * availableSkills.length);
  return availableSkills[randomIndex];
}

export function getSkillLevelInfo(level: number) {
  if (level >= 90) return { 
    label: 'Expert', 
    color: '#059669', 
    bgColor: '#D1FAE5',
    description: 'Mastery level with deep expertise' 
  };
  if (level >= 80) return { 
    label: 'Advanced', 
    color: '#2563EB', 
    bgColor: '#DBEAFE',
    description: 'Highly proficient and experienced' 
  };
  if (level >= 70) return { 
    label: 'Intermediate', 
    color: '#D97706', 
    bgColor: '#FED7AA',
    description: 'Solid understanding and practical experience' 
  };
  if (level >= 50) return { 
    label: 'Beginner+', 
    color: '#7C2D12', 
    bgColor: '#FECACA',
    description: 'Growing competency with some experience' 
  };
  return { 
    label: 'Learning', 
    color: '#6B7280', 
    bgColor: '#F3F4F6',
    description: 'Currently developing this skill' 
  };
}

export function getCategoryInfo(categoryName: string): SkillCategory | undefined {
  return SKILL_CATEGORIES.find(cat => cat.name === categoryName);
}
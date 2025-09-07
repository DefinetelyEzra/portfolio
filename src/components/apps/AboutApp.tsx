'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Code, Cloud, Globe, Briefcase, BarChart, BookOpen, Cpu, Eye, Users } from 'lucide-react';
import { useDesktopStore } from '@/store/desktopStore';

const getThemeStyles = (currentTheme: string) => ({
  background: currentTheme === 'dark'
    ? 'from-gray-900 via-gray-800 to-gray-700'
    : 'from-indigo-50 via-white to-purple-50',

  cardBackground: currentTheme === 'dark'
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-100',

  text: {
    primary: currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900',
    secondary: currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    accent: currentTheme === 'dark' ? 'text-indigo-400' : 'text-indigo-600',
    muted: 'text-gray-500'
  },

  avatar: currentTheme === 'dark'
    ? 'from-gray-800 via-gray-700 to-gray-600'
    : 'from-blue-500 via-purple-600 to-indigo-700',

  skillTag: currentTheme === 'dark'
    ? 'bg-gray-700 text-gray-300'
    : 'bg-indigo-50 text-indigo-700',

  currentBadge: currentTheme === 'dark'
    ? 'bg-green-900/50 text-green-300'
    : 'bg-green-100 text-green-800',

  timelineItem: (current?: boolean) => {
    const baseGradient = currentTheme === 'dark'
      ? 'from-gray-700 to-gray-600'
      : 'from-indigo-500 to-purple-600';
    return current
      ? 'bg-gradient-to-br from-green-500 to-teal-600'
      : `bg-gradient-to-br ${baseGradient}`;
  }
});

// Extract timeline data
const getTimelineData = () => [
  {
    year: '2026',
    title: 'Bachelor of Computer Science',
    company: 'Pan-Atlantic University',
    description: 'Pursuing Bachelor of Computer Science with coursework in Systems Analysis, Fullstack Development, Software Engineering.',
  },
  {
    year: '2024',
    title: 'Lab Intern',
    company: 'PAU VHCI Lab',
    description: 'Contributing to VR-based educational tool development and human-centered computing research with focus on immersive systems.',
    current: false,
  },
  {
    year: '2020',
    title: 'Student/Teaching Assistant',
    company: 'University of Regina',
    description: 'Tutored 100+ students in programming (C++, Rust, C), developed quizzes and exercises, significantly improved pass rates.',
  },
  {
    year: '2019',
    title: 'A-Level Graduate',
    company: 'Caleb British International School',
    description: 'Completed IGCSE & A-Level studies with focus on STEM subjects.',
  },
];

// Extract interests data
const getInterestsData = () => [
  {
    icon: Cpu,
    title: 'AI & Machine Learning',
    description: 'Building intelligent systems that bridge human needs with cutting-edge technology',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Eye,
    title: 'VR & Immersive Tech',
    description: 'Creating immersive experiences that enhance cultural accessibility and education',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Code,
    title: 'Fullstack Development',
    description: 'Crafting scalable web applications with modern technologies and clean architecture',
    gradient: 'from-green-500 to-teal-500'
  },
  {
    icon: BookOpen,
    title: 'Creative Writing',
    description: 'Exploring fiction, psychology, and theology through unpublished works',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    icon: Users,
    title: 'Teaching & Mentorship',
    description: 'Passionate about sharing knowledge and helping others grow in technology',
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Cloud,
    title: 'Cloud Computing',
    description: 'Building scalable and reliable systems using cloud platforms like AWS and Azure',
    gradient: 'from-blue-600 to-teal-600'
  },
  {
    icon: Globe,
    title: 'Web3',
    description: 'Exploring decentralized technologies and blockchain for innovative applications',
    gradient: 'from-purple-600 to-indigo-600'
  },
  {
    icon: Briefcase,
    title: 'Project Management',
    description: 'Leading tech projects with agile methodologies to deliver impactful solutions',
    gradient: 'from-teal-500 to-green-600'
  },
  {
    icon: BarChart,
    title: 'Data Science',
    description: 'Uncovering actionable insights through data analysis and visualization',
    gradient: 'from-cyan-500 to-blue-500'
  },
];

// Extract stats data
const getStatsData = () => [
  { number: '10+', label: 'Projects Completed' },
  { number: '100+', label: 'Students Mentored' },
  { number: '15+', label: 'Technologies' },
  { number: '3+', label: 'Years Experience' },
];

// Extract skills data
const getSkillsData = () => [
  { category: 'Languages', items: ['Java', 'Python', 'Rust', 'C++', 'JavaScript/TypeScript', 'C#'] },
  { category: 'Web & Mobile', items: ['React', 'Flask', 'SQLAlchemy', 'OpenGL', 'SDL'] },
  { category: 'Databases', items: ['PostgreSQL', 'MySQL', 'PgAdmin'] },
  { category: '3D & VR', items: ['Unity', 'Blender', 'Oculus Quest'] },
  { category: 'Cloud & DevOps', items: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform'] },
  { category: 'Data Science', items: ['Pandas', 'NumPy', 'Tableau', 'Scikit-learn', 'Jupyter'] },
  { category: 'Web3', items: ['Solidity', 'Web3.js', 'Ethereum', 'Hardhat', 'Truffle'] },
  { category: 'Project Management', items: ['Jira', 'Trello', 'Agile', 'Scrum', 'Git'] },
];

// Component for header section
const HeaderSection = ({ styles }: { styles: ReturnType<typeof getThemeStyles> }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`text-center mb-12 ${styles.text.secondary}`}
  >
    <div className="relative mb-6">
      <div className={`w-32 h-32 mx-auto bg-gradient-to-br ${styles.avatar} rounded-full flex items-center justify-center shadow-lg`}>
        <span className={`${styles.text.primary} text-4xl font-bold`}>OA</span>
      </div>
    </div>
    <h1 className={`text-4xl font-bold ${styles.text.primary} mb-4`}>Odunayo Agunbiade</h1>
    <p className={`text-xl ${styles.text.secondary} mb-6`}>ML Enthusiast • Problem Solver • Fullstack Engineer</p>
    <div className={`flex items-center justify-center space-x-6 ${styles.text.muted}`}>
      <div className="flex items-center space-x-2">
        <MapPin className={`w-4 h-4 ${styles.text.secondary}`} />
        <span className={styles.text.secondary}>Awoyaya, Lekki-Epe Expressway, Lagos</span>
      </div>
      <div className="flex items-center space-x-2">
        <Calendar className={`w-4 h-4 ${styles.text.secondary}`} />
        <span className={styles.text.secondary}>Available for opportunities</span>
      </div>
    </div>
  </motion.div>
);

// Component for stats section
const StatsSection = ({ styles }: { styles: ReturnType<typeof getThemeStyles> }) => {
  const stats = getStatsData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`text-center ${styles.cardBackground} rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow`}
        >
          <div className={`text-3xl font-bold ${styles.text.accent} mb-2`}>{stat.number}</div>
          <div className={`text-sm ${styles.text.secondary}`}>{stat.label}</div>
        </div>
      ))}
    </motion.div>
  );
};

// Component for skills section
const SkillsSection = ({ styles }: { styles: ReturnType<typeof getThemeStyles> }) => {
  const skills = getSkillsData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="mb-12"
    >
      <h2 className={`text-2xl font-bold ${styles.text.primary} mb-8 text-center`}>Technical Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skills.map((skillGroup) => (
          <div
            key={skillGroup.category}
            className={`${styles.cardBackground} rounded-xl p-6 shadow-sm border`}
          >
            <h3 className={`text-lg font-semibold ${styles.text.primary} mb-4`}>{skillGroup.category}</h3>
            <div className="flex flex-wrap gap-2">
              {skillGroup.items.map((skill) => (
                <span
                  key={skill}
                  className={`px-2 py-1 ${styles.skillTag} text-xs rounded-full`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Component for timeline section
const TimelineSection = ({ styles }: { styles: ReturnType<typeof getThemeStyles> }) => {
  const timeline = getTimelineData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mb-12"
    >
      <h2 className={`text-2xl font-bold ${styles.text.primary} mb-8 text-center`}>My Journey</h2>
      <div className="space-y-6">
        {timeline.map((item) => (
          <div key={`${item.year}-${item.company}`} className="flex items-start space-x-4">
            <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${styles.timelineItem(Boolean(item.current))}`}>
              {item.year}
            </div>
            <div className={`flex-grow ${styles.cardBackground} rounded-xl p-6 shadow-sm border`}>
              <div className="flex items-center justify-between mb-1">
                <h3 className={`text-lg font-semibold ${styles.text.primary}`}>{item.title}</h3>
                {item.current && (
                  <span className={`${styles.currentBadge} text-xs font-medium px-2 py-1 rounded-full`}>
                    Current
                  </span>
                )}
              </div>
              <p className={`font-medium mb-2 ${styles.text.accent}`}>{item.company}</p>
              <p className={styles.text.secondary}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Component for interests section
const InterestsSection = ({ styles }: { styles: ReturnType<typeof getThemeStyles> }) => {
  const interests = getInterestsData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h2 className={`text-2xl font-bold ${styles.text.primary} mb-8 text-center`}>What I&apos;m Passionate About</h2>
      <div className="grid grid-cols-1 md:grid-2 lg:grid-cols-3 gap-6">
        {interests.map((interest) => {
          const IconComponent = interest.icon;
          return (
            <div
              key={interest.title}
              className={`${styles.cardBackground} rounded-xl p-6 shadow-sm border hover:shadow-md transition-all hover:scale-105`}
            >
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${interest.gradient} rounded-lg flex items-center justify-center shadow-md`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${styles.text.primary} mb-2`}>{interest.title}</h3>
                  <p className={`text-sm ${styles.text.secondary}`}>{interest.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default function AboutApp() {
  const { currentTheme } = useDesktopStore();
  const styles = getThemeStyles(currentTheme);

  return (
    <div className={`h-full overflow-y-auto bg-gradient-to-br ${styles.background} p-4`}>
      <div className="max-w-6xl mx-auto">
        <HeaderSection styles={styles} />
        <StatsSection styles={styles} />

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`${styles.cardBackground} rounded-2xl p-6 shadow-sm border mb-12 max-w-2xl mx-auto`}
        >
          <h2 className={`text-2xl font-bold ${styles.text.primary} mb-6`}>About Me</h2>
          <div className={`prose ${styles.text.secondary} leading-relaxed`}>
            <p className="mb-4">
              I’m a driven Computer Science undergraduate with a burning passion for machine learning and fullstack development.
              I thrive on solving complex problems with code, crafting AI-driven solutions and scalable web applications that make a tangible difference.
              My love for learning fuels my curiosity, pushing me to master new technologies and innovate at every turn.
            </p>
            <p className="mb-4">
              At Pan-Atlantic University’s VHCI Lab, I built VR tools that enhance education,
              while my experience as a student mentor has sharpened my communication and leadership skills.
              These experiences have shaped me into one who values collaboration and thrives in dynamic,
              fast-paced environments, turning ideas into reality with creative problem-solving and clean, efficient code.
            </p>
            <p className="mb-4">
              With expertise in cloud platforms, Web3, data science, and agile methodologies,
              I’m building solutions that empower communities and drive innovation.
            </p>
            <p>
              My ultimate goal is to harness my problem-solving skills to uplift communities,
              transform Nigeria, and one day impact the world.
              Every line of code I write is a step toward building solutions that empower,
              connect, and inspire, reflecting my belief that technology can change the world for the better.
            </p>
          </div>
        </motion.div>

        <SkillsSection styles={styles} />
        <TimelineSection styles={styles} />
        <InterestsSection styles={styles} />
      </div>
    </div>
  );
}
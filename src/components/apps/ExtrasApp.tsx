'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Trophy, ArrowRight, BookOpen, Computer, Hourglass } from 'lucide-react';
import { FaGamepad } from 'react-icons/fa';
import Link from 'next/link';
import SnakeGame from './games/SnakeGame';
import TicTacToe from './games/TicTacToe';
import TerminalGame from './games/TerminalGame';
import ComingSoon from '../ComingSoon';

type GameType = 'tictactoe' | 'snake' | 'terminal';

interface EasterEgg {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    gradient: string;
    link?: string;
    action?: () => void;
}

export default function ExtrasApp() {
    const [activeGame, setActiveGame] = useState<GameType | null>(null);
    const [showComingSoon, setShowComingSoon] = useState(false);

    const easterEggs: EasterEgg[] = [
        {
            icon: BookOpen,
            title: 'Random Tech Quote',
            description: '"Code is like humor. When you have to explain it, it\'s bad." - Cory House',
            gradient: 'from-blue-500 to-indigo-600'
        },
        {
            icon: Computer,
            title: 'Coding Stats',
            description: '13000+ lines of code were written for this site. Rookie numbers I know',
            gradient: 'from-yellow-500 to-red-500'
        },
        {
            icon: Hourglass,
            title: 'SCARLET Mini',
            description: 'Simplified version of SCARLET AI assistant.',
            gradient: 'from-red-500 to-pink-600',
            action: () => setShowComingSoon(true)
        }
    ];

    const renderContent = () => {
        if (showComingSoon) {
            return (
                <ComingSoon
                    title="SCARLET Mini"
                    subtitle="AI Assistant Coming Soon"
                    description="Get ready for SCARLET Mini, a powerful AI scheduler that optimizes your projects and tasks. Prioritize tasks, manage deadlines, and balance workloads with smart time-blocking and adaptive scheduling. Stay tuned for a productivity boost with data-driven insights and seamless calendar integration!"
                    variant="animated"
                    gradient="from-red-500 to-pink-600"
                    showBackButton={true}
                    onBack={() => setShowComingSoon(false)}
                    targetDate={new Date('2025-12-01T00:00:00')}
                />
            );
        }

        if (activeGame) {
            return (
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => setActiveGame(null)}
                        className="mb-6 flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        <span>Back to Extras</span>
                    </button>

                    {/* Game Content */}
                    {activeGame === 'tictactoe' && <TicTacToe />}
                    {activeGame === 'snake' && <SnakeGame />}
                    {activeGame === 'terminal' && <TerminalGame />}
                </div>
            );
        }

        return (
            <div className="space-y-8">
                {/* Games Section */}
                <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <FaGamepad className="w-5 h-5 mr-2" />
                        Mini Games
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveGame('tictactoe')}
                            className="bg-linear-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-left hover:from-blue-500 hover:to-blue-700 transition-all"
                        >
                            <div className="text-3xl mb-2">⭕</div>
                            <h3 className="text-lg font-semibold mb-1">Tic Tac Toe</h3>
                            <p className="text-blue-200 text-sm">Classic 3x3 grid game</p>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveGame('snake')}
                            className="bg-linear-to-br from-green-600 to-green-800 rounded-xl p-6 text-left hover:from-green-500 hover:to-green-700 transition-all"
                        >
                            <div className="text-3xl mb-2">🐍</div>
                            <h3 className="text-lg font-semibold mb-1">Snake Game</h3>
                            <p className="text-green-200 text-sm">Retro snake with arrow keys</p>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveGame('terminal')}
                            className="bg-linear-to-br from-gray-700 to-gray-900 rounded-xl p-6 text-left hover:from-gray-600 hover:to-gray-800 transition-all"
                        >
                            <div className="text-3xl mb-2">💻</div>
                            <h3 className="text-lg font-semibold mb-1">Terminal</h3>
                            <p className="text-gray-300 text-sm">Interactive command line</p>
                        </motion.button>
                    </div>
                </div>

                {/* Easter Eggs Section */}
                <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <Trophy className="w-5 h-5 mr-2" />
                        Misc
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {easterEggs.map((egg, index) => {
                            const IconComponent = egg.icon;
                            return (
                                <motion.div
                                    key={egg.title + egg.description}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`bg-linear-to-br ${egg.gradient} rounded-xl p-6 ${egg.action ? 'cursor-pointer' : ''}`}
                                    onClick={egg.action}
                                >
                                    <IconComponent className="w-8 h-8 mb-3" />
                                    <h3 className="text-lg font-semibold mb-2">{egg.title}</h3>
                                    <p className="text-sm opacity-90">{egg.description}</p>
                                    {egg.link && (
                                        <Link href={egg.link} passHref>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="mt-4 bg-white text-red-500 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors"
                                            >
                                                Check it out
                                            </motion.button>
                                        </Link>
                                    )}
                                    {egg.action && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={egg.action}
                                            className="mt-4 bg-white text-red-500 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors"
                                        >
                                            Check it out
                                        </motion.button>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-linear-to-br from-gray-900 via-purple-900 to-violet-800 text-white">
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
                <h1 className="text-2xl font-bold mb-2">Misc</h1>
                <p className="text-gray-300">Games, terminal commands, and hidden features</p>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
}
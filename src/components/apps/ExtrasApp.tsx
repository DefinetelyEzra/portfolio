'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Terminal, Trophy, ArrowRight, BookOpen, Computer, Hourglass } from 'lucide-react';
import { FaGamepad } from 'react-icons/fa';
import Link from 'next/link';
import SnakeGame from './games/SnakeGame';
import TicTacToe from './games/TicTacToe';
import ComingSoon from '../ComingSoon';

type GameType = 'tictactoe' | 'snake' | 'terminal';

interface TerminalCommand {
    command: string;
    output: string | React.ReactNode;
    type: 'success' | 'error' | 'info';
}

const TERMINAL_COMMANDS: Record<string, TerminalCommand> = {
    'help': {
        command: 'help',
        output: (
            <div className="space-y-1">
                <div>Available commands:</div>
                <div className="ml-4 space-y-1 text-green-400">
                    <div>• help - Show available commands</div>
                    <div>• about - About Odunayo</div>
                    <div>• skills - List technical skills</div>
                    <div>• projects - Show recent projects</div>
                    <div>• contact - Contact information</div>
                    <div>• clear - Clear terminal</div>
                </div>
            </div>
        ),
        type: 'info'
    },
    'about': {
        command: 'about',
        output: 'Fullstack Developer passionate about Machine Learning. Currently working on SCARLET AI and CampusLive.',
        type: 'success'
    },
    'skills': {
        command: 'skills',
        output: 'Python • JavaScript/TypeScript • Java • C++ • Rust • React • Flask • Unity • Blender • PostgreSQL',
        type: 'success'
    },
    'projects': {
        command: 'projects',
        output: (
            <div className="space-y-1">
                <div className="text-yellow-400">Recent Projects:</div>
                <div>• SCARLET - AI Productivity Assistant (Python, Flask, React)</div>
                <div>• VR Museum - Yemisi Shyllon Recreation (Unity, C#)</div>
                <div>• A few others that can&apos;t yet be disclosed</div>
            </div>
        ),
        type: 'success'
    },
    'contact': {
        command: 'contact',
        output: '📧 ezraagun@gmail.com | 📱 +234 708 229 7108 | 📍 Lagos, Nigeria',
        type: 'success'
    },
};

export default function ExtrasApp() {
    const [activeGame, setActiveGame] = useState<GameType | null>(null);
    const [showComingSoon, setShowComingSoon] = useState(false);
    const [terminalHistory, setTerminalHistory] = useState<TerminalCommand[]>([]);
    const [terminalInput, setTerminalInput] = useState('');

    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalHistory]);

    const handleTerminalCommand = (command: string) => {
        const cmd = command.toLowerCase().trim();

        if (cmd === 'clear') {
            setTerminalHistory([]);
            return;
        }

        const response = TERMINAL_COMMANDS[cmd] || {
            command: cmd,
            output: `Command not found: ${cmd}. Type 'help' for available commands.`,
            type: 'error' as const
        };

        setTerminalHistory(prev => [...prev,
        { command: `$ ${command}`, output: '', type: 'info' },
            response
        ]);
    };

    interface EasterEgg {
        icon: React.ComponentType<{ className?: string }>;
        title: string;
        description: string;
        gradient: string;
        link?: string;
        action?: () => void;
    }

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
            description: '11000+ lines of code were written for this site. Rookie numbers I know',
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
                    description= "Get ready for SCARLET Mini, a powerful AI scheduler that optimizes your projects and tasks. Prioritize tasks, manage deadlines, and balance workloads with smart time-blocking and adaptive scheduling. Stay tuned for a productivity boost with data-driven insights and seamless calendar integration!"
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
                    {activeGame === 'terminal' && (
                        <div className="bg-gray-900 rounded-xl overflow-hidden">
                            <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
                                <div className="flex items-center space-x-2">
                                    <div className="flex space-x-1">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>
                                    <span className="text-gray-300 text-sm">terminal</span>
                                </div>
                                <Terminal className="w-4 h-4 text-gray-400" />
                            </div>

                            <div
                                ref={terminalRef}
                                className="h-96 overflow-y-auto p-4 font-mono text-sm bg-gray-900"
                            >
                                <div className="text-green-400 mb-4">
                                    Welcome to Odunayo&apos;s Terminal! Type &lsquo;help&rsquo; for available commands.
                                </div>

                                {terminalHistory.map((entry, index) => {
                                    let entryTypeClass;
                                    if (entry.type === 'error') {
                                        entryTypeClass = 'text-red-400';
                                    } else if (entry.type === 'success') {
                                        entryTypeClass = 'text-green-400';
                                    } else {
                                        entryTypeClass = 'text-blue-400';
                                    }

                                    const outputTypeClass = entry.type === 'error' ? 'text-red-300' : 'text-gray-300';

                                    return (
                                        <div key={`terminal-entry-${index}-${entry.command.slice(0, 10)}`} className="mb-2">
                                            <div className={entryTypeClass}>
                                                {entry.command.startsWith('$') ? entry.command : `${entry.command}:`}
                                            </div>
                                            {entry.output && (
                                                <div className={`ml-2 ${outputTypeClass}`}>
                                                    {entry.output}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                <div className="flex items-center">
                                    <span className="text-green-400 mr-2">$</span>
                                    <input
                                        type="text"
                                        value={terminalInput}
                                        onChange={(e) => setTerminalInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleTerminalCommand(terminalInput);
                                                setTerminalInput('');
                                            }
                                        }}
                                        className="flex-1 bg-transparent text-white outline-none"
                                        placeholder="Type a command..."
                                        autoFocus
                                    />
                                </div>
                            </div>
                        </div>
                    )}
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
                            className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-left hover:from-blue-500 hover:to-blue-700 transition-all"
                        >
                            <div className="text-3xl mb-2">⭕</div>
                            <h3 className="text-lg font-semibold mb-1">Tic Tac Toe</h3>
                            <p className="text-blue-200 text-sm">Classic 3x3 grid game</p>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveGame('snake')}
                            className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 text-left hover:from-green-500 hover:to-green-700 transition-all"
                        >
                            <div className="text-3xl mb-2">🐍</div>
                            <h3 className="text-lg font-semibold mb-1">Snake Game</h3>
                            <p className="text-green-200 text-sm">Retro snake with arrow keys</p>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveGame('terminal')}
                            className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl p-6 text-left hover:from-gray-600 hover:to-gray-800 transition-all"
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
                                    className={`bg-gradient-to-br ${egg.gradient} rounded-xl p-6 ${egg.action ? 'cursor-pointer' : ''}`}
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
        <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white">
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
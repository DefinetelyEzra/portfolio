'use client';

import { useState, useRef, useEffect } from 'react';
import { Terminal } from 'lucide-react';

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

export default function TerminalGame() {
    const [terminalHistory, setTerminalHistory] = useState<TerminalCommand[]>([]);
    const [terminalInput, setTerminalInput] = useState('');
    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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

    const handleTerminalClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div
            className="bg-gray-900 rounded-xl overflow-hidden"
            onClick={handleTerminalClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && inputRef.current) {
                    inputRef.current.focus();
                }
            }}
        >
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
                className="h-[50vh] sm:h-96 overflow-y-auto p-4 font-mono text-sm bg-gray-900"
            >
                <div className="text-green-400 mb-4">
                    Welcome to my Terminal! Type &lsquo;help&rsquo; for available commands.
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

                <div className="flex items-center min-h-10">
                    <span className="text-green-400 mr-2 shrink-0">$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleTerminalCommand(terminalInput);
                                setTerminalInput('');
                            }
                        }}
                        className="flex-1 bg-transparent text-white outline-none text-sm min-h-10 touch-manipulation"
                        placeholder="Type a command..."
                        autoFocus
                    />
                </div>
            </div>
        </div>
    );
}
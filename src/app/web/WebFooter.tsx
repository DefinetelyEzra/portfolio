'use client';

import { Mail } from 'lucide-react';
import { FaBriefcase, FaGithub, FaLinkedin } from 'react-icons/fa';
import { useDesktopStore } from '@/store/desktopStore';

export default function WebFooter() {
    const { currentTheme } = useDesktopStore();
    const isDark = currentTheme === 'dark';

    const socialLinks = [
        { icon: FaGithub, url: 'https://github.com/DefinetelyEzra', label: 'GitHub' },
        { icon: FaLinkedin, url: 'https://linkedin.com/in/odunayo-agunbiade-155440315', label: 'LinkedIn' },
        { icon: FaBriefcase, url: 'https://jobberman.com/profile/Odunayo-Agunbiade', label: 'Jobberman' },
        { icon: Mail, url: 'mailto:ezraagun@gmail.com', label: 'Email' },
    ];

    return (
        <footer className={`py-12 ${isDark ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-lg flex items-center justify-center">
                            <span className="text-white text-lg font-bold">OA</span>
                        </div>
                        <div>
                            <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Odunayo Agunbiade
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Decision is where nature ends and consciousness begins
                            </p>
                        </div>
                    </div>
                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        {socialLinks.map((social) => {
                            const Icon = social.icon;
                            return (
                                <a
                                    key={social.label}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-2 rounded-lg transition-colors ${isDark
                                        ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                                        }`}
                                    title={social.label}
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* Copyright */}
                <div className={`mt-8 pt-8 border-t text-center ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
                    <p className="flex items-center justify-center gap-2 text-sm">
                        Made by Odunayo Agunbiade for Odunayo Agunbiade
                    </p>
                    <p className="text-xs mt-2">
                        © {new Date().getFullYear()} All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
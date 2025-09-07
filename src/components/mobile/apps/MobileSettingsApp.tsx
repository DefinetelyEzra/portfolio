'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    Palette,
    Moon,
    Sun,
    Volume2,
    VolumeX,
    Save,
    RotateCcw,
    ImageIcon,
    Settings as SettingsIcon,
    Smartphone,
    User,
    Monitor,
    Info,
    Shield
} from 'lucide-react';
import { getWallpapersForDevice } from '@/utils/wallpaperUtils';
import { useMobileStore } from '@/store/mobileStore';
import { AudioManager } from '@/utils/audioManager';
import { isMobile } from '@/utils/deviceDetection';
import { useDesktopStore } from '@/store/desktopStore';

const getThemeStyles = (currentTheme: string) => {
    const isDark = currentTheme === 'dark';

    return {
        background: isDark ? 'from-gray-900 via-gray-800 to-gray-700' : 'from-gray-50 to-white',
        text: {
            primary: isDark ? 'text-gray-100' : 'text-gray-900',
            secondary: isDark ? 'text-gray-400' : 'text-gray-600',
        },
        card: {
            background: isDark ? 'bg-gray-800' : 'bg-white',
            border: isDark ? 'border-gray-700' : 'border-gray-200',
        },
        button: {
            primary: isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white',
            secondary: isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50',
        },
        toggle: {
            active: 'bg-blue-500',
            inactive: isDark ? 'bg-gray-600' : 'bg-gray-300',
        },
        wallpaperButton: (selected: boolean) => {
            let classes = 'border-2';
            if (selected) {
                classes += isDark ? ' border-blue-400' : ' border-blue-500';
            } else {
                classes += isDark ? ' border-gray-600 hover:border-gray-500' : ' border-gray-200 hover:border-gray-300';
            }
            return classes;
        },
        themePreview: {
            light: isDark ? 'bg-gray-100 border-gray-600' : 'bg-white border-2',
            dark: isDark ? 'bg-gray-900 border-gray-600' : 'bg-gray-900 border-2',
            auto: isDark ? 'bg-gradient-to-r from-gray-100 to-gray-900 border-gray-600' : 'bg-gradient-to-r from-white to-gray-900 border-2',
        },
    };
};

type ThemeOption = 'light' | 'dark' | 'auto';

interface MobileSettings {
    theme: ThemeOption;
    wallpaper: string;
    soundEnabled: boolean;
    notifications: boolean;
    vibration: boolean;
    autoRotate: boolean;
    fontSize: 'small' | 'medium' | 'large';
}

const defaultMobileSettings: MobileSettings = {
    theme: 'dark',
    wallpaper: '/wallpapers/mobile/redmoon.jpg',
    soundEnabled: true,
    notifications: true,
    vibration: true,
    autoRotate: true,
    fontSize: 'medium',
};

export default function MobileSettingsApp() {
    const { settings: mobileSettings, currentTheme, updateSettings } = useMobileStore();
    const { updateSettings: updateDesktopSettings } = useDesktopStore();
    const [settings, setSettings] = useState<MobileSettings>(defaultMobileSettings);
    const [activeSection, setActiveSection] = useState<'appearance' | 'device' | 'about'>('appearance');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const styles = getThemeStyles(currentTheme);

    useEffect(() => {
        setSettings({
            ...defaultMobileSettings,
            ...mobileSettings,
        });
    }, [mobileSettings]);

    const handleSettingChange = <K extends keyof MobileSettings>(key: K, value: MobileSettings[K]) => {
        const audioManager = AudioManager.getInstance();

        if (key === 'soundEnabled') {
            audioManager.setEnabled(value as boolean);
        }

        // Update mobile store
        updateSettings({ [key]: value });
        setSettings(prev => ({ ...prev, [key]: value }));

        // Sync theme changes to desktop store
        if (key === 'theme') {
            updateDesktopSettings({ theme: value as 'light' | 'dark' | 'auto' });
        }
    };

    useEffect(() => {
        if (settings.wallpaper) {
            document.body.style.backgroundImage = `url(${settings.wallpaper})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundAttachment = 'fixed';
        }
    }, [settings.wallpaper]);

    const saveSettings = async () => {
        setSaveStatus('saving');
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
    };

    const resetSettings = () => {
        updateSettings(defaultMobileSettings);
        setSettings(defaultMobileSettings);
        setSaveStatus('idle');
    };

    const getSaveButtonContent = () => {
        if (saveStatus === 'saving') {
            return (
                <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="ml-2">Saving...</span>
                </>
            );
        }
        if (saveStatus === 'saved') {
            return (
                <>
                    <Save className="w-4 h-4" />
                    <span className="ml-2">Saved!</span>
                </>
            );
        }
        return (
            <>
                <Save className="w-4 h-4" />
                <span className="ml-2">Save</span>
            </>
        );
    };

    const sections = [
        { id: 'appearance', name: 'Appearance', icon: Palette },
        { id: 'device', name: 'Device', icon: Smartphone },
        { id: 'about', name: 'About', icon: Info },
    ];

    return (
        <div className={`min-h-screen bg-gradient-to-br ${styles.background}`}>
            {/* Header */}
            <div className={`${styles.card.background} border-b ${styles.card.border} px-4 py-3`}>
                <h1 className={`text-xl font-bold ${styles.text.primary} flex items-center`}>
                    <SettingsIcon className="w-5 h-5 mr-2" />
                    Mobile Settings
                </h1>
                <p className={`text-sm ${styles.text.secondary}`}>Customize your mobile experience</p>
            </div>

            {/* Section Tabs */}
            <div className={`${styles.card.background} border-b ${styles.card.border} px-4`}>
                <div className="flex space-x-1">
                    {sections.map((section) => {
                        const IconComponent = section.icon;
                        const isActive = activeSection === section.id;
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id as 'appearance' | 'device' | 'about')}
                                className={`flex items-center space-x-2 px-4 py-3 rounded-t-lg transition-colors ${isActive
                                    ? `${styles.card.background} border-t-2 border-blue-500 ${styles.text.primary}`
                                    : `${styles.text.secondary} hover:${styles.text.primary}`
                                    }`}
                            >
                                <IconComponent className="w-4 h-4" />
                                <span className="text-sm font-medium">{section.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-6 pb-24">
                {activeSection === 'appearance' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Theme Selection */}
                        <div className={`${styles.card.background} rounded-xl p-4 border ${styles.card.border}`}>
                            <h3 className={`text-lg font-semibold ${styles.text.primary} mb-4 flex items-center`}>
                                <Monitor className="w-5 h-5 mr-2" />
                                Theme
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'light', name: 'Light', icon: Sun },
                                    { id: 'dark', name: 'Dark', icon: Moon },
                                    { id: 'auto', name: 'Auto', icon: Monitor }
                                ].map((theme) => {
                                    const IconComponent = theme.icon;
                                    const isSelected = theme.id === settings.theme;
                                    return (
                                        <button
                                            key={theme.id}
                                            onClick={() => handleSettingChange('theme', theme.id as ThemeOption)}
                                            className={`p-3 rounded-lg border-2 transition-all ${isSelected
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                                }`}
                                        >
                                            <div className={`w-full h-12 rounded-lg mb-2 ${styles.themePreview[theme.id as keyof typeof styles.themePreview]} flex items-center justify-center`}>
                                                <IconComponent className={`w-4 h-4 ${theme.id === 'dark' ? 'text-white' : 'text-gray-600'}`} />
                                            </div>
                                            <div className={`text-xs font-medium ${styles.text.primary}`}>{theme.name}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Wallpaper Selection */}
                        <div className={`${styles.card.background} rounded-xl p-4 border ${styles.card.border}`}>
                            <h3 className={`text-lg font-semibold ${styles.text.primary} mb-4 flex items-center`}>
                                <ImageIcon className="w-5 h-5 mr-2" />
                                Mobile Wallpaper
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {getWallpapersForDevice(isMobile()).slice(0, 6).map((wallpaper) => (
                                    <button
                                        key={wallpaper.id}
                                        onClick={() => handleSettingChange('wallpaper', wallpaper.path)}
                                        className={`relative p-2 rounded-lg transition-all ${styles.wallpaperButton(settings.wallpaper === wallpaper.path)}`}
                                    >
                                        <div
                                            className="w-full h-20 rounded-lg bg-cover bg-center"
                                            style={{ backgroundImage: `url(${wallpaper.path})` }}
                                        />
                                        <div className={`text-xs font-medium ${styles.text.primary} mt-1 text-center`}>
                                            {wallpaper.name}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeSection === 'device' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        {/* Sound */}
                        <div className={`${styles.card.background} rounded-xl p-4 border ${styles.card.border}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    {settings.soundEnabled ? (
                                        <Volume2 className={`w-5 h-5 ${styles.text.secondary}`} />
                                    ) : (
                                        <VolumeX className={`w-5 h-5 ${styles.text.secondary}`} />
                                    )}
                                    <div>
                                        <div className={`font-medium ${styles.text.primary}`}>Sound Effects</div>
                                        <div className={`text-sm ${styles.text.secondary}`}>Play sounds for interactions</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleSettingChange('soundEnabled', !settings.soundEnabled)}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${settings.soundEnabled ? styles.toggle.active : styles.toggle.inactive
                                        }`}
                                >
                                    <div
                                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeSection === 'about' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className={`${styles.card.background} rounded-xl p-6 border ${styles.card.border}`}>
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <Smartphone className="text-white text-2xl" />
                                </div>
                                <div>
                                    <h3 className={`text-xl font-bold ${styles.text.primary}`}>Mobile Portfolio OS</h3>
                                    <p className={styles.text.secondary}>Version 1.0.0 - Mobile</p>
                                </div>
                            </div>
                            <p className={`${styles.text.primary} leading-relaxed`}>
                                Mobile-optimized version of the portfolio experience. Designed for touch interactions and smaller screens.
                            </p>
                        </div>

                        <div className={`${styles.card.background} rounded-xl p-6 border ${styles.card.border}`}>
                            <h3 className={`text-lg font-semibold ${styles.text.primary} mb-4 flex items-center`}>
                                <User className="w-5 h-5 mr-2" />
                                Developer
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className={styles.text.secondary}>Name</span>
                                    <span className={`${styles.text.primary} font-medium`}>Odunayo Agunbiade</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={styles.text.secondary}>Role</span>
                                    <span className={`${styles.text.primary} font-medium`}>Developer</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={styles.text.secondary}>Location</span>
                                    <span className={`${styles.text.primary} font-medium`}>Lagos, Nigeria</span>
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.card.background} rounded-xl p-6 border ${styles.card.border}`}>
                            <h3 className={`text-lg font-semibold ${styles.text.primary} mb-4 flex items-center`}>
                                <Shield className="w-5 h-5 mr-2" />
                                Technical Details
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className={styles.text.secondary}>Framework</span>
                                    <span className={`${styles.text.primary} font-medium`}>React + TypeScript</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={styles.text.secondary}>Styling</span>
                                    <span className={`${styles.text.primary} font-medium`}>Tailwind CSS</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={styles.text.secondary}>Animations</span>
                                    <span className={`${styles.text.primary} font-medium`}>Framer Motion</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={styles.text.secondary}>Icons</span>
                                    <span className={`${styles.text.primary} font-medium`}>Lucide React + React-Icons</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={styles.text.secondary}>API</span>
                                    <span className={`${styles.text.primary} font-medium`}>gmail SMTP</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={styles.text.secondary}>Storage</span>
                                    <span className={`${styles.text.primary} font-medium`}>In-Memory (Session)</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
            {/* Save Controls */}
            <div className={`fixed bottom-0 left-0 right-0 ${styles.card.background} border-t ${styles.card.border} p-4 z-50`}>
                <div className="flex space-x-3">
                    <button
                        onClick={saveSettings}
                        disabled={saveStatus === 'saving'}
                        className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${saveStatus === 'saved' ? 'bg-green-600 text-white' : styles.button.primary
                            }`}
                    >
                        {getSaveButtonContent()}
                    </button>
                    <button
                        onClick={resetSettings}
                        className={`px-4 py-3 rounded-lg border transition-colors ${styles.button.secondary} flex items-center justify-center`}
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
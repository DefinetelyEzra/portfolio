'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    Palette,
    Monitor,
    Moon,
    Sun,
    Volume2,
    VolumeX,
    Save,
    RotateCcw,
    ImageIcon,
    Settings as SettingsIcon,
    Shield,
    User
} from 'lucide-react';
import { ALL_WALLPAPERS } from '@/utils/wallpaperUtils';
import { useDesktopStore } from '@/store/desktopStore';
import WidgetSettings from '../desktop/widgets/settings/WidgetSettings';
import { AudioManager } from '@/utils/audioManager';

const getThemeStyles = (currentTheme: string) => {
    const isDark = currentTheme === 'dark';

    const darkTheme = {
        background: 'from-gray-900 via-gray-800 to-gray-700',
        sidebar: {
            background: 'bg-gray-800',
            border: 'border-gray-700',
        },
        mainContent: 'bg-gray-900',
        text: {
            primary: 'text-gray-100',
            secondary: 'text-gray-400',
            muted: 'text-gray-500',
        },
        card: {
            background: 'bg-gray-800',
            border: 'border-gray-700',
        },
        button: {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white',
            secondary: 'border-gray-600 text-gray-300 hover:bg-gray-700',
            success: 'bg-green-600 text-white',
        },
        nav: {
            active: 'bg-blue-900/50 text-blue-300 border border-blue-800',
            inactive: 'text-gray-400 hover:bg-gray-700 hover:text-gray-200',
        },
        themePreview: {
            light: 'bg-gray-100 border-gray-600',
            dark: 'bg-gray-900 border-gray-600',
            auto: 'bg-gradient-to-r from-gray-100 to-gray-900 border-gray-600',
        },
        toggle: {
            active: 'bg-blue-500',
            inactive: 'bg-gray-600',
        },
        wallpaperButton: (selected: boolean) => `border-2 ${selected ? 'border-blue-400' : 'border-gray-600 hover:border-gray-500'}`,
        gradient: 'from-blue-600 to-purple-700',
    };

    const lightTheme = {
        background: 'from-gray-50 to-white',
        sidebar: {
            background: 'bg-white',
            border: 'border-gray-200',
        },
        mainContent: 'bg-gray-50',
        text: {
            primary: 'text-gray-900',
            secondary: 'text-gray-600',
            muted: 'text-gray-500',
        },
        card: {
            background: 'bg-white',
            border: 'border-gray-200',
        },
        button: {
            primary: 'bg-blue-500 hover:bg-blue-600 text-white',
            secondary: 'border-gray-200 text-gray-600 hover:bg-gray-50',
            success: 'bg-green-500 text-white',
        },
        nav: {
            active: 'bg-blue-50 text-blue-700 border border-blue-200',
            inactive: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
        },
        themePreview: {
            light: 'bg-white border-2',
            dark: 'bg-gray-900 border-2',
            auto: 'bg-gradient-to-r from-white to-gray-900 border-2',
        },
        toggle: {
            active: 'bg-blue-500',
            inactive: 'bg-gray-300',
        },
        wallpaperButton: (selected: boolean) => `border-2 ${selected ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'}`,
        gradient: 'from-blue-500 to-purple-600',
    };

    return isDark ? darkTheme : lightTheme;
};

type ThemeOption = 'light' | 'dark' | 'auto';

interface AppSettings {
    theme: ThemeOption;
    wallpaper: string;
    accentColor: string;
    soundEnabled: boolean;
    notifications: boolean;
    autoSave: boolean;
    fontSize: 'small' | 'medium' | 'large';
    widgets: { [key: string]: { visible: boolean; x: number; y: number; width?: number; height?: number; isPinned?: boolean; settings?: Record<string, unknown> } };
}

const defaultSettings: AppSettings = {
    theme: 'dark',
    wallpaper: 'gradient-1',
    accentColor: '#3B82F6',
    soundEnabled: true,
    notifications: true,
    autoSave: true,
    fontSize: 'medium',
    widgets: {
        'analog-clock': { visible: true, x: 100, y: 100, width: 200, height: 200, isPinned: false, settings: { timezone: 'Africa/Lagos', showSeconds: true, use24Hour: false, showDate: true, theme: 'auto' } },
        'weatherDashboard': { visible: false, x: 300, y: 50, width: 200, height: 150, isPinned: false, settings: {} },
        'quoteGenerator': { visible: false, x: 50, y: 300, width: 200, height: 150, isPinned: false, settings: {} }
    }
};

export default function SettingsApp() {
    const { windows, currentTheme } = useDesktopStore();
    const windowId = 'settings-app';
    const windowState = windows.find((w) => w.id === windowId) || { layoutKey: 0, isMaximized: false };
    const [hasChanges] = useState(false);
    const { layoutKey, isMaximized } = windowState;
    const styles = getThemeStyles(currentTheme);

    const [settings, setSettings] = useState<AppSettings>(defaultSettings);
    const [activeSection, setActiveSection] = useState<'appearance' | 'preferences' | 'about' | 'widgets'>('appearance');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    useEffect(() => {
        const { settings: storeSettings } = useDesktopStore.getState();
        const savedSettings = {
            ...defaultSettings,
            theme: storeSettings.theme,
            wallpaper: storeSettings.wallpaper || defaultSettings.wallpaper,
            soundEnabled: storeSettings.soundEnabled,
        };
        setSettings(savedSettings);
    }, []);

    useEffect(() => {
        const unsubscribe = useDesktopStore.subscribe((state) => {
            setSettings(prev => ({
                ...prev,
                theme: state.settings.theme,
                soundEnabled: state.settings.soundEnabled,
                wallpaper: state.settings.wallpaper || prev.wallpaper
            }));
            if (state.settings.theme === 'auto' && state.currentTheme !== state.getResolvedTheme()) {
                useDesktopStore.getState().updateSettings({ theme: 'auto' });
            }
        });
        return unsubscribe;
    }, []);

    const handleSettingChange = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        const updateSettings = useDesktopStore.getState().updateSettings;
        const audioManager = AudioManager.getInstance();

        if (key === 'soundEnabled') {
            updateSettings({ soundEnabled: value as boolean }); 
            audioManager.setEnabled(value as boolean);
        } else if (key === 'wallpaper') {
            updateSettings({ wallpaper: value as string });
        } else if (key === 'theme') {
            updateSettings({ theme: value as ThemeOption });
            if (value === 'auto') {
                useDesktopStore.getState().updateSettings({ theme: 'auto' });
            }
        }

        setSettings(prev => {
            if (key === 'widgets' && typeof value === 'object' && value !== null) {
                const updatedWidgets = { ...prev.widgets };
                Object.keys(value).forEach(widgetId => {
                    if (updatedWidgets[widgetId]) {
                        updatedWidgets[widgetId] = { ...updatedWidgets[widgetId], ...value[widgetId] };
                    }
                });
                return { ...prev, [key]: updatedWidgets };
            }
            return { ...prev, [key]: value };
        });
    };

    const saveSettings = async () => {
        setSaveStatus('saving');
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
        setSaveStatus('idle');
    };

    const getSaveButtonContent = () => {
        if (saveStatus === 'saving') {
            return (
                <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                </>
            );
        }
        if (saveStatus === 'saved') {
            return (
                <>
                    <Save className="w-4 h-4" />
                    <span>Saved!</span>
                </>
            );
        }
        return (
            <>
                <Save className="w-4 h-4" />
                <span>Save</span>
            </>
        );
    };

    const getThemeButtonClassName = (themeId: string, selectedTheme: string, currentTheme: string) => {
        const isSelected = themeId === selectedTheme;
        const isDarkTheme = currentTheme === 'dark';

        if (isSelected) {
            return `p-4 rounded-xl border-2 transition-all ${isDarkTheme ? 'border-blue-400 bg-blue-900/30' : 'border-blue-500 bg-blue-50'}`;
        }
        return `p-4 rounded-xl border-2 transition-all ${isDarkTheme ? 'border-gray-600 hover:border-gray-500 bg-gray-800' : 'border-gray-200 hover:border-gray-300 bg-white'}`;
    };

    const getWallpaperPreviewStyle = (wallpaper: typeof ALL_WALLPAPERS[number]) => {
        return {
            backgroundImage: `url(${wallpaper.path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        };
    };

    const sections = [
        { id: 'appearance', name: 'Appearance', icon: Palette },
        { id: 'preferences', name: 'Preferences', icon: SettingsIcon },
        { id: 'about', name: 'About', icon: User },
        { id: 'widgets', name: 'Widgets', icon: Monitor },
    ];

    return (
        <motion.div
            key={layoutKey} // Re-render on layout key change
            className={`h-screen flex bg-gradient-to-br ${styles.background} transition-all duration-300`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Sidebar */}
            <motion.div
                className={`w-64 ${styles.sidebar.background} border-r ${styles.sidebar.border} flex flex-col transition-all duration-300 ${isMaximized ? 'md:w-20' : 'w-64'}`}
                initial={{ width: isMaximized ? '20px' : '256px' }}
                animate={{ width: isMaximized ? '20px' : '256px' }}
            >
                <div className={`p-6 border-b ${styles.sidebar.border} ${isMaximized ? 'p-2' : 'p-6'}`}>
                    <h1 className={`text-xl font-bold ${styles.text.primary} flex items-center ${isMaximized ? 'hidden' : 'flex'}`}>
                        <SettingsIcon className="w-5 h-5 mr-2" />
                        Settings
                    </h1>
                    <p className={`text-sm ${styles.text.secondary} mt-1 ${isMaximized ? 'hidden' : 'block'}`}>Customize your experience</p>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto">
                    {sections.map((section) => {
                        const IconComponent = section.icon;
                        return (
                            <motion.button
                                key={section.id}
                                onClick={() => setActiveSection(section.id as 'appearance' | 'preferences' | 'about' | 'widgets')}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors mb-2 ${activeSection === section.id ? styles.nav.active : styles.nav.inactive
                                    } ${isMaximized ? 'justify-center space-x-0' : 'space-x-3'}`}
                                whileHover={{ scale: isMaximized ? 1 : 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <IconComponent className="w-5 h-5" />
                                <span className={`font-medium ${isMaximized ? 'hidden' : 'block'}`}>{section.name}</span>
                            </motion.button>
                        );
                    })}
                </nav>

                {/* Save Controls */}
                {hasChanges && (
                    <div className={`p-4 border-t ${styles.sidebar.border} ${isMaximized ? 'p-2' : 'p-4'}`}>
                        <div className="flex space-x-2">
                            <motion.button
                                onClick={saveSettings}
                                disabled={saveStatus === 'saving'}
                                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${saveStatus === 'saved' ? styles.button.success : styles.button.primary
                                    } ${isMaximized ? 'px-2 text-sm' : 'px-4'}`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {getSaveButtonContent()}
                            </motion.button>
                            <motion.button
                                onClick={resetSettings}
                                className={`px-4 py-2 rounded-lg border transition-colors ${styles.button.secondary} ${isMaximized ? 'px-2' : 'px-4'}`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <RotateCcw className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Main Content */}
            <motion.div
                className="flex-1 overflow-y-auto p-8 transition-all duration-300"
                initial={{ opacity: 0, x: isMaximized ? 0 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                {activeSection === 'appearance' && (
                    <motion.div
                        className="max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className={`text-2xl font-bold ${styles.text.primary} mb-2`}>Appearance</h2>
                        <p className={`${styles.text.secondary} mb-8`}>Customize the look and feel of your desktop</p>

                        {/* Theme Selection */}
                        <div className="mb-8">
                            <h3 className={`text-lg font-semibold ${styles.text.primary} mb-4 flex items-center`}>
                                <Monitor className="w-5 h-5 mr-2" />
                                Theme
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { id: 'light', name: 'Light', icon: Sun, preview: styles.themePreview.light },
                                    { id: 'dark', name: 'Dark', icon: Moon, preview: styles.themePreview.dark },
                                    { id: 'auto', name: 'Auto', icon: Monitor, preview: styles.themePreview.auto }
                                ].map((theme) => {
                                    const IconComponent = theme.icon;
                                    return (
                                        <motion.button
                                            key={theme.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleSettingChange('theme', theme.id as ThemeOption)}
                                            className={getThemeButtonClassName(theme.id, settings.theme, currentTheme)}
                                        >
                                            <div className={`w-full h-20 rounded-lg mb-3 ${theme.preview} flex items-center justify-center`}>
                                                <IconComponent className={`w-6 h-6 ${theme.id === 'dark' ? 'text-white' : 'text-gray-600'}`} />
                                            </div>
                                            <div className={`text-sm font-medium ${styles.text.primary}`}>{theme.name}</div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Wallpaper Selection */}
                        <div className="mb-8">
                            <h3 className={`text-lg font-semibold ${styles.text.primary} mb-4 flex items-center`}>
                                <ImageIcon className="w-5 h-5 mr-2" />
                                Wallpaper
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {ALL_WALLPAPERS.map((wallpaper) => (
                                    <motion.button
                                        key={wallpaper.id}
                                        onClick={() => handleSettingChange('wallpaper', wallpaper.path)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`relative p-2 rounded-xl transition-all ${styles.wallpaperButton(settings.wallpaper === wallpaper.path)
                                            }`}
                                    >
                                        <div className="wallpaper-preview" style={getWallpaperPreviewStyle(wallpaper)} />
                                        <div className={`text-sm font-medium ${styles.text.primary} mt-2 text-center`}>{wallpaper.name}</div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeSection === 'preferences' && (
                    <motion.div
                        className="max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className={`text-2xl font-bold ${styles.text.primary} mb-2`}>Preferences</h2>
                        <p className={`${styles.text.secondary} mb-8`}>Configure app behavior and features</p>

                        <div className="space-y-6">
                            {/* Sound */}
                            <div className={`flex items-center justify-between p-4 ${styles.card.background} rounded-xl border ${styles.card.border}`}>
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
                        className="max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className={`text-2xl font-bold ${styles.text.primary} mb-2`}>About</h2>
                        <p className={`${styles.text.secondary} mb-8`}>Information about this portfolio OS</p>

                        <div className="space-y-6">
                            <div className={`${styles.card.background} rounded-xl p-6 border ${styles.card.border}`}>
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${styles.gradient} rounded-xl flex items-center justify-center`}>
                                        <span className="text-white text-2xl font-bold">OS</span>
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-bold ${styles.text.primary}`}>Portfolio OS</h3>
                                        <p className={styles.text.secondary}>Version 1.0.0</p>
                                    </div>
                                </div>
                                <p className={`${styles.text.primary} leading-relaxed`}>
                                    A mini operating system built as an interactive portfolio showcase.
                                    Explore my projects, skills, and personality through this desktop-like experience.
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
                                        <span className={styles.text.secondary}>Specialization</span>
                                        <span className={`${styles.text.primary} font-medium`}>Fullstack Development, Machine Learning</span>
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
                        </div>
                    </motion.div>
                )}
                {activeSection === 'widgets' && <WidgetSettings />}
            </motion.div>
        </motion.div>
    );
}
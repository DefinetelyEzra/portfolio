'use client';

import { motion } from 'framer-motion';
import { Clock, Sparkles, ArrowLeft, Calendar, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';

interface ComingSoonProps {
    readonly title?: string;
    readonly subtitle?: string;
    readonly description?: string;
    readonly targetDate?: Date;
    readonly showBackButton?: boolean;
    readonly onBack?: () => void;
    readonly variant?: 'default' | 'minimal' | 'animated';
    readonly gradient?: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

interface FloatingIconProps {
    icon: LucideIcon;
    delay?: number;
    duration?: number;
}

// Define FloatingIcon component outside of ComingSoon
const FloatingIcon = ({ icon: Icon, delay = 0, duration = 3 }: FloatingIconProps) => (
    <motion.div
        className="absolute opacity-10"
        animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            rotate: [0, 5, -5, 0]
        }}
        transition={{
            duration,
            repeat: Infinity,
            delay,
            ease: "easeInOut"
        }}
    >
        <Icon className="w-8 h-8 text-white" />
    </motion.div>
);

export default function ComingSoon({
    title = "Coming Soon",
    subtitle = "Something amazing is in the works",
    description = "We're putting the finishing touches on this feature. Stay tuned for updates!",
    targetDate,
    showBackButton = false,
    onBack,
    variant = 'default',
    gradient = 'from-blue-600 via-purple-600 to-indigo-700'
}: ComingSoonProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!targetDate) return;

        const updateTimer = () => {
            const now = Date.now();
            const target = targetDate.getTime();
            const difference = target - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                });
            } else {
                setTimeLeft(null);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    if (!mounted) {
        return (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
                <div className="animate-pulse">
                    <div className="w-16 h-16 bg-white/20 rounded-full"></div>
                </div>
            </div>
        );
    }

    const renderMinimalVariant = () => (
        <div className="flex flex-col items-center justify-center space-y-6">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative"
            >
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <Clock className="w-12 h-12 text-white" />
                </div>
                <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Sparkles className="w-4 h-4 text-yellow-900" />
                </motion.div>
            </motion.div>

            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-white">{title}</h1>
                <p className="text-white/80 max-w-md">{description}</p>
            </div>
        </div>
    );

    const renderAnimatedVariant = () => (
        <div className="relative flex flex-col items-center justify-center space-y-8 overflow-hidden">
            {/* Floating Background Icons */}
            <div className="absolute inset-0">
                <FloatingIcon icon={Sparkles} delay={0} />
                <div className="absolute top-20 right-20">
                    <FloatingIcon icon={Zap} delay={1} duration={4} />
                </div>
                <div className="absolute bottom-32 left-16">
                    <FloatingIcon icon={Calendar} delay={2} duration={5} />
                </div>
                <div className="absolute top-1/3 right-1/4">
                    <FloatingIcon icon={Clock} delay={1.5} duration={3.5} />
                </div>
            </div>

            {/* Main Content */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 text-center space-y-6"
            >
                <motion.div
                    className="relative mx-auto w-32 h-32"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    <div className="w-full h-full bg-gradient-to-r from-white/20 to-white/40 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Clock className="w-16 h-16 text-white" />
                        </motion.div>
                    </div>

                    {/* Orbiting Elements */}
                    <motion.div
                        className="absolute -top-4 left-1/2 w-6 h-6 bg-yellow-400 rounded-full transform -translate-x-1/2"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        style={{ transformOrigin: '50% 80px' }}
                    />
                    <motion.div
                        className="absolute top-1/2 -right-4 w-4 h-4 bg-blue-400 rounded-full transform -translate-y-1/2"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        style={{ transformOrigin: '-64px 50%' }}
                    />
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="space-y-3"
                >
                    <h1 className="text-4xl font-bold text-white">{title}</h1>
                    <p className="text-xl text-white/90">{subtitle}</p>
                    <p className="text-white/70 max-w-lg mx-auto leading-relaxed">{description}</p>
                </motion.div>
            </motion.div>
        </div>
    );

    const renderDefaultVariant = () => (
        <div className="flex flex-col items-center justify-center space-y-8">
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    duration: 0.8
                }}
                className="relative"
            >
                <div className="w-32 h-32 bg-gradient-to-br from-white/20 to-white/40 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-2xl">
                    <Clock className="w-16 h-16 text-white" />
                </div>

                <motion.div
                    className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-center space-y-4 max-w-2xl"
            >
                <h1 className="text-5xl font-bold text-white mb-2">{title}</h1>
                <p className="text-2xl text-white/90 mb-4">{subtitle}</p>
                <p className="text-lg text-white/70 leading-relaxed">{description}</p>
            </motion.div>

            {/* Countdown Timer */}
            {targetDate && timeLeft && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                >
                    <div className="grid grid-cols-4 gap-6 text-center">
                        {Object.entries(timeLeft).map(([unit, value]) => (
                            <div key={unit} className="flex flex-col">
                                <motion.div
                                    key={value}
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-3xl font-bold text-white mb-1"
                                >
                                    {value.toString().padStart(2, '0')}
                                </motion.div>
                                <div className="text-sm text-white/70 capitalize">{unit}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );

    return (
        <div className={`h-full flex flex-col bg-gradient-to-br ${gradient} text-white relative overflow-hidden`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
                    backgroundSize: '60px 60px'
                }} />
            </div>

            {/* Back Button */}
            {showBackButton && onBack && (
                <div className="relative z-20 p-6">
                    <motion.button
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        onClick={onBack}
                        className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Back</span>
                    </motion.button>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-10 overflow-y-auto">
                {variant === 'minimal' && renderMinimalVariant()}
                {variant === 'animated' && renderAnimatedVariant()}
                {variant === 'default' && renderDefaultVariant()}
            </div>

            {/* Bottom Decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
    );
}
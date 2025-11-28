'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useDesktopStore } from '@/store/desktopStore';
import BreathingOrbs from '@/components/ui/BreathingOrbs';

interface CircularProgressProps {
    readonly progress: number;
}

function CircularProgress({ progress }: CircularProgressProps) {
    const radius = 60;
    const strokeWidth = 4;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const { currentTheme } = useDesktopStore();
    const backgroundStroke = currentTheme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
    const progressGradientId = currentTheme === 'light' ? 'lightProgressGradient' : 'progressGradient';
    const gradientStops = currentTheme === 'light'
        ? { start: '#4F46E5', end: '#A5B4FC' }
        : { start: '#3B82F6', end: '#8B5CF6' };

    return (
        <div className="relative w-32 h-32">
            <svg
                height={radius * 2}
                width={radius * 2}
                className="transform -rotate-90 absolute inset-0"
            >
                {/* Background circle */}
                <circle
                    stroke={backgroundStroke}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                {/* Progress circle */}
                <circle
                    stroke={`url(#${progressGradientId})`}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    style={{ strokeDashoffset }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    strokeLinecap="round"
                    className="transition-all duration-150 ease-out"
                />
                <defs>
                    <linearGradient id={progressGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={gradientStops.start} />
                        <stop offset="100%" stopColor={gradientStops.end} />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-lg font-semibold ${currentTheme === 'light' ? 'text-black' : 'text-white'}`}>
                    {Math.round(progress)}%
                </span>
            </div>
        </div>
    );
}

export default function BootScreen() {
    const { setBooting, currentTheme } = useDesktopStore();
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Initializing...');
    const [mounted, setMounted] = useState(false);

    const loadingSteps = useMemo(() => [
        { text: 'Initializing system...', duration: 800 },
        { text: 'Loading desktop environment...', duration: 600 },
        { text: 'Setting up applications...', duration: 700 },
        { text: 'Preparing user interface...', duration: 500 },
        { text: 'Almost ready...', duration: 400 },
    ], []);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        let currentStep = 0;
        let progressValue = 0;

        const loadNext = () => {
            if (currentStep < loadingSteps.length) {
                const step = loadingSteps[currentStep];
                setLoadingText(step.text);

                const increment = 100 / loadingSteps.length;
                const targetProgress = Math.min(100, progressValue + increment);

                const startProgress = progressValue;
                const duration = step.duration;
                const startTime = Date.now();

                const updateProgress = () => {
                    const elapsed = Date.now() - startTime;
                    const ratio = Math.min(elapsed / duration, 1);
                    const currentProgress = startProgress + (targetProgress - startProgress) * ratio;

                    setProgress(currentProgress);

                    if (ratio < 1) {
                        requestAnimationFrame(updateProgress);
                    } else {
                        progressValue = targetProgress;
                        currentStep++;
                        setTimeout(loadNext, 100);
                    }
                };

                updateProgress();
            } else {
                setTimeout(() => {
                    setBooting(false);
                }, 500);
            }
        };

        setTimeout(loadNext, 500);
    }, [mounted, setBooting, loadingSteps]);

    const overlayStyle = {
        background: currentTheme === 'light' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
    };
    const textStyle = {
        color: `var(--foreground)`,
        textShadow: currentTheme === 'light' ? '0 2px 4px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.5)',
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden"
            style={{ background: `var(--background)` }}
        >
            {/* Breathing Orbs Background */}
            <BreathingOrbs orbCount={5} />

            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0" style={overlayStyle} />

            {/* Subtle noise texture overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    background: currentTheme === 'light'
                        ? 'radial-gradient(ellipse at center, #f0f0f0 0%, #e0e0e0 25%, #d0d0d0 50%, #f0f0f0 100%)'
                        : 'radial-gradient(ellipse at center, #0f0f23 0%, #1a0933 25%, #2d1b69 50%, #0f0f23 100%)',
                }}
            />

            <div className="text-center space-y-12 relative z-10">
                {/* Logo with circular progress */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-8 relative"
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <CircularProgress progress={progress} />
                    </div>
                </motion.div>

                {/* Brand Name */}
                <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 25, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-3xl font-thin tracking-[0.2em] uppercase drop-shadow-lg"
                    style={textStyle}
                >
                    Loading...
                </motion.h1>

                {/* Loading Text - Fixed hydration */}
                <div className="w-80 space-y-4">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.3 }}
                        className="text-sm h-5 drop-shadow-md"
                        style={textStyle}
                        suppressHydrationWarning
                    >
                        {loadingText}
                    </motion.p>
                </div>
            </div>
        </motion.div>
    );
}
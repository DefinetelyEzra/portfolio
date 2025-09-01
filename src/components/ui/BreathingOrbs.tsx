'use client';

import { memo, useMemo } from 'react';
import { useDesktopStore } from '@/store/desktopStore';

interface OrbConfig {
    readonly id: string;
    readonly size: number;
    readonly x: number;
    readonly y: number;
    readonly duration: number;
    readonly delay: number;
    readonly opacity: readonly [number, number];
    readonly scale: readonly [number, number];
    readonly colors: readonly [string, string];
}

interface BreathingOrbsProps {
    readonly orbCount?: number;
    readonly disabled?: boolean;
    readonly className?: string;
}

interface SingleOrbProps {
    readonly config: OrbConfig;
    readonly disabled: boolean;
}

const SingleOrb = memo<SingleOrbProps>(({ config, disabled }) => {
    const {
        id,
        size,
        x,
        y,
        duration,
        delay,
        opacity,
        scale,
        colors
    } = config;

    const orbStyle = useMemo(() => ({
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}%`,
        top: `${y}%`,
        background: `radial-gradient(circle, ${colors[0]} 0%, ${colors[1]} 70%, transparent 100%)`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        opacity: disabled ? 0 : opacity[0],
        transform: `translate(-50%, -50%) scale(${scale[0]})`,
    }), [size, x, y, duration, delay, opacity, scale, colors, disabled]);

    const keyframes = useMemo(() => `
        @keyframes breathe-${id} {
            0%, 100% {
                opacity: ${opacity[0]};
                transform: translate(-50%, -50%) scale(${scale[0]});
            }
            50% {
                opacity: ${opacity[1]};
                transform: translate(-50%, -50%) scale(${scale[1]});
            }
        }
    `, [id, opacity, scale]);

    return (
        <>
            <style>{keyframes}</style>
            <div
                className="absolute rounded-full pointer-events-none will-change-transform"
                style={{
                    ...orbStyle,
                    animation: disabled ? 'none' : `breathe-${id} ${duration}s ease-in-out infinite`,
                }}
                aria-hidden="true"
            />
        </>
    );
});

SingleOrb.displayName = 'SingleOrb';

const BreathingOrbs = memo<BreathingOrbsProps>(({
    orbCount = 3,
    disabled = false,
    className = ''
}) => {
    const { currentTheme } = useDesktopStore();
    const orbs = useMemo<readonly OrbConfig[]>(() => {
        try {
            const validOrbCount = Math.max(1, Math.min(orbCount, 5));

            const baseConfigs: readonly OrbConfig[] = [
                {
                    id: 'orb-1',
                    size: 600,
                    x: 15,
                    y: 20,
                    duration: 5.5,
                    delay: 0,
                    opacity: [0.3, 0.3] as const,
                    scale: [0.8, 1.1] as const,
                    colors: currentTheme === 'light'
                        ? ['#3B82F6', 'rgba(255, 255, 255, 0.2)'] as const
                        : ['#3B82F6', 'transparent'] as const,
                },
                {
                    id: 'orb-2',
                    size: 800,
                    x: 85,
                    y: 75,
                    duration: 6.2,
                    delay: 1.8,
                    opacity: [0.04, 0.10] as const,
                    scale: [0.9, 1.2] as const,
                    colors: currentTheme === 'light'
                        ? ['#8B5CF6', 'rgba(255, 255, 255, 0.2)'] as const
                        : ['#8B5CF6', 'transparent'] as const,
                },
                {
                    id: 'orb-3',
                    size: 500,
                    x: 25,
                    y: 80,
                    duration: 4.8,
                    delay: 3.2,
                    opacity: [0.05, 0.11] as const,
                    scale: [0.85, 1.15] as const,
                    colors: currentTheme === 'light'
                        ? ['#6366F1', 'rgba(255, 255, 255, 0.2)'] as const
                        : ['#6366F1', 'transparent'] as const,
                },
                {
                    id: 'orb-4',
                    size: 700,
                    x: 75,
                    y: 15,
                    duration: 5.8,
                    delay: 2.5,
                    opacity: [0.045, 0.095] as const,
                    scale: [0.88, 1.18] as const,
                    colors: currentTheme === 'light'
                        ? ['#4F46E5', 'rgba(255, 255, 255, 0.2)'] as const
                        : ['#4F46E5', 'transparent'] as const,
                },
                {
                    id: 'orb-5',
                    size: 450,
                    x: 50,
                    y: 10,
                    duration: 5.2,
                    delay: 4.1,
                    opacity: [0.055, 0.105] as const,
                    scale: [0.82, 1.12] as const,
                    colors: currentTheme === 'light'
                        ? ['#7C3AED', 'rgba(255, 255, 255, 0.2)'] as const
                        : ['#7C3AED', 'transparent'] as const,
                },
            ];

            return baseConfigs.slice(0, validOrbCount);
        } catch (error) {
            console.error('Error generating orb configurations:', error);
            return [{
                id: 'orb-fallback',
                size: 600,
                x: 20,
                y: 25,
                duration: 5.5,
                delay: 0,
                opacity: [0.06, 0.12] as const,
                scale: [0.8, 1.1] as const,
                colors: currentTheme === 'light'
                    ? ['#3B82F6', 'rgba(255, 255, 255, 0.2)'] as const
                    : ['#3B82F6', 'transparent'] as const,
            }];
        }
    }, [orbCount, currentTheme]);

    if (disabled) {
        return null;
    }

    return (
        <div
            className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
            style={{ zIndex: -1 }}
            aria-hidden="true"
        >
            {orbs.map((orbConfig) => (
                <SingleOrb
                    key={orbConfig.id}
                    config={orbConfig}
                    disabled={disabled}
                />
            ))}
        </div>
    );
});

BreathingOrbs.displayName = 'BreathingOrbs';

export default BreathingOrbs;
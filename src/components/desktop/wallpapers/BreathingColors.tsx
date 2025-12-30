'use client';

import { useEffect, useRef } from 'react';
import { useDesktopStore } from '@/store/desktopStore';

export default function BreathingColors() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const pulseRef = useRef(0);
    const targetPulseRef = useRef(0);
    const lastWindowEventRef = useRef(0);
    const windows = useDesktopStore(state => state.windows);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const updateSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        updateSize();
        window.addEventListener('resize', updateSize);

        const draw = () => {
            const { width, height } = canvas;

            // Smooth pulse transition
            pulseRef.current += (targetPulseRef.current - pulseRef.current) * 0.05;

            // Natural breathing effect
            const breathe = Math.sin(Date.now() * 0.001) * 0.5 + 0.5;
            const intensity = breathe * 0.3 + pulseRef.current * 0.7;

            // Create gradient with breathing colors
            const gradient = ctx.createRadialGradient(
                width / 2,
                height / 2,
                0,
                width / 2,
                height / 2,
                Math.max(width, height) * 0.8
            );

            // Color palette that shifts with breathing
            const hue1 = (Date.now() * 0.02) % 360;
            const hue2 = (hue1 + 60) % 360;
            const hue3 = (hue1 + 120) % 360;

            gradient.addColorStop(0, `hsla(${hue1}, 70%, ${40 + intensity * 20}%, 1)`);
            gradient.addColorStop(0.5, `hsla(${hue2}, 70%, ${30 + intensity * 20}%, 1)`);
            gradient.addColorStop(1, `hsla(${hue3}, 70%, ${20 + intensity * 20}%, 1)`);

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Add subtle texture
            ctx.fillStyle = `rgba(0, 0, 0, ${0.05 - intensity * 0.03})`;
            for (let i = 0; i < 50; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const size = Math.random() * 2 + 1;
                ctx.fillRect(x, y, size, size);
            }

            // Decay pulse
            targetPulseRef.current *= 0.95;

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', updateSize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    // Sync with window events
    useEffect(() => {
        const now = Date.now();
        if (now - lastWindowEventRef.current < 100) return; // Debounce

        lastWindowEventRef.current = now;
        targetPulseRef.current = 1;
    }, [windows.length, windows.some(w => w.isMaximized), windows.some(w => w.isMinimized)]);

    return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
}
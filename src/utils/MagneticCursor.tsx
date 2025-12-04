import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function MagneticCursor() {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 300 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        // Hide on mobile/touch devices
        if ('ontouchstart' in globalThis.window) {
            return;
        }

        setIsVisible(true);

        const handleMouseMove = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            const target = e.target;
            if (target instanceof HTMLElement) {
                if (
                    target.tagName === 'A' ||
                    target.tagName === 'BUTTON' ||
                    target.classList.contains('magnetic-element') ||
                    target.closest('a') ||
                    target.closest('button')
                ) {
                    setIsHovering(true);
                } else {
                    setIsHovering(false);
                }
            } else {
                setIsHovering(false);
            }
        };

        globalThis.window.addEventListener('mousemove', handleMouseMove);

        return () => {
            globalThis.window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [cursorX, cursorY]);

    if (!isVisible) return null;

    return (
        <>
            {/* Main cursor */}
            <motion.div
                className="fixed pointer-events-none z-9999 mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            >
                <motion.div
                    className="w-10 h-10 border-2 border-white rounded-full"
                    animate={{
                        width: isHovering ? 60 : 40,
                        height: isHovering ? 60 : 40,
                        borderColor: isHovering ? 'rgb(168, 85, 247)' : 'rgb(255, 255, 255)',
                    }}
                    transition={{ duration: 0.2 }}
                />
            </motion.div>

            {/* Inner dot */}
            <motion.div
                className="fixed pointer-events-none z-9999 mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            >
                <motion.div
                    className="w-4 h-4 bg-blue-500 rounded-full"
                    animate={{
                        scale: isHovering ? 0 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                />
            </motion.div>
        </>
    );
}
'use client';

import { useEffect, useRef } from 'react';
import { MinimizeAnimationProps } from '@/types/desktop';

export default function MinimizeAnimation({
    windowElement,
    appId,
    isRestoring,
    onComplete,
}: Readonly<MinimizeAnimationProps>) {
    const cloneRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!windowElement) {
            onComplete();
            return;
        }

        const performGenieAnimation = async () => {
            // Find the dock icon
            const dockIcon = document.querySelector(`[data-dock-icon="${appId}"]`) as HTMLElement;
            if (!dockIcon) {
                console.warn(`Dock icon not found for app: ${appId}`);
                onComplete();
                return;
            }

            const windowRect = windowElement.getBoundingClientRect();
            const dockRect = dockIcon.getBoundingClientRect();
            const clone = cloneRef.current;

            if (!clone) {
                onComplete();
                return;
            }

            // Calculate end position (center of dock icon)
            const endX = dockRect.left + dockRect.width / 2;
            const endY = dockRect.top + dockRect.height / 2;

            // Set initial state
            clone.style.left = `${windowRect.left}px`;
            clone.style.top = `${windowRect.top}px`;
            clone.style.width = `${windowRect.width}px`;
            clone.style.height = `${windowRect.height}px`;
            clone.style.opacity = '1';
            clone.style.transform = 'scale(1) skew(0deg) rotateX(0deg)';

            // Force reflow
            const forceReflow = (element: HTMLElement) => element.offsetHeight;
            forceReflow(clone);

            // Start animation
            const animationDuration = 600; 

            if (isRestoring) {
                // Start from dock position for restore
                clone.style.left = `${endX - 20}px`;
                clone.style.top = `${endY - 15}px`;
                clone.style.width = '40px';
                clone.style.height = '30px';
                clone.style.opacity = '0.2';
                clone.style.transform = `
        scale(0.05, 0.1) 
        skew(25deg, 5deg) 
        rotateX(15deg) 
        perspective(1000px)
    `;

                // Force reflow before animating to final position
                forceReflow(clone);

                // Restore animation 
                clone.style.transition = `all ${animationDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
                clone.style.left = `${windowRect.left}px`;
                clone.style.top = `${windowRect.top}px`;
                clone.style.width = `${windowRect.width}px`;
                clone.style.height = `${windowRect.height}px`;
                clone.style.opacity = '1';
                clone.style.transform = 'scale(1) skew(0deg) rotateX(0deg)';
                clone.style.filter = 'blur(0px)';
            } else {
                // Genie minimize animation
                clone.style.transition = `all ${animationDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
                clone.style.left = `${endX - 20}px`;
                clone.style.top = `${endY - 15}px`;
                clone.style.width = '40px';
                clone.style.height = '30px';
                clone.style.opacity = '0.2';

                // Apply the genie warp effect
                clone.style.transform = `
                    scale(0.05, 0.1) 
                    skew(25deg, 5deg) 
                    rotateX(15deg) 
                    perspective(1000px)
                `;

                // Add progressive blur effect
                setTimeout(() => {
                    clone.style.filter = 'blur(1px)';
                }, animationDuration * 0.6);
            }

            // Complete animation
            setTimeout(() => {
                onComplete();
            }, animationDuration);
        };

        // Small delay to ensure DOM is ready
        requestAnimationFrame(() => {
            performGenieAnimation();
        });

    }, [windowElement, appId, isRestoring, onComplete]);

    if (!windowElement) return null;

    return (
        <div
            ref={cloneRef}
            className="fixed pointer-events-none z-9999"
            style={{
                position: 'fixed',
                background: 'var(--window-bg, #1f2937)',
                border: '1px solid var(--window-border, #374151)',
                borderRadius: '8px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                transformOrigin: 'center bottom',
                overflow: 'hidden',
            }}
        >
            {/* Simple window representation */}
            <div
                className="w-full bg-linear-to-r from-gray-800 to-gray-900 border-b border-gray-700/50 flex items-center px-4"
                style={{ height: '32px' }}
            >
                <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
            </div>
            <div
                className="bg-gray-900/80"
                style={{ height: 'calc(100% - 32px)' }}
            />
        </div>
    );
}
'use client';

import { memo, useState, useCallback } from 'react';
import { motion, Variants } from 'framer-motion';
import { AppConfig } from '@/types/desktop';
import Image from 'next/image';

interface MobileAppIconProps {
    app: AppConfig;
    onClick: () => void;
    disabled?: boolean;
}

function MobileAppIcon({ app, onClick, disabled = false }: Readonly<MobileAppIconProps>) {
    const [imageError, setImageError] = useState(false);

    const isSkillsApp = app.id === 'skills';
    const isExtrasApp = app.id === 'extras';

    const imageClass = (() => {
        let baseClass = 'w-14 h-14 object-cover';
        if (isSkillsApp) baseClass += ' scale-125';
        else if (isExtrasApp) baseClass += ' p-2';
        return baseClass;
    })();

    const handleImageError = useCallback(() => {
        setImageError(true);
    }, []);

    const handleClick = useCallback(() => {
        if (!disabled) {
            onClick();
        }
    }, [disabled, onClick]);

    const iconVariants: Variants = {
        initial: { scale: 0.8, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: {
                type: 'spring' as const, 
                stiffness: 200,
                damping: 15,
            }
        }
    };

    return (
        <motion.button
            className="flex flex-col items-center space-y-2 p-2 rounded-xl"
            onClick={handleClick}
            disabled={disabled}
            whileTap={{ scale: 0.95 }}
        >
            {/* App Icon */}
            <motion.div
                className={`w-14 h-14 rounded-2xl shadow-lg overflow-hidden ${isExtrasApp ? 'bg-gray-700' : ''
                    }`}
                variants={iconVariants}
                initial="initial"
                animate="animate"
            >
                {imageError ? (
                    <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">
                            {app.name.charAt(0)}
                        </span>
                    </div>
                ) : (
                    <Image
                        src={app.icon}
                        alt={app.name}
                        width={56}
                        height={56}
                        className={imageClass}
                        onError={handleImageError}
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        sizes="56px"
                    />
                )}
            </motion.div>

            {/* App Name */}
            <motion.span
                className="text-xs text-white font-medium text-center leading-tight max-w-16 truncate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 }}
            >
                {app.name}
            </motion.span>
        </motion.button>
    );
}

export default memo(MobileAppIcon);
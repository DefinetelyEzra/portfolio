'use client';

import { motion } from 'framer-motion';
import { AppConfig } from '@/types/desktop';
import Image from 'next/image';

interface MobileAppIconProps {
    app: AppConfig;
    onClick: () => void;
    disabled?: boolean;
}

export default function MobileAppIcon({ app, onClick, disabled = false }: Readonly<MobileAppIconProps>) {
    const isSkillsApp = app.id === 'skills' || app.name.toLowerCase() === 'skills';
    const isExtrasApp = app.id === 'extras' || app.name.toLowerCase() === 'extras';

    let imageClass = 'w-14 h-14 object-cover';
    if (isSkillsApp) {
        imageClass += ' scale-125';
    } else if (isExtrasApp) {
        imageClass += ' p-2';
    }

    return (
        <motion.button
            className="flex flex-col items-center space-y-2 p-2 rounded-xl active:scale-95 transition-transform"
            onClick={!disabled ? onClick : undefined}
            disabled={disabled}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
        >
            {/* App Icon */}
            <motion.div
                className={`w-14 h-14 rounded-2xl shadow-lg overflow-hidden ${
                    isExtrasApp ? 'bg-gray-700' : ''
                }`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                    delay: Math.random() * 0.2,
                }}
            >
                <Image
                    src={app.icon}
                    alt={app.name}
                    width={56}
                    height={56}
                    className={imageClass}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `<span class="text-lg font-bold text-gray-600 dark:text-gray-300">${app.name.charAt(0)}</span>`;
                    }}
                />
            </motion.div>

            {/* App Name */}
            <motion.span
                className="text-xs text-white font-medium text-center leading-tight max-w-16 truncate"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                {app.name}
            </motion.span>
        </motion.button>
    );
}
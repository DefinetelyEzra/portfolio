'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function MobileWidgets() {
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }));
            setCurrentDate(now.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            }));
        };

        updateDateTime();
        const timeInterval = setInterval(() => updateDateTime(), 10000);
        const dateInterval = setInterval(() => {
            setCurrentDate(new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            }));
        }, 60000); // Update date every 60 seconds
        return () => {
            clearInterval(timeInterval);
            clearInterval(dateInterval);
        };
    }, []);

    return (
        <div className="px-4 space-y-4">
            {/* Large Clock Widget */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20"
            >
                <div className="flex items-center space-x-3 mb-2">
                    <Clock className="text-white w-6 h-6" />
                    <span className="text-white/80 text-sm font-medium">Clock</span>
                </div>
                <div className="text-white">
                    <div className="text-4xl font-light tracking-tight">{currentTime}</div>
                    <div className="text-white/70 text-sm mt-1">{currentDate}</div>
                </div>
            </motion.div>
        </div>
    );
}
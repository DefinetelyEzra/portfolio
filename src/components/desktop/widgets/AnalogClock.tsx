import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BaseWidget from './BaseWidget';
import { BaseWidgetProps, ClockSettings } from '@/types/widget';
import { TIMEZONE_OPTIONS, getCurrentTime, formatTimezone } from '@/utils/widgetHelpers';
import { useDesktopStore } from '@/store/desktopStore';

const getThemeStyles = (currentTheme: string) => {
  const isDark = currentTheme === 'dark';

  const darkTheme = {
    clockFace: {
      fill: '#1f2937',
      stroke: '#4b5563',
      strokeWidth: '2',
    },
    hourMarkers: {
      stroke: '#9ca3af',
      mainStroke: '#d1d5db',
    },
    hands: {
      hour: '#e5e7eb',
      minute: '#f3f4f6',
      second: '#ef4444',
      center: '#e5e7eb',
    },
    text: {
      primary: 'text-gray-100',
      secondary: 'text-gray-300',
      muted: 'text-gray-400',
    },
    buttons: {
      hover: 'hover:bg-gray-700 dark:hover:bg-gray-700',
      settings: 'text-gray-400 hover:text-gray-200',
    },
    popups: {
      background: 'bg-gray-800',
      border: 'border-gray-600',
      shadow: 'shadow-xl',
      input: 'bg-gray-700 border-gray-600 text-gray-100',
      label: 'text-gray-200',
      option: 'text-gray-100',
    },
  };

  const lightTheme = {
    clockFace: {
      fill: '#ffffff',
      stroke: '#e5e7eb',
      strokeWidth: '2',
    },
    hourMarkers: {
      stroke: '#6b7280',
      mainStroke: '#374151',
    },
    hands: {
      hour: '#374151',
      minute: '#4b5563',
      second: '#ef4444',
      center: '#374151',
    },
    text: {
      primary: 'text-gray-800',
      secondary: 'text-gray-600',
      muted: 'text-gray-500',
    },
    buttons: {
      hover: 'hover:bg-gray-100 hover:bg-gray-100',
      settings: 'text-gray-400 hover:text-gray-600',
    },
    popups: {
      background: 'bg-white',
      border: 'border-gray-200',
      shadow: 'shadow-xl',
      input: 'bg-white border-gray-300 text-gray-800',
      label: 'text-gray-700',
      option: 'text-gray-800',
    },
  };

  return isDark ? darkTheme : lightTheme;
};

export default function AnalogClock(
  { widget, onClose, onSettingsChange, ...props }: Readonly<BaseWidgetProps>
) {
  const { currentTheme } = useDesktopStore();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const settings = (widget.settings as unknown) as ClockSettings;
  const timezone = settings?.timezone || 'UTC';
  const showSeconds = settings?.showSeconds ?? true;
  const use24Hour = settings?.use24Hour ?? false;
  const showDate = settings?.showDate ?? true;

  const styles = getThemeStyles(currentTheme);

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      try {
        setCurrentTime(getCurrentTime(timezone));
      } catch (error) {
        console.warn('Error updating clock time:', error);
        setCurrentTime(new Date());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  const handleSettingsChange = useCallback((key: keyof ClockSettings, value: unknown) => {
    try {
      const newSettings = {
        ...settings,
        [key]: value,
      };
      onSettingsChange?.(newSettings);
    } catch (error) {
      console.warn('Error updating clock settings:', error);
    }
  }, [settings, onSettingsChange]);

  const toggleCalendar = useCallback(() => {
    setShowCalendar(prev => !prev);
    setShowSettings(false);
  }, []);

  const toggleSettings = useCallback(() => {
    setShowSettings(prev => !prev);
    setShowCalendar(false);
  }, []);

  // Calculate clock hands angles
  const hours = currentTime.getHours() % 12;
  const minute = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const hourAngle = (hours * 30) + (minute * 0.5);
  const minuteAngle = minute * 6;
  const secondAngle = seconds * 6;

  // Format time for display
  const formatTime = (date: Date): string => {
    try {
      return date.toLocaleTimeString('en-US', {
        hour12: !use24Hour,
        hour: '2-digit',
        minute: '2-digit',
        ...(showSeconds && { second: '2-digit' }),
      });
    } catch (error) {
      console.warn('Error formatting time:', error);
      return '00:00';
    }
  };

  const formatDate = (date: Date): string => {
    try {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.warn('Error formatting date:', error);
      return '';
    }
  };

  return (
    <BaseWidget
      widget={widget}
      onClose={onClose}
      title="Clock"
      className={props.className}
    >
      <div className="flex flex-col items-center justify-center h-full relative">
        {/* Clock Face */}
        <div className="relative mb-4">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="drop-shadow-lg"
          >
            {/* Clock face background */}
            <circle
              cx="60"
              cy="60"
              r="58"
              fill={styles.clockFace.fill}
              stroke={styles.clockFace.stroke}
              strokeWidth={styles.clockFace.strokeWidth}
            />

            {/* Hour markers with safety checks */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = i * 30;
              const isMainHour = i % 3 === 0;
              const angleRad = (angle * Math.PI) / 180;

              const sin = Math.sin(angleRad);
              const cos = Math.cos(angleRad);

              if (Number.isNaN(sin) || Number.isNaN(cos)) {
                return null;
              }

              const x1 = 60 + sin * (isMainHour ? 45 : 48);
              const y1 = 60 - cos * (isMainHour ? 45 : 48);
              const x2 = 60 + sin * 52;
              const y2 = 60 - cos * 52;

              if (Number.isNaN(x1) || Number.isNaN(y1) || Number.isNaN(x2) || Number.isNaN(y2)) {
                return null;
              }

              return (
                <line
                  key={`hour-marker-${i + 1}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isMainHour ? styles.hourMarkers.mainStroke : styles.hourMarkers.stroke}
                  strokeWidth={isMainHour ? "2" : "1"}
                />
              );
            })}

            {/* Hour hand */}
            <motion.line
              x1="60"
              y1="60"
              x2={Number.isNaN(hourAngle) ? 60 : 60 + Math.sin((hourAngle * Math.PI) / 180) * 25}
              y2={Number.isNaN(hourAngle) ? 60 : 60 - Math.cos((hourAngle * Math.PI) / 180) * 25}
              stroke={styles.hands.hour}
              strokeWidth="3"
              strokeLinecap="round"
              animate={{
                x2: Number.isNaN(hourAngle) ? 60 : 60 + Math.sin((hourAngle * Math.PI) / 180) * 25,
                y2: Number.isNaN(hourAngle) ? 60 : 60 - Math.cos((hourAngle * Math.PI) / 180) * 25,
              }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
            />

            {/* Minute hand */}
            <motion.line
              x1="60"
              y1="60"
              x2={Number.isNaN(minuteAngle) ? 60 : 60 + Math.sin((minuteAngle * Math.PI) / 180) * 35}
              y2={Number.isNaN(minuteAngle) ? 60 : 60 - Math.cos((minuteAngle * Math.PI) / 180) * 35}
              stroke={styles.hands.minute}
              strokeWidth="2"
              strokeLinecap="round"
              animate={{
                x2: Number.isNaN(minuteAngle) ? 60 : 60 + Math.sin((minuteAngle * Math.PI) / 180) * 35,
                y2: Number.isNaN(minuteAngle) ? 60 : 60 - Math.cos((minuteAngle * Math.PI) / 180) * 35,
              }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
            />

            {/* Second hand */}
            {showSeconds && (
              <motion.line
                x1="60"
                y1="60"
                x2={Number.isNaN(secondAngle) ? 60 : 60 + Math.sin((secondAngle * Math.PI) / 180) * 40}
                y2={Number.isNaN(secondAngle) ? 60 : 60 - Math.cos((secondAngle * Math.PI) / 180) * 40}
                stroke={styles.hands.second}
                strokeWidth="1"
                strokeLinecap="round"
                animate={{
                  x2: Number.isNaN(secondAngle) ? 60 : 60 + Math.sin((secondAngle * Math.PI) / 180) * 40,
                  y2: Number.isNaN(secondAngle) ? 60 : 60 - Math.cos((secondAngle * Math.PI) / 180) * 40,
                }}
                transition={{ type: "spring", damping: 10, stiffness: 200 }}
              />
            )}

            {/* Center dot */}
            <circle
              cx="60"
              cy="60"
              r="3"
              fill={styles.hands.center}
            />
          </svg>
        </div>

        {/* Digital time */}
        <button
          className={`text-center cursor-pointer ${styles.buttons.hover} rounded-lg p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
          onClick={(e) => { e.stopPropagation(); toggleCalendar(); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              toggleCalendar();
            }
          }}
          aria-label="Toggle calendar display"
        >
          <div className={`text-lg font-mono font-bold ${styles.text.primary}`}>
            {formatTime(currentTime)}
          </div>
          {showDate && (
            <div className={`text-sm ${styles.text.secondary}`}>
              {formatDate(currentTime)}
            </div>
          )}
        </button>

        {/* Timezone */}
        <div className={`text-xs ${styles.text.muted} mt-1`}>
          {formatTimezone(timezone)}
        </div>

        {/* Settings button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleSettings(); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              toggleSettings();
            }
          }}
          className={`absolute top-0 right-0 p-1 ${styles.buttons.settings} transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
          aria-label="Clock settings"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,13.12C4.53,12.8 4.5,12.4 4.5,12C4.5,11.6 4.53,11.2 4.57,10.88L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,10.88C19.47,11.2 19.5,11.6 19.5,12C19.5,12.4 19.47,12.8 19.43,13.12L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z" />
          </svg>
        </button>

        {/* Calendar Popup */}
        <AnimatePresence>
          {showCalendar && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className={`absolute z-[1000] ${styles.popups.background} rounded-lg ${styles.popups.shadow} border ${styles.popups.border} p-4`}
              style={{
                top: '10%',
                left: '10%',
                transform: 'translate(-50%, -50%)',
                position: 'absolute',
                margin: '0',
              }}
            >
              <div className="text-center">
                <div className={`text-lg font-bold ${styles.text.primary} mb-2`}>
                  {currentTime.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
                <div className={`text-sm ${styles.text.secondary}`}>
                  Today is {formatDate(currentTime)}
                </div>
                <div className={`text-xs ${styles.text.muted} mt-2`}>
                  Watch out for updates to this site
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Popup */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className={`absolute z-[1000] ${styles.popups.background} rounded-lg ${styles.popups.shadow} border ${styles.popups.border} p-4 min-w-48`}
              style={{
                top: '10%',
                left: '13%',
                transform: 'translate(-50%, -50%)',
                position: 'absolute',
                margin: '0',
              }}
            >
              <div className="space-y-3">
                {/* Timezone Selector */}
                <div>
                  <label
                    htmlFor="timezone-select"
                    className={`block text-xs font-medium ${styles.popups.label} mb-1`}
                  >
                    Timezone
                  </label>
                  <select
                    id="timezone-select"
                    value={timezone}
                    onChange={(e) => handleSettingsChange('timezone', e.target.value)}
                    className={`w-full text-xs border rounded px-2 py-1 ${styles.popups.input}`}
                  >
                    {TIMEZONE_OPTIONS.map((tz) => (
                      <option key={tz.value} value={tz.value} className={styles.popups.option}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Toggle Options */}
                <div className="space-y-2">
                  <label className="flex items-center text-xs">
                    <input
                      type="checkbox"
                      checked={showSeconds}
                      onChange={(e) => handleSettingsChange('showSeconds', e.target.checked)}
                      className="mr-2"
                      id="show-seconds"
                    />
                    <span className={styles.popups.label}>Show seconds</span>
                  </label>

                  <label className="flex items-center text-xs">
                    <input
                      type="checkbox"
                      checked={use24Hour}
                      onChange={(e) => handleSettingsChange('use24Hour', e.target.checked)}
                      className="mr-2"
                      id="use-24hour"
                    />
                    <span className={styles.popups.label}>24-hour format</span>
                  </label>

                  <label className="flex items-center text-xs">
                    <input
                      type="checkbox"
                      checked={showDate}
                      onChange={(e) => handleSettingsChange('showDate', e.target.checked)}
                      className="mr-2"
                      id="show-date"
                    />
                    <span className={styles.popups.label}>Show date</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BaseWidget>
  );
}
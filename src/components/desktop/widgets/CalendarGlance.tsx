import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BaseWidget from './BaseWidget';
import { BaseWidgetProps } from '@/types/widget';
import { CalendarSettings, CalendarEvent, CalendarEventType } from '@/types/calendar';
import {
  formatDateForDisplay,
  getCalendarDays,
  isToday,
  isSameDay,
  getPortfolioEvents,
  getRandomFunFact
} from '@/utils/calendarUtils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Star, Code, Award } from 'lucide-react';
import { useDesktopStore } from '@/store/desktopStore';

interface CalendarGlanceProps extends BaseWidgetProps {
  readonly widget: BaseWidgetProps['widget'];
}

const getThemeStyles = (currentTheme: string) => {
  const isDark = currentTheme === 'dark';

  const darkTheme = {
    background: 'from-gray-900 via-gray-800 to-gray-700',
    widget: {
      background: 'bg-gray-800/95',
      border: 'border-gray-700/20',
    },
    text: {
      primary: 'text-white',
      secondary: 'text-gray-300',
      muted: 'text-gray-400',
      inactive: 'text-gray-600',
      accent: 'text-blue-400',
    },
    button: {
      base: 'hover:bg-gray-700/50',
      navigation: 'hover:bg-white/10',
    },
    calendar: {
      dayHeader: 'text-gray-400',
      currentMonth: 'text-white',
      otherMonth: 'text-gray-600',
      today: 'bg-blue-500/30 border-blue-400/50',
      dayHover: 'hover:bg-white/10',
      dayHoverWithEvents: 'hover:bg-white/20',
    },
    eventIndicator: {
      primary: 'bg-blue-400',
      secondary: 'bg-yellow-400',
    },
    popup: {
      background: 'bg-gray-800/95',
      border: 'border-gray-700/50',
      closeButton: 'text-gray-400 hover:text-white',
      todayText: 'text-blue-300',
      funFact: 'text-gray-300',
    },
    eventCategories: {
      project: 'bg-blue-500/20 text-blue-300',
      milestone: 'bg-purple-500/20 text-purple-300',
      skill: 'bg-green-500/20 text-green-300',
      personal: 'bg-gray-500/20 text-gray-300',
    },
  };

  const lightTheme = {
    background: 'from-indigo-50 via-white to-purple-50',
    widget: {
      background: 'bg-white/95',
      border: 'border-white/20',
    },
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-700',
      muted: 'text-gray-500',
      inactive: 'text-gray-400',
      accent: 'text-blue-600',
    },
    button: {
      base: 'hover:bg-gray-100/50',
      navigation: 'hover:bg-gray-100',
    },
    calendar: {
      dayHeader: 'text-gray-500',
      currentMonth: 'text-gray-900',
      otherMonth: 'text-gray-400',
      today: 'bg-blue-100/80 border-blue-300/70',
      dayHover: 'hover:bg-gray-100/80',
      dayHoverWithEvents: 'hover:bg-blue-50',
    },
    eventIndicator: {
      primary: 'bg-blue-500',
      secondary: 'bg-yellow-500',
    },
    popup: {
      background: 'bg-white/95',
      border: 'border-gray-200/50',
      closeButton: 'text-gray-500 hover:text-gray-900',
      todayText: 'text-blue-600',
      funFact: 'text-gray-600',
    },
    eventCategories: {
      project: 'bg-blue-100 text-blue-700',
      milestone: 'bg-purple-100 text-purple-700',
      skill: 'bg-green-100 text-green-700',
      personal: 'bg-gray-100 text-gray-700',
    },
  };

  return isDark ? darkTheme : lightTheme;
};

export default function CalendarGlance({
  widget,
  onClose,
}: CalendarGlanceProps) {
  const { currentTheme } = useDesktopStore();
  const styles = getThemeStyles(currentTheme);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [portfolioEvents] = useState(getPortfolioEvents());

  // Get calendar settings with defaults
  const settings: CalendarSettings = {
    showWeekNumbers: false,
    startWeek: 'sunday',
    highlightToday: true,
    showEvents: true,
    eventCategories: ['project', 'milestone', 'skill', 'personal'],
    theme: 'auto',
    animation: 'smooth',
    ...widget.settings,
  };

  const calendarDays = useMemo(() => getCalendarDays(currentDate), [currentDate]);

  // Get events for a specific date
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return portfolioEvents.filter(
      (event) =>
        isSameDay(event.date, date) &&
        settings.eventCategories.includes(event.type)
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
    setSelectedDate(null);
    setShowEventPopup(false);
  };

  const handleDateClick = (date: Date) => {
    const events = getEventsForDate(date);
    if (events.length > 0 || isToday(date)) {
      setSelectedDate(date);
      setShowEventPopup(true);
    }
  };

  const getEventIcon = (type: CalendarEventType) => {
    switch (type) {
      case 'project': return <Code className="w-3 h-3" />;
      case 'milestone': return <Award className="w-3 h-3" />;
      case 'skill': return <Star className="w-3 h-3" />;
      default: return <CalendarIcon className="w-3 h-3" />;
    }
  };

  const getEventColor = (type: CalendarEventType) => {
    return styles.eventCategories[type as keyof typeof styles.eventCategories] || styles.eventCategories.personal;
  };

  const renderEventPopup = () => {
    if (!selectedDate || !showEventPopup) return null;

    const events = getEventsForDate(selectedDate);
    const funFact = getRandomFunFact();

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50"
      >
        <div className={`${styles.popup.background} backdrop-blur-md border ${styles.popup.border} rounded-lg p-3 min-w-64 max-w-80 shadow-xl`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className={`text-sm font-medium ${styles.text.primary}`}>
              {formatDateForDisplay(selectedDate)}
            </h4>
            <button
              onClick={() => setShowEventPopup(false)}
              className={`${styles.popup.closeButton} transition-colors text-lg leading-none`}
            >
              ×
            </button>
          </div>

          {(() => {
            if (events.length > 0) {
              return (
                <div className="space-y-2">
                  {events.map((event, index) => (
                    <motion.div
                      key={`${event.id}-${index}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-2 rounded ${getEventColor(event.type)} flex items-center gap-2`}
                    >
                      {getEventIcon(event.type)}
                      <div>
                        <div className="text-xs font-medium">{event.title}</div>
                        {event.description && (
                          <div className="text-xs opacity-80 mt-1">
                            {event.description}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              );
            }

            if (isToday(selectedDate)) {
              return (
                <div className="text-center py-2">
                  <div className={`text-sm ${styles.popup.todayText} mb-1`}>Today</div>
                  <div className={`text-xs ${styles.popup.funFact}`}>{funFact}</div>
                </div>
              );
            }

            return (
              <div className="text-center py-2">
                <div className={`text-xs ${styles.text.muted}`}>{funFact}</div>
              </div>
            );
          })()}
        </div>
      </motion.div>
    );
  };

  return (
    <BaseWidget
      widget={widget}
      onClose={onClose}
      title="Calendar"
      className="calendar-glance-widget"
    >
      <div className="flex flex-col h-full p-3">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigateMonth('prev')}
            className={`p-1 rounded ${styles.button.navigation} transition-colors`}
          >
            <ChevronLeft className={`w-4 h-4 ${styles.text.secondary}`} />
          </button>

          <h3 className={`text-sm font-medium ${styles.text.primary}`}>
            {currentDate.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric'
            })}
          </h3>

          <button
            onClick={() => navigateMonth('next')}
            className={`p-1 rounded ${styles.button.navigation} transition-colors`}
          >
            <ChevronRight className={`w-4 h-4 ${styles.text.secondary}`} />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className={`text-xs ${styles.calendar.dayHeader} text-center font-medium`}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 flex-1">
            {calendarDays.map((date, index) => {
              const events = settings.showEvents ? getEventsForDate(date) : [];
              const hasEvents = events.length > 0;
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              const isTodayDate = settings.highlightToday && isToday(date);
              const canInteract = isCurrentMonth || hasEvents || isTodayDate;

              return (
                <motion.button
                  key={`${date.toISOString()}-${index}`}
                  onClick={() => handleDateClick(date)}
                  className={`
                    aspect-square text-xs flex items-center justify-center rounded relative
                    transition-all duration-200 hover:scale-105
                    ${isCurrentMonth ? styles.calendar.currentMonth : styles.calendar.otherMonth}
                    ${isTodayDate ? styles.calendar.today : ''}
                    ${hasEvents ? styles.calendar.dayHoverWithEvents : styles.calendar.dayHover}
                    ${canInteract ? 'cursor-pointer' : 'cursor-default'}
                  `}
                  disabled={!canInteract}
                  whileHover={canInteract ? { scale: 1.05 } : {}}
                  whileTap={canInteract ? { scale: 0.95 } : {}}
                >
                  {date.getDate()}

                  {/* Event indicator */}
                  {hasEvents && settings.showEvents && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`absolute bottom-0.5 right-0.5 w-1.5 h-1.5 ${styles.eventIndicator.primary} rounded-full`}
                    />
                  )}

                  {/* Multiple events indicator */}
                  {events.length > 1 && settings.showEvents && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className={`absolute bottom-0.5 left-0.5 w-1 h-1 ${styles.eventIndicator.secondary} rounded-full`}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Event popup */}
        <AnimatePresence>
          {renderEventPopup()}
        </AnimatePresence>
      </div>
    </BaseWidget>
  );
}
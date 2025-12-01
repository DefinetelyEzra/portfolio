'use client';

import { motion } from 'framer-motion';
import {
  Grid3X3,
  Eye,
  EyeOff,
  LayoutGrid,
} from 'lucide-react';
import { useWidgetStore } from '@/store/widgetStore';
import { useDesktopStore } from '@/store/desktopStore';
import { getDefaultWidgetPosition } from '@/utils/widgetHelpers';

const getThemeStyles = (currentTheme: string) => {
  const isDark = currentTheme === 'dark';

  const darkTheme = {
    background: 'from-gray-900 via-gray-800 to-gray-700',
    text: {
      primary: 'text-gray-100',
      secondary: 'text-gray-300',
      muted: 'text-gray-400',
      accent: 'text-blue-400',
    },
    card: {
      background: 'bg-gray-800',
      border: 'border-gray-700',
    },
    input: {
      background: 'bg-gray-700',
      border: 'border-gray-600',
      text: 'text-gray-100',
      focus: 'focus:ring-blue-500 focus:border-transparent',
    },
    button: {
      primary: {
        background: 'bg-blue-500 hover:bg-blue-600',
        text: 'text-white',
      },
      secondary: {
        background: 'bg-gray-700 hover:bg-gray-600',
        text: 'text-gray-100',
      },
      success: {
        background: 'bg-green-800 text-green-200 hover:bg-green-700',
      },
      danger: {
        background: 'bg-red-800 text-red-200 hover:bg-red-700',
      },
      info: {
        background: 'bg-blue-800 text-blue-200 hover:bg-blue-700',
      },
    },
    widget: {
      active: {
        background: 'bg-gray-800',
        border: 'border-gray-600',
      },
      inactive: {
        background: 'bg-gray-900',
        border: 'border-gray-700',
      },
    },
    status: {
      active: 'bg-green-500',
      inactive: 'bg-gray-600',
    },
    addWidget: {
      active: {
        background: 'bg-gray-900',
        border: 'border-gray-700',
        text: 'text-gray-500',
      },
      inactive: {
        background: 'hover:bg-blue-900',
        border: 'border-gray-600 hover:border-blue-500',
        text: 'text-gray-200 hover:text-blue-300',
      },
    },
    infoPanel: {
      background: 'bg-blue-900/50',
      border: 'border-blue-700',
      icon: 'text-blue-400',
      title: 'text-blue-200',
      text: 'text-blue-300',
    },
  };

  const lightTheme = {
    background: 'from-gray-50 to-white',
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      muted: 'text-gray-500',
      accent: 'text-blue-600',
    },
    card: {
      background: 'bg-white',
      border: 'border-gray-200',
    },
    input: {
      background: 'bg-white',
      border: 'border-gray-300',
      text: 'text-gray-900',
      focus: 'focus:ring-blue-500 focus:border-transparent',
    },
    button: {
      primary: {
        background: 'bg-blue-500 hover:bg-blue-600',
        text: 'text-white',
      },
      secondary: {
        background: 'bg-gray-200 hover:bg-gray-300',
        text: 'text-gray-700',
      },
      success: {
        background: 'bg-green-100 text-green-600 hover:bg-green-200',
      },
      danger: {
        background: 'bg-red-100 text-red-600 hover:bg-red-200',
      },
      info: {
        background: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
      },
    },
    widget: {
      active: {
        background: 'bg-white',
        border: 'border-gray-200',
      },
      inactive: {
        background: 'bg-gray-50',
        border: 'border-gray-100',
      },
    },
    status: {
      active: 'bg-green-500',
      inactive: 'bg-gray-400',
    },
    addWidget: {
      active: {
        background: 'bg-gray-50',
        border: 'border-gray-200',
        text: 'text-gray-400',
      },
      inactive: {
        background: 'hover:bg-blue-50',
        border: 'border-gray-300 hover:border-blue-400',
        text: 'text-gray-700 hover:text-blue-700',
      },
    },
    infoPanel: {
      background: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-900',
      text: 'text-blue-800',
    },
  };

  return isDark ? darkTheme : lightTheme;
};

export default function WidgetSettings() {
  const {
    widgets,
    updateWidget,
    addWidget,
    removeWidget,
  } = useWidgetStore();

  const { currentTheme } = useDesktopStore();

  const styles = getThemeStyles(currentTheme);

  const handleToggleVisibility = (widgetId: string) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (widget) {
      updateWidget(widgetId, { isVisible: !widget.isVisible });
    }
  };

  const getWidgetDisplayName = (type: string): string => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const availableWidgetTypes = [
    'analog-clock',
    'calendar-glance',
    'search-spotlight',
    'skill-meter',
    'quote-generator'
  ];

  return (
    <div className={`h-full bg-linear-to-br ${styles.background} p-6 overflow-y-auto`}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${styles.text.primary} flex items-center`}>
              <LayoutGrid className="w-6 h-6 mr-3" />
              Widget Management
            </h2>
          </div>
        </div>

        {/* Active Widgets */}
        <motion.div
          className={`${styles.card.background} rounded-xl border ${styles.card.border} p-6`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className={`text-lg font-semibold ${styles.text.primary} mb-4 flex items-center`}>
            <Grid3X3 className="w-5 h-5 mr-2" />
            Active Widgets ({widgets.filter(w => w.isVisible).length})
          </h3>

          <div className="space-y-4">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${widget.isVisible
                  ? `${styles.widget.active.border} ${styles.widget.active.background}`
                  : `${styles.widget.inactive.border} ${styles.widget.inactive.background}`
                  }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${widget.isVisible ? styles.status.active : styles.status.inactive
                    }`} />

                  <div>
                    <div className={`font-medium ${styles.text.primary}`}>
                      {getWidgetDisplayName(widget.type)}
                    </div>
                    <div className={`text-sm ${styles.text.muted}`}>
                      Size: {widget.size.width}×{widget.size.height} • Fixed Position: ({widget.position.x}, {widget.position.y})
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Visibility Toggle */}
                  <button
                    onClick={() => handleToggleVisibility(widget.id)}
                    className={`p-2 rounded-lg transition-colors ${widget.isVisible
                      ? styles.button.success.background
                      : styles.button.secondary.background
                      }`}
                    title={widget.isVisible ? 'Hide widget' : 'Show widget'}
                  >
                    {widget.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Remove Widget */}
                  <button
                    onClick={() => removeWidget(widget.id)}
                    className={`p-2 rounded-lg ${styles.button.danger.background} transition-colors`}
                    title="Remove widget"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {widgets.length === 0 && (
              <div className={`text-center py-8 ${styles.text.muted}`}>
                <Grid3X3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No widgets available</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Add New Widgets */}
        <motion.div
          className={`${styles.card.background} rounded-xl border ${styles.card.border} p-6`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className={`text-lg font-semibold ${styles.text.primary} mb-4 flex items-center`}>
            <LayoutGrid className="w-5 h-5 mr-2" />
            Add Widget
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableWidgetTypes.map((type) => {
              const isActive = widgets.some(w => w.type === type && w.isVisible);
              const position = getDefaultWidgetPosition(type);

              return (
                <button
                  key={type}
                  onClick={() => {
                    if (!isActive) {
                      addWidget(type);
                    }
                  }}
                  disabled={isActive}
                  className={`p-4 rounded-lg border-2 border-dashed transition-all text-left ${isActive
                    ? `${styles.addWidget.active.border} ${styles.addWidget.active.background} ${styles.addWidget.active.text} cursor-not-allowed`
                    : `${styles.addWidget.inactive.border} ${styles.addWidget.inactive.background} ${styles.addWidget.inactive.text}`
                    }`}
                >
                  <div className="font-medium">
                    {getWidgetDisplayName(type)}
                  </div>
                  <div className="text-sm opacity-75 mt-1">
                    {isActive ? 'Already active' : `Will appear at (${position.x}, ${position.y})`}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Widget Position Info */}
        <motion.div
          className={`${styles.infoPanel.background} rounded-xl border ${styles.infoPanel.border} p-6`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-start space-x-3">
            <div className={`w-5 h-5 ${styles.infoPanel.icon} mt-0.5`}>
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div>
              <h4 className={`font-medium ${styles.infoPanel.title} mb-2`}>Fixed Position Layout</h4>
              <ul className={`text-sm ${styles.infoPanel.text} space-y-1`}>
                <li>• Widgets automatically return to their designated positions when added</li>
                <li>• Positions adjust responsively when window is resized</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
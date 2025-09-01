import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WidgetState } from '@/types/widget';
import { useDesktopStore } from '@/store/desktopStore';

export interface BaseWidgetProps {
  readonly widget: WidgetState;
  readonly children: React.ReactNode;
  readonly title: string;
  readonly className?: string;
  readonly onClose: () => void;
}

export default function BaseWidget({
  widget,
  children,
  title,
  className = '',
  onClose,
}: BaseWidgetProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const { currentTheme } = useDesktopStore();

  const handleClose = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {(widget.isVisible !== false) && (
        <motion.div
          ref={dialogRef}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 300,
            duration: 0.3,
          }}
          className={`
            absolute backdrop-blur-xl rounded-2xl shadow-2xl border select-none
            bg-[var(--widget-bg)] border-[var(--widget-border)]
            ${className}
            transition-all duration-200 ease-out
          `}
          style={{
            left: widget.position.x,
            top: widget.position.y,
            width: widget.size.width,
            minHeight: widget.size.height,
            zIndex: widget.type === 'search-spotlight' && widget.isVisible ? 10000 : (widget.zIndex || 0),
            pointerEvents: 'auto',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          }}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          {/* Widget Header */}
          <div
            className={`
              flex items-center justify-between w-full p-3
              ${currentTheme === 'dark'
                ? 'bg-gradient-to-r from-gray-800/5 to-transparent border-b border-gray-700/20'
                : 'bg-gradient-to-r from-white/5 to-transparent border-b border-white/10'
              }
            `}
          >
            <h3
              id={`widget-title-${widget.id}`}
              className="text-sm font-medium truncate text-[var(--foreground)]"
            >
              {title}
            </h3>
            <div className="flex items-center gap-2">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="
                  w-5 h-5 rounded-full bg-red-500/80 hover:bg-red-500
                  text-white transition-colors duration-200
                  flex items-center justify-center
                  focus:outline-none focus:ring-2 focus:ring-red-500/50
                "
                aria-label="Close widget"
                title="Close widget"
              >
                <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Widget Content */}
          <div className="p-4 flex flex-col h-full">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
import React, { useRef, useMemo } from 'react';
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

  // Responsive size adjustments based on screen size
  const responsiveStyles = useMemo(() => {
    if (globalThis.window === undefined) {
      return {};
    }

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Calculate responsive scaling
    let scaleFactor = 1;
    let responsiveWidth = widget.size.width;
    let responsiveHeight = widget.size.height;

    // Scale down on smaller screens
    if (screenWidth < 480) { // xs
      scaleFactor = 0.85;
      responsiveWidth = Math.min(widget.size.width, screenWidth - 20);
      responsiveHeight = Math.min(widget.size.height, screenHeight - 40);
    } else if (screenWidth < 640) { // sm
      scaleFactor = 0.9;
      responsiveWidth = Math.min(widget.size.width, screenWidth - 40);
      responsiveHeight = Math.min(widget.size.height, screenHeight - 60);
    } else if (screenWidth < 768) { // md
      scaleFactor = 0.95;
      responsiveWidth = Math.min(widget.size.width, screenWidth - 60);
    }

    // Ensure minimum sizes
    responsiveWidth = Math.max(responsiveWidth, widget.constraints?.minWidth || 200);
    responsiveHeight = Math.max(responsiveHeight, widget.constraints?.minHeight || 150);

    return {
      width: responsiveWidth,
      height: responsiveHeight,
      transform: `scale(${scaleFactor})`,
      transformOrigin: 'top left',
    };
  }, [widget.size, widget.constraints]);

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
            width: responsiveStyles.width || widget.size.width,
            minHeight: responsiveStyles.height || widget.size.height,
            transform: responsiveStyles.transform,
            transformOrigin: responsiveStyles.transformOrigin,
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
          <div className={`p-4 flex flex-col h-full ${widget.type === 'search-spotlight' ? 'overflow-visible' : 'overflow-hidden'}`}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
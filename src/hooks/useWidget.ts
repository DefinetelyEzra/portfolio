import { useState, useEffect, useCallback } from 'react';

export function useWidgetAnimation(isVisible: boolean) {
  const [shouldRender, setShouldRender] = useState(isVisible);

  const showWidget = useCallback(() => {
    setShouldRender(true);
  }, []);

  const hideWidget = useCallback(() => {
    const timer = setTimeout(() => setShouldRender(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible) {
      showWidget();
    }
  }, [isVisible, showWidget]);

  useEffect(() => {
    if (!isVisible) {
      return hideWidget();
    }
  }, [isVisible, hideWidget]);

  return shouldRender;
}
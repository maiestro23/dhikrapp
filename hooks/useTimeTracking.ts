import { useState, useEffect, useRef } from 'react';
import { useProgressStore } from '../stores/progressStore';

export function useTimeTracking() {
  const [isActive, setIsActive] = useState(false);
  const startTime = useRef<number | null>(null);
  const { addTimeSpent } = useProgressStore();

  const start = () => {
    if (!isActive) {
      setIsActive(true);
      startTime.current = Date.now();
    }
  };

  const stop = () => {
    if (isActive && startTime.current) {
      const endTime = Date.now();
      const duration = Math.floor((endTime - startTime.current) / 1000); // Convert to seconds
      addTimeSpent(duration);
      setIsActive(false);
      startTime.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isActive && startTime.current) {
        stop();
      }
    };
  }, [isActive]);

  return {
    isActive,
    start,
    stop,
  };
}
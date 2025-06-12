import { useEffect, useState, useRef } from 'react';

interface UseCounterOptions {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export const useCounter = (
  options: UseCounterOptions,
  shouldStart: boolean = false
) => {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | null>(null);
  const { target, duration = 2000, prefix = '', suffix = '' } = options;

  useEffect(() => {
    if (!shouldStart) {
      // Before starting, ensure the display is at 0, not the final target.
      setCount(0);
      return;
    }

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      // Using an easing function for a smooth acceleration and deceleration effect
      const easedProgress = 1 - Math.pow(1 - progress, 4);
      const currentVal = Math.floor(easedProgress * target);

      setCount(currentVal);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        // Ensure it always ends on the exact target number
        setCount(target);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [shouldStart, target, duration]);

  return `${prefix}${count.toLocaleString()}${suffix}`;
};
import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export function AnimatedCounter({
  value,
  duration = 750,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isUpdating, setIsUpdating] = useState(false);
  const [trend, setTrend] = useState<'up' | 'down' | null>(null);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current === value) return;
    const start = prevValueRef.current;
    const end = value;
    setTrend(end > start ? 'up' : 'down');
    setIsUpdating(true);
    prevValueRef.current = value;

    const startTime = performance.now();

    const updateCounter = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * ease;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(end);
        setTimeout(() => {
          setIsUpdating(false);
          setTrend(null);
        }, 500);
      }
    };

    const frame = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  const formatted = decimals > 0 
    ? displayValue.toFixed(decimals) 
    : Math.round(displayValue).toString();

  return (
    <span
      className={`inline-block transition-all duration-300 font-inherit ${
        isUpdating
          ? trend === 'up'
            ? 'text-emerald-600 scale-[1.04]'
            : 'text-amber-600 scale-[0.97]'
          : ''
      } ${className}`}
    >
      {prefix}{formatted}{suffix}
    </span>
  );
}

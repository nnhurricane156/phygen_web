"use client";

import { useEffect } from 'react';

interface PerformanceMonitorProps {
  enabled?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  enabled = process.env.NODE_ENV === 'development' 
}) => {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const { name, value } = entry as any;
        
        // Log performance metrics in development
        console.group(`🚀 Performance: ${name}`);
        console.log(`Value: ${Math.round(value)}ms`);
        console.log(`Rating: ${getRating(name, value)}`);
        console.groupEnd();
      }
    });

    // Observe Web Vitals
    observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });

    return () => observer.disconnect();
  }, [enabled]);

  return null;
};

function getRating(metric: string, value: number): string {
  const thresholds: Record<string, { good: number; poor: number }> = {
    'first-contentful-paint': { good: 1800, poor: 3000 },
    'largest-contentful-paint': { good: 2500, poor: 4000 },
    'first-input-delay': { good: 100, poor: 300 },
    'cumulative-layout-shift': { good: 0.1, poor: 0.25 },
  };

  const threshold = thresholds[metric];
  if (!threshold) return 'unknown';

  if (value <= threshold.good) return '✅ Good';
  if (value <= threshold.poor) return '⚠️ Needs Improvement';
  return '❌ Poor';
}

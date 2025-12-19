
import React from 'react';

interface GaugeProps {
  score: number;
  label: string;
  size?: number;
}

const Gauge: React.FC<GaugeProps> = ({ score, label, size = 120 }) => {
  const radius = size / 2.5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  const getColor = (s: number) => {
    if (s >= 80) return '#10b981'; // green-500
    if (s >= 50) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            className="text-slate-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke={getColor(score)}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-slate-800">
          {Math.round(score)}%
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
  );
};

export default Gauge;

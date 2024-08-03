import React from 'react';

export const RatingCircle = ({ score, size = 100, strokeWidth = 4 }) => {
  const normalizedScore = Math.min(100, Math.max(0, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const getColor = (score) => {
    if (score <= 25) return '#FF0000';
    if (score <= 50) return '#FFA500';
    if (score <= 75) return '#FFFF00';
    return '#18c918';
  };

  return (
    <div style={{ width: size, height: size, position: 'relative' }} className='text-color_text'>
      <svg width={size} height={size}>
        <circle
          stroke="#e0e0e0"
          fill="none"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={getColor(normalizedScore)}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%'
          }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: `${size / 2.5}px`,
          fontWeight: 'bold',
        }}
      >
        {normalizedScore}
      </div>
    </div>
  );
};
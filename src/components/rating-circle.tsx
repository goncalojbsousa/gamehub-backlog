import React, { useEffect, useState } from 'react';

interface RatingCircleProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

export const RatingCircle: React.FC<RatingCircleProps> = ({ 
  score, 
  size = 100, 
  strokeWidth = 4, 
  showPercentage = false,
  animated = true,
  className = ''
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const normalizedScore = Math.min(100, Math.max(0, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Animação do score
  useEffect(() => {
    if (animated) {
      const duration = 1000; // 1 segundo
      const steps = 60;
      const increment = normalizedScore / steps;
      let currentScore = 0;
      
      const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= normalizedScore) {
          currentScore = normalizedScore;
          clearInterval(timer);
        }
        setAnimatedScore(Math.round(currentScore));
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setAnimatedScore(normalizedScore);
    }
  }, [normalizedScore, animated]);

  const getColor = (score: number) => {
    if (score >= 90) return '#10B981'; // Verde esmeralda para excelente
    if (score >= 80) return '#3B82F6'; // Azul para muito bom
    if (score >= 70) return '#F59E0B'; // Amarelo para bom
    if (score >= 60) return '#F97316'; // Laranja para regular
    return '#EF4444'; // Vermelho para ruim
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excelente';
    if (score >= 80) return 'Muito Bom';
    if (score >= 70) return 'Bom';
    if (score >= 60) return 'Regular';
    return 'Ruim';
  };

  const getGradientColors = (score: number) => {
    if (score >= 90) return ['#10B981', '#059669'];
    if (score >= 80) return ['#3B82F6', '#2563EB'];
    if (score >= 70) return ['#F59E0B', '#D97706'];
    if (score >= 60) return ['#F97316', '#EA580C'];
    return ['#EF4444', '#DC2626'];
  };

  const [gradientId] = useState(`gradient-${Math.random().toString(36).substr(2, 9)}`);

  return (
    <div 
      style={{ width: size, height: size, position: 'relative' }} 
      className={`text-color_text transition-all duration-300 hover:scale-105 ${className}`}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          stroke="var(--color_main)"
          fill="none"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="opacity-20"
        />
        
        {/* Progress circle with gradient */}
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={getGradientColors(normalizedScore)[0]} />
            <stop offset="100%" stopColor={getGradientColors(normalizedScore)[1]} />
          </linearGradient>
        </defs>
        
        <circle
          stroke={`url(#${gradientId})`}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          }}
        />
      </svg>
      
      {/* Score display */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
        className="transition-all duration-300"
      >
        <div 
          style={{
            fontSize: `${size / 3}px`,
            fontWeight: 'bold',
            color: getColor(normalizedScore),
            lineHeight: 1,
          }}
          className="transition-all duration-300"
        >
          {animatedScore}
          {showPercentage && '%'}
        </div>
        
        {/* Score label for larger sizes */}
        {size >= 80 && (
          <div 
            style={{
              fontSize: `${size / 8}px`,
              marginTop: '2px',
              opacity: 0.8,
            }}
            className="text-color_text_sec font-medium"
          >
            {getScoreLabel(normalizedScore)}
          </div>
        )}
      </div>
      
      {/* Glow effect */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${getColor(normalizedScore)}20 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
        className="transition-all duration-300"
      />
    </div>
  );
};
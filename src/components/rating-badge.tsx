import React from 'react';

interface RatingBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  score,
  size = 'md',
  showLabel = false,
  className = ''
}) => {
  const normalizedScore = Math.min(100, Math.max(0, score));

  const getColorScheme = (score: number) => {
    if (score >= 90) {
      return {
        bg: 'bg-emerald-500',
        text: 'text-emerald-50',
        border: 'border-emerald-600',
        label: 'Excelente'
      };
    }
    if (score >= 80) {
      return {
        bg: 'bg-blue-500',
        text: 'text-blue-50',
        border: 'border-blue-600',
        label: 'Muito Bom'
      };
    }
    if (score >= 70) {
      return {
        bg: 'bg-amber-500',
        text: 'text-amber-50',
        border: 'border-amber-600',
        label: 'Bom'
      };
    }
    if (score >= 60) {
      return {
        bg: 'bg-orange-500',
        text: 'text-orange-50',
        border: 'border-orange-600',
        label: 'Regular'
      };
    }
    return {
      bg: 'bg-red-500',
      text: 'text-red-50',
      border: 'border-red-600',
      label: 'Ruim'
    };
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-2 py-1 text-xs',
          score: 'text-xs',
          label: 'text-xs'
        };
      case 'lg':
        return {
          container: 'px-4 py-2 text-lg',
          score: 'text-lg',
          label: 'text-sm'
        };
      default:
        return {
          container: 'px-3 py-1.5 text-sm',
          score: 'text-sm',
          label: 'text-xs'
        };
    }
  };

  const colorScheme = getColorScheme(normalizedScore);
  const sizeClasses = getSizeClasses(size);

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div
        className={`
          ${colorScheme.bg} 
          ${colorScheme.text} 
          ${colorScheme.border}
          ${sizeClasses.container}
          font-bold rounded-full border-2
          transition-all duration-300 hover:scale-105
          shadow-sm hover:shadow-md
        `}
      >
        <span className={sizeClasses.score}>
          {normalizedScore}
        </span>
      </div>
      
      {showLabel && (
        <span className={`${sizeClasses.label} text-color_text_sec font-medium`}>
          {colorScheme.label}
        </span>
      )}
    </div>
  );
}; 
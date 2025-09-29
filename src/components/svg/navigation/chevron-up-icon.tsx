interface ChevronUpIconProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const ChevronUpIcon = ({ className = "", width = 24, height = 24 }: ChevronUpIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M18 15L12 9L6 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}; 
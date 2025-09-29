interface ChevronDownIconProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const ChevronDownIcon = ({ className = "", width = 24, height = 24 }: ChevronDownIconProps) => {
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
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}; 
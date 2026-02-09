import React from "react";

export function SquigglyLine({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      width="100"
      height="20"
      viewBox="0 0 100 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M2 10C15 10 15 2 28 2C41 2 41 18 54 18C67 18 67 10 80 10C93 10 93 2 106 2"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

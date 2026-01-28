import React from "react";

interface SectionTitleProps {
  number: string;
  title: string;
  className?: string;
}

export function SectionTitle({ number, title, className = "" }: SectionTitleProps) {
  return (
    <div className={`flex items-baseline space-x-4 ${className}`}>
      <span className="font-outfit text-6xl md:text-7xl font-bold text-brand-green/80">{number}</span>
      <h2 className="font-outfit text-3xl md:text-4xl font-bold uppercase tracking-wider text-foreground">
        {title}
      </h2>
    </div>
  );
}

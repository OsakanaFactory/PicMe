import React from "react";

interface SectionTitleProps {
  number: string;
  title: string;
  className?: string;
}

export function SectionTitle({ number, title, className = "" }: SectionTitleProps) {
  return (
    <div className={`flex items-baseline space-x-2 ${className}`}>
      <span className="font-outfit text-4xl font-bold text-accent">{number}</span>
      <h2 className="font-outfit text-2xl font-bold uppercase tracking-wider text-foreground">
        {title}
      </h2>
    </div>
  );
}

import React from "react";

interface SkillBarProps {
  name: string;
  icon?: React.ReactNode;
  level: number; // 1-5
  maxLevel?: number;
}

export function SkillBar({ name, icon, level, maxLevel = 5 }: SkillBarProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center space-x-3">
        {icon && <span className="text-slate-500 text-2xl">{icon}</span>}
        <span className="font-bold text-base tracking-wide">{name}</span>
      </div>
      <div className="flex space-x-1.5">
        {Array.from({ length: maxLevel }).map((_, i) => (
          <div
            key={i}
            className={`h-4 w-4 rounded-full transition-all ${
              i < level
                ? "bg-brand-green shadow-[0_0_8px_rgba(217,249,157,0.6)]"
                : "bg-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

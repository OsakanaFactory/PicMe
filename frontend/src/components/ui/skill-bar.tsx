import React from "react";

interface SkillBarProps {
  name: string;
  icon?: React.ReactNode;
  level: number; // 1-5
  maxLevel?: number;
}

export function SkillBar({ name, icon, level, maxLevel = 5 }: SkillBarProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center space-x-2">
        {icon && <span className="text-slate-500">{icon}</span>}
        <span className="font-medium text-sm">{name}</span>
      </div>
      <div className="flex space-x-1">
        {Array.from({ length: maxLevel }).map((_, i) => (
          <div
            key={i}
            className={`h-3 w-3 rounded-full ${
              i < level ? "bg-brand-green" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

import React from 'react';

interface MasonryGridProps {
  children: React.ReactNode[];
  columns?: number;
  gap?: number;
  className?: string;
}

export const MasonryGrid = ({
  children,
  columns = 3,
  gap = 16,
  className = '',
}: MasonryGridProps) => {
  const columnWrapper: Record<string, React.ReactNode[]> = {};
  const result: React.ReactNode[] = [];

  for (let i = 0; i < columns; i++) {
    columnWrapper[`column${i}`] = [];
  }

  for (let i = 0; i < children.length; i++) {
    const columnIndex = i % columns;
    columnWrapper[`column${columnIndex}`].push(
      <div key={i} style={{ marginBottom: `${gap}px` }}>
        {children[i]}
      </div>
    );
  }

  for (let i = 0; i < columns; i++) {
    result.push(
      <div
        key={i}
        style={{
          marginLeft: `${i > 0 ? gap : 0}px`,
          flex: 1,
        }}
      >
        {columnWrapper[`column${i}`]}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex' }} className={className}>
      {result}
    </div>
  );
};

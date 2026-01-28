'use client';

import React, { useState, useEffect } from 'react';

interface MasonryGridProps {
  children: React.ReactNode[];
  columns?: number;
  mobileColumns?: number;
  gap?: number;
  className?: string;
}

export const MasonryGrid = ({
  children,
  columns = 2,
  mobileColumns = 1,
  gap = 24,
  className = '',
}: MasonryGridProps) => {
  const [currentColumns, setCurrentColumns] = useState(columns);

  useEffect(() => {
    const handleResize = () => {
      // md breakpoint = 768px
      setCurrentColumns(window.innerWidth < 768 ? mobileColumns : columns);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [columns, mobileColumns]);

  const columnWrapper: Record<string, React.ReactNode[]> = {};
  const result: React.ReactNode[] = [];

  for (let i = 0; i < currentColumns; i++) {
    columnWrapper[`column${i}`] = [];
  }

  for (let i = 0; i < children.length; i++) {
    const columnIndex = i % currentColumns;
    columnWrapper[`column${columnIndex}`].push(
      <div key={i} style={{ marginBottom: `${gap}px` }}>
        {children[i]}
      </div>
    );
  }

  for (let i = 0; i < currentColumns; i++) {
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

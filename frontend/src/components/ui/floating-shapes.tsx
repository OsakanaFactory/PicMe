'use client';

interface FloatingShape {
  type: 'circle' | 'triangle' | 'square' | 'ring';
  color: string;
  size: number;
  x: string;
  y: string;
  floatDuration: number;
  floatDelay: number;
  rotate?: number;
}

const AUTH_SHAPES: FloatingShape[] = [
  { type: 'circle', color: '#D9F99D', size: 40, x: '8%', y: '15%', floatDuration: 6, floatDelay: 0 },
  { type: 'triangle', color: '#FF8A65', size: 36, x: '85%', y: '12%', floatDuration: 7, floatDelay: 1 },
  { type: 'ring', color: '#D9F99D', size: 48, x: '90%', y: '75%', floatDuration: 6.5, floatDelay: 1.5 },
  { type: 'square', color: '#1A1A1A', size: 28, x: '5%', y: '70%', floatDuration: 5.5, floatDelay: 0.5, rotate: 12 },
  { type: 'circle', color: '#FF8A6580', size: 24, x: '50%', y: '90%', floatDuration: 8, floatDelay: 2 },
];

const DASHBOARD_SHAPES: FloatingShape[] = [
  { type: 'circle', color: '#D9F99D60', size: 32, x: '92%', y: '8%', floatDuration: 7, floatDelay: 0 },
  { type: 'ring', color: '#FF8A6540', size: 40, x: '5%', y: '85%', floatDuration: 8, floatDelay: 1 },
  { type: 'triangle', color: '#1A1A1A10', size: 28, x: '88%', y: '90%', floatDuration: 6, floatDelay: 0.5 },
];

function Shape({ shape }: { shape: FloatingShape }) {
  const floatStyle: React.CSSProperties = {
    position: 'absolute',
    left: shape.x,
    top: shape.y,
    animation: `float ${shape.floatDuration}s ease-in-out infinite`,
    animationDelay: `${shape.floatDelay}s`,
    pointerEvents: 'none',
  };

  if (shape.type === 'circle') {
    return (
      <div
        style={{
          ...floatStyle,
          width: shape.size,
          height: shape.size,
          borderRadius: '50%',
          backgroundColor: shape.color,
        }}
      />
    );
  }

  if (shape.type === 'ring') {
    return (
      <div
        style={{
          ...floatStyle,
          width: shape.size,
          height: shape.size,
          borderRadius: '50%',
          border: `2px solid ${shape.color}`,
        }}
      />
    );
  }

  if (shape.type === 'triangle') {
    return (
      <svg
        width={shape.size}
        height={shape.size}
        viewBox="0 0 40 40"
        fill={shape.color}
        style={{ ...floatStyle, transform: `rotate(${shape.rotate ?? 0}deg)` }}
      >
        <polygon points="20,4 36,36 4,36" />
      </svg>
    );
  }

  // square
  return (
    <div
      style={{
        ...floatStyle,
        width: shape.size,
        height: shape.size,
        border: `2px solid ${shape.color}`,
        transform: `rotate(${shape.rotate ?? 0}deg)`,
      }}
    />
  );
}

export function FloatingShapes({ variant = 'auth' }: { variant?: 'auth' | 'dashboard' }) {
  const shapes = variant === 'auth' ? AUTH_SHAPES : DASHBOARD_SHAPES;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {shapes.map((shape, i) => (
        <div key={i} className={variant === 'dashboard' ? 'hidden md:block' : ''}>
          <Shape shape={shape} />
        </div>
      ))}
    </div>
  );
}

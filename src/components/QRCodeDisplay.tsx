import React from 'react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  label?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 180,
  label
}) => {
  // Deterministic pseudo-random matrix generator based on string hash for authentic visual look
  const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const seed = hashString(value);
  const gridSize = 21; // standard QR version 1 is 21x21
  const cellSize = size / gridSize;

  // Generate grid
  const cells: boolean[][] = Array.from({ length: gridSize }, (_, r) =>
    Array.from({ length: gridSize }, (_, c) => {
      // Finder patterns (top-left, top-right, bottom-left)
      const inTopLeft = r < 7 && c < 7;
      const inTopRight = r < 7 && c >= gridSize - 7;
      const inBottomLeft = r >= gridSize - 7 && c < 7;

      if (inTopLeft || inTopRight || inBottomLeft) {
        const localR = inTopLeft ? r : inTopRight ? r : r - (gridSize - 7);
        const localC = inTopLeft ? c : inTopRight ? c - (gridSize - 7) : c;
        if (localR === 0 || localR === 6 || localC === 0 || localC === 6) return true;
        if (localR >= 2 && localR <= 4 && localC >= 2 && localC <= 4) return true;
        return false;
      }

      // Timing patterns
      if (r === 6 || c === 6) return (r + c) % 2 === 0;

      // Deterministic noise for payload based on char codes
      const pseudoVal = (seed * (r + 1) * 31 + (c + 1) * 17 + value.charCodeAt((r * c) % value.length)) % 100;
      return pseudoVal > 48;
    })
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className="bg-white p-3 rounded-xl border border-slate-200 shadow-inner inline-block"
        style={{ width: size + 24, height: size + 24 }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="rounded"
        >
          <rect width={size} height={size} fill="#ffffff" />
          {cells.map((row, r) =>
            row.map((filled, c) =>
              filled ? (
                <rect
                  key={`${r}-${c}`}
                  x={c * cellSize}
                  y={r * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill="#0f172a"
                  rx={0.5}
                />
              ) : null
            )
          )}
        </svg>
      </div>
      {label && (
        <span className="mt-2 text-xs font-mono font-semibold tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
          {label}
        </span>
      )}
    </div>
  );
};

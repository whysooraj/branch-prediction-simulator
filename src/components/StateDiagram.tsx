import React from 'react';
import { TwoBitState } from '../types';

interface StateDiagramProps {
  currentState: string; // e.g. "01", "10", or "BHR=..."
  predictorId: string;
}

export const StateDiagram: React.FC<StateDiagramProps> = ({ currentState, predictorId }) => {
  // If not a 2-bit counter, show a tailored info block
  if (predictorId !== 'two-bit') {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 flex flex-col justify-center items-center text-center space-y-2 min-h-[220px]">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          State Machine Monitor
        </span>
        <div className="text-sm font-mono text-zinc-300 bg-zinc-950 px-3 py-1.5 rounded border border-zinc-800">
          Current State: <strong className="text-emerald-400">{currentState}</strong>
        </div>
        <p className="text-xs text-zinc-500 max-w-sm">
          {predictorId === 'one-bit'
            ? '1-bit dynamic predictor tracks 1 bit of history (T or N), updating immediately to the latest branch outcome.'
            : predictorId === 'global-history'
            ? 'Global History predictor tracks the last N branch outcomes in a BHR and indexes a Pattern History Table of 2-bit counters.'
            : 'Static predictors (Always-Taken & Always-Not-Taken) maintain zero internal state machines.'}
        </p>
      </div>
    );
  }

  // Active state for 2-bit
  const activeState = (currentState === '00' || currentState === '01' || currentState === '10' || currentState === '11')
    ? (currentState as TwoBitState)
    : '01';

  const states = [
    { id: '00', label: 'Strongly Not Taken', binary: '00', pred: 'Predict: N', color: 'border-zinc-700' },
    { id: '01', label: 'Weakly Not Taken', binary: '01', pred: 'Predict: N', color: 'border-zinc-700' },
    { id: '10', label: 'Weakly Taken', binary: '10', pred: 'Predict: T', color: 'border-zinc-700' },
    { id: '11', label: 'Strongly Taken', binary: '11', pred: 'Predict: T', color: 'border-zinc-700' },
  ];

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          2-Bit Saturating Counter FSM State Diagram
        </h3>
        <span className="text-xs font-mono text-zinc-400">
          Active: <strong className="text-emerald-400">{activeState}</strong>
        </span>
      </div>

      {/* SVG Diagram */}
      <div className="w-full flex justify-center py-2">
        <svg viewBox="0 0 760 170" className="w-full max-w-2xl h-auto">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#71717a" />
            </marker>
            <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981" />
            </marker>
            <marker id="arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#f43f5e" />
            </marker>
          </defs>

          {/* Forward (Taken) Curved Arrows (Top) */}
          {/* 00 -> 01 */}
          <path d="M 125 65 Q 195 25 265 65" fill="none" stroke="#10b981" strokeWidth="1.75" markerEnd="url(#arrow-green)" />
          <text x="195" y="38" fill="#10b981" fontSize="11" fontFamily="monospace" textAnchor="middle">T (+1)</text>

          {/* 01 -> 10 */}
          <path d="M 315 65 Q 385 25 455 65" fill="none" stroke="#10b981" strokeWidth="1.75" markerEnd="url(#arrow-green)" />
          <text x="385" y="38" fill="#10b981" fontSize="11" fontFamily="monospace" textAnchor="middle">T (+1)</text>

          {/* 10 -> 11 */}
          <path d="M 505 65 Q 575 25 645 65" fill="none" stroke="#10b981" strokeWidth="1.75" markerEnd="url(#arrow-green)" />
          <text x="575" y="38" fill="#10b981" fontSize="11" fontFamily="monospace" textAnchor="middle">T (+1)</text>

          {/* 11 -> 11 Loop */}
          <path d="M 685 70 C 730 40 730 110 685 95" fill="none" stroke="#10b981" strokeWidth="1.75" markerEnd="url(#arrow-green)" />
          <text x="735" y="85" fill="#10b981" fontSize="10" fontFamily="monospace">T (Sat)</text>

          {/* Backward (Not Taken) Curved Arrows (Bottom) */}
          {/* 11 -> 10 */}
          <path d="M 645 105 Q 575 145 505 105" fill="none" stroke="#f43f5e" strokeWidth="1.75" markerEnd="url(#arrow-red)" />
          <text x="575" y="140" fill="#f43f5e" fontSize="11" fontFamily="monospace" textAnchor="middle">N (-1)</text>

          {/* 10 -> 01 */}
          <path d="M 455 105 Q 385 145 315 105" fill="none" stroke="#f43f5e" strokeWidth="1.75" markerEnd="url(#arrow-red)" />
          <text x="385" y="140" fill="#f43f5e" fontSize="11" fontFamily="monospace" textAnchor="middle">N (-1)</text>

          {/* 01 -> 00 */}
          <path d="M 265 105 Q 195 145 125 105" fill="none" stroke="#f43f5e" strokeWidth="1.75" markerEnd="url(#arrow-red)" />
          <text x="195" y="140" fill="#f43f5e" fontSize="11" fontFamily="monospace" textAnchor="middle">N (-1)</text>

          {/* 00 -> 00 Loop */}
          <path d="M 85 95 C 40 110 40 40 85 70" fill="none" stroke="#f43f5e" strokeWidth="1.75" markerEnd="url(#arrow-red)" />
          <text x="18" y="85" fill="#f43f5e" fontSize="10" fontFamily="monospace">N (Sat)</text>

          {/* State Circles */}
          {states.map((st, i) => {
            const cx = 105 + i * 190;
            const cy = 85;
            const isActive = st.binary === activeState;

            return (
              <g key={st.id}>
                {/* Halo for active state */}
                {isActive && (
                  <circle cx={cx} cy={cy} r="38" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 2" />
                )}
                {/* Circle body */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="32"
                  fill={isActive ? '#14532d' : '#18181b'}
                  stroke={isActive ? '#10b981' : '#3f3f46'}
                  strokeWidth={isActive ? '2.5' : '1.5'}
                />
                {/* Binary Code */}
                <text
                  x={cx}
                  y={cy - 4}
                  fill={isActive ? '#ffffff' : '#f4f4f5'}
                  fontSize="15"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {st.binary}
                </text>
                {/* Prediction label */}
                <text
                  x={cx}
                  y={cy + 13}
                  fill={st.binary.startsWith('1') ? '#34d399' : '#a1a1aa'}
                  fontSize="9.5"
                  fontWeight="600"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {st.binary.startsWith('1') ? 'PRED: T' : 'PRED: N'}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* State Descriptions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-zinc-800/80 text-xs">
        {states.map((st) => (
          <div
            key={st.id}
            className={`p-2 rounded border text-center transition-colors ${
              st.binary === activeState
                ? 'bg-zinc-800/90 border-emerald-500/80 text-zinc-100 font-medium'
                : 'bg-zinc-950/40 border-zinc-800 text-zinc-400'
            }`}
          >
            <div className="font-mono text-xs font-semibold">{st.binary}</div>
            <div className="text-[11px] truncate">{st.label}</div>
            <div className="text-[10px] text-zinc-500 font-mono">{st.pred}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

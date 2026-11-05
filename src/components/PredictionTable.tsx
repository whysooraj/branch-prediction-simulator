import React, { useRef, useEffect } from 'react';
import { PredictionStep } from '../types';
import { Check, X } from 'lucide-react';

interface PredictionTableProps {
  steps: PredictionStep[];
  currentStepIndex: number;
}

export const PredictionTable: React.FC<PredictionTableProps> = ({
  steps,
  currentStepIndex,
}) => {
  const activeRowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (activeRowRef.current) {
      activeRowRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentStepIndex]);

  if (steps.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-8 text-center text-zinc-500 text-xs">
        No simulation steps recorded yet. Enter a valid branch sequence and click "Step" or "Play".
      </div>
    );
  }

  const visibleSteps = steps.slice(0, currentStepIndex);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          Step-by-Step Simulation Execution Log
        </h3>
        <span className="text-[11px] font-mono text-zinc-400">
          Showing {visibleSteps.length} of {steps.length} branches
        </span>
      </div>

      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-zinc-950/80 sticky top-0 border-b border-zinc-800 text-[11px] font-mono uppercase text-zinc-400">
            <tr>
              <th className="py-2.5 px-3">#</th>
              <th className="py-2.5 px-3">Actual</th>
              <th className="py-2.5 px-3">Predicted</th>
              <th className="py-2.5 px-3">Result</th>
              <th className="py-2.5 px-3">State Before</th>
              <th className="py-2.5 px-3">State After</th>
              <th className="py-2.5 px-3 min-w-[200px]">Predictor Action &amp; Hardware Transition</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-mono">
            {steps.map((step, idx) => {
              const isExecuted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex - 1;

              if (!isExecuted) {
                return (
                  <tr key={step.index} className="opacity-30">
                    <td className="py-2 px-3 text-zinc-500">{step.index}</td>
                    <td className="py-2 px-3 text-zinc-500">{step.actual}</td>
                    <td className="py-2 px-3 text-zinc-600">-</td>
                    <td className="py-2 px-3 text-zinc-600">-</td>
                    <td className="py-2 px-3 text-zinc-600">-</td>
                    <td className="py-2 px-3 text-zinc-600">-</td>
                    <td className="py-2 px-3 text-zinc-600 italic">Pending step execution...</td>
                  </tr>
                );
              }

              return (
                <tr
                  key={step.index}
                  ref={isCurrent ? activeRowRef : null}
                  className={`transition-colors ${
                    isCurrent
                      ? 'bg-zinc-800/80 font-medium'
                      : 'hover:bg-zinc-800/30'
                  }`}
                >
                  <td className="py-2.5 px-3 text-zinc-400 font-semibold">{step.index}</td>

                  {/* Actual */}
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        step.actual === 'T'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}
                    >
                      {step.actual === 'T' ? 'T (Taken)' : 'N (Not Taken)'}
                    </span>
                  </td>

                  {/* Predicted */}
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        step.predicted === 'T'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}
                    >
                      {step.predicted === 'T' ? 'T (Taken)' : 'N (Not Taken)'}
                    </span>
                  </td>

                  {/* Result */}
                  <td className="py-2.5 px-3">
                    {step.correct ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800 text-[11px]">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Hit</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-rose-950/70 text-rose-300 border border-rose-800 text-[11px]">
                        <X className="w-3 h-3 text-rose-400" />
                        <span>Miss</span>
                      </span>
                    )}
                  </td>

                  {/* State Before */}
                  <td className="py-2.5 px-3 text-zinc-300">{step.stateBefore}</td>

                  {/* State After */}
                  <td className="py-2.5 px-3 text-zinc-200 font-semibold">{step.stateAfter}</td>

                  {/* Explanation */}
                  <td className="py-2.5 px-3 font-sans text-xs text-zinc-400">
                    {step.explanation}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

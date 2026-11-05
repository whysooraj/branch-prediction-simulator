import React, { useState } from 'react';
import { Layers, AlertTriangle, ShieldCheck } from 'lucide-react';
import { generatePipelineTrace } from '../engine/pipelineModel';
import { BranchOutcome, PredictionStep } from '../types';

interface PipelineVisualizerProps {
  sequence: BranchOutcome[];
  steps: PredictionStep[];
  penaltyCycles: number;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  sequence,
  steps,
  penaltyCycles,
}) => {
  const [selectedBranchIdx, setSelectedBranchIdx] = useState<number>(1);

  if (steps.length === 0) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 text-center text-zinc-400 text-xs">
        Run simulation first to inspect CPU pipeline stages and flush behavior.
      </div>
    );
  }

  const predictions = steps.map((s) => ({
    predicted: s.predicted,
    correct: s.correct,
  }));

  const allSnapshots = generatePipelineTrace(sequence, predictions, Math.min(penaltyCycles, 5));
  const branchSnapshots = allSnapshots.filter((s) => s.branchIndex === selectedBranchIdx);
  const currentStep = steps.find((s) => s.index === selectedBranchIdx);

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-lg p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            5-Stage CPU Pipeline Execution & Flush Inspector
          </span>
        </div>

        {/* Branch Selector */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-zinc-400">Select Branch:</span>
          <select
            value={selectedBranchIdx}
            onChange={(e) => setSelectedBranchIdx(Number(e.target.value))}
            className="px-2 py-1 bg-zinc-950 font-mono text-zinc-200 border border-zinc-800 rounded focus:outline-none"
          >
            {steps.map((s) => (
              <option key={s.index} value={s.index}>
                Branch #{s.index} (Actual: {s.actual}, Pred: {s.predicted} - {s.correct ? 'HIT' : 'MISS'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Branch Overview Banner */}
      {currentStep && (
        <div
          className={`p-3 rounded-md border flex items-center justify-between text-xs font-mono ${
            currentStep.correct
              ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
              : 'bg-rose-950/30 border-rose-800/40 text-rose-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            {currentStep.correct ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            )}
            <span>
              Branch #{currentStep.index}: Actual {currentStep.actual} vs Predicted{' '}
              {currentStep.predicted} &rarr;{' '}
              <strong className="uppercase">
                {currentStep.correct ? 'Prediction Hit (No Stall)' : 'Misprediction (Pipeline Squashed)'}
              </strong>
            </span>
          </div>
          <span className="text-[11px] text-zinc-400">
            {currentStep.correct ? '0 penalty cycles' : `+${penaltyCycles} stall cycles penalty`}
          </span>
        </div>
      )}

      {/* Pipeline Stages Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-950 text-zinc-400 font-mono text-[10px] uppercase tracking-wider border-b border-zinc-800">
              <th className="py-2 px-3 text-left">Cycle</th>
              <th className="py-2 px-3 text-center">IF (Fetch)</th>
              <th className="py-2 px-3 text-center">ID (Decode)</th>
              <th className="py-2 px-3 text-center">EX (Execute / Resolve)</th>
              <th className="py-2 px-3 text-center">MEM (Memory)</th>
              <th className="py-2 px-3 text-center">WB (Write Back)</th>
              <th className="py-2 px-3 text-left">Architectural Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-mono">
            {branchSnapshots.map((snap) => (
              <tr
                key={snap.cycle}
                className={`transition-colors ${
                  snap.isFlush
                    ? 'bg-rose-950/20 text-rose-200'
                    : 'hover:bg-zinc-800/30 text-zinc-300'
                }`}
              >
                <td className="py-2 px-3 font-bold text-zinc-400">C_{snap.cycle}</td>

                {/* IF */}
                <td className="py-2 px-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] ${
                      snap.stages.IF.includes('SQUASH')
                        ? 'bg-rose-900/60 text-rose-300 line-through'
                        : snap.stages.IF.includes('BUBBLE')
                        ? 'bg-amber-950/60 text-amber-400'
                        : 'bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    {snap.stages.IF}
                  </span>
                </td>

                {/* ID */}
                <td className="py-2 px-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] ${
                      snap.stages.ID.includes('SQUASH')
                        ? 'bg-rose-900/60 text-rose-300 line-through'
                        : snap.stages.ID.includes('BUBBLE')
                        ? 'bg-amber-950/60 text-amber-400'
                        : 'bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    {snap.stages.ID}
                  </span>
                </td>

                {/* EX */}
                <td className="py-2 px-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] ${
                      snap.stages.EX.includes('RESOLVE')
                        ? 'bg-rose-500/30 text-rose-300 font-bold'
                        : snap.stages.EX.includes('BUBBLE')
                        ? 'bg-amber-950/60 text-amber-400'
                        : 'bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    {snap.stages.EX}
                  </span>
                </td>

                {/* MEM */}
                <td className="py-2 px-3 text-center text-zinc-400 text-[11px]">
                  {snap.stages.MEM}
                </td>

                {/* WB */}
                <td className="py-2 px-3 text-center text-zinc-400 text-[11px]">
                  {snap.stages.WB}
                </td>

                {/* Note */}
                <td className="py-2 px-3 font-sans text-xs text-zinc-400">
                  {snap.comment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/80 flex items-center justify-between">
        <span>Classic 5-Stage RISC Pipeline Model (IF &rarr; ID &rarr; EX &rarr; MEM &rarr; WB)</span>
        <span>Branch resolved in EX stage &bull; Squashes invalid instructions in IF/ID</span>
      </div>
    </div>
  );
};

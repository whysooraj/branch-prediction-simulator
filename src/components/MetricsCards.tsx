import React from 'react';
import { Target, AlertTriangle, Clock, Percent, Hash } from 'lucide-react';
import { CalculatedMetrics } from '../engine/metrics';

interface MetricsCardsProps {
  metrics: CalculatedMetrics;
  isComplete: boolean;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics, isComplete }) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Branches */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Total</span>
            <Hash className="w-3.5 h-3.5 text-zinc-500" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-zinc-100">
            {metrics.totalBranches}
          </div>
          <span className="text-[10px] text-zinc-500">Branches evaluated</span>
        </div>

        {/* Correct Predictions */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Correct (Hits)</span>
            <Target className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-emerald-400">
            {metrics.correctPredictions}
          </div>
          <span className="text-[10px] text-zinc-500">Zero penalty incurred</span>
        </div>

        {/* Mispredictions */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
          <div className="flex items-center justify-between text-rose-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Misses</span>
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-rose-400">
            {metrics.mispredictions}
          </div>
          <span className="text-[10px] text-zinc-500">Pipeline flushes triggered</span>
        </div>

        {/* Accuracy */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Accuracy</span>
            <Percent className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-zinc-100">
            {metrics.accuracy}
            <span className="text-xs text-zinc-400 font-normal">%</span>
          </div>
          <span className="text-[10px] text-zinc-500">(Correct / Total) &times; 100</span>
        </div>

        {/* Misprediction Rate */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Miss Rate</span>
            <Percent className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-zinc-100">
            {metrics.mispredictionRate}
            <span className="text-xs text-zinc-400 font-normal">%</span>
          </div>
          <span className="text-[10px] text-zinc-500">(Misses / Total) &times; 100</span>
        </div>

        {/* Estimated Cycles */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
          <div className="flex items-center justify-between text-amber-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Est. Cycles</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-amber-300">
            {metrics.estimatedCycles}
          </div>
          <span className="text-[10px] text-zinc-500">
            ({metrics.totalBranches}&times;{metrics.baseCycles}) + ({metrics.mispredictions}&times;{metrics.penaltyCycles})
          </span>
        </div>
      </div>

      {!isComplete && metrics.totalBranches > 0 && (
        <p className="text-[11px] text-zinc-500 italic">
          * Metrics reflect simulation state up to current step. Continue stepping or click "Run All" for complete benchmark totals.
        </p>
      )}
    </div>
  );
};

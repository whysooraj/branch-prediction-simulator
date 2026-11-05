import React, { useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  FastForward,
  Gauge,
} from 'lucide-react';

interface SimulationControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepNext: () => void;
  onStepPrev: () => void;
  onReset: () => void;
  onRunAll: () => void;
  playSpeed: number; // in ms
  onChangePlaySpeed: (ms: number) => void;
  disabled?: boolean;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  currentStepIndex,
  totalSteps,
  isPlaying,
  onTogglePlay,
  onStepNext,
  onStepPrev,
  onReset,
  onRunAll,
  playSpeed,
  onChangePlaySpeed,
  disabled = false,
}) => {
  // Automatic timer when playing
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStepIndex >= totalSteps) {
      onTogglePlay(); // stop at end
      return;
    }

    const timer = setTimeout(() => {
      onStepNext();
    }, playSpeed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, totalSteps, playSpeed, onStepNext, onTogglePlay]);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 flex flex-wrap items-center justify-between gap-3">
      {/* Progress pill */}
      <div className="flex items-center space-x-2">
        <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">Progress:</span>
        <span className="font-mono text-xs px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-200">
          <strong className="text-emerald-400">{currentStepIndex}</strong> / {totalSteps} branches
        </span>
      </div>

      {/* Main step button group */}
      <div className="flex items-center space-x-1.5">
        <button
          type="button"
          onClick={onReset}
          disabled={disabled || currentStepIndex === 0}
          title="Reset to initial state (R)"
          className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onStepPrev}
          disabled={disabled || currentStepIndex <= 0 || isPlaying}
          title="Previous Branch"
          className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onTogglePlay}
          disabled={disabled || (currentStepIndex >= totalSteps && !isPlaying)}
          title={isPlaying ? 'Pause Simulation (Space)' : 'Auto-Play Simulation (Space)'}
          className={`px-3 py-2 rounded flex items-center space-x-1.5 font-medium text-xs border transition ${
            isPlaying
              ? 'bg-amber-950/70 border-amber-700 text-amber-200 hover:bg-amber-900/70'
              : 'bg-emerald-950/70 border-emerald-700 text-emerald-200 hover:bg-emerald-900/70'
          } disabled:opacity-40`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Play</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onStepNext}
          disabled={disabled || currentStepIndex >= totalSteps || isPlaying}
          title="Step Next Branch (N)"
          className="px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 text-zinc-100 border border-zinc-700 text-xs font-medium flex items-center space-x-1 transition"
        >
          <span>Step</span>
          <SkipForward className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onRunAll}
          disabled={disabled || currentStepIndex >= totalSteps}
          title="Run Entire Sequence Instantly"
          className="px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-medium flex items-center space-x-1 transition"
        >
          <FastForward className="w-4 h-4" />
          <span className="hidden sm:inline">Run All</span>
        </button>
      </div>

      {/* Speed control */}
      <div className="flex items-center space-x-2 text-xs text-zinc-400">
        <Gauge className="w-3.5 h-3.5 text-zinc-500" />
        <span>Speed:</span>
        <select
          value={playSpeed}
          onChange={(e) => onChangePlaySpeed(Number(e.target.value))}
          className="bg-zinc-950 border border-zinc-700 text-zinc-200 rounded px-2 py-1 text-xs outline-none"
        >
          <option value={1200}>0.5x (Slow)</option>
          <option value={600}>1.0x (Normal)</option>
          <option value={300}>2.0x (Fast)</option>
          <option value={120}>5.0x (Hyper)</option>
        </select>
      </div>
    </div>
  );
};

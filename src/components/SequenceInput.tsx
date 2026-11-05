import React, { useState } from 'react';
import { SAMPLE_SEQUENCES } from '../data/sampleSequences';
import { Dices, RotateCcw, AlertCircle, CheckCircle2, ListFilter } from 'lucide-react';
import { ValidationResult } from '../engine/validateSequence';

interface SequenceInputProps {
  rawInput: string;
  onChangeInput: (val: string) => void;
  validation: ValidationResult;
  onResetSimulation: () => void;
}

export const SequenceInput: React.FC<SequenceInputProps> = ({
  rawInput,
  onChangeInput,
  validation,
  onResetSimulation,
}) => {
  const [randomLength, setRandomLength] = useState<number>(12);
  const [randomTakenPercent, setRandomTakenPercent] = useState<number>(60);

  const handleSelectSample = (pattern: string) => {
    onChangeInput(pattern);
    onResetSimulation();
  };

  const handleGenerateRandom = () => {
    const chars: string[] = [];
    for (let i = 0; i < randomLength; i++) {
      chars.push(Math.random() * 100 < randomTakenPercent ? 'T' : 'N');
    }
    onChangeInput(chars.join(' '));
    onResetSimulation();
  };

  const handleClear = () => {
    onChangeInput('');
    onResetSimulation();
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label htmlFor="branch-seq" className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
          <span>Branch Sequence Input</span>
          <span className="text-[10px] text-zinc-500 font-normal font-mono">
            ({validation.isValid ? `${validation.sequence.length} branches` : 'Empty/Invalid'})
          </span>
        </label>

        {/* Sample selector */}
        <div className="flex items-center space-x-2">
          <ListFilter className="w-3.5 h-3.5 text-zinc-400" />
          <select
            aria-label="Preset Sequences"
            onChange={(e) => {
              if (e.target.value) handleSelectSample(e.target.value);
            }}
            value=""
            className="text-xs bg-zinc-800 text-zinc-300 border border-zinc-700 rounded px-2 py-1 outline-none focus:border-zinc-500"
          >
            <option value="" disabled>Load preset benchmark...</option>
            {SAMPLE_SEQUENCES.map((sample) => (
              <option key={sample.id} value={sample.pattern}>
                {sample.name} ({sample.pattern.length > 15 ? sample.pattern.slice(0, 15) + '...' : sample.pattern})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Input area */}
      <div className="relative">
        <input
          id="branch-seq"
          type="text"
          value={rawInput}
          onChange={(e) => onChangeInput(e.target.value)}
          placeholder="e.g. T T N T T N N T (or TTNTNNTT, comma separated, lowercase accepted)"
          className={`w-full font-mono text-sm px-3 py-2.5 rounded bg-zinc-950 border ${
            validation.isValid ? 'border-zinc-700 text-zinc-100' : 'border-rose-900/60 text-zinc-300'
          } outline-none focus:border-zinc-500 transition`}
        />
      </div>

      {/* Status banner */}
      <div className="flex items-center justify-between text-xs">
        {validation.isValid ? (
          <div className="flex items-center space-x-1.5 text-emerald-400 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Valid sequence: [{validation.rawCleaned}]</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 text-rose-400">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{validation.errorMessage}</span>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs px-2 py-1 rounded text-zinc-400 hover:text-zinc-200 bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700 flex items-center space-x-1 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Random generator drawer */}
      <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
        <span className="font-medium text-zinc-300">Quick Generator:</span>
        <div className="flex items-center space-x-1.5">
          <span>Length:</span>
          <select
            value={randomLength}
            onChange={(e) => setRandomLength(Number(e.target.value))}
            className="bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 text-zinc-200 font-mono"
          >
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={16}>16</option>
            <option value={24}>24</option>
            <option value={32}>32</option>
          </select>
        </div>

        <div className="flex items-center space-x-1.5">
          <span>Taken Bias:</span>
          <select
            value={randomTakenPercent}
            onChange={(e) => setRandomTakenPercent(Number(e.target.value))}
            className="bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 text-zinc-200 font-mono"
          >
            <option value={50}>50% (Uniform)</option>
            <option value={70}>70% (Loop Bias)</option>
            <option value={85}>85% (High Taken)</option>
            <option value={20}>20% (Low Taken)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleGenerateRandom}
          className="ml-auto px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center space-x-1 transition font-medium"
        >
          <Dices className="w-3.5 h-3.5 text-zinc-400" />
          <span>Generate Random</span>
        </button>
      </div>
    </div>
  );
};

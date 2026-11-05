import React from 'react';
import { AVAILABLE_PREDICTORS } from '../predictors/registry';
import { PredictorId } from '../types';
import { Sliders, HelpCircle } from 'lucide-react';

interface ConfigPanelProps {
  selectedPredictor: PredictorId;
  onChangePredictor: (id: PredictorId) => void;
  initialState: string;
  onChangeInitialState: (state: string) => void;
  baseCycles: number;
  onChangeBaseCycles: (val: number) => void;
  penaltyCycles: number;
  onChangePenaltyCycles: (val: number) => void;
  onResetSimulation: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  selectedPredictor,
  onChangePredictor,
  initialState,
  onChangeInitialState,
  baseCycles,
  onChangeBaseCycles,
  penaltyCycles,
  onChangePenaltyCycles,
  onResetSimulation,
}) => {
  const currentInfo = AVAILABLE_PREDICTORS.find((p) => p.id === selectedPredictor);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-zinc-400" />
          Predictor & CPU Pipeline Configuration
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Predictor Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400 block font-medium">Branch Predictor Algorithm</label>
          <select
            value={selectedPredictor}
            onChange={(e) => {
              const newId = e.target.value as PredictorId;
              onChangePredictor(newId);
              const info = AVAILABLE_PREDICTORS.find((p) => p.id === newId);
              if (info?.defaultInitialState) {
                onChangeInitialState(info.defaultInitialState);
              }
              onResetSimulation();
            }}
            className="w-full text-xs font-medium bg-zinc-950 text-zinc-200 border border-zinc-700 rounded px-2.5 py-2 outline-none focus:border-zinc-500"
          >
            {AVAILABLE_PREDICTORS.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.category}] {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Initial State */}
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400 block font-medium">
            Initial Predictor State
            {!currentInfo?.supportsInitialState && (
              <span className="text-zinc-600 font-normal ml-1">(Not Applicable)</span>
            )}
          </label>
          {currentInfo?.supportsInitialState ? (
            <select
              value={initialState}
              onChange={(e) => {
                onChangeInitialState(e.target.value);
                onResetSimulation();
              }}
              className="w-full text-xs font-mono bg-zinc-950 text-zinc-200 border border-zinc-700 rounded px-2.5 py-2 outline-none focus:border-zinc-500"
            >
              {currentInfo.initialStateOptions?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-xs font-mono text-zinc-500 bg-zinc-950/50 border border-zinc-800/80 rounded px-2.5 py-2">
              Static Predictor (Stateless)
            </div>
          )}
        </div>

        {/* Base Cycles Per Branch */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-400 font-medium">Base Cycles (C_base)</span>
            <span className="font-mono text-zinc-200">{baseCycles} cycle</span>
          </div>
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="range"
              min={1}
              max={4}
              step={1}
              value={baseCycles}
              onChange={(e) => onChangeBaseCycles(Number(e.target.value))}
              className="w-full accent-zinc-400 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
          <p className="text-[10px] text-zinc-500">Normal non-mispredicted branch execution cycle.</p>
        </div>

        {/* Misprediction Penalty */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-400 font-medium">Penalty Cycles (P)</span>
            <span className="font-mono text-amber-400 font-semibold">{penaltyCycles} cycles</span>
          </div>
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="range"
              min={1}
              max={15}
              step={1}
              value={penaltyCycles}
              onChange={(e) => onChangePenaltyCycles(Number(e.target.value))}
              className="w-full accent-amber-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
          <p className="text-[10px] text-zinc-500">Pipeline stall cost incurred when branch mispredicts.</p>
        </div>
      </div>

      {/* Predictor Quick Description */}
      <div className="pt-2 border-t border-zinc-800/60 flex items-start space-x-2 text-xs text-zinc-400">
        <HelpCircle className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
        <div>
          <span className="text-zinc-300 font-medium">{currentInfo?.name}: </span>
          <span>{currentInfo?.description}</span>
        </div>
      </div>
    </div>
  );
};

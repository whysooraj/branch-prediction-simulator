import React from 'react';
import { X, BookOpen, Calculator, HelpCircle } from 'lucide-react';

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-semibold tracking-tight text-zinc-100">
              Computer Organization &amp; Architecture: Branch Prediction Theory
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-zinc-300 leading-relaxed font-sans">
          {/* Motivation */}
          <section className="space-y-1.5">
            <h3 className="text-zinc-100 font-semibold uppercase tracking-wider text-[11px] font-mono text-emerald-400">
              1. The Branch Hazard Problem
            </h3>
            <p>
              In pipelined processors, instructions are fetched concurrently across stages (IF, ID, EX, MEM, WB). When a conditional branch arrives, the processor does not know if the condition will be satisfied or where the next PC points until the branch condition resolves in the <strong>Execute (EX)</strong> stage.
            </p>
            <p>
              Without branch prediction, the CPU would have to stall the pipeline for 2–4 cycles every branch instruction. Branch prediction allows the fetch engine to guess speculatively and keep pipelines full.
            </p>
          </section>

          {/* Mathematical Model */}
          <section className="space-y-2 border-t border-zinc-800 pt-4">
            <h3 className="text-zinc-100 font-semibold uppercase tracking-wider text-[11px] font-mono text-amber-400 flex items-center space-x-1.5">
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>2. Mathematical Formulas &amp; Metrics</span>
            </h3>
            <div className="bg-zinc-950 p-3 rounded border border-zinc-800 font-mono text-xs space-y-1">
              <div>Total Branches: <strong className="text-zinc-100">B</strong></div>
              <div>Correct Predictions (Hits): <strong className="text-emerald-400">C</strong></div>
              <div>Mispredictions (Misses): <strong className="text-rose-400">M = B - C</strong></div>
              <div>Prediction Accuracy (%): <strong className="text-zinc-100">(C / B) &times; 100</strong></div>
              <div>Misprediction Rate (%): <strong className="text-zinc-100">(M / B) &times; 100</strong></div>
              <div>Estimated Total Cycles: <strong className="text-amber-300">(B &times; C_base) + (M &times; P)</strong></div>
            </div>
            <p className="text-[11px] text-zinc-400">
              Where <code className="text-zinc-200">C_base</code> is the base execution cost per branch instruction (typically 1 cycle) and <code className="text-amber-300">P</code> is the misprediction pipeline stall penalty (default 5 cycles).
            </p>
          </section>

          {/* Predictor Classes */}
          <section className="space-y-2.5 border-t border-zinc-800 pt-4">
            <h3 className="text-zinc-100 font-semibold uppercase tracking-wider text-[11px] font-mono text-zinc-200">
              3. Predictor Architectures
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-zinc-950 rounded border border-zinc-800 space-y-1">
                <span className="font-semibold text-zinc-200 font-mono">Always-Taken / Not-Taken</span>
                <p className="text-[11px] text-zinc-400">
                  Static predictors that require zero hardware state or transistors. Simple, but heavily penalized on inverted loop conditionals.
                </p>
              </div>

              <div className="p-3 bg-zinc-950 rounded border border-zinc-800 space-y-1">
                <span className="font-semibold text-zinc-200 font-mono">1-Bit Dynamic Predictor</span>
                <p className="text-[11px] text-zinc-400">
                  Stores the last observed branch outcome. In a loop of <em>N</em> iterations, it mispredicts twice: once on the first iteration (if entered from outside) and once on the exit.
                </p>
              </div>

              <div className="p-3 bg-zinc-950 rounded border border-zinc-800 space-y-1">
                <span className="font-semibold text-zinc-200 font-mono">2-Bit Saturating Counter</span>
                <p className="text-[11px] text-zinc-400">
                  Uses a 4-state finite state machine (00, 01, 10, 11). Requires <strong>two consecutive mispredictions</strong> to flip prediction polarity, reducing loop exit mispredicts to just 1.
                </p>
              </div>

              <div className="p-3 bg-zinc-950 rounded border border-zinc-800 space-y-1">
                <span className="font-semibold text-zinc-200 font-mono">Global / Correlating Predictor</span>
                <p className="text-[11px] text-zinc-400">
                  Maintains an <em>n</em>-bit Branch History Register (BHR) capturing the global outcome of previous branches, indexing a Pattern History Table (PHT) of 2-bit counters to detect correlated branches.
                </p>
              </div>
            </div>
          </section>

          {/* Golden Rule */}
          <section className="p-3 rounded bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
            <div className="flex items-center space-x-1.5 text-zinc-200 font-semibold">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Golden Order of Simulation Execution</span>
            </div>
            <p>
              To model real hardware causality: <strong className="text-zinc-100">Predict First &rarr; Compare Second &rarr; Update State Third</strong>. State updates must never use the current branch's outcome before prediction!
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

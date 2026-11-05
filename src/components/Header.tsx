import React from 'react';
import { Cpu, GitBranch, BookOpen } from 'lucide-react';

interface HeaderProps {
  onOpenTheory: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenTheory }) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-zinc-800 border border-zinc-700 text-zinc-200">
            <Cpu className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-semibold tracking-tight text-zinc-100">
                Interactive Branch Prediction Simulator
              </h1>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                COA LAB
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              CPU Architecture &middot; Dynamic Branch Direction &middot; Pipeline Hazard Penalty Analysis
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenTheory}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:text-zinc-100 border border-zinc-700 transition"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Theory & Equations</span>
          </button>
          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800">
            <GitBranch className="w-3.5 h-3.5 text-zinc-500" />
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </header>
  );
};

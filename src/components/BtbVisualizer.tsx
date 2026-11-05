import React, { useState } from 'react';
import { BranchTargetBuffer, BtbEntry, BtbLookupResult } from '../predictors/btb';
import { Database, Search, Plus, RotateCcw, CheckCircle, AlertTriangle } from 'lucide-react';

export const BtbVisualizer: React.FC = () => {
  const [btb] = useState<BranchTargetBuffer>(() => {
    const buffer = new BranchTargetBuffer(6);
    // Pre-populate with typical assembly branch addresses
    buffer.update('0x00401020', '0x00401088', 'T');
    buffer.update('0x00401044', '0x00401020', 'T');
    buffer.update('0x00401068', '0x00401070', 'N');
    return buffer;
  });

  const [entries, setEntries] = useState<BtbEntry[]>(() => btb.getEntries());
  const [queryAddress, setQueryAddress] = useState<string>('0x00401020');
  const [lookupResult, setLookupResult] = useState<BtbLookupResult | null>(null);

  // Form states to add new branch entry
  const [newPc, setNewPc] = useState<string>('0x00401090');
  const [newTarget, setNewTarget] = useState<string>('0x00401100');
  const [newOutcome, setNewOutcome] = useState<'T' | 'N'>('T');

  const handleLookup = () => {
    const res = btb.lookup(queryAddress.trim());
    setLookupResult(res);
    setEntries(btb.getEntries());
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPc.trim() || !newTarget.trim()) return;
    btb.update(newPc.trim(), newTarget.trim(), newOutcome);
    setEntries(btb.getEntries());
  };

  const handleClear = () => {
    btb.clear();
    setEntries([]);
    setLookupResult(null);
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Branch Target Buffer (BTB) Architecture Module
          </h3>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 flex items-center space-x-1 transition self-start sm:self-auto"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear BTB Cache</span>
        </button>
      </div>

      <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/60 text-xs text-zinc-400 space-y-1">
        <p>
          <strong className="text-zinc-200">Direction Predictor vs. BTB:</strong> Direction predictors (1-bit, 2-bit, BHT) answer <em>&ldquo;Will this branch be Taken or Not Taken?&rdquo;</em>
          Meanwhile, the <strong>Branch Target Buffer (BTB)</strong> caches target addresses to answer <em>&ldquo;If Taken, WHERE will it jump?&rdquo;</em>
        </p>
        <p className="text-[11px] text-zinc-500">
          A BTB hit allows the Instruction Fetch (IF) stage to load the target PC immediately in cycle 1, eliminating instruction decode delay.
        </p>
      </div>

      {/* Interactive Lookup Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3 bg-zinc-950/40 p-3 rounded-lg border border-zinc-800">
          <span className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5">
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <span>Simulate Instruction Fetch (IF) BTB Lookup</span>
          </span>

          <div className="flex space-x-2">
            <input
              type="text"
              value={queryAddress}
              onChange={(e) => setQueryAddress(e.target.value)}
              placeholder="e.g. 0x00401020"
              className="flex-1 font-mono text-xs px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 outline-none focus:border-zinc-500"
            />
            <button
              type="button"
              onClick={handleLookup}
              className="px-3 py-1.5 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 text-xs font-medium transition"
            >
              Lookup PC
            </button>
          </div>

          {lookupResult && (
            <div
              className={`p-2.5 rounded border text-xs flex items-start space-x-2 ${
                lookupResult.hit
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-800 text-rose-300'
              }`}
            >
              {lookupResult.hit ? (
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <div className="font-semibold font-mono">
                  {lookupResult.hit
                    ? `BTB HIT: Target Address ${lookupResult.predictedTarget} (0 Stall Cycles)`
                    : `BTB MISS: Target Unknown (+${lookupResult.penaltyCyclesIncurred} Cycles Target Stall)`}
                </div>
                <div className="text-[11px] font-sans opacity-90">{lookupResult.explanation}</div>
              </div>
            </div>
          )}
        </div>

        {/* Add Entry Form */}
        <form onSubmit={handleAddEntry} className="space-y-3 bg-zinc-950/40 p-3 rounded-lg border border-zinc-800">
          <span className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5">
            <Plus className="w-3.5 h-3.5 text-zinc-400" />
            <span>Allocate / Update BTB Cache Entry</span>
          </span>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-zinc-500 block mb-0.5">Branch PC</label>
              <input
                type="text"
                value={newPc}
                onChange={(e) => setNewPc(e.target.value)}
                className="w-full font-mono text-xs px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 block mb-0.5">Target PC</label>
              <input
                type="text"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                className="w-full font-mono text-xs px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 block mb-0.5">Pred Outcome</label>
              <select
                value={newOutcome}
                onChange={(e) => setNewOutcome(e.target.value as 'T' | 'N')}
                className="w-full font-mono text-xs px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 outline-none"
              >
                <option value="T">T (Taken)</option>
                <option value="N">N (Not Taken)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-medium transition"
          >
            Insert Into BTB Table
          </button>
        </form>
      </div>

      {/* BTB Cache Table */}
      <div className="overflow-x-auto rounded border border-zinc-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-zinc-950 font-mono uppercase text-[11px] text-zinc-400 border-b border-zinc-800">
            <tr>
              <th className="py-2 px-3">Entry Tag (Branch PC)</th>
              <th className="py-2 px-3">Target Address</th>
              <th className="py-2 px-3 text-center">Valid Bit</th>
              <th className="py-2 px-3 text-center">Cached Prediction</th>
              <th className="py-2 px-3 text-right">Hit Frequency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-mono">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-center text-zinc-500 text-xs font-sans">
                  BTB Cache is currently empty.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.tag} className="hover:bg-zinc-800/30">
                  <td className="py-2 px-3 text-emerald-400 font-semibold">{entry.tag}</td>
                  <td className="py-2 px-3 text-zinc-200">{entry.targetAddress}</td>
                  <td className="py-2 px-3 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                      1 (Valid)
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        entry.predictedOutcome === 'T'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}
                    >
                      {entry.predictedOutcome}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right text-zinc-400">{entry.hitCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React from 'react';
import { SimulationResult } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { BarChart3, Trophy } from 'lucide-react';

interface ComparisonChartsProps {
  results: SimulationResult[];
}

export const ComparisonCharts: React.FC<ComparisonChartsProps> = ({ results }) => {
  if (results.length === 0) return null;

  // Format data for Recharts
  const chartData = results.map((r) => ({
    name: r.predictorName,
    accuracy: r.accuracy,
    cycles: r.estimatedCycles,
    hits: r.correctPredictions,
    misses: r.mispredictions,
  }));

  // Find best predictor by accuracy (or least cycles)
  const bestPredictor = [...results].sort((a, b) => b.accuracy - a.accuracy || a.estimatedCycles - b.estimatedCycles)[0];

  return (
    <div className="space-y-4">
      {/* Best Predictor Callout */}
      {bestPredictor && (
        <div className="p-3 rounded-lg border border-emerald-900/60 bg-emerald-950/20 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span>
              Highest Performing Predictor on this sequence: <strong>{bestPredictor.predictorName}</strong>
            </span>
          </div>
          <div className="font-mono font-semibold space-x-3">
            <span>Accuracy: {bestPredictor.accuracy}%</span>
            <span>Cycles: {bestPredictor.estimatedCycles}</span>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Accuracy Bar Chart */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              Prediction Accuracy Comparison (%)
            </h4>
            <span className="text-[10px] text-zinc-500 font-mono">Higher is better</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#71717a"
                  fontSize={10}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#71717a" fontSize={10} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#3f3f46',
                    borderRadius: '6px',
                    fontSize: '11px',
                    color: '#f4f4f5',
                  }}
                  formatter={(value: any) => [`${value}%`, 'Accuracy']}
                />
                <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.name === bestPredictor?.predictorName ? '#10b981' : '#3f3f46'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cycles Bar Chart */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
              Estimated CPU Execution Cycles
            </h4>
            <span className="text-[10px] text-zinc-500 font-mono">Lower is better</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#71717a"
                  fontSize={10}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#71717a" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#3f3f46',
                    borderRadius: '6px',
                    fontSize: '11px',
                    color: '#f4f4f5',
                  }}
                  formatter={(value: any) => [`${value} cycles`, 'Execution Time']}
                />
                <Bar dataKey="cycles" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-c-${index}`}
                      fill={entry.name === bestPredictor?.predictorName ? '#f59e0b' : '#3f3f46'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-300">
          Predictor Performance Summary Table
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-zinc-950/80 text-[11px] font-mono uppercase text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="py-2 px-3">Predictor Algorithm</th>
                <th className="py-2 px-3 text-right">Branches</th>
                <th className="py-2 px-3 text-right">Hits</th>
                <th className="py-2 px-3 text-right">Misses</th>
                <th className="py-2 px-3 text-right">Accuracy</th>
                <th className="py-2 px-3 text-right">Mispredict Rate</th>
                <th className="py-2 px-3 text-right">Est. Cycles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {results.map((res) => {
                const isBest = res.predictorId === bestPredictor?.predictorId;
                return (
                  <tr
                    key={res.predictorId}
                    className={isBest ? 'bg-emerald-950/20 font-medium' : 'hover:bg-zinc-800/30'}
                  >
                    <td className="py-2.5 px-3 flex items-center space-x-2">
                      {isBest && <Trophy className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      <span className={isBest ? 'text-emerald-300' : 'text-zinc-200'}>
                        {res.predictorName}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-zinc-400">{res.totalBranches}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-semibold">{res.correctPredictions}</td>
                    <td className="py-2.5 px-3 text-right text-rose-400 font-semibold">{res.mispredictions}</td>
                    <td className="py-2.5 px-3 text-right text-zinc-100 font-bold">{res.accuracy}%</td>
                    <td className="py-2.5 px-3 text-right text-zinc-400">{res.mispredictionRate}%</td>
                    <td className="py-2.5 px-3 text-right text-amber-300 font-semibold">{res.estimatedCycles}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

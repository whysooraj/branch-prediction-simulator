import React from 'react';
import { SimulationResult } from '../types';
import { Download } from 'lucide-react';

interface ExportControlsProps {
  result: SimulationResult | null;
  comparisonResults?: SimulationResult[];
}

export const ExportControls: React.FC<ExportControlsProps> = ({
  result,
  comparisonResults,
}) => {
  const handleExportSingleCsv = () => {
    if (!result) return;

    const rows: string[] = [
      `# Branch Prediction Simulation Report`,
      `# Predictor: ${result.predictorName}`,
      `# Total Branches: ${result.totalBranches}`,
      `# Hits: ${result.correctPredictions}`,
      `# Misses: ${result.mispredictions}`,
      `# Accuracy (%): ${result.accuracy}`,
      `# Misprediction Rate (%): ${result.mispredictionRate}`,
      `# Base Cycles: ${result.baseCycles}`,
      `# Penalty Cycles: ${result.penaltyCycles}`,
      `# Total Estimated Cycles: ${result.estimatedCycles}`,
      '',
      'Step,Actual,Predicted,Result,State_Before,State_After,Explanation',
    ];

    result.steps.forEach((s) => {
      const sanitizedExplanation = `"${s.explanation.replace(/"/g, '""')}"`;
      rows.push(
        `${s.index},${s.actual},${s.predicted},${s.correct ? 'HIT' : 'MISS'},${s.stateBefore},${s.stateAfter},${sanitizedExplanation}`
      );
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(rows.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute(
      'download',
      `branch_simulation_${result.predictorId}_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportComparisonCsv = () => {
    if (!comparisonResults || comparisonResults.length === 0) return;

    const rows: string[] = [
      `# Branch Predictors Multi-Algorithm Benchmark Comparison`,
      `# Generated: ${new Date().toISOString()}`,
      '',
      'Predictor_ID,Predictor_Name,Total_Branches,Hits,Misses,Accuracy_Pct,Misprediction_Rate_Pct,Est_Cycles',
    ];

    comparisonResults.forEach((r) => {
      rows.push(
        `${r.predictorId},"${r.predictorName}",${r.totalBranches},${r.correctPredictions},${r.mispredictions},${r.accuracy},${r.mispredictionRate},${r.estimatedCycles}`
      );
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(rows.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `predictors_comparison_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!result || result.steps.length === 0) return null;

  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        onClick={handleExportSingleCsv}
        className="px-2.5 py-1.5 rounded text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:text-zinc-100 border border-zinc-700 flex items-center space-x-1.5 transition"
      >
        <Download className="w-3.5 h-3.5 text-zinc-400" />
        <span>Export Run CSV</span>
      </button>

      {comparisonResults && comparisonResults.length > 0 && (
        <button
          type="button"
          onClick={handleExportComparisonCsv}
          className="px-2.5 py-1.5 rounded text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:text-zinc-100 border border-zinc-700 flex items-center space-x-1.5 transition"
        >
          <Download className="w-3.5 h-3.5 text-zinc-400" />
          <span>Export Comparison CSV</span>
        </button>
      )}
    </div>
  );
};

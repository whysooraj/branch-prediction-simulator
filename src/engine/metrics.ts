export interface CalculatedMetrics {
  totalBranches: number;
  correctPredictions: number;
  mispredictions: number;
  accuracy: number;
  mispredictionRate: number;
  estimatedCycles: number;
  baseCycles: number;
  penaltyCycles: number;
}

export function calculateMetrics(
  totalBranches: number,
  correctPredictions: number,
  baseCycles: number = 1,
  mispredictionPenalty: number = 5
): CalculatedMetrics {
  if (totalBranches <= 0) {
    return {
      totalBranches: 0,
      correctPredictions: 0,
      mispredictions: 0,
      accuracy: 0,
      mispredictionRate: 0,
      estimatedCycles: 0,
      baseCycles,
      penaltyCycles: mispredictionPenalty,
    };
  }

  const mispredictions = Math.max(0, totalBranches - correctPredictions);
  const accuracy = Number(((correctPredictions / totalBranches) * 100).toFixed(2));
  const mispredictionRate = Number(((mispredictions / totalBranches) * 100).toFixed(2));
  const estimatedCycles = totalBranches * baseCycles + mispredictions * mispredictionPenalty;

  return {
    totalBranches,
    correctPredictions,
    mispredictions,
    accuracy,
    mispredictionRate,
    estimatedCycles,
    baseCycles,
    penaltyCycles: mispredictionPenalty,
  };
}

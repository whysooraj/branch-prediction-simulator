import {
  BranchOutcome,
  PredictionStep,
  SimulationConfig,
  SimulationResult,
} from '../types';
import { calculateMetrics } from './metrics';
import { AVAILABLE_PREDICTORS, createPredictor } from '../predictors/registry';

export function runSimulation(config: SimulationConfig): SimulationResult {
  const { sequence, predictorId, initialState, baseCycles, mispredictionPenalty } = config;

  const predictor = createPredictor(predictorId, initialState);
  const steps: PredictionStep[] = [];
  let correctCount = 0;

  for (let i = 0; i < sequence.length; i++) {
    const actual = sequence[i];

    // 1. Predict first
    const predicted = predictor.predict();

    // 2. Compare second
    const correct = predicted === actual;
    if (correct) {
      correctCount++;
    }

    // 3. Update state third
    const updateResult = predictor.update(actual);

    steps.push({
      index: i + 1,
      actual,
      predicted,
      correct,
      stateBefore: updateResult.stateBefore,
      stateAfter: updateResult.stateAfter,
      bhrBefore: updateResult.bhrBefore,
      bhrAfter: updateResult.bhrAfter,
      explanation: updateResult.explanation,
    });
  }

  const metrics = calculateMetrics(
    sequence.length,
    correctCount,
    baseCycles,
    mispredictionPenalty
  );

  const predictorInfo = AVAILABLE_PREDICTORS.find((p) => p.id === predictorId);

  return {
    predictorId,
    predictorName: predictorInfo ? predictorInfo.name : predictorId,
    steps,
    totalBranches: metrics.totalBranches,
    correctPredictions: metrics.correctPredictions,
    mispredictions: metrics.mispredictions,
    accuracy: metrics.accuracy,
    mispredictionRate: metrics.mispredictionRate,
    estimatedCycles: metrics.estimatedCycles,
    baseCycles: metrics.baseCycles,
    penaltyCycles: metrics.penaltyCycles,
  };
}

export function compareAllPredictors(
  sequence: BranchOutcome[],
  baseCycles: number = 1,
  mispredictionPenalty: number = 5
): SimulationResult[] {
  return AVAILABLE_PREDICTORS.map((predictorInfo) => {
    return runSimulation({
      sequence,
      predictorId: predictorInfo.id,
      initialState: predictorInfo.defaultInitialState,
      baseCycles,
      mispredictionPenalty,
    });
  });
}

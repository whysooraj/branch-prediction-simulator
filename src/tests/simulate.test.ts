import { describe, it, expect } from 'vitest';
import { runSimulation, compareAllPredictors } from '../engine/simulate';
import { BranchOutcome } from '../types';

describe('runSimulation', () => {
  it('exactly reproduces Section 13 Specification Test Case', () => {
    const sequence: BranchOutcome[] = ['T', 'T', 'N', 'T', 'T', 'N', 'N', 'T'];

    const result = runSimulation({
      sequence,
      predictorId: 'two-bit',
      initialState: '01',
      baseCycles: 1,
      mispredictionPenalty: 5,
    });

    // Verify overall metrics
    expect(result.totalBranches).toBe(8);
    expect(result.correctPredictions).toBe(3);
    expect(result.mispredictions).toBe(5);
    expect(result.accuracy).toBe(37.5);
    expect(result.mispredictionRate).toBe(62.5);
    expect(result.estimatedCycles).toBe(33);

    // Verify step-by-step trace matching Section 13 table
    const expectedSteps = [
      { step: 1, actual: 'T', stateBefore: '01', predicted: 'N', correct: false, stateAfter: '10' },
      { step: 2, actual: 'T', stateBefore: '10', predicted: 'T', correct: true,  stateAfter: '11' },
      { step: 3, actual: 'N', stateBefore: '11', predicted: 'T', correct: false, stateAfter: '10' },
      { step: 4, actual: 'T', stateBefore: '10', predicted: 'T', correct: true,  stateAfter: '11' },
      { step: 5, actual: 'T', stateBefore: '11', predicted: 'T', correct: true,  stateAfter: '11' },
      { step: 6, actual: 'N', stateBefore: '11', predicted: 'T', correct: false, stateAfter: '10' },
      { step: 7, actual: 'N', stateBefore: '10', predicted: 'T', correct: false, stateAfter: '01' },
      { step: 8, actual: 'T', stateBefore: '01', predicted: 'N', correct: false, stateAfter: '10' },
    ];

    result.steps.forEach((step, idx) => {
      const exp = expectedSteps[idx];
      expect(step.index).toBe(exp.step);
      expect(step.actual).toBe(exp.actual);
      expect(step.stateBefore).toBe(exp.stateBefore);
      expect(step.predicted).toBe(exp.predicted);
      expect(step.correct).toBe(exp.correct);
      expect(step.stateAfter).toBe(exp.stateAfter);
    });
  });

  it('runs multi-predictor comparison on same sequence', () => {
    const sequence: BranchOutcome[] = ['T', 'T', 'T', 'N', 'T'];
    const results = compareAllPredictors(sequence, 1, 5);

    expect(results.length).toBe(5);
    expect(results.map((r) => r.predictorId)).toEqual([
      'always-taken',
      'always-not-taken',
      'one-bit',
      'two-bit',
      'global-history',
    ]);

    // Always-Taken on TTTNT has 4 correct (index 0,1,2,4), 1 miss
    const alwaysTaken = results.find((r) => r.predictorId === 'always-taken');
    expect(alwaysTaken?.correctPredictions).toBe(4);
    expect(alwaysTaken?.accuracy).toBe(80);
  });
});

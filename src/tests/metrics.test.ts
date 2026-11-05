import { describe, it, expect } from 'vitest';
import { calculateMetrics } from '../engine/metrics';

describe('calculateMetrics', () => {
  it('correctly calculates metrics for 100% accuracy', () => {
    const res = calculateMetrics(10, 10, 1, 5);
    expect(res.totalBranches).toBe(10);
    expect(res.correctPredictions).toBe(10);
    expect(res.mispredictions).toBe(0);
    expect(res.accuracy).toBe(100);
    expect(res.mispredictionRate).toBe(0);
    expect(res.estimatedCycles).toBe(10); // 10*1 + 0*5
  });

  it('correctly calculates metrics for 0% accuracy', () => {
    const res = calculateMetrics(10, 0, 1, 5);
    expect(res.accuracy).toBe(0);
    expect(res.mispredictionRate).toBe(100);
    expect(res.estimatedCycles).toBe(60); // 10*1 + 10*5
  });

  it('handles empty branch sequence without division by zero', () => {
    const res = calculateMetrics(0, 0, 1, 5);
    expect(res.accuracy).toBe(0);
    expect(res.mispredictionRate).toBe(0);
    expect(res.estimatedCycles).toBe(0);
  });

  it('computes cycles using custom base cycles and misprediction penalty', () => {
    // 8 branches, 3 correct, 5 mispredictions, base=2, penalty=7
    // cycles = (8 * 2) + (5 * 7) = 16 + 35 = 51
    const res = calculateMetrics(8, 3, 2, 7);
    expect(res.estimatedCycles).toBe(51);
  });
});

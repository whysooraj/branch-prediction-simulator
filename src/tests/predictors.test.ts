import { describe, it, expect } from 'vitest';
import { AlwaysTakenPredictor } from '../predictors/alwaysTaken';
import { AlwaysNotTakenPredictor } from '../predictors/alwaysNotTaken';
import { OneBitPredictor } from '../predictors/oneBit';
import { TwoBitPredictor } from '../predictors/twoBit';
import { GlobalHistoryPredictor } from '../predictors/globalHistory';

describe('AlwaysTakenPredictor', () => {
  it('always predicts T regardless of actual outcome', () => {
    const predictor = new AlwaysTakenPredictor();
    expect(predictor.predict()).toBe('T');
    predictor.update('N');
    expect(predictor.predict()).toBe('T');
    predictor.update('T');
    expect(predictor.predict()).toBe('T');
  });
});

describe('AlwaysNotTakenPredictor', () => {
  it('always predicts N regardless of actual outcome', () => {
    const predictor = new AlwaysNotTakenPredictor();
    expect(predictor.predict()).toBe('N');
    predictor.update('T');
    expect(predictor.predict()).toBe('N');
    predictor.update('N');
    expect(predictor.predict()).toBe('N');
  });
});

describe('OneBitPredictor', () => {
  it('updates state to the last actual branch outcome', () => {
    const predictor = new OneBitPredictor('N');
    expect(predictor.predict()).toBe('N');

    predictor.update('T');
    expect(predictor.predict()).toBe('T');

    predictor.update('N');
    expect(predictor.predict()).toBe('N');
  });

  it('maintains state when consecutive outcomes match', () => {
    const predictor = new OneBitPredictor('T');
    expect(predictor.predict()).toBe('T');

    predictor.update('T');
    expect(predictor.predict()).toBe('T');
  });
});

describe('TwoBitPredictor', () => {
  it('correctly transitions and saturates at 11 on repeated T', () => {
    const predictor = new TwoBitPredictor('00');
    expect(predictor.predict()).toBe('N'); // 00 -> N

    predictor.update('T'); // 00 -> 01
    expect(predictor.getState()).toBe('01');
    expect(predictor.predict()).toBe('N');

    predictor.update('T'); // 01 -> 10
    expect(predictor.getState()).toBe('10');
    expect(predictor.predict()).toBe('T');

    predictor.update('T'); // 10 -> 11
    expect(predictor.getState()).toBe('11');
    expect(predictor.predict()).toBe('T');

    predictor.update('T'); // 11 -> 11 (saturates)
    expect(predictor.getState()).toBe('11');
    expect(predictor.predict()).toBe('T');
  });

  it('correctly transitions and saturates at 00 on repeated N', () => {
    const predictor = new TwoBitPredictor('11');
    expect(predictor.predict()).toBe('T'); // 11 -> T

    predictor.update('N'); // 11 -> 10
    expect(predictor.getState()).toBe('10');
    expect(predictor.predict()).toBe('T');

    predictor.update('N'); // 10 -> 01
    expect(predictor.getState()).toBe('01');
    expect(predictor.predict()).toBe('N');

    predictor.update('N'); // 01 -> 00
    expect(predictor.getState()).toBe('00');
    expect(predictor.predict()).toBe('N');

    predictor.update('N'); // 00 -> 00 (saturates)
    expect(predictor.getState()).toBe('00');
    expect(predictor.predict()).toBe('N');
  });

  it('tolerates single anomalous outcome without immediately changing prediction polarity', () => {
    // Strongly Taken (11) with a single Not Taken should become Weakly Taken (10), still predicting T!
    const predictor = new TwoBitPredictor('11');
    predictor.update('N');
    expect(predictor.getState()).toBe('10');
    expect(predictor.predict()).toBe('T'); // Crucial dynamic feature
  });
});

describe('GlobalHistoryPredictor', () => {
  it('maintains 2-bit BHR history register correctly', () => {
    const predictor = new GlobalHistoryPredictor(2);
    expect(predictor.getBhr()).toBe('00');

    predictor.update('T'); // Shifts 1 into 00 -> 01
    expect(predictor.getBhr()).toBe('01');

    predictor.update('T'); // Shifts 1 into 01 -> 11
    expect(predictor.getBhr()).toBe('11');

    predictor.update('N'); // Shifts 0 into 11 -> 10
    expect(predictor.getBhr()).toBe('10');
  });
});

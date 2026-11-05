import { BranchOutcome, PredictorId, TwoBitState } from '../types';
import { BranchPredictor, UpdateResult } from './base';

export const TWO_BIT_STATE_NAMES: Record<TwoBitState, string> = {
  '00': 'Strongly Not Taken (00)',
  '01': 'Weakly Not Taken (01)',
  '10': 'Weakly Taken (10)',
  '11': 'Strongly Taken (11)',
};

export class TwoBitPredictor implements BranchPredictor {
  readonly id: PredictorId = 'two-bit';
  readonly name = '2-Bit Saturating Counter';
  private state: TwoBitState;
  private defaultState: TwoBitState;

  constructor(initialState: TwoBitState = '01') {
    this.defaultState = initialState;
    this.state = initialState;
  }

  getState(): TwoBitState {
    return this.state;
  }

  predict(): BranchOutcome {
    // Predict T for 10, 11 (MSB = 1); Predict N for 00, 01 (MSB = 0)
    return this.state === '10' || this.state === '11' ? 'T' : 'N';
  }

  update(actual: BranchOutcome): UpdateResult {
    const stateBefore = this.state;
    let stateAfter: TwoBitState = stateBefore;

    if (actual === 'T') {
      switch (stateBefore) {
        case '00':
          stateAfter = '01';
          break;
        case '01':
          stateAfter = '10';
          break;
        case '10':
          stateAfter = '11';
          break;
        case '11':
          stateAfter = '11'; // Saturates
          break;
      }
    } else {
      switch (stateBefore) {
        case '11':
          stateAfter = '10';
          break;
        case '10':
          stateAfter = '01';
          break;
        case '01':
          stateAfter = '00';
          break;
        case '00':
          stateAfter = '00'; // Saturates
          break;
      }
    }

    this.state = stateAfter;

    const explanation =
      actual === 'T'
        ? stateBefore === '11'
          ? 'Actual T: counter already at maximum state 11 (saturates).'
          : `Actual T: incremented counter from ${stateBefore} to ${stateAfter}.`
        : stateBefore === '00'
        ? 'Actual N: counter already at minimum state 00 (saturates).'
        : `Actual N: decremented counter from ${stateBefore} to ${stateAfter}.`;

    return {
      stateBefore,
      stateAfter,
      explanation,
    };
  }

  reset(initialState?: string): void {
    if (initialState === '00' || initialState === '01' || initialState === '10' || initialState === '11') {
      this.state = initialState;
      this.defaultState = initialState;
    } else {
      this.state = this.defaultState;
    }
  }
}

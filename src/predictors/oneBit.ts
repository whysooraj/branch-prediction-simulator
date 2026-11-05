import { BranchOutcome, OneBitState, PredictorId } from '../types';
import { BranchPredictor, UpdateResult } from './base';

export class OneBitPredictor implements BranchPredictor {
  readonly id: PredictorId = 'one-bit';
  readonly name = '1-Bit Dynamic';
  private state: OneBitState;
  private defaultState: OneBitState;

  constructor(initialState: OneBitState = 'N') {
    this.defaultState = initialState;
    this.state = initialState;
  }

  getState(): string {
    return this.state;
  }

  predict(): BranchOutcome {
    return this.state;
  }

  update(actual: BranchOutcome): UpdateResult {
    const stateBefore = this.state;
    this.state = actual;
    const stateAfter = this.state;

    const explanation =
      stateBefore === actual
        ? `Outcome ${actual} matched previous state ${stateBefore}. State retained as ${stateAfter}.`
        : `Outcome ${actual} differed from previous state ${stateBefore}. Updated state to ${stateAfter}.`;

    return {
      stateBefore,
      stateAfter,
      explanation,
    };
  }

  reset(initialState?: string): void {
    if (initialState === 'T' || initialState === 'N') {
      this.state = initialState;
      this.defaultState = initialState;
    } else {
      this.state = this.defaultState;
    }
  }
}

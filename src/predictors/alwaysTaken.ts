import { BranchOutcome, PredictorId } from '../types';
import { BranchPredictor, UpdateResult } from './base';

export class AlwaysTakenPredictor implements BranchPredictor {
  readonly id: PredictorId = 'always-taken';
  readonly name = 'Always-Taken';

  getState(): string {
    return 'T (Static)';
  }

  predict(): BranchOutcome {
    return 'T';
  }

  update(actual: BranchOutcome): UpdateResult {
    return {
      stateBefore: 'T',
      stateAfter: 'T',
      explanation: `Static predictor: always predicts Taken (T). Actual outcome was ${actual}. State remains unchanged.`,
    };
  }

  reset(): void {
    // Stateless
  }
}

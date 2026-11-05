import { BranchOutcome, PredictorId } from '../types';
import { BranchPredictor, UpdateResult } from './base';

export class AlwaysNotTakenPredictor implements BranchPredictor {
  readonly id: PredictorId = 'always-not-taken';
  readonly name = 'Always-Not-Taken';

  getState(): string {
    return 'N (Static)';
  }

  predict(): BranchOutcome {
    return 'N';
  }

  update(actual: BranchOutcome): UpdateResult {
    return {
      stateBefore: 'N',
      stateAfter: 'N',
      explanation: `Static predictor: always predicts Not-Taken (N). Actual outcome was ${actual}. State remains unchanged.`,
    };
  }

  reset(): void {
    // Stateless
  }
}

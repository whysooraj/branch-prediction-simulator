import { BranchOutcome, PredictorId } from '../types';

export interface UpdateResult {
  stateBefore: string;
  stateAfter: string;
  bhrBefore?: string;
  bhrAfter?: string;
  explanation: string;
}

export interface BranchPredictor {
  readonly id: PredictorId;
  readonly name: string;
  getState(): string;
  predict(): BranchOutcome;
  update(actual: BranchOutcome): UpdateResult;
  reset(initialState?: string): void;
}

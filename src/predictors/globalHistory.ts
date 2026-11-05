import { BranchOutcome, PredictorId, TwoBitState } from '../types';
import { BranchPredictor, UpdateResult } from './base';
import { TwoBitPredictor } from './twoBit';

export class GlobalHistoryPredictor implements BranchPredictor {
  readonly id: PredictorId = 'global-history';
  readonly name = 'Global History (BHR + PHT)';
  private bhrLength: number;
  private bhr: string; // e.g., '00'
  private pht: Map<string, TwoBitPredictor>;

  constructor(historyLength: number = 2) {
    this.bhrLength = historyLength;
    this.bhr = '0'.repeat(this.bhrLength);
    this.pht = new Map();
    this.initPht();
  }

  private initPht(): void {
    this.pht.clear();
    const totalEntries = Math.pow(2, this.bhrLength);
    for (let i = 0; i < totalEntries; i++) {
      const pattern = i.toString(2).padStart(this.bhrLength, '0');
      this.pht.set(pattern, new TwoBitPredictor('01'));
    }
  }

  getState(): string {
    const activeCounter = this.pht.get(this.bhr)?.getState() || '01';
    return `BHR: ${this.bhr} (PHT[${this.bhr}]=${activeCounter})`;
  }

  getBhr(): string {
    return this.bhr;
  }

  getPhtEntries(): { pattern: string; state: TwoBitState }[] {
    const list: { pattern: string; state: TwoBitState }[] = [];
    this.pht.forEach((predictor, pattern) => {
      list.push({ pattern, state: predictor.getState() as TwoBitState });
    });
    return list;
  }

  predict(): BranchOutcome {
    const counter = this.pht.get(this.bhr);
    return counter ? counter.predict() : 'N';
  }

  update(actual: BranchOutcome): UpdateResult {
    const bhrBefore = this.bhr;
    const counter = this.pht.get(bhrBefore);
    const counterBefore = counter ? counter.getState() : '01';

    const counterRes = counter ? counter.update(actual) : { stateAfter: '01' };
    const counterAfter = counterRes.stateAfter;

    // Shift new bit into BHR (T -> 1, N -> 0)
    const newBit = actual === 'T' ? '1' : '0';
    const bhrAfter = (bhrBefore + newBit).slice(-this.bhrLength);
    this.bhr = bhrAfter;

    const stateBefore = `BHR=${bhrBefore} [${counterBefore}]`;
    const stateAfter = `BHR=${bhrAfter} [${counterAfter}]`;

    return {
      stateBefore,
      stateAfter,
      bhrBefore,
      bhrAfter,
      explanation: `Indexed PHT with BHR "${bhrBefore}". Updated entry from ${counterBefore} to ${counterAfter}. Shifted "${newBit}" into BHR -> "${bhrAfter}".`,
    };
  }

  reset(initialState?: string): void {
    this.bhr = initialState && initialState.length === this.bhrLength ? initialState : '0'.repeat(this.bhrLength);
    this.initPht();
  }
}

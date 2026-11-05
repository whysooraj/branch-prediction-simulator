export interface BtbEntry {
  tag: string;           // e.g. "0x00400010"
  targetAddress: string; // e.g. "0x00400048"
  valid: boolean;
  predictedOutcome: 'T' | 'N';
  hitCount: number;
}

export interface BtbLookupResult {
  hit: boolean;
  predictedTarget: string | null;
  outcome: 'T' | 'N';
  penaltyCyclesIncurred: number;
  explanation: string;
}

export class BranchTargetBuffer {
  private capacity: number;
  private entries: Map<string, BtbEntry>;

  constructor(capacity: number = 8) {
    this.capacity = capacity;
    this.entries = new Map();
  }

  lookup(branchAddress: string): BtbLookupResult {
    const entry = this.entries.get(branchAddress);

    if (!entry || !entry.valid) {
      return {
        hit: false,
        predictedTarget: null,
        outcome: 'N',
        penaltyCyclesIncurred: 2, // Standard BTB miss penalty to decode target
        explanation: `BTB Miss: Address ${branchAddress} not in BTB. Processor must wait until decode stage to calculate branch target.`,
      };
    }

    entry.hitCount++;
    return {
      hit: true,
      predictedTarget: entry.targetAddress,
      outcome: entry.predictedOutcome,
      penaltyCyclesIncurred: 0,
      explanation: `BTB Hit: Address ${branchAddress} found! Predicted target ${entry.targetAddress} fetched immediately without pipeline bubbles.`,
    };
  }

  update(
    branchAddress: string,
    actualTarget: string,
    actualOutcome: 'T' | 'N'
  ): void {
    if (this.entries.size >= this.capacity && !this.entries.has(branchAddress)) {
      // Evict least used / first entry
      const oldestKey = this.entries.keys().next().value;
      if (oldestKey) {
        this.entries.delete(oldestKey);
      }
    }

    const existing = this.entries.get(branchAddress);
    this.entries.set(branchAddress, {
      tag: branchAddress,
      targetAddress: actualTarget,
      valid: true,
      predictedOutcome: actualOutcome,
      hitCount: existing ? existing.hitCount : 1,
    });
  }

  getEntries(): BtbEntry[] {
    return Array.from(this.entries.values());
  }

  clear(): void {
    this.entries.clear();
  }
}

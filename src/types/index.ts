export type BranchOutcome = 'T' | 'N';

export type OneBitState = 'T' | 'N';
export type TwoBitState = '00' | '01' | '10' | '11';

export type PredictorId =
  | 'always-taken'
  | 'always-not-taken'
  | 'one-bit'
  | 'two-bit'
  | 'global-history';

export interface PredictorInfo {
  id: PredictorId;
  name: string;
  category: 'Static' | 'Dynamic' | 'Correlating';
  description: string;
  supportsInitialState: boolean;
  initialStateOptions?: { value: string; label: string }[];
  defaultInitialState?: string;
}

export interface PredictionStep {
  index: number;
  actual: BranchOutcome;
  predicted: BranchOutcome;
  correct: boolean;
  stateBefore: string;
  stateAfter: string;
  bhrBefore?: string;
  bhrAfter?: string;
  explanation: string;
}

export interface SimulationResult {
  predictorId: PredictorId;
  predictorName: string;
  steps: PredictionStep[];
  totalBranches: number;
  correctPredictions: number;
  mispredictions: number;
  accuracy: number;
  mispredictionRate: number;
  estimatedCycles: number;
  baseCycles: number;
  penaltyCycles: number;
}

export interface SimulationConfig {
  sequence: BranchOutcome[];
  predictorId: PredictorId;
  initialState?: string;
  baseCycles: number;
  mispredictionPenalty: number;
  historyLength?: number;
}

export interface SampleSequence {
  id: string;
  name: string;
  description: string;
  pattern: string;
}

export interface PipelineStageState {
  stage: 'IF' | 'ID' | 'EX' | 'MEM' | 'WB';
  instruction: string;
  status: 'active' | 'stalled' | 'flushed' | 'empty';
}

export interface PipelineCycleSnapshot {
  cycle: number;
  branchIndex: number;
  stages: Record<'IF' | 'ID' | 'EX' | 'MEM' | 'WB', string>;
  isFlush: boolean;
  penaltyRemaining: number;
  comment: string;
}

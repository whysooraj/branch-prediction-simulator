import { PredictorId, PredictorInfo } from '../types';
import { AlwaysNotTakenPredictor } from './alwaysNotTaken';
import { AlwaysTakenPredictor } from './alwaysTaken';
import { BranchPredictor } from './base';
import { GlobalHistoryPredictor } from './globalHistory';
import { OneBitPredictor } from './oneBit';
import { TwoBitPredictor } from './twoBit';

export const AVAILABLE_PREDICTORS: PredictorInfo[] = [
  {
    id: 'always-taken',
    name: 'Always-Taken',
    category: 'Static',
    description: 'Static predictor: always predicts branches are Taken (T). Zero hardware state.',
    supportsInitialState: false,
  },
  {
    id: 'always-not-taken',
    name: 'Always-Not-Taken',
    category: 'Static',
    description: 'Static predictor: always predicts branches are Not Taken (N). Zero hardware state.',
    supportsInitialState: false,
  },
  {
    id: 'one-bit',
    name: '1-Bit Dynamic',
    category: 'Dynamic',
    description: 'Stores the last actual outcome of the branch. Mispredicts twice on loop exits.',
    supportsInitialState: true,
    initialStateOptions: [
      { value: 'N', label: 'Not Taken (N)' },
      { value: 'T', label: 'Taken (T)' },
    ],
    defaultInitialState: 'N',
  },
  {
    id: 'two-bit',
    name: '2-Bit Saturating Counter',
    category: 'Dynamic',
    description: '4-state saturating FSM (00, 01, 10, 11). Tolerates single anomalous branch outcomes.',
    supportsInitialState: true,
    initialStateOptions: [
      { value: '00', label: '00 - Strongly Not Taken' },
      { value: '01', label: '01 - Weakly Not Taken (Default)' },
      { value: '10', label: '10 - Weakly Taken' },
      { value: '11', label: '11 - Strongly Taken' },
    ],
    defaultInitialState: '01',
  },
  {
    id: 'global-history',
    name: 'Global History (BHR + PHT)',
    category: 'Correlating',
    description: 'Correlating 2-level adaptive predictor using a Branch History Register and Pattern History Table.',
    supportsInitialState: true,
    initialStateOptions: [
      { value: '00', label: 'BHR = 00' },
      { value: '01', label: 'BHR = 01' },
      { value: '10', label: 'BHR = 10' },
      { value: '11', label: 'BHR = 11' },
    ],
    defaultInitialState: '00',
  },
];

export function createPredictor(id: PredictorId, initialState?: string): BranchPredictor {
  switch (id) {
    case 'always-taken':
      return new AlwaysTakenPredictor();
    case 'always-not-taken':
      return new AlwaysNotTakenPredictor();
    case 'one-bit':
      return new OneBitPredictor((initialState as 'T' | 'N') || 'N');
    case 'two-bit':
      return new TwoBitPredictor(
        (initialState as '00' | '01' | '10' | '11') || '01'
      );
    case 'global-history':
      const predictor = new GlobalHistoryPredictor(2);
      if (initialState) predictor.reset(initialState);
      return predictor;
    default:
      return new TwoBitPredictor('01');
  }
}

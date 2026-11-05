import { SampleSequence } from '../types';

export const SAMPLE_SEQUENCES: SampleSequence[] = [
  {
    id: 'section-13-spec',
    name: 'Section 13 Spec Test Case',
    description: 'The canonical benchmark sequence from specification Section 13 (T T N T T N N T).',
    pattern: 'T T N T T N N T',
  },
  {
    id: 'loop-counter-8',
    name: 'Simple For-Loop (8 iterations)',
    description: 'A typical loop executing 8 times before exiting (8 Taken, 1 Not-Taken).',
    pattern: 'T T T T T T T T N',
  },
  {
    id: 'nested-loop',
    name: 'Nested Loop Iterations',
    description: 'Inner loop terminating periodically with occasional exit conditions.',
    pattern: 'T T T N T T T N T T T N',
  },
  {
    id: 'alternating-if-else',
    name: 'Alternating Even/Odd Branches',
    description: 'Pathological worst-case for 1-bit predictors (continuous flips).',
    pattern: 'T N T N T N T N T N',
  },
  {
    id: 'mostly-taken',
    name: 'Heavily Biased Taken (90%)',
    description: 'Frequent branch execution with rare exceptions (e.g., error checks).',
    pattern: 'T T T T T T T N T T T T T T T',
  },
  {
    id: 'mostly-not-taken',
    name: 'Rare Event / Guard Clause (90% N)',
    description: 'Rarely taken branches such as exception traps or null checks.',
    pattern: 'N N N N N N N T N N N N N N N',
  },
  {
    id: 'bursty-phases',
    name: 'Phase-Changing Burst Sequence',
    description: 'Execution shifts between intensive loop bursts and sequential runs.',
    pattern: 'T T T T N N N N T T T T N N N N',
  },
];

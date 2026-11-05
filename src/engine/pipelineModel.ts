import { BranchOutcome, PipelineCycleSnapshot } from '../types';

export function generatePipelineTrace(
  sequence: BranchOutcome[],
  predictions: { predicted: BranchOutcome; correct: boolean }[],
  penaltyCycles: number = 3
): PipelineCycleSnapshot[] {
  const snapshots: PipelineCycleSnapshot[] = [];
  let currentCycle = 1;

  for (let b = 0; b < sequence.length; b++) {
    const isCorrect = predictions[b]?.correct ?? true;
    const branchLabel = `BR_${b + 1} (${sequence[b]})`;

    if (isCorrect) {
      // Normal flow: branch moves through pipeline, next instruction follows smoothly
      snapshots.push({
        cycle: currentCycle++,
        branchIndex: b + 1,
        stages: {
          IF: `Instr_${b + 1}.1`,
          ID: branchLabel,
          EX: b > 0 ? `Instr_${b}.1` : 'NOP',
          MEM: 'NOP',
          WB: 'NOP',
        },
        isFlush: false,
        penaltyRemaining: 0,
        comment: `${branchLabel} predicted CORRECTLY. Speculative fetch valid; zero bubbles.`,
      });
    } else {
      // Mispredicted flow:
      // 1. Branch reaches EX stage and resolves mispredicted
      snapshots.push({
        cycle: currentCycle++,
        branchIndex: b + 1,
        stages: {
          IF: '[SQUASH: Wrong Path]',
          ID: '[SQUASH: Wrong Path]',
          EX: `${branchLabel} [RESOLVE MISPREDICT]`,
          MEM: 'NOP',
          WB: 'NOP',
        },
        isFlush: true,
        penaltyRemaining: penaltyCycles,
        comment: `MISPREDICTION detected in EX stage! Pipeline squash triggered for speculative IF/ID stages.`,
      });

      // 2. Penalty stall cycles (bubbles)
      for (let p = 1; p <= penaltyCycles; p++) {
        snapshots.push({
          cycle: currentCycle++,
          branchIndex: b + 1,
          stages: {
            IF: `[BUBBLE / STALL ${p}/${penaltyCycles}]`,
            ID: 'BUBBLE',
            EX: 'BUBBLE',
            MEM: p === 1 ? branchLabel : 'BUBBLE',
            WB: p === 2 ? branchLabel : 'BUBBLE',
          },
          isFlush: true,
          penaltyRemaining: penaltyCycles - p,
          comment: `Pipeline refilling with correct target PC. Stall penalty cycle ${p} of ${penaltyCycles}.`,
        });
      }

      // 3. Resumption cycle
      snapshots.push({
        cycle: currentCycle++,
        branchIndex: b + 1,
        stages: {
          IF: `Target_${b + 1} [Correct Path]`,
          ID: 'BUBBLE',
          EX: 'BUBBLE',
          MEM: 'BUBBLE',
          WB: 'NOP',
        },
        isFlush: false,
        penaltyRemaining: 0,
        comment: `Pipeline recovered. Correct target instruction successfully fetched into IF stage.`,
      });
    }
  }

  return snapshots;
}

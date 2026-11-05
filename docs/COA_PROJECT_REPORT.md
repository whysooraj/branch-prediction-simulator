# Interactive Branch Prediction Simulator for CPU Performance Analysis
**Course:** Computer Organization and Architecture (COA)  
**Project Report**

---

## Abstract

In modern pipelined microprocessors, control hazards stemming from conditional branches present a primary bottleneck to instruction-level parallelism. Until a conditional branch resolves in the execution stage of the pipeline, the processor cannot determine the address of the next instruction without stalling. Branch prediction mitigates this penalty by speculatively fetching instructions along a predicted path.

This project delivers an interactive, client-side simulator developed in TypeScript and React that models static (Always-Taken, Always-Not-Taken), dynamic (1-bit and 2-bit saturating counters), and correlating (Global History Register + Pattern History Table) branch prediction algorithms. The system calculates prediction accuracy, misprediction rates, and estimated cycle penalties under a configurable 5-stage RISC pipeline model. The simulator also demonstrates the architectural role of a Branch Target Buffer (BTB). Experimental validation demonstrates strict compliance with theoretical benchmarks, including the canonical Section 13 test case ($37.5\%$ accuracy, $33$ cycles).

---

## 1. Problem Statement & Motivation

Pipelined architectures overlap the execution of multiple instructions across sequential stages (typically Instruction Fetch [IF], Instruction Decode [ID], Execute [EX], Memory Access [MEM], and Write Back [WB]). Conditional branch instructions introduce control dependencies:

1. **Resolution Delay:** The condition evaluation and branch target address calculation occur in the EX stage (cycle 3).
2. **Stall Penalties:** Without branch prediction, the processor must stall for $P$ clock cycles (bubbles), degrading the Instructions Per Cycle (IPC) metric.
3. **Speculative Execution:** With branch prediction, the instruction fetch unit speculatively loads instructions along the predicted path. If the prediction is correct (**Hit**), execution continues uninterrupted with zero penalty bubbles. If the prediction is incorrect (**Miss**), all instructions speculatively fetched in IF and ID must be squashed (flushed) and replaced with NOPs, incurring a misprediction penalty $P$.

Developing an educational simulator allows students and engineers to observe state transitions, compare algorithm resilience under various branch patterns, and quantify the cycle costs of speculative execution.

---

## 2. Theoretical Background & Algorithms

### 2.1 Static Predictors
Static predictors make compile-time or hardware-fixed assumptions without maintaining runtime history:
- **Always-Taken:** Assumes all conditional branches evaluate to Taken ($T$). Effective for loop-closing branches where backward jumps are predominant.
- **Always-Not-Taken:** Assumes all conditional branches evaluate to Not Taken ($N$). Execution defaults to the sequential program counter ($PC + 4$).

### 2.2 1-Bit Dynamic Predictor
A 1-bit dynamic predictor maintains the last observed outcome for a branch.
- **State $T$:** Predicts Taken.
- **State $N$:** Predicts Not Taken.
- **Limitation:** In a loop executing $N$ times, a 1-bit predictor mispredicts twice: once upon loop exit (when it expects $T$ but encounters $N$) and once upon re-entering the loop (when it expects $N$ based on the exit condition). For $N=10$, maximum accuracy is bounded at $80\%$.

### 2.3 2-Bit Saturating Counter Predictor
To prevent single anomalous branch decisions from inverting predictions, Jim Smith (1981) introduced the 2-bit saturating counter finite state machine.
- **States:**
  - `00`: Strongly Not Taken (Predicts $N$)
  - `01`: Weakly Not Taken (Predicts $N$)
  - `10`: Weakly Taken (Predicts $T$)
  - `11`: Strongly Taken (Predicts $T$)
- **Transition Rule:** Increment on actual $T$ (saturating at `11`); decrement on actual $N$ (saturating at `00`).
- **Advantage:** Requires two consecutive mispredictions to flip the predicted direction from Taken to Not Taken, achieving over $90\%$ accuracy on steady-state loops.

### 2.4 Correlating / Global History Predictor
Branches are frequently correlated: the outcome of branch $B_2$ often depends on branch $B_1$. A correlating predictor utilizes:
- An $n$-bit **Branch History Register (BHR)** recording the global history of the last $n$ branches.
- A **Pattern History Table (PHT)** containing $2^n$ 2-bit saturating counters indexed by the BHR.

### 2.5 Branch Target Buffer (BTB)
Direction predictors determine *whether* a branch is taken, but the target address must still be calculated. A BTB caches the association between the branch instruction address ($PC$) and its target address ($Target$). On a BTB Hit, the target address is available at the end of the IF stage, eliminating target calculation stalls.

---

## 3. Mathematical Model & Metrics

For a branch outcome sequence of length $B$:
- $C$ = Number of correct predictions (Hits)
- $M = B - C$ = Number of mispredictions (Misses)
- $P$ = Configured pipeline misprediction penalty in cycles
- $C_{\text{base}}$ = Base execution cycles allocated per branch (standard: $1$)

$$\text{Prediction Accuracy (\%)} = \left(\frac{C}{B}\right) \times 100$$

$$\text{Misprediction Rate (\%)} = \left(\frac{M}{B}\right) \times 100$$

$$\text{Estimated Execution Cycles} = (B \times C_{\text{base}}) + (M \times P)$$

---

## 4. Architectural Implementation

The simulator is built with clean architectural boundaries separating computation from presentation:

```text
+--------------------------------------------------------------+
|                        User Interface                        |
|   (SequenceInput, ConfigPanel, StateDiagram, PipelineView)   |
+------------------------------+-------------------------------+
                               |
                               v
+--------------------------------------------------------------+
|                      Simulation Engine                       |
|  1. validateAndNormalizeSequence                             |
|  2. runSimulation (Strict Predict -> Compare -> Update)      |
|  3. calculateMetrics (Deterministic formula calculation)     |
|  4. generatePipelineTrace (Cycle-by-cycle stall/flush model) |
+------------------------------+-------------------------------+
                               |
                               v
+--------------------------------------------------------------+
|                    Predictor Implementations                 |
|   - AlwaysTakenPredictor         - TwoBitPredictor           |
|   - AlwaysNotTakenPredictor      - GlobalHistoryPredictor    |
|   - OneBitPredictor              - BranchTargetBuffer        |
+--------------------------------------------------------------+
```

### Order of Operations Guarantee
The engine enforces the fundamental temporal constraint of speculative execution:
```typescript
// 1. Predict first (using current state)
const predicted = predictor.predict();

// 2. Compare second (evaluate correctness)
const correct = predicted === actual;

// 3. Update state third (transition FSM based on actual outcome)
const updateResult = predictor.update(actual);
```
Updating prior to prediction would introduce temporal leakage (using future information the hardware cannot possess).

---

## 5. Experimental Verification & Test Results

The simulation engine was verified using an automated Vitest test suite comprising 20 unit tests across 4 test suites.

### Canonical Section 13 Benchmark Verification
- **Input Sequence:** `T T N T T N N T`
- **Predictor:** 2-Bit Saturating Counter
- **Initial State:** `01` (Weakly Not Taken)
- **Base Cycles ($C_{\text{base}}$):** $1$
- **Misprediction Penalty ($P$):** $5$

#### Step-by-Step Execution Trace

| Step | Actual | State Before | Prediction | Result | State After | Explanation |
|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| 1 | T | 01 | N | **MISS** | 10 | Incremented 01 to 10 |
| 2 | T | 10 | T | **HIT**  | 11 | Incremented 10 to 11 |
| 3 | N | 11 | T | **MISS** | 10 | Decremented 11 to 10 |
| 4 | T | 10 | T | **HIT**  | 11 | Incremented 10 to 11 |
| 5 | T | 11 | T | **HIT**  | 11 | Saturates at 11 |
| 6 | N | 11 | T | **MISS** | 10 | Decremented 11 to 10 |
| 7 | N | 10 | T | **MISS** | 01 | Decremented 10 to 01 |
| 8 | T | 01 | N | **MISS** | 10 | Incremented 01 to 10 |

#### Empirical Results
- Total Branches ($B$): $8$
- Correct Predictions ($C$): $3$
- Mispredictions ($M$): $5$
- Prediction Accuracy: $\frac{3}{8} \times 100 = \mathbf{37.5\%}$
- Misprediction Rate: $\frac{5}{8} \times 100 = \mathbf{62.5\%}$
- Estimated Cycles: $(8 \times 1) + (5 \times 5) = 8 + 25 = \mathbf{33\text{ cycles}}$

All automated assertions matched the analytical specification with $100\%$ precision.

---

## 6. Viva Examination & Defense Questions

**Q1: Why is branch prediction necessary in pipelined CPUs?**  
*Answer:* In pipelined processors, instructions are fetched before earlier instructions complete execution. Branches alter the control flow, but the outcome is unknown until the Execute (EX) stage. Without prediction, the CPU must stall for $2$ to $5+$ cycles for every branch, severely degrading throughput.

**Q2: What is the main drawback of a 1-bit predictor compared to a 2-bit predictor?**  
*Answer:* A 1-bit predictor changes its prediction upon every single anomalous branch outcome. In loops, it mispredicts twice: once at the exit and once upon re-entering. A 2-bit saturating counter requires two consecutive mispredictions to change its prediction direction, remaining robust against isolated anomalies.

**Q3: What is the difference between branch direction prediction and a Branch Target Buffer (BTB)?**  
*Answer:* Direction prediction determines *whether* a conditional branch evaluates to Taken or Not Taken. A BTB caches the actual *target address* of the branch. Even with a Taken prediction, if the target address is not cached, the fetch unit cannot fetch the target instruction until the decode stage.

**Q4: How does misprediction penalty scale with deeper pipelines?**  
*Answer:* In deeper pipelines (e.g., Intel NetBurst with 20-31 stages), branch resolution occurs much later in the pipeline. Consequently, the misprediction penalty $P$ is substantially larger ($20+$ cycles), making high prediction accuracy critical for performance.

---

## 7. Conclusion

The Interactive Branch Prediction Simulator provides a mathematically rigorous, deterministic, and educational platform for analyzing CPU branch prediction and pipeline stall dynamics. By modeling both static and dynamic algorithms alongside interactive FSM diagrams, cycle penalty models, and BTB cache simulations, the project bridges theoretical computer architecture concepts with empirical performance analysis.

---

## 8. References

1. David A. Patterson and John L. Hennessy, *Computer Organization and Design: The Hardware/Software Interface*, 6th Edition, Morgan Kaufmann.
2. William Stallings, *Computer Organization and Architecture: Designing for Performance*, 11th Edition, Pearson.
3. John L. Hennessy and David A. Patterson, *Computer Architecture: A Quantitative Approach*, 6th Edition.
4. J. E. Smith, "A Study of Branch Prediction Strategies," *Proceedings of the 8th Annual Symposium on Computer Architecture*, 1981.

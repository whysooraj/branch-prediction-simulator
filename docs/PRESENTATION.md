# Interactive Branch Prediction Simulator for CPU Performance Analysis
## Project Presentation & Viva Defense Guide

---

### Slide 1: Title Slide
- **Title:** Interactive Branch Prediction Simulator for CPU Performance Analysis
- **Course:** Computer Organization and Architecture (COA)
- **Domain:** Processor Microarchitecture & Pipeline Hazards
- **Core Contribution:** Interactive modeling of static, dynamic, and correlating predictors with 5-stage pipeline flush visualization and empirical cycle analysis.

---

### Slide 2: The Problem: Control Hazards in Instruction Pipelines
- **Background:** Modern processors overlap instruction execution across 5 stages (IF, ID, EX, MEM, WB).
- **The Hazard:** Conditional branch direction is evaluated in the **EX** stage.
- **The Bottleneck:** Waiting for branch resolution introduces 2 to 5+ cycle stalls (pipeline bubbles), reducing IPC.
- **The Solution:** Speculative execution using Branch Prediction to fetch instructions along the predicted path without waiting.

---

### Slide 3: Objectives & Scope
1. Implement static predictors (Always-Taken, Always-Not-Taken).
2. Implement dynamic predictors (1-Bit, 2-Bit Saturating Counter).
3. Implement correlating predictors (Global History BHR + PHT).
4. Implement an interactive Branch Target Buffer (BTB) module.
5. Provide step-by-step state transition visualization with dynamic SVG FSM diagrams.
6. Quantify performance with accuracy, misprediction rate, and estimated cycle metrics.
7. Support side-by-side multi-predictor comparative analysis and CSV data export.

---

### Slide 4: Mathematical Modeling
- **Total Branches:** $B$
- **Correct Predictions:** $C$
- **Mispredictions:** $M = B - C$
- **Prediction Accuracy:** $(C / B) \times 100\%$
- **Misprediction Rate:** $(M / B) \times 100\%$
- **Estimated Cycles:** $(B \times C_{\text{base}}) + (M \times P)$
  - $C_{\text{base}}$: Base cycles per branch instruction (default: 1)
  - $P$: Configured pipeline flush penalty (default: 5 cycles)

---

### Slide 5: The 2-Bit Saturating Counter FSM
- 4 States:
  - `00`: Strongly Not Taken (Predict N)
  - `01`: Weakly Not Taken (Predict N)
  - `10`: Weakly Taken (Predict T)
  - `11`: Strongly Taken (Predict T)
- **Hysteresis Advantage:** An isolated anomalous outcome (e.g., loop exit) transitions state from Strongly to Weakly without inverting future predictions.
- Overcomes the "double misprediction" weakness of 1-bit predictors on repetitive loops.

---

### Slide 6: System Architecture & Separation of Concerns
- **Client-Side Engine:** Built with TypeScript for deterministic, zero-server execution.
- **Strict Invariant:** Order of operations strictly enforced:
  1. Predict first
  2. Compare second
  3. Update state third
- **Modular Design:** UI layer decoupled from the simulation engine, allowing automated unit testing of algorithms independent of React rendering.

---

### Slide 7: Verification & Benchmark Results
- **Specification Test Case (Section 13):**
  - Sequence: `T T N T T N N T`
  - Algorithm: 2-bit saturating counter, starting state `01`
  - Base cycles: 1, Penalty: 5
- **Results:**
  - Hits: 3, Misses: 5
  - Accuracy: $37.5\%$
  - Misprediction Rate: $62.5\%$
  - Estimated Cycles: $(8 \times 1) + (5 \times 5) = 33\text{ cycles}$
- **Unit Test Coverage:** 20 Vitest automated tests passing with zero errors.

---

### Slide 8: Interactive Demonstration Walkthrough
1. **Input Panel:** Load standard loop or burst sequence, or enter custom string.
2. **Interactive Stepper:** Step through branches one-by-one; observe real-time SVG FSM node illumination and state updates.
3. **Pipeline Inspector:** Observe exact cycles where squashes occur and bubble stalls fill the pipeline.
4. **Comparison View:** Evaluate accuracy and cycle trade-offs across all 5 algorithms using Recharts bar graphs.
5. **BTB Module:** Demonstrate how caching target addresses prevents target-calculation bubbles during instruction fetch.
6. **CSV Export:** Download simulation logs for laboratory reports.

---

### Slide 9: Viva Defense - Key Microarchitectural Takeaways
- **Branch Direction vs BTB:** Direction prediction answers *if* we jump; BTB answers *where* we jump.
- **Pipeline Depth Sensitivity:** As pipeline depth increases, misprediction penalty $P$ grows, making advanced predictors (e.g., Tournament, TAGE) essential in modern CPUs.
- **Static vs Dynamic:** Static has zero hardware overhead but poor adaptation; dynamic adapts to runtime behavior at the cost of counter storage.

---

### Slide 10: Conclusion & References
- Successfully implemented a 100% complete, fully verified educational simulator for CPU branch prediction analysis.
- Connects fundamental computer architecture theory with interactive simulation.
- References:
  - Patterson & Hennessy, *Computer Organization and Design*.
  - Stallings, *Computer Organization and Architecture*.

# Interactive Branch Prediction Simulator - Presentation Guide

**Project Title:** Interactive Branch Prediction Simulator for CPU Performance Analysis  
**Course:** Computer Organization & Architecture (COA)  
**Format:** Viva / Slide Deck Outline & Live Demonstration Script  

---

## Slide 1: Title & Introduction
- **Title:** Interactive Branch Prediction Simulator for CPU Performance Analysis
- **Subtitle:** Analyzing Control Hazards, Dynamic FSM State Transitions, and Pipeline Stall Penalties
- **Key Message:** Demonstrating how hardware branch prediction bridges the gap between theoretical $CPI = 1.0$ and real-world pipelined processor performance.

---

## Slide 2: The Control Hazard Problem
- **Why Pipelines Stall:** In a 5-stage RISC pipeline (IF, ID, EX, MEM, WB), branch decisions resolve in the EX stage (Cycle 3).
- **The Cost of Waiting:** 2 to 3 stall cycles for every branch instruction.
- **The Solution:** Speculative execution driven by branch direction prediction + Branch Target Buffer (BTB).

---

## Slide 3: Prediction Strategies Overview
- **Static Predictors:** Always-Taken & Always-Not-Taken (zero hardware overhead).
- **1-Bit Dynamic:** Tracks last outcome; suffers from double-mispredictions on loop exits.
- **2-Bit Saturating Counter:** 4-state FSM (`00`, `01`, `10`, `11`). Absorbs transient anomalies without flipping polarity.
- **Global History (BHR + PHT):** Correlating predictor identifying dependencies between successive branch instructions.
- **Branch Target Buffer (BTB):** Associative target address cache enabling zero-stall instruction fetch.

---

## Slide 4: Mathematical Evaluation Model
- **Accuracy (%):** $\frac{\text{Correct}}{\text{Total}} \times 100$
- **Misprediction Rate (%):** $\frac{\text{Misses}}{\text{Total}} \times 100$
- **Estimated Total Cycles:**
  $$\text{Cycles} = (\text{Total Branches} \times C_{\text{base}}) + (\text{Mispredictions} \times P)$$
- **Takeaway:** As pipeline depth increases ($P \uparrow$), prediction accuracy becomes exponentially more critical to CPU throughput.

---

## Slide 5: System Architecture & Engine Design
- **Separation of Concerns:** Pure TypeScript mathematical simulation engine decoupled from React 18 UI components.
- **Golden Order of Operations:**
  1. `predict()` &rarr; 2. `compare()` &rarr; 3. `update()`
- **Verification:** 100% automated test coverage in Vitest verifying mathematical precision and edge saturation.

---

## Slide 6: Benchmark Case Study (Section 13)
- **Sequence:** `T T N T T N N T`
- **Predictor:** 2-Bit Saturating Counter (Initial State: `01`)
- **Penalty:** 5 cycles, Base: 1 cycle
- **Results:**
  - Hits: 3 | Misses: 5
  - Accuracy: 37.5% | Misprediction Rate: 62.5%
  - Total Cycles: 33 cycles
- **Demonstration:** Exact match with manual trace tables and theoretical FSM state transitions.

---

## Slide 7: Live Demonstration Walkthrough
1. **Interactive Stepping:** Step through `T T N T T N N T` observing real-time SVG FSM counter transitions.
2. **5-Stage Pipeline Hazard Inspector:** Observe branch squashes in EX stage and red bubble stall injections.
3. **Compare All Predictors:** Recharts bar graphs contrasting accuracy and execution cycles side-by-side.
4. **BTB Explorer:** Simulate PC lookups and demonstrate target address cache hits vs misses.
5. **CSV Export:** Download simulation run data for external analysis.

---

## Slide 8: Conclusion & Key Learnings
- 2-bit counters significantly outperform 1-bit counters on nested loops by requiring two consecutive mispredictions to flip prediction state.
- Deep pipelines require high-accuracy predictors to prevent stall cycle dominance.
- The simulator provides an intuitive, interactive platform for COA education.

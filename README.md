# Interactive Branch Prediction Simulator for CPU Performance Analysis

A high-performance, browser-based educational simulator designed for Computer Organization and Architecture (COA) education and CPU performance analysis. This simulator models conditional branch direction prediction, dynamic state transitions, pipeline hazard squashing, and cycle misprediction penalties.

---

## 1. Features

- **Multi-Predictor Support:**
  - **Always-Taken:** Static baseline predictor.
  - **Always-Not-Taken:** Static baseline predictor.
  - **1-Bit Dynamic:** Single-state predictor tracking the last observed outcome.
  - **2-Bit Saturating Counter:** 4-state Finite State Machine (`00`, `01`, `10`, `11`) requiring two consecutive mispredictions to flip prediction polarity.
  - **Global / Correlating Predictor:** 2-level adaptive predictor using an $n$-bit Branch History Register (BHR) and Pattern History Table (PHT).
  - **Branch Target Buffer (BTB):** Interactive module demonstrating branch target address caching in instruction fetch.
- **Interactive Step-by-Step Execution:**
  - Step forward and backward through branch sequences.
  - Automatic playback with adjustable speed controls.
  - Instant full-sequence execution.
- **Visual Hardware State Machine:**
  - Real-time SVG Finite State Machine diagram for the 2-bit saturating counter displaying active state highlights and transition arrows.
- **CPU 5-Stage Pipeline Hazard Inspector:**
  - Visualizes Instruction Fetch (IF), Instruction Decode (ID), Execute (EX), Memory (MEM), and Writeback (WB).
  - Highlights branch resolution at the EX stage, speculative instruction squash, and bubble penalty insertion.
- **Performance Analysis & Comparison:**
  - Side-by-side comparative Recharts bar charts for prediction accuracy and cycle execution costs.
  - Configurable pipeline misprediction penalty ($P$) and base branch cycles ($C_{\text{base}}$).
- **Data Import / Export:**
  - Built-in benchmark presets (including the Section 13 specification test case, loop counters, and alternating branches).
  - Random sequence generator with length and taken-bias controls.
  - CSV export for individual simulation runs and multi-predictor comparison summaries.
- **Rigorous Verification:**
  - Fully tested simulation engine with Vitest, verifying the exact Section 13 benchmark test case.

---

## 2. Theoretical Mathematical Model

Let:
- $B$: Total branch instructions in the sequence
- $C$: Number of correct branch predictions (hits)
- $M$: Number of incorrect branch predictions (misses), where $M = B - C$
- $P$: Configured pipeline misprediction penalty in cycles
- $C_{\text{base}}$: Base execution cycles per branch instruction (default = 1)

The performance metrics are computed as follows:

$$\text{Prediction Accuracy (\%)} = \left(\frac{C}{B}\right) \times 100$$

$$\text{Misprediction Rate (\%)} = \left(\frac{M}{B}\right) \times 100$$

$$\text{Estimated Total Cycles} = (B \times C_{\text{base}}) + (M \times P)$$

---

## 3. Technology Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS (strict neutral slate/zinc palette, zero AI gradient tropes)
- **Visualizations:** Custom SVG FSM diagram, Recharts, Lucide React
- **Testing:** Vitest
- **Architecture:** Decoupled pure simulation engine and reactive presentation layer

---

## 4. Project Directory Structure

```text
branch-prediction-simulator/
├── docs/
│   ├── COA_PROJECT_REPORT.md        # Comprehensive academic project report
│   └── PRESENTATION.md              # Slide deck outline and viva presentation script
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── BtbVisualizer.tsx        # BTB tag and target cache simulation
│   │   ├── ComparisonCharts.tsx     # Recharts comparative graphs
│   │   ├── ConfigPanel.tsx          # Predictor and penalty controls
│   │   ├── ExportControls.tsx       # CSV export utilities
│   │   ├── Header.tsx               # Application header
│   │   ├── MetricsCards.tsx         # Performance metric display cards
│   │   ├── PipelineVisualizer.tsx   # 5-stage RISC pipeline flush inspector
│   │   ├── PredictionTable.tsx      # Step-by-step execution log
│   │   ├── SequenceInput.tsx        # Sequence editor and preset selector
│   │   ├── SimulationControls.tsx   # Navigation and playback controls
│   │   ├── StateDiagram.tsx         # SVG 2-bit counter FSM
│   │   └── TheoryModal.tsx          # Built-in reference and equations modal
│   ├── data/
│   │   └── sampleSequences.ts       # Standard benchmark sequences
│   ├── engine/
│   │   ├── metrics.ts               # Accuracy and cycle calculations
│   │   ├── pipelineModel.ts         # 5-stage pipeline trace generator
│   │   ├── simulate.ts              # Core simulation runner
│   │   └── validateSequence.ts      # Parser and syntax normalizer
│   ├── predictors/
│   │   ├── alwaysNotTaken.ts        # Static Always-Not-Taken
│   │   ├── alwaysTaken.ts           # Static Always-Taken
│   │   ├── base.ts                  # Predictor interface
│   │   ├── btb.ts                   # Branch Target Buffer model
│   │   ├── globalHistory.ts         # BHR + PHT 2-level adaptive predictor
│   │   ├── oneBit.ts                # 1-bit dynamic predictor
│   │   ├── registry.ts              # Predictor factory and metadata
│   │   └── twoBit.ts                # 2-bit saturating counter
│   ├── tests/
│   │   ├── metrics.test.ts          # Metric formula precision tests
│   │   ├── predictors.test.ts       # Predictor state machine tests
│   │   ├── simulate.test.ts         # Section 13 benchmark verification
│   │   └── validateSequence.test.ts # Input validation tests
│   ├── types/
│   │   └── index.ts                 # Shared TypeScript interfaces
│   ├── App.tsx                      # Main dashboard layout
│   ├── index.css                    # Tailwind directives
│   └── main.tsx                     # React application entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 5. Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

```bash
# Clone or navigate to the project directory
cd /home/whysooraj/Projects/branch-prediction-simulator

# Install dependencies
npm install
```

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Running Tests

Execute the automated Vitest test suite:

```bash
npm run test
```

### Building for Production

```bash
npm run build
```

The production-ready artifacts will be generated in the `dist/` directory.

---

## 6. Verification & Specification Benchmark

The implementation is verified against the canonical Section 13 specification test case:

- **Input Sequence:** `T T N T T N N T`
- **Predictor:** 2-Bit Saturating Counter
- **Initial State:** `01` (Weakly Not Taken)
- **Base Cycles ($C_{\text{base}}$):** 1
- **Misprediction Penalty ($P$):** 5

### Execution Trace

| Step | Actual | State Before | Prediction | Result | State After |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | T | 01 | N | Miss | 10 |
| 2 | T | 10 | T | Hit | 11 |
| 3 | N | 11 | T | Miss | 10 |
| 4 | T | 10 | T | Hit | 11 |
| 5 | T | 11 | T | Hit | 11 |
| 6 | N | 11 | T | Miss | 10 |
| 7 | N | 10 | T | Miss | 01 |
| 8 | T | 01 | N | Miss | 10 |

### Benchmark Results

- Total Branches: 8
- Hits (Correct): 3
- Misses: 5
- Prediction Accuracy: 37.5%
- Misprediction Rate: 62.5%
- Estimated Cycles: $(8 \times 1) + (5 \times 5) = 33\text{ cycles}$

---

## 7. References

1. Patterson, D. A., & Hennessy, J. L. *Computer Organization and Design: The Hardware/Software Interface*. Morgan Kaufmann.
2. Stallings, W. *Computer Organization and Architecture: Designing for Performance*. Pearson.
3. Smith, J. E. (1981). "A study of branch prediction strategies." *Proceedings of the 8th annual symposium on Computer Architecture*.

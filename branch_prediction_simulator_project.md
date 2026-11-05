# Interactive Branch Prediction Simulator for CPU Performance Analysis

## 1. Project Overview

**Project title:** Interactive Branch Prediction Simulator for CPU
Performance Analysis

**Domain:** Computer Organization and Architecture (COA)

**Project type:** Browser-based educational simulator

**Recommended implementation:** React + TypeScript, with a simulation
engine written in TypeScript. No backend is required for the core
version.

### Short description

This project simulates common CPU branch prediction techniques and
compares their prediction accuracy using user-provided branch
instruction sequences. It also estimates the performance impact of
mispredictions through configurable pipeline penalties, helping users
understand how branch prediction affects CPU execution.

------------------------------------------------------------------------

## 2. Problem Statement

Conditional branch instructions change the normal flow of program
execution. In a pipelined processor, the CPU may not know the correct
next instruction until a branch condition is resolved. To avoid waiting,
the processor predicts whether the branch will be taken or not taken and
continues fetching instructions based on that prediction.

An incorrect prediction causes the processor to discard incorrectly
fetched or partially processed instructions and restart from the correct
execution path. This introduces a performance penalty. The project aims
to build an interactive simulator that demonstrates how different branch
prediction techniques behave, measures their accuracy, and estimates
their effect on CPU execution cycles.

------------------------------------------------------------------------

## 3. Objectives

1.  Explain the purpose of branch prediction in pipelined processors.
2.  Implement multiple branch prediction algorithms.
3.  Allow users to enter or generate branch outcome sequences.
4.  Display each prediction alongside the actual branch outcome.
5.  Track predictor state changes after every branch.
6.  Calculate prediction accuracy and misprediction rate.
7.  Estimate execution cycles using a configurable misprediction
    penalty.
8.  Compare the performance of different predictors on the same
    sequence.
9.  Visualize predictor state transitions and performance results.

------------------------------------------------------------------------

## 4. Project Scope

### Core features

-   User-defined branch sequence using `T` (Taken) and `N` (Not Taken).
-   Built-in sample sequences and random sequence generation.
-   Always-Taken predictor.
-   Always-Not-Taken predictor.
-   1-bit dynamic predictor.
-   2-bit saturating-counter predictor.
-   Step-by-step simulation.
-   Prediction table showing actual outcome, predicted outcome,
    correctness, and state.
-   Accuracy, misprediction rate, and estimated cycle calculations.
-   Side-by-side comparison of predictors.

### Optional advanced features

-   Local branch history predictor.
-   Global branch history predictor.
-   Branch History Table (BHT).
-   Branch Target Buffer (BTB) concept demonstration.
-   Pipeline-stage visualization.
-   Configurable pipeline depth and misprediction penalty.
-   Export simulation results as CSV.

**Scope note:** The core project models branch direction prediction. A
BTB stores predicted branch target addresses and is a separate
mechanism. It can be added as an optional conceptual module rather than
being treated as another direction-prediction algorithm.

------------------------------------------------------------------------

## 5. Technical Background

### 5.1 What is branch prediction?

Branch prediction is a CPU technique used to predict the outcome of a
conditional branch before the actual condition is fully evaluated. The
processor uses this prediction to decide which instructions to fetch
next.

There are two possible outcomes:

-   **Taken (T):** The branch jumps to its target address.
-   **Not Taken (N):** Execution continues with the next sequential
    instruction.

### 5.2 Why is it needed?

Modern CPUs use instruction pipelines to process multiple instructions
at different stages. A branch can interrupt the normal instruction flow.
Prediction allows the CPU to continue fetching instructions instead of
waiting for the branch result.

If the prediction is wrong, the processor must recover from the
incorrect path. This is called a branch misprediction penalty.

### 5.3 Prediction metrics

Let:

-   `B` = total number of branches
-   `C` = number of correct predictions
-   `M` = number of incorrect predictions
-   `P` = configured misprediction penalty in cycles
-   `C_base` = base cycles assigned to each branch in this simplified
    model

Then:

``` text
M = B - C

Prediction Accuracy = (C / B) × 100

Misprediction Rate = (M / B) × 100

Estimated Cycles = (B × C_base) + (M × P)
```

For a simple demonstration, set `C_base = 1`. Make the base-cycle
assumption visible in the UI.

**Important:** This cycle formula is a simplified teaching model, not a
full cycle-accurate CPU simulation. Real execution time also depends on
instruction mix, pipeline depth, branch resolution stage, overlapping
stalls, cache misses, and other processor details. Do not claim that the
estimated cycles are exact real-CPU measurements.

------------------------------------------------------------------------

## 6. Prediction Algorithms

### 6.1 Always-Taken Predictor

**Rule:** Predict every branch as Taken.

``` text
Prediction = T
```

This is a static predictor. It does not learn from previous outcomes.

### 6.2 Always-Not-Taken Predictor

**Rule:** Predict every branch as Not Taken.

``` text
Prediction = N
```

This is also a static predictor and does not maintain predictor state.

### 6.3 1-Bit Dynamic Predictor

A 1-bit predictor stores the last observed outcome of a branch.

-   State `T`: predict Taken.
-   State `N`: predict Not Taken.
-   After each branch, update the state to the actual outcome.

Example:

``` text
Initial state: N
Actual:        T
Prediction:    N
Result:        Miss
New state:     T
```

For the next occurrence of that same branch, it predicts Taken.

**Implementation assumption:** The basic 1-bit mode uses one predictor
state for the supplied sequence. An advanced version can maintain
separate states for different branch addresses.

### 6.4 2-Bit Saturating-Counter Predictor

A 2-bit predictor uses four states:

  State   Meaning              Prediction
  ------- -------------------- ------------
  `00`    Strongly Not Taken   N
  `01`    Weakly Not Taken     N
  `10`    Weakly Taken         T
  `11`    Strongly Taken       T

Update rules:

-   If the actual outcome is Taken, increment the counter.
-   If the actual outcome is Not Taken, decrement the counter.
-   The counter cannot go below `00` or above `11`.
-   Predict Taken in states `10` and `11`.
-   Predict Not Taken in states `00` and `01`.

State transitions:

``` text
00 --T--> 01
01 --T--> 10
10 --T--> 11
11 --T--> 11

00 --N--> 00
01 --N--> 00
10 --N--> 01
11 --N--> 10
```

The initial state should be configurable. Use `01` (Weakly Not Taken) as
the default and clearly show this setting.

------------------------------------------------------------------------

## 7. Functional Requirements

  ID      Requirement                                     Priority
  ------- ----------------------------------------------- ----------
  FR-01   Accept a sequence containing only T and N       Must
  FR-02   Validate the sequence and show input errors     Must
  FR-03   Allow users to select a predictor               Must
  FR-04   Simulate predictions in sequence order          Must
  FR-05   Show actual and predicted outcomes              Must
  FR-06   Show correct and incorrect predictions          Must
  FR-07   Update and display predictor state              Must
  FR-08   Calculate accuracy and misprediction rate       Must
  FR-09   Estimate cycles using the configured penalty    Must
  FR-10   Compare all core predictors on the same input   Must
  FR-11   Support step-by-step execution and reset        Should
  FR-12   Generate random test sequences                  Should
  FR-13   Export results to CSV                           Could
  FR-14   Support local/global history predictors         Could

------------------------------------------------------------------------

## 8. Non-Functional Requirements

-   The interface should be responsive on desktop and mobile.
-   Simulation results should be deterministic for the same input and
    settings.
-   The simulation engine should be separate from the UI.
-   Invalid input must not crash the application.
-   The app should work locally without a server.
-   Results should be easy to understand during a classroom
    demonstration.
-   Predictor assumptions and initial states must be visible to users.

------------------------------------------------------------------------

## 9. Technology Stack

### Recommended stack

  -----------------------------------------------------------------------
  Layer                   Technology              Purpose
  ----------------------- ----------------------- -----------------------
  Frontend                React                   Build the user
                                                  interface

  Language                TypeScript              Implement predictable,
                                                  typed simulation logic

  Styling                 Tailwind CSS            Responsive interface
                                                  styling

  Charts                  Recharts                Compare predictor
                                                  accuracy and cycles

  Icons                   Lucide React            Interface icons

  Build tool              Vite                    Local development and
                                                  production build

  Testing                 Vitest                  Test predictor
                                                  algorithms

  Version control         Git + GitHub            Source control and
                                                  collaboration

  Deployment              Vercel or Netlify       Host the frontend
  -----------------------------------------------------------------------

### Backend

A backend is **not required** for the core project. The input,
simulation, calculations, and charts can all run in the browser.

Optional future additions: - Supabase for saving simulation history. -
User accounts for saving experiments. - A database for shared test
cases.

Do not add a backend unless the project genuinely needs persistent data
or multiple users.

------------------------------------------------------------------------

## 10. System Architecture

``` text
              USER
               |
               v
       REACT USER INTERFACE
               |
       +-------+--------+
       |                |
       v                v
  INPUT VALIDATOR   SETTINGS
       |          Predictor / Penalty
       +-------+--------+
               |
               v
       SIMULATION ENGINE
               |
       +-------+----------------------+
       |              |               |
       v              v               v
  STATIC          1-BIT           2-BIT
 PREDICTORS      PREDICTOR       PREDICTOR
       |              |               |
       +--------------+---------------+
                      |
                      v
              METRICS CALCULATOR
                      |
             +--------+--------+
             |                 |
             v                 v
        RESULT TABLE       CHARTS
             |                 |
             +--------+--------+
                      |
                      v
                USER RESULTS
```

### Suggested folder structure

``` text
branch-prediction-simulator/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── SequenceInput.tsx
│   │   ├── PredictorSelector.tsx
│   │   ├── SimulationControls.tsx
│   │   ├── MetricsCards.tsx
│   │   ├── PredictionTable.tsx
│   │   ├── StateDiagram.tsx
│   │   └── ComparisonCharts.tsx
│   │
│   ├── predictors/
│   │   ├── alwaysTaken.ts
│   │   ├── alwaysNotTaken.ts
│   │   ├── oneBit.ts
│   │   ├── twoBit.ts
│   │   └── types.ts
│   │
│   ├── engine/
│   │   ├── simulate.ts
│   │   ├── metrics.ts
│   │   └── validateSequence.ts
│   │
│   ├── data/
│   │   └── sampleSequences.ts
│   │
│   ├── tests/
│   │   ├── predictors.test.ts
│   │   └── metrics.test.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

------------------------------------------------------------------------

## 11. Core Simulation Logic

Each predictor should follow a common interface so that the simulation
engine can run different algorithms without knowing their internal
implementation.

### Suggested result structure

``` ts
type BranchOutcome = "T" | "N";

type PredictionStep = {
  index: number;
  actual: BranchOutcome;
  predicted: BranchOutcome;
  correct: boolean;
  stateBefore?: string;
  stateAfter?: string;
};

type SimulationResult = {
  predictorName: string;
  steps: PredictionStep[];
  totalBranches: number;
  correctPredictions: number;
  mispredictions: number;
  accuracy: number;
  mispredictionRate: number;
  estimatedCycles: number;
};
```

### General algorithm

``` text
INPUT:
    Branch sequence
    Selected predictor
    Initial predictor state
    Base cycles per branch
    Misprediction penalty

INITIALIZE:
    correct = 0
    incorrect = 0

FOR each actual branch outcome:
    1. Ask predictor for its prediction.
    2. Compare prediction with actual outcome.
    3. If both match:
           correct = correct + 1
       Else:
           incorrect = incorrect + 1
    4. Update predictor using actual outcome.
    5. Store prediction, actual result, and state.

CALCULATE:
    accuracy = correct / total branches × 100
    misprediction rate = incorrect / total branches × 100
    cycles = total branches × base cycles
             + incorrect × penalty

OUTPUT:
    Step-by-step table
    Accuracy
    Misprediction rate
    Estimated cycles
```

The order is important: **predict first, compare second, update state
third**. Updating before prediction would use information the predictor
should not know yet.

------------------------------------------------------------------------

## 12. User Interface Design

### Main dashboard

The dashboard should contain the following sections.

#### A. Input panel

-   Branch sequence text field.
-   Example sequence button.
-   Random sequence generator.
-   Clear/reset button.
-   Input validation message.

Example:

``` text
Enter branch sequence:
[T, T, N, T, N, N, T, T]

[Run Simulation] [Compare All]
```

Allow inputs such as `TTNTNNTT` and `T T N T N N T T`, then normalize
them internally.

#### B. Configuration panel

-   Predictor selection.
-   Initial state selection for dynamic predictors.
-   Misprediction penalty.
-   Base cycles per branch.

#### C. Performance summary

Display:

-   Total branches.
-   Correct predictions.
-   Mispredictions.
-   Prediction accuracy.
-   Misprediction rate.
-   Estimated cycles.

#### D. Step-by-step table

    Branch Actual   Predicted   Result   State after
  -------- -------- ----------- -------- -------------
         1 T        N           Miss     10
         2 T        T           Hit      11
         3 N        T           Miss     10
         4 T        T           Hit      11

The table values above are illustrative. Actual results depend on the
selected predictor and initial state.

#### E. Charts

Recommended visualizations:

1.  Bar chart: prediction accuracy by predictor.
2.  Bar chart: estimated cycles by predictor.
3.  Donut chart: correct predictions vs mispredictions.
4.  State-transition visualization: 2-bit predictor state changes.

#### F. Step controls

-   Next branch.
-   Previous branch.
-   Play simulation.
-   Pause simulation.
-   Reset simulation.

The step controls should reveal how the predictor learns from previous
outcomes.

------------------------------------------------------------------------

## 13. Sample Test Case

### Input

``` text
Branch sequence: T T N T T N N T
Predictor: 2-bit saturating counter
Initial state: 01 (Weakly Not Taken)
Base cycles per branch: 1
Misprediction penalty: 5
```

### Expected simulation

    Step Actual   State before   Prediction   Result   State after
  ------ -------- -------------- ------------ -------- -------------
       1 T        01             N            Miss     10
       2 T        10             T            Hit      11
       3 N        11             T            Miss     10
       4 T        10             T            Hit      11
       5 T        11             T            Hit      11
       6 N        11             T            Miss     10
       7 N        10             T            Miss     01
       8 T        01             N            Miss     10

### Expected metrics

``` text
Total branches       = 8
Correct predictions  = 3
Mispredictions        = 5
Accuracy              = 37.5%
Misprediction rate    = 62.5%

Estimated cycles = (8 × 1) + (5 × 5)
                 = 33 cycles
```

Use this test case to verify the implementation.

------------------------------------------------------------------------

## 14. Testing Plan

Test the simulation engine independently from the UI.

### Algorithm tests

-   Always-Taken predicts T for every branch.
-   Always-Not-Taken predicts N for every branch.
-   1-bit predictor updates to the latest actual outcome.
-   2-bit predictor increments on T and decrements on N.
-   2-bit predictor saturates at `00` and `11`.
-   2-bit prediction is N in `00` and `01`.
-   2-bit prediction is T in `10` and `11`.
-   Predictor state updates only after the prediction is made.

### Input tests

-   Empty sequence.
-   Sequence containing only T.
-   Sequence containing only N.
-   Mixed sequence.
-   Lowercase input.
-   Input with spaces and commas.
-   Invalid characters.
-   Very long sequence.

### Metrics tests

-   100% accuracy when every prediction is correct.
-   0% accuracy when every prediction is wrong.
-   Correct misprediction rate.
-   Correct cycle calculation.
-   Empty input handled without division by zero.

------------------------------------------------------------------------

## 15. Implementation Roadmap

  -----------------------------------------------------------------------
  Phase                   Work                    Output
  ----------------------- ----------------------- -----------------------
  1                       Study branch prediction COA theory notes
                          and pipeline concepts   

  2                       Design predictor        Simulation design
                          interface and data      
                          structures              

  3                       Implement static        Always-Taken and
                          predictors              Always-Not-Taken

  4                       Implement dynamic       1-bit and 2-bit
                          predictors              

  5                       Implement metrics and   Performance
                          cycle model             calculations

  6                       Build React interface   Working dashboard

  7                       Add charts and step     Interactive
                          controls                visualization

  8                       Test all algorithms and Verified simulator
                          edge cases              

  9                       Prepare report and      Final submission
                          demonstration           
  -----------------------------------------------------------------------

### Suggested development order

Build and test the simulation engine first. Then connect it to the UI.
Do not build charts before the prediction logic and metrics have been
verified.

------------------------------------------------------------------------

## 16. Expected Outcome

The completed application should allow a user to:

1.  Enter a branch outcome sequence.
2.  Select a prediction algorithm.
3.  Run the simulation or execute it one branch at a time.
4.  Observe predictions and predictor state transitions.
5.  Compare prediction accuracy across algorithms.
6.  Change the misprediction penalty and observe its effect on estimated
    cycles.
7.  Understand why branch prediction is important for pipelined CPU
    performance.

The final deliverable will be an interactive educational tool that
connects COA theory with practical simulation and performance analysis.

------------------------------------------------------------------------

## 17. Limitations

-   The core version uses a supplied sequence of branch outcomes rather
    than executing real machine instructions.
-   The basic 1-bit and 2-bit predictors use a single predictor state
    for the sequence.
-   The simplified cycle model does not represent a complete processor
    pipeline.
-   Cache misses, instruction dependencies, out-of-order execution, and
    overlapping stalls are not included.
-   Results demonstrate algorithm behavior under the selected
    assumptions. They should not be presented as benchmarks of real
    commercial processors.

These limitations can be addressed in an advanced version using branch
addresses, multiple predictor-table entries, local/global history, and a
more detailed pipeline model.

------------------------------------------------------------------------

## 18. Future Enhancements

1.  Support multiple branch addresses and separate predictor entries.
2.  Add local and global branch history.
3.  Implement a Branch History Table.
4.  Demonstrate BTB lookup and target-address prediction.
5.  Add a configurable five-stage pipeline.
6.  Visualize pipeline flushes after mispredictions.
7.  Add branch instruction traces from small assembly programs.
8.  Export comparison reports as CSV or PDF.
9.  Add a tutorial mode explaining each prediction step.

------------------------------------------------------------------------

## 19. References

Use these sources while preparing the report and viva:

-   David A. Patterson and John L. Hennessy, *Computer Organization and
    Design: The Hardware/Software Interface*.
-   William Stallings, *Computer Organization and Architecture:
    Designing for Performance*.
-   John L. Hennessy and David A. Patterson, *Computer Architecture: A
    Quantitative Approach*.
-   Official React documentation: https://react.dev/
-   Official TypeScript documentation:
    https://www.typescriptlang.org/docs/
-   Official Vite documentation: https://vite.dev/guide/
-   Official Recharts documentation: https://recharts.org/

------------------------------------------------------------------------

## 20. Final Project Deliverables

-   Complete source code.
-   Working browser-based simulator.
-   Four core predictor implementations.
-   Step-by-step prediction table.
-   Predictor comparison charts.
-   Test cases and test results.
-   COA project report.
-   Presentation slides.
-   Live demonstration.

**Final title:** Interactive Branch Prediction Simulator for CPU
Performance Analysis

**Core contribution:** A visual comparison of static and dynamic branch
predictors, including predictor-state transitions, prediction accuracy,
and estimated pipeline misprediction costs.

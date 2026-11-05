import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SequenceInput } from './components/SequenceInput';
import { ConfigPanel } from './components/ConfigPanel';
import { SimulationControls } from './components/SimulationControls';
import { MetricsCards } from './components/MetricsCards';
import { PredictionTable } from './components/PredictionTable';
import { StateDiagram } from './components/StateDiagram';
import { ComparisonCharts } from './components/ComparisonCharts';
import { PipelineVisualizer } from './components/PipelineVisualizer';
import { BtbVisualizer } from './components/BtbVisualizer';
import { ExportControls } from './components/ExportControls';
import { TheoryModal } from './components/TheoryModal';
import { validateAndNormalizeSequence } from './engine/validateSequence';
import { runSimulation, compareAllPredictors } from './engine/simulate';
import { calculateMetrics } from './engine/metrics';
import { PredictorId } from './types';
import { PlayCircle, BarChart3, Layers, Database } from 'lucide-react';

export const App: React.FC = () => {
  // Input & validation
  const [rawInput, setRawInput] = useState<string>('T T N T T N N T');
  const validation = useMemo(() => validateAndNormalizeSequence(rawInput), [rawInput]);

  // Predictor & pipeline settings
  const [selectedPredictor, setSelectedPredictor] = useState<PredictorId>('two-bit');
  const [initialState, setInitialState] = useState<string>('01');
  const [baseCycles, setBaseCycles] = useState<number>(1);
  const [penaltyCycles, setPenaltyCycles] = useState<number>(5);

  // Stepping & player state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(600);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'simulator' | 'comparison' | 'pipeline' | 'btb'>('simulator');
  const [isTheoryOpen, setIsTheoryOpen] = useState<boolean>(false);

  // Run full simulation on the current configuration
  const fullSimulationResult = useMemo(() => {
    if (!validation.isValid || validation.sequence.length === 0) return null;
    return runSimulation({
      sequence: validation.sequence,
      predictorId: selectedPredictor,
      initialState,
      baseCycles,
      mispredictionPenalty: penaltyCycles,
    });
  }, [validation, selectedPredictor, initialState, baseCycles, penaltyCycles]);

  // Compute live step metrics
  const liveMetrics = useMemo(() => {
    if (!fullSimulationResult) {
      return calculateMetrics(0, 0, baseCycles, penaltyCycles);
    }
    const executedSteps = fullSimulationResult.steps.slice(0, currentStepIndex);
    const correctCount = executedSteps.filter((s) => s.correct).length;
    return calculateMetrics(executedSteps.length, correctCount, baseCycles, penaltyCycles);
  }, [fullSimulationResult, currentStepIndex, baseCycles, penaltyCycles]);

  // Current active predictor state string for state machine
  const activeFsmState = useMemo(() => {
    if (!fullSimulationResult || currentStepIndex === 0) {
      return initialState;
    }
    const lastStep = fullSimulationResult.steps[currentStepIndex - 1];
    return lastStep ? lastStep.stateAfter : initialState;
  }, [fullSimulationResult, currentStepIndex, initialState]);

  // Multi-predictor comparison results
  const comparisonResults = useMemo(() => {
    if (!validation.isValid || validation.sequence.length === 0) return [];
    return compareAllPredictors(validation.sequence, baseCycles, penaltyCycles);
  }, [validation, baseCycles, penaltyCycles]);

  // Step navigation handlers
  const handleStepNext = useCallback(() => {
    if (!fullSimulationResult) return;
    setCurrentStepIndex((prev) => Math.min(prev + 1, fullSimulationResult.steps.length));
  }, [fullSimulationResult]);

  const handleStepPrev = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const handleRunAll = useCallback(() => {
    if (!fullSimulationResult) return;
    setIsPlaying(false);
    setCurrentStepIndex(fullSimulationResult.steps.length);
  }, [fullSimulationResult]);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'n' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleStepNext();
      } else if (e.key === 'p' || e.key === 'ArrowLeft') {
        e.preventDefault();
        handleStepPrev();
      } else if (e.key === 'r') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlay, handleStepNext, handleStepPrev, handleReset]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-zinc-100">
      <Header onOpenTheory={() => setIsTheoryOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Top Control Grid: Input + Predictor Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6">
            <SequenceInput
              rawInput={rawInput}
              onChangeInput={setRawInput}
              validation={validation}
              onResetSimulation={handleReset}
            />
          </div>
          <div className="lg:col-span-6">
            <ConfigPanel
              selectedPredictor={selectedPredictor}
              onChangePredictor={setSelectedPredictor}
              initialState={initialState}
              onChangeInitialState={setInitialState}
              baseCycles={baseCycles}
              onChangeBaseCycles={setBaseCycles}
              penaltyCycles={penaltyCycles}
              onChangePenaltyCycles={setPenaltyCycles}
              onResetSimulation={handleReset}
            />
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="border-b border-zinc-800 flex items-center justify-between">
          <nav className="flex space-x-1 -mb-px">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center space-x-2 py-2.5 px-4 text-xs font-semibold border-b-2 transition ${
                activeTab === 'simulator'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Step-by-Step Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('comparison')}
              className={`flex items-center space-x-2 py-2.5 px-4 text-xs font-semibold border-b-2 transition ${
                activeTab === 'comparison'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Compare All Predictors</span>
            </button>

            <button
              onClick={() => setActiveTab('pipeline')}
              className={`flex items-center space-x-2 py-2.5 px-4 text-xs font-semibold border-b-2 transition ${
                activeTab === 'pipeline'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>5-Stage Pipeline Inspector</span>
            </button>

            <button
              onClick={() => setActiveTab('btb')}
              className={`flex items-center space-x-2 py-2.5 px-4 text-xs font-semibold border-b-2 transition ${
                activeTab === 'btb'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>BTB Target Cache</span>
            </button>
          </nav>

          <ExportControls
            result={fullSimulationResult}
            comparisonResults={comparisonResults}
          />
        </div>

        {/* Tab 1: Interactive Step-by-Step Simulator */}
        {activeTab === 'simulator' && (
          <div className="space-y-4">
            <SimulationControls
              currentStepIndex={currentStepIndex}
              totalSteps={fullSimulationResult?.steps.length || 0}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onStepNext={handleStepNext}
              onStepPrev={handleStepPrev}
              onReset={handleReset}
              onRunAll={handleRunAll}
              playSpeed={playSpeed}
              onChangePlaySpeed={setPlaySpeed}
              disabled={!validation.isValid}
            />

            <MetricsCards
              metrics={liveMetrics}
              isComplete={currentStepIndex === (fullSimulationResult?.steps.length || 0)}
            />

            {/* FSM State Machine Visualization */}
            <StateDiagram
              currentState={activeFsmState}
              predictorId={selectedPredictor}
            />

            {/* Prediction Execution Table */}
            <PredictionTable
              steps={fullSimulationResult?.steps || []}
              currentStepIndex={currentStepIndex}
            />
          </div>
        )}

        {/* Tab 2: Compare All Predictors */}
        {activeTab === 'comparison' && (
          <div className="space-y-4">
            <ComparisonCharts results={comparisonResults} />
          </div>
        )}

        {/* Tab 3: 5-Stage Pipeline Hazard Inspector */}
        {activeTab === 'pipeline' && (
          <div className="space-y-4">
            <PipelineVisualizer
              sequence={validation.sequence}
              steps={fullSimulationResult?.steps || []}
              penaltyCycles={penaltyCycles}
            />
          </div>
        )}

        {/* Tab 4: Branch Target Buffer Explorer */}
        {activeTab === 'btb' && (
          <div className="space-y-4">
            <BtbVisualizer />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-4 text-center text-xs text-zinc-500 font-mono">
        COA Project &middot; Computer Organization and Architecture Lab &middot; Branch Prediction Simulator
      </footer>

      {/* Theory & Reference Modal */}
      <TheoryModal isOpen={isTheoryOpen} onClose={() => setIsTheoryOpen(false)} />
    </div>
  );
};

export default App;

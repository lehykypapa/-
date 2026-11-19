/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { STAGES } from './data/stages';
import { GOJOSEON_STAGES } from './data/gojoseonStages';
import { StageOption, StoryTransition } from './types';
import { sounds } from './utils/audio';
import { TopBar } from './components/TopBar';
import { GameCanvas } from './components/GameCanvas';
import { TouchControls } from './components/TouchControls';
import { QuizDialog } from './components/QuizDialog';
import { FailModal } from './components/FailModal';
import { VictoryModal } from './components/VictoryModal';
import { HelpModal } from './components/HelpModal';
import { StoryBridgeModal } from './components/StoryBridgeModal';
import { GameIntro } from './components/GameIntro';

export default function App() {
  const [gameMode, setGameMode] = useState<'gojoseon' | 'jumong'>('gojoseon');
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [currentStageId, setCurrentStageId] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [wrongOption, setWrongOption] = useState<StageOption | null>(null);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [inRangeOfTarget, setInRangeOfTarget] = useState<boolean>(false);

  // Active stages list based on gameMode
  const activeStages = gameMode === 'gojoseon' ? GOJOSEON_STAGES : STAGES;
  const currentStage = activeStages.find(s => s.id === currentStageId) || activeStages[activeStages.length - 1];

  // Inter-stage animation / cutscene modal
  const [activeTransition, setActiveTransition] = useState<{
    transition: StoryTransition;
    nextStageNumber: number;
  } | null>(null);

  // Switch game mode
  const handleSelectGameMode = useCallback((mode: 'gojoseon' | 'jumong') => {
    setGameMode(mode);
    setCurrentStageId(1);
    setIsVictory(false);
    setWrongOption(null);
    setIsDialogOpen(false);
    setActiveTransition(null);
  }, []);

  // Virtual touch controls state (Joystick & fallback direction buttons)
  const [touchVector, setTouchVector] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [touchDir, setTouchDir] = useState({
    up: false,
    down: false,
    left: false,
    right: false
  });

  // Sound toggle
  const handleToggleMute = useCallback(() => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  // Direction handlers for virtual touch buttons
  const handleDirStart = useCallback((dir: 'up' | 'down' | 'left' | 'right') => {
    setTouchDir(prev => ({ ...prev, [dir]: true }));
  }, []);

  const handleDirEnd = useCallback((dir: 'up' | 'down' | 'left' | 'right') => {
    setTouchDir(prev => ({ ...prev, [dir]: false }));
  }, []);

  // Open Quiz Dialog (인물과 가까이 마주쳤을 때만 대화창 오픈 가능)
  const handleOpenDialog = useCallback(() => {
    if (!isVictory && !wrongOption && !activeTransition && inRangeOfTarget) {
      setIsDialogOpen(true);
    }
  }, [isVictory, wrongOption, activeTransition, inRangeOfTarget]);

  // Handle Option selection
  const handleSelectOption = useCallback(
    (option: StageOption) => {
      setIsDialogOpen(false);

      if (option.isCorrect) {
        sounds.playSuccess();

        // Trigger the inter-stage animation cutscene & background knowledge!
        if (currentStageId < 10) {
          setActiveTransition({
            transition: currentStage.transition,
            nextStageNumber: currentStageId + 1
          });
        } else {
          // Final stage 10 completed!
          setActiveTransition({
            transition: currentStage.transition,
            nextStageNumber: 11
          });
        }
      } else {
        // Wrong option selected -> Show Fail Modal
        sounds.playFail();
        setWrongOption(option);
      }
    },
    [currentStageId, currentStage]
  );

  // Proceed after the inter-stage animation cutscene
  const handleProceedFromTransition = useCallback(() => {
    if (!activeTransition) return;

    if (activeTransition.nextStageNumber <= 10) {
      setCurrentStageId(activeTransition.nextStageNumber);
      setActiveTransition(null);
    } else {
      // Completed final stage 10
      setActiveTransition(null);
      sounds.playVictory();
      setIsVictory(true);
    }
  }, [activeTransition]);

  // Start game from Intro screen
  const handleStartGame = useCallback(() => {
    sounds.playSuccess();
    setIsGameStarted(true);
  }, []);

  // Retry from checkpoint
  const handleRetry = useCallback(() => {
    setWrongOption(null);
    setIsDialogOpen(true);
  }, []);

  // Full restart from stage 1
  const handleRestart = useCallback(() => {
    setCurrentStageId(1);
    setIsVictory(false);
    setWrongOption(null);
    setIsDialogOpen(false);
    setActiveTransition(null);
    setIsGameStarted(false);
  }, []);

  return (
    <div
      id="app-root-container"
      className="w-full h-[100dvh] h-screen flex flex-col items-center justify-between bg-slate-950 text-slate-100 overflow-hidden select-none font-sans"
    >
      {/* 1. Header Bar: Stage status, progress bar, sounds, help, standalone HTML download */}
      <TopBar
        currentStage={currentStage}
        isMuted={isMuted}
        gameMode={gameMode}
        onToggleMute={handleToggleMute}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenTitle={() => setIsGameStarted(false)}
        onSelectGameMode={handleSelectGameMode}
      />

      {/* 2. Main 2D Canvas Viewport with On-Screen Tablet Controls */}
      <main id="game-main-stage" className="relative flex-1 w-full h-full min-h-0 overflow-hidden flex items-center justify-center">
        <GameCanvas
          gameMode={gameMode}
          currentStageId={currentStageId}
          onOpenDialog={handleOpenDialog}
          isDialogOpen={!isGameStarted || isDialogOpen || !!wrongOption || isVictory || isHelpOpen || !!activeTransition}
          touchDir={touchDir}
          touchVector={touchVector}
          setInRangeOfTarget={setInRangeOfTarget}
        />

        {/* 3. On-Screen Touch Controls (Virtual Joystick & Talk Button for Tablets & Mobile) */}
        {isGameStarted && (
          <TouchControls
            onMove={setTouchVector}
            onDirStart={handleDirStart}
            onDirEnd={handleDirEnd}
            onInteract={handleOpenDialog}
            inRangeOfTarget={inRangeOfTarget}
          />
        )}
      </main>

      {/* 4. Game First Screens: Title Screen & Instructions Notice Screen */}
      {!isGameStarted && (
        <GameIntro
          gameMode={gameMode}
          onSelectGameMode={handleSelectGameMode}
          onStartGame={handleStartGame}
        />
      )}

      {/* 5. Interactive Character Dialogue & Quiz Dialog Modal */}
      {isDialogOpen && (
        <QuizDialog
          stage={currentStage}
          onSelectOption={handleSelectOption}
        />
      )}

      {/* 5. Inter-stage Animated Cutscene & Historical Background Knowledge Modal */}
      {activeTransition && (
        <StoryBridgeModal
          transition={activeTransition.transition}
          nextStageNumber={activeTransition.nextStageNumber}
          onProceed={handleProceedFromTransition}
        />
      )}

      {/* 6. Failure Checkpoint Modal */}
      {wrongOption && (
        <FailModal
          wrongOption={wrongOption}
          historyLesson={currentStage.historyLesson}
          onRetry={handleRetry}
        />
      )}

      {/* 7. Victory & Curriculum Summary Modal */}
      {isVictory && (
        <VictoryModal
          gameMode={gameMode}
          onRestart={handleRestart}
        />
      )}

      {/* 8. Lesson & Help Modal */}
      {isHelpOpen && (
        <HelpModal
          gameMode={gameMode}
          onClose={() => setIsHelpOpen(false)}
        />
      )}
    </div>
  );
}

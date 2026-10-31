import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, NIGHT_PRESETS } from './game/gameEngine';
import { soundManager } from './audio/SoundManager';
import MainMenu from './components/MainMenu';
import OfficeView from './components/OfficeView';
import CameraMonitor from './components/CameraMonitor';
import NightIntro from './components/NightIntro';
import JumpscareOverlay from './components/JumpscareOverlay';
import NightWinScreen from './components/NightWinScreen';
import GameOverScreen from './components/GameOverScreen';
import StudioIntro from './components/StudioIntro';
import PauseMenu from './components/PauseMenu';
import TutorialGameplay from './components/TutorialGameplay';
import { preloadAllAssets } from './utils/assetLoader';
import { requestAppFullscreen } from './utils/fullscreen';
import {
  getUnlockedNight,
  getSelectedNight,
  setSelectedNight,
  unlockNextNight,
  resetGameProgress
} from './utils/storage';

// Early kickoff of asset preloading
preloadAllAssets().catch(() => {});

export default function App() {
  const [screen, setScreen] = useState('STUDIO_INTRO'); // STUDIO_INTRO, MENU, TUTORIAL, INTRO, PLAYING, JUMPSCARE, GAME_OVER, WIN
  const [unlockedNight, setUnlockedNight] = useState(() => getUnlockedNight());
  const [currentNight, setCurrentNight] = useState(() => getSelectedNight());
  const [gameState, setGameState] = useState(null);
  const [jumpscareTarget, setJumpscareTarget] = useState(null);
  const [isDoorBanging, setIsDoorBanging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const customConfigRef = useRef(null);

  // Keep references updated for stable callbacks
  const currentNightRef = useRef(currentNight);
  useEffect(() => {
    currentNightRef.current = currentNight;
  }, [currentNight]);

  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Handle explicit night selection from player
  const handleSelectNight = (night) => {
    if (night > unlockedNight) return;
    setCurrentNight(night);
    setSelectedNight(night);
  };

  // Reset progress back to Night 1
  const handleResetProgress = () => {
    resetGameProgress();
    setUnlockedNight(1);
    setCurrentNight(1);
  };

  // Start a new night shift
  const handleStartGame = (night = currentNight, customConfig = null) => {
    requestAppFullscreen();
    soundManager.stopMenuBgm();
    setIsPaused(false);
    customConfigRef.current = customConfig;
    setCurrentNight(night);
    if (!customConfig && night <= 5) {
      setSelectedNight(night);
    }
    const newGame = new GameState(night, customConfig);
    setGameState(newGame);
    setScreen('INTRO');
  };

  // Intro finished -> start shift
  const handleIntroFinish = () => {
    setScreen('PLAYING');
    soundManager.startFan();
  };

  // Game Over from Jumpscare
  const handleJumpscareEnd = () => {
    setIsPaused(false);
    setScreen('GAME_OVER');
  };

  // Retry same night
  const handleRetry = () => {
    requestAppFullscreen();
    setIsPaused(false);
    handleStartGame(currentNight, customConfigRef.current);
  };

  // Proceed to next night
  const handleNextNight = () => {
    requestAppFullscreen();
    setIsPaused(false);
    const next = Math.min(5, currentNight + 1);
    setCurrentNight(next);
    setSelectedNight(next);
    handleStartGame(next);
  };

  // Main Menu Return
  const handleMainMenu = () => {
    soundManager.stopFan();
    soundManager.stopHeartbeat();
    soundManager.stopSprintRunning();
    soundManager.stopBlackoutMusic();
    setIsPaused(false);
    setScreen('MENU');
    soundManager.playMenuBgm();
  };

  // Toggle Pause Menu
  const handleTogglePause = useCallback(() => {
    if (screen !== 'PLAYING' || !gameState || gameState.isBlackout || gameState.isGameOver) return;
    setIsPaused(prev => {
      const next = !prev;
      if (next) {
        soundManager.pauseGameAudio();
      } else {
        requestAppFullscreen();
        soundManager.resumeGameAudio();
      }
      return next;
    });
  }, [screen, gameState]);

  const handleResume = useCallback(() => {
    requestAppFullscreen();
    setIsPaused(false);
    soundManager.resumeGameAudio();
  }, []);

  // Safe prototype-preserving clone
  const refreshGameState = useCallback((state) => {
    if (!state) return null;
    return Object.assign(Object.create(Object.getPrototypeOf(state)), state);
  }, []);

  // Game Engine Event Dispatcher
  const handleGameEvent = useCallback((event) => {
    switch (event.type) {
      case 'HOUR_CHANGE':
        soundManager.playStaticBurst(0.1, 0.15);
        break;

      case 'MOVEMENT':
      case 'JOHANN_APPEARED':
      case 'JOHANN_RETREAT':
      case 'AB_SCARED':
        soundManager.playFootstep(false);
        break;

      case 'DIPU_SPRINT':
        soundManager.playSprintRunning();
        break;

      case 'ENEMY_AT_DOOR':
        soundManager.startHeartbeat();
        break;

      case 'DOOR_DEFENSE':
        soundManager.stopSprintRunning();
        soundManager.stopHeartbeat();
        soundManager.playDoorKnock();
        setIsDoorBanging(true);
        setTimeout(() => setIsDoorBanging(false), 1200);
        break;

      case 'JOHANN_BANG':
      case 'AB_BREAKING_IN':
        soundManager.playDoorBang();
        setIsDoorBanging(true);
        setTimeout(() => setIsDoorBanging(false), 1200);
        break;

      case 'MASK_TOGGLE':
        soundManager.playMaskSound(event.isMaskOn);
        break;

      case 'SCARE_AUDIO_PLAYED':
        soundManager.playAbhishekScare();
        break;

      case 'BLACKOUT_START':
        soundManager.stopFan();
        soundManager.stopHeartbeat();
        soundManager.stopSprintRunning();
        soundManager.playBlackoutMusic();
        break;

      case 'JUMPSCARE':
        setIsPaused(false);
        soundManager.stopHeartbeat();
        soundManager.stopSprintRunning();
        soundManager.stopBlackoutMusic();
        setJumpscareTarget(event.animatronic);
        setScreen('JUMPSCARE');
        break;

      case 'GAME_WIN':
        setIsPaused(false);
        soundManager.stopFan();
        soundManager.stopHeartbeat();
        soundManager.stopSprintRunning();
        soundManager.stopBlackoutMusic();

        {
          const wonNight = gameStateRef.current?.night ?? currentNightRef.current;
          const nextUnlocked = unlockNextNight(wonNight);
          setUnlockedNight(nextUnlocked);

          if (wonNight < 5) {
            const nextNight = wonNight + 1;
            setCurrentNight(nextNight);
            setSelectedNight(nextNight);
          }
        }

        setScreen('WIN');
        break;

      case 'OMR_UPLOAD_COMPLETE':
        soundManager.playUploadSuccess();
        break;

      default:
        break;
    }
  }, []);

  // Main Active Game Loop
  useEffect(() => {
    if (screen !== 'PLAYING' || !gameState || isPaused) return;

    let lastTime = performance.now();
    const interval = setInterval(() => {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      gameState.tick(dt, handleGameEvent);
      setGameState(prev => (prev ? Object.assign(Object.create(Object.getPrototypeOf(prev)), prev) : prev));
    }, 100);

    return () => clearInterval(interval);
  }, [screen, gameState, isPaused, handleGameEvent]);

  // Player action handlers
  const handleToggleDoor = useCallback(() => {
    if (!gameState || gameState.isBlackout || isPaused) return;
    const willClose = !gameState.isDoorClosed;
    soundManager.playDoorToggle(willClose);

    if (willClose) {
      gameState.toggleDoor(handleGameEvent);
    } else {
      gameState.isDoorClosed = false;
    }

    setGameState(refreshGameState(gameState));
  }, [gameState, refreshGameState, handleGameEvent, isPaused]);

  const handleToggleLight = useCallback(() => {
    if (!gameState || gameState.isBlackout || isPaused) return;
    gameState.toggleLight(handleGameEvent);
    soundManager.playLightToggle(gameState.isLightOn);
    setGameState(refreshGameState(gameState));
  }, [gameState, refreshGameState, handleGameEvent, isPaused]);

  const handleToggleMonitor = useCallback(() => {
    if (!gameState || gameState.isBlackout || isPaused || gameState.isOmrUploading || gameState.isMaskOn) return;
    const newState = !gameState.isMonitorOpen;
    gameState.isMonitorOpen = newState;
    soundManager.playCameraFlip(newState);
    setGameState(refreshGameState(gameState));
  }, [gameState, refreshGameState, isPaused]);

  const handleToggleMask = useCallback(() => {
    if (!gameState || gameState.isBlackout || isPaused || gameState.isOmrUploading) return;
    const isMaskNow = gameState.toggleMask(handleGameEvent);
    soundManager.playMaskSound(isMaskNow);
    setGameState(refreshGameState(gameState));
  }, [gameState, refreshGameState, handleGameEvent, isPaused]);

  const handlePlayScare = useCallback((targetCam = null) => {
    if (!gameState || gameState.isBlackout || isPaused) return null;
    const res = gameState.playScareAudio(targetCam, handleGameEvent);
    if (res.success) {
      soundManager.playAbhishekScare();
    }
    setGameState(refreshGameState(gameState));
    return res;
  }, [gameState, refreshGameState, handleGameEvent, isPaused]);

  const handleSelectCam = useCallback((camId) => {
    if (!gameState || isPaused) return;
    gameState.currentCam = camId;
    setGameState(refreshGameState(gameState));
  }, [gameState, refreshGameState, isPaused]);

  // Complete OMR upload callback
  const handleOmrComplete = useCallback(() => {
    if (!gameState || gameState.isGameOver) return null;
    const result = gameState.completeOmrUpload(handleGameEvent);
    soundManager.playUploadSuccess();
    setGameState(refreshGameState(gameState));
    return result;
  }, [gameState, refreshGameState, handleGameEvent]);

  // Keyboard shortcut listener: Space (Monitor), D (Door), L (Light), M (Mask), A (Scare), ESC / P (Pause)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (screen !== 'PLAYING') return;

      if (e.code === 'Escape' || e.code === 'KeyP') {
        e.preventDefault();
        handleTogglePause();
        return;
      }

      if (isPaused) return;

      if (gameState && gameState.isOmrUploading) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleToggleMonitor();
      } else if (e.code === 'KeyD') {
        e.preventDefault();
        handleToggleDoor();
      } else if (e.code === 'KeyL') {
        e.preventDefault();
        handleToggleLight();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        handleToggleMask();
      } else if (e.code === 'KeyA') {
        e.preventDefault();
        handlePlayScare(gameState.isMonitorOpen ? gameState.currentCam : 'CAM_5');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, isPaused, gameState, handleTogglePause, handleToggleMonitor, handleToggleDoor, handleToggleLight, handleToggleMask, handlePlayScare]);

  return (
    <main className="w-screen min-h-[100dvh] h-[100dvh] overflow-hidden bg-black select-none">
      {screen === 'STUDIO_INTRO' && (
        <StudioIntro onFinish={() => {
          setScreen('MENU');
          soundManager.playMenuBgm();
        }} />
      )}

      {screen === 'MENU' && (
        <MainMenu
          currentNight={currentNight}
          unlockedNight={unlockedNight}
          onStartGame={handleStartGame}
          onSelectNight={handleSelectNight}
          onResetProgress={handleResetProgress}
          onStartTutorial={() => setScreen('TUTORIAL')}
        />
      )}

      {screen === 'TUTORIAL' && (
        <TutorialGameplay
          onFinish={handleMainMenu}
          onStartNight1={() => handleStartGame(1)}
        />
      )}

      {screen === 'INTRO' && (
        <NightIntro
          night={currentNight}
          onFinish={handleIntroFinish}
        />
      )}

      {screen === 'PLAYING' && gameState && (
        <div className="relative w-full h-full">
          <OfficeView
            gameState={gameState}
            onToggleDoor={handleToggleDoor}
            onToggleLight={handleToggleLight}
            onToggleMonitor={handleToggleMonitor}
            onToggleMask={handleToggleMask}
            onPlayScare={() => handlePlayScare('CAM_5')}
            onPause={handleTogglePause}
            isDoorBanging={isDoorBanging}
            onOmrComplete={handleOmrComplete}
          />

          {gameState.isMonitorOpen && (
            <CameraMonitor
              gameState={gameState}
              onSelectCam={handleSelectCam}
              onToggleMonitor={handleToggleMonitor}
              onPlayScare={handlePlayScare}
            />
          )}

          {/* Pause Menu Modal Overlay */}
          {isPaused && (
            <PauseMenu
              gameState={gameState}
              onResume={handleResume}
              onMainMenu={handleMainMenu}
              onRestart={handleRetry}
            />
          )}
        </div>
      )}

      {screen === 'JUMPSCARE' && (
        <JumpscareOverlay
          jumpscareWho={jumpscareTarget}
          onJumpscareEnd={handleJumpscareEnd}
        />
      )}

      {screen === 'GAME_OVER' && (
        <GameOverScreen
          night={currentNight}
          jumpscareWho={jumpscareTarget}
          onRetry={handleRetry}
          onMainMenu={handleMainMenu}
        />
      )}

      {screen === 'WIN' && (
        <NightWinScreen
          night={currentNight}
          onNextNight={handleNextNight}
          onMainMenu={handleMainMenu}
        />
      )}
    </main>
  );
}

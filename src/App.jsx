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

export default function App() {
  const [screen, setScreen] = useState('STUDIO_INTRO'); // STUDIO_INTRO, MENU, INTRO, PLAYING, JUMPSCARE, GAME_OVER, WIN
  const [currentNight, setCurrentNight] = useState(1);
  const [gameState, setGameState] = useState(null);
  const [jumpscareTarget, setJumpscareTarget] = useState(null);
  const [isDoorBanging, setIsDoorBanging] = useState(false);
  const customConfigRef = useRef(null);

  // Load highest saved night from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fnak_night');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (parsed >= 1 && parsed <= 5) {
          setCurrentNight(parsed);
        }
      }
    } catch (_) {}
  }, []);

  const saveNight = (night) => {
    setCurrentNight(night);
    try {
      localStorage.setItem('fnak_night', night.toString());
    } catch (_) {}
  };

  // Start a new night shift
  const handleStartGame = (night = currentNight, customConfig = null) => {
    customConfigRef.current = customConfig;
    setCurrentNight(night);
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
    setScreen('GAME_OVER');
  };

  // Retry same night
  const handleRetry = () => {
    handleStartGame(currentNight, customConfigRef.current);
  };

  // Proceed to next night
  const handleNextNight = () => {
    const next = Math.min(5, currentNight + 1);
    saveNight(next);
    handleStartGame(next);
  };

  // Main Menu Return
  const handleMainMenu = () => {
    soundManager.stopFan();
    soundManager.stopHeartbeat();
    soundManager.stopSprintRunning();
    soundManager.stopBlackoutMusic();
    setScreen('MENU');
  };

  // Game Engine Event Dispatcher
  const handleGameEvent = useCallback((event) => {
    switch (event.type) {
      case 'HOUR_CHANGE':
        soundManager.playStaticBurst(0.1, 0.15);
        break;

      case 'MOVEMENT':
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
        setTimeout(() => setIsDoorBanging(false), 900);
        break;

      case 'AADESH_AT_BLIND_SPOT':
        soundManager.startHeartbeat();
        break;

      case 'BLACKOUT_START':
        soundManager.stopFan();
        soundManager.stopHeartbeat();
        soundManager.stopSprintRunning();
        soundManager.playBlackoutMusic();
        break;

      case 'JUMPSCARE':
        soundManager.stopHeartbeat();
        soundManager.stopSprintRunning();
        soundManager.stopBlackoutMusic();
        setJumpscareTarget(event.animatronic);
        setScreen('JUMPSCARE');
        break;

      case 'GAME_WIN':
        soundManager.stopFan();
        soundManager.stopHeartbeat();
        soundManager.stopSprintRunning();
        soundManager.stopBlackoutMusic();
        setScreen('WIN');
        break;

      default:
        break;
    }
  }, []);

  // Main Active Game Loop
  useEffect(() => {
    if (screen !== 'PLAYING' || !gameState) return;

    let lastTime = performance.now();
    const interval = setInterval(() => {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      gameState.tick(dt, handleGameEvent);
      // Trigger safe state clone to refresh React tree without losing prototype
      setGameState(prev => (prev ? Object.assign(Object.create(Object.getPrototypeOf(prev)), prev) : prev));
    }, 100);

    return () => clearInterval(interval);
  }, [screen, gameState, handleGameEvent]);

  // Safe prototype-preserving clone
  const refreshGameState = useCallback((state) => {
    if (!state) return null;
    return Object.assign(Object.create(Object.getPrototypeOf(state)), state);
  }, []);

  // Player action handlers
  const handleToggleDoor = useCallback(() => {
    if (!gameState || gameState.isBlackout) return;
    const willClose = !gameState.isDoorClosed;
    soundManager.playDoorToggle(willClose);

    if (willClose) {
      // Toggle door with active defense check: if enemy is standing at the door, bangs & retreats!
      gameState.toggleDoor(handleGameEvent);
    } else {
      gameState.isDoorClosed = false;
    }

    setGameState(refreshGameState(gameState));
  }, [gameState, refreshGameState, handleGameEvent]);

  const handleToggleLight = useCallback(() => {
    if (!gameState || gameState.isBlackout) return;
    const newState = !gameState.isLightOn;
    gameState.isLightOn = newState;
    soundManager.playLightToggle(newState);
    setGameState(refreshGameState(gameState));
  }, [gameState, refreshGameState]);

  const handleToggleMonitor = useCallback(() => {
    if (!gameState || gameState.isBlackout) return;
    const newState = !gameState.isMonitorOpen;
    gameState.isMonitorOpen = newState;
    soundManager.playCameraFlip(newState);
    setGameState(refreshGameState(gameState));
  }, [gameState, refreshGameState]);

  const handleSelectCam = useCallback((camId) => {
    if (!gameState) return;
    gameState.currentCam = camId;
    setGameState(refreshGameState(gameState));
  }, [gameState, refreshGameState]);

  // Keyboard shortcut listener: Space (Monitor), D (Door), L (Light)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (screen !== 'PLAYING') return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleToggleMonitor();
      } else if (e.code === 'KeyD') {
        e.preventDefault();
        handleToggleDoor();
      } else if (e.code === 'KeyL') {
        e.preventDefault();
        handleToggleLight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, handleToggleMonitor, handleToggleDoor, handleToggleLight]);

  return (
    <main className="w-screen h-screen overflow-hidden bg-black select-none">
      {screen === 'STUDIO_INTRO' && (
        <StudioIntro onFinish={() => setScreen('MENU')} />
      )}

      {screen === 'MENU' && (
        <MainMenu
          currentNight={currentNight}
          onStartGame={handleStartGame}
          onSelectNight={saveNight}
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
            isDoorBanging={isDoorBanging}
          />

          {gameState.isMonitorOpen && (
            <CameraMonitor
              gameState={gameState}
              onSelectCam={handleSelectCam}
              onToggleMonitor={handleToggleMonitor}
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

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BookOpen, Shield, Play, Home, CheckCircle2, Volume2, Lock, Unlock, Lightbulb, Camera, Upload, AlertTriangle, Radio, Sparkles, ChevronRight, X } from 'lucide-react';
import { soundManager } from '../audio/SoundManager';
import OfficeView from './OfficeView';
import CameraMonitor from './CameraMonitor';
import RulesModal from './RulesModal';
import { CAMERAS } from '../game/gameEngine';

export default function TutorialGameplay({ onFinish, onStartNight1 }) {
  // Tutorial Step Tracking: 0 to 8
  // 0: LOOK_AROUND
  // 1: DOOR_AND_LIGHT
  // 2: OPEN_CAMERAS
  // 3: EXPLORE_CAMERAS (Spot Johann & Dipu)
  // 4: SCARE_ABHISHEK
  // 5: OMR_UPLOAD
  // 6: JOHANN_MASK
  // 7: AADESH_LIGHT
  // 8: COMPLETE
  const [currentStep, setCurrentStep] = useState(0);

  // Controlled sample gameplay state
  const [doorClosed, setDoorClosed] = useState(false);
  const [lightOn, setLightOn] = useState(false);
  const [monitorOpen, setMonitorOpen] = useState(false);
  const [maskOn, setMaskOn] = useState(false);
  const [currentCam, setCurrentCam] = useState('CAM_1');
  const [scareCooldown, setScareCooldown] = useState(0);
  const [time, setTime] = useState(12); // starts 12 AM
  const [isDoorBanging, setIsDoorBanging] = useState(false);
  const [hasLookedAround, setHasLookedAround] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [scareSubtitle, setScareSubtitle] = useState(null);

  // Enemy states for guided sample night
  const [enemyLocations, setEnemyLocations] = useState({
    ab: 'CAM_1',
    dipu: 0,
    aadesh: 'CAM_4',
    johann: 'CAM_6', // Visible on Balcony right from the start!
    johannBanged: false,
  });

  // Action completion flags for current step
  const [stepActions, setStepActions] = useState({
    panned: false,
    toggledDoor: false,
    toggledLight: false,
    openedMonitor: false,
    checkedJohannCam: false,
    checkedDipuCam: false,
    scaredAb: false,
    omrUploaded: false,
    maskDefendedJohann: false,
    aadeshDefended: false,
  });

  // Simulated power & usage
  const simulatedGameState = {
    night: 'TUTORIAL',
    time: time === 12 ? 0 : time,
    power: 100,
    isBlackout: false,
    isDoorClosed: doorClosed,
    isLightOn: lightOn,
    isMonitorOpen: monitorOpen,
    isMaskOn: maskOn,
    currentCam: currentCam,
    scareCooldown: scareCooldown,
    isOmrUploading: false,
    omrCooldown: 0,
    omrQuota: 1,
    timeProgress: 0,
    isGeneratorAvailable: true,
    isGeneratorUsed: false,
    isGeneratorPrimed: false,
    solveGeneratorWirePuzzle: () => ({ activated: true, powerBonus: 12 }),
    activateGenerator: () => ({ activated: true, powerRestored: 12 }),
    ab: { location: enemyLocations.ab, atDoorTimer: 0, hasBangedDoor: false },
    dipu: { stage: enemyLocations.dipu, sprintTimer: 0, stallTimer: 0 },
    aadesh: { location: enemyLocations.aadesh, atBlindSpotTimer: 0, wasDoorClosedWhilePresent: false },
    johann: {
      location: enemyLocations.johann,
      timer: 0,
      hasBanged: enemyLocations.johannBanged,
      maskTimer: 0,
    },
    getUsageBars: () => {
      let b = 1;
      if (doorClosed) b += 2;
      if (lightOn) b += 1;
      if (monitorOpen) b += 1;
      return Math.min(5, b);
    }
  };

  // Cooldown countdown tick
  useEffect(() => {
    if (scareCooldown <= 0) return;
    const t = setInterval(() => {
      setScareCooldown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [scareCooldown]);

  // Track initial look around in Step 0
  useEffect(() => {
    const handleMove = () => {
      setHasLookedAround(true);
      setStepActions(prev => ({ ...prev, panned: true }));
    };
    window.addEventListener('mousemove', handleMove, { once: true });
    window.addEventListener('touchmove', handleMove, { once: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  // Ambient fan start on mount
  useEffect(() => {
    soundManager.startFan();
    return () => {
      soundManager.stopFan();
      soundManager.stopSprintRunning();
      soundManager.stopHeartbeat();
    };
  }, []);

  // Configure enemies based on current step
  useEffect(() => {
        if (currentStep === 3) {
      // Step 3: Explore cameras -> Johann in CAM_6 (Balcony), Dipu in CAM_3, AB in CAM_2
      setEnemyLocations(prev => ({
        ...prev,
        johann: 'CAM_6',
        dipu: 0,
        ab: 'CAM_2',
      }));
    } else if (currentStep === 4) {
      // Step 4: Abhishek approaching Corridor C!
      setEnemyLocations(prev => ({
        ...prev,
        ab: 'CAM_5',
        johann: 'CAM_6',
      }));
    } else if (currentStep === 5) {
      // Step 5: OMR desk upload -> close cameras so desk is visible
      setMonitorOpen(false);
      setMaskOn(false);
    } else if (currentStep === 6) {
      // Step 6: Johann attacks at the door!
      setMonitorOpen(false);
      setMaskOn(false);
      setDoorClosed(true); // door is closed so player sees him through window
      setLightOn(false);
      setEnemyLocations(prev => ({
        ...prev,
        johann: 'DOOR',
        johannBanged: false,
      }));
      // After 2.2s, Johann bangs on the door
      const bangTimer = setTimeout(() => {
        soundManager.playDoorBang();
        setIsDoorBanging(true);
        setEnemyLocations(p => ({ ...p, johannBanged: true }));
        setTimeout(() => setIsDoorBanging(false), 1200);
      }, 2200);
      return () => clearTimeout(bangTimer);
    } else if (currentStep === 7) {
      // Step 7: Aadesh at the blind spot!
      setMonitorOpen(false);
      setMaskOn(false);
      setDoorClosed(false);
      setLightOn(true); // Light on shows Aadesh in doorway
      setEnemyLocations(prev => ({
        ...prev,
        aadesh: 'BLIND_SPOT',
        johann: 'CAM_4',
      }));
    } else if (currentStep === 8) {
      // Complete!
      soundManager.play6AMChimes();
    }
  }, [currentStep]);

  // Handle Door Toggle
  const handleToggleDoor = useCallback(() => {
    const next = !doorClosed;
    setDoorClosed(next);
    soundManager.playDoorToggle(next);

    setStepActions(prev => ({ ...prev, toggledDoor: true }));

    // Step 7 Aadesh defense check: door must be closed AND light turned on
    if (currentStep === 7) {
      if (next && lightOn) {
        soundManager.playDoorBang();
        setIsDoorBanging(true);
        setTimeout(() => setIsDoorBanging(false), 1200);
        setEnemyLocations(p => ({ ...p, aadesh: 'CAM_4' }));
        setStepActions(p => ({ ...p, aadeshDefended: true }));
        setTimeout(() => setCurrentStep(8), 2000);
      }
    }
  }, [doorClosed, lightOn, currentStep]);

  // Handle Light Toggle
  const handleToggleLight = useCallback(() => {
    const next = !lightOn;
    setLightOn(next);
    soundManager.playLightToggle(next);

    setStepActions(prev => ({ ...prev, toggledLight: true }));

    // Step 7 Aadesh defense check: door closed AND light turned on
    if (currentStep === 7) {
      if (doorClosed && next) {
        soundManager.playDoorBang();
        setIsDoorBanging(true);
        setTimeout(() => setIsDoorBanging(false), 1200);
        setEnemyLocations(p => ({ ...p, aadesh: 'CAM_4' }));
        setStepActions(p => ({ ...p, aadeshDefended: true }));
        setTimeout(() => setCurrentStep(8), 2000);
      }
    }
  }, [doorClosed, lightOn, currentStep]);

  // Handle Monitor Toggle
  const handleToggleMonitor = useCallback(() => {
    if (maskOn) return;
    const next = !monitorOpen;
    setMonitorOpen(next);
    soundManager.playCameraFlip(next);

    if (next) {
      setStepActions(prev => ({ ...prev, openedMonitor: true }));
      if (currentStep === 2) {
        setTimeout(() => setCurrentStep(3), 800);
      }
    } else {
      if (currentStep === 4 && stepActions.scaredAb) {
        setCurrentStep(5);
      }
    }
  }, [monitorOpen, maskOn, currentStep, stepActions.scaredAb]);

  // Handle Mask Toggle
  const handleToggleMask = useCallback(() => {
    const next = !maskOn;
    setMaskOn(next);
    soundManager.playMaskSound(next);

    // Step 6: Johann defense
    if (currentStep === 6 && next) {
      setTimeout(() => {
        // Johann is fooled!
        setEnemyLocations(p => ({ ...p, johann: 'CAM_6', johannBanged: false }));
        setStepActions(p => ({ ...p, maskDefendedJohann: true }));
        soundManager.playFootstep(false);
        setTimeout(() => setCurrentStep(7), 2500);
      }, 1200);
    }
  }, [maskOn, currentStep]);

  // Handle Camera Switch
  const handleSelectCam = useCallback((camId) => {
    setCurrentCam(camId);
    soundManager.playStaticBurst(0.1, 0.2);

    if (camId === 'CAM_6' || camId === 'CAM_4') {
      setStepActions(prev => ({ ...prev, checkedJohannCam: true }));
    }
    if (camId === 'CAM_3') {
      setStepActions(prev => ({ ...prev, checkedDipuCam: true }));
    }
  }, []);

  // Handle Scare Audio
  const handlePlayScare = useCallback((targetCam = null) => {
    if (scareCooldown > 0) return null;
    const played = soundManager.playAbhishekScare();
    setScareSubtitle(played?.subtitle || "Where is your photocopy?");
    setTimeout(() => setScareSubtitle(null), 3000);
    setScareCooldown(10);
    setStepActions(prev => ({ ...prev, scaredAb: true }));

    // Abhishek moves away
    setEnemyLocations(prev => ({
      ...prev,
      ab: 'CAM_1',
    }));

    if (currentStep === 4) {
      setTimeout(() => {
        // Suggest closing cameras
      }, 1500);
    }

    return { success: true, abAffected: true };
  }, [scareCooldown, currentStep]);

  // Handle OMR Upload Complete in Step 5
  const handleOmrComplete = useCallback(() => {
    soundManager.playUploadSuccess();
    setTime(1); // advances from 12 AM to 1 AM
    setStepActions(prev => ({ ...prev, omrUploaded: true }));
    setTimeout(() => {
      setCurrentStep(6);
    }, 2000);
    return { hourSkipped: true, newHour: 1 };
  }, []);

  // Keyboard shortcut listener for trial night
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'KeyD') {
        e.preventDefault();
        handleToggleDoor();
      } else if (e.code === 'KeyL') {
        e.preventDefault();
        handleToggleLight();
      } else if (e.code === 'Space') {
        e.preventDefault();
        handleToggleMonitor();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        handleToggleMask();
      } else if (e.code === 'KeyA') {
        e.preventDefault();
        handlePlayScare(monitorOpen ? currentCam : 'CAM_5');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggleDoor, handleToggleLight, handleToggleMonitor, handleToggleMask, handlePlayScare, monitorOpen, currentCam]);

  // Tutorial Step Instructional Prompts
  const tutorialSteps = [
    {
      id: 0,
      title: 'STEP 1: EXPLORE SECURITY OFFICE',
      guide: 'Welcome to your trial night shift at IIT Chanthavila! Move your mouse or drag the screen to pan around the panoramic office.',
      objective: 'Look around the room (Desk on left, Blast Door on right)',
      actionHint: 'Move your mouse or swipe across the screen',
      check: true,
      canNext: true,
    },
    {
      id: 1,
      title: 'STEP 2: BLAST DOOR & HALLWAY LIGHT',
      guide: 'On your right wall is the Defense Panel. Press [D] to lock the door, and [L] to turn on the hallway light outside.',
      objective: 'Toggle the Blast Door [D] and Hallway Light [L]',
      actionHint: 'Tap DOOR and LIGHT buttons, or press [D] and [L]',
      check: stepActions.toggledDoor && stepActions.toggledLight,
      canNext: stepActions.toggledDoor && stepActions.toggledLight,
    },
    {
      id: 2,
      title: 'STEP 3: OPEN CCTV MONITOR',
      guide: 'You have 6 CCTV surveillance cameras covering the facility. Press [SPACE] or tap the surveillance bar below to flip up your monitor.',
      objective: 'Open the CCTV camera tablet [SPACE]',
      actionHint: 'Click ▲ SURVEILLANCE CAMERAS or press [SPACE]',
      check: monitorOpen,
      canNext: monitorOpen,
    },
    {
      id: 3,
      title: 'STEP 4: LOCATE ENEMIES ON CAMERAS',
      guide: 'Johann is now visible on camera! Click CAM 6 (Balcony) to spot Johann pacing outside! Also check CAM 3 (Supply Hall) where Dipu rests—watching Dipu keeps him stalled.',
      objective: 'Click through cameras and spot Johann on CAM 6',
      actionHint: 'Click CAM 6 on the map to view Johann',
      check: stepActions.checkedJohannCam,
      canNext: true,
    },
    {
      id: 4,
      title: 'STEP 5: ABHISHEK & SCARE AUDIO [A]',
      guide: 'WARNING: Abhishek is near! Abhishek breaks in even if the door is closed! Closing the door will NOT save you. Click "🔊 SCARE ABHISHEK" to broadcast teacher voice quotes and scare him away!',
      objective: 'Click "SCARE ABHISHEK" [A] (10s countdown cooldown)',
      actionHint: 'Click 🔊 SCARE ABHISHEK or press [A]',
      check: stepActions.scaredAb,
      canNext: stepActions.scaredAb,
    },
    {
      id: 5,
      title: 'STEP 6: OMR DESK TERMINAL',
      guide: 'Close cameras [SPACE] and look at your desk on the left. Click the Desk Monitor to test OMR upload. Completing uploads skips 1 whole hour toward 6 AM with 0% battery drain!',
      objective: 'Click Desk Monitor and upload an OMR sheet',
      actionHint: 'Click the computer screen on the desk',
      check: stepActions.omrUploaded,
      canNext: stepActions.omrUploaded,
    },
    {
      id: 6,
      title: 'STEP 7: JOHANN DOOR ATTACK & MASK [M]',
      guide: 'LOOK AT THE DOOR! Johann is staring through the glass window! After 2s he bangs, after 5s he attacks! Equip your MASK [M] immediately to fool him!',
      objective: 'Press [M] to put on your security mask overlay',
      actionHint: 'Press [M] or tap MASK button on the wall',
      check: stepActions.maskDefendedJohann,
      canNext: stepActions.maskDefendedJohann,
    },
    {
      id: 7,
      title: 'STEP 8: AADESH BLIND SPOT DEFENSE',
      guide: 'Aadesh has arrived outside in your doorway blind spot! Closing the door alone won\'t make him leave: you must CLOSE THE DOOR [D] and then TURN ON THE LIGHT [L] to scare him away!',
      objective: 'Close Door [D] -> Turn On Light [L] to repel Aadesh',
      actionHint: '1. Close Door [D] -> 2. Turn on Light [L]',
      check: stepActions.aadeshDefended,
      canNext: stepActions.aadeshDefended,
    },
    {
      id: 8,
      title: 'TRIAL NIGHT GRADUATION',
      guide: '6:00 AM! You have survived the trial shift and learned every defense: Cameras, Door, Light, Mask, Scare Audio, and OMR Fast-forwarding. You are ready for Night 1!',
      objective: 'Shift cleared with 100% survival rate',
      actionHint: 'Click START NIGHT 1 below to begin your journey!',
      check: true,
      canNext: true,
    },
  ];

  const currentTutorial = tutorialSteps[currentStep] || tutorialSteps[0];

  return (
    <div className="relative w-screen min-h-[100dvh] h-[100dvh] overflow-hidden bg-black select-none font-mono">
      {/* Underlying Real Interactive Office Environment */}
      <OfficeView
        gameState={simulatedGameState}
        onToggleDoor={handleToggleDoor}
        onToggleLight={handleToggleLight}
        onToggleMonitor={handleToggleMonitor}
        onToggleMask={handleToggleMask}
        onPlayScare={() => handlePlayScare('CAM_5')}
        onPause={null}
        isDoorBanging={isDoorBanging}
        onOmrComplete={handleOmrComplete}
        scareSubtitle={scareSubtitle}
      />

      {/* Underlying Real Interactive Camera Monitor */}
      {monitorOpen && (
        <CameraMonitor
          gameState={simulatedGameState}
          onSelectCam={handleSelectCam}
          onToggleMonitor={handleToggleMonitor}
          onPlayScare={handlePlayScare}
        />
      )}

      {/* TOP FLOATING GUIDED INSTRUCTOR TRANSMISSION BOX (HUD OVERLAY) */}
      <div className="fixed top-2 sm:top-4 inset-x-2 sm:inset-x-6 z-50 pointer-events-none flex justify-center">
        <div className="bg-neutral-950/95 border-2 border-emerald-500 rounded-xl p-3 sm:p-4 max-w-2xl w-full text-gray-200 shadow-[0_0_40px_rgba(16,185,129,0.4)] backdrop-blur-md pointer-events-auto space-y-2">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-emerald-900/70 pb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              <Radio size={14} className="text-emerald-400 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-black text-emerald-400 tracking-widest uppercase">
                SECURITY DISPATCH // GUIDED TRIAL NIGHT ({currentStep + 1}/9)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRulesModal(true)}
                className="px-2 sm:px-2.5 py-0.5 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/80 text-emerald-300 hover:text-white text-[9px] sm:text-[10px] font-bold transition cursor-pointer flex items-center gap-1 active:scale-95 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                title="View Rules and Security Protocol Manual"
              >
                <BookOpen size={11} className="text-emerald-400" />
                <span>VIEW RULES</span>
              </button>
              <button
                onClick={onFinish}
                className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-gray-400 hover:text-white text-[9px] sm:text-[10px] transition cursor-pointer flex items-center gap-1"
                title="Exit Tutorial"
              >
                <X size={10} />
                <span>EXIT</span>
              </button>
            </div>
          </div>

          {/* Guide Message */}
          <div className="space-y-1">
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <Sparkles size={13} className="text-yellow-400 shrink-0" />
              <span>{currentTutorial.title}</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-emerald-200 leading-relaxed font-sans sm:font-mono">
              {currentTutorial.guide}
            </p>
          </div>

          {/* Objective Checklist Bar */}
          <div className="bg-emerald-950/60 border border-emerald-800/80 rounded-lg px-2.5 py-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[10px] sm:text-xs">
            <div className="flex items-center gap-2">
              {currentTutorial.check ? (
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-yellow-400 animate-pulse shrink-0" />
              )}
              <span className={currentTutorial.check ? 'text-emerald-300 font-bold' : 'text-yellow-300 font-bold'}>
                {currentTutorial.objective}
              </span>
            </div>

            {/* Next / Progress Button */}
            {currentStep < 8 ? (
              <button
                onClick={() => {
                  if (currentStep === 4 && monitorOpen) {
                    setMonitorOpen(false);
                  }
                  setCurrentStep(prev => Math.min(8, prev + 1));
                }}
                className={`self-end sm:self-auto px-3 py-1 rounded text-[10px] sm:text-xs font-bold transition flex items-center gap-1 cursor-pointer active:scale-95 ${
                  currentTutorial.check
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-gray-300 border border-neutral-700'
                }`}
              >
                <span>{currentTutorial.check ? 'NEXT STEP' : 'SKIP STEP'}</span>
                <ChevronRight size={12} />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={onStartNight1}
                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold transition flex items-center gap-1.5 shadow-[0_0_20px_rgba(239,68,68,0.8)] cursor-pointer active:scale-95"
                >
                  <Play size={12} className="fill-white" />
                  <span>START NIGHT 1</span>
                </button>
                <button
                  onClick={onFinish}
                  className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-gray-300 rounded text-xs font-bold transition cursor-pointer"
                >
                  <span>MENU</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* SECURITY PROTOCOL MANUAL / VIEW RULES MODAL */}
      {showRulesModal && (
        <RulesModal onClose={() => setShowRulesModal(false)} />
      )}
    </div>
  );
}

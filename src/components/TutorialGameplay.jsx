import React, { useState } from 'react';
import { Shield, Play, Home, CheckCircle2, Volume2, Lock, Unlock, Lightbulb, Camera, Upload, ArrowRight, ArrowLeft } from 'lucide-react';
import { soundManager } from '../audio/SoundManager';

export default function TutorialGameplay({ onFinish, onStartNight1 }) {
  const [step, setStep] = useState(0);

  // Simulation states
  const [testDoorClosed, setTestDoorClosed] = useState(false);
  const [testLightOn, setTestLightOn] = useState(false);
  const [testMaskOn, setTestMaskOn] = useState(false);
  const [testScareDone, setTestScareDone] = useState(false);
  const [testAadeshRepelled, setTestAadeshRepelled] = useState(false);
  const [testDipuRepelled, setTestDipuRepelled] = useState(false);
  const [testOmrProgress, setTestOmrProgress] = useState(0);
  const [testOmrUploading, setTestOmrUploading] = useState(false);
  const [testOmrDone, setTestOmrDone] = useState(false);
  const [scareCooldown, setScareCooldown] = useState(0);

  const steps = [
    { title: 'WELCOME & BASIC CONTROLS', category: 'OFFICE BASICS' },
    { title: 'ABHISHEK (AB) - DOOR BREAKER', category: 'ENEMY DEFENSE' },
    { title: 'JOHANN - DOOR PEEPER & MASK', category: 'ENEMY DEFENSE' },
    { title: 'AADESH - LIGHT AFTER DOOR', category: 'ENEMY DEFENSE' },
    { title: 'DIPU - HALLWAY SPRINTER', category: 'ENEMY DEFENSE' },
    { title: 'DESK TERMINAL & OMR UPLOADS', category: 'SPEEDRUN MECHANIC' },
    { title: 'READY FOR SHIFT', category: 'GRADUATION' },
  ];

  // Step 1: Door & Light
  const handleToggleDoor = () => {
    const next = !testDoorClosed;
    setTestDoorClosed(next);
    soundManager.playDoorToggle(next);

    // Check Aadesh condition: door closed AND light turned on
    if (next && testLightOn && !testAadeshRepelled) {
      soundManager.playDoorBang();
      setTestAadeshRepelled(true);
    }
  };

  const handleToggleLight = () => {
    const next = !testLightOn;
    setTestLightOn(next);
    soundManager.playLightToggle(next);

    // Check Aadesh condition: door closed AND light turned on
    if (testDoorClosed && next && !testAadeshRepelled) {
      soundManager.playDoorBang();
      setTestAadeshRepelled(true);
    }
  };

  // Step 2: Abhishek Scare
  const handleScareAbhishek = () => {
    if (scareCooldown > 0) return;
    soundManager.playAbhishekScare();
    setTestScareDone(true);
    setScareCooldown(10);
    const timer = setInterval(() => {
      setScareCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Step 3: Johann Mask
  const handleToggleMask = () => {
    const next = !testMaskOn;
    setTestMaskOn(next);
    soundManager.playMaskSound(next);
  };

  // Step 5: Dipu Slam
  const handleSlamDipu = () => {
    soundManager.playDoorToggle(true);
    soundManager.playDoorBang();
    setTestDipuRepelled(true);
  };

  // Step 6: OMR Upload
  const handleStartOmr = () => {
    if (testOmrUploading || testOmrDone) return;
    setTestOmrUploading(true);
    setTestOmrProgress(10);
    const interval = setInterval(() => {
      setTestOmrProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTestOmrUploading(false);
          setTestOmrDone(true);
          soundManager.playUploadSuccess();
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 text-gray-200 flex flex-col justify-between p-3 sm:p-6 md:p-8 font-mono select-none overflow-y-auto">
      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-emerald-400 font-bold tracking-widest text-xs sm:text-sm uppercase">
            TUTORIAL GAMEPLAY // STEP {step + 1} OF {steps.length}
          </span>
        </div>
        <button
          onClick={onFinish}
          className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-gray-300 rounded text-xs transition cursor-pointer"
        >
          EXIT TUTORIAL
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 my-2">
        {steps.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setStep(idx)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              idx === step
                ? 'w-8 bg-emerald-500'
                : idx < step
                ? 'w-3 bg-emerald-700'
                : 'w-3 bg-neutral-800'
            }`}
            title={s.title}
          />
        ))}
      </div>

      {/* Main Interactive Training Sandbox Area */}
      <div className="max-w-3xl w-full mx-auto my-auto bg-neutral-950 border-2 border-emerald-500/80 rounded-xl p-4 sm:p-6 shadow-[0_0_50px_rgba(16,185,129,0.25)] space-y-4">
        {/* Step Badge */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-600/50">
            {steps[step].category}
          </span>
          <h2 className="text-sm sm:text-base font-black text-white tracking-wide">
            {steps[step].title}
          </h2>
        </div>

        {/* STEP 0: BASICS */}
        {step === 0 && (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Welcome to the security office of <strong className="text-white">IIT Chanthavila</strong>. Your shift runs from <strong className="text-emerald-400">12:00 AM to 6:00 AM</strong>. You must conserve battery power and protect your office against 4 animatronic threats.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
              <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded">
                <Lock size={18} className="mx-auto text-red-400 mb-1" />
                <span className="text-[11px] font-bold text-white block">DOOR [D]</span>
                <span className="text-[9px] text-gray-400">Blocks physical entry</span>
              </div>
              <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded">
                <Lightbulb size={18} className="mx-auto text-yellow-400 mb-1" />
                <span className="text-[11px] font-bold text-white block">LIGHT [L]</span>
                <span className="text-[9px] text-gray-400">Illuminates blind spot</span>
              </div>
              <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded">
                <span className="text-lg block">🎭</span>
                <span className="text-[11px] font-bold text-white block">MASK [M]</span>
                <span className="text-[9px] text-gray-400">Fools Johann</span>
              </div>
              <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded">
                <Camera size={18} className="mx-auto text-emerald-400 mb-1" />
                <span className="text-[11px] font-bold text-white block">CAMS [SPACE]</span>
                <span className="text-[9px] text-gray-400">6 CCTV feeds</span>
              </div>
            </div>

            {/* Interactive Control Drill */}
            <div className="bg-neutral-900/80 border border-neutral-800 p-3 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-gray-300">
                Try toggling the Door and Light to test audio and responsiveness:
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleToggleDoor}
                  className={`px-3 py-1.5 rounded font-bold text-xs cursor-pointer flex items-center gap-1.5 transition active:scale-95 ${
                    testDoorClosed ? 'bg-red-700 text-white' : 'bg-neutral-800 text-gray-300'
                  }`}
                >
                  {testDoorClosed ? <Lock size={14} /> : <Unlock size={14} />}
                  <span>DOOR: {testDoorClosed ? 'CLOSED' : 'OPEN'}</span>
                </button>

                <button
                  onClick={handleToggleLight}
                  className={`px-3 py-1.5 rounded font-bold text-xs cursor-pointer flex items-center gap-1.5 transition active:scale-95 ${
                    testLightOn ? 'bg-yellow-400 text-black' : 'bg-neutral-800 text-gray-300'
                  }`}
                >
                  <Lightbulb size={14} />
                  <span>LIGHT: {testLightOn ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: ABHISHEK & SCARE AUDIO */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="p-3 bg-red-950/40 border border-red-500/70 rounded-lg space-y-1.5">
              <p className="text-xs sm:text-sm text-red-200 font-bold leading-relaxed">
                ⚠️ CRITICAL UPDATE: Abhishek breaks in and kills even if the door is closed!
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">
                Closing the blast door will NOT save you from Abhishek. Instead, when he approaches nearby (Corridor C or outside your doorway), you must click <strong className="text-yellow-300">SCARE AUDIO [A]</strong> to play iconic teacher voice quotes (&quot;Submit your DPP!&quot;, &quot;Change your attitude!&quot;, &quot;Where is your photocopy!&quot;) in his room to frighten him away to an adjacent room.
              </p>
              <p className="text-[11px] text-amber-300">
                ⏳ Note: Scaring triggers a <strong className="text-white">10-second countdown</strong> before it can be used again!
              </p>
            </div>

            {/* Interactive Test Scenario */}
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-neutral-700 bg-black flex items-center justify-center shrink-0">
                <img
                  src="./assets/images/ab-random-cutout.png"
                  alt="Abhishek"
                  className={`max-h-28 object-contain transition-all duration-300 ${
                    testScareDone ? 'opacity-20 scale-75 -translate-x-8' : 'animate-pulse'
                  }`}
                />
                {testScareDone && (
                  <div className="absolute inset-0 bg-emerald-950/80 flex items-center justify-center text-center p-1 font-bold text-[10px] text-emerald-400">
                    SCARED AWAY!
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="text-xs text-gray-300">
                  {testScareDone ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5 justify-center sm:justify-start">
                      <CheckCircle2 size={16} />
                      Abhishek fled to an adjacent hallway!
                    </span>
                  ) : (
                    <span className="text-red-400 font-bold animate-pulse">
                      AB is stalking Corridor C outside the door! Press Scare below:
                    </span>
                  )}
                </div>

                <button
                  onClick={handleScareAbhishek}
                  disabled={scareCooldown > 0}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded font-mono font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shadow-lg ${
                    scareCooldown > 0
                      ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                      : 'bg-red-700 hover:bg-red-600 text-white border border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.7)] animate-pulse'
                  }`}
                >
                  <Volume2 size={16} className={scareCooldown > 0 ? 'text-neutral-500' : 'text-yellow-300'} />
                  <span>
                    {scareCooldown > 0 ? `RECHARGING (${scareCooldown}s)` : '🔊 SCARE ABHISHEK [A]'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: JOHANN & MASK */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="p-3 bg-purple-950/40 border border-purple-500/70 rounded-lg space-y-1.5">
              <p className="text-xs sm:text-sm text-purple-200 font-bold leading-relaxed">
                👤 NEW ENEMY: Johann appears looking through the closed door window!
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">
                After <strong className="text-white">2 seconds</strong>, Johann bangs loudly on the door. After <strong className="text-red-400">5 seconds</strong>, he breaks in and kills you!
              </p>
              <p className="text-xs text-yellow-300 leading-relaxed">
                🛡️ Defense: Put on your <strong className="text-white">MASK [M]</strong>. When Johann sees the mask, he is fooled and walks away!
              </p>
            </div>

            {/* Interactive Test Scenario */}
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-950 flex items-center justify-center shrink-0">
                <img
                  src="./assets/images/johann-3.png"
                  alt="Johann"
                  className={`max-h-28 object-contain transition-all duration-300 ${
                    testMaskOn ? 'opacity-10 scale-50' : 'animate-pulse'
                  }`}
                />
                {testMaskOn && (
                  <div className="absolute inset-0 bg-emerald-950/80 flex items-center justify-center text-center p-1 font-bold text-[10px] text-emerald-400">
                    JOHANN FOOLED! RETREATED!
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="text-xs text-gray-300">
                  {testMaskOn ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5 justify-center sm:justify-start">
                      <CheckCircle2 size={16} />
                      Mask equipped! Johann saw the disguise and left.
                    </span>
                  ) : (
                    <span className="text-purple-300 font-bold animate-pulse">
                      Johann is staring through the door window! Wear mask:
                    </span>
                  )}
                </div>

                <button
                  onClick={handleToggleMask}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded font-mono font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shadow-lg ${
                    testMaskOn
                      ? 'bg-yellow-500 text-black border border-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.8)]'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-gray-200 border border-neutral-600'
                  }`}
                >
                  <span className="text-base">🎭</span>
                  <span>{testMaskOn ? 'REMOVE MASK [M]' : 'WEAR MASK [M]'}</span>
                </button>
              </div>
            </div>

            {/* Mask Overlay Preview */}
            {testMaskOn && (
              <div className="relative rounded-lg overflow-hidden border border-yellow-600/70 p-2 bg-neutral-950 text-center text-xs text-yellow-300">
                <span>🎭 Fullscreen mask overlay is now active over your vision!</span>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: AADESH & LIGHT AFTER DOOR */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-3 bg-yellow-950/40 border border-yellow-500/70 rounded-lg space-y-1.5">
              <p className="text-xs sm:text-sm text-yellow-200 font-bold leading-relaxed">
                👁️ AADESH MECHANIC: Only goes away if you turn on light AFTER closing door!
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">
                Aadesh creeps into your doorway blind spot. Simply closing the door will <strong className="text-red-400">NOT</strong> make him leave! You must:
              </p>
              <ol className="list-decimal list-inside text-xs text-yellow-300 space-y-0.5">
                <li><strong className="text-white">1. Close the Blast Door [D]</strong></li>
                <li><strong className="text-white">2. Turn on the Hallway Light [L]</strong> while the door is closed!</li>
              </ol>
              <p className="text-[11px] text-gray-400">
                The bright light behind the closed blast door startles Aadesh, making him bang the door and retreat to the stairs.
              </p>
            </div>

            {/* Interactive Test Scenario */}
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-950 flex items-center justify-center shrink-0">
                <img
                  src="./assets/images/aadesh-jumpscare-cutout.png"
                  alt="Aadesh"
                  className={`max-h-28 object-contain transition-all duration-300 ${
                    testAadeshRepelled ? 'opacity-10 scale-50' : 'animate-pulse'
                  }`}
                />
                {testAadeshRepelled && (
                  <div className="absolute inset-0 bg-emerald-950/80 flex items-center justify-center text-center p-1 font-bold text-[10px] text-emerald-400">
                    AADESH REPELLED!
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="text-xs text-gray-300">
                  {testAadeshRepelled ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5 justify-center sm:justify-start">
                      <CheckCircle2 size={16} />
                      Perfect! Light behind closed door repelled Aadesh!
                    </span>
                  ) : (
                    <span className="text-yellow-400 font-bold animate-pulse">
                      Aadesh is in your blind spot! Step 1: Close Door [D] → Step 2: Turn on Light [L]:
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleToggleDoor}
                    className={`px-3.5 py-2 rounded font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      testDoorClosed ? 'bg-red-700 text-white' : 'bg-neutral-800 text-gray-300 border border-neutral-700'
                    }`}
                  >
                    {testDoorClosed ? <Lock size={14} /> : <Unlock size={14} />}
                    <span>1. DOOR: {testDoorClosed ? 'CLOSED' : 'OPEN'}</span>
                  </button>

                  <button
                    onClick={handleToggleLight}
                    className={`px-3.5 py-2 rounded font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      testLightOn ? 'bg-yellow-400 text-black' : 'bg-neutral-800 text-gray-300 border border-neutral-700'
                    }`}
                  >
                    <Lightbulb size={14} />
                    <span>2. LIGHT: {testLightOn ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: DIPU */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="p-3 bg-orange-950/40 border border-orange-500/70 rounded-lg space-y-1.5">
              <p className="text-xs sm:text-sm text-orange-200 font-bold leading-relaxed">
                ⚡ DIPU: The High-Speed Supply Hall Sprinter
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">
                Dipu rests in <strong className="text-white">CAM 3 (Supply Hall)</strong>. Watch CAM 3 regularly to stall him. If unwatched, he advances stages and sprints down the corridor (loud rapid running footsteps!).
              </p>
              <p className="text-xs text-red-300">
                You have ~2.6 seconds to slam the door [D] before he collides with your doorway!
              </p>
            </div>

            {/* Interactive Sprint Defense */}
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-950 flex items-center justify-center shrink-0">
                <img
                  src="./assets/images/dipu-jumpscare-cutout.png"
                  alt="Dipu"
                  className={`max-h-28 object-contain transition-all duration-300 ${
                    testDipuRepelled ? 'opacity-20 scale-75' : 'animate-bounce'
                  }`}
                />
                {testDipuRepelled && (
                  <div className="absolute inset-0 bg-emerald-950/80 flex items-center justify-center text-center p-1 font-bold text-[10px] text-emerald-400">
                    BLOCKED BY DOOR!
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="text-xs text-gray-300">
                  {testDipuRepelled ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5 justify-center sm:justify-start">
                      <CheckCircle2 size={16} />
                      Loud Bang! Dipu slammed into the closed door and retreated to CAM 3!
                    </span>
                  ) : (
                    <span className="text-orange-400 font-bold animate-pulse">
                      DIPU IS SPRINTING DOWN THE HALL! Slam door shut!
                    </span>
                  )}
                </div>

                <button
                  onClick={handleSlamDipu}
                  className="px-5 py-2.5 bg-red-700 hover:bg-red-600 text-white font-mono font-bold text-xs rounded flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(220,38,38,0.8)] active:scale-95"
                >
                  <Lock size={16} />
                  <span>SLAM DOOR SHUT [D]</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: OMR TERMINAL */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="p-3 bg-cyan-950/40 border border-cyan-500/70 rounded-lg space-y-1.5">
              <p className="text-xs sm:text-sm text-cyan-200 font-bold leading-relaxed">
                💻 DESK MONITOR // OMR UPLOAD SYSTEM
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">
                Located on your office counter. Uploading OMR sheets to Ligin skips <strong className="text-emerald-300">1 entire hour forward</strong> toward 6:00 AM!
              </p>
              <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                <li><strong className="text-emerald-400">0% Power Drain:</strong> Uploading does NOT consume power!</li>
                <li><strong className="text-yellow-300">Cooldown:</strong> 15 seconds cooldown between uploads.</li>
                <li><strong className="text-red-400">Quota:</strong> Nights 1 & 2 need 2 uploads/hour; Night 3 needs 3; Nights 4 & 5 need 4.</li>
              </ul>
            </div>

            {/* Interactive Upload Simulation */}
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300 font-bold">LIGIN OMR TRANSMISSION:</span>
                <span className="text-cyan-400 font-mono font-bold">{testOmrProgress}%</span>
              </div>

              <div className="w-full bg-neutral-950 border border-neutral-700 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full transition-all duration-300"
                  style={{ width: `${testOmrProgress}%` }}
                />
              </div>

              {testOmrDone ? (
                <div className="text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={16} />
                  <span>UPLOAD COMPLETE! +1 HOUR SKIPPED FORWARD!</span>
                </div>
              ) : (
                <button
                  onClick={handleStartOmr}
                  disabled={testOmrUploading}
                  className="px-4 py-2 bg-cyan-700 hover:bg-cyan-600 disabled:bg-neutral-800 text-white font-bold text-xs rounded flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Upload size={14} />
                  <span>{testOmrUploading ? 'TRANSMITTING...' : 'START TEST UPLOAD'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 6: READY */}
        {step === 6 && (
          <div className="space-y-5 text-center py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
              <Shield size={32} />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">
                TRAINING PROTOCOL COMPLETED
              </h3>
              <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
                You know how to use the cameras, blast door, hallway light, security mask, scare audio, and OMR terminal.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 max-w-sm mx-auto">
              <button
                onClick={onStartNight1}
                className="flex-1 py-3 bg-red-700 hover:bg-red-600 text-white font-bold text-xs rounded tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.7)] cursor-pointer active:scale-95"
              >
                <Play size={16} />
                <span>START NIGHT 1</span>
              </button>

              <button
                onClick={onFinish}
                className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-gray-300 font-bold text-xs rounded tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Home size={16} />
                <span>MAIN MENU</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex justify-between items-center pt-3 border-t border-neutral-800">
          <button
            onClick={() => setStep(prev => Math.max(0, prev - 1))}
            disabled={step === 0}
            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 cursor-pointer ${
              step === 0 ? 'opacity-30 cursor-not-allowed' : 'bg-neutral-900 hover:bg-neutral-800 text-gray-300'
            }`}
          >
            <ArrowLeft size={14} />
            <span>PREV</span>
          </button>

          <span className="text-[10px] text-gray-500 font-mono">
            {step + 1} / {steps.length}
          </span>

          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(prev => Math.min(steps.length - 1, prev + 1))}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow active:scale-95"
            >
              <span>NEXT</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={onStartNight1}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow active:scale-95"
            >
              <span>START NIGHT 1</span>
              <Play size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { X, AlertTriangle, CheckCircle2, CloudUpload, Clock, FileText, Sparkles } from 'lucide-react';
import { soundManager } from '../audio/SoundManager';

export default function OmrUploadModal({
  isOpen,
  onClose,
  gameState,
  onComplete,
}) {
  const [step, setStep] = useState('CONFIRM'); // 'CONFIRM' | 'UPLOADING' | 'COMPLETE'
  const [progress, setProgress] = useState(0);
  const [completeResult, setCompleteResult] = useState(null);
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const progressTimerRef = useRef(null);

  // Reset modal state whenever it is opened
  useEffect(() => {
    if (isOpen) {
      setStep('CONFIRM');
      setProgress(0);
      setCompleteResult(null);
      setShowCancelWarning(false);
    } else {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      if (gameState) {
        gameState.isOmrUploading = false;
      }
    }
  }, [isOpen]);

  // If power fails (blackout) or jumpscare triggers while uploading, cancel immediately
  useEffect(() => {
    if (gameState && (gameState.isBlackout || gameState.isGameOver)) {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      if (gameState) {
        gameState.isOmrUploading = false;
      }
      if (isOpen) {
        onClose();
      }
    }
  }, [gameState?.isBlackout, gameState?.isGameOver, isOpen, onClose]);

  // Cancel upload and reset progress to 0%
  const handleCancelUpload = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    if (gameState) {
      gameState.isOmrUploading = false;
    }
    setProgress(0);
    setStep('CONFIRM');
    onClose();
  };

  // User confirmed upload ("Yes") -> Start uploading screen with animated loading bar
  const handleStartUpload = () => {
    setStep('UPLOADING');
    setProgress(0);
    if (gameState) {
      gameState.isOmrUploading = true;
    }

    const totalDurationMs = 8200; // ~8.2 seconds total duration
    const intervalMs = 82; // 100 ticks
    let currentProg = 0;

    progressTimerRef.current = setInterval(() => {
      // Dynamic increment for realistic network transfer feel
      const increment = 0.8 + Math.random() * 0.5;
      currentProg += increment;

      if (currentProg >= 100) {
        currentProg = 100;
        setProgress(100);
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;

        // Upload complete! Play upload success audio and process hour skip
        const result = onComplete ? onComplete() : null;
        setCompleteResult(result);
        setStep('COMPLETE');

        if (gameState) {
          gameState.isOmrUploading = false;
        }

        // Auto-close after celebratory presentation
        setTimeout(() => {
          onClose();
        }, 2600);
      } else {
        setProgress(currentProg);
      }
    }, intervalMs);
  };

  // Block clicking backdrop to dismiss while uploading
  const handleBackdropClick = () => {
    if (step === 'UPLOADING') {
      setShowCancelWarning(true);
      setTimeout(() => setShowCancelWarning(false), 2000);
      return;
    }
    onClose();
  };

  if (!isOpen || !gameState) return null;

  // Segment count: 20 blocks matching uploading-omr.jpg
  const totalSegments = 20;
  const filledSegments = Math.min(totalSegments, Math.floor((progress / 100) * totalSegments));
  const estSecondsRemaining = Math.max(1, Math.ceil(((100 - progress) / 100) * 8.2));

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-neutral-900 border-2 border-neutral-700 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.95)] overflow-hidden font-mono"
      >
        {/* Retro Window Header */}
        <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 border-b border-neutral-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-gray-200 tracking-wider">
              LIGIN OMR EVALUATION TERMINAL v1.2
            </span>
          </div>

          {step !== 'UPLOADING' ? (
            <button
              onClick={onClose}
              className="p-1 rounded text-gray-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
              title="Close Dialog"
            >
              <X size={16} />
            </button>
          ) : (
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-950/60 border border-amber-700/50 rounded">
              LOCKED DURING UPLOAD
            </span>
          )}
        </div>

        {/* Modal Body: STEP 1 - CONFIRMATION ("Upload OMR? Yes / No") */}
        {step === 'CONFIRM' && (
          <div className="p-4 sm:p-6 space-y-4">
            {/* Display the upload-confirmation.png image featuring Ligin */}
            <div className="relative rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 shadow-inner max-h-56 sm:max-h-64 flex items-center justify-center">
              <img
                src="./assets/images/upload-confirmation.png"
                alt="Upload OMR to Ligin"
                className="w-full h-full object-contain filter contrast-105"
              />
            </div>

            {/* Prompt details */}
            <div className="bg-neutral-950/80 border border-neutral-800 rounded-lg p-3 text-center space-y-1.5">
              <p className="text-sm sm:text-base font-bold text-white tracking-wide">
                Upload OMR Answer Sheets to Ligin?
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Batch evaluation progress: <span className="text-emerald-400 font-bold">{gameState.omrUploadsInCycle}/{gameState.omrQuota}</span> uploads completed.
                <br />
                <span className="text-yellow-400 text-[11px]">
                  ★ Every {gameState.omrQuota} uploads skips 1 In-Game Hour! ★
                </span>
              </p>
              <div className="pt-1 text-[11px] text-gray-500">
                Cooldown after upload: <span className="text-gray-300 font-bold">{gameState.omrMaxCooldown}s</span>
              </div>
            </div>

            {/* Yes and No Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={handleStartUpload}
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base rounded-lg border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} />
                <span>YES</span>
              </button>

              <button
                onClick={onClose}
                className="py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-gray-300 hover:text-white font-bold text-sm sm:text-base rounded-lg border border-neutral-600 transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <X size={18} />
                <span>NO</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Body: STEP 2 - UPLOADING SCREEN (Matching uploading-omr.jpg with animated loading bar) */}
        {step === 'UPLOADING' && (
          <div className="p-4 sm:p-6 bg-[#f7f9f6] text-[#0d2a13] space-y-4 rounded-b-xl relative">
            {/* CRT monitor frame styling overlay */}
            <div className="text-center space-y-2">
              {/* Animated Document + Floating Clouds & Upload Arrow */}
              <div className="flex justify-center items-center gap-2">
                <div className="relative">
                  <FileText size={38} className="text-[#0d2a13]" />
                  <CloudUpload
                    size={22}
                    className="absolute -top-2 -right-2 text-emerald-600 animate-bounce"
                  />
                </div>
                <h3 className="text-base sm:text-xl font-black tracking-tight text-[#0d2a13]">
                  Uploading OMR to Ligin...
                </h3>
              </div>
            </div>

            {/* Animated Segmented Loading Bar (20 rectangular blocks replica) */}
            <div className="bg-[#111813] p-3 rounded-lg border-2 border-[#0d2a13] shadow-md space-y-2">
              <div className="flex items-center gap-2.5">
                {/* 20 Segments Bar */}
                <div className="flex-1 h-8 sm:h-9 bg-[#1a261c] border-2 border-[#334d38] rounded p-0.5 flex gap-1 items-center overflow-hidden">
                  {Array.from({ length: totalSegments }).map((_, idx) => {
                    const isFilled = idx < filledSegments;
                    const isCurrent = idx === filledSegments;
                    return (
                      <div
                        key={idx}
                        className={`h-full flex-1 rounded-[1px] transition-all duration-75 ${
                          isFilled
                            ? 'bg-[#00e600] shadow-[0_0_8px_#00e600]'
                            : isCurrent
                            ? 'bg-[#00ff00] animate-pulse shadow-[0_0_12px_#00ff00]'
                            : 'bg-[#182319] border border-neutral-800/40'
                        }`}
                      />
                    );
                  })}
                </div>

                {/* Percentage Text */}
                <span className="text-base sm:text-lg font-black text-[#00e600] min-w-[50px] text-right">
                  {Math.round(progress)}%
                </span>
              </div>

              {/* Status information under loading bar */}
              <div className="flex justify-between items-center text-[11px] text-gray-300 font-bold px-1">
                <span>EST. {estSecondsRemaining} sec remaining.</span>
                <span className="text-emerald-400 font-mono">
                  Batch #{gameState.omrUploadCount + 1}
                </span>
              </div>
            </div>

            {/* Warning: "Do not close the window" */}
            <div className="text-center">
              <p className="text-xs sm:text-sm font-bold tracking-wider text-red-600 animate-pulse">
                Do not close the window
              </p>
              <p className="text-[10px] text-gray-600 mt-0.5">
                © 2024 Ligin Systems | OMR Uploader v1.2
              </p>
            </div>

            {/* Notice if player tries to dismiss without cancelling */}
            {showCancelWarning && (
              <div className="p-2 bg-red-100 border border-red-500 rounded text-red-700 text-xs font-bold text-center animate-bounce">
                Upload in progress! Click &quot;CANCEL UPLOAD&quot; below to abort.
              </div>
            )}

            {/* Explicit Cancel Button (Requirement: User is not allowed to leave without cancelling) */}
            <div className="pt-2 border-t border-gray-300 flex flex-col items-center gap-1.5">
              <button
                onClick={handleCancelUpload}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-lg border border-red-800 shadow transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <X size={16} />
                <span>CANCEL UPLOAD</span>
              </button>
              <span className="text-[10px] text-gray-500 text-center">
                Cancelling aborts transmission. You will have to start over from 0%.
              </span>
            </div>
          </div>
        )}

        {/* Modal Body: STEP 3 - UPLOAD COMPLETE */}
        {step === 'COMPLETE' && (
          <div className="p-6 bg-neutral-950 text-white space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 mx-auto flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.6)] animate-bounce">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-emerald-400 tracking-wider">
                UPLOAD COMPLETE!
              </h3>
              <p className="text-xs text-gray-300">
                OMR Answer Sheets successfully verified and evaluated by Ligin.
              </p>
            </div>

            {/* Hour skip celebration */}
            {completeResult?.hourSkipped ? (
              <div className="p-3.5 bg-yellow-950/80 border-2 border-yellow-400 rounded-xl space-y-1 shadow-[0_0_25px_rgba(250,204,21,0.5)]">
                <div className="flex items-center justify-center gap-2 text-yellow-300 font-black text-sm sm:text-base">
                  <Sparkles size={18} />
                  <span>★ +1 HOUR SKIPPED! ★</span>
                  <Sparkles size={18} />
                </div>
                <p className="text-xs text-yellow-200">
                  Time advanced! Current time is now <span className="font-bold text-white text-sm">{completeResult.newHour === 0 ? 12 : completeResult.newHour} AM</span>.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-gray-300">
                Progress: <span className="text-emerald-400 font-bold">{gameState.omrUploadsInCycle}/{gameState.omrQuota}</span> uploads toward next hour skip!
              </div>
            )}

            <div className="text-[11px] text-gray-400">
              Terminal cooldown: <span className="text-amber-400 font-bold">{gameState.omrMaxCooldown}s</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-lg border border-emerald-400 transition cursor-pointer"
            >
              RETURN TO OFFICE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

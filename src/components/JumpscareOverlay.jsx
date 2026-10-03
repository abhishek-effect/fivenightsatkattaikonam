import React, { useEffect, useState } from 'react';
import { soundManager } from '../audio/SoundManager';

export default function JumpscareOverlay({ jumpscareWho, onJumpscareEnd }) {
  const [showStaticCut, setShowStaticCut] = useState(false);

  useEffect(() => {
    // Play jumpscare scream
    soundManager.playJumpscare();

    // After 1.6s, cut to fuzz static
    const staticTimer = setTimeout(() => {
      setShowStaticCut(true);
      soundManager.playStaticBurst(0.8, 0.4);
    }, 1600);

    // After 2.4s, trigger Game Over screen
    const endTimer = setTimeout(() => {
      onJumpscareEnd();
    }, 2400);

    return () => {
      clearTimeout(staticTimer);
      clearTimeout(endTimer);
    };
  }, [onJumpscareEnd]);

  // Determine jumpscare asset
  let imageSrc = './assets/images/ab-jumpscare.jpg';
  let title = 'AB ATTACKED';

  if (jumpscareWho === 'dipu') {
    imageSrc = './assets/images/dipu-jumpscare.png';
    title = 'DIPU ATTACKED';
  } else if (jumpscareWho === 'aadesh') {
    imageSrc = './assets/images/aadesh-jumpscare.jpg';
    title = 'AADESH ATTACKED';
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden select-none">
      {/* Violent Jumpscare Animation */}
      {!showStaticCut ? (
        <div className="relative w-full h-full flex items-center justify-center shake-intense strobe-effect">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover filter contrast-150 saturate-150 scale-125"
          />
          {/* Blood-red vignette overlay */}
          <div className="absolute inset-0 bg-red-900/40 mix-blend-color-burn pointer-events-none" />
          <div className="crt-overlay" />
          <div className="crt-vignette" />
        </div>
      ) : (
        /* Post-Jumpscare TV Static Cut */
        <div className="relative w-full h-full bg-neutral-900 static-fuzz flex items-center justify-center">
          <div className="text-center font-mono space-y-2">
            <h2 className="text-red-600 text-3xl font-black tracking-widest glitch-text">
              SIGNAL LOST
            </h2>
            <p className="text-gray-400 text-sm tracking-widest uppercase">
              SECURITY SYSTEM DISCONNECTED
            </p>
          </div>
          <div className="crt-overlay" />
        </div>
      )}
    </div>
  );
}

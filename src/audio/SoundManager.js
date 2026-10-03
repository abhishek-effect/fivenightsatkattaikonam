// FNAF Web Audio API Synthesizer & Audio Asset Player

class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterGain = null;
    this.fanNode = null;
    this.fanGain = null;
    this.jumpscareAudio = null;
    this.heartbeatTimer = null;
    this.blackoutInterval = null;
    this.initJumpscare();
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.isMuted ? 0 : 1;
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  initJumpscare() {
    try {
      this.jumpscareAudio = new Audio('./assets/audio/jumpscare.mp3');
      this.jumpscareAudio.preload = 'auto';
    } catch (e) {
      console.warn('Jumpscare audio init error:', e);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime, 0.05);
    }
    if (this.jumpscareAudio) {
      this.jumpscareAudio.muted = this.isMuted;
    }
    return this.isMuted;
  }

  // --- AMBIENT FAN SOUND ---
  startFan() {
    if (this.fanNode) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.95 * b1 + white * 0.1;
        b2 = 0.85 * b2 + white * 0.2;
        output[i] = (b0 + b1 + b2) * 0.3;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'lowpass';
      bandpass.frequency.value = 400;

      // Resonant motor tone
      const motorOsc = this.ctx.createOscillator();
      motorOsc.type = 'sawtooth';
      motorOsc.frequency.value = 60; // 60Hz mains hum

      const motorGain = this.ctx.createGain();
      motorGain.gain.value = 0.03;

      this.fanGain = this.ctx.createGain();
      this.fanGain.gain.value = 0.15;

      whiteNoise.connect(bandpass);
      bandpass.connect(this.fanGain);
      motorOsc.connect(motorGain);
      motorGain.connect(this.fanGain);

      this.fanGain.connect(this.masterGain);

      whiteNoise.start();
      motorOsc.start();

      this.fanNode = { whiteNoise, motorOsc, bandpass };
    } catch (e) {
      console.warn('Fan audio error:', e);
    }
  }

  stopFan() {
    if (this.fanGain && this.ctx) {
      this.fanGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
    }
    setTimeout(() => {
      if (this.fanNode) {
        try {
          this.fanNode.whiteNoise.stop();
          this.fanNode.motorOsc.stop();
        } catch (_) {}
        this.fanNode = null;
        this.fanGain = null;
      }
    }, 250);
  }

  // --- CAMERA MONITOR WHOOSH ---
  playCameraFlip(isOpening) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    if (isOpening) {
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.15);
    } else {
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);
    }

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.2);

    this.playStaticBurst(0.12, 0.18);
  }

  // --- CAMERA STATIC / GLITCH ---
  playStaticBurst(duration = 0.15, volume = 0.2) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    try {
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * volume;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      filter.Q.value = 1.2;

      noise.connect(filter);
      filter.connect(this.masterGain);

      noise.start();
    } catch (_) {}
  }

  // --- DOOR SLAM / OPEN ---
  playDoorToggle(isClosing) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Heavy pneumatic clunk
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    if (isClosing) {
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.25);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    } else {
      osc.frequency.setValueAtTime(45, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    }

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.3);

    // Mechanical click
    this.playStaticBurst(0.08, 0.15);
  }

  // --- HALLWAY LIGHT CLICK & BUZZ ---
  playLightToggle(isOn) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now); // 120Hz ballast buzz
    gain.gain.setValueAtTime(isOn ? 0.2 : 0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isOn ? 0.25 : 0.08));

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  // --- FOOTSTEP / ANIMATRONIC MOVEMENT ---
  playFootstep(fast = false) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(fast ? 90 : 65, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + (fast ? 0.1 : 0.2));

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (fast ? 0.12 : 0.22));

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  // --- DOOR BANG (WHEN ANIMATRONIC HITS CLOSED DOOR) ---
  playDoorBang() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    [0, 0.12, 0.25].forEach(delay => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, now + delay);
      osc.frequency.exponentialRampToValueAtTime(30, now + delay + 0.15);
      gain.gain.setValueAtTime(0.45, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + delay);
      osc.stop(now + delay + 0.2);
    });
  }

  // --- HEARTBEAT TENSION ---
  startHeartbeat() {
    if (this.heartbeatTimer) return;
    this.heartbeatTimer = setInterval(() => {
      this.playFootstep(true);
      setTimeout(() => this.playFootstep(true), 150);
    }, 900);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // --- 6 AM WIN CHIME & CHEER ---
  play6AMChimes() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const notes = [
      { f: 523.25, d: 0.4 }, // C5
      { f: 659.25, d: 0.4 }, // E5
      { f: 587.33, d: 0.4 }, // D5
      { f: 392.00, d: 0.8 }, // G4
      { f: 523.25, d: 0.5 }, // C5
      { f: 587.33, d: 0.5 }, // D5
      { f: 659.25, d: 0.5 }, // E5
      { f: 523.25, d: 1.2 }  // C5
    ];

    let t = this.ctx.currentTime + 0.1;
    notes.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = n.f;
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + n.d);
      t += n.d * 0.85;
    });
  }

  // --- BLACKOUT TOREADOR MUSIC BOX ---
  playBlackoutMusic() {
    this.stopBlackoutMusic();
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    // Toreador march melody fragments (FNAF style music box)
    const melody = [
      { f: 392.00, d: 0.3 }, // G4
      { f: 392.00, d: 0.3 }, // G4
      { f: 440.00, d: 0.3 }, // A4
      { f: 392.00, d: 0.3 }, // G4
      { f: 349.23, d: 0.3 }, // F4
      { f: 329.63, d: 0.4 }, // E4
      { f: 293.66, d: 0.4 }, // D4
      { f: 261.63, d: 0.6 }, // C4
      { f: 329.63, d: 0.3 }, // E4
      { f: 392.00, d: 0.3 }, // G4
      { f: 523.25, d: 0.8 }  // C5
    ];

    let index = 0;
    this.blackoutInterval = setInterval(() => {
      if (!this.ctx || this.isMuted) return;
      const note = melody[index % melody.length];
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle'; // chime/music box metallic feel
      osc.frequency.value = note.f * 1.5; // music box octave
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.d * 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + note.d * 1.3);

      index++;
    }, 450);
  }

  stopBlackoutMusic() {
    if (this.blackoutInterval) {
      clearInterval(this.blackoutInterval);
      this.blackoutInterval = null;
    }
  }

  // --- JUMPSCARE SFX PLAYBACK ---
  playJumpscare() {
    this.stopFan();
    this.stopHeartbeat();
    this.stopBlackoutMusic();
    this.initContext();

    if (this.jumpscareAudio) {
      try {
        this.jumpscareAudio.currentTime = 0;
        this.jumpscareAudio.volume = this.isMuted ? 0 : 1;
        const playPromise = this.jumpscareAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.warn('Audio play prevented, synthesizing fallback scream:', e);
            this.playFallbackScream();
          });
        }
      } catch (e) {
        this.playFallbackScream();
      }
    } else {
      this.playFallbackScream();
    }
  }

  playFallbackScream() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(300, now + 1.2);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 1.5);
    this.playStaticBurst(1.5, 0.4);
  }
}

export const soundManager = new SoundManager();

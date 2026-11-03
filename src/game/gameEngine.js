// Game Engine for Five Nights at Kattaikonam (FNAK)

export const CAMERAS = [
  { id: 'CAM_1', name: 'Physics Lab', sub: 'Room A', image: './assets/images/cam-room-a.jpg', x: 20, y: 30 },
  { id: 'CAM_2', name: 'Main Corridor', sub: 'Corridor A', image: './assets/images/cam-corridor-a.jpg', x: 50, y: 35 },
  { id: 'CAM_3', name: 'Supply Hallway', sub: 'Corridor B', image: './assets/images/cam-corridor-b.jpg', x: 80, y: 40 },
  { id: 'CAM_4', name: 'Central Stairs', sub: 'Staircase', image: './assets/images/cam-stairs.jpg', x: 30, y: 70 },
  { id: 'CAM_5', name: 'Corridor C', sub: 'Hallway C', image: './assets/images/cam-corridor-c.jpg', x: 65, y: 75 },
  { id: 'CAM_6', name: 'Balcony', sub: 'Terrace', image: './assets/images/cam-balcony.jpg', x: 85, y: 75 },
];


export const HOURLY_AI_SCHEDULE = {
  1: [
    // 12 AM: Peaceful orientation (all 0)
    { hour: 0, aadesh: 0, dipu: 0, ab: 0, johann: 0 },
    // 1 AM: Aadesh awakens (Bonnie-like roaming starts)
    { hour: 1, aadesh: 1, dipu: 0, ab: 0, johann: 0 },
    // 2 AM: Aadesh picks up pace
    { hour: 2, aadesh: 2, dipu: 0, ab: 0, johann: 0 },
    // 3 AM: Dipu stirs in CAM 3 (Foxy begins stirring)
    { hour: 3, aadesh: 3, dipu: 1, ab: 1, johann: 0 },
    // 4 AM: Dipu and Aadesh active
    { hour: 4, aadesh: 4, dipu: 2, ab: 1, johann: 0 },
    // 5 AM: Final hour pressure
    { hour: 5, aadesh: 4, dipu: 3, ab: 2, johann: 0 },
  ],
  2: [
    // Night 2: Johann awakens! (Balcony lurker joins)
    { hour: 0, aadesh: 2, dipu: 1, ab: 0, johann: 1 },
    { hour: 1, aadesh: 3, dipu: 1, ab: 1, johann: 2 },
    { hour: 2, aadesh: 4, dipu: 2, ab: 1, johann: 2 },
    { hour: 3, aadesh: 5, dipu: 3, ab: 2, johann: 3 },
    { hour: 4, aadesh: 5, dipu: 4, ab: 3, johann: 4 },
    { hour: 5, aadesh: 6, dipu: 4, ab: 4, johann: 5 },
  ],
  3: [
    // Night 3: Full escalation! Abhishek door breaker active, generator unlocked
    { hour: 0, aadesh: 4, dipu: 3, ab: 3, johann: 3 },
    { hour: 1, aadesh: 5, dipu: 3, ab: 4, johann: 4 },
    { hour: 2, aadesh: 6, dipu: 4, ab: 5, johann: 3 }, // Johann brief lull
    { hour: 3, aadesh: 7, dipu: 5, ab: 6, johann: 5 },
    { hour: 4, aadesh: 8, dipu: 6, ab: 7, johann: 6 },
    { hour: 5, aadesh: 9, dipu: 7, ab: 8, johann: 7 },
  ],
  4: [
    // Night 4: Lockdown
    { hour: 0, aadesh: 7, dipu: 5, ab: 6, johann: 5 },
    { hour: 1, aadesh: 8, dipu: 6, ab: 7, johann: 6 },
    { hour: 2, aadesh: 9, dipu: 7, ab: 8, johann: 6 }, // slight lull
    { hour: 3, aadesh: 10, dipu: 8, ab: 9, johann: 8 },
    { hour: 4, aadesh: 12, dipu: 9, ab: 11, johann: 10 },
    { hour: 5, aadesh: 13, dipu: 11, ab: 12, johann: 11 },
  ],
  5: [
    // Night 5: The Final Shift (True Terror)
    { hour: 0, aadesh: 10, dipu: 8, ab: 9, johann: 8 },
    { hour: 1, aadesh: 12, dipu: 10, ab: 11, johann: 10 },
    { hour: 2, aadesh: 13, dipu: 11, ab: 12, johann: 10 }, // 2 AM calm before the storm
    { hour: 3, aadesh: 15, dipu: 13, ab: 14, johann: 13 },
    { hour: 4, aadesh: 17, dipu: 15, ab: 16, johann: 15 },
    { hour: 5, aadesh: 18, dipu: 17, ab: 18, johann: 17 },
  ],
};

export const NIGHT_PRESETS = {
  1: { hourSeconds: 400 / 6, abLevel: 3, dipuLevel: 1, aadeshLevel: 2, johannLevel: 2, doorWaitTime: 5.0, label: 'Night 1 - The Orientation' },
  2: { hourSeconds: 400 / 6, abLevel: 6, dipuLevel: 4, aadeshLevel: 5, johannLevel: 5, doorWaitTime: 4.0, label: 'Night 2 - Disturbances' },
  3: { hourSeconds: 400 / 6, abLevel: 10, dipuLevel: 8, aadeshLevel: 9, johannLevel: 8, doorWaitTime: 3.0, label: 'Night 3 - Escalation' },
  4: { hourSeconds: 400 / 6, abLevel: 14, dipuLevel: 12, aadeshLevel: 13, johannLevel: 12, doorWaitTime: 2.0, label: 'Night 4 - Lockdown' },
  5: { hourSeconds: 400 / 6, abLevel: 18, dipuLevel: 17, aadeshLevel: 18, johannLevel: 16, doorWaitTime: 1.0, label: 'Night 5 - Final Shift' },
};

// Standalone helper function for usage bars calculation
export function getUsageBars(state) {
  if (!state || state.isBlackout) return 0;
  let bars = 1; // base usage
  if (state.isDoorClosed) bars += 2;
  if (state.isLightOn) bars += 1;
  if (state.isMonitorOpen) bars += 1;
  return Math.min(5, bars);
}

export class GameState {
  constructor(night = 1, customConfig = null) {
    const config = customConfig || NIGHT_PRESETS[night] || NIGHT_PRESETS[1];
    this.night = night;
    this.customConfig = customConfig;
    this.isGeneratorAvailable = true; // Usable from the start on all shifts
    this.isGeneratorUsed = false;
    this.isGeneratorPrimed = false;
    this.generatorBonus = 0;
    this.hourSeconds = config.hourSeconds || (400 / 6);
    this.abLevel = config.abLevel ?? 4;
    this.dipuLevel = config.dipuLevel ?? 3;
    this.aadeshLevel = config.aadeshLevel ?? 4;
    this.johannLevel = config.johannLevel ?? Math.min(18, Math.max(1, (this.night - 1) * 3 + 2));
    // Reaction time window at door: 5s on Night 1, 4s on Night 2, down to 1s on Night 5
    this.doorWaitTime = config.doorWaitTime ?? Math.max(1.0, 6.0 - this.night);

    this.time = 0; // 0 = 12 AM, 1 = 1 AM, ... 6 = 6 AM
    this.timeProgress = 0; // 0 to 1 within current hour
    this.power = 100.0;
    this.isBlackout = false;
    this.isDoorClosed = false;
    this.isLightOn = false;
    this.isMonitorOpen = false;
    this.isMaskOn = false;
    this.scareCooldown = 0; // 10 second countdown for scare audio
    this.currentCam = 'CAM_1';
    this.isGameOver = false;
    this.isGameWon = false;
    this.jumpscareWho = null; // 'ab', 'dipu', 'aadesh', 'johann'

    // Animatronic states
    this.ab = {
      location: 'CAM_1', // CAM_1 -> CAM_2 -> CAM_4/6 -> CAM_5 -> DOOR
      atDoorTimer: 0,
      hasBangedDoor: false,
    };

    this.dipu = {
      stage: 0, // 0 = In CAM_3, 1 = Peeking CAM_3, 2 = Sprinting down hallway
      sprintTimer: 0,
      stallTimer: 0,
    };

    this.aadesh = {
      location: 'CAM_4', // CAM_4 -> CAM_2/CAM_6 -> CAM_5 -> BLIND_SPOT
      atBlindSpotTimer: 0,
      wasDoorClosedWhilePresent: false,
    };

    this.johann = {
      location: 'IDLE', // IDLE -> DOOR
      timer: 0,
      hasBanged: false,
      maskTimer: 0,
    };

    // Desk Monitor & OMR Subsystem
    this.omrUploadCount = 0; // Total uploads completed this shift
    this.omrUploadsInCycle = 0; // Uploads count towards current hour skip
    // Quota: Night 1 & 2: 2 uploads, Night 3: 3 uploads, Night 4 & 5: 4 uploads
    this.omrQuota = (this.night === 1 || this.night === 2) ? 2 : (this.night === 3 ? 3 : 4);
    // Cooldown: 15 seconds before next upload is possible
    this.omrMaxCooldown = 15;
    this.omrCooldown = 0; // Starts ready (0s)
    this.isOmrUploading = false;
    this.applyHourlyAI();
  }


  // FNAF-inspired hourly AI level scheduler
  applyHourlyAI(onEvent = null) {
    if (this.customConfig) {
      if (this.time >= 2) {
        const bonus = Math.min(3, Math.floor(this.time / 2));
        this.abLevel = Math.min(20, (this.customConfig.abLevel ?? 10) + bonus);
        this.dipuLevel = Math.min(20, (this.customConfig.dipuLevel ?? 10) + bonus);
        this.aadeshLevel = Math.min(20, (this.customConfig.aadeshLevel ?? 10) + bonus);
        this.johannLevel = Math.min(20, (this.customConfig.johannLevel ?? 10) + bonus);
      }
      return;
    }

    const schedule = HOURLY_AI_SCHEDULE[this.night];
    if (!schedule) return;

    const currentHourIndex = Math.min(5, Math.max(0, this.time));
    const entry = schedule[currentHourIndex];
    if (entry) {
      this.aadeshLevel = entry.aadesh;
      this.dipuLevel = entry.dipu;
      this.abLevel = entry.ab;
      this.johannLevel = entry.johann;
    }
  }

  // Auxiliary Power Generator: Usable from the start!
  // If power reaches 0%, extra power activates immediately;
  // If power > 0%, arms/primes the generator so it will automatically trigger when power reaches 0%!
  solveGeneratorWirePuzzle(onEvent = null) {
    if (this.isGeneratorUsed) return { activated: false, primed: false };
    const powerBonus = Math.floor(Math.random() * 6) + 10; // 10% to 15%
    this.generatorBonus = powerBonus;

    // If already at 0% power or in blackout: activate immediately!
    if (this.power <= 0 || this.isBlackout) {
      return this.activateGenerator(onEvent);
    }

    // Otherwise prime for when power reaches 0%
    this.isGeneratorPrimed = true;
    if (onEvent) {
      onEvent({
        type: 'GENERATOR_PRIMED',
        powerBonus,
      });
    }
    return { activated: false, primed: true, powerBonus };
  }

  // Activate extra power (triggered when power reaches 0%)
  activateGenerator(onEvent = null) {
    if (this.isGeneratorUsed) return { activated: false, powerRestored: 0 };
    const powerRestored = this.generatorBonus || (Math.floor(Math.random() * 6) + 10);
    this.power = Math.min(100, this.power + powerRestored);
    this.isGeneratorUsed = true;
    this.isGeneratorPrimed = false;
    if (this.isBlackout) {
      this.isBlackout = false;
      this.blackoutTimer = 0;
    }
    if (onEvent) {
      onEvent({
        type: 'GENERATOR_ACTIVATED',
        powerRestored,
        newPower: this.power,
      });
    }
    return { activated: true, powerRestored, newPower: this.power };
  }
  getUsageBars() {
    return getUsageBars(this);
  }

  // Handle door toggle from player
  toggleDoor(onEvent) {
    if (this.isBlackout) return false;
    const willClose = !this.isDoorClosed;
    this.isDoorClosed = willClose;

    if (willClose) {
      // DIPU defense check: if sprinting, blocked by door!
      if (this.dipu.stage === 2) {
        // Dipu is blocked when he reaches the door
      }

      // AADESH defense check: Aadesh only goes away if you turn on lights AFTER closing door
      if (this.aadesh.location === 'BLIND_SPOT') {
        this.aadesh.wasDoorClosedWhilePresent = true;
        // If light is already active when door closes, Aadesh is repelled immediately!
        if (this.isLightOn) {
          this.defendAadesh(onEvent);
          return true;
        }
      }

      // NOTE: Abhishek breaks in even if door is closed! Door does not repel Abhishek.
      return false;
    } else {
      // Door opened
      if (this.aadesh.location === 'BLIND_SPOT') {
        this.aadesh.wasDoorClosedWhilePresent = false;
      }
    }
    return false;
  }

  // Handle light toggle from player
  toggleLight(onEvent) {
    if (this.isBlackout) return false;
    this.isLightOn = !this.isLightOn;

    // Aadesh mechanic: Aadesh only goes away if you turn on lights after closing door!
    if (this.isLightOn && this.isDoorClosed && this.aadesh.location === 'BLIND_SPOT') {
      this.defendAadesh(onEvent);
      return true;
    }
    return false;
  }

  // Defend against Aadesh
  defendAadesh(onEvent) {
    this.aadesh.location = 'CAM_4';
    this.aadesh.atBlindSpotTimer = 0;
    this.aadesh.wasDoorClosedWhilePresent = false;
    if (onEvent) onEvent({ type: 'DOOR_DEFENSE', animatronic: 'aadesh' });
  }

  // Handle mask toggle from player
  toggleMask(onEvent) {
    if (this.isBlackout || this.isOmrUploading) return false;
    // Putting on mask closes surveillance monitor
    if (!this.isMaskOn && this.isMonitorOpen) {
      this.isMonitorOpen = false;
    }
    this.isMaskOn = !this.isMaskOn;

    if (onEvent) onEvent({ type: 'MASK_TOGGLE', isMaskOn: this.isMaskOn });

    // Check if Johann is present at the door when mask is put on
    if (this.isMaskOn && this.johann.location === 'DOOR') {
      // Mask worn fools Johann
      this.johann.maskTimer = 0.5; // Start mask recognition quickly
    }

    return this.isMaskOn;
  }

  // Abhishek Scare Audio Mechanic
  // Player plays scare audio in a camera room or front of office to scare him away
  // 10 second countdown cooldown
  playScareAudio(targetCam = null, onEvent = null) {
    if (this.scareCooldown > 0) {
      return { success: false, reason: 'COOLDOWN', remaining: this.scareCooldown };
    }

    this.scareCooldown = 10.0; // 10s countdown

    // Target room defaults to current camera or CAM_5 (Corridor C right in front of door)
    const room = targetCam || this.currentCam || 'CAM_5';
    let abAffected = false;
    let newLocation = null;

    const isAbAtDoor = (this.ab.location === 'DOOR');
    const isAbInRoom = (this.ab.location === room);

    // If audio is played in front of office door (CAM_5) and AB is at DOOR:
    if (isAbAtDoor && (room === 'CAM_5' || room === 'DOOR')) {
      abAffected = true;
      this.ab.atDoorTimer = 0;
      this.ab.hasBangedDoor = false;
      // Guaranteed moves away from player!
      const awayRooms = ['CAM_2', 'CAM_4', 'CAM_6'];
      newLocation = awayRooms[Math.floor(Math.random() * awayRooms.length)];
      this.ab.location = newLocation;
    } else if (isAbInRoom) {
      abAffected = true;
      this.ab.atDoorTimer = 0;
      this.ab.hasBangedDoor = false;

      // If audio is played in a room right in front of the office door (CAM_5), he should move away!
      if (room === 'CAM_5') {
        const awayRooms = ['CAM_2', 'CAM_4', 'CAM_6'];
        newLocation = awayRooms[Math.floor(Math.random() * awayRooms.length)];
      } else {
        // 2/3 times he moves away from player, 1/3 times towards player
        const roll = Math.random();
        if (roll < (2 / 3)) {
          // Moves away from player
          if (room === 'CAM_2') newLocation = 'CAM_1';
          else if (room === 'CAM_4' || room === 'CAM_6') newLocation = 'CAM_2';
          else if (room === 'CAM_1') newLocation = 'CAM_1';
          else newLocation = 'CAM_1';
        } else {
          // 1/3 times moves towards player
          if (room === 'CAM_1') newLocation = 'CAM_2';
          else if (room === 'CAM_2' || room === 'CAM_4' || room === 'CAM_6') newLocation = 'CAM_5';
          else newLocation = 'DOOR';
        }
      }
      this.ab.location = newLocation;
    }

    if (onEvent) {
      onEvent({
        type: 'SCARE_AUDIO_PLAYED',
        room,
        abAffected,
        newLocation,
      });
      if (abAffected) {
        onEvent({ type: 'AB_SCARED', to: newLocation });
      }
    }

    return { success: true, abAffected, newLocation, room };
  }

  // Skip one in-game hour (triggered when OMR quota is met)
  skipHour(onEvent) {
    if (this.isGameOver || this.isGameWon) return;
    this.timeProgress = 0;
    this.time += 1;
    this.applyHourlyAI(onEvent);
    if (onEvent) onEvent({ type: 'HOUR_CHANGE', hour: this.time });
    if (this.time >= 6) {
      this.isGameWon = true;
      if (onEvent) onEvent({ type: 'GAME_WIN' });
    }
  }

  // Handle completed OMR upload
  completeOmrUpload(onEvent) {
    if (this.isGameOver || this.isGameWon) return { hourSkipped: false, newHour: this.time };

    this.omrCooldown = this.omrMaxCooldown;
    this.omrUploadCount += 1;
    this.omrUploadsInCycle += 1;

    let hourSkipped = false;
    if (this.omrUploadsInCycle >= this.omrQuota) {
      this.omrUploadsInCycle = 0;
      hourSkipped = true;
      this.skipHour(onEvent);
    }

    if (onEvent) {
      onEvent({
        type: 'OMR_UPLOAD_COMPLETE',
        totalUploads: this.omrUploadCount,
        uploadsInCycle: this.omrUploadsInCycle,
        quota: this.omrQuota,
        hourSkipped,
        hour: this.time,
      });
    }

    return { hourSkipped, newHour: this.time };
  }

  // Advance game logic by deltaSeconds
  tick(dt, onEvent) {
    if (this.isGameOver || this.isGameWon) return;

    // --- SCARE AUDIO COOLDOWN DECAY (10-second countdown) ---
    if (this.scareCooldown > 0) {
      this.scareCooldown = Math.max(0, this.scareCooldown - dt);
    }

    // --- OMR COOLDOWN DECAY ---
    if (this.omrCooldown > 0) {
      this.omrCooldown = Math.max(0, this.omrCooldown - dt);
    }

    // --- TIME PROGRESSION ---
    if (!this.isBlackout) {
      this.timeProgress += dt / this.hourSeconds;
      if (this.timeProgress >= 1) {
        this.timeProgress = 0;
        this.time += 1;
        this.applyHourlyAI(onEvent);
        onEvent({ type: 'HOUR_CHANGE', hour: this.time });
        if (this.time >= 6) {
          this.isGameWon = true;
          onEvent({ type: 'GAME_WIN' });
          return;
        }
      }
    }

    // --- POWER DRAIN ---
    if (!this.isBlackout) {
      if (!this.isOmrUploading) {
        const usage = this.getUsageBars();
        const nightDrainMultiplier = 1 + (Math.max(1, this.night) - 1) * 0.015;
        const baseDrainRate = (100 / 500) * nightDrainMultiplier; // 0.2000% / sec on Night 1
        const drainPerSec = baseDrainRate * (1 + (usage - 1) * 0.65);
        this.power = Math.max(0, this.power - drainPerSec * dt);

        if (this.power <= 0) {
          // If generator is primed, automatically activate extra power when power reaches 0!
          if (this.isGeneratorPrimed && !this.isGeneratorUsed) {
            this.activateGenerator(onEvent);
            return;
          }

          this.isBlackout = true;
          this.isDoorClosed = false;
          this.isLightOn = false;
          this.isMonitorOpen = false;
          this.isMaskOn = false;
          onEvent({ type: 'BLACKOUT_START' });
          return;
        }
      }
    }

    // --- BLACKOUT MECHANIC ---
    if (this.isBlackout) {
      this.blackoutTimer = (this.blackoutTimer || 0) + dt;
      // After 8-15 seconds in blackout, AB jumpscares!
      if (this.blackoutTimer > 10 + Math.random() * 5) {
        this.triggerJumpscare('ab', onEvent);
      }
      return;
    }

    // --- ANIMATRONIC AI TICKS ---
    this.updateAB(dt, onEvent);
    this.updateJohann(dt, onEvent);
    this.updateAadesh(dt, onEvent);
    this.updateDipu(dt, onEvent);
  }

  // --- AB (Abhishek) AI ---
  // Abhishek breaks in and kills player even if door is closed!
  // Player must scare him away with scare audio
  updateAB(dt, onEvent) {
    // FNAF 1 Freddy Mechanic: Abhishek freezes while player watches his camera room!
    if (this.isMonitorOpen && this.currentCam === this.ab.location && this.ab.location !== 'DOOR') {
      this.abMoveTimer = 0;
      return;
    }
    if (this.ab.location === 'DOOR') {
      this.ab.atDoorTimer += dt;

      // If door is closed, Abhishek bangs forcefully after ~1.2s to alert player
      if (this.isDoorClosed && !this.ab.hasBangedDoor && this.ab.atDoorTimer >= 1.2) {
        this.ab.hasBangedDoor = true;
        onEvent({ type: 'AB_BREAKING_IN' });
      }

      // Kills player even if door is closed!
      if (this.ab.atDoorTimer >= this.doorWaitTime) {
        this.triggerJumpscare('ab', onEvent);
      }
      return;
    }

    // Movement opportunity check every ~3.8s
    this.abMoveTimer = (this.abMoveTimer || 0) + dt;
    if (this.abMoveTimer >= 3.8) {
      this.abMoveTimer = 0;
      const roll = Math.floor(Math.random() * 20) + 1;
      if (roll <= this.abLevel) {
        // Pathing: CAM_1 -> CAM_2 -> (CAM_4, CAM_6, or CAM_5) -> CAM_5 -> DOOR
        if (this.ab.location === 'CAM_1') {
          this.ab.location = 'CAM_2';
          onEvent({ type: 'MOVEMENT', animatronic: 'ab', to: 'CAM_2' });
        } else if (this.ab.location === 'CAM_2') {
          const choices = ['CAM_4', 'CAM_5', 'CAM_6'];
          this.ab.location = choices[Math.floor(Math.random() * choices.length)];
          onEvent({ type: 'MOVEMENT', animatronic: 'ab', to: this.ab.location });
        } else if (this.ab.location === 'CAM_4' || this.ab.location === 'CAM_6') {
          this.ab.location = 'CAM_5';
          onEvent({ type: 'MOVEMENT', animatronic: 'ab', to: 'CAM_5' });
        } else if (this.ab.location === 'CAM_5') {
          this.ab.location = 'DOOR';
          this.ab.atDoorTimer = 0;
          this.ab.hasBangedDoor = false;
          onEvent({ type: 'ENEMY_AT_DOOR', animatronic: 'ab' });
        }
      }
    }
  }

  // --- JOHANN AI ---
  // Roams CAM_6 (Balcony) -> CAM_4/2 -> CAM_5 (Corridor C) -> DOOR.
  // Can be seen through closed door window.
  // After 2 seconds, bangs the door. After 5 seconds, kills you.
  // Goes away if player wears mask.
  updateJohann(dt, onEvent) {
    // FNAF Mechanic: Watching Balcony (CAM_6) stalls Johann from departing!
    if (this.isMonitorOpen && this.currentCam === 'CAM_6' && this.johann.location === 'CAM_6') {
      this.johannMoveTimer = 0;
      return;
    }
    if (this.johann.location === 'DOOR') {
      this.johann.timer += dt;

      // Check mask defense
      if (this.isMaskOn) {
        this.johann.maskTimer += dt;
        // After wearing mask for ~0.8s while Johann is there, he retreats!
        if (this.johann.maskTimer >= 0.8) {
          this.johann.location = Math.random() < 0.5 ? 'CAM_6' : 'CAM_4';
          this.johann.timer = 0;
          this.johann.hasBanged = false;
          this.johann.maskTimer = 0;
          if (onEvent) onEvent({ type: 'JOHANN_RETREAT', to: this.johann.location });
          return;
        }
      } else {
        this.johann.maskTimer = 0;
      }

      // After 2 seconds, he bangs the door!
      if (this.johann.timer >= 2.0 && !this.johann.hasBanged) {
        this.johann.hasBanged = true;
        if (onEvent) onEvent({ type: 'JOHANN_BANG' });
      }

      // After 5 seconds, he kills you!
      if (this.johann.timer >= 5.0) {
        this.triggerJumpscare('johann', onEvent);
      }
      return;
    }

    // Camera roaming movement check every ~4.0s
    this.johannMoveTimer = (this.johannMoveTimer || 0) + dt;
    if (this.johannMoveTimer >= 4.0) {
      this.johannMoveTimer = 0;
      const roll = Math.floor(Math.random() * 20) + 1;
      if (roll <= this.johannLevel) {
        if (this.johann.location === 'CAM_6') {
          this.johann.location = Math.random() < 0.5 ? 'CAM_2' : 'CAM_4';
          onEvent({ type: 'MOVEMENT', animatronic: 'johann', to: this.johann.location });
        } else if (this.johann.location === 'CAM_4') {
          this.johann.location = 'CAM_5';
          onEvent({ type: 'MOVEMENT', animatronic: 'johann', to: 'CAM_5' });
        } else if (this.johann.location === 'CAM_2') {
          this.johann.location = 'CAM_5';
          onEvent({ type: 'MOVEMENT', animatronic: 'johann', to: 'CAM_5' });
        } else if (this.johann.location === 'CAM_5') {
          this.johann.location = 'DOOR';
          this.johann.timer = 0;
          this.johann.hasBanged = false;
          this.johann.maskTimer = 0;
          onEvent({ type: 'ENEMY_AT_DOOR', animatronic: 'johann' });
          onEvent({ type: 'JOHANN_AT_DOOR' });
        } else {
          this.johann.location = 'CAM_6';
        }
      }
    }
  }

  // --- AADESH AI ---
  // Only goes away if player turns on lights after closing door!
  updateAadesh(dt, onEvent) {
    if (this.aadesh.location === 'BLIND_SPOT') {
      // If door is closed AND light is on -> repelled!
      if (this.isDoorClosed && this.isLightOn) {
        this.defendAadesh(onEvent);
        return;
      }

      if (!this.isDoorClosed) {
        // Door is open: countdown to kill
        this.aadesh.atBlindSpotTimer += dt;
        if (this.aadesh.atBlindSpotTimer >= this.doorWaitTime) {
          this.triggerJumpscare('aadesh', onEvent);
        }
      } else {
        // Door is closed, but lights are OFF:
        // Aadesh stays waiting outside, does not leave until light is turned on!
      }
      return;
    }

    // Movement opportunity check
    this.aadeshMoveTimer = (this.aadeshMoveTimer || 0) + dt;
    if (this.aadeshMoveTimer >= 3.6) {
      this.aadeshMoveTimer = 0;
      const roll = Math.floor(Math.random() * 20) + 1;
      if (roll <= this.aadeshLevel) {
        if (this.aadesh.location === 'CAM_4') {
          this.aadesh.location = Math.random() < 0.5 ? 'CAM_2' : 'CAM_6';
          onEvent({ type: 'MOVEMENT', animatronic: 'aadesh', to: this.aadesh.location });
        } else if (this.aadesh.location === 'CAM_6') {
          this.aadesh.location = 'CAM_5';
          onEvent({ type: 'MOVEMENT', animatronic: 'aadesh', to: 'CAM_5' });
        } else if (this.aadesh.location === 'CAM_1') {
          this.aadesh.location = 'CAM_2';
          onEvent({ type: 'MOVEMENT', animatronic: 'aadesh', to: 'CAM_2' });
        } else if (this.aadesh.location === 'CAM_2') {
          this.aadesh.location = Math.random() < 0.6 ? 'CAM_5' : 'CAM_1';
          onEvent({ type: 'MOVEMENT', animatronic: 'aadesh', to: this.aadesh.location });
        } else if (this.aadesh.location === 'CAM_5') {
          this.aadesh.location = 'BLIND_SPOT';
          this.aadesh.atBlindSpotTimer = 0;
          this.aadesh.wasDoorClosedWhilePresent = this.isDoorClosed;
          onEvent({ type: 'ENEMY_AT_DOOR', animatronic: 'aadesh' });
        }
      }
    }
  }

  // --- DIPU AI ---
  updateDipu(dt, onEvent) {
    // If player is actively watching CAM_3, Dipu is stalled
    const isWatchingDipu = this.isMonitorOpen && this.currentCam === 'CAM_3';

    if (this.dipu.stage === 0 || this.dipu.stage === 1) {
      if (isWatchingDipu) {
        this.dipu.stallTimer = 0;
        return;
      }

      this.dipu.stallTimer += dt;
      // If unwatched for long enough, advance stage
      const advanceThreshold = Math.max(6, 18 - this.dipuLevel);
      if (this.dipu.stallTimer >= advanceThreshold) {
        this.dipu.stallTimer = 0;
        this.dipu.stage += 1;
        onEvent({ type: 'DIPU_STAGE', stage: this.dipu.stage });

        if (this.dipu.stage === 2) {
          // Dipu begins sprint!
          this.dipu.sprintTimer = 0;
          onEvent({ type: 'DIPU_SPRINT' });
        }
      }
    } else if (this.dipu.stage === 2) {
      // Sprinting down hallway! Reaches office in ~2.6 seconds.
      this.dipu.sprintTimer += dt;
      if (this.dipu.sprintTimer >= 2.6) {
        if (this.isDoorClosed) {
          // Blocked by closed door! Bangs heavily on door and retreats to CAM_3
          onEvent({ type: 'DOOR_DEFENSE', animatronic: 'dipu' });
          this.dipu.stage = 0;
          this.dipu.sprintTimer = 0;
          this.dipu.stallTimer = 0;
          // Drain 4% power from the heavy impact!
          this.power = Math.max(0, this.power - 4);
        } else {
          // Door is open: IMMEDIATELY ends game!
          this.triggerJumpscare('dipu', onEvent);
        }
      }
    }
  }

  triggerJumpscare(who, onEvent) {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.jumpscareWho = who;
    this.isMonitorOpen = false;
    this.isMaskOn = false;
    onEvent({ type: 'JUMPSCARE', animatronic: who });
  }
}

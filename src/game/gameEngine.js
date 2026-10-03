// Game Engine for Five Nights at Kattaikonam (FNAK)

export const CAMERAS = [
  { id: 'CAM_1', name: 'Physics Lab', sub: 'Room A', image: './assets/images/cam-room-a.jpg', x: 20, y: 30 },
  { id: 'CAM_2', name: 'Main Corridor', sub: 'Corridor A', image: './assets/images/cam-corridor-a.jpg', x: 50, y: 35 },
  { id: 'CAM_3', name: 'Supply Hallway', sub: 'Corridor B', image: './assets/images/cam-corridor-b.jpg', x: 80, y: 40 },
  { id: 'CAM_4', name: 'Central Stairs', sub: 'Staircase', image: './assets/images/cam-stairs.jpg', x: 30, y: 70 },
  { id: 'CAM_5', name: 'Office Entrance', sub: 'Doorway', image: './assets/images/office-door-open.jpg', x: 65, y: 80 },
];

export const NIGHT_PRESETS = {
  1: { hourSeconds: 50, abLevel: 3, dipuLevel: 1, aadeshLevel: 2, doorWaitTime: 5.0, label: 'Night 1 - The Orientation' },
  2: { hourSeconds: 50, abLevel: 6, dipuLevel: 4, aadeshLevel: 5, doorWaitTime: 4.0, label: 'Night 2 - Disturbances' },
  3: { hourSeconds: 55, abLevel: 10, dipuLevel: 8, aadeshLevel: 9, doorWaitTime: 3.0, label: 'Night 3 - Escalation' },
  4: { hourSeconds: 60, abLevel: 14, dipuLevel: 12, aadeshLevel: 13, doorWaitTime: 2.0, label: 'Night 4 - Lockdown' },
  5: { hourSeconds: 60, abLevel: 18, dipuLevel: 17, aadeshLevel: 18, doorWaitTime: 1.0, label: 'Night 5 - Final Shift' },
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
    this.hourSeconds = config.hourSeconds || 50;
    this.abLevel = config.abLevel ?? 4;
    this.dipuLevel = config.dipuLevel ?? 3;
    this.aadeshLevel = config.aadeshLevel ?? 4;
    // Reaction time window at door: 5s on Night 1, 4s on Night 2, down to 1s on Night 5
    this.doorWaitTime = config.doorWaitTime ?? Math.max(1.0, 6.0 - this.night);

    this.time = 0; // 0 = 12 AM, 1 = 1 AM, ... 6 = 6 AM
    this.timeProgress = 0; // 0 to 1 within current hour
    this.power = 100.0;
    this.isBlackout = false;
    this.isDoorClosed = false;
    this.isLightOn = false;
    this.isMonitorOpen = false;
    this.currentCam = 'CAM_1';
    this.isGameOver = false;
    this.isGameWon = false;
    this.jumpscareWho = null; // 'ab', 'dipu', 'aadesh'

    // Animatronic states
    this.ab = {
      location: 'CAM_1', // CAM_1 -> CAM_2 -> CAM_4 -> DOOR
      atDoorTimer: 0,
    };

    this.dipu = {
      stage: 0, // 0 = In CAM_3, 1 = Peeking CAM_3, 2 = Sprinting down CAM_2
      sprintTimer: 0,
      stallTimer: 0,
    };

    this.aadesh = {
      location: 'CAM_4', // CAM_4 -> CAM_1/CAM_2 -> BLIND_SPOT (outside doorway)
      atBlindSpotTimer: 0,
    };
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
      // If player closes the door while an enemy stands there, bang and retreat!
      let enemyDefended = false;
      if (this.ab.location === 'DOOR') {
        this.ab.location = 'CAM_2';
        this.ab.atDoorTimer = 0;
        enemyDefended = true;
        if (onEvent) onEvent({ type: 'DOOR_DEFENSE', animatronic: 'ab' });
      }
      if (this.aadesh.location === 'BLIND_SPOT') {
        this.aadesh.location = 'CAM_4';
        this.aadesh.atBlindSpotTimer = 0;
        enemyDefended = true;
        if (onEvent) onEvent({ type: 'DOOR_DEFENSE', animatronic: 'aadesh' });
      }
      return enemyDefended;
    }
    return false;
  }

  // Advance game logic by deltaSeconds
  tick(dt, onEvent) {
    if (this.isGameOver || this.isGameWon) return;

    // --- TIME PROGRESSION ---
    if (!this.isBlackout) {
      this.timeProgress += dt / this.hourSeconds;
      if (this.timeProgress >= 1) {
        this.timeProgress = 0;
        this.time += 1;
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
      const usage = this.getUsageBars();
      // Drain rate based on usage
      const drainPerSec = 0.08 + (usage - 1) * 0.16;
      this.power = Math.max(0, this.power - drainPerSec * dt);

      if (this.power <= 0) {
        this.isBlackout = true;
        this.isDoorClosed = false;
        this.isLightOn = false;
        this.isMonitorOpen = false;
        onEvent({ type: 'BLACKOUT_START' });
        return;
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
    this.updateDipu(dt, onEvent);
    this.updateAadesh(dt, onEvent);
  }

  // --- AB (Abhishek) AI ---
  updateAB(dt, onEvent) {
    // If already at door
    if (this.ab.location === 'DOOR') {
      if (this.isDoorClosed) {
        // Closed door blocks AB: bangs loudly on door and retreats!
        onEvent({ type: 'DOOR_DEFENSE', animatronic: 'ab' });
        this.ab.location = 'CAM_2';
        this.ab.atDoorTimer = 0;
      } else {
        this.ab.atDoorTimer += dt;
        // Stands at the door before jumpscaring: 5s on Night 1, 4s on Night 2, down to 1s on Night 5
        if (this.ab.atDoorTimer >= this.doorWaitTime) {
          this.triggerJumpscare('ab', onEvent);
        }
      }
      return;
    }

    // Movement opportunity check every ~4s
    this.abMoveTimer = (this.abMoveTimer || 0) + dt;
    if (this.abMoveTimer >= 4) {
      this.abMoveTimer = 0;
      // AI Roll: 1 to 20 <= abLevel
      const roll = Math.floor(Math.random() * 20) + 1;
      if (roll <= this.abLevel) {
        const path = ['CAM_1', 'CAM_2', 'CAM_4', 'DOOR'];
        const curIdx = path.indexOf(this.ab.location);
        if (curIdx < path.length - 1) {
          const nextLoc = path[curIdx + 1];
          if (nextLoc === 'DOOR') {
            if (this.isDoorClosed) {
              // Approaches closed door: bangs on the door and is repelled!
              onEvent({ type: 'DOOR_DEFENSE', animatronic: 'ab' });
              this.ab.location = 'CAM_2';
              this.ab.atDoorTimer = 0;
            } else {
              // Enters open doorway: stands for 5 seconds
              this.ab.location = 'DOOR';
              this.ab.atDoorTimer = 0;
              onEvent({ type: 'ENEMY_AT_DOOR', animatronic: 'ab' });
            }
          } else {
            this.ab.location = nextLoc;
            onEvent({ type: 'MOVEMENT', animatronic: 'ab', to: this.ab.location });
          }
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
      // Sprinting down hallway! Sped-up sprint running SFX plays.
      // Reaches the office in ~2.6 seconds.
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
          // Door is open: IMMEDIATELY ends game without waiting at door!
          this.triggerJumpscare('dipu', onEvent);
        }
      }
    }
  }

  // --- AADESH AI ---
  updateAadesh(dt, onEvent) {
    if (this.aadesh.location === 'BLIND_SPOT') {
      if (this.isDoorClosed) {
        // Blocked by closed door! Bangs loudly on door and retreats
        onEvent({ type: 'DOOR_DEFENSE', animatronic: 'aadesh' });
        this.aadesh.location = 'CAM_4';
        this.aadesh.atBlindSpotTimer = 0;
      } else {
        this.aadesh.atBlindSpotTimer += dt;
        // Stands at the door before jumpscaring: 5s on Night 1, 4s on Night 2, down to 1s on Night 5
        if (this.aadesh.atBlindSpotTimer >= this.doorWaitTime) {
          this.triggerJumpscare('aadesh', onEvent);
        }
      }
      return;
    }

    this.aadeshMoveTimer = (this.aadeshMoveTimer || 0) + dt;
    if (this.aadeshMoveTimer >= 3.8) {
      this.aadeshMoveTimer = 0;
      const roll = Math.floor(Math.random() * 20) + 1;
      if (roll <= this.aadeshLevel) {
        if (this.aadesh.location === 'CAM_4') {
          this.aadesh.location = Math.random() < 0.6 ? 'CAM_2' : 'CAM_1';
          onEvent({ type: 'MOVEMENT', animatronic: 'aadesh', to: this.aadesh.location });
        } else if (this.aadesh.location === 'CAM_1') {
          this.aadesh.location = 'CAM_2';
          onEvent({ type: 'MOVEMENT', animatronic: 'aadesh', to: 'CAM_2' });
        } else if (this.aadesh.location === 'CAM_2') {
          if (this.isDoorClosed) {
            // Approaches closed door: bangs on the door and retreats!
            onEvent({ type: 'DOOR_DEFENSE', animatronic: 'aadesh' });
            this.aadesh.location = 'CAM_4';
            this.aadesh.atBlindSpotTimer = 0;
          } else {
            // Enters blind spot outside door: stands for 5 seconds
            this.aadesh.location = 'BLIND_SPOT';
            this.aadesh.atBlindSpotTimer = 0;
            onEvent({ type: 'ENEMY_AT_DOOR', animatronic: 'aadesh' });
          }
        }
      }
    }
  }

  triggerJumpscare(who, onEvent) {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.jumpscareWho = who;
    this.isMonitorOpen = false;
    onEvent({ type: 'JUMPSCARE', animatronic: who });
  }
}

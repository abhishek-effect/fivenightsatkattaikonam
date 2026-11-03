# 🐻 Five Nights At Kattaikonam (FNAK) v1.0

A FNAF-inspired web survival horror game built with **React**, **Vite**, **Tailwind CSS**, and the **HTML5 Web Audio API**.

---

## 🎮 Gameplay Features
- **Main Menu (v1.0)**: CRT scanline retro interface with Night 1-5 selection, Custom Night AI sliders (0-20 difficulty for AB, Johann, Dipu, and Aadesh), audio toggle, and interactive **Tutorial Gameplay**.
- **Interactive Tutorial Gameplay & How to Play**: The central part of the "How to Play" system — a guided sample night shift with real-time instructions, and an in-tutorial clickable **View Rules** manual.
- **First-Time Shift Prompt**: Starting any night prompts first-time players asking if they'd like to take the tutorial orientation, remembering their choice permanently in localStorage.
- **Office Panoramic View**: Smooth mouse and touch panning with authentic security desk, spinning animated fan, dynamic power drain gauge, and digital clock.
- **Auxiliary Power Generator (Night 3+)**: Located to the left of the OMR Desk Monitor starting Night 3. If power runs out or drops dangerously low, click the generator to solve an Among Us style wire-matching puzzle to restore **+10% to +15% power** and abort blackouts.
- **Security Doors & Hallway Light**: Toggle blast door lockdown (`[D]`) and hallway light (`[L]`).
- **Security Mask Overlay**: Put on your mask (`[M]`) to disguise yourself from Johann when he lurks in the door window.
- **Scare Audio Lure with Subtitles**: Broadcast teacher voice lines (`[A]`) with a 10-second countdown to scare Abhishek away to another room, showing speech subtitles (`"Where is your photocopy?"`, `"Change your attitude children!"`, `"Submit your dpp!"`).
- **CCTV Surveillance System**: Interactive 6-camera surveillance map (`[SPACE]`):
  - **CAM 1 - Room A**: Physics Lab (starting den for AB)
  - **CAM 2 - Corridor A**: Main Corridor
  - **CAM 3 - Corridor B**: Supply Hallway (watch Dipu before he escapes and sprints!)
  - **CAM 4 - Stairs**: Central Staircase
  - **CAM 5 - Corridor C**: Hallway right in front of the office door
  - **CAM 6 - Balcony**: Exterior balcony corridor
  - **Office Marker**: Live beacon indicator showing player location on the map (marker only, not a camera)
- **Camera Glitch on Movement**: Whenever Aadesh, Johann, or Abhishek moves between rooms, the CCTV feed glitches with static interference for 1 second.
- **Dynamic FNAF-Inspired Hourly AI Levels**:
  - Each night and hour features custom AI scaling (e.g. Night 1 orientation, Night 2 Johann awakens, Night 3 Abhishek door-breaker and generator activate).
  - Watching Abhishek directly on his camera room freezes him in place (like Freddy in FNAF 1).
  - Watching Balcony (CAM 6) stalls Johann's departure.
- **Developer Mode Override**: Setting `isDeveloper = true` in the browser developer console unlocks all nights and Custom Night, displaying `"Hello Pinky/Dip-u. Hope you are not someone else"`.
- **Desk Terminal & OMR Uploads**: Complete OMR uploads on the desk terminal to skip full hours forward without draining battery power.
- **Blackout Mechanic**: If power drops to 0%, the facility experiences a blackout with Toreador music box chimes before AB's final jumpscare (unless saved by the Auxiliary Generator!).

---

## 🕹️ Controls
- **Mouse / Touch Drag**: Pan security office left/right
- **[SPACE]**: Flip CCTV camera tablet up / down
- **[D]**: Toggle Blast Door
- **[L]**: Toggle Hallway Light
- **[M]**: Toggle Security Mask (Helmet)
- **[A]**: Play Scare Audio (10s cooldown countdown)
- **[ESC] / [P]**: Pause Shift
- **CAM 1 – 6**: Switch active camera feed on the facility map

---

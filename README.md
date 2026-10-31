# 🐻 Five Nights At Kattaikonam (FNAK)

A FNAF-inspired web survival horror game built with **React**, **Vite**, **Tailwind CSS**, and the **HTML5 Web Audio API**.

---

## 🎮 Gameplay Features
- **Main Menu**: CRT scanline retro interface with Night 1-5 selection, Custom Night AI sliders (0-20 difficulty for AB, Johann, Dipu, and Aadesh), audio toggle, and interactive **Tutorial Gameplay**.
- **Interactive Tutorial Gameplay**: Guided step-by-step walkthrough directly accessible from the How to Play menu to master enemy mechanics and office systems.
- **Office Panoramic View**: Smooth mouse and touch panning with authentic security desk, spinning animated fan, dynamic power drain gauge, and digital clock.
- **Security Doors & Hallway Light**: Toggle door lockdown (`[D]`) and hallway light (`[L]`).
- **Security Mask Overlay**: Put on your mask (`[M]`) to disguise yourself from Johann when he lurks in the door window.
- **Scare Audio Lure**: Broadcast teacher voice lines (`[A]`) with a 10-second countdown to scare Abhishek away to another room.
- **CCTV Surveillance System**: Interactive 6-camera surveillance map (`[SPACE]`):
  - **CAM 1 - Room A**: Physics Lab (starting den for AB)
  - **CAM 2 - Corridor A**: Main Corridor
  - **CAM 3 - Corridor B**: Supply Hallway (watch Dipu before he escapes and sprints!)
  - **CAM 4 - Stairs**: Central Staircase
  - **CAM 5 - Corridor C**: Hallway right in front of the office door
  - **CAM 6 - Balcony**: Exterior balcony corridor
  - **Office Marker**: Live beacon indicator showing player location on the map (marker only, not a camera)
- **Dynamic Animatronics**:
  - **AB (Abhishek)**: Breaks in and kills you even if the door is closed! Use Scare Audio (`[A]`) to frighten him to an adjacent room.
  - **Johann**: Peeps through the closed door window! After 2 seconds he bangs on the door, and after 5 seconds he kills you. Wear your Mask (`[M]`) to make him leave.
  - **Aadesh**: Lurks on stairs and enters the blind spot. He only goes away if you turn on the hallway light (`[L]`) *after* closing the door (`[D]`)!
  - **Dipu**: The rusher. Checking CAM 3 stalls him; if left unwatched, he sprints down the hallway! Slam the door before he collides.
- **Desk Terminal & OMR Uploads**: Complete OMR uploads on the desk terminal to skip full hours forward without draining battery power.
- **Blackout Mechanic**: If power drops to 0%, the facility experiences a blackout with Toreador music box chimes before AB's final jumpscare.

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

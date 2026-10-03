# 🐻 Five Nights At Kattaikonam (FNAK)

A FNAF-inspired web survival horror game built with **React**, **Vite**, **Tailwind CSS**, and the **HTML5 Web Audio API**.

---

## 🎮 Gameplay Features
- **Main Menu**: CRT scanline retro interface with Night 1-5 selection, Custom Night AI sliders (0-20 difficulty for AB, Dipu, and Aadesh), and audio toggle.
- **Office Panoramic View**: Smooth mouse and touch panning with authentic security desk, spinning animated fan, dynamic power drain gauge, and digital clock.
- **Security Doors & Hallway Light**: Toggle door lockdown (`[D]`) and hallway light (`[L]`) to check the doorway blind spot.
- **CCTV Surveillance System**: Interactive 5-camera surveillance map (`[SPACE]`):
  - **CAM 1 - Room A**: Physics Lab (starting den for AB)
  - **CAM 2 - Corridor A**: Main Corridor
  - **CAM 3 - Corridor B**: Supply Hallway (watch Dipu before he escapes and sprints!)
  - **CAM 4 - Stairs**: Central Staircase (Aadesh's stalking path)
  - **CAM 5 - Doorway**: Exterior office entrance
- **Dynamic Animatronics**:
  - **AB**: Roams from CAM 1 -> CAM 2 -> CAM 4 -> Office Door.
  - **Dipu**: The rusher. Checking CAM 3 stalls him; if left unwatched, he sprints down the hallway!
  - **Aadesh**: Lurks on stairs and enters the office blind spot. Reveal him with the door light before locking down!
- **Blackout Mechanic**: If power drops to 0%, the facility experiences a blackout with Toreador music box chimes before AB's final jumpscare.
- **Audio Synthesizer & Screamer**: Synthesized fan drone, camera whoosh, door slams, footstep thuds, 6 AM victory chimes, and instant screamer audio (`jumpscare.mp3`).

---

## 🕹️ Controls
- **Mouse / Touch Drag**: Pan security office left/right
- **[SPACE]**: Flip CCTV camera tablet up / down
- **[D]**: Toggle Security Door (Lockdown)
- **[L]**: Toggle Hallway Light
- **CAM 1 – 5**: Click camera monitors on the mini-map

---

## 🚀 How to Deploy to GitHub Pages

### 1. Create a repository on GitHub
Create a new repository (e.g. `fnak` or `five-nights-at-kattaikonam`) on [github.com](https://github.com/).

### 2. Connect and push your code
Run the following commands in this directory:
```bash
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### 3. Enable GitHub Pages
1. Go to your repository on GitHub -> **Settings** -> **Pages**.
2. Under **Build and deployment** -> **Source**, select **GitHub Actions** (the automated workflow in `.github/workflows/deploy.yml` will handle the build and deployment automatically).
3. Within 1-2 minutes, your game will be live at:
   `https://<your-username>.github.io/<your-repo-name>/`

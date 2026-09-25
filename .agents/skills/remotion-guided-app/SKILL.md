---
name: remotion-guided-app
description: Create and edit guided app walkthroughs, product tours, feature highlights, and interactive tutorial videos in Remotion. Use whenever the user wants to showcase a mobile or web app with screen recordings, spotlight overlays that darken the background and highlight specific UI elements or buttons, camera zooms and pans to points of interest, tap or click ripples, step-by-step callouts and tooltips, device mockups (phones, tablets, browsers), or timeline freezing (holds) while explaining a specific feature.
---

# Remotion Guided App & Spotlight Video Editing

This skill provides an end-to-end framework and reusable primitives for building **app walkthroughs, product tours, and interactive tutorial videos** in Remotion. It specializes in focusing the viewer's attention on specific UI elements using spotlight cutouts, camera zooms, tap ripples, timeline holds, and step callouts.

---

## The 6 Core Pillars of a Guided App Video

1. **Spotlight & Feathered Cutout Masking**
   - Darkened backdrop (30–60% opacity) covering the entire screen.
   - SVG `<mask>` cutting out the active element rectangle or circle with soft feathered edges (`feGaussianBlur`).
   - Pulsing glowing outline around the target to draw immediate visual focus.
   - Smooth shape morphing (`lerpShape`) when transitioning between consecutive highlights.

2. **Smart Camera Focus & Dynamic Zoom**
   - Smoothly interpolate scale (e.g. 1.0x → 1.25x–1.45x) and transform origin to the target point of interest.
   - Easing curves on both entrance and exit (`Easing.inOut(Easing.cubic)`).
   - Keeps the active element centered or comfortably positioned in the viewport.

3. **Timeline Freezing (Holds & Time Remapping)**
   - Screen recordings usually move too fast for narration and observation.
   - The timeline engine freezes the video at key moments (`holds: [{ at: 2.5, dur: 1.8 }]`) so the highlight and explanation can breathe.
   - Resumes playback smoothly when the action (tap/swipe) happens.

4. **Visual Tap & Touch Feedback**
   - Expanding ripple rings (`strokeWidth`, expanding radius, fading opacity) triggered at `tapAt`.
   - Optional animated cursor or finger touch indicator bouncing into position.

5. **Step Callouts & Tooltip Badges**
   - Step chips (e.g. "Langkah 1", "Pilih Menu", "Step 2").
   - Concise headline text and optional supportive subtitle.
   - Floating badge or docked lower-third card anchored with an arrow pointing toward the spotlight.

6. **Device Framing & Responsive Mockup**
   - Framing mobile screen recordings inside realistic device mockups (iPhone bezel, Dynamic Island / notch, subtle drop shadows, subtle 3D tilt).
   - Clean background gradient or branded backdrop mesh behind the mockup.

---

## Standard Workflow

### Step 1 — Asset & Timeline Intake
- Collect the screen recording (`public/screen.mp4` or image sequence).
- Note the recording's native dimensions (e.g. 1170×2532 for iPhone 15 Pro, 1080×2400 for Android).
- Determine composition aspect ratio:
  - **9:16 Vertical (1080×1920)**: Ideal for TikTok, Reels, Shorts, in-app onboarding.
  - **16:9 Horizontal (1920×1080)**: Ideal for YouTube, landing pages, desktop product tours.

### Step 2 — Coordinate Extraction (ROI Mapping)
Determine the exact bounding boxes (`Rect: { x, y, w, h }`) of target UI elements.
- Open Remotion Studio (`npm run dev` or `npx remotion preview`).
- Scrub to the frame where the button/element appears.
- Use the coordinate guide in `references/coordinate-guide.md` or a quick screenshot inspector to grab `{ x, y, w, h }`.

### Step 3 — Define `GuideData`
Structure the entire video walkthrough declaratively:
```ts
export const guideData: GuideData = {
  holds: [
    { at: 2.1, dur: 1.8 }, // Freeze video at 2.1s for 1.8s
    { at: 5.4, dur: 2.0 },
  ],
  spots: [
    {
      from: 2.1,
      to: 3.9,
      rect: { x: 180, y: 720, w: 720, h: 120 },
      radius: 24,
      dim: true,
      tapAt: 3.6, // Ripple triggers at 3.6s
    },
  ],
  zooms: [
    {
      from: 2.0,
      to: 4.0,
      scale: 1.3,
      target: { x: 540, y: 780 },
      easeIn: 0.4,
      easeOut: 0.4,
    },
  ],
  captions: [
    {
      from: 2.1,
      to: 3.9,
      icon: "check",
      text: "Pilih Properti Impian",
      support: "Ketuk kartu properti untuk melihat detail lengkap",
    },
  ],
};
```

### Step 4 — Assembly & Rendering
Compose the scene stack:
1. Background canvas / gradient.
2. Device Mockup (`<PhoneMockup>`).
3. Video layer with time-remapping (`<OffthreadVideo>`).
4. `<Highlight>` SVG spotlight overlay and ripples.
5. `<Caption>` step chips and explanation cards.
6. Optional audio narration / SFX (pop on tap, whoosh on zoom).

### Step 5 — Visual Frame Verification
Render key frames at highlight moments:
```bash
npx remotion still src/index.ts GuideVideo out/check_spot1.png --frame 75 --overwrite
```
Verify:
- Spotlight cutout aligns precisely with the button.
- Pulsing glow is visible and text inside the cutout remains legible.
- Dim overlay doesn't obscure critical context outside the cutout too aggressively.

---

## Detailed References
- For production-ready React components (Highlight, Zoom, Timeline, Mockup, Ripple): read `references/spotlight-patterns.md`.
- For extracting coordinates accurately and handling responsive screen sizes: read `references/coordinate-guide.md`.
- For starter types and configuration: inspect `assets/template-guide.ts`.

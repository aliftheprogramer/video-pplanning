# Fix Step 2 (Detail and Facilities) Video Walkthrough Timing, Highlights & Captions

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate premature highlights, rushed tap animations, caption mislabeling, bounding box text clippings, and spotlight omissions across the Step 2 (*Detail and Facilities*) walkthrough video (`Step2DetailFacilities` / [`src/guide/video3.ts`](file:///home/alif/Metairflow/video-result/video-pplanning/src/guide/video3.ts)).

**Architecture:** Update declarative `GuideData` configuration (`holds`, `cuts`, `spots`, `captions`, `zooms`) in [`src/guide/video3.ts`](file:///home/alif/Metairflow/video-result/video-pplanning/src/guide/video3.ts) to synchronize with actual recording screen settling moments and maintain $\ge 0.70\text{s}$ lead time before tap events.

**Tech Stack:** Remotion (React, TypeScript), `@remotion/cli`.

---

## 1. Issue Inventory & Root Cause Analysis

| # | Defect / Issue | Root Cause | Exact Impact |
|---|---|---|---|
| **1** | **Wrong Button Label in Caption & Rect** | Screen 1 button actually reads **"Continue fill"**, but caption and rect say `Start now`. | Dissonance between instruction text and real button text; height $h=80$ cuts bottom edge of button ($h=94$). |
| **2** | **Bounding Box Slices Header Text (`propertyDims`)** | Top edge set at $y=645$, while text "Property dimensions" sits at $y \in [647, 669]$. | The top border of the orange box directly slices through the title text horizontally. |
| **3** | **Missing "Tap Next" Caption on Basics Screen** | Caption `Review your basic [[details]]` persists through Next button tap without prompting action. | Inconsistent with all other screens which announce `Tap [[Next]] to continue`. |
| **4** | **Premature Highlights Across 5 Screen Transitions** | Highlights start at `leave(prevTap) + 0.1`, but the source video spinner runs for another $1.1\text{s} - 1.3\text{s}$ before screen transitions. | Form highlights for Furnished, Amenities, Rules, Description, and Bill Accounts appear on top of previous screens and loading spinners. |
| **5** | **Severely Rushed CTA Button Taps ($0.10\text{s} - 0.15\text{s}$)** | Lead times for `nextBtn 2, 3, 4, 5` and `saveBtn3` are only $6 - 9$ frames ($0.10\text{s} - 0.15\text{s}$). | Remotion's $0.5\text{s}$ morph animation only reaches 25-30% completion when the tap ripple triggers, causing the box to hover in mid-screen. |
| **6** | **"Generate with AI" Feature Not Highlighted** | Description screen has a marquee `✨ Generate with AI` button and generation cycle, but `spots` only contains a generic `descriptionArea`. | The video misses showcasing the core AI generation feature and variant result. |
| **7** | **Scrolled Bill Form Clips Progress Bar** | `billAccountsFormScrolled` bottom edge sits at $y=900$, clipping the horizontal step indicator. | Visual boundary conflict with UI elements. |
| **8** | **Ending Highlight Points to Step 3 Instead of Step 2** | `startNowBtn3` is highlighted while caption says `[[Detail and Facilities]] is complete!`. | Confuses the viewer by spotlighting the next step's Start button instead of celebrating Step 2 completion. |

---

## 2. Proposed Design & Timing Blueprint

### A. Holds Schedule
Add hold at cut landing for `Save` button to provide calm reading time before tap:
- Add `{ at: 65.9, dur: 0.6 }` to `holds`: pauses immediately after the `64.6 -> 65.9` cut lands so the user sees the Save button for $0.70\text{s}$ ($0.6\text{s}$ hold $+ 0.1\text{s}$ playback) before tap ripple triggers.

### B. Rects Calibration
```ts
const continueFillBtn: Rect = { x: 128, y: 755, w: 352, h: 94 };
const nextBtn: Rect = { x: 40, y: 1445, w: 640, h: 100 };
const propertyDims: Rect = { x: 32, y: 625, w: 656, h: 520 };
const furnishedOptions: Rect = { x: 24, y: 395, w: 672, h: 250 };
const amenitiesArea: Rect = { x: 24, y: 195, w: 672, h: 1140 };
const rulesArea: Rect = { x: 24, y: 395, w: 672, h: 830 };
const generateAIBtn: Rect = { x: 40, y: 1146, w: 640, h: 104 };
const descriptionArea: Rect = { x: 24, y: 395, w: 672, h: 835 };
const billAccountsForm: Rect = { x: 24, y: 380, w: 672, h: 730 };
const billAccountsFormScrolled: Rect = { x: 24, y: 140, w: 672, h: 740 };
const saveBtn3: Rect = { x: 40, y: 975, w: 640, h: 105 };
const completedStep2Row: Rect = { x: 36, y: 400, w: 648, h: 185 };
```

### C. Synchronized Spots Schedule
1. **`continueFillBtn`**: `from: tapStartNow - 0.8` to `leave(1.9)`, `tapAt: tapStartNow`. (Lead time: 0.80s).
2. **`propertyDims`**: `from: arrive(2.0)` to `tapNext1 - 0.85`.
3. **`nextBtn 1`**: `from: tapNext1 - 0.70` to `leave(17.1)`, `tapAt: tapNext1`. (Lead time: 0.70s).
4. **`furnishedOptions`**: `from: arrive(18.5)` (when screen settles) to `tapNext2 - 0.85`.
5. **`nextBtn 2`**: `from: tapNext2 - 0.70` to `leave(21.3)`, `tapAt: tapNext2`. (Lead time: 0.70s).
6. **`amenitiesArea`**: `from: arrive(22.5)` (when screen settles) to `tapNext3 - 0.85`.
7. **`nextBtn 3`**: `from: tapNext3 - 0.70` to `leave(29.7)`, `tapAt: tapNext3`. (Lead time: 0.70s).
8. **`rulesArea`**: `from: arrive(31.0)` (when screen settles) to `tapNext4 - 0.85`.
9. **`nextBtn 4`**: `from: tapNext4 - 0.70` to `leave(40.2)`, `tapAt: tapNext4`. (Lead time: 0.70s).
10. **`generateAIBtn`**: `from: arrive(41.5)` (when screen settles) to `leave(44.2)`, `tapAt: tapGenerateAI`. (Lead time: 3.70s).
11. **`descriptionArea`**: `from: leave(44.2) + 0.15` to `tapNext5 - 0.85`.
12. **`nextBtn 5`**: `from: tapNext5 - 0.70` to `leave(50.3)`, `tapAt: tapNext5`. (Lead time: 0.70s).
13. **`billAccountsForm`**: `from: arrive(51.5)` (when screen settles) to `arrive(52.5) - 0.1`.
14. **`billAccountsFormScrolled`**: `from: arrive(52.5)` to `arrive(64.6) - 0.1`.
15. **`saveBtn3`**: `from: arrive(64.6)` to `leave(66.0)`, `tapAt: tapSave`. (Lead time: 0.70s with hold).
16. **`completedStep2Row`**: `from: arrive(67.3) + 0.25` to `end`.

### D. Synchronized Captions Schedule
- `from: 0.4` to `leave(1.9)`: `Tap [[Continue fill]] to begin`
- `from: arrive(2.0)` to `tapNext1 - 0.85`: `Review your basic [[details]]`
- `from: tapNext1 - 0.70` to `leave(17.1)`: `Tap [[Next]] to continue`
- `from: arrive(18.5)` to `tapNext2 - 0.85`: `Choose how it's [[available]]`
- `from: tapNext2 - 0.70` to `leave(21.3)`: `Tap [[Next]] to confirm`
- `from: arrive(22.5)` to `tapNext3 - 0.85`: `Pick your [[amenities]]`
- `from: tapNext3 - 0.70` to `leave(29.7)`: `Tap [[Next]] to confirm`
- `from: arrive(31.0)` to `tapNext4 - 0.85`: `Set your property [[rules]]`
- `from: tapNext4 - 0.70` to `leave(40.2)`: `Tap [[Next]] to confirm`
- `from: arrive(41.5)` to `leave(44.2)`: `Generate a [[description]] with AI`
- `from: leave(44.2) + 0.15` to `tapNext5 - 0.85`: `Review your AI [[description]]`
- `from: tapNext5 - 0.70` to `leave(50.3)`: `Tap [[Next]] to confirm`
- `from: arrive(51.5)` to `tapSave - 0.85`: `Add [[bill accounts]] (optional)`
- `from: tapSave - 0.70` to `arrive(67.3) - 0.15`: `Tap [[Save]] to finish`
- `from: arrive(67.3) - 0.15` to `end`: `[[Detail and Facilities]] is complete!`, `keep: true`

---

## 3. Implementation Tasks

### Task 1: Update Holds in `src/guide/video3.ts`
- [ ] Add `{ at: 65.9, dur: 0.6 }` to `holds` array to provide reading headroom for the Save button.

### Task 2: Refine Rects & Coordinate Definitions
- [ ] Replace `startNowBtn1` with `continueFillBtn` with $h=94$.
- [ ] Adjust `propertyDims` to $y=625, h=520$ so the title text is not sliced.
- [ ] Add `generateAIBtn: Rect = { x: 40, y: 1146, w: 640, h: 104 }`.
- [ ] Update `billAccountsFormScrolled` to $y=140, h=740$.
- [ ] Replace `startNowBtn3` with `completedStep2Row: Rect = { x: 36, y: 400, w: 648, h: 185 }`.

### Task 3: Apply Synchronized Spots
- [ ] Update `spots` array with `arrive(...)` start times for all form screens.
- [ ] Extend lead times before tap to $0.70\text{s} - 0.80\text{s}$ for `nextBtn 1..5` and `saveBtn3`.
- [ ] Ensure $\ge 0.15\text{s}$ gap between preceding form spot and button spot to prevent chain-morph bugs.
- [ ] Add spotlight on `generateAIBtn` with `tapAt: tapGenerateAI`.
- [ ] Update final spot to `completedStep2Row`.

### Task 4: Synchronize Captions
- [ ] Update caption 1 to `Tap [[Continue fill]] to begin`.
- [ ] Add `Tap [[Next]] to continue` on basics screen.
- [ ] Add `Review your AI [[description]]` after generation.
- [ ] Align all caption boundaries with spot start times.

### Task 5: Align Zooms
- [ ] Update zoom 1 to target `center(continueFillBtn)`.
- [ ] Update AI zoom to focus on `center(generateAIBtn)` then description.
- [ ] Update Save zoom to target `center(saveBtn3)` with smooth ease.

### Task 6: Visual Verification & Testing
- [ ] Run `npm run lint` (`eslint src && tsc`) to ensure zero errors.
- [ ] Render key stills using `remotion still`:
  - Frame around `continueFillBtn`
  - Frame around `propertyDims` (verify text is not sliced)
  - Frame around `furnishedOptions` (verify screen is fully transitioned)
  - Frame around `amenitiesArea` (verify screen is fully transitioned)
  - Frame around `generateAIBtn` (verify AI button highlighted with tap ripple)
  - Frame around `saveBtn3` (verify 0.70s lead time)
  - Frame at completion (verify Step 2 row is highlighted)
- [ ] Inspect all rendered stills using `view_file` to verify clean presentation.

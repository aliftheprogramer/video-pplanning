import { guideClock } from "./timeline";
import type { Cut, GuideData, Hold, Point, Rect } from "./types";

const holds: Hold[] = [
  { at: 1.9, dur: 1.0 },
  { at: 12.3, dur: 2.8 },
  // "Next" taps below each trigger a brief loading spinner in the source —
  // held longer than the spinner's own real-time duration so it reads
  // clearly instead of flashing by.
  { at: 17.1, dur: 1.3 },
  { at: 18.5, dur: 1.0 },
  { at: 21.3, dur: 1.7 },
  { at: 22.5, dur: 0.8 },
  { at: 29.7, dur: 1.7 },
  { at: 31.0, dur: 0.8 },
  { at: 40.2, dur: 1.7 },
  { at: 41.5, dur: 1.0 },
  { at: 44.2, dur: 1.0 },
  { at: 46.0, dur: 0.8 },
  { at: 50.3, dur: 1.7 },
  { at: 51.5, dur: 0.8 },
  { at: 59.3, dur: 1.2 },
  // Hold when the scrolled form settles after the cut so the viewer
  // has time to read the Save button before the tap ripple starts.
  { at: 65.9, dur: 0.6 },
  { at: 66.0, dur: 1.4 },
  // Long final hold: also gives the composition's own duration enough
  // headroom past this hold's source-video position, which avoids a
  // Remotion Freeze+OffthreadVideo seek bug that appears when the frozen
  // frame number exceeds the composition's own durationInFrames.
  { at: 67.3, dur: 11.0 },
];

const cuts: Cut[] = [
  // The app auto-scrolls on long forms. Keep the natural scroll down to
  // property dimensions, then skip the idle pause after scrolling back up.
  { from: 14.0, to: 16.3 },
  { from: 52.5, to: 59.0 }, // bill accounts: jump to the scrolled, keyboard-open state
  { from: 64.6, to: 65.9 }, // bill accounts: skip the keyboard lingering open after typing ends
];

const { arrive, leave } = guideClock(holds, cuts);

const tapStartNow = arrive(1.9);
const tapNext1 = arrive(17.1);
const tapNext2 = arrive(21.3);
const tapNext3 = arrive(29.7);
const tapNext4 = arrive(40.2);
const tapGenerateAI = arrive(44.2);
const tapNext5 = arrive(50.3);
const tapSave = arrive(66.0);
const end = leave(67.3);

const continueFillBtn: Rect = { x: 128, y: 755, w: 352, h: 94 };
const nextBtn: Rect = { x: 40, y: 1445, w: 640, h: 100 };
const roomCapacities: Rect = { x: 24, y: 440, w: 672, h: 450 };
const parkingSlots: Rect = { x: 24, y: 915, w: 672, h: 105 };
const petsPolicy: Rect = { x: 24, y: 1040, w: 672, h: 95 };
const propertyDims: Rect = { x: 32, y: 625, w: 656, h: 520 };
const furnishedOptions: Rect = { x: 24, y: 395, w: 672, h: 250 };
const amenitiesArea: Rect = { x: 24, y: 210, w: 672, h: 1160 };
const rulesArea: Rect = { x: 24, y: 405, w: 672, h: 835 };
const generateAIBtn: Rect = { x: 40, y: 1146, w: 640, h: 104 };
const descriptionArea: Rect = { x: 24, y: 505, w: 672, h: 675 };
const billAccountsForm: Rect = { x: 24, y: 380, w: 672, h: 730 };
// Once a field is focused the keyboard opens and the app scrolls the form
// up to keep it visible — a different layout than the arrival view above.
const billAccountsFormScrolled: Rect = { x: 24, y: 180, w: 672, h: 625 };
// Measured once the keyboard has closed again (right before the Save tap);
// its position differs while the keyboard is still open, so a cut skips
// straight past that lingering-keyboard moment to land here.
const saveBtn3: Rect = { x: 40, y: 975, w: 640, h: 105 };
const completedStep2Row: Rect = { x: 36, y: 600, w: 648, h: 185 };

const center = (r: Rect): Point => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

export const video3: GuideData = {
  holds,
  cuts,
  captions: [
    {
      from: 0.4,
      to: leave(1.9),
      icon: "check",
      text: "Tap [[Continue fill]] to begin",
    },
    {
      from: arrive(2.0),
      to: arrive(5.2),
      icon: "house",
      text: "Set your [[guest capacity]] and room count",
    },
    {
      from: arrive(5.4),
      to: arrive(8.0),
      icon: "check",
      text: "Specify available [[parking slots]]",
    },
    {
      from: arrive(8.2),
      to: arrive(10.5),
      icon: "check",
      text: "Check if you allow [[pets]] at the property",
    },
    {
      from: arrive(12.3),
      to: leave(12.3),
      icon: "plus",
      text: "Enter required [[indoor and outdoor]] dimensions",
    },
    {
      from: arrive(16.3),
      to: leave(17.1),
      icon: "check",
      text: "Tap [[Next]] to continue",
    },
    {
      from: arrive(18.5),
      to: tapNext2 - 0.85,
      icon: "check",
      text: "Choose how it's [[available]]",
    },
    {
      from: tapNext2 - 0.70,
      to: leave(21.3),
      icon: "check",
      text: "Tap [[Next]] to confirm",
    },
    {
      from: arrive(22.5),
      to: tapNext3 - 0.85,
      icon: "check",
      text: "Pick your [[amenities]]",
    },
    {
      from: tapNext3 - 0.70,
      to: leave(29.7),
      icon: "check",
      text: "Tap [[Next]] to confirm",
    },
    {
      from: arrive(31.0),
      to: tapNext4 - 0.85,
      icon: "check",
      text: "Set your property [[rules]]",
    },
    {
      from: tapNext4 - 0.70,
      to: leave(40.2),
      icon: "check",
      text: "Tap [[Next]] to confirm",
    },
    {
      from: arrive(41.5),
      to: leave(44.2),
      icon: "plus",
      text: "Generate a [[description]] with AI",
    },
    {
      from: leave(44.2) + 0.15,
      to: tapNext5 - 0.85,
      icon: "plus",
      text: "Review your AI [[description]]",
    },
    {
      from: tapNext5 - 0.70,
      to: leave(50.3),
      icon: "check",
      text: "Tap [[Next]] to confirm",
    },
    {
      from: arrive(51.5),
      to: tapSave - 0.85,
      icon: "house",
      text: "Add [[bill accounts]] (optional)",
    },
    {
      from: tapSave - 0.70,
      to: arrive(67.3) - 0.15,
      icon: "check",
      text: "Tap [[Save]] to finish",
    },
    {
      from: arrive(67.3) - 0.15,
      to: end,
      icon: "check",
      text: "[[Detail and Facilities]] is complete!",
      keep: true,
    },
  ],
  spots: [
    {
      from: tapStartNow - 0.8,
      to: leave(1.9),
      rect: continueFillBtn,
      radius: 40,
      tapAt: tapStartNow,
    },
    {
      from: arrive(2.0),
      to: arrive(5.2),
      rect: roomCapacities,
      radius: 24,
      dim: false,
    },
    {
      from: arrive(5.4),
      to: arrive(8.0),
      rect: parkingSlots,
      radius: 20,
      dim: false,
    },
    {
      from: arrive(8.2),
      to: arrive(10.5),
      rect: petsPolicy,
      radius: 20,
      dim: false,
    },
    {
      from: arrive(12.3),
      to: leave(12.3),
      rect: propertyDims,
      radius: 24,
      dim: false,
    },
    {
      from: arrive(16.3),
      to: leave(17.1),
      rect: nextBtn,
      radius: 52,
      tapAt: tapNext1,
    },
    {
      from: arrive(18.5),
      to: tapNext2 - 0.85,
      rect: furnishedOptions,
      radius: 20,
      dim: false,
    },
    {
      from: tapNext2 - 0.70,
      to: leave(21.3),
      rect: nextBtn,
      radius: 52,
      tapAt: tapNext2,
    },
    {
      from: arrive(22.5),
      to: tapNext3 - 0.85,
      rect: amenitiesArea,
      radius: 24,
      dim: false,
    },
    {
      from: tapNext3 - 0.70,
      to: leave(29.7),
      rect: nextBtn,
      radius: 52,
      tapAt: tapNext3,
    },
    {
      from: arrive(31.0),
      to: tapNext4 - 0.85,
      rect: rulesArea,
      radius: 24,
      dim: false,
    },
    {
      from: tapNext4 - 0.70,
      to: leave(40.2),
      rect: nextBtn,
      radius: 52,
      tapAt: tapNext4,
    },
    {
      from: arrive(41.5),
      to: leave(44.2),
      rect: generateAIBtn,
      radius: 28,
      tapAt: tapGenerateAI,
    },
    {
      from: leave(44.2) + 0.15,
      to: tapNext5 - 0.85,
      rect: descriptionArea,
      radius: 20,
      dim: false,
    },
    {
      from: tapNext5 - 0.70,
      to: leave(50.3),
      rect: nextBtn,
      radius: 52,
      tapAt: tapNext5,
    },
    {
      from: arrive(51.5),
      to: arrive(52.5) - 0.1,
      rect: billAccountsForm,
      radius: 24,
      dim: false,
    },
    {
      from: arrive(52.5),
      to: arrive(64.6) - 0.1,
      rect: billAccountsFormScrolled,
      radius: 24,
      dim: false,
    },
    {
      from: arrive(64.6),
      to: leave(66.0),
      rect: saveBtn3,
      radius: 40,
      tapAt: tapSave,
    },
    {
      from: arrive(67.3) + 0.25,
      to: end,
      rect: completedStep2Row,
      radius: 32,
      dim: false,
    },
  ],
  zooms: [
    {
      from: tapStartNow - 0.8,
      to: leave(1.9),
      scale: 1.2,
      target: center(continueFillBtn),
      easeIn: 0.6,
      easeOut: 0.6,
    },
    {
      from: arrive(2.0) - 0.3,
      to: arrive(5.2) + 0.1,
      scale: 1.12,
      target: center(roomCapacities),
      easeIn: 0.6,
      easeOut: 0.5,
    },
    {
      from: arrive(5.4) - 0.1,
      to: arrive(8.0) + 0.1,
      scale: 1.15,
      target: center(parkingSlots),
      easeIn: 0.5,
      easeOut: 0.5,
    },
    {
      from: arrive(8.2) - 0.1,
      to: arrive(10.5),
      scale: 1.15,
      target: center(petsPolicy),
      easeIn: 0.5,
      easeOut: 0.6,
    },
    {
      from: arrive(12.3) - 0.2,
      to: leave(12.3) + 0.2,
      scale: 1.15,
      target: center(propertyDims),
      easeIn: 0.6,
      easeOut: 0.6,
    },
    {
      from: tapGenerateAI - 0.6,
      to: leave(44.2) + 0.3,
      scale: 1.15,
      target: center(generateAIBtn),
      easeIn: 0.6,
      easeOut: 0.6,
    },
    {
      from: tapSave - 0.6,
      to: leave(66.0) + 0.3,
      scale: 1.2,
      target: center(saveBtn3),
      easeIn: 0.6,
      easeOut: 0.6,
    },
  ],
};

export const video3GuideEnd = end;

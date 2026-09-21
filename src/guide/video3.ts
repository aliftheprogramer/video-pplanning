import { guideClock } from "./timeline";
import type { Cut, GuideData, Hold, Point, Rect } from "./types";

const holds: Hold[] = [
  { at: 1.9, dur: 1.0 },
  { at: 12.3, dur: 1.3 },
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
  { at: 66.0, dur: 1.4 },
  // Long final hold: also gives the composition's own duration enough
  // headroom past this hold's source-video position, which avoids a
  // Remotion Freeze+OffthreadVideo seek bug that appears when the frozen
  // frame number exceeds the composition's own durationInFrames.
  { at: 67.3, dur: 11.0 },
];

const cuts: Cut[] = [
  // The app auto-scrolls quite a bit on these long forms. A held box that
  // stays put while the underlying screen scrolls under it will drift onto
  // unrelated content, so each scrolling section is cut straight from its
  // arrival to one stable, fully-scrolled state instead of riding the
  // scroll live.
  { from: 2.0, to: 12.0 }, // basics: jump straight to the scrolled property-dimensions view
  { from: 13.6, to: 16.8 }, // skip scrolling back up on the basics screen
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

const startNowBtn1: Rect = { x: 128, y: 755, w: 352, h: 80 };
const nextBtn: Rect = { x: 40, y: 1445, w: 640, h: 100 };
const propertyDims: Rect = { x: 32, y: 670, w: 656, h: 435 };
const furnishedOptions: Rect = { x: 24, y: 395, w: 672, h: 250 };
const amenitiesArea: Rect = { x: 24, y: 195, w: 672, h: 1140 };
const rulesArea: Rect = { x: 24, y: 395, w: 672, h: 830 };
const descriptionArea: Rect = { x: 24, y: 460, w: 672, h: 770 };
const billAccountsForm: Rect = { x: 24, y: 380, w: 672, h: 730 };
// Once a field is focused the keyboard opens and the app scrolls the form
// up to keep it visible — a different layout than the arrival view above.
const billAccountsFormScrolled: Rect = { x: 24, y: 100, w: 672, h: 800 };
// Measured once the keyboard has closed again (right before the Save tap);
// its position differs while the keyboard is still open, so a cut skips
// straight past that lingering-keyboard moment to land here.
const saveBtn3: Rect = { x: 40, y: 975, w: 640, h: 105 };
const startNowBtn3: Rect = { x: 128, y: 945, w: 352, h: 80 };

const center = (r: Rect): Point => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

export const video3: GuideData = {
  holds,
  cuts,
  captions: [
    {
      from: 0.4,
      to: leave(1.9),
      icon: "check",
      text: "Tap [[Start now]] to begin",
    },
    {
      from: leave(1.9) + 0.2,
      to: leave(17.1),
      icon: "plus",
      text: "Review your basic [[details]]",
    },
    {
      from: leave(17.1) + 0.2,
      to: leave(21.3),
      icon: "check",
      text: "Choose how it's [[available]]",
    },
    {
      from: leave(21.3) + 0.2,
      to: leave(29.7),
      icon: "check",
      text: "Pick your [[amenities]]",
    },
    {
      from: leave(29.7) + 0.2,
      to: leave(40.2),
      icon: "check",
      text: "Set your property [[rules]]",
    },
    {
      from: leave(40.2) + 0.2,
      to: leave(50.3),
      icon: "plus",
      text: "Generate a [[description]] with AI",
    },
    {
      from: leave(50.3) + 0.2,
      to: tapSave - 0.15,
      icon: "house",
      text: "Add [[bill accounts]] (optional)",
    },
    {
      from: tapSave - 0.15,
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
      from: tapStartNow - 0.4,
      to: leave(1.9),
      rect: startNowBtn1,
      radius: 40,
      tapAt: tapStartNow,
    },
    {
      // Starts right where the 2.0→12.0 cut lands (already showing the
      // scrolled, both-fields-visible state), so there's no live scroll for
      // a fixed box to fall out of sync with.
      from: arrive(2.0),
      // Ends slightly before the next cut lands so this doesn't chain-morph
      // into the next spot — that cut jumps to a different scroll position,
      // so a morph would drag the old box across now-unrelated content.
      to: arrive(13.6) - 0.1,
      rect: propertyDims,
      radius: 24,
      dim: false,
    },
    {
      from: arrive(13.6),
      to: leave(17.1),
      rect: nextBtn,
      radius: 52,
      tapAt: tapNext1,
    },
    {
      from: leave(17.1) + 0.1,
      to: tapNext2 - 0.15,
      rect: furnishedOptions,
      radius: 20,
      dim: false,
    },
    {
      from: tapNext2 - 0.15,
      to: leave(21.3),
      rect: nextBtn,
      radius: 52,
      tapAt: tapNext2,
    },
    {
      from: leave(21.3) + 0.1,
      to: tapNext3 - 0.15,
      rect: amenitiesArea,
      radius: 24,
      dim: false,
    },
    {
      from: tapNext3 - 0.15,
      to: leave(29.7),
      rect: nextBtn,
      radius: 52,
      tapAt: tapNext3,
    },
    {
      from: leave(29.7) + 0.1,
      to: tapNext4 - 0.15,
      rect: rulesArea,
      radius: 24,
      dim: false,
    },
    {
      from: tapNext4 - 0.15,
      to: leave(40.2),
      rect: nextBtn,
      radius: 52,
      tapAt: tapNext4,
    },
    {
      from: leave(40.2) + 0.1,
      to: tapNext5 - 0.15,
      rect: descriptionArea,
      radius: 20,
      dim: false,
    },
    {
      from: tapNext5 - 0.15,
      to: leave(50.3),
      rect: nextBtn,
      radius: 52,
      tapAt: tapNext5,
    },
    {
      from: leave(50.3) + 0.1,
      // Ends before the 52.5→59.0 cut lands so this doesn't chain-morph
      // into the scrolled-state spot below.
      to: arrive(52.5) - 0.1,
      rect: billAccountsForm,
      radius: 24,
      dim: false,
    },
    {
      from: arrive(52.5),
      // Ends before the 64.6→65.9 cut lands so this doesn't chain-morph
      // into the post-keyboard save-button spot below.
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
      from: arrive(67.3) + 0.1,
      to: end,
      rect: startNowBtn3,
      radius: 40,
      dim: false,
    },
  ],
  zooms: [
    {
      from: tapStartNow - 0.6,
      to: leave(1.9),
      scale: 1.2,
      target: center(startNowBtn1),
      easeIn: 0.6,
      easeOut: 0.6,
    },
    {
      // Zooms in right as the 2.0→12.0 cut lands on the scrolled
      // property-dimensions view (not the later 13.6 cut, which just skips
      // the scroll back up).
      from: arrive(2.0) - 0.3,
      to: arrive(13.6) - 0.1,
      scale: 1.15,
      target: center(propertyDims),
      easeIn: 0.7,
      easeOut: 0.7,
    },
    {
      from: tapGenerateAI - 0.6,
      to: leave(44.2) + 0.3,
      scale: 1.15,
      target: center(descriptionArea),
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

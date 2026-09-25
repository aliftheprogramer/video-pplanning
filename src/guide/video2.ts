import { guideClock } from "./timeline";
import type { Cut, GuideData, Hold, Point, Rect } from "./types";

const holds: Hold[] = [
  { at: 1.6, dur: 1.0 },
  { at: 4.5, dur: 1.0 },
  // These "Next" taps (5.6 / 32.5 / 39.0) each trigger a brief loading
  // spinner in the source before the screen transitions — held longer than
  // the spinner's own real-time duration so it reads clearly instead of
  // flashing by.
  { at: 5.6, dur: 1.3 },
  { at: 13.0, dur: 0.8 },
  { at: 23.5, dur: 1.0 },
  { at: 32.5, dur: 1.7 },
  { at: 39.0, dur: 1.7 },
  { at: 47.0, dur: 1.4 },
  // Long final hold: also gives the composition's own duration enough
  // headroom past this hold's source-video position (48s), which avoids a
  // Remotion Freeze+OffthreadVideo seek bug that appears when the frozen
  // frame number exceeds the composition's own durationInFrames.
  { at: 48.0, dur: 11.0 },
];

const cuts: Cut[] = [
  { from: 7.3, to: 11.8 }, // static map, nothing happening
  { from: 13.5, to: 23.0 }, // letter-by-letter location search typing (lands right as the result row appears)
  { from: 41.0, to: 46.0 }, // letter-by-letter title typing
];

const { arrive, leave } = guideClock(holds, cuts);

const tapStartNow = arrive(1.6);
const tapApartment = arrive(4.5);
const tapNext1 = arrive(5.6);
const tapSearchBar = arrive(13.0);
const tapSearchResult = arrive(23.5);
const tapNext2 = arrive(32.5);
const tapNext3 = arrive(39.0);
const tapSave = arrive(47.0);
const end = leave(48.0);

const startNowBtn1: Rect = { x: 128, y: 572, w: 352, h: 80 };
const apartmentCard: Rect = { x: 48, y: 355, w: 296, h: 167 };
const nextBtn: Rect = { x: 40, y: 1445, w: 640, h: 100 };
const searchBar: Rect = { x: 48, y: 330, w: 624, h: 76 };
const searchResultRow: Rect = { x: 24, y: 445, w: 672, h: 95 };
const mapArea: Rect = { x: 0, y: 436, w: 720, h: 890 };
const addressForm: Rect = { x: 28, y: 280, w: 664, h: 980 };
const titleInput: Rect = { x: 40, y: 490, w: 640, h: 96 };
// Save button while the keyboard is open sits much higher than the
// bottom-pinned CTA the other screens use (keyboard pushes it up).
const saveBtn: Rect = { x: 42, y: 894, w: 636, h: 90 };
const completedStep1Row: Rect = { x: 40, y: 395, w: 650, h: 195 };

const center = (r: Rect): Point => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

export const video2: GuideData = {
  holds,
  cuts,
  captions: [
    {
      from: 0.4,
      to: leave(1.6),
      icon: "check",
      text: "Tap [[Start now]] to begin",
    },
    {
      from: leave(1.6) + 0.2,
      to: leave(4.5),
      icon: "check",
      text: "Choose your [[property type]]",
    },
    {
      from: leave(4.5) + 0.2,
      to: leave(5.6),
      icon: "check",
      text: "Tap [[Next]] to continue",
    },
    {
      from: leave(5.6) + 0.2,
      to: leave(23.5),
      icon: "house",
      text: "Search for your [[location]]",
    },
    {
      from: leave(23.5) + 0.2,
      to: tapNext2 - 0.65,
      icon: "check",
      text: "Drag the pin to [[fine-tune]] it",
    },
    {
      from: tapNext2 - 0.65,
      to: leave(32.5),
      icon: "check",
      text: "Tap [[Next]] to confirm",
    },
    {
      from: leave(32.5) + 0.2,
      to: tapNext3 - 0.65,
      icon: "check",
      text: "Review your [[address]] details",
    },
    {
      from: tapNext3 - 0.65,
      to: leave(39.0),
      icon: "check",
      text: "Tap [[Next]] to confirm",
    },
    {
      from: leave(39.0) + 0.2,
      to: tapSave - 0.7,
      icon: "plus",
      text: "Give your listing a [[title]]",
    },
    {
      from: tapSave - 0.7,
      to: arrive(48.0) - 0.15,
      icon: "check",
      text: "Tap [[Save]] to finish",
    },
    {
      from: arrive(48.0) - 0.15,
      to: end,
      icon: "check",
      text: "[[Basic Information]] is complete!",
      keep: true,
    },
  ],
  spots: [
    {
      from: tapStartNow - 0.4,
      to: leave(1.6),
      rect: startNowBtn1,
      radius: 40,
      tapAt: tapStartNow,
    },
    {
      from: leave(1.6) + 0.1,
      to: leave(4.5),
      rect: apartmentCard,
      radius: 20,
      tapAt: tapApartment,
    },
    {
      from: leave(4.5) + 0.1,
      to: leave(5.6),
      rect: nextBtn,
      radius: 52,
      tapAt: tapNext1,
    },
    {
      from: leave(5.6) + 0.2,
      to: arrive(13.5),
      rect: searchBar,
      radius: 38,
      tapAt: tapSearchBar,
    },
    {
      from: arrive(13.5),
      to: leave(23.5),
      rect: searchResultRow,
      radius: 16,
      tapAt: tapSearchResult,
    },
    {
      from: leave(23.5) + 0.1,
      to: tapNext2 - 0.35,
      rect: mapArea,
      radius: 0,
      dim: false,
    },
    {
      from: tapNext2 - 0.22,
      to: leave(32.5),
      rect: nextBtn,
      radius: 52,
      tapAt: tapNext2,
    },
    {
      from: leave(32.5) + 0.1,
      to: tapNext3 - 0.35,
      rect: addressForm,
      radius: 24,
      dim: false,
    },
    {
      from: tapNext3 - 0.22,
      to: leave(39.0),
      rect: nextBtn,
      radius: 52,
      tapAt: tapNext3,
    },
    {
      from: leave(39.0) + 0.1,
      to: tapSave - 0.45,
      rect: titleInput,
      radius: 16,
    },
    {
      from: tapSave - 0.35,
      to: leave(47.0),
      rect: saveBtn,
      radius: 40,
      tapAt: tapSave,
    },
    {
      from: arrive(48.0) + 0.1,
      to: end,
      rect: completedStep1Row,
      radius: 32,
      dim: false,
    },
  ],
  zooms: [
    {
      from: tapStartNow - 0.6,
      to: leave(1.6),
      scale: 1.2,
      target: center(startNowBtn1),
      easeIn: 0.6,
      easeOut: 0.6,
    },
    {
      from: tapApartment - 0.6,
      to: leave(4.5),
      scale: 1.15,
      target: center(apartmentCard),
      easeIn: 0.6,
      easeOut: 0.6,
    },
    {
      from: tapSearchBar - 0.6,
      to: leave(23.5),
      scale: 1.2,
      target: { x: 360, y: 480 },
      easeIn: 0.7,
      easeOut: 0.7,
    },
    {
      from: tapSave - 0.6,
      to: leave(47.0) + 0.3,
      scale: 1.2,
      target: center(saveBtn),
      easeIn: 0.6,
      easeOut: 0.6,
    },
  ],
};

export const video2GuideEnd = end;

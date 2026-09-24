import { guideClock } from "./timeline";
import type {
  CaptionCue,
  ChipIcon,
  GuideData,
  Hold,
  Point,
  Rect,
  Spot,
} from "./types";

// Every timestamp below was measured directly off the source recording via
// single-frame ffmpeg extraction (not a mosaic/tile pass, which proved
// unreliable) at 0.2-0.5s resolution around each transition, cross-checked
// against a percentage-gridded overlay for rect centres. Native video space
// is 720x1600.

const box = (cx: number, cy: number, w: number, h: number): Rect => ({
  x: cx - w / 2,
  y: cy - h / 2,
  w,
  h,
});

// Same wide, card-wrapping boxes as the other four guide videos (video5's
// values for the same widgets were carried over almost unchanged — it's the
// same app screens, just a different take) rather than tight tap-point
// squares, so Step 4 matches the established look instead of the
// circle-on-tap style from the PDF brief.
const rects = {
  continueFillBtn: box(317, 1205, 354, 98),
  getRecommendationPill: box(357, 970, 505, 80),
  priceDisplayArea: box(365, 480, 460, 100),
  flexibleCheckboxRow: box(330, 710, 340, 70),
  // Tight to the "Negotiation Settings" card itself — the original
  // (360,750,668,700) started above "RM1000/mo" (irrelevant, already set)
  // and cut off mid-card before "Auto-Approve Above", confirmed by a direct
  // full-resolution frame extraction rather than a downscaled preview.
  negotiationFields: box(360, 960, 660, 420),
  nextBtn: box(360, 1544, 660, 100),
  durationField: box(575, 640, 150, 70),
  tabWhatYouEarn: box(360, 650, 668, 60),
  totalEarningLink: box(370, 1270, 200, 50),
  backArrowBtn: box(58, 140, 70, 70),
  useInstantBookCard: box(360, 792, 668, 200),
  coolingPeriodRow: box(360, 1088, 668, 150),
  coolingModalStepper: box(360, 1150, 600, 460),
  rentalTermRow: box(360, 1270, 668, 180),
  rentalTermToggleRow: box(360, 844, 650, 170),
  shortTermPremiumCard: box(360, 864, 650, 580),
  lastMinuteDiscountRow: box(360, 688, 660, 160),
  analyzingSpinner: box(360, 700, 420, 550),
} as const;

// One entry per real UI event in the recording, in on-screen order. `at` is
// the rec-second the tap/arrival happens; `dur` is how long the guide holds
// on that frame. `dim: true` means "ambient" — no tap ripple, just showing
// where to look. Each spot is built to span from the END of the previous
// beat's hold to the end of THIS beat's hold, so the highlighted rect always
// matches what's actually on screen for the full duration it's shown —
// there is no separate manual bookkeeping that can drift out of sync.
type Beat = {
  name: string;
  at: number;
  dur: number;
  rect: Rect;
  radius?: number;
  dim?: boolean;
  leadIn?: number; // only meaningful for the first beat
  // Overrides the natural "starts right when the previous beat's hold ends"
  // rule with a later rec-second. Needed where the target element doesn't
  // actually render until partway through the gap — e.g. the recommendation
  // pill is still hidden behind an "Enter property price" card for ~2s
  // after the hub tap, so highlighting it immediately would circle empty
  // space (confirmed by direct frame extraction, not guessed).
  gateAt?: number;
  // Skips the highlight box entirely for this beat (it still holds/freezes
  // the video and can still anchor a caption) — used for the tab switch,
  // which doesn't need a box drawing attention to it.
  skip?: boolean;
  // Delays this beat's spot start past the natural "touches the previous
  // beat's end" boundary. A touching boundary (gap 0) chain-morphs the
  // highlight shape smoothly, which looks fine between similarly-sized
  // boxes — but morphing the huge negotiationFields card down into the
  // small nextBtn pill mid-flight reads as a stray sliver sweeping across
  // the screen. A delay past Highlight.tsx's CHAIN_GAP (0.05s) makes the
  // two fade independently instead, which looks clean for that big a shape
  // change. Confirmed against the actual render, not guessed.
  startDelay?: number;
};

const beats: Beat[] = [
  {
    name: "continueFill",
    at: 0.85,
    // Held longer than the source recording's own pause here (which is
    // near-instant) so the "Back on the hub" caption has enough real time
    // to fully reveal and be read — matches the other 4 guide videos, whose
    // opening beat holds for 0.5-1.4s rather than this video's original 0.3s.
    dur: 0.5,
    rect: rects.continueFillBtn,
    radius: 48,
    leadIn: 0.4,
  },
  {
    name: "getRecommendation",
    at: 3.65,
    // 0.95 (not just enough for the tap/loading freeze) because the next
    // caption's own morph-delay gap caps this one's min-duration extension
    // short otherwise — verified against the actual withMinDuration() cap
    // math, same reasoning as before this beat got split in two.
    dur: 0.95,
    rect: rects.getRecommendationPill,
    radius: 27,
    gateAt: 3.0,
  },
  {
    // The recording settles on the AI-suggested price (RM1000) well before
    // "Enable Flexible Price" gets tapped — this beat calls that result out
    // explicitly instead of letting it flash past unremarked on the way to
    // the next action, matching the old video5's "AI suggests RM X per
    // month" beat. 0.95 for the same min-duration-cap reason as above.
    name: "priceUpdated",
    at: 4.3,
    dur: 0.95,
    rect: rects.priceDisplayArea,
    radius: 22,
    dim: true,
  },
  {
    name: "enableFlexible",
    at: 6.35,
    dur: 0.3,
    rect: rects.flexibleCheckboxRow,
    radius: 38,
  },
  {
    name: "negotiationFields",
    at: 8.0,
    dur: 0,
    rect: rects.negotiationFields,
    radius: 20,
    dim: true,
  },
  {
    name: "nextToIncome",
    at: 11.75,
    dur: 0.3,
    rect: rects.nextBtn,
    radius: 50,
    startDelay: 0.15,
  },
  { name: "durationTap", at: 12.85, dur: 0.3, rect: rects.durationField, radius: 20 },
  {
    name: "durationSettled",
    at: 17.05,
    dur: 0.3,
    rect: rects.durationField,
    radius: 20,
    dim: true,
  },
  {
    name: "whatYouEarnTab",
    at: 19.75,
    dur: 0.3,
    rect: rects.tabWhatYouEarn,
    radius: 20,
    skip: true,
  },
  {
    name: "totalEarningLink",
    at: 22.75,
    dur: 0.3,
    rect: rects.totalEarningLink,
    radius: 25,
  },
  {
    name: "backFromEarning",
    at: 24.35,
    dur: 0.3,
    rect: rects.backArrowBtn,
    radius: 16,
  },
  { name: "nextToBooking", at: 25.55, dur: 0.3, rect: rects.nextBtn, radius: 50 },
  {
    name: "useInstantBook",
    at: 28.15,
    dur: 0.3,
    rect: rects.useInstantBookCard,
    radius: 20,
  },
  { name: "coolingPeriod", at: 30.25, dur: 0.3, rect: rects.coolingPeriodRow, radius: 20 },
  {
    name: "coolingQuickSelect",
    at: 31.85,
    dur: 0.3,
    rect: rects.coolingModalStepper,
    radius: 24,
    dim: true,
  },
  { name: "applyCooling", at: 33.3, dur: 0.3, rect: rects.nextBtn, radius: 50 },
  { name: "rentalTerm", at: 33.95, dur: 0.3, rect: rects.rentalTermRow, radius: 20 },
  {
    name: "toggleShortTerm",
    at: 35.15,
    dur: 0.3,
    rect: rects.rentalTermToggleRow,
    radius: 34,
  },
  {
    name: "premiumSlider",
    at: 36.35,
    dur: 0.3,
    rect: rects.shortTermPremiumCard,
    radius: 20,
    dim: true,
  },
  { name: "applyRentalTerm", at: 39.05, dur: 0.3, rect: rects.nextBtn, radius: 50 },
  { name: "nextToDiscounts", at: 40.75, dur: 0.3, rect: rects.nextBtn, radius: 50 },
  {
    name: "lastMinuteDiscount",
    at: 42.15,
    dur: 0.3,
    rect: rects.lastMinuteDiscountRow,
    radius: 20,
  },
  { name: "save", at: 44.15, dur: 0.3, rect: rects.nextBtn, radius: 50 },
  { name: "publishNow", at: 45.75, dur: 0.3, rect: rects.nextBtn, radius: 50 },
  // Freezes on "Analyzing your listing...". The footage doesn't yet reach
  // the review-score / "Finalizing Your Uploads" / Your Listings beats from
  // the brief — those land once that recording exists.
  {
    name: "analyzing",
    at: 46.1,
    dur: 4.5,
    rect: rects.analyzingSpinner,
    radius: 24,
    dim: true,
  },
];

const holds: Hold[] = beats.map((b) => ({ at: b.at, dur: b.dur }));
const { arrive, leave } = guideClock(holds);

const byName = Object.fromEntries(beats.map((b, i) => [b.name, i]));
const beatStart = (i: number) => {
  const b = beats[i];
  const base =
    b.gateAt !== undefined
      ? arrive(b.gateAt)
      : i === 0
        ? arrive(b.at) - (b.leadIn ?? 0)
        : leave(beats[i - 1].at);
  return base + (b.startDelay ?? 0);
};
const beatEnd = (i: number) => leave(beats[i].at);
const startOf = (name: string) => beatStart(byName[name]);
const endOf = (name: string) => beatEnd(byName[name]);

const center = (r: Rect): Point => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

const spots: Spot[] = beats
  .map((b, i): Spot | null =>
    b.skip
      ? null
      : {
          from: beatStart(i),
          to: beatEnd(i),
          rect: b.rect,
          radius: b.radius ?? 60,
          dim: b.dim,
          tapAt: b.dim ? undefined : arrive(b.at),
        },
  )
  .filter((s): s is Spot => s !== null);

// The highlight box takes ~0.5s to chain-morph from one shape to the next
// (see Highlight.tsx's MOVE constant). Captions switch instantly, so a new
// caption naming the next target would say the right thing over a box that
// hasn't arrived yet. Delaying each caption's start past that morph window
// keeps text and box in sync — confirmed against the render, which showed
// exactly this lag (caption already on "Rental Term" while the box was
// still mid-flight from the cooling Apply button).
const CAPTION_MORPH_DELAY = 0.45;

const caption = (
  fromBeat: string,
  toBeat: string,
  icon: ChipIcon,
  text: string,
  keep?: boolean,
): CaptionCue => ({
  from:
    fromBeat === beats[0].name
      ? startOf(fromBeat)
      : startOf(fromBeat) + CAPTION_MORPH_DELAY,
  to: endOf(toBeat),
  icon,
  text,
  keep,
});

// Caption.tsx staggers each word in over ~0.07s and reserves a fixed 0.3s
// for the exit fade, so a short caption (a single quick beat, e.g. right
// after the hub tap) can finish revealing and start fading before it was
// ever comfortably readable. This floor stretches any caption under 1.6s up
// to that length — but never past the next caption's own start, since
// Caption.tsx shows whichever cue `Array.find` hits first and overlapping
// ranges would silently hide the second one.
const MIN_CAPTION_DURATION = 1.6;

const withMinDuration = (cues: CaptionCue[]): CaptionCue[] =>
  cues.map((cue, i) => {
    const nextFrom = cues[i + 1]?.from ?? Infinity;
    const wanted = cue.from + MIN_CAPTION_DURATION;
    return cue.to - cue.from >= MIN_CAPTION_DURATION
      ? cue
      : { ...cue, to: Math.min(wanted, nextFrom) };
  });

const end = leave(beats[beats.length - 1].at);

export const video6: GuideData = {
  holds,
  // Wording follows the house style set by videos 1-3: a short action
  // phrase naming the actual on-screen control ("Tap [[Start now]] to
  // begin", "Choose your [[property type]]"), never meta-commentary about
  // where the viewer "is" in the flow.
  captions: withMinDuration([
    caption("continueFill", "continueFill", "check", "Tap [[Continue fill]] to begin"),
    caption(
      "getRecommendation",
      "getRecommendation",
      "plus",
      "Tap [[Get recommendation]] for AI pricing",
    ),
    caption("priceUpdated", "priceUpdated", "check", "AI [[recommends]] a price for you"),
    caption(
      "enableFlexible",
      "negotiationFields",
      "plus",
      "Turn on [[Flexible Price]] for negotiation",
    ),
    caption("nextToIncome", "nextToIncome", "check", "Tap [[Next]] to continue"),
    caption("durationTap", "durationSettled", "check", "Choose your [[rental duration]]"),
    caption("whatYouEarnTab", "whatYouEarnTab", "check", "See what [[you earn]]"),
    caption(
      "totalEarningLink",
      "totalEarningLink",
      "check",
      "Check the [[total earning]] breakdown",
    ),
    caption("backFromEarning", "backFromEarning", "check", "Tap [[back]] to return"),
    caption("nextToBooking", "nextToBooking", "check", "Tap [[Next]] to continue"),
    caption("useInstantBook", "useInstantBook", "check", "Switch to [[Instant Book]]"),
    caption("coolingPeriod", "applyCooling", "plus", "Set your [[cooling period]]"),
    caption("rentalTerm", "applyRentalTerm", "plus", "Choose your [[rental term]]"),
    caption("nextToDiscounts", "nextToDiscounts", "check", "Tap [[Next]] to continue"),
    caption("lastMinuteDiscount", "save", "plus", "Add [[discounts]] to attract guests"),
    caption("publishNow", "publishNow", "check", "All done — tap [[Publish now]]"),
    caption(
      "analyzing",
      "analyzing",
      "check",
      "The app [[checks your listing]] first",
      true,
    ),
  ]),
  spots,
  zooms: [
    {
      // Shorter ease than the other zooms: the hub-to-tap window here is
      // under a second (the source recording taps "Continue fill" almost
      // immediately), so the usual 0.6s ease never finishes settling before
      // easing back out — it reads as a slow, perpetually-moving camera
      // instead of a quick punch-in. Confirmed against the render.
      from: startOf("continueFill"),
      to: endOf("continueFill"),
      scale: 1.2,
      target: center(rects.continueFillBtn),
      easeIn: 0.25,
      easeOut: 0.25,
    },
    {
      from: startOf("getRecommendation"),
      to: endOf("negotiationFields"),
      scale: 1.12,
      target: center(rects.getRecommendationPill),
      easeIn: 0.6,
      easeOut: 0.6,
    },
    {
      from: startOf("durationTap"),
      to: endOf("whatYouEarnTab"),
      scale: 1.15,
      target: center(rects.durationField),
      easeIn: 0.6,
      easeOut: 0.6,
    },
    {
      from: startOf("backFromEarning"),
      to: endOf("useInstantBook"),
      scale: 1.15,
      target: center(rects.useInstantBookCard),
      easeIn: 0.6,
      easeOut: 0.6,
    },
    {
      from: startOf("rentalTerm"),
      to: endOf("applyRentalTerm"),
      scale: 1.15,
      target: center(rects.shortTermPremiumCard),
      easeIn: 0.6,
      easeOut: 0.6,
    },
    {
      from: startOf("lastMinuteDiscount"),
      to: endOf("save"),
      scale: 1.12,
      target: center(rects.lastMinuteDiscountRow),
      easeIn: 0.6,
      easeOut: 0.6,
    },
    {
      from: startOf("publishNow"),
      to: end,
      scale: 1.15,
      target: center(rects.analyzingSpinner),
      easeIn: 0.6,
      easeOut: 0.6,
    },
  ],
};

export const video6GuideEnd = end;

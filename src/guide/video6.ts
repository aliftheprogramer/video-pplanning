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
  flexibleCheckboxRow: box(325, 690, 350, 100),
  negotiationFields: box(360, 750, 668, 700),
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
};

const beats: Beat[] = [
  {
    name: "continueFill",
    at: 0.85,
    dur: 0.3,
    rect: rects.continueFillBtn,
    radius: 48,
    leadIn: 0.4,
  },
  {
    name: "getRecommendation",
    at: 3.65,
    dur: 0.35,
    rect: rects.getRecommendationPill,
    radius: 27,
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
  { name: "nextToIncome", at: 11.75, dur: 0.3, rect: rects.nextBtn, radius: 50 },
  { name: "durationTap", at: 12.85, dur: 0.3, rect: rects.durationField, radius: 20 },
  {
    name: "durationSettled",
    at: 17.05,
    dur: 0.3,
    rect: rects.durationField,
    radius: 20,
    dim: true,
  },
  { name: "whatYouEarnTab", at: 19.75, dur: 0.3, rect: rects.tabWhatYouEarn, radius: 20 },
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
const beatStart = (i: number) =>
  i === 0 ? arrive(beats[0].at) - (beats[0].leadIn ?? 0) : leave(beats[i - 1].at);
const beatEnd = (i: number) => leave(beats[i].at);
const startOf = (name: string) => beatStart(byName[name]);
const endOf = (name: string) => beatEnd(byName[name]);

const center = (r: Rect): Point => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

const spots: Spot[] = beats.map((b, i) => ({
  from: beatStart(i),
  to: beatEnd(i),
  rect: b.rect,
  radius: b.radius ?? 60,
  dim: b.dim,
  tapAt: b.dim ? undefined : arrive(b.at),
}));

const caption = (
  fromBeat: string,
  toBeat: string,
  icon: ChipIcon,
  text: string,
  keep?: boolean,
): CaptionCue => ({
  from: startOf(fromBeat),
  to: endOf(toBeat),
  icon,
  text,
  keep,
});

const end = leave(beats[beats.length - 1].at);

export const video6: GuideData = {
  holds,
  captions: [
    caption("continueFill", "continueFill", "check", "Back on the hub — [[start Step 4]]"),
    caption(
      "getRecommendation",
      "getRecommendation",
      "dollar",
      "Get a [[suggested price]] from the app",
    ),
    caption(
      "enableFlexible",
      "negotiationFields",
      "check",
      "Turn on [[Flexible Price]] for negotiation",
    ),
    caption("nextToIncome", "nextToIncome", "check", "Tap [[Next]] to continue"),
    caption("durationTap", "durationSettled", "check", "Set the [[rental duration]]"),
    caption("whatYouEarnTab", "whatYouEarnTab", "check", "See what [[you earn]]"),
    caption(
      "totalEarningLink",
      "totalEarningLink",
      "check",
      "Check the [[total earning]] breakdown",
    ),
    caption("backFromEarning", "backFromEarning", "check", "Go [[back]] to the summary"),
    caption("nextToBooking", "nextToBooking", "check", "Tap [[Next]] to continue"),
    caption(
      "useInstantBook",
      "useInstantBook",
      "check",
      "Approve [[each booking]], or use Instant Book",
    ),
    caption("coolingPeriod", "applyCooling", "plus", "Set your [[cooling period]]"),
    caption(
      "rentalTerm",
      "applyRentalTerm",
      "plus",
      "Set how [[long]] you'll rent it out",
    ),
    caption("nextToDiscounts", "nextToDiscounts", "check", "Tap [[Next]] to continue"),
    caption("lastMinuteDiscount", "save", "plus", "Add [[discounts]] to attract guests"),
    caption("publishNow", "publishNow", "check", "All 4 steps done — [[publish]]"),
    caption(
      "analyzing",
      "analyzing",
      "check",
      "The app [[checks your listing]] first",
      true,
    ),
  ],
  spots,
  zooms: [
    {
      from: startOf("continueFill"),
      to: endOf("continueFill"),
      scale: 1.2,
      target: center(rects.continueFillBtn),
      easeIn: 0.6,
      easeOut: 0.6,
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

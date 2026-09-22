import { guideClock } from "./timeline";
import type { Cut, GuideData, Hold, Point, Rect } from "./types";

const holds: Hold[] = [
  { at: 4.2, dur: 0.6 },
  { at: 8.2, dur: 0.6 },
  { at: 13.0, dur: 0.5 },
  // Crop-confirm taps: the first two crops get a beat longer since the user
  // also adjusts the zoom slider there; the last three are quick confirms.
  { at: 16.9, dur: 0.3 },
  { at: 19.8, dur: 0.3 },
  { at: 20.9, dur: 0.2 },
  { at: 21.9, dur: 0.2 },
  { at: 22.9, dur: 0.3 },
  { at: 24.0, dur: 0.5 },
  { at: 29.0, dur: 0.4 },
  { at: 30.3, dur: 0.5 },
  { at: 37.2, dur: 0.5 },
  { at: 53.8, dur: 0.4 },
  { at: 57.5, dur: 0.4 },
  { at: 59.6, dur: 0.6 },
  { at: 66.0, dur: 0.4 },
  // Long final hold: freezes on the completed hub, well before the
  // screen-recorder's control-center artifact that follows around 67.5s in
  // the source (recording was stopped right after this point).
  { at: 67.0, dur: 11.0 },
];

const cuts: Cut[] = [
  { from: 9.3, to: 11.2 }, // photo picker: blank grid while it loads
  { from: 37.6, to: 48.2 }, // "AI is identifying your rooms..." shimmer wait
];

const { arrive, leave } = guideClock(holds, cuts);

const tapStartNow = arrive(4.2);
const tapAddPhotos = arrive(8.2);
const tapSelesai = arrive(13.0);
// Tapping "Selesai" doesn't jump straight into the crop screen — there's a
// brief transition (a flash of the photos-step screen, then the sheet
// sliding up) before the first photo's crop view actually renders here.
const cropArrive = arrive(14.3);
const cropConfirms = [16.9, 19.8, 20.9, 21.9, 22.9].map((at) => ({
  at,
  arrive: arrive(at),
  leave: leave(at),
}));
const tapUpload = arrive(24.0);
// The upload screen keeps spinning (upload, then a second server-side pass)
// well after the tap — the "Confirm your photos" screen doesn't actually
// arrive until here.
const confirmArrive = arrive(27.8);
const tapOkay = arrive(29.0);
const tapSaveConfirmation = arrive(30.3);
// A second server-side pass keeps the confirm screen's photos spinning well
// past the tap — the summary screen with "5 Photos Selected" doesn't arrive
// until here.
const summaryArrive = arrive(34.85);
const tapNext = arrive(37.2);
// The AI fills in the first 4 chips right away, but the 5th photo's chip
// (the one that lands on "Others") only renders — and the list only
// auto-scrolls to reveal it — once this settles, a couple seconds later.
const fifthChipAppear = arrive(52.2);
const tapOthersChip = arrive(53.8);
const tapLivingRoom = arrive(57.5);
const tapSaveLabels = arrive(59.6);
const tapSkip = arrive(66.0);
const end = leave(67.0);

const startNowStep3: Rect = { x: 39, y: 953, w: 642, h: 100 };
const addPhotosRow: Rect = { x: 39, y: 435, w: 642, h: 102 };
const pickerGrid: Rect = { x: 12, y: 688, w: 672, h: 600 };
const selesaiBtn: Rect = { x: 515, y: 1400, w: 170, h: 96 };
const cropConfirmBtn: Rect = { x: 630, y: 96, w: 80, h: 80 };
const cropImageArea: Rect = { x: 30, y: 240, w: 660, h: 990 };
const uploadGridArea: Rect = { x: 39, y: 358, w: 642, h: 840 };
const uploadBtn: Rect = { x: 40, y: 1445, w: 640, h: 100 };
const confirmPhotosArea: Rect = { x: 30, y: 210, w: 660, h: 1090 };
const okayBtn: Rect = { x: 40, y: 1445, w: 640, h: 100 };
const saveConfirmationBtn: Rect = { x: 40, y: 1445, w: 640, h: 100 };
const nextBtn: Rect = { x: 40, y: 1445, w: 640, h: 100 };
// The 5th photo's room-type chip: the one AI auto-guesses as "Others" and
// the user corrects to "Living Room" — same rect serves both moments. Only
// valid once the list has auto-scrolled and the chip has rendered (see
// fifthChipAppear) — before that this space is still empty.
const fifthChip: Rect = { x: 39, y: 1197, w: 306, h: 68 };
// The first two (already-labeled) rows, shown while the 5th chip is still
// missing/loading.
const firstTwoRowsArea: Rect = { x: 12, y: 380, w: 696, h: 770 };
const livingRoomOption: Rect = { x: 36, y: 280, w: 648, h: 64 };
const saveLabelsBtn: Rect = { x: 40, y: 1445, w: 640, h: 100 };
const tourAddNowBtn: Rect = { x: 39, y: 1300, w: 642, h: 80 };
const tourSkipBtn: Rect = { x: 40, y: 1445, w: 640, h: 100 };
const hubCompletedRow: Rect = { x: 12, y: 790, w: 672, h: 110 };

// Selection order in the picker matches crop order: bathroom, front yard,
// kitchen, bedroom, living room — all tapped in quick succession.
const pickThumbs: Rect[] = [
  { x: 12, y: 690, w: 216, h: 192 },
  { x: 240, y: 690, w: 216, h: 192 },
  { x: 468, y: 690, w: 216, h: 192 },
  { x: 12, y: 894, w: 216, h: 192 },
  { x: 240, y: 894, w: 216, h: 192 },
];
const pickStart = arrive(11.2);
const pickStep = 0.3;

const center = (r: Rect): Point => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

export const video4: GuideData = {
  holds,
  cuts,
  captions: [
    {
      from: 0.4,
      to: leave(4.2),
      icon: "check",
      text: "Tap [[Start now]] to begin",
    },
    {
      from: leave(4.2) + 0.2,
      to: leave(8.2),
      icon: "plus",
      text: "Tap [[Add photos]] to choose images",
    },
    {
      from: leave(8.2) + 0.2,
      to: tapSelesai - 0.15,
      icon: "plus",
      text: "Select [[5 photos]] for your listing",
    },
    {
      from: tapSelesai - 0.15,
      to: cropConfirms[4].leave + 0.15,
      icon: "check",
      text: "Crop each [[photo]] to fit",
      steps: cropConfirms.map((c, i) => ({
        from: i === 0 ? cropArrive : cropConfirms[i - 1].leave,
        to: c.leave,
        label: `${i + 1}/5`,
      })),
    },
    {
      from: cropConfirms[4].leave + 0.15,
      to: confirmArrive - 0.2,
      icon: "check",
      text: "Tap [[Upload]] to save your photos",
    },
    {
      from: confirmArrive - 0.2,
      to: tapOkay - 0.15,
      icon: "check",
      text: "[[Drag]] to reorder your photos",
    },
    {
      from: tapOkay - 0.15,
      to: leave(30.3) + 1.0,
      icon: "check",
      text: "Tap [[Save Confirmation]] to continue",
    },
    {
      from: leave(30.3) + 1.2,
      to: summaryArrive - 0.15,
      icon: "check",
      text: "Processing your [[photos]]",
    },
    {
      from: summaryArrive - 0.15,
      to: leave(37.2),
      icon: "check",
      text: "Tap [[Next]] to continue",
    },
    {
      from: leave(37.2) + 0.1,
      to: arrive(48.2) + 0.3,
      icon: "plus",
      text: "AI is identifying your [[rooms]]",
    },
    {
      from: arrive(48.2) + 0.3,
      to: tapOthersChip - 0.15,
      icon: "check",
      text: "Review the [[room labels]]",
    },
    {
      from: tapOthersChip - 0.15,
      to: leave(57.5) + 0.15,
      icon: "plus",
      text: "Fix any [[incorrect]] label",
    },
    {
      from: leave(57.5) + 0.15,
      to: leave(59.6) + 0.4,
      icon: "check",
      text: "Tap [[Save]] to finish labeling",
    },
    {
      from: leave(59.6) + 0.6,
      to: tapSkip - 0.15,
      icon: "plus",
      text: "Add a [[360° tour]] (optional)",
    },
    {
      from: tapSkip - 0.15,
      to: end,
      icon: "check",
      text: "[[Photos and Documents]] is complete!",
      keep: true,
    },
  ],
  spots: [
    {
      from: tapStartNow - 0.4,
      to: leave(4.2),
      rect: startNowStep3,
      radius: 50,
      tapAt: tapStartNow,
    },
    {
      from: leave(4.2) + 0.1,
      to: leave(8.2),
      rect: addPhotosRow,
      radius: 20,
      tapAt: tapAddPhotos,
    },
    {
      from: leave(8.2) + 0.2,
      to: pickStart,
      rect: pickerGrid,
      radius: 16,
      dim: false,
    },
    ...pickThumbs.map((rect, i) => ({
      from: pickStart + i * pickStep,
      to: pickStart + (i + 1) * pickStep,
      rect,
      radius: 12,
      tapAt: pickStart + i * pickStep + pickStep * 0.6,
    })),
    {
      from: pickStart + pickThumbs.length * pickStep,
      to: tapSelesai + 0.2,
      rect: selesaiBtn,
      radius: 48,
      tapAt: tapSelesai,
    },
    ...cropConfirms.map((c, i) => ({
      from: i === 0 ? cropArrive : cropConfirms[i - 1].leave,
      to: c.leave,
      rect: cropImageArea,
      radius: 24,
      dim: false,
      tapAt: c.arrive,
    })),
    ...cropConfirms.map((c) => ({
      from: c.arrive - 0.1,
      to: c.leave,
      rect: cropConfirmBtn,
      radius: 40,
      tapAt: c.arrive,
    })),
    {
      from: cropConfirms[4].leave + 0.1,
      to: tapUpload - 0.15,
      rect: uploadGridArea,
      radius: 16,
      dim: false,
    },
    {
      from: tapUpload - 0.15,
      to: leave(24.0),
      rect: uploadBtn,
      radius: 50,
      tapAt: tapUpload,
    },
    {
      from: leave(24.0) + 0.2,
      to: confirmArrive,
      rect: uploadGridArea,
      radius: 16,
      dim: false,
    },
    {
      from: confirmArrive,
      to: tapOkay - 0.15,
      rect: confirmPhotosArea,
      radius: 20,
      dim: false,
    },
    {
      from: tapOkay - 0.15,
      to: leave(29.0),
      rect: okayBtn,
      radius: 50,
      tapAt: tapOkay,
    },
    {
      from: leave(29.0) + 0.15,
      to: tapSaveConfirmation - 0.15,
      rect: confirmPhotosArea,
      radius: 20,
      dim: false,
    },
    {
      from: tapSaveConfirmation - 0.15,
      to: leave(30.3),
      rect: saveConfirmationBtn,
      radius: 50,
      tapAt: tapSaveConfirmation,
    },
    {
      from: leave(30.3) + 0.15,
      to: summaryArrive,
      rect: confirmPhotosArea,
      radius: 20,
      dim: false,
    },
    {
      from: summaryArrive,
      to: leave(37.2),
      rect: nextBtn,
      radius: 50,
      tapAt: tapNext,
    },
    {
      from: arrive(48.2) + 0.3,
      to: fifthChipAppear - 0.1,
      rect: firstTwoRowsArea,
      radius: 16,
      dim: false,
    },
    {
      from: fifthChipAppear - 0.1,
      to: tapOthersChip - 0.15,
      rect: fifthChip,
      radius: 34,
      dim: false,
    },
    {
      from: tapOthersChip - 0.15,
      to: leave(53.8),
      rect: fifthChip,
      radius: 34,
      tapAt: tapOthersChip,
    },
    {
      from: leave(53.8) + 0.1,
      to: tapLivingRoom - 0.1,
      rect: livingRoomOption,
      radius: 16,
    },
    {
      from: tapLivingRoom - 0.1,
      to: leave(57.5) + 0.3,
      rect: fifthChip,
      radius: 34,
      tapAt: tapLivingRoom,
    },
    {
      from: leave(57.5) + 0.4,
      to: tapSaveLabels - 0.15,
      rect: saveLabelsBtn,
      radius: 50,
    },
    {
      from: tapSaveLabels - 0.15,
      to: leave(59.6),
      rect: saveLabelsBtn,
      radius: 50,
      tapAt: tapSaveLabels,
    },
    {
      from: leave(59.6) + 0.6,
      to: tapSkip - 0.15,
      rect: tourAddNowBtn,
      radius: 40,
      dim: false,
    },
    {
      from: tapSkip - 0.15,
      to: leave(66.0),
      rect: tourSkipBtn,
      radius: 50,
      tapAt: tapSkip,
    },
    {
      from: arrive(67.0),
      to: end,
      rect: hubCompletedRow,
      radius: 20,
      dim: false,
    },
  ],
  zooms: [
    {
      from: tapStartNow - 0.6,
      to: leave(4.2),
      scale: 1.2,
      target: center(startNowStep3),
      easeIn: 0.6,
      easeOut: 0.6,
    },
    {
      from: tapAddPhotos - 0.6,
      to: pickStart + 0.3,
      scale: 1.15,
      target: center(addPhotosRow),
      easeIn: 0.6,
      easeOut: 0.6,
    },
    {
      from: pickStart,
      to: tapSelesai + 0.3,
      scale: 1.12,
      target: center(pickerGrid),
      easeIn: 0.7,
      easeOut: 0.6,
    },
    {
      from: cropArrive - 0.3,
      to: cropConfirms[4].leave + 0.3,
      scale: 1.1,
      target: center(cropImageArea),
      easeIn: 0.7,
      easeOut: 0.6,
    },
    {
      from: tapOthersChip - 0.6,
      to: leave(57.5) + 0.3,
      scale: 1.18,
      target: center(fifthChip),
      easeIn: 0.6,
      easeOut: 0.6,
    },
    {
      from: tapSkip - 0.6,
      to: leave(66.0) + 0.3,
      scale: 1.15,
      target: center(tourSkipBtn),
      easeIn: 0.6,
      easeOut: 0.6,
    },
  ],
};

export const video4GuideEnd = end;

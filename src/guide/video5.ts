import { guideClock } from "./timeline";
import type { GuideData, Hold, Point, Rect } from "./types";

const holds: Hold[] = [
  { at: 4.9, dur: 0.5 },
  { at: 8.6, dur: 0.6 },
  { at: 20.2, dur: 0.6 },
  { at: 23.6, dur: 0.4 },
  { at: 26.8, dur: 0.4 },
  { at: 31.5, dur: 0.5 },
  { at: 37.85, dur: 0.4 },
  { at: 41.1, dur: 0.4 },
  { at: 45.15, dur: 0.4 },
  { at: 48.3, dur: 0.3 },
  { at: 48.9, dur: 0.5 },
  { at: 52.35, dur: 0.4 },
  { at: 56.2, dur: 0.4 },
  { at: 59.7, dur: 0.4 },
  { at: 61.7, dur: 0.4 },
  { at: 62.3, dur: 0.4 },
  { at: 72.3, dur: 0.4 },
  { at: 74.2, dur: 0.5 },
  { at: 76.7, dur: 0.4 },
  // Long final hold: freezes on the completed hub, well before the
  // screen-recorder's control-center artifact that follows around 78.5s in
  // the source (recording was stopped right after this point).
  { at: 78.1, dur: 11.0 },
];

const { arrive, leave } = guideClock(holds);

const tapContinueFill = arrive(4.9);
const tapGetRecommendation = arrive(8.6);
// The AI price fills in almost immediately, but the "Great price point!"
// success card takes a couple more seconds to render.
const successCardArrive = arrive(10.9);
const tapEnableFlexiblePrice = arrive(20.2);
const tapMaxDiscountField = arrive(23.6);
const tapAutoApproveField = arrive(26.8);
const tapNextToIncome = arrive(31.5);
const tapWhatYouEarnTab = arrive(37.85);
const tapTotalEarningLink = arrive(41.1);
const tapBackFromEarning = arrive(45.15);
const tapWhatTenantPaysTab = arrive(48.3);
const tapNextToBooking = arrive(48.9);
// "Pick your booking settings" takes noticeably longer to render than the
// other screen transitions in this recording — confirmed by direct seek
// checks, not just the tap timing.
const bookingArrive = arrive(50.3);
const tapUseInstantBook = arrive(52.35);
const tapCoolingPeriod = arrive(56.2);
const tapApplyCooling = arrive(59.7);
const tapRentalTerm = arrive(61.7);
const tapToggleShortTerm = arrive(62.3);
const tapApplyRentalTerm = arrive(72.3);
const tapNextToDiscounts = arrive(74.2);
// The Add-discounts screen doesn't render immediately on tap — it arrives
// here, a beat after the hold ends.
const discountsArrive = arrive(74.5);
const tapSaveDiscounts = arrive(76.7);
const end = leave(78.1);

const continueFillBtn: Rect = { x: 125, y: 1152, w: 354, h: 98 };
const priceDisplayArea: Rect = { x: 113, y: 615, w: 495, h: 83 };
const getRecommendationPill: Rect = { x: 105, y: 1280, w: 507, h: 53 };
const successCard: Rect = { x: 26, y: 248, w: 668, h: 143 };
const flexibleCheckboxRow: Rect = { x: 150, y: 1165, w: 400, h: 75 };
// Broad area over both "maximum discounted rate" / "Auto-Approve Above"
// fields — the page scrolls under it while typing, so a single generous box
// (like the scrolling-form spots in video3) tracks better than chasing each
// field's exact position.
const negotiationCard: Rect = { x: 26, y: 400, w: 668, h: 700 };
const tabRow: Rect = { x: 26, y: 800, w: 668, h: 55 };
const tenantPaysCard: Rect = { x: 26, y: 927, w: 668, h: 284 };
const earnCard: Rect = { x: 26, y: 671, w: 668, h: 563 };
const totalEarningLink: Rect = { x: 240, y: 1305, w: 240, h: 50 };
const totalEarningDetailCard: Rect = { x: 26, y: 225, w: 668, h: 330 };
const backArrowBtn: Rect = { x: 20, y: 100, w: 70, h: 60 };
const approveManuallyCard: Rect = { x: 26, y: 387, w: 668, h: 266 };
const useInstantBookCard: Rect = { x: 26, y: 680, w: 668, h: 176 };
const coolingPeriodRow: Rect = { x: 26, y: 1002, w: 668, h: 116 };
const rentalTermRow: Rect = { x: 26, y: 1148, w: 668, h: 150 };
const coolingModalStepper: Rect = { x: 125, y: 885, w: 471, h: 83 };
const rentalTermToggleRow: Rect = { x: 26, y: 833, w: 668, h: 68 };
const shortTermPremiumCard: Rect = { x: 26, y: 590, w: 668, h: 296 };
const newListingPromotionRow: Rect = { x: 26, y: 443, w: 668, h: 113 };
const nextBtn: Rect = { x: 40, y: 1445, w: 640, h: 100 };
const hubCompletedFinalRow: Rect = { x: 26, y: 998, w: 668, h: 165 };

const center = (r: Rect): Point => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

export const video5: GuideData = {
  holds,
  captions: [
    {
      from: 0.4,
      to: leave(4.9),
      icon: "check",
      text: "Tap [[Continue fill]] to begin",
    },
    {
      from: leave(4.9) + 0.2,
      to: leave(8.6),
      icon: "plus",
      text: "Tap [[Get recommendation]] for AI pricing",
    },
    {
      from: leave(8.6) + 0.2,
      to: tapEnableFlexiblePrice - 0.15,
      icon: "check",
      text: "AI suggests [[RM 1,800]] per month",
      support: "Great price point — 70% success rate",
    },
    {
      from: tapEnableFlexiblePrice - 0.15,
      to: leave(20.2),
      icon: "plus",
      text: "Turn on [[Flexible Price]] for negotiation",
    },
    {
      from: leave(20.2) + 0.2,
      to: tapNextToIncome - 0.15,
      icon: "check",
      text: "Set your [[negotiation]] limits",
      support: "Max discount 10% · Auto-approve 6%",
    },
    {
      from: tapNextToIncome - 0.15,
      to: tapWhatYouEarnTab - 0.15,
      icon: "check",
      text: "Review your [[rental income]]",
    },
    {
      from: tapWhatYouEarnTab - 0.15,
      to: tapTotalEarningLink - 0.15,
      icon: "check",
      text: "See what [[you earn]] after fees",
    },
    {
      from: tapTotalEarningLink - 0.15,
      to: tapBackFromEarning - 0.15,
      icon: "check",
      text: "Breakdown of [[RUUMI charges]]",
    },
    {
      from: tapBackFromEarning - 0.15,
      to: tapNextToBooking - 0.4,
      icon: "check",
      text: "Head [[back]] to double-check",
    },
    {
      from: tapNextToBooking - 0.4,
      to: bookingArrive - 0.1,
      icon: "check",
      text: "Tap [[Next]] to continue",
    },
    {
      from: bookingArrive - 0.1,
      to: tapUseInstantBook - 0.15,
      icon: "plus",
      text: "Choose how you [[approve bookings]]",
    },
    {
      from: tapUseInstantBook - 0.15,
      to: leave(52.35),
      icon: "check",
      text: "Switch to [[Instant Book]]",
    },
    {
      from: leave(52.35) + 0.2,
      to: tapApplyCooling - 0.15,
      icon: "plus",
      text: "Set your [[cooling period]]",
    },
    {
      from: tapApplyCooling - 0.15,
      to: leave(59.7) + 0.2,
      icon: "check",
      text: "Tap [[Apply]] to confirm",
    },
    {
      from: leave(59.7) + 0.2,
      to: leave(61.7),
      icon: "check",
      text: "Tap [[Rental Term]] to set duration rules",
    },
    {
      from: leave(61.7) + 0.2,
      to: tapToggleShortTerm - 0.15,
      icon: "plus",
      text: "Allow [[short-term]] rentals",
    },
    {
      from: tapToggleShortTerm - 0.15,
      to: tapApplyRentalTerm - 0.15,
      icon: "check",
      text: "Adjust the [[short-term premium]]",
    },
    {
      from: tapApplyRentalTerm - 0.15,
      to: leave(72.3),
      icon: "check",
      text: "Tap [[Apply]] to confirm",
    },
    {
      from: tapNextToDiscounts - 0.4,
      to: discountsArrive - 0.1,
      icon: "check",
      text: "Tap [[Next]] to continue",
    },
    {
      from: discountsArrive - 0.1,
      to: tapSaveDiscounts - 0.15,
      icon: "plus",
      text: "Add [[discounts]] to attract guests",
    },
    {
      from: tapSaveDiscounts - 0.15,
      to: end,
      icon: "check",
      text: "[[Price and Settings]] is complete!",
      keep: true,
    },
  ],
  spots: [
    {
      from: tapContinueFill - 0.4,
      to: leave(4.9),
      rect: continueFillBtn,
      radius: 48,
      tapAt: tapContinueFill,
    },
    {
      from: leave(4.9),
      to: tapGetRecommendation - 0.15,
      rect: getRecommendationPill,
      radius: 27,
      dim: false,
    },
    {
      from: tapGetRecommendation - 0.15,
      to: leave(8.6),
      rect: getRecommendationPill,
      radius: 27,
      tapAt: tapGetRecommendation,
    },
    {
      from: leave(8.6),
      to: successCardArrive - 0.1,
      rect: priceDisplayArea,
      radius: 20,
      dim: false,
    },
    {
      from: successCardArrive - 0.1,
      to: tapEnableFlexiblePrice - 0.15,
      rect: successCard,
      radius: 20,
      dim: false,
    },
    {
      from: tapEnableFlexiblePrice - 0.15,
      to: leave(20.2),
      rect: flexibleCheckboxRow,
      radius: 38,
      tapAt: tapEnableFlexiblePrice,
    },
    {
      from: leave(20.2),
      to: tapMaxDiscountField - 0.15,
      rect: negotiationCard,
      radius: 20,
      dim: false,
    },
    {
      from: tapMaxDiscountField - 0.15,
      to: tapAutoApproveField - 0.15,
      rect: negotiationCard,
      radius: 20,
      dim: false,
      tapAt: tapMaxDiscountField,
    },
    {
      from: tapAutoApproveField - 0.15,
      to: tapNextToIncome - 0.15,
      rect: negotiationCard,
      radius: 20,
      dim: false,
      tapAt: tapAutoApproveField,
    },
    {
      from: tapNextToIncome - 0.15,
      to: leave(31.5),
      rect: nextBtn,
      radius: 50,
      tapAt: tapNextToIncome,
    },
    {
      from: leave(31.5),
      to: tapWhatYouEarnTab - 0.15,
      rect: tenantPaysCard,
      radius: 20,
      dim: false,
    },
    {
      from: tapWhatYouEarnTab - 0.15,
      to: leave(37.85),
      rect: tabRow,
      radius: 20,
      tapAt: tapWhatYouEarnTab,
    },
    {
      from: leave(37.85),
      to: tapTotalEarningLink - 0.15,
      rect: earnCard,
      radius: 20,
      dim: false,
    },
    {
      from: tapTotalEarningLink - 0.15,
      to: leave(41.1),
      rect: totalEarningLink,
      radius: 25,
      tapAt: tapTotalEarningLink,
    },
    {
      from: leave(41.1),
      to: tapBackFromEarning - 0.15,
      rect: totalEarningDetailCard,
      radius: 20,
      dim: false,
    },
    {
      from: tapBackFromEarning - 0.15,
      to: leave(45.15),
      rect: backArrowBtn,
      radius: 16,
      tapAt: tapBackFromEarning,
    },
    {
      from: leave(45.15),
      to: tapWhatTenantPaysTab - 0.1,
      rect: earnCard,
      radius: 20,
      dim: false,
    },
    {
      from: tapWhatTenantPaysTab - 0.1,
      to: leave(48.3),
      rect: tabRow,
      radius: 20,
      tapAt: tapWhatTenantPaysTab,
    },
    {
      from: leave(48.3),
      to: leave(48.9),
      rect: nextBtn,
      radius: 50,
      tapAt: tapNextToBooking,
    },
    {
      from: bookingArrive,
      to: tapUseInstantBook - 0.15,
      rect: approveManuallyCard,
      radius: 20,
      dim: false,
    },
    {
      from: tapUseInstantBook - 0.15,
      to: leave(52.35),
      rect: useInstantBookCard,
      radius: 20,
      tapAt: tapUseInstantBook,
    },
    {
      from: leave(52.35),
      to: tapCoolingPeriod - 0.15,
      rect: coolingPeriodRow,
      radius: 20,
      dim: false,
    },
    {
      from: tapCoolingPeriod - 0.15,
      to: leave(56.2),
      rect: coolingPeriodRow,
      radius: 20,
      tapAt: tapCoolingPeriod,
    },
    {
      from: leave(56.2),
      to: tapApplyCooling - 0.15,
      rect: coolingModalStepper,
      radius: 24,
      dim: false,
    },
    {
      from: tapApplyCooling - 0.15,
      to: leave(59.7),
      rect: nextBtn,
      radius: 50,
      tapAt: tapApplyCooling,
    },
    {
      from: leave(59.7),
      to: tapRentalTerm - 0.15,
      rect: rentalTermRow,
      radius: 20,
      dim: false,
    },
    {
      from: tapRentalTerm - 0.15,
      to: leave(61.7),
      rect: rentalTermRow,
      radius: 20,
      tapAt: tapRentalTerm,
    },
    {
      from: leave(61.7),
      to: tapToggleShortTerm - 0.15,
      rect: rentalTermToggleRow,
      radius: 34,
      dim: false,
    },
    {
      from: tapToggleShortTerm - 0.15,
      to: leave(62.3),
      rect: rentalTermToggleRow,
      radius: 34,
      tapAt: tapToggleShortTerm,
    },
    {
      from: leave(62.3),
      to: tapApplyRentalTerm - 0.15,
      rect: shortTermPremiumCard,
      radius: 20,
      dim: false,
    },
    {
      from: tapApplyRentalTerm - 0.15,
      to: leave(72.3),
      rect: nextBtn,
      radius: 50,
      tapAt: tapApplyRentalTerm,
    },
    {
      from: tapNextToDiscounts - 0.4,
      to: leave(74.2),
      rect: nextBtn,
      radius: 50,
      tapAt: tapNextToDiscounts,
    },
    {
      from: discountsArrive,
      to: tapSaveDiscounts - 0.15,
      rect: newListingPromotionRow,
      radius: 20,
      dim: false,
    },
    {
      from: tapSaveDiscounts - 0.15,
      to: leave(76.7),
      rect: nextBtn,
      radius: 50,
      tapAt: tapSaveDiscounts,
    },
    {
      from: arrive(78.1),
      to: end,
      rect: hubCompletedFinalRow,
      radius: 20,
      dim: false,
    },
  ],
  zooms: [
    {
      from: tapContinueFill - 0.6,
      to: leave(4.9),
      scale: 1.2,
      target: center(continueFillBtn),
      easeIn: 0.6,
      easeOut: 0.6,
    },
    {
      from: arrive(4.9) + 0.1,
      to: leave(8.6) + 0.3,
      scale: 1.15,
      target: center(getRecommendationPill),
      easeIn: 0.7,
      easeOut: 0.6,
    },
    {
      from: tapEnableFlexiblePrice - 0.6,
      to: leave(20.2),
      scale: 1.15,
      target: center(flexibleCheckboxRow),
      easeIn: 0.6,
      easeOut: 0.6,
    },
    {
      from: leave(20.2) + 0.2,
      to: tapNextToIncome - 0.2,
      scale: 1.1,
      target: center(negotiationCard),
      easeIn: 0.7,
      easeOut: 0.6,
    },
    {
      from: tapWhatYouEarnTab - 0.6,
      to: tapBackFromEarning + 0.3,
      scale: 1.1,
      target: center(tabRow),
      easeIn: 0.6,
      easeOut: 0.6,
    },
    {
      from: tapUseInstantBook - 0.6,
      to: leave(52.35) + 0.3,
      scale: 1.15,
      target: center(useInstantBookCard),
      easeIn: 0.6,
      easeOut: 0.6,
    },
    {
      from: tapRentalTerm - 0.4,
      to: tapApplyRentalTerm + 0.3,
      scale: 1.1,
      target: center(shortTermPremiumCard),
      easeIn: 0.6,
      easeOut: 0.6,
    },
    {
      from: tapNextToDiscounts - 0.6,
      to: leave(76.7) + 0.3,
      scale: 1.12,
      target: center(newListingPromotionRow),
      easeIn: 0.6,
      easeOut: 0.6,
    },
  ],
};

export const video5GuideEnd = end;

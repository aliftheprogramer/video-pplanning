import { guideClock } from "./timeline";
import type { GuideData, Hold, Point, Rect } from "./types";

const holds: Hold[] = [
  { at: 2.0, dur: 1.4 },
  { at: 5.2, dur: 1.4 },
  { at: 6.35, dur: 3.0 },
  { at: 8.4, dur: 11.0 },
];

const { arrive, leave } = guideClock(holds);

const tapListings = arrive(2.55);
const tapPlus = arrive(5.85);
const tapNext = arrive(7.6);
const hubStart = arrive(8.4);
const end = leave(8.4);

const listingsTab: Rect = { x: 288, y: 1440, w: 144, h: 150 };
const plusButton: Rect = { x: 598, y: 88, w: 76, h: 76 };
const optionCard: Rect = { x: 47, y: 1199, w: 626, h: 151 };
const nextButton: Rect = { x: 47, y: 1415, w: 626, h: 104 };
const allRows: Rect = { x: 40, y: 395, w: 650, h: 760 };
const rows: Rect[] = [
  { x: 40, y: 395, w: 650, h: 275 },
  { x: 40, y: 676, w: 650, h: 160 },
  { x: 40, y: 832, w: 650, h: 165 },
  { x: 40, y: 1000, w: 650, h: 155 },
];

const center = (r: Rect): Point => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

const rowStart = hubStart + 2.8;
const rowLen = 1.3;
const rowEnd = rowStart + rows.length * rowLen;

export const video1: GuideData = {
  holds,
  captions: [
    {
      from: 0.4,
      to: tapListings + 1.05,
      icon: "house",
      text: "Open the [[Listings]] tab",
    },
    {
      from: tapListings + 1.45,
      to: tapPlus + 1.15,
      icon: "plus",
      text: "Tap [[+]] to add a new one",
    },
    {
      from: tapPlus + 1.25,
      to: leave(6.35) - 0.15,
      icon: "check",
      text: "Pick [[Fill in RUUMI App]]",
    },
    {
      from: leave(6.35) - 0.15,
      to: hubStart + 0.4,
      icon: "check",
      text: "Then tap [[Next]]",
    },
    {
      from: hubStart + 0.4,
      to: rowEnd + 0.2,
      icon: "check",
      text: "These are the [[4 steps]]",
      steps: rows.map((_, i) => ({
        from: rowStart + i * rowLen,
        to: rowStart + (i + 1) * rowLen,
        label: `${i + 1}/4`,
      })),
    },
    {
      from: rowEnd + 0.2,
      to: end,
      icon: "check",
      text: "You'll come back here [[between each one]]",
      keep: true,
    },
  ],
  spots: [
    {
      from: arrive(2.0) - 0.4,
      to: tapListings + 0.7,
      rect: listingsTab,
      radius: 72,
      tapAt: tapListings,
    },
    {
      from: arrive(5.2) - 0.4,
      to: tapPlus + 0.6,
      rect: plusButton,
      radius: 38,
      pad: 2,
      tapAt: tapPlus,
    },
    {
      from: arrive(6.35) + 0.45,
      to: leave(6.35) - 0.65,
      rect: optionCard,
      radius: 28,
    },
    {
      from: leave(6.35) - 0.65,
      to: tapNext + 0.6,
      rect: nextButton,
      radius: 28,
      tapAt: tapNext,
    },
    {
      from: hubStart + 0.7,
      to: rowStart,
      rect: allRows,
      radius: 26,
      dim: false,
    },
    ...rows.map((rect, i) => ({
      from: rowStart + i * rowLen,
      to: rowStart + (i + 1) * rowLen,
      rect,
      radius: 26,
    })),
    {
      from: rowEnd,
      to: end,
      rect: allRows,
      radius: 26,
      dim: false,
    },
  ],
  zooms: [
    {
      from: arrive(2.0) - 0.6,
      to: tapListings + 1.0,
      scale: 1.22,
      target: center(listingsTab),
      easeIn: 0.7,
      easeOut: 0.6,
    },
    {
      from: arrive(5.2) - 0.6,
      to: tapPlus + 1.0,
      scale: 1.28,
      target: { x: 636, y: 200 },
      easeIn: 0.7,
      easeOut: 0.6,
    },
    {
      from: arrive(6.35) - 0.2,
      to: tapNext + 0.9,
      scale: 1.14,
      target: { x: 360, y: 1300 },
      easeIn: 0.7,
      easeOut: 0.7,
    },
  ],
};

export const video1GuideEnd = end;

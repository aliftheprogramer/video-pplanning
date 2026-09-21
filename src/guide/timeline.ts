import type { Cut, Hold } from "./types";

type Event =
  | { pos: number; kind: "hold"; dur: number }
  | { pos: number; kind: "cut"; to: number };

const mergeEvents = (holds: Hold[], cuts: Cut[]): Event[] =>
  [
    ...holds.map((h): Event => ({ pos: h.at, kind: "hold", dur: h.dur })),
    ...cuts.map((c): Event => ({ pos: c.from, kind: "cut", to: c.to })),
  ].sort((a, b) => a.pos - b.pos);

// A hold {at, dur} pauses the source video at rec-second `at` for `dur` extra
// guide-seconds. A cut {from, to} does the opposite: it removes the [from, to)
// span of source video entirely, consuming zero guide-seconds. Holds and cuts
// are walked together in one timeline, ordered by their original rec-second
// position. `cuts` defaults to [] everywhere so callers that never pass it
// (e.g. video1) are unaffected.
export const guideToRec = (
  guideSec: number,
  holds: Hold[],
  cuts: Cut[] = [],
): number => {
  let rec = 0;
  let left = Math.max(guideSec, 0);
  for (const ev of mergeEvents(holds, cuts)) {
    const play = Math.max(0, ev.pos - rec);
    if (left <= play) {
      return rec + left;
    }
    left -= play;
    if (ev.kind === "cut") {
      rec = ev.to;
    } else {
      rec = ev.pos;
      if (left <= ev.dur) {
        return rec;
      }
      left -= ev.dur;
    }
  }
  return rec + left;
};

export const guideEnd = (holds: Hold[], cuts: Cut[] = []): number => {
  let total = 0;
  let rec = 0;
  for (const ev of mergeEvents(holds, cuts)) {
    total += Math.max(0, ev.pos - rec);
    if (ev.kind === "cut") {
      rec = ev.to;
    } else {
      total += ev.dur;
      rec = ev.pos;
    }
  }
  return total;
};

export const guideClock = (holds: Hold[], cuts: Cut[] = []) => {
  const arrive = (rec: number) =>
    rec +
    holds.filter((h) => h.at < rec).reduce((sum, h) => sum + h.dur, 0) -
    cuts.filter((c) => c.to <= rec).reduce((sum, c) => sum + (c.to - c.from), 0);
  const leave = (rec: number) =>
    arrive(rec) + (holds.find((h) => h.at === rec)?.dur ?? 0);
  return { arrive, leave };
};

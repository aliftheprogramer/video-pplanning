import type { Hold } from "./types";

export const guideToRec = (guideSec: number, holds: Hold[]): number => {
  let rec = 0;
  let left = Math.max(guideSec, 0);
  for (const hold of holds) {
    const play = hold.at - rec;
    if (left <= play) {
      return rec + left;
    }
    left -= play;
    rec = hold.at;
    if (left <= hold.dur) {
      return rec;
    }
    left -= hold.dur;
  }
  return rec + left;
};

export const guideEnd = (holds: Hold[]): number => {
  let total = 0;
  let rec = 0;
  for (const hold of holds) {
    total += hold.at - rec + hold.dur;
    rec = hold.at;
  }
  return total;
};

export const guideClock = (holds: Hold[]) => {
  const arrive = (rec: number) =>
    rec + holds.filter((h) => h.at < rec).reduce((sum, h) => sum + h.dur, 0);
  const leave = (rec: number) =>
    arrive(rec) + (holds.find((h) => h.at === rec)?.dur ?? 0);
  return { arrive, leave };
};

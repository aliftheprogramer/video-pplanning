import { Easing, interpolate } from "remotion";
import type { Point, ZoomCue } from "./types";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);

export type ScreenZoom = Omit<ZoomCue, "target"> & { origin: Point };

export const zoomAt = (
  g: number,
  zooms: ScreenZoom[],
): { scale: number; origin: Point } => {
  for (const zoom of zooms) {
    if (g >= zoom.from && g <= zoom.to) {
      const enter = ease(
        interpolate(g, [zoom.from, zoom.from + zoom.easeIn], [0, 1], clamp),
      );
      const leave = ease(
        interpolate(g, [zoom.to - zoom.easeOut, zoom.to], [1, 0], clamp),
      );
      return {
        scale: 1 + (zoom.scale - 1) * enter * leave,
        origin: zoom.origin,
      };
    }
  }
  return { scale: 1, origin: { x: 540, y: 1000 } };
};

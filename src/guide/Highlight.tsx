import { Easing, interpolate } from "remotion";
import { ORANGE_400, ORANGE_500, TEAL_800 } from "../brand";
import type { Rect, Spot } from "./types";

export type ScreenSpot = Omit<Spot, "rect"> & { rect: Rect };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);

const FADE = 0.35;
const MOVE = 0.5;
const CHAIN_GAP = 0.05;
const PAD = 10;

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

type Shape = Rect & { r: number };

const lerpShape = (a: Shape, b: Shape, p: number): Shape => ({
  x: lerp(a.x, b.x, p),
  y: lerp(a.y, b.y, p),
  w: lerp(a.w, b.w, p),
  h: lerp(a.h, b.h, p),
  r: lerp(a.r, b.r, p),
});

const grow = (s: Shape, d: number): Shape => ({
  x: s.x - d,
  y: s.y - d,
  w: s.w + d * 2,
  h: s.h + d * 2,
  r: s.r + d,
});

const shapeOf = (spot: ScreenSpot): Shape =>
  grow({ ...spot.rect, r: spot.radius }, spot.pad ?? PAD);

const spotState = (g: number, spots: ScreenSpot[]) => {
  let index = -1;
  spots.forEach((s, k) => {
    if (g >= s.from) {
      index = k;
    }
  });
  if (index < 0) {
    return null;
  }
  const spot = spots[index];
  const prev = spots[index - 1];
  const next = spots[index + 1];
  let shape = shapeOf(spot);
  let dim = spot.dim === false ? 0 : 1;
  let opacity = 1;

  if (prev && spot.from - prev.to < CHAIN_GAP) {
    const p = ease(interpolate(g, [spot.from, spot.from + MOVE], [0, 1], clamp));
    shape = lerpShape(shapeOf(prev), shape, p);
    dim = lerp(prev.dim === false ? 0 : 1, dim, p);
  } else {
    const p = ease(interpolate(g, [spot.from, spot.from + FADE], [0, 1], clamp));
    opacity = p;
    shape = grow(shape, (1 - p) * 36);
  }

  if (g > spot.to && !(next && next.from - spot.to < CHAIN_GAP)) {
    const q = interpolate(g, [spot.to, spot.to + FADE], [1, 0], clamp);
    if (q <= 0) {
      return null;
    }
    opacity *= q;
  }
  return { shape, dim, opacity };
};

export const Highlight: React.FC<{
  readonly g: number;
  readonly spots: ScreenSpot[];
  readonly width: number;
  readonly height: number;
}> = ({ g, spots, width, height }) => {
  const state = spotState(g, spots);
  const pulse = 0.5 + 0.5 * Math.sin(g * Math.PI * 2 * 1.1);

  const ripples = spots.flatMap((spot, si) =>
    spot.tapAt === undefined
      ? []
      : [0, 0.16].map((delay, j) => {
          const p = (g - spot.tapAt! - delay) / 0.8;
          if (p <= 0 || p >= 1) {
            return null;
          }
          const e = Easing.out(Easing.cubic)(p);
          const s = grow(shapeOf(spot), 4 + 56 * e);
          return (
            <rect
              key={`${si}-${j}`}
              x={s.x}
              y={s.y}
              width={s.w}
              height={s.h}
              rx={s.r}
              fill="none"
              stroke={ORANGE_400}
              strokeWidth={1 + 6 * (1 - e)}
              opacity={0.75 * (1 - e)}
            />
          );
        }),
  );

  return (
    <svg
      width={width}
      height={height}
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <filter id="hl-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="hl-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
        {state ? (
          <mask id="hl-mask">
            <rect width={width} height={height} fill="white" />
            <rect
              x={state.shape.x}
              y={state.shape.y}
              width={state.shape.w}
              height={state.shape.h}
              rx={state.shape.r}
              fill="black"
              filter="url(#hl-soft)"
            />
          </mask>
        ) : null}
      </defs>
      {state ? (
        <>
          <rect
            width={width}
            height={height}
            fill={TEAL_800}
            opacity={0.45 * state.dim * state.opacity}
            mask="url(#hl-mask)"
          />
          <rect
            x={state.shape.x}
            y={state.shape.y}
            width={state.shape.w}
            height={state.shape.h}
            rx={state.shape.r}
            fill="none"
            stroke={ORANGE_500}
            strokeWidth={16}
            opacity={0.28 * state.opacity}
            filter="url(#hl-glow)"
          />
          <rect
            x={state.shape.x}
            y={state.shape.y}
            width={state.shape.w}
            height={state.shape.h}
            rx={state.shape.r}
            fill="none"
            stroke={ORANGE_500}
            strokeWidth={5 + 2 * pulse}
            opacity={state.opacity}
          />
        </>
      ) : null}
      {ripples}
    </svg>
  );
};

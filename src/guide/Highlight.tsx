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

// `circle` mode renders every rect-shaped highlight (mask hole, glow,
// border, ripple) as a circle inscribed around the same centre instead —
// used only by the restyled Step 4 video per its brief ("circular highlight
// on the tap point"). Default stays `rect` so the other 4 videos, which
// pass no `shape`, render exactly as before.
const shapeProps = (s: Shape, shape: "rect" | "circle") => {
  if (shape === "circle") {
    const cx = s.x + s.w / 2;
    const cy = s.y + s.h / 2;
    const r = (Math.sqrt(s.w * s.w + s.h * s.h) / 2) * 0.85;
    return { tag: "circle" as const, props: { cx, cy, r } };
  }
  return {
    tag: "rect" as const,
    props: { x: s.x, y: s.y, width: s.w, height: s.h, rx: s.r },
  };
};

export const Highlight: React.FC<{
  readonly g: number;
  readonly spots: ScreenSpot[];
  readonly width: number;
  readonly height: number;
  readonly shape?: "rect" | "circle";
}> = ({ g, spots, width, height, shape = "rect" }) => {
  const state = spotState(g, spots);
  const pulse = 0.5 + 0.5 * Math.sin(g * Math.PI * 2 * 1.1);
  const Tag = shape === "circle" ? "circle" : "rect";

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
          const { tag, props } = shapeProps(s, shape);
          const Ripple = tag;
          return (
            <Ripple
              key={`${si}-${j}`}
              {...props}
              fill="none"
              stroke={ORANGE_400}
              strokeWidth={1 + 6 * (1 - e)}
              opacity={0.75 * (1 - e)}
            />
          );
        }),
  );

  const shapeEl = state ? shapeProps(state.shape, shape) : null;

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
        {shapeEl ? (
          <mask id="hl-mask">
            <rect width={width} height={height} fill="white" />
            <Tag {...shapeEl.props} fill="black" filter="url(#hl-soft)" />
          </mask>
        ) : null}
      </defs>
      {state && shapeEl ? (
        <>
          <rect
            width={width}
            height={height}
            fill={TEAL_800}
            opacity={0.45 * state.dim * state.opacity}
            mask="url(#hl-mask)"
          />
          <Tag
            {...shapeEl.props}
            fill="none"
            stroke={ORANGE_500}
            strokeWidth={16}
            opacity={0.28 * state.opacity}
            filter="url(#hl-glow)"
          />
          <Tag
            {...shapeEl.props}
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

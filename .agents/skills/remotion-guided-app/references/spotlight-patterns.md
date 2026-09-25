# Spotlight & Guided App Motion Patterns

This reference provides production-ready React / Remotion implementations for the core primitives needed in guided app walkthrough videos.

---

## 1. Spotlight Overlay (`Highlight.tsx`)

Renders a darkened backdrop with a soft-edged cutout over the target element, a pulsating glow border, and tap ripples.

```tsx
import React from "react";
import { Easing, interpolate } from "remotion";

export type Rect = { x: number; y: number; w: number; h: number };
export type Shape = Rect & { r: number };

export type Spot = {
  from: number;   // start time in seconds (or video time)
  to: number;     // end time in seconds
  rect: Rect;     // bounding box of UI element
  radius: number; // corner radius
  pad?: number;   // padding around element (default 10)
  dim?: boolean;  // whether to dim background (default true)
  tapAt?: number; // timestamp when tap occurs to trigger ripple
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

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

export const Highlight: React.FC<{
  readonly g: number; // current video time in seconds
  readonly spots: Spot[];
  readonly width: number;
  readonly height: number;
  readonly highlightColor?: string; // e.g. '#FF7A00'
  readonly backdropColor?: string;  // e.g. '#0F172A'
  readonly shape?: "rect" | "circle";
}> = ({
  g,
  spots,
  width,
  height,
  highlightColor = "#FF7A00",
  backdropColor = "#0A0F1D",
  shape = "rect",
}) => {
  // Find active spot
  let index = -1;
  spots.forEach((s, k) => {
    if (g >= s.from) index = k;
  });
  if (index < 0) return null;

  const spot = spots[index];
  const prev = spots[index - 1];
  const next = spots[index + 1];

  const PAD = spot.pad ?? 10;
  const baseShape: Shape = grow({ ...spot.rect, r: spot.radius }, PAD);

  let currentShape = baseShape;
  let dim = spot.dim === false ? 0 : 1;
  let opacity = 1;

  // Transition from previous spot (morphing)
  if (prev && spot.from - prev.to < 0.05) {
    const prevBase: Shape = grow({ ...prev.rect, r: prev.radius }, prev.pad ?? 10);
    const p = ease(interpolate(g, [spot.from, spot.from + 0.4], [0, 1], clamp));
    currentShape = lerpShape(prevBase, currentShape, p);
    dim = lerp(prev.dim === false ? 0 : 1, dim, p);
  } else {
    // Fade in entrance
    const p = ease(interpolate(g, [spot.from, spot.from + 0.35], [0, 1], clamp));
    opacity = p;
    currentShape = grow(currentShape, (1 - p) * 32);
  }

  // Fade out exit
  if (g > spot.to && !(next && next.from - spot.to < 0.05)) {
    const q = interpolate(g, [spot.to, spot.to + 0.35], [1, 0], clamp);
    if (q <= 0) return null;
    opacity *= q;
  }

  // Pulse animation for the glowing border
  const pulse = 0.5 + 0.5 * Math.sin(g * Math.PI * 2 * 1.2);

  // Shape rendering parameters
  const isCircle = shape === "circle";
  const cx = currentShape.x + currentShape.w / 2;
  const cy = currentShape.y + currentShape.h / 2;
  const cr = (Math.sqrt(currentShape.w ** 2 + currentShape.h ** 2) / 2) * 0.85;

  // Ripples
  const ripples = spots.flatMap((s, si) => {
    if (s.tapAt === undefined) return [];
    return [0, 0.16].map((delay, j) => {
      const p = (g - s.tapAt! - delay) / 0.75;
      if (p <= 0 || p >= 1) return null;
      const e = Easing.out(Easing.cubic)(p);
      const rippleRadius = isCircle ? cr + 60 * e : Math.max(s.rect.w, s.rect.h) / 2 + 50 * e;
      return (
        <circle
          key={`ripple-${si}-${j}`}
          cx={cx}
          cy={cy}
          r={rippleRadius}
          fill="none"
          stroke={highlightColor}
          strokeWidth={1 + 5 * (1 - e)}
          opacity={0.8 * (1 - e)}
        />
      );
    });
  });

  return (
    <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <defs>
        <filter id="hl-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="hl-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <mask id="hl-mask">
          <rect width={width} height={height} fill="white" />
          {isCircle ? (
            <circle cx={cx} cy={cy} r={cr} fill="black" filter="url(#hl-soft)" />
          ) : (
            <rect
              x={currentShape.x}
              y={currentShape.y}
              width={currentShape.w}
              height={currentShape.h}
              rx={currentShape.r}
              fill="black"
              filter="url(#hl-soft)"
            />
          )}
        </mask>
      </defs>

      {/* Darkened backdrop with mask cutout */}
      <rect
        width={width}
        height={height}
        fill={backdropColor}
        opacity={0.5 * dim * opacity}
        mask="url(#hl-mask)"
      />

      {/* Outer blurred glow */}
      {isCircle ? (
        <circle
          cx={cx}
          cy={cy}
          r={cr}
          fill="none"
          stroke={highlightColor}
          strokeWidth={16}
          opacity={0.3 * opacity}
          filter="url(#hl-glow)"
        />
      ) : (
        <rect
          x={currentShape.x}
          y={currentShape.y}
          width={currentShape.w}
          height={currentShape.h}
          rx={currentShape.r}
          fill="none"
          stroke={highlightColor}
          strokeWidth={16}
          opacity={0.3 * opacity}
          filter="url(#hl-glow)"
        />
      )}

      {/* Crisp pulsing border */}
      {isCircle ? (
        <circle
          cx={cx}
          cy={cy}
          r={cr}
          fill="none"
          stroke={highlightColor}
          strokeWidth={4 + 2 * pulse}
          opacity={opacity}
        />
      ) : (
        <rect
          x={currentShape.x}
          y={currentShape.y}
          width={currentShape.w}
          height={currentShape.h}
          rx={currentShape.r}
          fill="none"
          stroke={highlightColor}
          strokeWidth={4 + 2 * pulse}
          opacity={opacity}
        />
      )}

      {ripples}
    </svg>
  );
};
```

---

## 2. Dynamic Camera Zoom (`zoom.ts`)

Calculates camera scale and focal origin to zoom in on points of interest smoothly:

```ts
import { Easing, interpolate } from "remotion";

export type Point = { x: number; y: number };
export type ZoomCue = {
  from: number;
  to: number;
  scale: number;
  origin: Point;
  easeIn: number;
  easeOut: number;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);

export const zoomAt = (
  timeInSeconds: number,
  zooms: ZoomCue[],
  defaultOrigin: Point = { x: 540, y: 960 },
): { scale: number; origin: Point } => {
  for (const zoom of zooms) {
    if (timeInSeconds >= zoom.from && timeInSeconds <= zoom.to) {
      const enter = ease(
        interpolate(timeInSeconds, [zoom.from, zoom.from + zoom.easeIn], [0, 1], clamp),
      );
      const leave = ease(
        interpolate(timeInSeconds, [zoom.to - zoom.easeOut, zoom.to], [1, 0], clamp),
      );
      return {
        scale: 1 + (zoom.scale - 1) * enter * leave,
        origin: zoom.origin,
      };
    }
  }
  return { scale: 1, origin: defaultOrigin };
};
```

---

## 3. Timeline Freezing Engine (`timeline.ts`)

Maps video playback time to composition time, freezing the video during explanations:

```ts
export type Hold = { at: number; dur: number };
export type Cut = { from: number; to: number };

export const mapTimeline = (
  compSeconds: number,
  holds: Hold[] = [],
  cuts: Cut[] = [],
): number => {
  let videoSeconds = compSeconds;

  // Process cuts first (skipping unwanted footage)
  for (const cut of cuts) {
    const cutDur = cut.to - cut.from;
    if (compSeconds > cut.from) {
      videoSeconds += cutDur;
    }
  }

  // Process holds (freeze-frames)
  let accumulatedHold = 0;
  for (const hold of holds) {
    const holdStartInComp = hold.at + accumulatedHold;
    if (compSeconds >= holdStartInComp && compSeconds < holdStartInComp + hold.dur) {
      // Currently holding on this frame!
      return hold.at;
    }
    if (compSeconds >= holdStartInComp + hold.dur) {
      accumulatedHold += hold.dur;
    }
  }

  return videoSeconds - accumulatedHold;
};
```

---

## 4. Step Callout Card (`Caption.tsx`)

A floating or bottom-docked badge providing clear guidance:

```tsx
import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export const StepCallout: React.FC<{
  readonly stepNumber: number;
  readonly title: string;
  readonly description?: string;
  readonly active: boolean;
}> = ({ stepNumber, title, description, active }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 120 },
  });

  if (!active) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: 40,
        right: 40,
        background: "rgba(15, 23, 42, 0.85)",
        backdropFilter: "blur(16px)",
        borderRadius: 24,
        padding: "20px 24px",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
        transform: `translateY(${(1 - entrance) * 30}px) scale(${0.95 + 0.05 * entrance})`,
        opacity: entrance,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            background: "#FF7A00",
            color: "#FFF",
            fontSize: 14,
            fontWeight: 800,
            padding: "4px 10px",
            borderRadius: 999,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Langkah {stepNumber}
        </span>
        <h3 style={{ margin: 0, color: "#FFF", fontSize: 20, fontWeight: 700 }}>
          {title}
        </h3>
      </div>
      {description && (
        <p style={{ margin: 0, color: "rgba(255, 255, 255, 0.75)", fontSize: 15, lineHeight: 1.4 }}>
          {description}
        </p>
      )}
    </div>
  );
};
```

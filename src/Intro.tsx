import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import {
  ORANGE_100,
  ORANGE_200,
  ORANGE_300,
  ORANGE_400,
  ORANGE_500,
  TEAL_800,
} from "./brand";
import { fontFamily } from "./fonts";
import { Caption } from "./guide/Caption";
import { Highlight } from "./guide/Highlight";
import { guideToRec } from "./guide/timeline";
import type { GuideData } from "./guide/types";
import { zoomAt } from "./guide/zoom";
import { PhoneMockup, SCREEN, videoToScreen } from "./PhoneMockup";

export const introSchema = z.object({
  subtitle: z.string(),
  title: z.string(),
  iconFile: z.string(),
  phoneFile: z.string(),
  videoFile: z.string(),
  videoWidth: z.number(),
  videoHeight: z.number(),
  videoCropTop: z.number(),
  videoStartSec: z.number(),
});

export type IntroProps = z.infer<typeof introSchema> & {
  readonly guide: GuideData;
};

const BACKGROUND = "#FFFFFF";

const CENTER_X = 540;
const ICON_SIZE = 252;
const ICON_CENTER_Y = 1084;
const ICON_RADIUS = ICON_SIZE * 0.225;

const PHONE_WIDTH = 778;
const PHONE_LEFT = (1080 - PHONE_WIDTH) / 2;
const PHONE_TOP = 280;
const PHONE_SCALE = PHONE_WIDTH / 1080;

const SPEED = 0.8;

const TAP_START = 1.1;
const TAP_RELEASE = 1.18;

const SPARK_COLORS = [ORANGE_500, ORANGE_400, ORANGE_300, ORANGE_200];
const SPARK_COUNT = 12;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = { ...clamp, easing: Easing.out(Easing.cubic) } as const;
const easeInOut = { ...clamp, easing: Easing.inOut(Easing.cubic) } as const;

const reveal = (t: number, start: number): React.CSSProperties => {
  const p = interpolate(t, [start, start + 0.5], [0, 1], easeOut);
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * 28}px)`,
    filter: `blur(${(1 - p) * 8}px)`,
  };
};

const Ripple: React.FC<{ t: number; start: number }> = ({ t, start }) => {
  const p = interpolate(t, [start, start + 0.85], [0, 1], easeOut);
  if (p <= 0 || p >= 1) {
    return null;
  }
  const d = ICON_SIZE * (0.9 + p * 3.4);
  return (
    <div
      style={{
        position: "absolute",
        left: CENTER_X - d / 2,
        top: ICON_CENTER_Y - d / 2,
        width: d,
        height: d,
        borderRadius: "50%",
        border: `${1 + 6 * (1 - p)}px solid ${ORANGE_300}`,
        opacity: (1 - p) * 0.8,
      }}
    />
  );
};

const Spark: React.FC<{ t: number; index: number }> = ({ t, index }) => {
  const angle =
    (index / SPARK_COUNT) * Math.PI * 2 + (random(`a${index}`) - 0.5) * 0.5;
  const distance = 150 + random(`d${index}`) * 230;
  const size = 18 + random(`s${index}`) * 22;
  const start = 1.3 + random(`t${index}`) * 0.1;
  const p = interpolate(t, [start, start + 0.7], [0, 1], easeOut);
  if (p <= 0 || p >= 1) {
    return null;
  }
  const r = ICON_SIZE / 2 + distance * p;
  const fadeIn = interpolate(p, [0, 0.12], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: CENTER_X + Math.cos(angle) * r - size / 2,
        top: ICON_CENTER_Y + Math.sin(angle) * r - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: SPARK_COLORS[index % SPARK_COLORS.length],
        opacity: fadeIn * (1 - p * p),
        transform: `scale(${1 - p * 0.4})`,
      }}
    />
  );
};

export const Intro: React.FC<IntroProps> = ({
  subtitle,
  title,
  iconFile,
  phoneFile,
  videoFile,
  videoWidth,
  videoHeight,
  videoCropTop,
  videoStartSec,
  guide,
}) => {
  const { fps } = useVideoConfig();
  const rawFrame = useCurrentFrame();
  const frame = rawFrame * SPEED;
  const t = frame / fps;

  const g = rawFrame / fps - videoStartSec;
  const videoFrame = Math.round(
    guideToRec(g, guide.holds, guide.cuts ?? []) * fps,
  );

  const toScreen = (vx: number, vy: number) =>
    videoToScreen(vx, vy, videoCropTop, videoWidth, videoHeight);
  const screenSpots = guide.spots.map((spot) => {
    const a = toScreen(spot.rect.x, spot.rect.y);
    return {
      ...spot,
      rect: {
        x: a.x,
        y: a.y,
        w: spot.rect.w * a.scale,
        h: spot.rect.h * a.scale,
      },
      radius: spot.radius * a.scale,
    };
  });
  const screenZooms = guide.zooms.map((zoom) => {
    const p = toScreen(zoom.target.x, zoom.target.y);
    return {
      ...zoom,
      origin: {
        x: PHONE_LEFT + (SCREEN.x + p.x) * PHONE_SCALE,
        y: PHONE_TOP + (SCREEN.y + p.y) * PHONE_SCALE,
      },
    };
  });
  const zoom = zoomAt(g, screenZooms);

  const pop = spring({
    frame,
    fps,
    config: { damping: 11, stiffness: 140, mass: 0.6 },
  });
  const popScale = 0.6 + 0.4 * pop;
  const popOpacity = interpolate(t, [0, 0.25], [0, 1], clamp);

  const floatY =
    Math.sin(t * Math.PI * 2 * 0.9) *
    5 *
    interpolate(t, [0.5, 0.9], [0, 1], clamp) *
    interpolate(t, [0.95, TAP_START], [1, 0], clamp);

  const pressDown = interpolate(t, [TAP_START, TAP_RELEASE], [1, 0.9], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  const pressRelease = spring({
    frame: frame - Math.round(TAP_RELEASE * fps),
    fps,
    config: { damping: 7, stiffness: 260, mass: 0.5 },
  });
  const pressScale = t < TAP_RELEASE ? pressDown : 0.9 + 0.1 * pressRelease;

  const iconExit = interpolate(t, [1.55, 2.0], [0, 1], easeInOut);
  const exitScale = 1 - 0.28 * iconExit;
  const iconOpacity =
    popOpacity * (1 - interpolate(t, [1.7, 2.0], [0, 1], clamp));

  const shadowY = 20 + (pressScale - 1) * 120;
  const shadowBlur = 30 + (pressScale - 1) * 150;

  const shineLeft = interpolate(t, [0.7, 1.05], [-60, 130], clamp);

  const glowOpacity =
    popOpacity *
    (0.85 + 0.15 * Math.sin(t * Math.PI * 2 * 0.7)) *
    (1 - interpolate(t, [1.6, 2.1], [0, 1], clamp));

  const textOut = interpolate(t, [1.5, 1.95], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });

  const phoneRise = spring({
    frame: frame - Math.round(1.7 * fps),
    fps,
    config: { damping: 14, stiffness: 90, mass: 1 },
  });
  const phoneOpacity = interpolate(t, [1.75, 2.15], [0, 1], clamp);
  const phoneFloat =
    Math.sin((t - 2.9) * Math.PI * 2 * 0.6) *
    4 *
    interpolate(t, [2.7, 3.1], [0, 1], clamp) *
    interpolate(rawFrame / fps, [videoStartSec - 0.6, videoStartSec], [1, 0], clamp);

  const bigRing = interpolate(t, [1.75, 2.75], [0, 1], easeOut);
  const bigRingSize = 200 + bigRing * 2400;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BACKGROUND,
        fontFamily
      }}
      from={-39}
    >
      <div
        style={{
          position: "absolute",
          left: CENTER_X - 450,
          top: ICON_CENTER_Y - 450,
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${ORANGE_200}99 0%, ${ORANGE_100}66 40%, ${ORANGE_100}00 70%)`,
          opacity: glowOpacity,
        }}
      />
      {t >= 1.75 && bigRing < 1 ? (
        <div
          style={{
            position: "absolute",
            left: CENTER_X - bigRingSize / 2,
            top: ICON_CENTER_Y - bigRingSize / 2,
            width: bigRingSize,
            height: bigRingSize,
            borderRadius: "50%",
            border: `4px solid ${ORANGE_200}`,
            opacity: 0.7 * (1 - bigRing),
          }}
        />
      ) : null}
      {[0, 1, 2].map((i) => (
        <Ripple key={i} t={t} start={TAP_RELEASE + i * 0.13} />
      ))}
      {Array.from({ length: SPARK_COUNT }, (_, i) => (
        <Spark key={i} t={t} index={i} />
      ))}
      <div
        style={{
          position: "absolute",
          top: 730,
          width: "100%",
          textAlign: "center",
          opacity: 1 - textOut,
          transform: `translateY(${-textOut * 50}px)`,
          filter: `blur(${textOut * 8}px)`,
        }}
      >
        <div
          style={{
            fontSize: 54,
            fontWeight: 600,
            color: ORANGE_500,
            lineHeight: "64px",
            ...reveal(t, 0.35),
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            marginTop: 26,
            fontSize: 66,
            fontWeight: 800,
            color: TEAL_800,
            lineHeight: "76px",
            textTransform: "uppercase",
          }}
        >
          {title.split(" ").map((word, i, words) => (
            <span
              key={`${word}-${i}`}
              style={{
                display: "inline-block",
                marginRight: i < words.length - 1 ? "0.28em" : 0,
                ...reveal(t, 0.5 + i * 0.09),
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: (1080 - ICON_SIZE) / 2,
          top: ICON_CENTER_Y - ICON_SIZE / 2,
          width: ICON_SIZE,
          height: ICON_SIZE,
          opacity: iconOpacity,
          transform: `translateY(${floatY}px) scale(${popScale * pressScale * exitScale})`,
          filter: `drop-shadow(0 ${shadowY}px ${shadowBlur}px rgba(247, 77, 23, 0.3))`,
        }}
      >
        <Img
          src={staticFile(iconFile)}
          style={{
            width: ICON_SIZE,
            height: ICON_SIZE,
            objectFit: "contain",
            scale: 1.024,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            borderRadius: ICON_RADIUS,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20%",
              bottom: "-20%",
              left: `${shineLeft}%`,
              width: "45%",
              transform: "skewX(-20deg)",
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)",
            }}
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: `${zoom.origin.x}px ${zoom.origin.y}px`,
          transform: `scale(${zoom.scale})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: PHONE_LEFT,
            top: PHONE_TOP,
            opacity: phoneOpacity,
            transform: `translateY(${(1 - phoneRise) * 1500 + phoneFloat}px) scale(${0.94 + 0.06 * phoneRise})`,
            filter: "drop-shadow(0 30px 40px rgba(11, 44, 41, 0.22))",
          }}
        >
          <PhoneMockup
            frameFile={phoneFile}
            videoFile={videoFile}
            videoFrame={videoFrame}
            videoCropTop={videoCropTop}
            width={PHONE_WIDTH}
            overlay={
              <Highlight
                g={g}
                spots={screenSpots}
                width={SCREEN.w}
                height={SCREEN.h}
              />
            }
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1080,
          height: 345,
          background:
            "linear-gradient(#FFFFFF 0px, #FFFFFF 300px, rgba(255,255,255,0) 345px)",
        }}
      />
      <Caption g={g} cues={guide.captions} />
    </AbsoluteFill>
  );
};

import { Easing, interpolate } from "remotion";
import {
  NEUTRAL_600,
  ORANGE_100,
  ORANGE_200,
  ORANGE_500,
  TEAL_800,
} from "../brand";
import { fontFamily } from "../fonts";
import type { CaptionCue, ChipIcon } from "./types";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = { ...clamp, easing: Easing.out(Easing.cubic) } as const;

const reveal = (local: number, start: number): React.CSSProperties => {
  const p = interpolate(local, [start, start + 0.45], [0, 1], easeOut);
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * 26}px)`,
    filter: `blur(${(1 - p) * 8}px)`,
  };
};

const ICONS: Record<ChipIcon, React.ReactNode> = {
  house: <path d="M3.5 11.2 12 4l8.5 7.2M6 9.6V20h12V9.6M10 20v-5.5h4V20" />,
  plus: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.4 2.8 2.8L16 9.6" />
    </>
  ),
};

const Icon: React.FC<{ name: ChipIcon }> = ({ name }) => (
  <svg
    viewBox="0 0 24 24"
    width={34}
    height={34}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {ICONS[name]}
  </svg>
);

const parse = (text: string) =>
  text
    .split(/(\[\[.*?\]\])/)
    .filter((part) => part.length > 0)
    .map((part) =>
      part.startsWith("[[")
        ? { keyword: true, words: part.slice(2, -2).split(" ") }
        : { keyword: false, words: part.trim().split(" ") },
    )
    .filter((token) => token.words.length > 0 && token.words[0] !== "");

export const Caption: React.FC<{
  readonly g: number;
  readonly cues: CaptionCue[];
}> = ({ g, cues }) => {
  const cue = cues.find((c) => g >= c.from && g < c.to);
  if (!cue) {
    return null;
  }
  const local = g - cue.from;
  const exit = cue.keep
    ? 0
    : interpolate(g, [cue.to - 0.3, cue.to], [0, 1], clamp);
  const step = cue.steps?.find((s) => g >= s.from && g < s.to);
  const tokens = parse(cue.text);
  let wordIndex = 0;
  const wordCount = tokens.reduce((sum, t) => sum + t.words.length, 0);

  return (
    <div
      style={{
        position: "absolute",
        top: 108,
        left: 0,
        width: 1080,
        padding: "0 70px",
        boxSizing: "border-box",
        textAlign: "center",
        fontFamily,
        opacity: 1 - exit,
        transform: `translateY(${-exit * 24}px)`,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          height: 58,
          padding: step ? "0 26px 0 18px" : "0 18px",
          borderRadius: 29,
          backgroundColor: "#FFFFFF",
          border: `2px solid ${ORANGE_200}`,
          color: ORANGE_500,
          boxShadow: "0 6px 20px rgba(247, 77, 23, 0.14)",
          ...reveal(local, 0),
        }}
      >
        <Icon name={cue.icon} />
        {step ? (
          <span
            key={step.label}
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: TEAL_800,
              ...reveal(g - step.from, 0),
            }}
          >
            {step.label}
          </span>
        ) : null}
      </div>
      <div
        style={{
          marginTop: 22,
          fontSize: 58,
          fontWeight: 600,
          lineHeight: "70px",
          color: TEAL_800,
        }}
      >
        {tokens.map((token, ti) => (
          <span
            key={ti}
            style={{
              display: "inline-block",
              marginRight: "0.26em",
              background: token.keyword
                ? `linear-gradient(transparent 64%, ${ORANGE_100} 64%)`
                : undefined,
            }}
          >
            {token.words.map((word, wi) => {
              const start = 0.12 + wordIndex * 0.07;
              wordIndex += 1;
              return (
                <span
                  key={wi}
                  style={{
                    display: "inline-block",
                    marginRight: wi < token.words.length - 1 ? "0.26em" : 0,
                    color: token.keyword ? ORANGE_500 : TEAL_800,
                    fontWeight: token.keyword ? 800 : 600,
                    ...reveal(local, start),
                  }}
                >
                  {word}
                </span>
              );
            })}
          </span>
        ))}
      </div>
      {cue.support ? (
        <div
          style={{
            marginTop: 14,
            fontSize: 34,
            fontWeight: 400,
            lineHeight: "44px",
            color: NEUTRAL_600,
            ...reveal(local, 0.12 + wordCount * 0.07 + 0.05),
          }}
        >
          {cue.support}
        </div>
      ) : null}
    </div>
  );
};

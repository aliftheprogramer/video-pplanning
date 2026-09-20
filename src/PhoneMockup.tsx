import { Freeze, Img, OffthreadVideo, staticFile } from "remotion";

export const PHONE_NATIVE_WIDTH = 1080;
export const PHONE_NATIVE_HEIGHT = 2000;

export const SCREEN = { x: 154, y: 146, w: 771, h: 1708, r: 80 };
const BLEED = 3;

export const videoToScreen = (
  vx: number,
  vy: number,
  cropTop: number,
  videoW: number,
  videoH: number,
) => {
  const boxW = SCREEN.w + BLEED * 2;
  const boxH = (SCREEN.h + BLEED * 2) / (1 - cropTop);
  const s = Math.max(boxW / videoW, boxH / videoH);
  return {
    x: vx * s + (boxW - videoW * s) / 2 - BLEED,
    y: vy * s - cropTop * boxH - BLEED,
    scale: s,
  };
};

const roundedRect = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;

const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${PHONE_NATIVE_WIDTH}" height="${PHONE_NATIVE_HEIGHT}" viewBox="0 0 ${PHONE_NATIVE_WIDTH} ${PHONE_NATIVE_HEIGHT}"><path fill-rule="evenodd" d="M0 0H${PHONE_NATIVE_WIDTH}V${PHONE_NATIVE_HEIGHT}H0Z ${roundedRect(SCREEN.x - 1, SCREEN.y - 1, SCREEN.w + 2, SCREEN.h + 2, SCREEN.r + 1)}"/></svg>`;
const frameMask = `url("data:image/svg+xml,${encodeURIComponent(maskSvg)}")`;

export const PhoneMockup: React.FC<{
  readonly frameFile: string;
  readonly videoFile: string;
  readonly videoFrame: number;
  readonly videoCropTop: number;
  readonly width: number;
  readonly overlay?: React.ReactNode;
}> = ({ frameFile, videoFile, videoFrame, videoCropTop, width, overlay }) => {
  const scale = width / PHONE_NATIVE_WIDTH;
  const boxHeight = (SCREEN.h + BLEED * 2) / (1 - videoCropTop);
  return (
    <div
      style={{
        width,
        height: PHONE_NATIVE_HEIGHT * scale,
      }}
    >
      <div
        style={{
          position: "relative",
          width: PHONE_NATIVE_WIDTH,
          height: PHONE_NATIVE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "0 0",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: SCREEN.x - BLEED,
            top: SCREEN.y - BLEED,
            width: SCREEN.w + BLEED * 2,
            height: SCREEN.h + BLEED * 2,
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Freeze frame={videoFrame}>
            <OffthreadVideo
              src={staticFile(videoFile)}
              muted
              style={{
                position: "absolute",
                left: 0,
                top: -videoCropTop * boxHeight,
                width: "100%",
                height: boxHeight,
                objectFit: "cover",
                objectPosition: "50% 0%",
              }}
            />
          </Freeze>
        </div>
        <div
          style={{
            position: "absolute",
            left: SCREEN.x,
            top: SCREEN.y,
            width: SCREEN.w,
            height: SCREEN.h,
            borderRadius: SCREEN.r,
            overflow: "hidden",
          }}
        >
          {overlay}
        </div>
        <Img
          src={staticFile(frameFile)}
          style={{
            position: "absolute",
            inset: 0,
            width: PHONE_NATIVE_WIDTH,
            height: PHONE_NATIVE_HEIGHT,
            maskImage: frameMask,
            WebkitMaskImage: frameMask,
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
          }}
        />
      </div>
    </div>
  );
};

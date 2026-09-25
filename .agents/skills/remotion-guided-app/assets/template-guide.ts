export type Rect = { x: number; y: number; w: number; h: number };
export type Point = { x: number; y: number };

export type Hold = { at: number; dur: number };
export type Cut = { from: number; to: number };

export type Spot = {
  from: number;
  to: number;
  rect: Rect;
  radius: number;
  pad?: number;
  dim?: boolean;
  tapAt?: number;
};

export type CaptionCue = {
  from: number;
  to: number;
  step: number;
  title: string;
  support?: string;
};

export type ZoomCue = {
  from: number;
  to: number;
  scale: number;
  origin: Point;
  easeIn: number;
  easeOut: number;
};

export type GuideData = {
  videoSrc: string;
  fps: number;
  durationInFrames: number;
  holds: Hold[];
  cuts?: Cut[];
  captions: CaptionCue[];
  spots: Spot[];
  zooms: ZoomCue[];
};

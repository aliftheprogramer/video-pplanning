export type Rect = { x: number; y: number; w: number; h: number };
export type Point = { x: number; y: number };

export type Hold = { at: number; dur: number };

export type Spot = {
  from: number;
  to: number;
  rect: Rect;
  radius: number;
  pad?: number;
  dim?: boolean;
  tapAt?: number;
};

export type ChipIcon = "house" | "plus" | "check";

export type StepChip = { from: number; to: number; label: string };

export type CaptionCue = {
  from: number;
  to: number;
  icon: ChipIcon;
  text: string;
  support?: string;
  steps?: StepChip[];
  keep?: boolean;
};

export type ZoomCue = {
  from: number;
  to: number;
  scale: number;
  target: Point;
  easeIn: number;
  easeOut: number;
};

export type GuideData = {
  holds: Hold[];
  captions: CaptionCue[];
  spots: Spot[];
  zooms: ZoomCue[];
};

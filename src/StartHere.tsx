import { video1 } from "./guide/video1";
import { Intro, type IntroProps } from "./Intro";

export const StartHere: React.FC<Omit<IntroProps, "guide">> = (props) => (
  <Intro {...props} guide={video1} />
);

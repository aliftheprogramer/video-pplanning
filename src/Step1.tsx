import { video2 } from "./guide/video2";
import { Intro, type IntroProps } from "./Intro";

export const Step1: React.FC<Omit<IntroProps, "guide">> = (props) => (
  <Intro {...props} guide={video2} />
);

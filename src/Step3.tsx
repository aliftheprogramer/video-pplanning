import { video4 } from "./guide/video4";
import { Intro, type IntroProps } from "./Intro";

export const Step3: React.FC<Omit<IntroProps, "guide">> = (props) => (
  <Intro {...props} guide={video4} />
);

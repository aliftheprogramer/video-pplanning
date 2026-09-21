import { video3 } from "./guide/video3";
import { Intro, type IntroProps } from "./Intro";

export const Step2: React.FC<Omit<IntroProps, "guide">> = (props) => (
  <Intro {...props} guide={video3} />
);

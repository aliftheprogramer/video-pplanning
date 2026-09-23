import { Intro, type IntroProps } from "./Intro";
import { video6 } from "./guide/video6";

export const Step4: React.FC<Omit<IntroProps, "guide">> = (props) => (
  <Intro {...props} guide={video6} />
);

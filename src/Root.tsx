import "./index.css";
import { Composition } from "remotion";
import { video1GuideEnd } from "./guide/video1";
import { introSchema } from "./Intro";
import { StartHere } from "./StartHere";

const FPS = 60;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StartHere"
        component={StartHere}
        schema={introSchema}
        durationInFrames={1740}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          subtitle: "How to use Ruumi",
          title: "Create Listing",
          iconFile: "icon-primary.png",
          phoneFile: "phone.webp",
          videoFile: "start-here-recording.mp4",
          videoWidth: 720,
          videoHeight: 1600,
          videoCropTop: 0.052,
          videoStartSec: 3.7,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil((props.videoStartSec + video1GuideEnd) * FPS),
        })}
      />
    </>
  );
};

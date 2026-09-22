import "./index.css";
import { Composition } from "remotion";
import { video1GuideEnd } from "./guide/video1";
import { video2GuideEnd } from "./guide/video2";
import { video3GuideEnd } from "./guide/video3";
import { video4GuideEnd } from "./guide/video4";
import { introSchema } from "./Intro";
import { StartHere } from "./StartHere";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";

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
      <Composition
        id="Step1BasicInformation"
        component={Step1}
        schema={introSchema}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          subtitle: "Step 1 of 4",
          title: "Basic Information",
          iconFile: "icon-primary.png",
          phoneFile: "phone.webp",
          videoFile: "step1-basic-info-recording.mp4",
          videoWidth: 720,
          videoHeight: 1600,
          videoCropTop: 0.052,
          videoStartSec: 3.7,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil((props.videoStartSec + video2GuideEnd) * FPS),
        })}
      />
      <Composition
        id="Step2DetailFacilities"
        component={Step2}
        schema={introSchema}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          subtitle: "Step 2 of 4",
          title: "Detail and Facilities",
          iconFile: "icon-primary.png",
          phoneFile: "phone.webp",
          videoFile: "step2-detail-facilities-recording.mp4",
          videoWidth: 720,
          videoHeight: 1600,
          videoCropTop: 0.052,
          videoStartSec: 3.7,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil((props.videoStartSec + video3GuideEnd) * FPS),
        })}
      />
      <Composition
        id="Step3PhotosDocuments"
        component={Step3}
        schema={introSchema}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          subtitle: "Step 3 of 4",
          title: "Photos and Documents",
          iconFile: "icon-primary.png",
          phoneFile: "phone.webp",
          videoFile: "step3-photos-documents-recording.mp4",
          videoWidth: 720,
          videoHeight: 1600,
          videoCropTop: 0.052,
          videoStartSec: 3.7,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.ceil((props.videoStartSec + video4GuideEnd) * FPS),
        })}
      />
    </>
  );
};

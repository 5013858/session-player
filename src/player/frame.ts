import { Record } from "@waynecz/ui-recorder/dist/models/observers";
import Player from "player";

export interface Frame {
  0: number
  1: number
  __st__?: number
}

export type Frames = Array<Frame>;

class FrameWorker {
  public createFrames(records: Record[]): Frames {
    console.time("[Frame worker]");
    const frames: Frames = [];
    const timeline = records.map(r => r.t);
    const interval = Player.interval;

    // start, end record index of this frame
    let s: number = 0;
    let e: number = 0;
    let thisFrameStartTime: number = timeline[0];

    timeline.forEach((time, index) => {
      if (time - thisFrameStartTime < interval) {
        e = index;
      } else if (time - thisFrameStartTime >= interval) {
        const thisFrame: Frame = [s, e];
        thisFrame.__st__ = thisFrameStartTime;

        frames.push(thisFrame);
        s = e = index;
        thisFrameStartTime += interval;
      }
    });

    console.timeEnd("[Frame worker]");
    console.log("​FrameWorker -> frames", frames);
    return frames;
  }
}

export default new FrameWorker();
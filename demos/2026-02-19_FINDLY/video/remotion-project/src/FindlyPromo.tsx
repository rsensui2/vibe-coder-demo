import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { Scene1Problem } from './Scene1_Problem';
import { Scene2Solution } from './Scene2_Solution';
import { Scene3Feature } from './Scene3_Feature';
import { Scene4EndCard } from './Scene4_EndCard';

export const FindlyPromo: React.FC = () => {
  const { fps } = useVideoConfig();

  // Scene timing:
  // Scene 1: 0-8s   (0-240 frames)
  // Scene 2: 8-18s  (240-540 frames)
  // Scene 3: 18-27s (540-810 frames)
  // Scene 4: 27-30s (810-900 frames)

  return (
    <AbsoluteFill>
      {/* Scene 1: Problem - 0 to 8 seconds */}
      <Sequence from={0} durationInFrames={8 * fps} premountFor={fps}>
        <AbsoluteFill>
          <Scene1Problem />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 2: Solution - 8 to 18 seconds */}
      <Sequence from={8 * fps} durationInFrames={10 * fps} premountFor={fps}>
        <AbsoluteFill>
          <Scene2Solution />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 3: Feature - 18 to 27 seconds */}
      <Sequence from={18 * fps} durationInFrames={9 * fps} premountFor={fps}>
        <AbsoluteFill>
          <Scene3Feature />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 4: End Card - 27 to 30 seconds */}
      <Sequence from={27 * fps} durationInFrames={3 * fps} premountFor={fps}>
        <AbsoluteFill>
          <Scene4EndCard />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

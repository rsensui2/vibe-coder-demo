import React from 'react';
import { Composition } from 'remotion';
import { FindlyPromo } from './FindlyPromo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FindlyPromo"
        component={FindlyPromo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};

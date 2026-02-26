import React from 'react';
import { Composition } from 'remotion';
import { TaxPilotPromo } from './TaxPilotPromo';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TaxPilotPromo"
      component={TaxPilotPromo}
      durationInFrames={900}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

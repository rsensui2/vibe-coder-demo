import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from 'remotion';

const FONT_FAMILY = "'Noto Sans CJK JP', 'Noto Sans JP', sans-serif";
const NAVY = '#1A3A5C';
const ORANGE = '#FF6B2B';

const coverSrc = staticFile('slides/cover.png');
const slide1Src = staticFile('slides/slide_01.png');
const slide2Src = staticFile('slides/slide_02.png');
const slide3Src = staticFile('slides/slide_03.png');

// Scene 1: Cover (0-5s = frames 0-149)
const CoverScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleOpacity = interpolate(frame, [30, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const titleScale = spring({frame: frame - 30, fps, config: {damping: 15, stiffness: 80}});

  return (
    <AbsoluteFill>
      <Img src={coverSrc} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
        }}
      >
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 80,
            fontWeight: 'bold',
            color: 'white',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            textAlign: 'center',
            padding: '0 100px',
          }}
        >
          Pre-Onboarding Mission
        </div>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 36,
            color: '#FFD4B8',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            marginTop: 30,
            textAlign: 'center',
          }}
        >
          内定〜入社の空白期間を、ミッション発見の旅に。
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Slide scene with crossfade and text overlay
const SlideScene = ({src, message, durationFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Fade in first 15 frames, fade out last 15 frames
  const opacity = interpolate(
    frame,
    [0, 15, durationFrames - 15, durationFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const textOpacity = interpolate(frame, [15, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const textScale = spring({frame: frame - 15, fps, config: {damping: 15, stiffness: 80}});

  return (
    <AbsoluteFill style={{opacity}}>
      <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: 120,
        }}
      >
        <div
          style={{
            opacity: textOpacity,
            transform: `scale(${Math.max(0, textScale)})`,
            fontFamily: FONT_FAMILY,
            fontSize: 48,
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: 'rgba(26, 58, 92, 0.85)',
            padding: '20px 60px',
            borderRadius: 12,
            borderLeft: `6px solid ${ORANGE}`,
            textAlign: 'center',
            maxWidth: '80%',
          }}
        >
          {message}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 5: CTA (20-25s = frames 600-749)
const CTAScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const textOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const textScale = spring({frame, fps, config: {damping: 12, stiffness: 60}});

  return (
    <AbsoluteFill style={{backgroundColor: NAVY}}>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            opacity: textOpacity,
            transform: `scale(${textScale})`,
            fontFamily: FONT_FAMILY,
            fontSize: 64,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          入社前に、ミッションを見つけよう
        </div>
        <div
          style={{
            opacity: interpolate(frame, [30, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            fontFamily: FONT_FAMILY,
            fontSize: 32,
            color: ORANGE,
            marginTop: 40,
          }}
        >
          Pre-Onboarding Mission
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const PromoVideo = () => {
  const FPS = 30;
  return (
    <AbsoluteFill style={{backgroundColor: '#FFFFFF'}}>
      {/* Scene 1: Cover 0-5s (150 frames) */}
      <Sequence from={0} durationInFrames={150}>
        <CoverScene />
      </Sequence>

      {/* Scene 2: Slide 1, 5-10s (150 frames) - overlapping by 15 frames for crossfade */}
      <Sequence from={135} durationInFrames={165}>
        <SlideScene
          src={slide1Src}
          message="AI対話であなただけのミッションを発見"
          durationFrames={165}
        />
      </Sequence>

      {/* Scene 3: Slide 2, ~10-15s */}
      <Sequence from={285} durationInFrames={165}>
        <SlideScene
          src={slide2Src}
          message="入社意欲をMAXにしてDay1を迎える"
          durationFrames={165}
        />
      </Sequence>

      {/* Scene 4: Slide 3, ~15-20s */}
      <Sequence from={435} durationInFrames={165}>
        <SlideScene
          src={slide3Src}
          message="早期離職を防ぎエンゲージメントを向上"
          durationFrames={165}
        />
      </Sequence>

      {/* Scene 5: CTA 20-25s */}
      <Sequence from={600} durationInFrames={150}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};

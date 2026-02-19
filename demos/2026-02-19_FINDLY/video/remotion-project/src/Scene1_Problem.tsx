import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';

const MAIN_COLOR = '#1A6FDB';
const ACCENT = '#00C9A7';
const DARK = '#0A0F1E';

export const Scene1Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Duration: 8 seconds = 240 frames
  const totalFrames = 8 * fps;

  // Title fade in: 0-1s
  const titleOpacity = interpolate(frame, [0, fps * 0.8], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  // Counter animates from 0 to 4,000,000 over 1s to 7s
  const countProgress = interpolate(
    frame,
    [fps * 0.5, fps * 6.5],
    [0, 4000000],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.exp),
    }
  );

  const count = Math.floor(countProgress);

  // Format number with commas
  const formatNumber = (n: number): string => {
    return n.toLocaleString('ja-JP');
  };

  // Counter glow pulse effect
  const glowPulse = interpolate(
    frame,
    [fps * 0.5, fps * 6.5],
    [0.3, 1.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Subtitle fade in at 5s
  const subtitleOpacity = interpolate(frame, [fps * 5, fps * 6], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  // Particles/ripple effect: small dots scattered
  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    const radius = 280 + Math.sin(frame * 0.05 + i) * 20;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const opacity = interpolate(
      frame,
      [fps * 1, fps * 2],
      [0, 0.3],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    ) * (0.5 + 0.5 * Math.sin(frame * 0.1 + i * 0.5));
    return { x, y, opacity };
  });

  // Counter text glow intensity
  const glowStrength = 20 + glowPulse * 40;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: DARK,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background grid lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,201,167,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,201,167,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          opacity: interpolate(frame, [0, fps * 1], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      />

      {/* Circular ripple rings behind counter */}
      {[1, 2, 3].map((ring) => {
        const ringProgress = interpolate(
          frame,
          [fps * ring * 0.8, fps * (ring * 0.8 + 3)],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        return (
          <div
            key={ring}
            style={{
              position: 'absolute',
              width: `${200 + ring * 150}px`,
              height: `${200 + ring * 150}px`,
              borderRadius: '50%',
              border: `1px solid ${ACCENT}`,
              opacity: ringProgress * (1 - ringProgress) * 0.5,
              transform: `scale(${0.5 + ringProgress * 0.8})`,
            }}
          />
        );
      })}

      {/* Top label */}
      <div
        style={{
          opacity: titleOpacity,
          color: 'rgba(255,255,255,0.5)',
          fontSize: 28,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          marginBottom: 40,
          fontFamily: 'sans-serif',
        }}
      >
        LOST & FOUND IN JAPAN
      </div>

      {/* Main counter */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            color: ACCENT,
            fontSize: 140,
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            lineHeight: 1,
            textShadow: `0 0 ${glowStrength}px ${ACCENT}, 0 0 ${glowStrength * 2}px ${ACCENT}40`,
            letterSpacing: '-0.02em',
          }}
        >
          {formatNumber(count)}
        </div>
        <div
          style={{
            color: ACCENT,
            fontSize: 48,
            fontWeight: '300',
            fontFamily: 'sans-serif',
            letterSpacing: '0.1em',
            marginTop: 8,
            textShadow: `0 0 20px ${ACCENT}80`,
          }}
        >
          件
        </div>
      </div>

      {/* Bottom label */}
      <div
        style={{
          opacity: titleOpacity,
          color: 'rgba(255,255,255,0.8)',
          fontSize: 36,
          marginTop: 48,
          fontFamily: 'sans-serif',
          letterSpacing: '0.1em',
        }}
      >
        年間の落とし物
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: subtitleOpacity,
          color: 'rgba(255,255,255,0.45)',
          fontSize: 22,
          marginTop: 24,
          fontFamily: 'sans-serif',
          letterSpacing: '0.08em',
        }}
      >
        そのうち8割は持ち主に戻らない
      </div>

      {/* Scatter particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {particles.map((p, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `calc(50% + ${p.x}px)`,
              top: `calc(50% + ${p.y}px)`,
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: ACCENT,
              opacity: p.opacity,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

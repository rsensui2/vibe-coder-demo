import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';

const MAIN_COLOR = '#1A6FDB';
const ACCENT = '#00C9A7';
const DARK = '#0A0F1E';

export const Scene4EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo scale in: 0-0.8s
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
    durationInFrames: fps * 1,
  });
  const logoOpacity = interpolate(frame, [0, fps * 0.6], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Tagline: 0.8s-1.5s
  const taglineY = interpolate(frame, [fps * 0.8, fps * 1.6], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const taglineOpacity = interpolate(frame, [fps * 0.8, fps * 1.6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // URL: 1.5s-2s
  const urlOpacity = interpolate(frame, [fps * 1.5, fps * 2.2], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Glow pulse
  const glowPulse = 0.6 + 0.4 * Math.sin(frame * 0.12);

  // Background radial glow
  const bgGlowOpacity = interpolate(frame, [0, fps * 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Particle ring
  const numParticles = 24;
  const particleRadius = 300;

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
      {/* Radial background glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, ${MAIN_COLOR}20 0%, ${ACCENT}08 30%, transparent 70%)`,
          opacity: bgGlowOpacity,
        }}
      />

      {/* Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,201,167,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,201,167,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Particle ring */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: numParticles }, (_, i) => {
          const angle = (i / numParticles) * Math.PI * 2;
          const x = Math.cos(angle + frame * 0.008) * particleRadius;
          const y = Math.sin(angle + frame * 0.008) * particleRadius;
          const opacity = logoOpacity * (0.3 + 0.3 * Math.sin(frame * 0.1 + i));
          const size = 3 + 2 * Math.sin(frame * 0.05 + i * 0.5);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: i % 3 === 0 ? ACCENT : MAIN_COLOR,
                opacity,
                transform: 'translate(-50%, -50%)',
                boxShadow: `0 0 6px ${i % 3 === 0 ? ACCENT : MAIN_COLOR}`,
              }}
            />
          );
        })}
      </div>

      {/* Logo + Name */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 2,
          marginBottom: 32,
        }}
      >
        {/* Logo icon */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 28,
            background: `linear-gradient(135deg, ${MAIN_COLOR}, ${ACCENT})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 52,
            marginBottom: 24,
            boxShadow: `0 0 60px ${ACCENT}${Math.floor(glowPulse * 120).toString(16).padStart(2, '0')}`,
          }}
        >
          📡
        </div>

        {/* FINDLY name */}
        <div
          style={{
            fontFamily: 'sans-serif',
            fontSize: 96,
            fontWeight: 900,
            letterSpacing: '0.15em',
            display: 'flex',
          }}
        >
          {'FINDLY'.split('').map((char, i) => (
            <span
              key={i}
              style={{
                background: i < 3
                  ? `linear-gradient(180deg, #FFFFFF, rgba(255,255,255,0.8))`
                  : `linear-gradient(180deg, ${ACCENT}, ${ACCENT}CC)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block',
                textShadow: 'none',
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* Divider line */}
      <div
        style={{
          opacity: taglineOpacity,
          width: 200,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
          marginBottom: 32,
          zIndex: 2,
        }}
      />

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          zIndex: 2,
          textAlign: 'center',
          marginBottom: 32,
        }}
      >
        <div
          style={{
            color: '#FFFFFF',
            fontSize: 40,
            fontFamily: 'sans-serif',
            fontWeight: '300',
            letterSpacing: '0.12em',
            lineHeight: 1.5,
          }}
        >
          見つかる前提で、
          <span
            style={{
              color: ACCENT,
              fontWeight: 'bold',
              textShadow: `0 0 ${20 * glowPulse}px ${ACCENT}`,
            }}
          >
            生きる
          </span>
          。
        </div>
      </div>

      {/* URL */}
      <div
        style={{
          opacity: urlOpacity,
          color: 'rgba(255,255,255,0.45)',
          fontSize: 20,
          fontFamily: 'monospace',
          letterSpacing: '0.2em',
          zIndex: 2,
        }}
      >
        findly.jp
      </div>

      {/* Bottom accent */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${MAIN_COLOR}, ${ACCENT}, ${MAIN_COLOR})`,
          opacity: urlOpacity,
        }}
      />
    </div>
  );
};

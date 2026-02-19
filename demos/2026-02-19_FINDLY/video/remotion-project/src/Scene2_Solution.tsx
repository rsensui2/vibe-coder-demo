import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';

const MAIN_COLOR = '#1A6FDB';
const ACCENT = '#00C9A7';
const DARK = '#0A0F1E';

const BleRipple: React.FC<{ frame: number; fps: number; delay: number }> = ({ frame, fps, delay }) => {
  const localFrame = Math.max(0, frame - delay);
  const cycleFrames = fps * 2.5;
  const cycleFrame = localFrame % cycleFrames;

  const scale = interpolate(cycleFrame, [0, cycleFrames], [0.2, 2.5], {
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(cycleFrame, [0, cycleFrames * 0.3, cycleFrames], [0.8, 0.5, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: '50%',
        border: `2px solid ${ACCENT}`,
        transform: `scale(${scale})`,
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
};

const FlowArrow: React.FC<{ progress: number; color: string }> = ({ progress, color }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        opacity: progress,
        transform: `scaleX(${progress})`,
        transformOrigin: 'left center',
      }}
    >
      <div
        style={{
          width: 80,
          height: 2,
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: `12px solid ${color}`,
          borderTop: '7px solid transparent',
          borderBottom: '7px solid transparent',
          filter: `drop-shadow(0 0 4px ${color})`,
        }}
      />
    </div>
  );
};

const FlowIcon: React.FC<{
  icon: string;
  label: string;
  progress: number;
  color: string;
  size?: number;
}> = ({ icon, label, progress, color, size = 64 }) => {
  const scale = spring({
    frame: Math.round(progress * 20),
    fps: 20,
    config: { damping: 12, stiffness: 200 },
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        transform: `scale(${scale * progress})`,
        opacity: progress,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 16,
          backgroundColor: `${color}20`,
          border: `2px solid ${color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.45,
          boxShadow: `0 0 20px ${color}40`,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: 14,
          fontFamily: 'sans-serif',
          letterSpacing: '0.05em',
          textAlign: 'center',
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const Scene2Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo appearance: 0-1.5s
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
    durationInFrames: fps * 1.5,
  });
  const logoOpacity = interpolate(frame, [0, fps * 0.8], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Tagline: 1.5s-3s
  const taglineOpacity = interpolate(frame, [fps * 1.5, fps * 2.5], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  // Flow diagram: starts at 2.5s, each item appears 0.6s apart
  const flowStart = fps * 2.5;
  const flowSpacing = fps * 0.7;

  const item1Progress = interpolate(frame, [flowStart, flowStart + fps * 0.5], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const arrow1Progress = interpolate(frame, [flowStart + flowSpacing, flowStart + flowSpacing + fps * 0.4], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const item2Progress = interpolate(frame, [flowStart + flowSpacing * 1.5, flowStart + flowSpacing * 1.5 + fps * 0.5], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const arrow2Progress = interpolate(frame, [flowStart + flowSpacing * 2.5, flowStart + flowSpacing * 2.5 + fps * 0.4], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const item3Progress = interpolate(frame, [flowStart + flowSpacing * 3, flowStart + flowSpacing * 3 + fps * 0.5], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const arrow3Progress = interpolate(frame, [flowStart + flowSpacing * 4, flowStart + flowSpacing * 4 + fps * 0.4], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const item4Progress = interpolate(frame, [flowStart + flowSpacing * 4.5, flowStart + flowSpacing * 4.5 + fps * 0.5], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Background gradient shift
  const gradientAngle = interpolate(frame, [0, fps * 10], [135, 180], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(${gradientAngle}deg, ${DARK} 0%, #0D1B35 50%, ${DARK} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(26,111,219,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,111,219,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* BLE ripple rings around logo */}
      <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <BleRipple frame={frame} fps={fps} delay={fps * 1} />
        <BleRipple frame={frame} fps={fps} delay={fps * 1.8} />
        <BleRipple frame={frame} fps={fps} delay={fps * 2.6} />
      </div>

      {/* FINDLY Logo */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 20,
          zIndex: 2,
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: `linear-gradient(135deg, ${MAIN_COLOR}, ${ACCENT})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
            marginBottom: 16,
            boxShadow: `0 0 40px ${ACCENT}60`,
          }}
        >
          📡
        </div>
        <div
          style={{
            fontFamily: 'sans-serif',
            fontSize: 80,
            fontWeight: 900,
            letterSpacing: '0.12em',
            background: `linear-gradient(90deg, #FFFFFF, ${ACCENT})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
          }}
        >
          FINDLY
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          color: 'rgba(255,255,255,0.9)',
          fontSize: 32,
          fontFamily: 'sans-serif',
          letterSpacing: '0.05em',
          marginBottom: 64,
          textAlign: 'center',
          zIndex: 2,
        }}
      >
        電車に忘れたら、
        <span style={{ color: ACCENT, fontWeight: 'bold' }}>23秒</span>
        で通知
      </div>

      {/* Flow diagram */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
          zIndex: 2,
          padding: '24px 48px',
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderRadius: 24,
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <FlowIcon icon="🏷️" label="BLEタグ" progress={item1Progress} color={ACCENT} />
        <FlowArrow progress={arrow1Progress} color={ACCENT} />
        <FlowIcon icon="📶" label="電波検知" progress={item2Progress} color={MAIN_COLOR} />
        <FlowArrow progress={arrow2Progress} color={MAIN_COLOR} />
        <FlowIcon icon="🚉" label="鉄道センサー" progress={item3Progress} color={ACCENT} />
        <FlowArrow progress={arrow3Progress} color={ACCENT} />
        <FlowIcon icon="📱" label="スマホ通知" progress={item4Progress} color={MAIN_COLOR} />
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${ACCENT}, ${MAIN_COLOR}, transparent)`,
          opacity: taglineOpacity,
        }}
      />
    </div>
  );
};

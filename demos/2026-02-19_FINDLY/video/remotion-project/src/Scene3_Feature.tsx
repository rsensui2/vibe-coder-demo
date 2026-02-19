import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';

const MAIN_COLOR = '#1A6FDB';
const ACCENT = '#00C9A7';
const DARK = '#0A0F1E';

const MapPin: React.FC<{ x: number; y: number; active: boolean; frame: number; fps: number }> = ({
  x, y, active, frame, fps,
}) => {
  const pulse = interpolate(
    (frame * 3) % (fps * 2),
    [0, fps * 0.5, fps],
    [1, 1.4, 1],
    { extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {active && (
        <div
          style={{
            position: 'absolute',
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: `${ACCENT}30`,
            top: 0,
            left: '50%',
            transform: `translate(-50%, 0) scale(${pulse})`,
          }}
        />
      )}
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50% 50% 50% 0',
          backgroundColor: active ? ACCENT : `rgba(255,255,255,0.3)`,
          transform: 'rotate(-45deg)',
          boxShadow: active ? `0 0 16px ${ACCENT}` : 'none',
        }}
      />
      <div
        style={{
          width: 2,
          height: 12,
          backgroundColor: active ? ACCENT : `rgba(255,255,255,0.3)`,
          marginTop: -2,
        }}
      />
    </div>
  );
};

export const Scene3Feature: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone slide in from bottom: 0-1s
  const phoneY = interpolate(frame, [0, fps * 1], [300, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const phoneOpacity = interpolate(frame, [0, fps * 0.8], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Map appears: 1-1.8s
  const mapOpacity = interpolate(frame, [fps * 1, fps * 1.8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  // Notification banner pops in: 2s-2.5s
  const bannerScale = spring({
    frame: Math.max(0, frame - fps * 2),
    fps,
    config: { damping: 12, stiffness: 200 },
    durationInFrames: fps * 0.8,
  });
  const bannerOpacity = interpolate(frame, [fps * 2, fps * 2.4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Text slides in: 2.5s
  const textY = interpolate(frame, [fps * 2.5, fps * 3.5], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const textOpacity = interpolate(frame, [fps * 2.5, fps * 3.5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pin glow pulsing after 2s
  const pinActive = frame > fps * 2;

  // Map grid lines
  const mapLines = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(160deg, ${DARK} 0%, #071428 100%)`,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        gap: 80,
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,201,167,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,111,219,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Left side: Phone mockup */}
      <div
        style={{
          opacity: phoneOpacity,
          transform: `translateY(${phoneY}px)`,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Phone frame */}
        <div
          style={{
            width: 260,
            height: 520,
            borderRadius: 40,
            backgroundColor: '#1A1A2E',
            border: '3px solid rgba(255,255,255,0.15)',
            padding: 12,
            boxShadow: `0 0 60px rgba(0,0,0,0.8), 0 0 30px ${MAIN_COLOR}30`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Status bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '4px 8px',
              color: 'rgba(255,255,255,0.5)',
              fontSize: 11,
              fontFamily: 'monospace',
              marginBottom: 8,
            }}
          >
            <span>9:41</span>
            <span>▌▌▌</span>
          </div>

          {/* Notch */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 80,
              height: 20,
              backgroundColor: '#0A0F1E',
              borderRadius: '0 0 12px 12px',
            }}
          />

          {/* Map area */}
          <div
            style={{
              opacity: mapOpacity,
              width: '100%',
              height: 240,
              backgroundColor: '#0E2040',
              borderRadius: 16,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Map grid */}
            {mapLines.map((i) => (
              <React.Fragment key={i}>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: `${(i + 1) * 15}%`,
                    height: 1,
                    backgroundColor: 'rgba(255,255,255,0.06)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: `${(i + 1) * 15}%`,
                    width: 1,
                    backgroundColor: 'rgba(255,255,255,0.06)',
                  }}
                />
              </React.Fragment>
            ))}

            {/* "Roads" */}
            <div
              style={{
                position: 'absolute',
                left: '20%',
                right: '20%',
                top: '45%',
                height: 3,
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderRadius: 2,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '55%',
                top: '10%',
                bottom: '10%',
                width: 3,
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderRadius: 2,
              }}
            />

            {/* Map pins */}
            <MapPin x={140} y={120} active={pinActive} frame={frame} fps={fps} />
            <MapPin x={80} y={180} active={false} frame={frame} fps={fps} />
            <MapPin x={200} y={160} active={false} frame={frame} fps={fps} />

            {/* Station label */}
            {pinActive && (
              <div
                style={{
                  position: 'absolute',
                  top: 60,
                  left: 80,
                  backgroundColor: `${ACCENT}20`,
                  border: `1px solid ${ACCENT}60`,
                  borderRadius: 6,
                  padding: '3px 8px',
                  color: ACCENT,
                  fontSize: 9,
                  fontFamily: 'sans-serif',
                  whiteSpace: 'nowrap',
                  opacity: interpolate(frame, [fps * 2, fps * 2.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                }}
              >
                新宿駅遺失物センター
              </div>
            )}
          </div>

          {/* Notification banner */}
          <div
            style={{
              marginTop: 12,
              opacity: bannerOpacity,
              transform: `scale(${bannerScale})`,
              backgroundColor: 'rgba(0,201,167,0.12)',
              border: `1px solid ${ACCENT}60`,
              borderRadius: 14,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
            }}
          >
            <div style={{ fontSize: 20 }}>📍</div>
            <div>
              <div
                style={{
                  color: ACCENT,
                  fontSize: 11,
                  fontFamily: 'sans-serif',
                  fontWeight: 'bold',
                  letterSpacing: '0.05em',
                }}
              >
                FINDLY 検知アラート
              </div>
              <div
                style={{
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: 11,
                  fontFamily: 'sans-serif',
                  marginTop: 2,
                  lineHeight: 1.4,
                }}
              >
                新宿駅で検知されました。
              </div>
              <div
                style={{
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: 9,
                  fontFamily: 'monospace',
                  marginTop: 4,
                }}
              >
                23秒前 • 遺失物センター到着予定
              </div>
            </div>
          </div>

          {/* Bottom info */}
          <div
            style={{
              marginTop: 12,
              padding: '8px 12px',
              backgroundColor: 'rgba(26,111,219,0.15)',
              borderRadius: 12,
              border: '1px solid rgba(26,111,219,0.3)',
            }}
          >
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, fontFamily: 'sans-serif' }}>
              追跡中のアイテム
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontFamily: 'sans-serif', marginTop: 2 }}>
              🎒 リュックサック - #F9A2
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Text */}
      <div
        style={{
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          maxWidth: 480,
          zIndex: 2,
        }}
      >
        <div
          style={{
            color: ACCENT,
            fontSize: 14,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: 20,
            fontFamily: 'sans-serif',
          }}
        >
          REAL-TIME TRACKING
        </div>
        <div
          style={{
            color: '#FFFFFF',
            fontSize: 44,
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            lineHeight: 1.3,
            marginBottom: 24,
          }}
        >
          鉄道インフラと
          <br />
          <span style={{ color: ACCENT }}>直結</span>。
        </div>
        <div
          style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: 22,
            fontFamily: 'sans-serif',
            lineHeight: 1.7,
            marginBottom: 32,
          }}
        >
          あなたの落とし物を
          <br />
          自動で追跡。
        </div>

        {/* Feature bullets */}
        {[
          { icon: '⚡', text: '23秒で検知・通知' },
          { icon: '🗾', text: '全国主要鉄道対応' },
          { icon: '🔒', text: 'セキュア暗号化通信' },
        ].map((item, i) => {
          const itemOpacity = interpolate(
            frame,
            [fps * (3 + i * 0.4), fps * (3.5 + i * 0.4)],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          const itemX = interpolate(
            frame,
            [fps * (3 + i * 0.4), fps * (3.5 + i * 0.4)],
            [30, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                opacity: itemOpacity,
                transform: `translateX(${itemX}px)`,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: `${ACCENT}20`,
                  border: `1px solid ${ACCENT}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                }}
              >
                {item.icon}
              </div>
              <span
                style={{
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: 18,
                  fontFamily: 'sans-serif',
                }}
              >
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

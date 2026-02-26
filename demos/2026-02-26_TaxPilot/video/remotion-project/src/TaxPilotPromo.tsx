import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Sequence,
  Easing,
} from 'remotion';

// ============================================================
// COLORS
// ============================================================
const TEAL = '#00C896';
const BG = '#0A1628';
const WHITE = '#FFFFFF';
const LIGHT_GRAY = '#B0BEC5';
const CARD_BG = 'rgba(255,255,255,0.07)';
const CARD_BORDER = 'rgba(0,200,150,0.25)';

// ============================================================
// SCENE 1 (0–5s): Title fade-in with glow
// ============================================================
const SceneTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps * 1.5], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  const scale = interpolate(frame, [0, fps * 1.5], [0.85, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  const glowPulse = interpolate(
    frame % (fps * 2),
    [0, fps, fps * 2],
    [0.6, 1.0, 0.6],
    { extrapolateRight: 'clamp' }
  );

  const tagOpacity = interpolate(frame, [fps * 2, fps * 3.5], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Glow background */}
      <div
        style={{
          position: 'absolute',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(0,200,150,${0.12 * glowPulse}) 0%, transparent 70%)`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
      {/* Logo / product name */}
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: 72,
            fontWeight: 900,
            color: TEAL,
            letterSpacing: 4,
            textShadow: `0 0 40px rgba(0,200,150,0.6)`,
            marginBottom: 8,
          }}
        >
          TaxPilot
        </div>
        <div
          style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: 42,
            fontWeight: 700,
            color: WHITE,
            marginBottom: 24,
          }}
        >
          確定申告、もう怖くない
        </div>
      </div>
      {/* Tagline */}
      <div
        style={{
          opacity: tagOpacity,
          fontFamily: 'Arial, sans-serif',
          fontSize: 26,
          color: TEAL,
          letterSpacing: 6,
          marginTop: 12,
        }}
      >
        撮って、連携して、おわり。
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// SCENE 2 (5–15s): 3-step animation
// ============================================================
interface StepProps {
  icon: string;
  label: string;
  sub: string;
  delayFrames: number;
  accent?: boolean;
}

const Step: React.FC<StepProps> = ({ icon, label, sub, delayFrames, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delayFrames,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(entrance, [0, 1], [60, 0], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 280,
        padding: '36px 28px',
        borderRadius: 20,
        background: CARD_BG,
        border: `1.5px solid ${accent ? TEAL : CARD_BORDER}`,
        boxShadow: accent ? `0 0 30px rgba(0,200,150,0.25)` : 'none',
      }}
    >
      <div style={{ fontSize: 64, marginBottom: 16 }}>{icon}</div>
      <div
        style={{
          fontFamily: 'Arial Black, Arial, sans-serif',
          fontSize: 24,
          fontWeight: 800,
          color: WHITE,
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: 18,
          color: LIGHT_GRAY,
          textAlign: 'center',
          lineHeight: 1.5,
        }}
      >
        {sub}
      </div>
    </div>
  );
};

const ArrowRight: React.FC<{ delayFrames: number }> = ({ delayFrames }) => {
  const frame = useCurrentFrame();
  const entrance = spring({
    frame: frame - delayFrames,
    fps: 30,
    config: { damping: 15, stiffness: 120 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{ opacity, fontSize: 40, color: TEAL, margin: '0 16px', paddingBottom: 20 }}>
      →
    </div>
  );
};

const SceneSteps: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 80px',
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          fontFamily: 'Arial, sans-serif',
          fontSize: 34,
          fontWeight: 700,
          color: TEAL,
          marginBottom: 60,
          letterSpacing: 2,
        }}
      >
        たった3ステップで完結
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        <Step
          icon="📷"
          label="レシート撮影"
          sub="カメラで撮るだけ。AIが自動で読み取る"
          delayFrames={0}
        />
        <ArrowRight delayFrames={10} />
        <Step
          icon="🔗"
          label="口座連携"
          sub="銀行・クレカを一括連携。明細を自動取得"
          delayFrames={20}
          accent
        />
        <ArrowRight delayFrames={30} />
        <Step
          icon="✅"
          label="申告完了"
          sub="AIが書類を生成・e-Taxへ自動送信"
          delayFrames={40}
        />
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// SCENE 3 (15–25s): Feature cards + pricing
// ============================================================
interface FeatureCardProps {
  icon: string;
  title: string;
  desc: string;
  delayFrames: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, desc, delayFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delayFrames,
    fps,
    config: { damping: 18, stiffness: 130 },
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1], { extrapolateRight: 'clamp' });
  const translateX = interpolate(entrance, [0, 1], [80, 0], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 20,
        padding: '24px 28px',
        borderRadius: 16,
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        width: '100%',
      }}
    >
      <div style={{ fontSize: 40, minWidth: 52 }}>{icon}</div>
      <div>
        <div
          style={{
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: 20,
            fontWeight: 800,
            color: WHITE,
            marginBottom: 6,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: 16,
            color: LIGHT_GRAY,
            lineHeight: 1.5,
          }}
        >
          {desc}
        </div>
      </div>
    </div>
  );
};

const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const priceEntrance = spring({
    frame: frame - fps * 2,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const priceOpacity = interpolate(priceEntrance, [0, 1], [0, 1], { extrapolateRight: 'clamp' });
  const priceScale = interpolate(priceEntrance, [0, 1], [0.7, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 100px',
        gap: 60,
      }}
    >
      {/* Left: Feature cards */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div
          style={{
            opacity: titleOpacity,
            fontFamily: 'Arial, sans-serif',
            fontSize: 28,
            fontWeight: 700,
            color: TEAL,
            marginBottom: 16,
            letterSpacing: 2,
          }}
        >
          主な機能
        </div>
        <FeatureCard
          icon="🤖"
          title="AI自動仕訳"
          desc="レシート・領収書をOCRで読み取り、勘定科目を自動分類"
          delayFrames={0}
        />
        <FeatureCard
          icon="🏦"
          title="銀行・カード連携"
          desc="300以上の金融機関に対応。明細を自動で取り込み"
          delayFrames={12}
        />
        <FeatureCard
          icon="📊"
          title="リアルタイム損益"
          desc="収支・経費をリアルタイムで可視化。いつでも状況を把握"
          delayFrames={24}
        />
        <FeatureCard
          icon="📤"
          title="e-Tax自動送信"
          desc="確定申告書を自動生成し、e-Taxへ直接送信"
          delayFrames={36}
        />
      </div>

      {/* Right: Pricing */}
      <div
        style={{
          opacity: priceOpacity,
          transform: `scale(${priceScale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 56px',
          borderRadius: 24,
          background: `linear-gradient(135deg, rgba(0,200,150,0.15) 0%, rgba(10,22,40,0.9) 100%)`,
          border: `2px solid ${TEAL}`,
          boxShadow: `0 0 60px rgba(0,200,150,0.3)`,
          minWidth: 300,
        }}
      >
        <div
          style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: 20,
            color: TEAL,
            letterSpacing: 4,
            marginBottom: 16,
          }}
        >
          PRICE
        </div>
        <div
          style={{
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: 70,
            fontWeight: 900,
            color: WHITE,
            lineHeight: 1,
          }}
        >
          ¥980
        </div>
        <div
          style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: 24,
            color: LIGHT_GRAY,
            marginTop: 8,
            marginBottom: 24,
          }}
        >
          /月〜
        </div>
        <div
          style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: 16,
            color: TEAL,
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          14日間無料トライアル
          <br />
          クレジットカード不要
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// SCENE 4 (25–30s): End card
// ============================================================
const SceneEndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const logoEntrance = spring({
    frame: frame - fps * 0.3,
    fps,
    config: { damping: 200 },
  });
  const logoOpacity = interpolate(logoEntrance, [0, 1], [0, 1], { extrapolateRight: 'clamp' });
  const logoY = interpolate(logoEntrance, [0, 1], [30, 0], { extrapolateRight: 'clamp' });

  const taglineEntrance = spring({
    frame: frame - fps * 0.8,
    fps,
    config: { damping: 200 },
  });
  const taglineOpacity = interpolate(taglineEntrance, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const ctaEntrance = spring({
    frame: frame - fps * 1.4,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const ctaOpacity = interpolate(ctaEntrance, [0, 1], [0, 1], { extrapolateRight: 'clamp' });
  const ctaScale = interpolate(ctaEntrance, [0, 1], [0.8, 1], { extrapolateRight: 'clamp' });

  const glowPulse = interpolate(
    frame % (fps * 2),
    [0, fps, fps * 2],
    [0.5, 1.0, 0.5],
    {}
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        opacity: bgOpacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(0,200,150,${0.1 * glowPulse}) 0%, transparent 70%)`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Logo */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `translateY(${logoY}px)`,
          textAlign: 'center',
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: 96,
            fontWeight: 900,
            color: TEAL,
            letterSpacing: 6,
            textShadow: `0 0 60px rgba(0,200,150,0.5)`,
          }}
        >
          TaxPilot
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          fontFamily: 'Arial, sans-serif',
          fontSize: 30,
          color: WHITE,
          letterSpacing: 8,
          marginBottom: 60,
        }}
      >
        撮って、連携して、おわり。
      </div>

      {/* CTA Button */}
      <div
        style={{
          opacity: ctaOpacity,
          transform: `scale(${ctaScale})`,
          padding: '24px 60px',
          borderRadius: 60,
          background: TEAL,
          boxShadow: `0 0 40px rgba(0,200,150,0.5)`,
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: 28,
            fontWeight: 900,
            color: BG,
            letterSpacing: 2,
          }}
        >
          今すぐ無料で試す →
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// ROOT COMPOSITION
// ============================================================
export const TaxPilotPromo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* Scene 1: 0–5s (0–150 frames) */}
      <Sequence from={0} durationInFrames={fps * 5} premountFor={fps}>
        <SceneTitle />
      </Sequence>

      {/* Scene 2: 5–15s (150–450 frames) */}
      <Sequence from={fps * 5} durationInFrames={fps * 10} premountFor={fps}>
        <SceneSteps />
      </Sequence>

      {/* Scene 3: 15–25s (450–750 frames) */}
      <Sequence from={fps * 15} durationInFrames={fps * 10} premountFor={fps}>
        <SceneFeatures />
      </Sequence>

      {/* Scene 4: 25–30s (750–900 frames) */}
      <Sequence from={fps * 25} durationInFrames={fps * 5} premountFor={fps}>
        <SceneEndCard />
      </Sequence>
    </AbsoluteFill>
  );
};

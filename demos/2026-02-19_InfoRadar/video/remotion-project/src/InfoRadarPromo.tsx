import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";

// ─── Colors ───────────────────────────────────────────────────────────────────
const MAIN_BG = "#0A0E1A";
const ACCENT = "#00D4FF";
const TEXT_COLOR = "#F0F4FF";

// ─── Scene 1: 課題提起 (frame 0-150) ─────────────────────────────────────────
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // カウントアップ: 0 → 73
  const countProgress = interpolate(frame, [0, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const count = Math.round(countProgress * 73);

  // テキストフェードイン
  const textOpacity = interpolate(frame, [80, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // パルス波エフェクト
  const pulse1 = interpolate(frame % 60, [0, 60], [0.5, 1.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse2 = interpolate((frame + 20) % 60, [0, 60], [0.5, 1.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse3 = interpolate((frame + 40) % 60, [0, 60], [0.5, 1.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulseOpacity1 = interpolate(frame % 60, [0, 30, 60], [0.6, 0.1, 0.6]);
  const pulseOpacity2 = interpolate((frame + 20) % 60, [0, 30, 60], [0.6, 0.1, 0.6]);
  const pulseOpacity3 = interpolate((frame + 40) % 60, [0, 30, 60], [0.6, 0.1, 0.6]);

  const numberScale = spring({
    fps,
    frame: Math.min(frame, 90),
    config: { damping: 12, stiffness: 60 },
    from: 0.5,
    to: 1,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: MAIN_BG,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* パルス波リング */}
      {[pulse1, pulse2, pulse3].map((scale, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            border: `3px solid ${ACCENT}`,
            transform: `scale(${[pulseOpacity1, pulseOpacity2, pulseOpacity3][i] > 0.3 ? scale : 1})`,
            opacity: [pulseOpacity1, pulseOpacity2, pulseOpacity3][i],
          }}
        />
      ))}

      {/* 大きな数字 */}
      <div
        style={{
          transform: `scale(${numberScale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 280,
            fontWeight: 900,
            color: ACCENT,
            lineHeight: 1,
            fontFamily: "sans-serif",
            textShadow: `0 0 80px ${ACCENT}88, 0 0 160px ${ACCENT}44`,
            letterSpacing: "-10px",
          }}
        >
          {count}%
        </div>

        {/* サブテキスト */}
        <div
          style={{
            opacity: textOpacity,
            textAlign: "center",
            marginTop: 40,
          }}
        >
          <div
            style={{
              fontSize: 52,
              color: TEXT_COLOR,
              fontWeight: 700,
              fontFamily: "sans-serif",
              letterSpacing: "2px",
            }}
          >
            ビジネスパーソンが重要な情報を
          </div>
          <div
            style={{
              fontSize: 52,
              color: TEXT_COLOR,
              fontWeight: 700,
              fontFamily: "sans-serif",
              letterSpacing: "2px",
              marginTop: 12,
            }}
          >
            <span style={{ color: ACCENT }}>見落とす</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: 仕組み紹介 (frame 150-450) ──────────────────────────────────────
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = [
    { label: "一次情報源", icon: "🌐", delay: 0 },
    { label: "AIフィルタ", icon: "🤖", delay: 40 },
    { label: "あなたへ", icon: "📲", delay: 80 },
  ];

  // ロゴ登場
  const logoScale = spring({
    fps,
    frame: Math.max(0, frame - 160),
    config: { damping: 15, stiffness: 80 },
    from: 0,
    to: 1,
  });

  const logoOpacity = interpolate(frame, [155, 185], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: MAIN_BG,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      {/* InfoRadar ロゴ */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          marginBottom: 80,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            fontFamily: "sans-serif",
            color: TEXT_COLOR,
            letterSpacing: "4px",
          }}
        >
          📡{" "}
          <span style={{ color: ACCENT, textShadow: `0 0 40px ${ACCENT}` }}>
            InfoRadar
          </span>
        </div>
      </div>

      {/* フロー図 */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 0,
        }}
      >
        {steps.map((step, i) => {
          const stepProgress = spring({
            fps,
            frame: Math.max(0, frame - step.delay),
            config: { damping: 14, stiffness: 70 },
            from: 0,
            to: 1,
          });

          const arrowProgress = i < 2
            ? interpolate(frame, [step.delay + 30, step.delay + 60], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 1;

          return (
            <React.Fragment key={i}>
              {/* ステップボックス */}
              <div
                style={{
                  opacity: stepProgress,
                  transform: `scale(${stepProgress}) translateY(${(1 - stepProgress) * 30}px)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 20,
                  width: 280,
                }}
              >
                <div
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: 24,
                    backgroundColor: `${ACCENT}15`,
                    border: `2px solid ${ACCENT}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 64,
                    boxShadow: `0 0 30px ${ACCENT}44`,
                  }}
                >
                  {step.icon}
                </div>
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 700,
                    color: TEXT_COLOR,
                    fontFamily: "sans-serif",
                    textAlign: "center",
                  }}
                >
                  {step.label}
                </div>
              </div>

              {/* 矢印 */}
              {i < 2 && (
                <div
                  style={{
                    width: 120,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: arrowProgress,
                  }}
                >
                  <div
                    style={{
                      height: 4,
                      width: `${arrowProgress * 80}px`,
                      backgroundColor: ACCENT,
                      boxShadow: `0 0 12px ${ACCENT}`,
                      position: "relative",
                      transition: "width 0.1s",
                    }}
                  />
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: "16px solid transparent",
                      borderBottom: "16px solid transparent",
                      borderLeft: `24px solid ${ACCENT}`,
                      filter: `drop-shadow(0 0 8px ${ACCENT})`,
                      opacity: arrowProgress,
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* 説明テキスト */}
      <div
        style={{
          marginTop: 80,
          opacity: interpolate(frame, [200, 240], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontSize: 32,
          color: `${TEXT_COLOR}99`,
          fontFamily: "sans-serif",
          letterSpacing: "1px",
          textAlign: "center",
        }}
      >
        AIが一次情報だけを選び抜いて、毎日あなたに届ける
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: 製品ショット (frame 450-750) ────────────────────────────────────
const NotificationCard: React.FC<{
  title: string;
  subtitle: string;
  stars: number;
  actions: string[];
  scoreProgress: number;
  delay: number;
  frame: number;
  fps: number;
}> = ({ title, subtitle, stars, actions, scoreProgress, delay, frame, fps }) => {
  const cardProgress = spring({
    fps,
    frame: Math.max(0, frame - delay),
    config: { damping: 16, stiffness: 90 },
    from: 0,
    to: 1,
  });

  return (
    <div
      style={{
        opacity: cardProgress,
        transform: `translateY(${(1 - cardProgress) * 40}px)`,
        backgroundColor: "#141826",
        border: `1px solid ${ACCENT}44`,
        borderRadius: 20,
        padding: "32px 40px",
        width: 900,
        boxShadow: `0 8px 48px #000A, 0 0 20px ${ACCENT}22`,
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 32 }}>🔥</div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: TEXT_COLOR,
              fontFamily: "sans-serif",
            }}
          >
            {subtitle}
          </div>
          <div
            style={{
              fontSize: 20,
              color: `${TEXT_COLOR}77`,
              fontFamily: "sans-serif",
              marginTop: 4,
            }}
          >
            {title}
          </div>
        </div>
        {/* 星 */}
        <div style={{ fontSize: 24 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ color: i < stars ? "#FFD700" : "#333" }}>
              ★
            </span>
          ))}
        </div>
      </div>

      {/* スコアバー */}
      <div
        style={{
          backgroundColor: "#1E2535",
          borderRadius: 8,
          height: 10,
          width: "100%",
          marginBottom: 20,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${scoreProgress * 100}%`,
            background: `linear-gradient(90deg, ${ACCENT}88, ${ACCENT})`,
            borderRadius: 8,
            boxShadow: `0 0 12px ${ACCENT}`,
            transition: "width 0.05s",
          }}
        />
      </div>

      {/* アクションボタン */}
      <div style={{ display: "flex", gap: 16 }}>
        {actions.map((action, i) => (
          <div
            key={i}
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              backgroundColor: `${ACCENT}18`,
              border: `1px solid ${ACCENT}55`,
              color: ACCENT,
              fontSize: 20,
              fontFamily: "sans-serif",
              fontWeight: 600,
            }}
          >
            {action}
          </div>
        ))}
      </div>
    </div>
  );
};

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // スコアバーアニメーション
  const scoreProgress = interpolate(frame, [20, 100], [0, 0.95], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const headerOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const priceOpacity = interpolate(frame, [200, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const priceScale = spring({
    fps,
    frame: Math.max(0, frame - 200),
    config: { damping: 14, stiffness: 80 },
    from: 0.8,
    to: 1,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: MAIN_BG,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          opacity: headerOpacity,
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: TEXT_COLOR,
            fontFamily: "sans-serif",
            letterSpacing: "3px",
          }}
        >
          📡{" "}
          <span style={{ color: ACCENT }}>InfoRadar</span> Daily Brief
        </div>
        <div
          style={{
            fontSize: 26,
            color: `${TEXT_COLOR}66`,
            fontFamily: "sans-serif",
            marginTop: 8,
          }}
        >
          今日のトップニュース
        </div>
      </div>

      {/* 通知カード */}
      <NotificationCard
        title="Google公式ブログ"
        subtitle="Google AIO 全言語展開"
        stars={5}
        actions={["▶ なぜ重要?", "▶ 次のアクション"]}
        scoreProgress={scoreProgress}
        delay={30}
        frame={frame}
        fps={fps}
      />

      {/* 価格表示 */}
      <div
        style={{
          opacity: priceOpacity,
          transform: `scale(${priceScale})`,
          marginTop: 20,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 20,
            backgroundColor: `${ACCENT}15`,
            border: `2px solid ${ACCENT}55`,
            borderRadius: 16,
            padding: "18px 48px",
            boxShadow: `0 0 40px ${ACCENT}22`,
          }}
        >
          <div style={{ fontSize: 28, color: `${TEXT_COLOR}88`, fontFamily: "sans-serif" }}>
            Pro プラン
          </div>
          <div
            style={{
              width: 2,
              height: 36,
              backgroundColor: `${ACCENT}44`,
            }}
          />
          <div
            style={{
              fontSize: 40,
              fontWeight: 900,
              color: ACCENT,
              fontFamily: "sans-serif",
              textShadow: `0 0 20px ${ACCENT}`,
            }}
          >
            ¥1,480
            <span style={{ fontSize: 22, fontWeight: 400, color: `${ACCENT}88` }}>
              /月
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: エンドカード (frame 750-900) ────────────────────────────────────
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    fps,
    frame,
    config: { damping: 18, stiffness: 70 },
    from: 0,
    to: 1,
  });

  const taglineOpacity = interpolate(frame, [40, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const urlOpacity = interpolate(frame, [70, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ctaProgress = spring({
    fps,
    frame: Math.max(0, frame - 100),
    config: { damping: 14, stiffness: 80 },
    from: 0,
    to: 1,
  });

  // グロウパルス
  const glowPulse = interpolate(frame % 90, [0, 45, 90], [0.4, 1, 0.4]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: MAIN_BG,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      {/* 背景グロウ */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${ACCENT}${Math.round(glowPulse * 15).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* ロゴ（大） */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        <div style={{ fontSize: 100, marginBottom: 8 }}>📡</div>
        <div
          style={{
            fontSize: 100,
            fontWeight: 900,
            fontFamily: "sans-serif",
            color: TEXT_COLOR,
            letterSpacing: "6px",
            lineHeight: 1,
          }}
        >
          <span
            style={{
              color: ACCENT,
              textShadow: `0 0 60px ${ACCENT}, 0 0 120px ${ACCENT}66`,
            }}
          >
            InfoRadar
          </span>
        </div>
      </div>

      {/* タグライン */}
      <div
        style={{
          opacity: taglineOpacity,
          fontSize: 48,
          fontWeight: 700,
          color: TEXT_COLOR,
          fontFamily: "sans-serif",
          letterSpacing: "2px",
          textAlign: "center",
          marginBottom: 32,
        }}
      >
        一次情報だけが、あなたに届く
      </div>

      {/* URL */}
      <div
        style={{
          opacity: urlOpacity,
          fontSize: 42,
          color: ACCENT,
          fontFamily: "sans-serif",
          fontWeight: 600,
          letterSpacing: "3px",
          textShadow: `0 0 20px ${ACCENT}`,
          marginBottom: 60,
        }}
      >
        inforadar.ai
      </div>

      {/* CTAボタン */}
      <div
        style={{
          opacity: ctaProgress,
          transform: `scale(${ctaProgress}) translateY(${(1 - ctaProgress) * 20}px)`,
        }}
      >
        <div
          style={{
            padding: "24px 64px",
            borderRadius: 20,
            background: `linear-gradient(135deg, ${ACCENT}CC, ${ACCENT})`,
            color: MAIN_BG,
            fontSize: 36,
            fontWeight: 900,
            fontFamily: "sans-serif",
            letterSpacing: "2px",
            boxShadow: `0 0 60px ${ACCENT}88, 0 8px 32px ${ACCENT}44`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          無料で始める →
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── メインコンポーネント ──────────────────────────────────────────────────────
export const InfoRadarPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: MAIN_BG }}>
      {/* Scene 1: 0-150 frames (0-5s) */}
      <Sequence from={0} durationInFrames={155}>
        <Scene1 />
      </Sequence>

      {/* Scene 2: 145-455 frames (overlapping transition) */}
      <Sequence from={145} durationInFrames={310}>
        <Scene2 />
      </Sequence>

      {/* Scene 3: 445-755 frames */}
      <Sequence from={445} durationInFrames={310}>
        <Scene3 />
      </Sequence>

      {/* Scene 4: 745-900 frames */}
      <Sequence from={745} durationInFrames={155}>
        <Scene4 />
      </Sequence>
    </AbsoluteFill>
  );
};

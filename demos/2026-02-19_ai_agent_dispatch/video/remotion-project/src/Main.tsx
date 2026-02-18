import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

// Colors
const BG = '#1A1A2E';
const ACCENT = '#00D4AA';
const SECONDARY = '#6C63FF';
const TEXT = '#FFFFFF';

// ============================================================
// Scene 1: 0-5s — 「AI人材、足りていますか？」フェードイン
// ============================================================
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps * 1.5], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const fadeOut = interpolate(frame, [fps * 4, fps * 5], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const y = interpolate(frame, [0, fps * 1.5], [40, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: opacity * fadeOut,
      }}
    >
      {/* Background grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,212,170,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,170,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />
      
      {/* Main question */}
      <div style={{ transform: `translateY(${y}px)`, textAlign: 'center' }}>
        <div style={{
          fontSize: 88,
          fontWeight: 900,
          color: TEXT,
          fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
          letterSpacing: '-2px',
          lineHeight: 1.2,
          textShadow: `0 0 60px rgba(0,212,170,0.3)`,
        }}>
          AI人材、
        </div>
        <div style={{
          fontSize: 88,
          fontWeight: 900,
          color: ACCENT,
          fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
          letterSpacing: '-2px',
          lineHeight: 1.2,
          textShadow: `0 0 60px rgba(0,212,170,0.5)`,
        }}>
          足りていますか？
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// Scene 2: 5-10s — 数字パネル対比
// ============================================================
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const fadeOut = interpolate(frame, [fps * 4, fps * 5], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const leftX = interpolate(frame, [0, fps * 0.8], [-200, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const rightX = interpolate(frame, [fps * 0.3, fps * 1.1], [200, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const vsScale = spring({
    frame: frame - fps * 0.8,
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: containerOpacity * fadeOut,
      }}
    >
      {/* Background grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(108,99,255,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(108,99,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
        {/* Left: 派遣社員 */}
        <div style={{
          transform: `translateX(${leftX}px)`,
          background: 'rgba(255,100,100,0.12)',
          border: '2px solid rgba(255,100,100,0.5)',
          borderRadius: 24,
          padding: '48px 56px',
          textAlign: 'center',
          width: 380,
        }}>
          <div style={{
            fontSize: 20,
            color: 'rgba(255,255,255,0.7)',
            fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
            marginBottom: 16,
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}>
            従来の派遣社員
          </div>
          <div style={{
            fontSize: 72,
            fontWeight: 900,
            color: '#FF6B6B',
            fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
            lineHeight: 1,
          }}>
            月40万
          </div>
          <div style={{
            fontSize: 22,
            color: 'rgba(255,255,255,0.6)',
            fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
            marginTop: 16,
          }}>
            ＋残業・休暇・保険
          </div>
          <div style={{
            fontSize: 18,
            color: 'rgba(255,100,100,0.8)',
            fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
            marginTop: 12,
          }}>
            ⏰ 週5日 / 8時間のみ
          </div>
        </div>

        {/* VS */}
        <div style={{
          transform: `scale(${vsScale})`,
          fontSize: 56,
          fontWeight: 900,
          color: TEXT,
          fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
          textShadow: `0 0 30px rgba(255,255,255,0.3)`,
        }}>
          VS
        </div>

        {/* Right: AIエージェント */}
        <div style={{
          transform: `translateX(${rightX}px)`,
          background: `rgba(0,212,170,0.12)`,
          border: `2px solid rgba(0,212,170,0.6)`,
          borderRadius: 24,
          padding: '48px 56px',
          textAlign: 'center',
          width: 380,
          boxShadow: `0 0 40px rgba(0,212,170,0.2)`,
        }}>
          <div style={{
            fontSize: 20,
            color: 'rgba(255,255,255,0.7)',
            fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
            marginBottom: 16,
            letterSpacing: '2px',
          }}>
            AIエージェント
          </div>
          <div style={{
            fontSize: 72,
            fontWeight: 900,
            color: ACCENT,
            fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
            lineHeight: 1,
            textShadow: `0 0 30px rgba(0,212,170,0.5)`,
          }}>
            月30万
          </div>
          <div style={{
            fontSize: 22,
            color: 'rgba(255,255,255,0.6)',
            fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
            marginTop: 16,
          }}>
            追加費用ゼロ
          </div>
          <div style={{
            fontSize: 18,
            color: ACCENT,
            fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
            marginTop: 12,
          }}>
            🌟 24時間365日稼働
          </div>
        </div>
      </div>

      {/* Savings badge */}
      <div style={{
        position: 'absolute',
        bottom: 80,
        transform: `scale(${vsScale})`,
        background: `linear-gradient(135deg, ${ACCENT}, ${SECONDARY})`,
        borderRadius: 50,
        padding: '14px 40px',
        fontSize: 26,
        fontWeight: 700,
        color: TEXT,
        fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
      }}>
        💰 年間120万円以上のコスト削減
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// Scene 3: 10-15s — スキルカード
// ============================================================
const skills = [
  { icon: '📰', name: 'ニュース配信', desc: '自動収集・配信' },
  { icon: '📊', name: 'スライド作成', desc: 'デザインまで完結' },
  { icon: '🎯', name: 'リード獲得', desc: 'ターゲット自動発掘' },
  { icon: '✉️', name: 'メール対応', desc: '24時間自動返信' },
  { icon: '📈', name: 'データ分析', desc: '即座に洞察を提供' },
  { icon: '🔍', name: 'リサーチ', desc: '深掘り調査を代行' },
  { icon: '📱', name: 'SNS運用', desc: 'コンテンツ自動生成' },
  { icon: '🤝', name: 'CRM管理', desc: '顧客情報を一元化' },
  { icon: '💡', name: '企画立案', desc: 'アイデアを具体化' },
];

const SkillCard: React.FC<{ skill: typeof skills[0]; delay: number }> = ({ skill, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.8 },
  });

  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      transform: `scale(${progress}) translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
      opacity,
      background: 'rgba(255,255,255,0.06)',
      border: `1px solid rgba(0,212,170,0.3)`,
      borderRadius: 16,
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    }}>
      <div style={{ fontSize: 36 }}>{skill.icon}</div>
      <div>
        <div style={{
          fontSize: 20,
          fontWeight: 700,
          color: TEXT,
          fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
        }}>
          {skill.name}
        </div>
        <div style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.6)',
          fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
          marginTop: 4,
        }}>
          {skill.desc}
        </div>
      </div>
    </div>
  );
};

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const fadeOut = interpolate(frame, [fps * 4, fps * 5], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        padding: '60px 80px',
        opacity: fadeOut,
      }}
    >
      {/* Background grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(108,99,255,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(108,99,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      <div style={{ opacity: titleOpacity, marginBottom: 40, position: 'relative' }}>
        <div style={{
          fontSize: 36,
          fontWeight: 700,
          color: ACCENT,
          fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
          letterSpacing: '2px',
          marginBottom: 8,
        }}>
          Ryokoのスキル一覧
        </div>
        <div style={{
          width: 80,
          height: 4,
          background: `linear-gradient(90deg, ${ACCENT}, ${SECONDARY})`,
          borderRadius: 2,
        }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 20,
        position: 'relative',
      }}>
        {skills.map((skill, i) => (
          <SkillCard
            key={skill.name}
            skill={skill}
            delay={i * 8}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// Scene 4: 15-20s — 「24時間365日、30+スキルで即戦力」
// ============================================================
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fps * 0.6], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const fadeOut = interpolate(frame, [fps * 4, fps * 5], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const line1Scale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const line2Scale = spring({ frame: frame - fps * 0.4, fps, config: { damping: 12, stiffness: 100 } });
  const line3Scale = spring({ frame: frame - fps * 0.8, fps, config: { damping: 12, stiffness: 100 } });
  const badgeScale = spring({ frame: frame - fps * 1.5, fps, config: { damping: 8, stiffness: 150 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeIn * fadeOut,
      }}
    >
      {/* Radial glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse at center, rgba(0,212,170,0.1) 0%, transparent 60%)`,
      }} />

      {/* Background grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,212,170,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,170,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      <div style={{ textAlign: 'center', position: 'relative' }}>
        <div style={{
          transform: `scale(${line1Scale})`,
          fontSize: 96,
          fontWeight: 900,
          color: ACCENT,
          fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
          lineHeight: 1.1,
          textShadow: `0 0 80px rgba(0,212,170,0.5)`,
        }}>
          24時間365日
        </div>

        <div style={{
          transform: `scale(${line2Scale})`,
          fontSize: 68,
          fontWeight: 700,
          color: TEXT,
          fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
          lineHeight: 1.3,
          marginTop: 16,
        }}>
          30+スキルで
        </div>

        <div style={{
          transform: `scale(${line3Scale})`,
          fontSize: 84,
          fontWeight: 900,
          background: `linear-gradient(135deg, ${ACCENT}, ${SECONDARY})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
          lineHeight: 1.2,
          marginTop: 8,
        }}>
          即戦力
        </div>

        <div style={{
          transform: `scale(${badgeScale})`,
          marginTop: 48,
          display: 'inline-flex',
          gap: 24,
        }}>
          {['🚀 即日稼働', '💪 休まない', '📈 常に進化'].map((tag) => (
            <div key={tag} style={{
              background: 'rgba(255,255,255,0.08)',
              border: `1px solid rgba(0,212,170,0.4)`,
              borderRadius: 50,
              padding: '12px 28px',
              fontSize: 22,
              color: TEXT,
              fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
            }}>
              {tag}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// Scene 5: 20-25s — 導入フロー 3ステップ
// ============================================================
const steps = [
  { num: '01', icon: '📝', title: '申込', desc: 'フォームに記入するだけ\n最短5分で完了' },
  { num: '02', icon: '⚡', title: '即日稼働', desc: 'セットアップ不要\n当日から業務開始' },
  { num: '03', icon: '🏆', title: '成果を実感', desc: '継続的な改善\nROIを可視化' },
];

const StepCard: React.FC<{ step: typeof steps[0]; delay: number }> = ({ step, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      transform: `translateY(${interpolate(progress, [0, 1], [60, 0])}px)`,
      opacity,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: 360,
    }}>
      {/* Number badge */}
      <div style={{
        fontSize: 16,
        fontWeight: 700,
        color: ACCENT,
        fontFamily: 'monospace',
        letterSpacing: '3px',
        marginBottom: 20,
      }}>
        STEP {step.num}
      </div>

      {/* Card */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: `2px solid rgba(0,212,170,0.3)`,
        borderRadius: 24,
        padding: '40px 32px',
        textAlign: 'center',
        width: '100%',
        boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
      }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{step.icon}</div>
        <div style={{
          fontSize: 36,
          fontWeight: 900,
          color: TEXT,
          fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
          marginBottom: 12,
        }}>
          {step.title}
        </div>
        <div style={{
          fontSize: 18,
          color: 'rgba(255,255,255,0.65)',
          fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
          lineHeight: 1.7,
          whiteSpace: 'pre-line',
        }}>
          {step.desc}
        </div>
      </div>
    </div>
  );
};

const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const fadeOut = interpolate(frame, [fps * 4, fps * 5], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const arrowOpacity = interpolate(frame, [fps * 1, fps * 1.5], [0, 1], {
    extrapolateLeft: 'clamp',
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
        padding: '60px 80px',
        opacity: fadeIn * fadeOut,
      }}
    >
      {/* Background grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(108,99,255,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(108,99,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      <div style={{
        fontSize: 32,
        fontWeight: 700,
        color: ACCENT,
        fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
        letterSpacing: '3px',
        marginBottom: 60,
        position: 'relative',
      }}>
        導入フロー
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        position: 'relative',
      }}>
        {steps.map((step, i) => (
          <React.Fragment key={step.num}>
            <StepCard step={step} delay={i * fps * 0.4} />
            {i < steps.length - 1 && (
              <div style={{
                fontSize: 40,
                color: ACCENT,
                opacity: arrowOpacity,
                fontWeight: 700,
                marginTop: 20,
              }}>
                →
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Timeline bar */}
      <div style={{
        position: 'absolute',
        bottom: 60,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        opacity: arrowOpacity,
      }}>
        <div style={{
          fontSize: 18,
          color: 'rgba(255,255,255,0.5)',
          fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
        }}>
          ⏱ 最短で当日から成果を実感
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// Scene 6: 25-30s — CTA
// ============================================================
const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fps * 0.8], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const logoScale = spring({ frame, fps, config: { damping: 10, stiffness: 80 } });
  const ctaScale = spring({ frame: frame - fps * 0.5, fps, config: { damping: 8, stiffness: 120 } });
  const urlOpacity = interpolate(frame, [fps * 1.2, fps * 1.8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pulsing animation for CTA button
  const pulse = Math.sin(frame * 0.15) * 0.03 + 1;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${BG} 0%, #0d0d1a 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeIn,
      }}
    >
      {/* Radial glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse at center, rgba(0,212,170,0.15) 0%, transparent 65%)`,
      }} />

      {/* Background grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,212,170,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,170,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* Logo / Brand */}
      <div style={{
        transform: `scale(${logoScale})`,
        textAlign: 'center',
        marginBottom: 48,
        position: 'relative',
      }}>
        <div style={{
          fontSize: 28,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.5)',
          fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
          letterSpacing: '6px',
          marginBottom: 12,
          textTransform: 'uppercase',
        }}>
          Ryoko AI Agent
        </div>
        <div style={{
          fontSize: 56,
          fontWeight: 900,
          background: `linear-gradient(135deg, ${ACCENT}, ${SECONDARY})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
          lineHeight: 1.1,
          textShadow: 'none',
        }}>
          AIで事業を加速する
        </div>
      </div>

      {/* CTA Button */}
      <div style={{
        transform: `scale(${ctaScale * pulse})`,
        background: `linear-gradient(135deg, ${ACCENT}, #00b8910)`,
        borderRadius: 50,
        padding: '24px 72px',
        fontSize: 38,
        fontWeight: 900,
        color: '#0d1117',
        fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
        letterSpacing: '1px',
        boxShadow: `0 0 60px rgba(0,212,170,0.4), 0 0 120px rgba(0,212,170,0.2)`,
        position: 'relative',
      }}>
        まずは無料デモ 🚀
      </div>

      {/* URL */}
      <div style={{
        opacity: urlOpacity,
        marginTop: 40,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 28,
          color: 'rgba(255,255,255,0.7)',
          fontFamily: 'monospace',
          letterSpacing: '2px',
          marginBottom: 8,
        }}>
          ryoko-ai.jp/demo
        </div>
        <div style={{
          fontSize: 18,
          color: 'rgba(255,255,255,0.4)',
          fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
        }}>
          登録不要 ・ 5分でセットアップ ・ いつでも解約可
        </div>
      </div>

      {/* Bottom decorative elements */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        display: 'flex',
        gap: 40,
        opacity: urlOpacity,
      }}>
        {['月額30万円〜', '初期費用ゼロ', '即日導入可能'].map((tag) => (
          <div key={tag} style={{
            fontSize: 18,
            color: 'rgba(255,255,255,0.5)',
            fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ color: ACCENT }}>✓</span> {tag}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// Main Composition
// ============================================================
export const Main: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* Scene 1: 0-5s (0-150 frames) */}
      <Sequence from={0} durationInFrames={fps * 5} premountFor={fps}>
        <Scene1 />
      </Sequence>

      {/* Scene 2: 5-10s (150-300 frames) */}
      <Sequence from={fps * 5} durationInFrames={fps * 5} premountFor={fps}>
        <Scene2 />
      </Sequence>

      {/* Scene 3: 10-15s (300-450 frames) */}
      <Sequence from={fps * 10} durationInFrames={fps * 5} premountFor={fps}>
        <Scene3 />
      </Sequence>

      {/* Scene 4: 15-20s (450-600 frames) */}
      <Sequence from={fps * 15} durationInFrames={fps * 5} premountFor={fps}>
        <Scene4 />
      </Sequence>

      {/* Scene 5: 20-25s (600-750 frames) */}
      <Sequence from={fps * 20} durationInFrames={fps * 5} premountFor={fps}>
        <Scene5 />
      </Sequence>

      {/* Scene 6: 25-30s (750-900 frames) */}
      <Sequence from={fps * 25} durationInFrames={fps * 5} premountFor={fps}>
        <Scene6 />
      </Sequence>
    </AbsoluteFill>
  );
};

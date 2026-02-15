// Generate slide images using node-canvas (no browser needed)
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const WIDTH = 1920;
const HEIGHT = 1080;
const NAVY = '#1A3A5C';
const ORANGE = '#FF6B2B';
const WHITE = '#FFFFFF';
const LIGHT_BG = '#F7F8FA';

function drawSlide(ctx, config) {
  // Background
  ctx.fillStyle = config.bgColor || WHITE;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  if (config.gradient) {
    const grad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
    grad.addColorStop(0, config.gradient[0]);
    grad.addColorStop(1, config.gradient[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  // Decorative elements
  if (config.decor === 'circles') {
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = ORANGE;
    ctx.beginPath(); ctx.arc(1700, 200, 300, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = NAVY;
    ctx.beginPath(); ctx.arc(200, 900, 250, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  }

  if (config.decor === 'stripe') {
    ctx.fillStyle = ORANGE;
    ctx.fillRect(0, 0, 12, HEIGHT);
    ctx.fillStyle = NAVY;
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 10; i++) {
      ctx.fillRect(100 + i * 200, 0, 2, HEIGHT);
    }
    ctx.globalAlpha = 1;
  }

  if (config.decor === 'dots') {
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = NAVY;
    for (let x = 60; x < WIDTH; x += 80) {
      for (let y = 60; y < HEIGHT; y += 80) {
        ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  // Accent bar at top
  if (config.topBar) {
    ctx.fillStyle = NAVY;
    ctx.fillRect(0, 0, WIDTH, 8);
  }

  // Bottom accent bar
  if (config.bottomBar) {
    ctx.fillStyle = ORANGE;
    ctx.fillRect(0, HEIGHT - 6, WIDTH, 6);
  }

  // Icon / badge
  if (config.icon) {
    const iconX = config.iconX || WIDTH / 2;
    const iconY = config.iconY || 300;
    ctx.fillStyle = ORANGE;
    ctx.beginPath();
    ctx.arc(iconX, iconY, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = WHITE;
    ctx.font = 'bold 40px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.icon, iconX, iconY);
  }

  // Title
  if (config.title) {
    ctx.fillStyle = config.titleColor || NAVY;
    ctx.font = `bold ${config.titleSize || 72}px 'Noto Sans CJK JP', 'Noto Sans JP', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const titleY = config.titleY || HEIGHT / 2 - 60;
    wrapText(ctx, config.title, WIDTH / 2, titleY, WIDTH - 200, config.titleSize || 72);
  }

  // Subtitle
  if (config.subtitle) {
    ctx.fillStyle = config.subtitleColor || '#666666';
    ctx.font = `${config.subtitleSize || 36}px 'Noto Sans CJK JP', 'Noto Sans JP', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const subY = config.subtitleY || HEIGHT / 2 + 60;
    wrapText(ctx, config.subtitle, WIDTH / 2, subY, WIDTH - 200, config.subtitleSize || 36);
  }

  // Bullets
  if (config.bullets) {
    ctx.textAlign = 'left';
    ctx.fillStyle = config.bulletColor || '#333333';
    ctx.font = `${config.bulletSize || 32}px 'Noto Sans CJK JP', 'Noto Sans JP', sans-serif`;
    const startY = config.bulletStartY || 450;
    config.bullets.forEach((b, i) => {
      ctx.fillStyle = ORANGE;
      ctx.fillText('●', 300, startY + i * 70);
      ctx.fillStyle = '#333333';
      ctx.fillText(b, 340, startY + i * 70);
    });
  }
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const chars = text.split('');
  let line = '';
  let lines = [];
  for (let c of chars) {
    let test = line + c;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = c;
    } else {
      line = test;
    }
  }
  lines.push(line);
  const totalHeight = lines.length * lineHeight * 1.3;
  const startY = y - totalHeight / 2 + lineHeight / 2;
  lines.forEach((l, i) => {
    ctx.fillText(l, x, startY + i * lineHeight * 1.3);
  });
}

const slides = [
  {
    name: 'cover.png',
    gradient: [NAVY, '#2A5A8C'],
    title: 'Pre-Onboarding Mission',
    titleColor: WHITE,
    titleSize: 80,
    titleY: 400,
    subtitle: '内定〜入社の空白期間を、ミッション発見の旅に。',
    subtitleColor: '#FFD4B8',
    subtitleSize: 40,
    subtitleY: 550,
    decor: 'circles',
    bottomBar: true,
  },
  {
    name: 'slide_01.png',
    bgColor: WHITE,
    topBar: true,
    title: 'AI対話でミッション発見',
    titleSize: 60,
    titleY: 250,
    subtitle: 'あなただけの「入社ミッション」をAIが一緒に見つけます',
    subtitleSize: 32,
    subtitleY: 370,
    decor: 'dots',
    icon: '🤖',
    iconX: 960,
    iconY: 550,
    bottomBar: true,
    bullets: ['パーソナライズされた質問で深掘り', '価値観・スキル・ビジョンの棚卸し', '具体的なミッションステートメントを生成'],
    bulletStartY: 650,
  },
  {
    name: 'slide_02.png',
    bgColor: LIGHT_BG,
    topBar: true,
    title: '入社意欲をMAXに',
    titleSize: 60,
    titleY: 250,
    subtitle: '不安をワクワクに変える、入社前の自己対話',
    subtitleSize: 32,
    subtitleY: 370,
    decor: 'stripe',
    icon: '🚀',
    iconX: 960,
    iconY: 550,
    bottomBar: true,
    bullets: ['転職ブルーを解消', '初日から目的意識を持って活躍', 'チームへの貢献イメージが明確に'],
    bulletStartY: 650,
  },
  {
    name: 'slide_03.png',
    bgColor: WHITE,
    topBar: true,
    title: '企業の定着率を向上',
    titleSize: 60,
    titleY: 250,
    subtitle: '早期離職を防ぎ、エンゲージメントを高める',
    subtitleSize: 32,
    subtitleY: 370,
    decor: 'dots',
    icon: '📊',
    iconX: 960,
    iconY: 550,
    bottomBar: true,
    bullets: ['入社前から会社との心理的結びつき', 'Day1のオンボーディング効果を最大化', '人事・マネージャーの負担を軽減'],
    bulletStartY: 650,
  },
];

// Check if canvas is available
try {
  slides.forEach(s => {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');
    drawSlide(ctx, s);
    const outPath = path.join(__dirname, s.name);
    fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
    console.log('Generated:', outPath);
  });
} catch (e) {
  console.error('canvas not available, trying alternative:', e.message);
  process.exit(1);
}

import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = '/tmp/vibe-coder-demo/demos/2026-02-26_TaxPilot/video/promo.mp4';

const render = async () => {
  console.log('📦 Bundling project...');
  
  const bundled = await bundle({
    entryPoint: path.resolve(__dirname, './src/index.ts'),
    webpackOverride: (config) => config,
  });

  console.log('🎬 Selecting composition...');
  const composition = await selectComposition({
    serveUrl: bundled,
    id: 'TaxPilotPromo',
    inputProps: {},
  });

  console.log(`🎥 Rendering ${composition.durationInFrames} frames at ${composition.fps}fps...`);
  
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps: {},
    concurrency: 4,
    onProgress: ({ progress }) => {
      process.stdout.write(`\r⏳ Progress: ${(progress * 100).toFixed(1)}%`);
    },
  });

  console.log('\n✅ Render complete!');
  console.log(`📁 Output: ${outputPath}`);
};

render().catch((err) => {
  console.error('❌ Render failed:', err);
  process.exit(1);
});

#!/bin/bash
set -e
cd /tmp/vcd-fresh/demos/2026-04-10_photofolio_match/video/remotion-project
npm install
./node_modules/.bin/remotion render src/index.ts PhotoFolio /tmp/vcd-fresh/demos/2026-04-10_photofolio_match/video/promo.mp4

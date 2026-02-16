#!/bin/bash

NODE=/home/rsensui/.local/share/fnm/node-versions/v22.12.0/installation/bin/node
TTS_SCRIPT=/home/rsensui/.openclaw/workspace/skills/edge-tts/scripts/tts-converter.js
VOICE="ja-JP-NanamiNeural"
RATE="+5%"

cd /tmp/vibe-coder-demo/demos/2026-02-16_ec_stock_advisor/audio

# Generate each chapter
for i in 1 2 3 4 5; do
    script_file="chapter_0${i}_script.txt"
    output_file="chapter_0${i}.mp3"
    
    echo "Generating ${output_file}..."
    
    # Read text and pass as argument
    text=$(cat "${script_file}")
    
    ${NODE} ${TTS_SCRIPT} "${text}" \
        --voice ${VOICE} \
        --rate ${RATE} \
        --output ${output_file}
    
    if [ $? -eq 0 ]; then
        echo "  ✓ ${output_file} created ($(ls -lh ${output_file} | awk '{print $5}'))"
    else
        echo "  ✗ Failed to create ${output_file}"
        exit 1
    fi
done

# Combine all chapters
echo ""
echo "Creating full episode..."

cat > concat_list.txt <<EOF
file 'chapter_01.mp3'
file 'chapter_02.mp3'
file 'chapter_03.mp3'
file 'chapter_04.mp3'
file 'chapter_05.mp3'
EOF

ffmpeg -f concat -safe 0 -i concat_list.txt -c copy full_episode.mp3 -y -loglevel error

if [ $? -eq 0 ]; then
    echo "  ✓ full_episode.mp3 created ($(ls -lh full_episode.mp3 | awk '{print $5}'))"
    rm -f concat_list.txt
else
    echo "  ✗ Failed to create full_episode.mp3"
    exit 1
fi

echo ""
echo "✓ All audio files generated successfully!"
echo ""
ls -lh *.mp3

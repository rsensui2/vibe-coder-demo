#!/bin/bash

NODE=/home/rsensui/.local/share/fnm/node-versions/v22.12.0/installation/bin/node
TTS_SCRIPT=/home/rsensui/.openclaw/workspace/skills/edge-tts/scripts/tts-converter.js
VOICE="ja-JP-NanamiNeural"
RATE="+5%"

# Function to split text into chunks and generate audio
generate_chapter() {
    local chapter_num=$1
    local script_file="chapter_0${chapter_num}_script.txt"
    local output_file="chapter_0${chapter_num}.mp3"
    
    echo "Generating Chapter ${chapter_num}..."
    
    # Split text into sentences and process in chunks
    local temp_files=()
    local chunk_size=50  # lines per chunk
    local chunk_num=0
    
    # Split into chunks
    split -l ${chunk_size} "${script_file}" "ch${chapter_num}_chunk_"
    
    # Generate audio for each chunk
    for chunk_file in ch${chapter_num}_chunk_*; do
        local chunk_output="ch${chapter_num}_part_${chunk_num}.mp3"
        echo "  Processing ${chunk_file}..."
        
        ${NODE} ${TTS_SCRIPT} "$(cat ${chunk_file})" \
            --voice ${VOICE} \
            --rate ${RATE} \
            --output ${chunk_output}
        
        if [ $? -eq 0 ]; then
            temp_files+=("${chunk_output}")
            ((chunk_num++))
        else
            echo "  Error processing ${chunk_file}"
            rm -f ch${chapter_num}_chunk_*
            return 1
        fi
        
        rm -f ${chunk_file}
    done
    
    # Combine chunks using ffmpeg
    if [ ${#temp_files[@]} -gt 1 ]; then
        echo "  Combining ${#temp_files[@]} parts..."
        
        # Create concat file
        printf "file '%s'\n" "${temp_files[@]}" > concat_ch${chapter_num}.txt
        
        ffmpeg -f concat -safe 0 -i concat_ch${chapter_num}.txt -c copy ${output_file} -y 2>&1 | grep -E "(Duration|size=)"
        
        # Cleanup
        rm -f concat_ch${chapter_num}.txt "${temp_files[@]}"
    else
        mv "${temp_files[0]}" ${output_file}
    fi
    
    echo "  ✓ ${output_file} created"
}

# Generate all chapters
for i in 1 2 3 4 5; do
    generate_chapter $i
    if [ $? -ne 0 ]; then
        echo "Failed at chapter $i"
        exit 1
    fi
done

# Combine all chapters into full episode
echo "Creating full episode..."
cat > concat_full.txt <<EOF
file 'chapter_01.mp3'
file 'chapter_02.mp3'
file 'chapter_03.mp3'
file 'chapter_04.mp3'
file 'chapter_05.mp3'
EOF

ffmpeg -f concat -safe 0 -i concat_full.txt -c copy full_episode.mp3 -y 2>&1 | grep -E "(Duration|size=)"

rm -f concat_full.txt

echo ""
echo "✓ All chapters generated:"
ls -lh chapter_*.mp3 full_episode.mp3

echo ""
echo "Complete! Audio files ready in $(pwd)"

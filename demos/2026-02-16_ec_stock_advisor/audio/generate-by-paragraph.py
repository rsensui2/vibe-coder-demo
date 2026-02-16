#!/usr/bin/env python3
"""
Generate audio files by paragraph to avoid shell command line length limits
"""

import subprocess
import os
import sys

NODE = "/home/rsensui/.local/share/fnm/node-versions/v22.12.0/installation/bin/node"
TTS_SCRIPT = "/home/rsensui/.openclaw/workspace/skills/edge-tts/scripts/tts-converter.js"
VOICE = "ja-JP-NanamiNeural"
RATE = "+5%"
AUDIO_DIR = "/tmp/vibe-coder-demo/demos/2026-02-16_ec_stock_advisor/audio"

def split_into_segments(text, max_length=3000):
    """Split text into segments by paragraphs, max length per segment"""
    paragraphs = text.split('\n\n')
    segments = []
    current_segment = ""
    
    for para in paragraphs:
        if len(current_segment) + len(para) + 2 <= max_length:
            if current_segment:
                current_segment += "\n\n" + para
            else:
                current_segment = para
        else:
            if current_segment:
                segments.append(current_segment)
            current_segment = para
    
    if current_segment:
        segments.append(current_segment)
    
    return segments

def generate_audio_segment(text, output_path):
    """Generate audio for a text segment"""
    # Ensure absolute path
    abs_output_path = os.path.abspath(output_path)
    
    cmd = [
        NODE,
        TTS_SCRIPT,
        text,
        "--voice", VOICE,
        "--rate", RATE,
        "--output", abs_output_path
    ]
    
    # Run from the scripts directory where node_modules is located
    result = subprocess.run(cmd, capture_output=True, text=True, 
                          cwd="/home/rsensui/.openclaw/workspace/skills/edge-tts/scripts")
    
    if result.returncode != 0:
        print(f"✗ Failed to generate {output_path}")
        print(result.stderr)
        return False
    
    return True

def generate_chapter(chapter_num):
    """Generate audio for a single chapter"""
    script_file = os.path.join(AUDIO_DIR, f"chapter_0{chapter_num}_script.txt")
    output_file = os.path.join(AUDIO_DIR, f"chapter_0{chapter_num}.mp3")
    
    print(f"\n=== Generating Chapter {chapter_num} ===")
    
    # Read script
    with open(script_file, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Split into segments
    segments = split_into_segments(text)
    print(f"  Split into {len(segments)} segments")
    
    # Generate audio for each segment
    segment_files = []
    for i, segment in enumerate(segments):
        segment_file = os.path.join(AUDIO_DIR, f"ch{chapter_num}_seg{i:02d}.mp3")
        print(f"  Generating segment {i+1}/{len(segments)}...", end=" ")
        
        if generate_audio_segment(segment, segment_file):
            segment_files.append(segment_file)
            print("✓")
        else:
            print("✗")
            return False
    
    # Combine segments if multiple
    if len(segment_files) > 1:
        print(f"  Combining {len(segment_files)} segments...")
        
        # Create concat file
        concat_file = os.path.join(AUDIO_DIR, f"concat_ch{chapter_num}.txt")
        with open(concat_file, 'w') as f:
            for seg_file in segment_files:
                f.write(f"file '{os.path.basename(seg_file)}'\n")
        
        # Run ffmpeg
        cmd = [
            "ffmpeg",
            "-f", "concat",
            "-safe", "0",
            "-i", concat_file,
            "-c", "copy",
            output_file,
            "-y",
            "-loglevel", "error"
        ]
        
        result = subprocess.run(cmd, cwd=AUDIO_DIR)
        
        if result.returncode == 0:
            # Cleanup
            os.remove(concat_file)
            for seg_file in segment_files:
                os.remove(seg_file)
            print(f"  ✓ {output_file} created")
        else:
            print(f"  ✗ Failed to combine segments")
            return False
    else:
        # Just rename the single segment
        os.rename(segment_files[0], output_file)
        print(f"  ✓ {output_file} created")
    
    return True

def combine_all_chapters():
    """Combine all chapters into full episode"""
    print("\n=== Creating full episode ===")
    
    concat_file = os.path.join(AUDIO_DIR, "concat_full.txt")
    output_file = os.path.join(AUDIO_DIR, "full_episode.mp3")
    
    with open(concat_file, 'w') as f:
        for i in range(1, 6):
            f.write(f"file 'chapter_0{i}.mp3'\n")
    
    cmd = [
        "ffmpeg",
        "-f", "concat",
        "-safe", "0",
        "-i", concat_file,
        "-c", "copy",
        output_file,
        "-y",
        "-loglevel", "error"
    ]
    
    result = subprocess.run(cmd, cwd=AUDIO_DIR)
    
    if result.returncode == 0:
        os.remove(concat_file)
        
        # Get file size
        size_bytes = os.path.getsize(output_file)
        size_mb = size_bytes / (1024 * 1024)
        print(f"  ✓ full_episode.mp3 created ({size_mb:.2f} MB)")
        return True
    else:
        print(f"  ✗ Failed to create full episode")
        return False

def main():
    os.chdir(AUDIO_DIR)
    
    # Generate each chapter
    for i in range(1, 6):
        if not generate_chapter(i):
            print(f"\n✗ Failed at chapter {i}")
            sys.exit(1)
    
    # Combine all chapters
    if not combine_all_chapters():
        sys.exit(1)
    
    print("\n✓ All audio files generated successfully!\n")
    
    # List generated files
    for f in sorted(os.listdir(AUDIO_DIR)):
        if f.endswith('.mp3'):
            size = os.path.getsize(os.path.join(AUDIO_DIR, f))
            size_mb = size / (1024 * 1024)
            print(f"  {f:25s} {size_mb:7.2f} MB")

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Markdown記事をHTML化してindex.htmlにまとめる"""
import os, re, glob

ARTICLES_DIR = os.path.expanduser("~/clawd/docs/note-sato-articles")
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

CATEGORIES = {
    "1": "Vibe Coding 公式紹介",
    "2": "泉水の思想・生き方",
    "3": "佐藤さん体験記（テンプレート）",
    "4": "ライフスタイル",
    "5": "ストーリー深掘り",
    "6": "対談インタビュー（テンプレート）",
}

def md_to_html(md_text):
    """Simple markdown to HTML"""
    lines = md_text.split('\n')
    html_lines = []
    in_list = False
    for line in lines:
        # Headers
        if line.startswith('# '):
            html_lines.append(f'<h1>{line[2:]}</h1>')
        elif line.startswith('## '):
            html_lines.append(f'<h2>{line[3:]}</h2>')
        elif line.startswith('### '):
            html_lines.append(f'<h3>{line[4:]}</h3>')
        elif line.startswith('- ') or line.startswith('* '):
            if not in_list:
                html_lines.append('<ul>')
                in_list = True
            content = line[2:]
            # Bold
            content = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', content)
            html_lines.append(f'<li>{content}</li>')
        elif line.startswith('> '):
            html_lines.append(f'<blockquote>{line[2:]}</blockquote>')
        elif line.strip() == '---':
            if in_list:
                html_lines.append('</ul>')
                in_list = False
            html_lines.append('<hr>')
        elif line.strip() == '':
            if in_list:
                html_lines.append('</ul>')
                in_list = False
            html_lines.append('<br>')
        else:
            if in_list:
                html_lines.append('</ul>')
                in_list = False
            content = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', line)
            content = re.sub(r'\*(.+?)\*', r'<em>\1</em>', content)
            html_lines.append(f'<p>{content}</p>')
    if in_list:
        html_lines.append('</ul>')
    return '\n'.join(html_lines)

# Collect articles
articles = []
for f in sorted(glob.glob(os.path.join(ARTICLES_DIR, "*.md"))):
    fname = os.path.basename(f)
    cat_num = fname.split('-')[0].split('_')[0]
    with open(f) as fh:
        content = fh.read()
    # Extract title from first h1
    title_match = re.search(r'^#\s+(.+)', content, re.MULTILINE)
    title = title_match.group(1) if title_match else fname
    articles.append({
        "filename": fname,
        "category": cat_num,
        "title": title,
        "content": content,
        "slug": fname.replace('.md', ''),
    })

# Generate individual article pages
for art in articles:
    html = f"""<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{art['title']}</title>
<style>
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
body {{ font-family: 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif; background: #fafafa; color: #333; line-height: 1.8; }}
.container {{ max-width: 720px; margin: 0 auto; padding: 40px 20px; }}
.back {{ display: inline-block; margin-bottom: 24px; color: #00897B; text-decoration: none; font-size: 14px; }}
.back:hover {{ text-decoration: underline; }}
.category {{ display: inline-block; background: #00897B; color: white; font-size: 12px; padding: 4px 12px; border-radius: 20px; margin-bottom: 16px; }}
h1 {{ font-size: 28px; margin-bottom: 24px; line-height: 1.4; color: #1a1a1a; }}
h2 {{ font-size: 22px; margin: 32px 0 16px; color: #1a1a1a; border-bottom: 2px solid #00897B; padding-bottom: 8px; }}
h3 {{ font-size: 18px; margin: 24px 0 12px; color: #333; }}
p {{ margin-bottom: 16px; }}
blockquote {{ border-left: 4px solid #00897B; padding: 12px 20px; margin: 16px 0; background: #f0f7f6; color: #555; }}
ul {{ margin: 12px 0; padding-left: 24px; }}
li {{ margin-bottom: 8px; }}
hr {{ border: none; border-top: 1px solid #ddd; margin: 32px 0; }}
</style>
</head>
<body>
<div class="container">
<a href="index.html" class="back">← 記事一覧に戻る</a>
<span class="category">{CATEGORIES.get(art['category'], '未分類')}</span>
{md_to_html(art['content'])}
</div>
</body>
</html>"""
    with open(os.path.join(OUTPUT_DIR, f"{art['slug']}.html"), 'w') as fh:
        fh.write(html)

# Generate index
by_cat = {}
for art in articles:
    by_cat.setdefault(art['category'], []).append(art)

cards_html = ""
for cat_num in sorted(by_cat.keys()):
    cat_name = CATEGORIES.get(cat_num, "その他")
    cards_html += f'<h2 class="cat-title">{cat_name}</h2><div class="cards">'
    for art in by_cat[cat_num]:
        preview = art['content'][:200].replace('#', '').replace('*', '').strip()
        cards_html += f"""
<a href="{art['slug']}.html" class="card">
  <h3>{art['title']}</h3>
  <p class="preview">{preview}...</p>
</a>"""
    cards_html += '</div>'

index_html = f"""<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>note記事展開案 — Vibe Coder Bootcamp</title>
<style>
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
body {{ font-family: 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif; background: #fafafa; color: #333; }}
.header {{ background: linear-gradient(135deg, #00897B, #004D40); color: white; padding: 48px 20px; text-align: center; }}
.header h1 {{ font-size: 32px; margin-bottom: 8px; }}
.header p {{ font-size: 16px; opacity: 0.9; }}
.container {{ max-width: 800px; margin: 0 auto; padding: 32px 20px; }}
.cat-title {{ font-size: 20px; color: #00897B; margin: 32px 0 16px; padding-bottom: 8px; border-bottom: 2px solid #e0e0e0; }}
.cards {{ display: grid; gap: 16px; margin-bottom: 24px; }}
.card {{ display: block; background: white; border-radius: 12px; padding: 20px; text-decoration: none; color: #333; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: transform 0.2s, box-shadow 0.2s; }}
.card:hover {{ transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.12); }}
.card h3 {{ font-size: 18px; margin-bottom: 8px; color: #1a1a1a; }}
.preview {{ font-size: 14px; color: #666; line-height: 1.6; }}
.footer {{ text-align: center; padding: 32px; color: #999; font-size: 13px; }}
</style>
</head>
<body>
<div class="header">
  <h1>📝 note記事展開案</h1>
  <p>Vibe Coder Bootcamp コラム — 全6カテゴリ</p>
</div>
<div class="container">
{cards_html}
</div>
<div class="footer">
  Vibe Coder Bootcamp — <a href="https://vibe-coder-bootcamp.com" style="color:#00897B">vibe-coder-bootcamp.com</a>
</div>
</body>
</html>"""

with open(os.path.join(OUTPUT_DIR, "index.html"), 'w') as fh:
    fh.write(index_html)

print(f"Generated {len(articles)} article pages + index.html")

#!/usr/bin/env python3
"""Generate 10 Instagram images for TaxViz using Gemini API."""

import requests, base64, json, os, sys, time

GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]
URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent"
HEADERS = {"Content-Type": "application/json"}
PARAMS = {"key": GEMINI_API_KEY}
OUT_DIR = "/tmp/vibe-coder-demo/demos/2026-02-18_tax_return_visualizer/sns/instagram"

IMAGES = [
    ("ig_01_what_is_taxviz.png", """
Create a clean, modern Japanese infographic image (1080x1080px) for Instagram.
Title: 「TaxVizとは？」(What is TaxViz?)
Content: A service overview diagram showing:
- Center: TaxViz logo concept with tagline "入力しながら、全体が見える確定申告"
- Around it: 3 key features in circles: リアルタイム計算, 控除チェッカー, ビジュアルダッシュボード
- Clean flat design, primary color #1A56DB (blue), accent #10B981 (green), text #1E293B
- All text in Japanese. Professional, trustworthy feel.
- No photo-realistic elements, use flat illustration style.
"""),
    ("ig_02_realtime_dashboard.png", """
Create a clean Japanese infographic (1080x1080px) for Instagram.
Title: 「リアルタイムダッシュボード」
Content: Show a simplified dashboard mockup with:
- Left side: input fields (収入, 控除, 経費)
- Right side: live-updating charts (税額 bar chart, 還付額 gauge)
- Arrows showing "入力 → 即時反映" flow
- Colors: #1A56DB blue, #10B981 green, #1E293B text
- Flat design, all Japanese text. Modern and clean.
"""),
    ("ig_03_pain_points.png", """
Create a Japanese infographic (1080x1080px) for Instagram.
Title: 「確定申告の3大ペイン」
Content: 3 pain points with icons:
1. 😰 何を書けばいいかわからない
2. 🔢 計算が合っているか不安
3. 💸 控除の漏れが怖い
Bottom: "TaxVizならすべて解決 ✨" with arrow
Colors: #1A56DB, #10B981, #1E293B. Flat design, clean layout.
"""),
    ("ig_04_flow_map.png", """
Create a Japanese infographic (1080x1080px) for Instagram.
Title: 「タックスフローマップ」
Content: A flow diagram showing tax calculation flow:
収入 → 所得控除 → 課税所得 → 税率適用 → 税額 → 税額控除 → 最終納税額/還付額
Each step as a colored box with arrows connecting them.
Colors: gradient from #1A56DB to #10B981, text #1E293B.
Clean, modern flat design. All Japanese.
"""),
    ("ig_05_medical_deduction.png", """
Create a Japanese infographic (1080x1080px) for Instagram.
Title: 「医療費控除、あなたはいくら得する？」
Content: Simple calculation example:
- 年間医療費: 30万円
- 保険補填: 5万円
- 控除額: 30万 - 5万 - 10万 = 15万円
- 節税効果: 15万 × 20% = 3万円お得！
With a hospital/medical icon. Colors: #1A56DB, #10B981, #1E293B.
Flat design, friendly feel. All Japanese text.
"""),
    ("ig_06_freelance_tips.png", """
Create a Japanese infographic (1080x1080px) for Instagram.
Title: 「フリーランスが知るべき5つの控除」
Content: 5 items in a list/card layout:
1. 青色申告特別控除（最大65万円）
2. 小規模企業共済等掛金控除
3. 家事按分（家賃・光熱費）
4. 社会保険料控除
5. 基礎控除（48万円）
Colors: #1A56DB, #10B981. Flat design, icon for each item. All Japanese.
"""),
    ("ig_07_comparison.png", """
Create a Japanese infographic (1080x1080px) for Instagram.
Title: 「TaxViz vs 従来の会計ソフト」
Content: Comparison table style:
| 項目 | 従来ソフト | TaxViz |
| リアルタイム更新 | ✗ | ✓ |
| ビジュアル表示 | ✗ | ✓ |
| 控除漏れチェック | △ | ✓ |
| 操作の簡単さ | △ | ✓ |
TaxViz side in green (#10B981), traditional in gray.
Clean flat design. All Japanese.
"""),
    ("ig_08_pricing.png", """
Create a Japanese infographic (1080x1080px) for Instagram.
Title: 「料金プラン」
Content: 3 pricing cards side by side:
- フリー: ¥0 / 基本機能
- プロ: ¥980/月 / 全機能
- ビジネス: ¥2,980/月 / 法人対応+サポート
Pro plan highlighted/recommended with a badge.
Colors: #1A56DB, #10B981, #1E293B. Clean modern design. All Japanese.
"""),
    ("ig_09_furusato.png", """
Create a Japanese infographic (1080x1080px) for Instagram.
Title: 「ふるさと納税の控除額、すぐわかる」
Content: Simple flow:
- Input: 年収 & 家族構成
- Output: 控除上限額の目安
- Example: 年収500万・独身 → 上限約6.1万円
- "TaxVizで正確にシミュレーション" call to action
With gift/hometown imagery icons. Colors: #1A56DB, #10B981. All Japanese.
"""),
    ("ig_10_start_guide.png", """
Create a Japanese infographic (1080x1080px) for Instagram.
Title: 「始め方3ステップ」
Content: 3 steps with large numbers and icons:
Step 1: 無料アカウント作成 (user icon)
Step 2: 源泉徴収票を見ながら入力 (document icon)
Step 3: リアルタイムで結果確認 (chart icon)
Bottom: "今すぐ始める →" CTA button
Colors: #1A56DB, #10B981, #1E293B. Clean, inviting design. All Japanese.
"""),
]

def generate_image(filename, prompt):
    payload = {
        "contents": [{"parts": [{"text": prompt.strip()}]}],
        "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]}
    }
    print(f"Generating {filename}...", flush=True)
    resp = requests.post(URL, headers=HEADERS, params=PARAMS, json=payload, timeout=120)
    if resp.status_code != 200:
        print(f"  ERROR {resp.status_code}: {resp.text[:200]}", flush=True)
        return False
    
    data = resp.json()
    parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
    
    for part in parts:
        if "inlineData" in part:
            img_data = base64.b64decode(part["inlineData"]["data"])
            path = os.path.join(OUT_DIR, filename)
            with open(path, "wb") as f:
                f.write(img_data)
            print(f"  Saved {path} ({len(img_data)} bytes)", flush=True)
            return True
    
    print(f"  No image in response for {filename}", flush=True)
    print(f"  Response parts: {[list(p.keys()) for p in parts]}", flush=True)
    return False

if __name__ == "__main__":
    os.makedirs(OUT_DIR, exist_ok=True)
    success = 0
    for filename, prompt in IMAGES:
        if generate_image(filename, prompt):
            success += 1
        time.sleep(2)  # Rate limiting
    print(f"\nDone: {success}/{len(IMAGES)} images generated")

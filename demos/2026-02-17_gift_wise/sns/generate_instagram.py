import requests, base64, json, os, time

API_KEY = os.environ["GEMINI_API_KEY"]
URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent"
OUT_DIR = "/tmp/vibe-coder-demo/demos/2026-02-17_gift_wise/sns/instagram"

IMAGES = [
    ("ig_01_intro.png", "Gift Wiseとは",
     """Create a 1080x1080 Instagram infographic image with a clean, modern Japanese design.
Title: 「Gift Wise とは？」 in large bold text at the top.
Subtitle: 「ギフトをもっとスマートに」
3 key points with icons:
• 🎁 ウィッシュリストで欲しいものをシェア
• 📝 ギフトログで贈り物を記録
• 👥 グループギフトでみんなで贈る
Color scheme: rose pink (#E8567F) as primary, gold (#FFB347) as accent, soft cream (#FFF8F5) background.
Bottom: 「今すぐ無料で始めよう」with a CTA button style.
Style: minimal, warm, friendly infographic. Use rounded shapes and soft shadows."""),

    ("ig_02_problems.png", "ギフト選び3つの悩み",
     """Create a 1080x1080 Instagram infographic image in Japanese.
Title: 「ギフト選び、こんな悩みありませんか？」
3 pain points with sad face emoji icons, each in a card-style box:
1. 「何をあげたらいいかわからない…」
2. 「前に何をあげたか覚えてない…」
3. 「みんなで出し合いたいけど面倒…」
Bottom text: 「全部 Gift Wise が解決します ✨」
Color scheme: rose pink (#E8567F), gold (#FFB347), cream background (#FFF8F5).
Dark text (#2D2D2D). Clean minimal Japanese infographic style."""),

    ("ig_03_wishlist.png", "ウィッシュリスト機能",
     """Create a 1080x1080 Instagram infographic explaining a wishlist feature, in Japanese.
Title: 「ウィッシュリスト機能」
Subtitle: 「欲しいものをシェアするだけ」
Step-by-step flow with numbered circles:
① 欲しいものを登録
② リンクを友達にシェア
③ 友達がリストから選んで贈る
Include a simple mockup of a wishlist with items like books, gadgets, flowers.
Color scheme: rose pink (#E8567F), gold (#FFB347), cream (#FFF8F5) background.
Clean, modern infographic style with rounded elements."""),

    ("ig_04_giftlog.png", "ギフトログの使い方",
     """Create a 1080x1080 Instagram infographic in Japanese about a gift log feature.
Title: 「ギフトログで贈り物を記録 📝」
Show a timeline/log visualization with entries like:
• 2025/12 → お母さんにスカーフ 🧣
• 2026/01 → 友達にコーヒーセット ☕
• 2026/02 → 彼女にアクセサリー 💍
Key benefit text: 「もう"去年何あげたっけ？"とは言わせない」
Color scheme: rose pink (#E8567F), gold (#FFB347), cream (#FFF8F5).
Modern, clean infographic with a warm feel."""),

    ("ig_05_group.png", "グループギフト機能",
     """Create a 1080x1080 Instagram infographic in Japanese about group gifting.
Title: 「グループギフト機能 👥」
Subtitle: 「みんなで出し合って、もっと素敵なギフトを」
Visual: Multiple people icons contributing money arrows pointing to one big gift box.
Example: 「10人 × ¥2,000 = ¥20,000 の豪華ギフト！」
Use case: 送別会・結婚祝い・出産祝い
Color scheme: rose pink (#E8567F), gold (#FFB347), cream (#FFF8F5).
Fun, friendly infographic style."""),

    ("ig_06_message.png", "メッセージカード機能",
     """Create a 1080x1080 Instagram infographic in Japanese about a message card feature.
Title: 「メッセージカード機能 💌」
Subtitle: 「ギフトに気持ちを添えて」
Show a beautiful message card mockup with:
• Customizable design templates
• Handwriting-style font option
• Example message: 「いつもありがとう。大好きだよ。」
Bottom: 「言葉が苦手でもテンプレートがあるから安心」
Color scheme: rose pink (#E8567F), gold (#FFB347), cream (#FFF8F5).
Warm, emotional, elegant design."""),

    ("ig_07_pricing.png", "料金プラン比較",
     """Create a 1080x1080 Instagram infographic in Japanese comparing pricing plans.
Title: 「料金プラン」
Two plan cards side by side:
【Free プラン - ¥0】
✅ ウィッシュリスト3つ
✅ ギフトログ
✅ メッセージカード
【Premium プラン - ¥500/月】
✅ 無制限ウィッシュリスト
✅ AI ギフト提案
✅ 優先サポート
✅ グループギフト無制限
Bottom: 「まずは無料で始めよう！」
Color scheme: rose pink (#E8567F), gold (#FFB347), cream (#FFF8F5).
Clean comparison card design."""),

    ("ig_08_manners.png", "ギフトマナー豆知識",
     """Create a 1080x1080 Instagram infographic in Japanese about gift-giving etiquette.
Title: 「知っておきたいギフトマナー 📖」
4 tips in card format:
❌ 目上の人に靴・靴下はNG（踏みつける意味）
❌ ハンカチは「別れ」を連想
⭕ のし紙は用途に合わせて選ぶ
⭕ 相手の好みをリサーチしてから
Bottom: 「Gift Wise なら好みがわかるから安心」
Color scheme: rose pink (#E8567F), gold (#FFB347), cream (#FFF8F5).
Educational, clean infographic style."""),

    ("ig_09_tips.png", "成功するギフト選びのコツ",
     """Create a 1080x1080 Instagram infographic in Japanese about gift selection tips.
Title: 「成功するギフト選び 5つのコツ 🎯」
5 tips with icon circles:
1. 相手のウィッシュリストをチェック
2. 予算を先に決める
3. 実用的 × 特別感のバランス
4. 贈るタイミングを逃さない
5. メッセージを必ず添える
Bottom: 「全部 Gift Wise でできます」
Color scheme: rose pink (#E8567F), gold (#FFB347), cream (#FFF8F5).
Numbered list infographic, modern and clean."""),

    ("ig_10_cta.png", "今すぐ始めよう",
     """Create a 1080x1080 Instagram image in Japanese as a call-to-action.
Title large and bold: 「Gift Wise を始めよう 🎁」
Subtitle: 「ギフトをもっとスマートに、もっと楽しく」
3 short benefits:
✅ 無料で使える
✅ 5分で登録完了
✅ 家族や友達とシェア
Big CTA button style element: 「今すぐ無料登録 →」
Color scheme: rose pink (#E8567F) as dominant, gold (#FFB347) accent, cream (#FFF8F5).
Energetic, inviting, modern design with confetti or gift elements."""),
]

for filename, topic, prompt in IMAGES:
    print(f"Generating: {filename} ({topic})...")
    data = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]}
    }
    try:
        resp = requests.post(URL, headers={"Content-Type": "application/json"},
                           params={"key": API_KEY}, json=data, timeout=120)
        resp.raise_for_status()
        result = resp.json()

        # Extract image from response
        saved = False
        for candidate in result.get("candidates", []):
            for part in candidate.get("content", {}).get("parts", []):
                if "inlineData" in part:
                    img_data = base64.b64decode(part["inlineData"]["data"])
                    path = os.path.join(OUT_DIR, filename)
                    with open(path, "wb") as f:
                        f.write(img_data)
                    print(f"  ✅ Saved: {path} ({len(img_data)} bytes)")
                    saved = True
                    break
            if saved:
                break

        if not saved:
            print(f"  ❌ No image in response for {filename}")
            print(f"     Response keys: {list(result.keys())}")
            if "candidates" in result:
                for c in result["candidates"]:
                    parts = c.get("content", {}).get("parts", [])
                    for p in parts:
                        print(f"     Part keys: {list(p.keys())}")

    except Exception as e:
        print(f"  ❌ Error: {e}")

    time.sleep(2)  # Rate limiting

print("\nDone!")

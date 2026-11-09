"""Render 1280x800 store cover screenshots for Fullscreen Time (zh + en fix).

Same background source as the live listing (store/source/overlay.png). Keeps the
product overlay in the top-center clear instead of shading the whole frame.
"""
from PIL import Image, ImageDraw, ImageFont, ImageOps
import os

REPO = r"C:\Users\Zouyu\repos\fullscreen-time"
SRC = os.path.join(REPO, "store", "source", "overlay.png")
ICON = os.path.join(REPO, "extension", "icons", "icon128.png")
OUT_DIR = os.path.join(REPO, "store", "screenshots")
FONT_DIR = r"C:\Windows\Fonts"

W, H = 1280, 800

COPY = {
    "en": {
        "brand": "Fullscreen Time",
        "tag": "Chrome Extension · Real UI",
        "headline": "Time, even in fullscreen",
        "chips": [("Playback progress", "current / duration"),
                  ("System clock", "HH:MM:SS"),
                  ("Layout", "F9 · snap / float")],
        "head_font": "segoeuib.ttf",
        "brand_font": "segoeuib.ttf",
        "tag_font": "seguisb.ttf",
        "out": "en/01-overlay-fix.png",
    },
    "zh": {
        "brand": "全屏时间显示",
        "tag": "Chrome 扩展 · 实际界面",
        "headline": "全屏也能看时间",
        "chips": [("播放进度", "当前 / 总时长"),
                  ("系统时钟", "HH:MM:SS"),
                  ("布局切换", "F9 · 固定 / 浮动")],
        "head_font": "msyhbd.ttc",
        "brand_font": "msyhbd.ttc",
        "tag_font": "msyh.ttc",
        "out": "01-overlay-fix.png",
    },
}


def cover(img, w, h):
    sw, sh = img.size
    scale = max(w / sw, h / sh)
    img = img.resize((round(sw * scale), round(sh * scale)), Image.LANCZOS)
    left = (img.width - w) // 2
    top = (img.height - h) // 2
    return img.crop((left, top, left + w, top + h))


def font(name, size):
    path = os.path.join(FONT_DIR, name)
    return ImageFont.truetype(path, size) if os.path.exists(path) else ImageFont.load_default()


def render(lang, spec):
    hero = cover(Image.open(SRC).convert("RGB"), W, H)

    # Corner-only shading so the real overlay at top-center stays readable.
    shade = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(shade)
    for x in range(W):
        t = abs(x - W / 2) / (W / 2)
        v = int(120 * max(0.0, (t - 0.45) / 0.55) ** 1.4)
        d.line([(x, 0), (x, H)], fill=v)
    for y in range(H):
        t = y / H
        v = int(150 * max(0.0, (t - 0.72) / 0.28) ** 1.3)
        d.line([(0, y), (W, y)], fill=v)
    img = Image.composite(Image.new("RGB", (W, H), (3, 8, 16)), hero, shade)

    # The source 16:9 frame spans rows 0-719 after the cover crop. Re-cover the
    # 80px band underneath it with actual pixels, otherwise the baked-in
    # (and now half-shaded) player scrub bar shows through.
    top = hero.crop((0, 0, W, 800 - 80))
    img.paste(cover(top, W, H), (0, 0))

    draw = ImageDraw.Draw(img)
    f_brand = font(spec["brand_font"], 24)
    f_tag = font(spec["tag_font"], 16)
    f_head = font(spec["head_font"], 68 if lang == "en" else 72)
    f_chip = font(spec["brand_font"], 18)
    f_chip2 = font(spec["tag_font"], 15)

    # brand mark + name
    icon = Image.open(ICON).convert("RGBA").resize((28, 28), Image.LANCZOS)
    card = Image.new("RGBA", (44, 44), (0, 0, 0, 0))
    ImageDraw.Draw(card).rounded_rectangle([1, 1, 42, 42], radius=13, fill=(250, 252, 255, 255))
    card.alpha_composite(icon, (8, 8))
    img.paste(card, (48, 32), card)
    draw.text((104, 40), spec["brand"], font=f_brand, fill=(255, 255, 255))

    # top-right tag
    tag = spec["tag"]
    tw = draw.textlength(tag, font=f_tag)
    draw.rounded_rectangle([W - 48 - tw - 28, 38, W - 48, 76], radius=19,
                           fill=(7, 15, 29), outline=(90, 110, 140), width=1)
    draw.text((W - 48 - tw - 14, 47), tag, font=f_tag, fill=(220, 230, 248))

    # headline
    head = spec["headline"]
    hw = draw.textlength(head, font=f_head)
    draw.text(((W - hw) / 2, 500), head, font=f_head, fill=(255, 255, 255),
              stroke_width=2, stroke_fill=(3, 8, 16))

    # feature chips, centered
    widths = []
    for main, sub in spec["chips"]:
        wmain = draw.textlength(main, font=f_chip)
        wsub = draw.textlength(sub, font=f_chip2)
        widths.append(wmain + wsub + 8 + 28)
    total = sum(widths) + 10 * (len(widths) - 1)
    x = (W - total) / 2
    y = 612
    for (main, sub), cw in zip(spec["chips"], widths):
        draw.rounded_rectangle([x, y, x + cw, y + 44], radius=9,
                               fill=(12, 25, 49), outline=(80, 110, 170), width=1)
        draw.text((x + 14, y + 11), main, font=f_chip, fill=(238, 244, 255))
        wmain = draw.textlength(main, font=f_chip)
        draw.text((x + 14 + wmain + 8, y + 12), sub, font=f_chip2, fill=(159, 180, 212))
        x += cw + 10

    out = os.path.join(OUT_DIR, spec["out"])
    os.makedirs(os.path.dirname(out), exist_ok=True)
    img.save(out, "PNG")
    print(f"saved {out} {img.size} {os.path.getsize(out)}")


for lang, spec in COPY.items():
    render(lang, spec)

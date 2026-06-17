#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
apply_country_photos.py
========================
Скачивает фото для страниц стран по прямым URL (найденным вручную,
например через расширение Claude in Chrome на Unsplash/Pexels) и
раскладывает их по нужным путям:

    images/countries/<slug>.jpg            — hero-фото (главный баннер)
    images/countries/<slug>/1.jpg .. 4.jpg — фото галереи

Источник URL — файл country_photos.json в корне репозитория, формат:

{
  "italy": {
    "hero": "https://images.unsplash.com/photo-XXXX",
    "gallery": [
      "https://images.unsplash.com/photo-1",
      "https://images.unsplash.com/photo-2",
      "https://images.unsplash.com/photo-3",
      "https://images.unsplash.com/photo-4"
    ]
  },
  "usa": { ... }
}

ЗАПУСК (из корня репозитория Elite_website, рядом с этим файлом):
    python apply_country_photos.py
    python apply_country_photos.py --only italy,usa
    python apply_country_photos.py --force

ЗАВИСИМОСТИ:
    pip install requests pillow
"""

import os
import json
import argparse
import sys
from io import BytesIO

try:
    import requests
    from PIL import Image
except ImportError:
    sys.exit("Нужно: pip install requests pillow")

ROOT = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(ROOT, "country_photos.json")
COUNTRIES_DIR = os.path.join(ROOT, "images", "countries")
CREDITS_PATH = os.path.join(COUNTRIES_DIR, "credits.json")
LOG_PATH = os.path.join(COUNTRIES_DIR, "_apply_log.txt")

HERO_MAX_WIDTH = 2400
HERO_MIN_WIDTH = 1600       # hero не берём мельче — иначе размыто на баннере
GALLERY_MAX_WIDTH = 1600
GALLERY_MIN_WIDTH = 800
JPEG_QUALITY = 85
HEADERS = {"User-Agent": "Mozilla/5.0 (EliteAcademyKG-PhotoApply/1.0)"}


def log(msg, fh):
    print(msg)
    fh.write(msg + "\n")


def download_and_save(url, save_path, max_width, min_width, fh, label):
    try:
        resp = requests.get(url, headers=HEADERS, timeout=20)
        resp.raise_for_status()
        img = Image.open(BytesIO(resp.content)).convert("RGB")
        w, h = img.size
        if w < min_width:
            log(f"    [!] {label}: ширина {w}px меньше рекомендованной {min_width}px — оставляю, но проверь качество глазами", fh)
        if w > max_width:
            ratio = max_width / w
            img = img.resize((max_width, int(h * ratio)), Image.LANCZOS)
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        img.save(save_path, "JPEG", quality=JPEG_QUALITY, optimize=True)
        log(f"    [OK] {label} -> {save_path} ({img.size[0]}x{img.size[1]})", fh)
        return True
    except Exception as e:
        log(f"    [ОШИБКА] {label}: {e}", fh)
        return False


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--only", help="через запятую, например: italy,usa")
    parser.add_argument("--force", action="store_true", help="перезаписать уже существующие фото")
    args = parser.parse_args()

    if not os.path.exists(JSON_PATH):
        sys.exit(f"Не найден {JSON_PATH}. Сначала создай этот файл со ссылками на фото (см. шаблон в шапке скрипта).")

    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    only = set(s.strip() for s in args.only.split(",")) if args.only else None
    os.makedirs(COUNTRIES_DIR, exist_ok=True)

    credits = {}
    if os.path.exists(CREDITS_PATH):
        with open(CREDITS_PATH, "r", encoding="utf-8") as f:
            credits = json.load(f)

    with open(LOG_PATH, "a", encoding="utf-8") as fh:
        for slug, entry in data.items():
            if only and slug not in only:
                continue

            log(f"=== {slug} ===", fh)

            hero_path = os.path.join(COUNTRIES_DIR, f"{slug}.jpg")
            hero_url = entry.get("hero")
            if hero_url and (args.force or not os.path.exists(hero_path)):
                ok = download_and_save(hero_url, hero_path, HERO_MAX_WIDTH, HERO_MIN_WIDTH, fh, "hero")
                if ok:
                    credits[f"{slug}/hero"] = hero_url
            elif hero_url:
                log("    hero уже существует, пропускаю (запусти с --force чтобы перезаписать)", fh)

            gallery = entry.get("gallery", [])
            for i, url in enumerate(gallery, start=1):
                gpath = os.path.join(COUNTRIES_DIR, slug, f"{i}.jpg")
                if not args.force and os.path.exists(gpath):
                    log(f"    {i}.jpg уже существует, пропускаю", fh)
                    continue
                ok = download_and_save(url, gpath, GALLERY_MAX_WIDTH, GALLERY_MIN_WIDTH, fh, f"gallery {i}")
                if ok:
                    credits[f"{slug}/{i}"] = url

    with open(CREDITS_PATH, "w", encoding="utf-8") as f:
        json.dump(credits, f, ensure_ascii=False, indent=2)

    print("\nГотово. Лог:", LOG_PATH)
    print("Атрибуции:", CREDITS_PATH)
    print("Дальше: git add images/countries country_photos.json && git commit -m 'update country photos' && git push origin dev")


if __name__ == "__main__":
    main()

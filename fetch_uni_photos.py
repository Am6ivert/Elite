#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
fetch_uni_photos.py
====================
Скачивает по 4 фото для каждого университета из elite/catalog.jsx
и кладёт их в images/unis/<slug>/1.jpg ... 4.jpg

Источник фото: Wikimedia Commons (бесплатно, без API-ключа, лицензии
CC/PD — разрешено использовать на коммерческом сайте при сохранении
атрибуции; ссылки на авторов сохраняются в credits.json).

ЗАПУСК:
    cd Elite_website
    python3 fetch_uni_photos.py

    # Только конкретные университеты (по полю short), для теста:
    python3 fetch_uni_photos.py --only UniBo,PoliMi

    # Перезаписать уже скачанные фото:
    python3 fetch_uni_photos.py --force

ЗАВИСИМОСТИ:
    pip install requests pillow
"""

import os
import re
import json
import time
import argparse
import sys
from io import BytesIO

try:
    import requests
except ImportError:
    sys.exit("Нужно: pip install requests pillow")

try:
    from PIL import Image
except ImportError:
    sys.exit("Нужно: pip install requests pillow")

# ---------- настройки ----------
ROOT = os.path.dirname(os.path.abspath(__file__))
CATALOG_PATH = os.path.join(ROOT, "elite", "catalog.jsx")
IMAGES_DIR = os.path.join(ROOT, "images", "unis")
CREDITS_PATH = os.path.join(ROOT, "images", "unis", "credits.json")
LOG_PATH = os.path.join(ROOT, "images", "unis", "_fetch_log.txt")

MAX_WIDTH = 1600          # макс. ширина итогового jpg
JPEG_QUALITY = 82
PHOTOS_PER_UNI = 4
REQUEST_DELAY = 0.4       # пауза между запросами к API, чтобы не словить рейт-лимит
USER_AGENT = "EliteAcademyKG-PhotoFetcher/1.0 (contact: admin@eliteacademy.kg)"

HEADERS = {"User-Agent": USER_AGENT}

GALLERY_HINTS = [
    "campus exterior building",
    "main building lecture hall",
    "dormitory student housing",
    "students campus life",
]


def uni_slug(short):
    return re.sub(r"[^a-z0-9]+", "", short.lower())


def parse_catalog(path):
    """Достаёт name/short/loc/country из UNIS_RAW в catalog.jsx без полноценного JS-парсера."""
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    start = content.index("const UNIS_RAW = [")
    # ищем конец массива — баланс скобок
    depth = 0
    i = content.index("[", start)
    j = i
    while True:
        if content[j] == "[":
            depth += 1
        elif content[j] == "]":
            depth -= 1
            if depth == 0:
                break
        j += 1
    block = content[i : j + 1]

    entries = []
    # каждая запись начинается с "{ name:" и заканчивается "},"
    for m in re.finditer(r"\{[^{}]*\}", block):
        chunk = m.group(0)
        name_m = re.search(r'name:\s*"([^"]+)"', chunk)
        short_m = re.search(r'short:\s*"([^"]+)"', chunk)
        loc_m = re.search(r'loc:\s*"([^"]+)"', chunk)
        country_m = re.search(r'country:\s*"([^"]+)"', chunk)
        if name_m and short_m:
            entries.append(
                {
                    "name": name_m.group(1),
                    "short": short_m.group(1),
                    "loc": loc_m.group(1) if loc_m else "",
                    "country": country_m.group(1) if country_m else "",
                }
            )
    return entries


def commons_search_images(query, limit=8):
    """Ищет файлы изображений на Wikimedia Commons по текстовому запросу.
    Возвращает список словарей {title, url, width, height, descriptionurl, credit}."""
    search_url = "https://commons.wikimedia.org/w/api.php"
    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": f"{query} filetype:bitmap",
        "gsrlimit": limit,
        "gsrnamespace": 6,  # File namespace
        "prop": "imageinfo",
        "iiprop": "url|size|extmetadata",
        "iiurlwidth": MAX_WIDTH,
    }
    try:
        r = requests.get(search_url, params=params, headers=HEADERS, timeout=20)
        r.raise_for_status()
        data = r.json()
    except Exception as e:
        print(f"    ! ошибка поиска: {e}")
        return []

    pages = data.get("query", {}).get("pages", {})
    results = []
    for p in pages.values():
        infos = p.get("imageinfo", [])
        if not infos:
            continue
        info = infos[0]
        width = info.get("width", 0)
        height = info.get("height", 0)
        # отбрасываем совсем мелкие/иконки/логотипы
        if width < 500 or height < 350:
            continue
        url = info.get("thumburl") or info.get("url")
        extmeta = info.get("extmetadata", {}) or {}
        artist = extmeta.get("Artist", {}).get("value", "")
        license_short = extmeta.get("LicenseShortName", {}).get("value", "")
        results.append(
            {
                "title": p.get("title", ""),
                "url": url,
                "width": width,
                "height": height,
                "descriptionurl": info.get("descriptionurl", ""),
                "artist": re.sub("<[^<]+?>", "", artist)[:200],
                "license": license_short,
            }
        )
    return results


def download_and_process(url, out_path):
    try:
        r = requests.get(url, headers=HEADERS, timeout=30)
        r.raise_for_status()
        img = Image.open(BytesIO(r.content)).convert("RGB")
        if img.width > MAX_WIDTH:
            ratio = MAX_WIDTH / img.width
            img = img.resize((MAX_WIDTH, int(img.height * ratio)), Image.LANCZOS)
        img.save(out_path, "JPEG", quality=JPEG_QUALITY, optimize=True)
        return True
    except Exception as e:
        print(f"    ! не удалось скачать/обработать {url}: {e}")
        return False


def process_university(uni, force=False, credits=None, log=None):
    short = uni["short"]
    name = uni["name"]
    loc = uni["loc"]
    slug = uni_slug(short)
    out_dir = os.path.join(IMAGES_DIR, slug)
    os.makedirs(out_dir, exist_ok=True)

    print(f"\n=== {name} ({short}) -> images/unis/{slug}/ ===")

    existing = [
        n for n in range(1, PHOTOS_PER_UNI + 1)
        if os.path.exists(os.path.join(out_dir, f"{n}.jpg"))
    ]
    if len(existing) == PHOTOS_PER_UNI and not force:
        print("    уже есть все 4 фото, пропускаю (используй --force для перезаписи)")
        return

    used_titles = set()
    saved = 0

    for idx in range(PHOTOS_PER_UNI):
        n = idx + 1
        out_path = os.path.join(out_dir, f"{n}.jpg")
        if os.path.exists(out_path) and not force:
            saved += 1
            continue

        hint = GALLERY_HINTS[idx]
        queries = [
            f"{name} {hint}",
            f"{name} {loc} university",
            f"{name}",
        ]

        chosen = None
        for q in queries:
            results = commons_search_images(q, limit=8)
            time.sleep(REQUEST_DELAY)
            for res in results:
                if res["title"] in used_titles:
                    continue
                chosen = res
                break
            if chosen:
                break

        if not chosen:
            msg = f"  [{n}] НЕ НАЙДЕНО фото для запроса '{name}'"
            print("    " + msg)
            if log:
                log.write(f"{short}\t{n}\tNOT_FOUND\n")
            continue

        used_titles.add(chosen["title"])
        ok = download_and_process(chosen["url"], out_path)
        if ok:
            saved += 1
            print(f"    [{n}] OK <- {chosen['title']} ({chosen['width']}x{chosen['height']}, {chosen['license']})")
            if credits is not None:
                credits[f"{short}/{n}"] = {
                    "title": chosen["title"],
                    "source": chosen["descriptionurl"],
                    "artist": chosen["artist"],
                    "license": chosen["license"],
                }
            if log:
                log.write(f"{short}\t{n}\tOK\t{chosen['title']}\n")
        else:
            if log:
                log.write(f"{short}\t{n}\tDOWNLOAD_FAILED\t{chosen['title']}\n")

    print(f"    итог: {saved}/{PHOTOS_PER_UNI} фото сохранено")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--only", help="Сделать только эти short, через запятую (для теста)")
    parser.add_argument("--force", action="store_true", help="Перезаписать уже скачанные фото")
    parser.add_argument("--limit", type=int, default=None, help="Обработать только первые N университетов")
    args = parser.parse_args()

    if not os.path.exists(CATALOG_PATH):
        sys.exit(f"Не найден {CATALOG_PATH}. Запускай скрипт из корня репозитория Elite_website.")

    unis = parse_catalog(CATALOG_PATH)
    print(f"Найдено {len(unis)} университетов в catalog.jsx")

    if args.only:
        wanted = set(s.strip() for s in args.only.split(","))
        unis = [u for u in unis if u["short"] in wanted]
        print(f"Фильтр --only: обрабатываю {len(unis)} университетов")

    if args.limit:
        unis = unis[: args.limit]

    os.makedirs(IMAGES_DIR, exist_ok=True)

    credits = {}
    if os.path.exists(CREDITS_PATH):
        with open(CREDITS_PATH, "r", encoding="utf-8") as f:
            try:
                credits = json.load(f)
            except json.JSONDecodeError:
                credits = {}

    with open(LOG_PATH, "a", encoding="utf-8") as log:
        log.write(f"\n--- run {time.strftime('%Y-%m-%d %H:%M:%S')} ---\n")
        for uni in unis:
            try:
                process_university(uni, force=args.force, credits=credits, log=log)
            except KeyboardInterrupt:
                print("\nОстановлено пользователем.")
                break
            except Exception as e:
                print(f"  ! ошибка на {uni['short']}: {e}")
                log.write(f"{uni['short']}\t-\tERROR\t{e}\n")

    with open(CREDITS_PATH, "w", encoding="utf-8") as f:
        json.dump(credits, f, ensure_ascii=False, indent=2)

    print(f"\nГотово. Атрибуции сохранены в {CREDITS_PATH}")
    print(f"Лог сохранён в {LOG_PATH}")
    print("\nДальше: git add images/unis && git commit -m 'add uni photos' && git push origin dev")


if __name__ == "__main__":
    main()

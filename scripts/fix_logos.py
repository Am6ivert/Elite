"""
Скачивает логотипы вузов через Clearbit Logo API.
Запуск: python scripts/fix_logos.py
"""
import urllib.request
import os
import sys

DEST = "images/logos/catalog"

# fname -> домен университета
LOGOS = {
    "unimi.png":    "unimi.it",
    "univpm.png":   "univpm.it",
    "depaul.png":   "depaul.edu",
    "monash.png":   "monash.edu",
    "unm.png":      "nottingham.edu.my",
    "sunway.png":   "sunway.edu.my",
    "swinburne.png":"swinburne.edu.my",
    "apu.png":      "apu.edu.my",
    "uniten.png":   "uniten.edu.my",
    "imu.png":      "imu.edu.my",
    "segi.png":     "segi.edu.my",
    "mahsa.png":    "mahsa.edu.my",
    "uow.png":      "uow.edu.my",
    "vistula.png":  "vistula.edu.pl",
    "pjatk.png":    "pjwstk.edu.pl",
    "eul.png":      "eul.edu.tr",
    "gisma.png":    "gisma.com",
    "lum.png":      "lum.it",
}

HEADERS = {"User-Agent": "Mozilla/5.0 (compatible)"}

ok, fail = 0, []
for fname, domain in LOGOS.items():
    path = os.path.join(DEST, fname)
    url = f"https://logo.clearbit.com/{domain}?size=300"
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as r, open(path, "wb") as f:
            data = r.read()
            f.write(data)
        size = os.path.getsize(path)
        if size < 500:
            print(f"  SKIP  {fname} - too small ({size} bytes)")
            fail.append(fname)
        else:
            print(f"  OK    {fname} - {size} bytes")
            ok += 1
    except Exception as e:
        print(f"  FAIL  {fname} - {e}")
        fail.append(fname)

print(f"\nDone: {ok} downloaded, {len(fail)} failed")
if fail:
    print("Failed:", ", ".join(fail))

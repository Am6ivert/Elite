"""
Download student media from a Google Drive folder, sort by type, rename to lowercase.

Usage:
    python scripts/download_drive.py

Folder structure expected on Drive:
    <country>/<student_name>/video.mp4
    <country>/<student_name>/photo.jpg
    ...

Skips students already downloaded (see SKIP set below).
Outputs a summary table after completion.
"""

import os
import sys
import shutil
import tempfile
import gdown

# ── Config ─────────────────────────────────────────────────────────────────────
DRIVE_FOLDER_URL = "https://drive.google.com/drive/folders/1szXw2AP9_nVOMUzEPAbJYBL2SdnknJNL"

BASE      = os.path.join(os.path.dirname(__file__), "..")
VIDEO_DIR = os.path.abspath(os.path.join(BASE, "videos"))
PHOTO_DIR = os.path.abspath(os.path.join(BASE, "thumbs"))

VIDEO_EXT = {".mp4", ".mov", ".avi", ".mkv"}
PHOTO_EXT = {".jpg", ".jpeg", ".png", ".webp"}

# Students whose files are already present — skip entirely
SKIP = {
    "elana", "nursultan", "anel", "amirkhan", "asema",
    "kaliya", "nurzar", "amir", "islambek", "kenzhekan",
}

os.makedirs(VIDEO_DIR, exist_ok=True)
os.makedirs(PHOTO_DIR, exist_ok=True)


# ── Download to temp dir ────────────────────────────────────────────────────────
tmp = tempfile.mkdtemp(prefix="elite_drive_")
print(f"\nDownloading Drive folder to temp: {tmp}")
print("This may take a while depending on folder size...\n")

try:
    gdown.download_folder(
        url=DRIVE_FOLDER_URL,
        output=tmp,
        quiet=False,
        use_cookies=False,
    )
except Exception as e:
    print(f"\n[WARN] gdown error (continuing with what was downloaded): {e}")


# ── Walk downloaded tree and sort files ────────────────────────────────────────
# Expected layout after gdown:  tmp/<folder_name>/<country>/<student>/<file>
#   or flatter depending on the Drive structure.
# We try to infer country and student from path components.

results = []   # (filename, country, student)

def classify(path):
    ext = os.path.splitext(path)[1].lower()
    if ext in VIDEO_EXT:
        return VIDEO_DIR, ext
    if ext in PHOTO_EXT:
        return PHOTO_DIR, ext
    return None, ext

def path_parts_above(filepath, root):
    """Return path components between root and the file, as a list."""
    rel = os.path.relpath(filepath, root)
    parts = rel.replace("\\", "/").split("/")
    return parts  # e.g. ['Italy', 'elena', 'video.mp4']

for dirpath, dirnames, filenames in os.walk(tmp):
    for fname in filenames:
        src = os.path.join(dirpath, fname)
        dest_dir, ext = classify(src)
        if dest_dir is None:
            continue  # not a supported type

        # Infer student name from parent folder, country from grandparent
        parts = path_parts_above(src, tmp)
        # parts[-1] = filename, parts[-2] = student folder, parts[-3] = country folder
        student = parts[-2].lower() if len(parts) >= 2 else "unknown"
        country  = parts[-3].lower() if len(parts) >= 3 else "unknown"

        if student in SKIP:
            print(f"  skip  {student}/{fname}  (already exists)")
            continue

        new_fname = fname.lower()
        dest = os.path.join(dest_dir, new_fname)

        if os.path.exists(dest):
            print(f"  skip  {new_fname}  (file already in output)")
            results.append((new_fname, country, student, "skipped"))
            continue

        shutil.copy2(src, dest)
        kind = "video" if dest_dir == VIDEO_DIR else "photo"
        print(f"  {kind:5s}  {new_fname}  ←  {country}/{student}/")
        results.append((new_fname, country, student, "downloaded"))

# ── Cleanup temp ───────────────────────────────────────────────────────────────
shutil.rmtree(tmp, ignore_errors=True)

# ── Summary table ──────────────────────────────────────────────────────────────
print("\n" + "─" * 70)
print(f"{'Файл':<30}  {'Страна':<15}  {'Студент':<15}  Статус")
print("─" * 70)
for row in results:
    fname, country, student, status = row
    print(f"{fname:<30}  {country:<15}  {student:<15}  {status}")

if not results:
    print("  (нет новых файлов)")

print("─" * 70)
downloaded = sum(1 for r in results if r[3] == "downloaded")
skipped    = sum(1 for r in results if r[3] == "skipped")
print(f"\nИтого: {downloaded} скачано, {skipped} пропущено.")
print(f"Видео → {VIDEO_DIR}")
print(f"Фото  → {PHOTO_DIR}\n")

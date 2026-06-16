import os, shutil

tmp = r'C:\Users\arsen\AppData\Local\Temp\elite_drive_v4krctjh'
BASE = r'D:\Elite 2\Elite_website'
VIDEO_DIR = os.path.join(BASE, 'videos')
PHOTO_DIR = os.path.join(BASE, 'thumbs')
VIDEO_EXT = {'.mp4', '.mov', '.avi', '.mkv'}
PHOTO_EXT = {'.jpg', '.jpeg', '.png', '.webp'}
SKIP = {'elana','nursultan','anel','amirkhan','asema','kaliya','nurzar','amir','islambek','kenzhekan'}

os.makedirs(VIDEO_DIR, exist_ok=True)
os.makedirs(PHOTO_DIR, exist_ok=True)

results = []
for dirpath, dirnames, filenames in os.walk(tmp):
    for fname in filenames:
        src = os.path.join(dirpath, fname)
        ext = os.path.splitext(fname)[1].lower()
        if ext in VIDEO_EXT:
            dest_dir = VIDEO_DIR
        elif ext in PHOTO_EXT:
            dest_dir = PHOTO_DIR
        else:
            continue

        rel = os.path.relpath(src, tmp)
        parts = rel.split(os.sep)
        student = parts[-2].lower().strip() if len(parts) >= 2 else 'unknown'
        country  = parts[-3].lower().strip() if len(parts) >= 3 else 'unknown'

        if any(s in student for s in SKIP):
            print(f'  skip  {student}/{fname}')
            continue

        new_fname = fname.lower()
        dest = os.path.join(dest_dir, new_fname)
        if os.path.exists(dest):
            print(f'  exists {new_fname}')
            results.append((new_fname, country, student, 'exists'))
            continue

        shutil.copy2(src, dest)
        kind = 'video' if dest_dir == VIDEO_DIR else 'photo'
        print(f'  {kind:5s}  {new_fname}  <-  {country}/{student}/')
        results.append((new_fname, country, student, 'downloaded'))

print()
print('-'*60)
for r in results:
    print(f'{r[0]:<35} {r[1]:<15} {r[3]}')
print()
print(f'Итого: {sum(1 for r in results if r[3]=="downloaded")} скачано, {sum(1 for r in results if r[3]=="exists")} уже было')

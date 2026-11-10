import os
import shutil

src_dir = 'assets/science/7_1_questions'
dest_dirs = [
    'oyunlar/assets/science/7_1_questions',
    '../assets/science/7_1_questions',
    '../oyunlar/assets/science/7_1_questions'
]

for d in dest_dirs:
    os.makedirs(d, exist_ok=True)
    for fname in os.listdir(src_dir):
        src_path = os.path.join(src_dir, fname)
        if os.path.isfile(src_path):
            shutil.copyfile(src_path, os.path.join(d, fname))
            print(f"Copied {fname} to {d}")

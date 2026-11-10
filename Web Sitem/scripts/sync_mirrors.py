import os
import shutil

src = 'oyunlar/uzay-ekspresi-7.html'
dst_dirs = ['../oyunlar', '../Eğitsel Oyun']
for d in dst_dirs:
    if os.path.exists(d):
        target = os.path.join(d, 'uzay-ekspresi-7.html')
        shutil.copyfile(src, target)
        print(f"Copied to {target}")
    else:
        print(f"Directory {d} does not exist.")

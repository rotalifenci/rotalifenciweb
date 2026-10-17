import shutil
import os

source_dir = r"c:\Users\my pc\Desktop\Antgravity Rotalı Fenci\Yaprak Test\public\images"
site_dir = r"c:\Users\my pc\Desktop\Antgravity Rotalı Fenci\Web Sitem"
root_dir = r"c:\Users\my pc\Desktop\Antgravity Rotalı Fenci"

files = {
    "moon.jpg": "slide_16_moon_globe.jpg",
    "earth.jpg": "slide_earth_hd.jpg",
    "sun.jpg": "slide_sun_hd.jpg"
}

destinations = [
    os.path.join(site_dir, "assets", "slides"),
    os.path.join(site_dir, "public", "assets", "slides"),
    os.path.join(root_dir, "assets", "slides"),
    os.path.join(root_dir, "public", "assets", "slides"),
]

for d in destinations:
    os.makedirs(d, exist_ok=True)

for src_name, dest_name in files.items():
    src = os.path.join(source_dir, src_name)
    for d in destinations:
        dest = os.path.join(d, dest_name)
        shutil.copy2(src, dest)
        print(f"Copied {src} -> {dest}")

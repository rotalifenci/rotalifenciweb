import shutil
import os

brain_dir = r"C:\Users\my pc\.gemini\antigravity\brain\76e370d0-33ce-4a14-8375-08210d748d8a"
site_dir = r"c:\Users\my pc\Desktop\Antgravity Rotalı Fenci\Web Sitem"
root_dir = r"c:\Users\my pc\Desktop\Antgravity Rotalı Fenci"

files = {
    "evren_uzay_hierarchy_1792262829807.jpg": "slide_3_universe_space.jpg",
    "earth_blue_planet_1792262828488.jpg": "slide_4_earth_globe.jpg",
    "sun_layers_cutaway_1792262834403.jpg": "slide_7_sun_layers.jpg",
    "solar_nuclear_fusion_1792262830531.jpg": "slide_8_fusion_energy.jpg",
    "sun_axial_rotation_1792262836669.jpg": "slide_12_sun_rotation.jpg",
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
    src_path = os.path.join(brain_dir, src_name)
    if os.path.exists(src_path):
        for d in destinations:
            target = os.path.join(d, dest_name)
            shutil.copy2(src_path, target)
            print(f"Copied {src_name} -> {target}")
    else:
        print(f"MISSING: {src_path}")

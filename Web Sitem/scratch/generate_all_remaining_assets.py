from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
import os
import shutil
import math

site_dir = r"c:\Users\my pc\Desktop\Antgravity Rotalı Fenci\Web Sitem"
root_dir = r"c:\Users\my pc\Desktop\Antgravity Rotalı Fenci"
dest_site = os.path.join(site_dir, "assets", "slides")
dest_root = os.path.join(root_dir, "assets", "slides")

moon = Image.open(os.path.join(dest_site, "slide_16_moon_globe.jpg")).convert("RGBA")
earth = Image.open(os.path.join(dest_site, "slide_earth_hd.jpg")).convert("RGBA")
sun = Image.open(os.path.join(dest_site, "slide_sun_hd.jpg")).convert("RGBA")
astronaut_path = os.path.join(site_dir, "assets", "sunum5", "elements", "astronaut_sample.png")
astro = Image.open(astronaut_path).convert("RGBA") if os.path.exists(astronaut_path) else None

def save_all(img, filename):
    for folder in [dest_site, dest_root, os.path.join(site_dir, "public", "assets", "slides"), os.path.join(root_dir, "public", "assets", "slides")]:
        os.makedirs(folder, exist_ok=True)
        img.convert("RGB").save(os.path.join(folder, filename), quality=95)
    print(f"Saved: {filename}")

# 1. SLAYT 10: Size Comparison (Gargantuan Sun vs Tiny Earth)
bg_10 = Image.new("RGBA", (1920, 1080), (5, 8, 22, 255))
# Immense sun on left filling almost entire height
sun_huge = sun.resize((1500, 1500), Image.Resampling.LANCZOS)
bg_10.paste(sun_huge, (-400, -210), sun_huge)
# Earth small on right
earth_tiny = earth.resize((45, 45), Image.Resampling.LANCZOS)
bg_10.paste(earth_tiny, (1450, 520), earth_tiny)
# Moon microscopic next to earth
moon_micro = moon.resize((12, 12), Image.Resampling.LANCZOS)
bg_10.paste(moon_micro, (1530, 536), moon_micro)
save_all(bg_10, "slide_10_size_comparison.jpg")

# 2. SLAYT 32: Hilal (Crescent Moon)
W, H = moon.size
R = W // 2
hilal_moon = moon.copy()
# Draw crescent mask
for x in range(W):
    for y in range(H):
        # Calculate distance from shifted circle
        d1 = math.hypot(x - R, y - R)
        d2 = math.hypot(x - (R - 120), y - R)
        if d1 < R:
            if not (d2 >= R - 40 and x > R - 100):
                r, g, b, a = hilal_moon.getpixel((x, y))
                hilal_moon.putpixel((x, y), (int(r * 0.05), int(g * 0.05), int(b * 0.05), a))
bg_32 = Image.new("RGBA", (1920, 1080), (5, 8, 22, 255))
hilal_resized = hilal_moon.resize((840, 840), Image.Resampling.LANCZOS)
bg_32.paste(hilal_resized, (540, 120), hilal_resized)
save_all(bg_32, "slide_32_hilal.jpg")

# 3. SLAYT 33: Şişkin Ay (Gibbous Moon)
siskin_moon = moon.copy()
for x in range(W):
    for y in range(H):
        d1 = math.hypot(x - R, y - R)
        if d1 < R and x < R - 200:
            factor = max(0.06, (x / (R - 200)) * 0.4)
            r, g, b, a = siskin_moon.getpixel((x, y))
            siskin_moon.putpixel((x, y), (int(r * factor), int(g * factor), int(b * factor), a))
bg_33 = Image.new("RGBA", (1920, 1080), (5, 8, 22, 255))
siskin_resized = siskin_moon.resize((840, 840), Image.Resampling.LANCZOS)
bg_33.paste(siskin_resized, (540, 120), siskin_resized)
save_all(bg_33, "slide_33_siskin_ay.jpg")

# 4. SLAYT 20: Astronaut on Moon Jumping (1/6 gravity)
bg_20 = Image.new("RGBA", (1920, 1080), (4, 6, 18, 255))
# Lunar horizon at bottom
moon_surface = moon.crop((0, int(H*0.6), W, H)).resize((1920, 500), Image.Resampling.LANCZOS)
bg_20.paste(moon_surface, (0, 580), moon_surface)
# Distant blue Earth in dark sky
earth_sky = earth.resize((260, 260), Image.Resampling.LANCZOS)
bg_20.paste(earth_sky, (1400, 120), earth_sky)
if astro:
    astro_jump = astro.resize((480, 560), Image.Resampling.LANCZOS)
    bg_20.paste(astro_jump, (700, 320), astro_jump)
save_all(bg_20, "slide_20_astronaut_gravity.jpg")

# 5. SLAYT 19: Lunar atmosphere absence, footprint, and silent vacuum
bg_19 = Image.new("RGBA", (1920, 1080), (3, 5, 15, 255))
# Lunar ground closeup
lunar_ground = moon.crop((int(W*0.2), int(H*0.4), int(W*0.8), int(H*0.9))).resize((1920, 680), Image.Resampling.LANCZOS)
bg_19.paste(lunar_ground, (0, 400), lunar_ground)
# Big Earth floating silently
bg_19.paste(earth_sky, (200, 80), earth_sky)
if astro:
    astro_stand = astro.resize((360, 420), Image.Resampling.LANCZOS)
    bg_19.paste(astro_stand, (1200, 480), astro_stand)
save_all(bg_19, "slide_19_moon_atmosphere.jpg")

# 6. SLAYT 23: Ay'ın 3 Hareketi (Orbits Diagram)
bg_23 = Image.new("RGBA", (1920, 1080), (5, 8, 24, 255))
# Radiant Sun on left
sun_23 = sun.resize((380, 380), Image.Resampling.LANCZOS)
bg_23.paste(sun_23, (60, 350), sun_23)
# Earth in center
earth_23 = earth.resize((260, 260), Image.Resampling.LANCZOS)
bg_23.paste(earth_23, (900, 410), earth_23)
# Moon orbiting Earth
moon_23 = moon.resize((100, 100), Image.Resampling.LANCZOS)
bg_23.paste(moon_23, (1320, 490), moon_23)
save_all(bg_23, "slide_23_moon_motions.jpg")

# 7. SLAYT 34: 8 Evre Kusursuz Döngüsü (Master 8 Phases Wheel)
bg_34 = Image.new("RGBA", (1920, 1080), (5, 8, 22, 255))
# Center: Earth
earth_center = earth.resize((220, 220), Image.Resampling.LANCZOS)
bg_34.paste(earth_center, (850, 430), earth_center)
# Sunbeams on left edge
sun_side = sun.resize((240, 240), Image.Resampling.LANCZOS)
bg_34.paste(sun_side, (20, 420), sun_side)
# 8 Moons in orbit around Earth
orbit_r = 340
cx, cy = 960, 540
for i in range(8):
    angle = i * (2 * math.pi / 8)
    mx = int(cx + orbit_r * math.cos(angle) - 45)
    my = int(cy + orbit_r * math.sin(angle) - 45)
    m_thumb = moon.resize((90, 90), Image.Resampling.LANCZOS)
    bg_34.paste(m_thumb, (mx, my), m_thumb)
save_all(bg_34, "slide_34_eight_phases.jpg")

# 8. SLAYT 37: Nesne Eşleştirme (Futbol topu, Nohut, Mercimek)
bg_37 = Image.new("RGBA", (1920, 1080), (5, 8, 22, 255))
# Sun / Futbol topu on left
sun_ball = sun.resize((560, 560), Image.Resampling.LANCZOS)
bg_37.paste(sun_ball, (120, 260), sun_ball)
# Earth / Nohut in middle
earth_nohut = earth.resize((160, 160), Image.Resampling.LANCZOS)
bg_37.paste(earth_nohut, (960, 460), earth_nohut)
# Moon / Mercimek on right
moon_mercimek = moon.resize((60, 60), Image.Resampling.LANCZOS)
bg_37.paste(moon_mercimek, (1480, 510), moon_mercimek)
save_all(bg_37, "slide_37_model_objects.jpg")

print("All remaining slide visuals created successfully!")

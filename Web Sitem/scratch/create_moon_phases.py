from PIL import Image, ImageEnhance, ImageFilter, ImageDraw
import os
import shutil

site_dir = r"c:\Users\my pc\Desktop\Antgravity Rotalı Fenci\Web Sitem"
root_dir = r"c:\Users\my pc\Desktop\Antgravity Rotalı Fenci"
dest_site = os.path.join(site_dir, "assets", "slides")
dest_root = os.path.join(root_dir, "assets", "slides")

moon_path = os.path.join(dest_site, "slide_16_moon_globe.jpg")
base_moon = Image.open(moon_path).convert("RGB")
W, H = base_moon.size
R = W // 2

def make_16_9(img, width=900, height=900):
    bg = Image.new("RGB", (1920, 1080), (5, 8, 22))
    resized = img.resize((width, height), Image.Resampling.LANCZOS)
    x = (1920 - width) // 2
    y = (1080 - height) // 2
    bg.paste(resized, (x, y))
    return bg

# 1. Dolunay (Full Moon)
full_bg = make_16_9(base_moon)
full_bg.save(os.path.join(dest_site, "slide_30_dolunay.jpg"), quality=95)
full_bg.save(os.path.join(dest_root, "slide_30_dolunay.jpg"), quality=95)
print("Saved slide_30_dolunay.jpg")

# 2. İlk Dördün (Right Half Illuminated - D Shape)
ilk_moon = base_moon.copy()
draw_ilk = ImageDraw.Draw(ilk_moon)
# Darken left half
for x in range(R):
    factor = 0.05 + 0.1 * (x / R)
    # We can darken left side using rectangle columns
    col = ilk_moon.crop((x, 0, x+1, H))
    col = ImageEnhance.Brightness(col).enhance(factor)
    ilk_moon.paste(col, (x, 0))

ilk_bg = make_16_9(ilk_moon)
ilk_bg.save(os.path.join(dest_site, "slide_29_ilk_dordun.jpg"), quality=95)
ilk_bg.save(os.path.join(dest_root, "slide_29_ilk_dordun.jpg"), quality=95)
print("Saved slide_29_ilk_dordun.jpg")

# 3. Son Dördün (Left Half Illuminated - Inverted D Shape)
son_moon = base_moon.copy()
for x in range(R, W):
    factor = 0.05 + 0.1 * ((W - x) / R)
    col = son_moon.crop((x, 0, x+1, H))
    col = ImageEnhance.Brightness(col).enhance(factor)
    son_moon.paste(col, (x, 0))

son_bg = make_16_9(son_moon)
son_bg.save(os.path.join(dest_site, "slide_31_son_dordun.jpg"), quality=95)
son_bg.save(os.path.join(dest_root, "slide_31_son_dordun.jpg"), quality=95)
print("Saved slide_31_son_dordun.jpg")

# 4. Yeni Ay (New Moon)
yeni_moon = ImageEnhance.Brightness(base_moon).enhance(0.06)
yeni_bg = make_16_9(yeni_moon)
yeni_bg.save(os.path.join(dest_site, "slide_28_yeni_ay.jpg"), quality=95)
yeni_bg.save(os.path.join(dest_root, "slide_28_yeni_ay.jpg"), quality=95)
print("Saved slide_28_yeni_ay.jpg")

# 5. Krater Detay (Slide 18 closeup)
krater_crop = base_moon.crop((int(W*0.2), int(H*0.4), int(W*0.8), int(H*0.95)))
krater_crop = ImageEnhance.Contrast(krater_crop).enhance(1.4)
krater_crop = krater_crop.filter(ImageFilter.SHARPEN)
krater_bg = Image.new("RGB", (1920, 1080), (5, 8, 22))
krater_resized = krater_crop.resize((1400, 980), Image.Resampling.LANCZOS)
krater_bg.paste(krater_resized, (260, 50))
krater_bg.save(os.path.join(dest_site, "slide_18_krater_detay.jpg"), quality=95)
krater_bg.save(os.path.join(dest_root, "slide_18_krater_detay.jpg"), quality=95)
print("Saved slide_18_krater_detay.jpg")

# Copy also to public folders
for pub in [os.path.join(site_dir, "public", "assets", "slides"), os.path.join(root_dir, "public", "assets", "slides")]:
    os.makedirs(pub, exist_ok=True)
    for fn in ["slide_30_dolunay.jpg", "slide_29_ilk_dordun.jpg", "slide_31_son_dordun.jpg", "slide_28_yeni_ay.jpg", "slide_18_krater_detay.jpg"]:
        shutil.copy2(os.path.join(dest_site, fn), os.path.join(pub, fn))

print("SUCCESS: All moon assets created and copied!")

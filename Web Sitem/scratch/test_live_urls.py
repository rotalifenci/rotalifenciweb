import urllib.request

urls = [
    "https://rotali-fenci.vercel.app/sunumlar/5-sinif-1-unite-gunes-dunya-ay.html",
    "https://rotali-fenci.vercel.app/assets/slides/slide_10_size_comparison.jpg",
    "https://rotali-fenci.vercel.app/assets/slides/slide_19_moon_atmosphere.jpg",
    "https://rotali-fenci.vercel.app/assets/slides/slide_20_astronaut_gravity.jpg",
    "https://rotali-fenci.vercel.app/assets/slides/slide_23_moon_motions.jpg",
    "https://rotali-fenci.vercel.app/assets/slides/slide_32_hilal.jpg",
    "https://rotali-fenci.vercel.app/assets/slides/slide_33_siskin_ay.jpg",
    "https://rotali-fenci.vercel.app/assets/slides/slide_34_eight_phases.jpg",
    "https://rotali-fenci.vercel.app/assets/slides/slide_37_model_objects.jpg"
]

for url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            print(f"{resp.status} OK: {url.split('/')[-1]}")
    except Exception as e:
        print(f"FAILED: {url} -> {e}")

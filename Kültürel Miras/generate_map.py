import json
import math

# All 81 Provinces of Turkey with real (lat, lon) coordinates, plate codes, names, and regions
PROVINCES = [
    {"plaka": "01", "id": "adana", "name": "Adana", "region": "Akdeniz", "lat": 37.00, "lon": 35.32},
    {"plaka": "02", "id": "adiyaman", "name": "Adıyaman", "region": "Güneydoğu Anadolu", "lat": 37.76, "lon": 38.28},
    {"plaka": "03", "id": "afyonkarahisar", "name": "Afyonkarahisar", "region": "Ege", "lat": 38.75, "lon": 30.54},
    {"plaka": "04", "id": "agri", "name": "Ağrı", "region": "Doğu Anadolu", "lat": 39.72, "lon": 43.05},
    {"plaka": "05", "id": "amasya", "name": "Amasya", "region": "Karadeniz", "lat": 40.65, "lon": 35.83},
    {"plaka": "06", "id": "ankara", "name": "Ankara", "region": "İç Anadolu", "lat": 39.93, "lon": 32.85},
    {"plaka": "07", "id": "antalya", "name": "Antalya", "region": "Akdeniz", "lat": 36.90, "lon": 30.69},
    {"plaka": "08", "id": "artvin", "name": "Artvin", "region": "Karadeniz", "lat": 41.18, "lon": 41.82},
    {"plaka": "09", "id": "aydin", "name": "Aydın", "region": "Ege", "lat": 37.84, "lon": 27.84},
    {"plaka": "10", "id": "balikesir", "name": "Balıkesir", "region": "Marmara", "lat": 39.65, "lon": 27.88},
    {"plaka": "11", "id": "bilecik", "name": "Bilecik", "region": "Marmara", "lat": 40.14, "lon": 29.98},
    {"plaka": "12", "id": "bingol", "name": "Bingöl", "region": "Doğu Anadolu", "lat": 38.88, "lon": 40.50},
    {"plaka": "13", "id": "bitlis", "name": "Bitlis", "region": "Doğu Anadolu", "lat": 38.40, "lon": 42.11},
    {"plaka": "14", "id": "bolu", "name": "Bolu", "region": "Karadeniz", "lat": 40.73, "lon": 31.61},
    {"plaka": "15", "id": "burdur", "name": "Burdur", "region": "Akdeniz", "lat": 37.72, "lon": 30.29},
    {"plaka": "16", "id": "bursa", "name": "Bursa", "region": "Marmara", "lat": 40.18, "lon": 29.06},
    {"plaka": "17", "id": "canakkale", "name": "Çanakkale", "region": "Marmara", "lat": 40.15, "lon": 26.41},
    {"plaka": "18", "id": "cankiri", "name": "Çankırı", "region": "İç Anadolu", "lat": 40.60, "lon": 33.62},
    {"plaka": "19", "id": "corum", "name": "Çorum", "region": "Karadeniz", "lat": 40.55, "lon": 34.95},
    {"plaka": "20", "id": "denizli", "name": "Denizli", "region": "Ege", "lat": 37.77, "lon": 29.09},
    {"plaka": "21", "id": "diyarbakir", "name": "Diyarbakır", "region": "Güneydoğu Anadolu", "lat": 37.91, "lon": 40.23},
    {"plaka": "22", "id": "edirne", "name": "Edirne", "region": "Marmara", "lat": 41.68, "lon": 26.56},
    {"plaka": "23", "id": "elazig", "name": "Elazığ", "region": "Doğu Anadolu", "lat": 38.67, "lon": 39.22},
    {"plaka": "24", "id": "erzincan", "name": "Erzincan", "region": "Doğu Anadolu", "lat": 39.75, "lon": 39.49},
    {"plaka": "25", "id": "erzurum", "name": "Erzurum", "region": "Doğu Anadolu", "lat": 39.90, "lon": 41.27},
    {"plaka": "26", "id": "eskisehir", "name": "Eskişehir", "region": "İç Anadolu", "lat": 39.77, "lon": 30.52},
    {"plaka": "27", "id": "gaziantep", "name": "Gaziantep", "region": "Güneydoğu Anadolu", "lat": 37.06, "lon": 37.38},
    {"plaka": "28", "id": "giresun", "name": "Giresun", "region": "Karadeniz", "lat": 40.91, "lon": 38.39},
    {"plaka": "29", "id": "gumushane", "name": "Gümüşhane", "region": "Karadeniz", "lat": 40.46, "lon": 39.48},
    {"plaka": "30", "id": "hakkari", "name": "Hakkâri", "region": "Doğu Anadolu", "lat": 37.57, "lon": 43.74},
    {"plaka": "31", "id": "hatay", "name": "Hatay", "region": "Akdeniz", "lat": 36.40, "lon": 36.35},
    {"plaka": "32", "id": "isparta", "name": "Isparta", "region": "Akdeniz", "lat": 37.76, "lon": 30.55},
    {"plaka": "33", "id": "mersin", "name": "Mersin", "region": "Akdeniz", "lat": 36.80, "lon": 34.00},
    {"plaka": "34", "id": "istanbul", "name": "İstanbul", "region": "Marmara", "lat": 41.08, "lon": 28.95},
    {"plaka": "35", "id": "izmir", "name": "İzmir", "region": "Ege", "lat": 38.42, "lon": 27.14},
    {"plaka": "36", "id": "kars", "name": "Kars", "region": "Doğu Anadolu", "lat": 40.60, "lon": 43.09},
    {"plaka": "37", "id": "kastamonu", "name": "Kastamonu", "region": "Karadeniz", "lat": 41.38, "lon": 33.78},
    {"plaka": "38", "id": "kayseri", "name": "Kayseri", "region": "İç Anadolu", "lat": 38.73, "lon": 35.48},
    {"plaka": "39", "id": "kirklareli", "name": "Kırklareli", "region": "Marmara", "lat": 41.73, "lon": 27.22},
    {"plaka": "40", "id": "kirsehir", "name": "Kırşehir", "region": "İç Anadolu", "lat": 39.15, "lon": 34.16},
    {"plaka": "41", "id": "kocaeli", "name": "Kocaeli", "region": "Marmara", "lat": 40.82, "lon": 29.92},
    {"plaka": "42", "id": "konya", "name": "Konya", "region": "İç Anadolu", "lat": 37.87, "lon": 32.48},
    {"plaka": "43", "id": "kutahya", "name": "Kütahya", "region": "Ege", "lat": 39.42, "lon": 29.98},
    {"plaka": "44", "id": "malatya", "name": "Malatya", "region": "Doğu Anadolu", "lat": 38.35, "lon": 38.31},
    {"plaka": "45", "id": "manisa", "name": "Manisa", "region": "Ege", "lat": 38.61, "lon": 27.43},
    {"plaka": "46", "id": "kahramanmaras", "name": "Kahramanmaraş", "region": "Akdeniz", "lat": 37.58, "lon": 36.93},
    {"plaka": "47", "id": "mardin", "name": "Mardin", "region": "Güneydoğu Anadolu", "lat": 37.31, "lon": 40.74},
    {"plaka": "48", "id": "mugla", "name": "Muğla", "region": "Ege", "lat": 37.21, "lon": 28.36},
    {"plaka": "49", "id": "mus", "name": "Muş", "region": "Doğu Anadolu", "lat": 38.74, "lon": 41.50},
    {"plaka": "50", "id": "nevsehir", "name": "Nevşehir", "region": "İç Anadolu", "lat": 38.62, "lon": 34.71},
    {"plaka": "51", "id": "nigde", "name": "Niğde", "region": "İç Anadolu", "lat": 37.97, "lon": 34.68},
    {"plaka": "52", "id": "ordu", "name": "Ordu", "region": "Karadeniz", "lat": 40.98, "lon": 37.88},
    {"plaka": "53", "id": "rize", "name": "Rize", "region": "Karadeniz", "lat": 41.02, "lon": 40.52},
    {"plaka": "54", "id": "sakarya", "name": "Sakarya", "region": "Marmara", "lat": 40.77, "lon": 30.40},
    {"plaka": "55", "id": "samsun", "name": "Samsun", "region": "Karadeniz", "lat": 41.29, "lon": 36.33},
    {"plaka": "56", "id": "siirt", "name": "Siirt", "region": "Güneydoğu Anadolu", "lat": 37.93, "lon": 41.94},
    {"plaka": "57", "id": "sinop", "name": "Sinop", "region": "Karadeniz", "lat": 42.02, "lon": 35.15},
    {"plaka": "58", "id": "sivas", "name": "Sivas", "region": "İç Anadolu", "lat": 39.75, "lon": 37.01},
    {"plaka": "59", "id": "tekirdag", "name": "Tekirdağ", "region": "Marmara", "lat": 40.98, "lon": 27.51},
    {"plaka": "60", "id": "tokat", "name": "Tokat", "region": "Karadeniz", "lat": 40.31, "lon": 36.55},
    {"plaka": "61", "id": "trabzon", "name": "Trabzon", "region": "Karadeniz", "lat": 41.00, "lon": 39.72},
    {"plaka": "62", "id": "tunceli", "name": "Tunceli", "region": "Doğu Anadolu", "lat": 39.11, "lon": 39.55},
    {"plaka": "63", "id": "sanliurfa", "name": "Şanlıurfa", "region": "Güneydoğu Anadolu", "lat": 37.16, "lon": 38.79},
    {"plaka": "64", "id": "usak", "name": "Uşak", "region": "Ege", "lat": 38.68, "lon": 29.41},
    {"plaka": "65", "id": "van", "name": "Van", "region": "Doğu Anadolu", "lat": 38.49, "lon": 43.38},
    {"plaka": "66", "id": "yozgat", "name": "Yozgat", "region": "İç Anadolu", "lat": 39.82, "lon": 34.81},
    {"plaka": "67", "id": "zonguldak", "name": "Zonguldak", "region": "Karadeniz", "lat": 41.45, "lon": 31.79},
    {"plaka": "68", "id": "aksaray", "name": "Aksaray", "region": "İç Anadolu", "lat": 38.37, "lon": 34.03},
    {"plaka": "69", "id": "bayburt", "name": "Bayburt", "region": "Karadeniz", "lat": 40.26, "lon": 40.23},
    {"plaka": "70", "id": "karaman", "name": "Karaman", "region": "İç Anadolu", "lat": 37.18, "lon": 33.22},
    {"plaka": "71", "id": "kirikkale", "name": "Kırıkkale", "region": "İç Anadolu", "lat": 39.84, "lon": 33.51},
    {"plaka": "72", "id": "batman", "name": "Batman", "region": "Güneydoğu Anadolu", "lat": 37.88, "lon": 41.13},
    {"plaka": "73", "id": "sirnak", "name": "Şırnak", "region": "Güneydoğu Anadolu", "lat": 37.52, "lon": 42.46},
    {"plaka": "74", "id": "bartin", "name": "Bartın", "region": "Karadeniz", "lat": 41.63, "lon": 32.34},
    {"plaka": "75", "id": "ardahan", "name": "Ardahan", "region": "Doğu Anadolu", "lat": 41.11, "lon": 42.70},
    {"plaka": "76", "id": "igdir", "name": "Iğdır", "region": "Doğu Anadolu", "lat": 39.92, "lon": 44.04},
    {"plaka": "77", "id": "yalova", "name": "Yalova", "region": "Marmara", "lat": 40.65, "lon": 29.27},
    {"plaka": "78", "id": "karabuk", "name": "Karabük", "region": "Karadeniz", "lat": 41.20, "lon": 32.62},
    {"plaka": "79", "id": "kilis", "name": "Kilis", "region": "Güneydoğu Anadolu", "lat": 36.72, "lon": 37.12},
    {"plaka": "80", "id": "osmaniye", "name": "Osmaniye", "region": "Akdeniz", "lat": 37.07, "lon": 36.25},
    {"plaka": "81", "id": "duzce", "name": "Düzce", "region": "Karadeniz", "lat": 40.84, "lon": 31.16},
]

# Detailed geographic border of Turkey (lon, lat) clockwise starting from NW Thrace
TURKEY_OUTLINE = [
    (26.05, 41.72), (26.35, 41.95), (26.90, 42.08), (27.55, 42.00), (28.02, 41.98),
    (28.15, 41.65), (28.55, 41.42), (29.02, 41.26), (29.22, 41.22), (29.65, 41.18),
    (30.15, 41.18), (30.85, 41.12), (31.35, 41.30), (31.80, 41.52), (32.35, 41.76),
    (32.95, 41.96), (33.65, 42.02), (34.40, 42.06), (35.15, 42.10), (35.45, 41.75),
    (35.95, 41.68), (36.45, 41.38), (36.95, 41.32), (37.50, 41.10), (38.20, 40.98),
    (38.95, 41.05), (39.65, 41.06), (40.35, 41.05), (41.05, 41.28), (41.55, 41.52),
    (42.10, 41.48), (42.75, 41.55), (43.25, 41.15), (43.65, 40.55), (43.80, 40.15),
    (44.80, 39.72), (44.55, 39.38), (44.28, 39.00), (44.38, 38.45), (44.32, 37.90),
    (44.75, 37.35), (44.10, 37.18), (43.25, 37.22), (42.55, 37.12), (42.15, 37.08),
    (41.45, 37.06), (40.65, 37.08), (39.85, 36.82), (38.80, 36.70), (38.05, 36.80),
    (37.35, 36.65), (36.70, 36.62), (36.58, 36.15), (36.12, 35.85), (35.85, 36.25),
    (35.95, 36.65), (35.50, 36.55), (34.95, 36.72), (34.25, 36.48), (33.75, 36.12),
    (32.85, 36.02), (32.15, 36.35), (31.55, 36.68), (30.75, 36.82), (30.45, 36.22),
    (29.65, 36.15), (29.10, 36.55), (28.55, 36.72), (27.95, 36.65), (27.25, 37.02),
    (27.15, 37.55), (26.85, 37.95), (26.32, 38.28), (26.82, 38.68), (26.75, 39.25),
    (26.15, 39.52), (26.18, 40.02), (26.35, 40.35), (26.18, 40.62), (26.85, 40.68),
    (27.45, 40.92), (27.95, 41.00), (28.55, 40.98), (28.95, 40.98), (29.22, 40.82),
    (29.02, 40.65), (29.55, 40.68), (29.35, 40.42), (28.65, 40.35), (27.85, 40.46),
    (27.15, 40.40), (26.55, 40.15), (26.25, 40.25), (26.68, 40.58), (26.05, 40.82),
    (26.35, 41.15), (26.52, 41.40)
]

# Wait: instead of having Marmara Sea split the single polygon in a complicated self-intersecting way,
# let's define clean outer boundary of Turkey including Marmara region, and we can draw Sea of Marmara / Lake Van / Tuz Gölü as decorative water layers or clean coastal curves!
TURKEY_CLEAN_POLY = [
    (26.04, 41.72), (26.35, 41.96), (26.90, 42.09), (27.55, 42.02), (28.05, 41.98),
    (28.25, 41.62), (28.65, 41.36), (29.05, 41.25), (29.65, 41.18), (30.25, 41.15),
    (30.90, 41.12), (31.40, 41.32), (31.85, 41.52), (32.40, 41.78), (33.05, 41.98),
    (33.75, 42.04), (34.45, 42.06), (35.15, 42.12), (35.48, 41.74), (35.98, 41.68),
    (36.48, 41.36), (37.02, 41.30), (37.55, 41.08), (38.25, 40.98), (38.95, 41.04),
    (39.70, 41.06), (40.40, 41.05), (41.08, 41.28), (41.58, 41.54), (42.15, 41.50),
    (42.78, 41.56), (43.30, 41.16), (43.68, 40.56), (43.82, 40.14), (44.82, 39.70),
    (44.52, 39.35), (44.28, 38.98), (44.38, 38.45), (44.32, 37.90), (44.78, 37.34),
    (44.10, 37.16), (43.25, 37.20), (42.55, 37.10), (42.10, 37.06), (41.40, 37.05),
    (40.65, 37.06), (39.85, 36.80), (38.80, 36.68), (38.05, 36.78), (37.35, 36.64),
    (36.70, 36.62), (36.58, 36.15), (36.10, 35.84), (35.82, 36.26), (35.92, 36.65),
    (35.45, 36.56), (34.90, 36.72), (34.22, 36.46), (33.72, 36.10), (32.82, 36.00),
    (32.12, 36.34), (31.52, 36.68), (30.72, 36.82), (30.42, 36.20), (29.62, 36.14),
    (29.08, 36.54), (28.52, 36.70), (27.90, 36.64), (27.22, 37.02), (27.12, 37.55),
    (26.82, 37.96), (26.28, 38.28), (26.80, 38.68), (26.72, 39.25), (26.12, 39.52),
    (26.15, 40.04), (26.02, 40.65), (26.05, 40.88), (26.32, 41.15), (26.48, 41.42)
]

def lon_to_x(lon):
    # Map lon [25.8, 45.0] to [20, 980]
    return round(20.0 + (lon - 25.8) / (45.0 - 25.8) * 960.0, 1)

def lat_to_y(lat):
    # Map lat [35.6, 42.3] to [430, 20]
    return round(430.0 - (lat - 35.6) / (42.3 - 35.6) * 410.0, 1)

# Sutherland-Hodgman polygon clipping against a half-plane
# Keep points p where (p - mid) . normal <= 0
def clip_poly_halfplane(poly, mid_x, mid_y, nx, ny):
    if not poly:
        return []
    out = []
    n = len(poly)
    for i in range(n):
        cur = poly[i]
        prev = poly[i - 1]
        cur_val = (cur[0] - mid_x) * nx + (cur[1] - mid_y) * ny
        prev_val = (prev[0] - mid_x) * nx + (prev[1] - mid_y) * ny
        if cur_val <= 1e-9:
            if prev_val > 1e-9:
                # Entering
                t = prev_val / (prev_val - cur_val)
                ix = prev[0] + t * (cur[0] - prev[0])
                iy = prev[1] + t * (cur[1] - prev[1])
                out.append((ix, iy))
            out.append(cur)
        elif prev_val <= 1e-9:
            # Leaving
            t = prev_val / (prev_val - cur_val)
            ix = prev[0] + t * (cur[0] - prev[0])
            iy = prev[1] + t * (cur[1] - prev[1])
            out.append((ix, iy))
    return out

# Convert Turkey polygon to screen coordinates
screen_turkey = [(lon_to_x(lon), lat_to_y(lat)) for lon, lat in TURKEY_CLEAN_POLY]

# Wait: TURKEY_CLEAN_POLY is non-convex! Sutherland-Hodgman clipping a non-convex subject polygon against half-planes works!
# Why? Because Sutherland-Hodgman clips ANY subject polygon (convex or non-convex) against a convex clip region (intersection of half-planes is convex!).
# Wait: only when a single half-plane cuts a non-convex peninsula into two disconnected pieces, Sutherland-Hodgman connects them along the clip line.
# Even better: we can decompose each Voronoi cell (which IS convex!) by starting with a bounding box, clipping it with all half-planes to get the convex Voronoi cell, and then intersecting with the Turkey boundary or using fine grid/polygon intersection!
# Let's write a general polygon-polygon intersection by decomposing TURKEY_CLEAN_POLY into convex triangles (ear clipping) and unioning/combining or clipping!
# Wait: let's test how clean Sutherland-Hodgman on screen_turkey is first!

sites = []
for p in PROVINCES:
    sx = lon_to_x(p["lon"])
    sy = lat_to_y(p["lat"])
    sites.append((sx, sy, p))

output_provinces = []
for i, (sx, sy, p) in enumerate(sites):
    poly = list(screen_turkey)
    for j, (ox, oy, op) in enumerate(sites):
        if i == j:
            continue
        mx = 0.5 * (sx + ox)
        my = 0.5 * (sy + oy)
        nx = ox - sx
        ny = oy - sy
        poly = clip_poly_halfplane(poly, mx, my, nx, ny)
        if not poly:
            break
    # Compute centroid of poly
    if poly:
        cx = round(sum(pt[0] for pt in poly) / len(poly), 1)
        cy = round(sum(pt[1] for pt in poly) / len(poly), 1)
        d_parts = [f"M {round(poly[0][0],1)} {round(poly[0][1],1)}"]
        for pt in poly[1:]:
            d_parts.append(f"L {round(pt[0],1)} {round(pt[1],1)}")
        d_parts.append("Z")
        d_str = " ".join(d_parts)
    else:
        cx, cy = sx, sy
        d_str = ""
    output_provinces.append({
        "plaka": p["plaka"],
        "id": p["id"],
        "name": p["name"],
        "region": p["region"],
        "lat": p["lat"],
        "lon": p["lon"],
        "cx": cx,
        "cy": cy,
        "path": d_str
    })

print(f"Generated {len(output_provinces)} provinces. Empty paths: {sum(1 for x in output_provinces if not x['path'])}")
with open("js_map_test.json", "w", encoding="utf-8") as f:
    json.dump(output_provinces, f, ensure_ascii=False, indent=2)

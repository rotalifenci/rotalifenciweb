# Generating realistic matching district polygons scaled and fitted for 1024x682

districts = [
    {
        "id": "merkez",
        "name": "Sivas Merkez (Tarihî Kent Meydanı)",
        "center": {"x": 423, "y": 403},
        "path": "M 370,330 L 455,270 L 510,340 L 525,410 L 480,480 L 405,475 L 350,380 Z",
        "desc": "Selçuklu Dârü'l-A'lâ'sı, İlhanlı, Osmanlı ve Cumhuriyet'in kalbi; 9 anıtsal tarihî eserin yer aldığı merkez."
    },
    {
        "id": "yildizeli",
        "name": "Yıldızeli",
        "center": {"x": 310, "y": 320},
        "path": "M 190,300 L 290,230 L 370,250 L 370,330 L 350,380 L 290,440 L 210,400 Z",
        "desc": "Sivas'ın batı kapısı; Çamlıbel Geçidi ve tarihi kervan yolu güzergâhı."
    },
    {
        "id": "hafik",
        "name": "Hafik",
        "center": {"x": 521, "y": 340},
        "path": "M 455,270 L 530,250 L 560,280 L 560,390 L 510,410 L 455,330 Z",
        "desc": "Kızılırmak vadisi ve Hafik Gölü (Koçhisar) çevresinde kurulmuş tarihi yerleşim."
    },
    {
        "id": "zara",
        "name": "Zara",
        "center": {"x": 604, "y": 343},
        "path": "M 560,280 L 650,260 L 670,320 L 660,430 L 560,390 Z",
        "desc": "Kızılırmak'ın yukarı çığırında, Selçuklu ve Osmanlı ticaret kervanlarının önemli menzili."
    },
    {
        "id": "imranli",
        "name": "İmranlı",
        "center": {"x": 700, "y": 383},
        "path": "M 670,320 L 720,290 L 785,350 L 750,450 L 660,430 Z",
        "desc": "Kızılırmak Nehri'nin doğduğu Kızıldağ eteklerinde yer alan tarihi ilçe."
    },
    {
        "id": "divrigi",
        "name": "Divriği",
        "center": {"x": 700, "y": 560},
        "path": "M 660,440 L 750,450 L 760,540 L 740,640 L 620,630 L 630,490 Z",
        "desc": "Mengücekliler Beyliği başkenti; UNESCO Dünya Mirası Divriği Ulu Camii ve Darüşşifası'nın anayurdu."
    },
    {
        "id": "kangal",
        "name": "Kangal",
        "center": {"x": 524, "y": 610},
        "path": "M 480,480 L 630,490 L 640,630 L 540,670 L 420,620 L 440,540 Z",
        "desc": "Selçuklu-Osmanlı kervansarayları (Alacahan), Balıklı Çermik ve tarihi İpek Yolu durağı."
    },
    {
        "id": "ulas",
        "name": "Ulaş",
        "center": {"x": 432, "y": 496},
        "path": "M 405,475 L 480,480 L 460,540 L 390,560 L 370,510 Z",
        "desc": "Tecer Dağları eteğinde ve göçmen kuşların uğrak yeri Ulaş Gölü havzasındaki ilçe."
    },
    {
        "id": "altinyayla",
        "name": "Altınyayla (Tonus)",
        "center": {"x": 383, "y": 588},
        "path": "M 370,510 L 420,540 L 410,610 L 350,600 L 340,540 Z",
        "desc": "Hitit kenti Kuşaklı (Sarissa) antik kentine ev sahipliği yapan kadim ilçe."
    },
    {
        "id": "sarkisla",
        "name": "Şarkışla",
        "center": {"x": 280, "y": 530},
        "path": "M 220,440 L 340,430 L 360,530 L 340,600 L 250,600 L 200,520 Z",
        "desc": "Aşık Veysel diyarı; tarihi kaleleri, kervansaray ve höyükleriyle ünlü kültür merkezi."
    },
    {
        "id": "gemerek",
        "name": "Gemerek",
        "center": {"x": 210, "y": 611},
        "path": "M 150,550 L 220,520 L 250,600 L 220,660 L 160,650 Z",
        "desc": "Sivas'ın batı-güneybatı sınırında, sarp kanyonlar ve tarihi İpek Yolu uzantısındaki ilçe."
    },
    {
        "id": "gurun",
        "name": "Gürün",
        "center": {"x": 480, "y": 640},
        "path": "M 360,670 L 460,675 L 530,670 L 500,680 L 380,680 Z",
        "desc": "Tohma Çayı, Gökpınar Gölü, Şuğul Kanyonu ve Hitit yazıtlarıyla ünlü kadim ilçe."
    },
    {
        "id": "dogansar",
        "name": "Doğanşar",
        "center": {"x": 498, "y": 148},
        "path": "M 440,180 L 510,130 L 550,170 L 510,230 L 450,220 Z",
        "desc": "Kuzeyde dağlık yayla karakterli, yemyeşil doğası ve tarihi ahşap mimarisiyle bilinen ilçe."
    },
    {
        "id": "koyulhisar",
        "name": "Koyulhisar",
        "center": {"x": 603, "y": 156},
        "path": "M 540,140 L 610,110 L 660,150 L 630,220 L 550,200 Z",
        "desc": "Kelkit Vadisi boyunca uzanan, Karadeniz ile İç Anadolu'yu bağlayan tarihi kale ilçesi."
    },
    {
        "id": "susehri",
        "name": "Suşehri",
        "center": {"x": 682, "y": 225},
        "path": "M 640,180 L 720,160 L 740,240 L 670,260 Z",
        "desc": "Kelkit havzasında geniş tarım arazileri ve tarihi kavşak noktası."
    },
    {
        "id": "akincilar",
        "name": "Akıncılar",
        "center": {"x": 741, "y": 257},
        "path": "M 720,220 L 770,220 L 780,290 L 730,280 Z",
        "desc": "Suşehri Ovası'nın doğusunda tarihi kuzey İpek Yolu yerleşimi."
    },
    {
        "id": "golova",
        "name": "Gölova",
        "center": {"x": 787, "y": 258},
        "path": "M 770,230 L 840,240 L 830,300 L 775,290 Z",
        "desc": "Sivas'ın en doğusunda göl havzası ve sınır ilçesi."
    }
]

print("Total districts defined:", len(districts))

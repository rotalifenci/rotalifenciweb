# Yaprak Test Soru Üretim Sistemi (Google Gemini AI)

Bu uygulama, Google AI Studio Gemini API'sini kullanarak MEB müfredatına ve kazanımlarına tam uyumlu yaprak test soruları üreten bir web aracıdır.

---

## 💻 Nasıl Çalıştırılır?

1. Terminali proje dizininde açın.
2. Sunucuyu başlatmak için aşağıdaki komutu çalıştırın:

```bash
npm start
```

3. Tarayıcınızda şu adresi açın:

```
http://localhost:3000
```

---

## ⚙️ Yapılandırma & API Anahtarı

* API anahtarı `.env` dosyası içerisinde `GEMINI_API_KEY` değişkeni altında saklanmaktadır.
* Farklı bir API anahtarı kullanmak isterseniz `.env` dosyasındaki ilgili satırı güncellemeniz yeterlidir:

```env
GEMINI_API_KEY=your_google_ai_studio_api_key_here
PORT=3000
```

---

## 🌟 Özellikler

* **Hazır Müfredat:** 5. Sınıf Fen Bilimleri 7 ana ünitesi ve tüm kazanımları ön yüklüdür.
* **Serbest Giriş:** İstenilen sınıf, ders veya özel kazanım metni manuel olarak yazılabilir.
* **Zorluk Seçimi:** Kolay, Orta, Zor veya Dengeli (Karma) soru dağılımı.
* **Ölçme-Değerlendirme:** Soru metni, 4 seçenek (A, B, C, D), doğru cevap, ilgili kazanım ve çözüm açıklaması.
* **Baskı / PDF Formatı:** "Yazdır / PDF Yap" butonu ile A4 ebadında 2 sütunlu standart yaprak test çıktısı.
* **Panoya Kopyalama:** Soruları ve şıkları tek tıkla kopyalama desteği.

# Rotalı Fenci — Kalıcı İçerik Koruma ve Mühendislik Kuralları

Bu depo kökünde çalışan her yapay zeka ajanı (Antigravity vb.) ve geliştirici aşağıdaki **10 Kalıcı Koruma Kuralına** istisnasız uymak zorundadır:

## 10 Zorunlu İçerik Koruma Kuralı
1. Kullanıcı açıkça talimat vermedikçe mevcut **hiçbir içerik, dosya, soru, etkinlik, oyun, simülasyon, görsel, menü, bileşen veya route silinemez**.
2. "Düzenle", "iyileştir", "tasarımı güncelle", "soru ekle", "hata düzelt", "yeni özellik ekle" gibi istekler mevcut içerikleri veya modülleri kaldırma izni anlamına gelmez.
3. Toplu silme, temizleme veya basitleştirme işlemi **yalnızca kullanıcı açıkça listeleyip onay verdiğinde** yapılabilir.
4. Mevcut veri dosyaları (`data/materials.json`, `Web Sitem/data/materials.json`), sorular, etkinlikler, testler veya medya klasörleri (`assets/`, `Eğitsel Oyun/`, `oyunlar/`, `testler/`) tam üzerine yazma (`replace: true`) ile sıfırlanamaz; yalnızca güvenli **merge / append** yöntemiyle güncellenir.
5. Geçici çözüm, demo düzeltme veya test amacıyla gerçek içerikler veya korumalı modüller gizlenemez ya da kaldırılamaz.
6. Hem kök dizin (`/`) hem de `Web Sitem/` aynası **çift yazım (dual-write)** ile senkron tutulur; yalnızca bir kopyayı güncelleyip diğerini eski bırakmak yasaktır.
7. Her önemli değişiklikten önce gerçek dosya/JSON yedeği (`node scripts/pre_deploy_guard.js`) çalıştırılarak `backups/pre-deploy-latest/` yedeği güncellenir.
8. Değişiklik sonrası içerik sayısı kontrol edilir; istenmeyen azalma veya kırık dosya referansı varsa işlem durdurulur (`data/protected-baseline.json`).
9. Git geçmişinde bir dosya veya içerik kaybı fark edilirse önce mevcut yeni özellikler korunur, yalnızca kaybolan içerik seçici olarak geri yüklenir (asla tüm siteyi eski commit'e döndürme).
10. Antigravity tarafından yapılan hiçbir işlem kullanıcının Admin Panelinden daha önce bilinçli olarak sildiği içerikleri (`data/protected-baseline.json` Grup B & `PERMANENTLY_REMOVED_IDS`) otomatik olarak geri getiremez.

## Güncelleme Öncesi ve Sonrası Zorunlu Komutlar
- Değişiklik öncesi & sonrası guard ve testler:
  - `npm run guard` (`node scripts/pre_deploy_guard.js`)
  - `npm test` (tüm test süitleri)
- Vercel Hobby Serverless Function sınırı: `api/` altında `_` öneki olmayan aktif `.js` uç noktası sayısı **en fazla 12** olabilir.

## Korunan Ana Modüller
5., 6., 7. ve 8. Sınıf sayfaları; Yaprak Test ve Soru Hazırlama Modülü (`yaprak-test.html`, `api/generate-questions.js`, `api/publish-test.js`); 5. Sınıf Dinamometre Sanal Laboratuvarı; 7. Sınıf 1. Ünite Uzay Ekspresi Eğitsel Oyunu; 6. Sınıf Eğitsel Oyunları; TÜBİTAK Bilimsel Araştırma Merkezi Web Portalı; Etkinlik Hazırlama Modülü (13 alt tür); Ders Notları; Konu Özetleri; Çalışma Kağıtları ve Denemeler; Z-Kitap akıllı tahta görünümü; Bulut senkronizasyonu (`api/sync.js`, GitHub Gist).

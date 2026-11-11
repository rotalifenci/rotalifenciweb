# Kalıcı İçerik Koruma ve Çift-Ayna Senkronizasyon Kuralı

Bu kural **Rotalı Fenci** projesindeki tüm kod, içerik, test, oyun, simülasyon, görsel ve API işlemlerinde daima etkindir.

## Zorunlu Kurallar
- Kullanıcının açıkça listelemediği ve onaylamadığı hiçbir mevcut materyal ID'si, test HTML dosyası, oyun, simülasyon, görsel asset veya navigasyon rotası silinemez.
- "Tasarımsal iyileştirme", "soru ekleme", "hata düzeltme" veya "yeni modül ekleme" görevlerinde mevcut modüller ve içerikler (%100 geriye dönük uyumlulukla) korunur.
- `api/sync.js` içinde `PROTECTED_IDS` koruması pasif senkronizasyonda zayıflatılamaz; istemci (`js/app.js`) `uploadToCloud(..., true)` ile tam liste ezme isteği gönderemez.
- Kök dizin (`data/materials.json`, `api/`, `js/`, `css/`, `scripts/`, `oyunlar/`, `Eğitsel Oyun/`, `assets/`, `testler/`) ile `Web Sitem/` aynası arasında sürüm farkı bırakılamaz.
- Her güncelleme ve Vercel deploy öncesinde `node scripts/pre_deploy_guard.js` (gerçek `backups/pre-deploy-latest/` yedeği alır, ayna eşitliğini ve korumalı taban çizgisini denetler) ve `node --test "Web Sitem/tests/*.test.js"` çalıştırılmalıdır.
- Kullanıcı tarafından daha önce bilinçli silinen öğeler geri getirilmez; kaynağı belirsiz silmeler otomatik geri yüklenmez, yalnızca raporlanır.

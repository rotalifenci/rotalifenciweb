# Rotalı Fenci — Antigravity Kalıcı Proje Talimatları

Bu proje üzerinde çalışırken `AGENTS.md` ve `.agents/rules/content-protection.md` içindeki kurallar zorunludur:

1. Açık kullanıcı onayı olmadan **hiçbir mevcut materyal, soru, oyun, simülasyon, görsel, menü bağlantısı veya sayfa silinmez/gizlenmez**.
2. Veri güncellemeleri (`data/materials.json`, `Web Sitem/data/materials.json`, `api/sync.js`) her zaman birleştirme (**merge / append**) prensibiyle yapılır; stale istemci `replace: true` veya eksik aynalar yüzünden mevcut verinin ezilmesi yasaktır.
3. Kök dizin (`.`) ve `Web Sitem/` aynası daima eşit tutulur; yayından önce mutlaka `npm run guard && npm test` çalıştırılır ve tüm testlerin geçtiği doğrulanır.
4. `api/` klasöründe Vercel Hobby 12 Serverless Function sınırını aşacak ekstra üst-düzey `.js` dosyası eklenmez (yardımcı modüller `_` önekiyle adlandırılır).
5. Admin Panelinden kullanıcı tarafından kasıtlı silinen (`PERMANENTLY_REMOVED_IDS` ve Grup B) kayıtlar veya belirsiz (`Grup C`) kayıtlar kullanıcı onayı olmadan geri yüklenmez.

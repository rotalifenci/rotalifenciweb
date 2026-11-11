# Rotalı Fenci (`Web Sitem/`) — Kalıcı İçerik Koruma Kuralı

Bu klasörde çalışırken kök dizindeki `../AGENTS.md` ve `../.agents/rules/content-protection.md` kuralları birebir geçerlidir:
- Hiçbir mevcut materyal, soru, oyun, simülasyon, görsel, menü veya sayfa açık onay olmadan silinemez.
- Yapılan her kod/veri/asset değişikliği hem `Web Sitem/` hem kök (`../`) aynasına birlikte uygulanır (`pre_deploy_guard.js` ile doğrulanır).
- `js/app.js` üzerinde `uploadToCloud(..., true)` tam-liste ezme çağrısı yasaktır; `api/sync.js` korumaları devre dışı bırakılamaz.
- Deploy öncesi zorunlu doğrulama: `npm --prefix .. run guard && npm --prefix .. test`.

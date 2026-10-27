# ANTIGRAVITY – KULLANICI DEĞİŞİKLİKLERİNİ KORUMA VE TÜM CİHAZLARDA SENKRONİZASYON KURALI

**BU TALİMAT TÜM PROJELERİM İÇİN ÖNCELİKLİ VE KALICI BİR GELİŞTİRME KURALIDIR.**

1. **SİLDİĞİM İÇERİKLERİ GERİ GETİRME:** Kullanıcının sildiği hiçbir sayfayı, dosyayı, görseli, metni, bağlantıyı, butonu, özelliği veya içeriği kendiliğinden geri getirme. Eski yedekleri veya Git geçmişini kullanarak silinen içerikleri yeniden oluşturma.
2. **EKLEDİĞİM İÇERİKLERİ SİLME:** Kullanıcının eklediği içerikleri, görselleri, dosyaları, sayfaları, bağlantıları ve özellikleri koru. Açıkça istenmediği sürece içerikleri başka içeriklerle değiştirme veya kaldırma.
3. **TÜM CİHAZLARDA AYNI VERİLER:** Masaüstü, dizüstü, Android telefon/tablet, iPhone, iPad, akıllı tahta ve tüm tarayıcılarda aynı güncel veriler görünmelidir (`data/materials.json` ve Bulut Gist `a1bd259d8d4d9e04e93e4e038ef2b0c7` senkronize tutulmalıdır).
4. **KALICI VERİ VE SENKRONİZASYON:** Yalnızca `localStorage` alanına güvenme; silinen içerik bilgisini (`deletedIds`) ve eklenen/düzenlenen içerikleri bulut ve statik JSON ile senkronize et.
5. **ZORUNLU KONTROLLER:** Her güncellemeden sonra şu 5 kontrolü doğrula:
   - Önceden silinen içerikler geri geldi mi? (Gelmemeli)
   - Kullanıcının eklediği içerikler korundu mu? (Korunmalı)
   - Farklı cihazlarda aynı veriler görüntüleniyor mu? (Evet)
   - Güncelleme sonrasında veri kaybı oluştu mu? (Hayır)
   - Telefon, tablet, bilgisayar ve akıllı tahta ekranlarında uygulama düzgün çalışıyor mu? (Evet)

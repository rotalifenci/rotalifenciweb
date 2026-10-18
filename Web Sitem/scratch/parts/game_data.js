// scratch/parts/game_data.js
module.exports = {
    ROOM_COUNT: 8,
    CURRICULUM_OUTCOMES: {
        1: { code: "FB.7.1.1", title: "İstasyon Enerji ve Güvenlik Sistemi (Acil Durum)" },
        2: { code: "FB.7.1.1", title: "Uzay Araştırmaları Teknolojilerini Karşılaştırma" },
        3: { code: "FB.7.1.1", title: "Türkiye'nin Uzay Çalışmaları ve Uydu Görevleri" },
        4: { code: "FB.7.1.3", title: "Uzay Kirliliği ve Yörünge Güvenliği" },
        5: { code: "FB.7.1.2", title: "Teleskop Yapısı, Türleri ve Rasathane Konumu" },
        6: { code: "FB.7.1.4", title: "Yıldızların Yaşam Döngüsü ve Evrimi" },
        7: { code: "FB.7.1.5", title: "Yıldız, Takımyıldız, Galaksi ve Evren Haritası" },
        8: { code: "FB.7.1.1-5", title: "Dünya'ya Güvenli Dönüş Simülasyonu" }
    },
    BADGES: [
        { id: "enerji", name: "İstasyon Mühendisi", icon: "fa-bolt", desc: "Acil durum enerji akışını yeniden sağladı." },
        { id: "teknoloji", name: "Uzay Teknolojileri Uzmanı", icon: "fa-rocket", desc: "Tüm uzay araçlarını kusursuz analiz etti." },
        { id: "uydu", name: "Uydu Operatörü", icon: "fa-satellite", desc: "Türkiye'nin millî uydularını yörüngeye bağladı." },
        { id: "kirlilik", name: "Uzay Kirliliği Dedektifi", icon: "fa-shield-halved", desc: "Enkaz çarpışmasını bilimsel manevrayla önledi." },
        { id: "teleskop", name: "Teleskop Tasarımcısı", icon: "fa-eye", desc: "Optik teleskop modelini kurup derin uzayı gözlemledi." },
        { id: "yildiz", name: "Yıldız Astrofizikçisi", icon: "fa-sun", desc: "Küçük ve büyük kütleli yıldızların yaşam döngüsünü çözdü." },
        { id: "galaksi", name: "Kozmik Galaksi Kâşifi", icon: "fa-compass", desc: "Evren hiyerarşisini ve ışık yılı ölçeğini keşfetti." },
        { id: "kahraman", name: "Uzaydan Kaçış Kahramanı", icon: "fa-award", desc: "ORBITAL-7 istasyonundan Dünya'ya güvenle döndü!" }
    ]
};

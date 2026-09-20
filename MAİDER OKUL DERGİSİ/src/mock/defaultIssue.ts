import { MagazineIssue } from "../types/magazine";
import { DEFAULT_MAGAZINE_SECTIONS, MONTHS_DATA } from "../config/months";

export const DEFAULT_MAIDER_ISSUE: MagazineIssue = {
  id: "issue-maider-10",
  title: "MAİDER",
  subtitle: "Mehmet Akif İnan Ortaokulu E-Dergisi",
  schoolName: "Mehmet Akif İnan Ortaokulu",
  issueNumber: 10,
  month: "Ekim",
  monthIndex: 9,
  year: 2026,
  coverTitle: "Geleceğin Akıllı Şehirlerini Tasarlıyoruz",
  coverSubtitle: "Öğrencilerimiz Yapay Zekâ, Yeşil Enerji ve STEM Odaklı Projelerle Yarının Dünyasını Şekillendiriyor.",
  slogan: "Geleceğe İlham Veren Akıllı Okul Dergisi",
  editorName: "Mehmet Akif İnan Ortaokulu Yayın Kurulu",
  publishDate: "Ekim 2026",
  coverImageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
  format: "a4",
  sections: DEFAULT_MAGAZINE_SECTIONS,
  createdAt: "2026-09-01T08:00:00Z",
  updatedAt: "2026-09-17T12:00:00Z",
  teamMembers: [
    { id: "tm-1", name: "Mustafa Yılmaz", role: "Okul Müdürü", group: "Yönetim" },
    { id: "tm-2", name: "Ayşe Kaya", role: "Yayın Yönetmeni / Fen Bilimleri", group: "Yayın Kurulu" },
    { id: "tm-3", name: "Ahmet Demir", role: "Bilişim Teknolojileri Danışmanı", group: "Tasarım & Bilişim" },
    { id: "tm-4", name: "Zeynep Çelik", role: "Türkçe Öğretmeni / Dil Kontrol", group: "Yayın Kurulu" },
    { id: "tm-5", name: "Emre Yıldız", role: "Öğrenci Temsilcisi (8-A)", group: "Öğrenci Temsilcileri" },
    { id: "tm-6", name: "Elif Şahin", role: "Genç Muhabir (7-C)", group: "Öğrenci Temsilcileri" },
  ],
  masthead: {
    schoolName: "Mehmet Akif İnan Ortaokulu",
    magazineName: "MAİDER E-Dergi",
    principal: "Mustafa Yılmaz",
    editorInChief: "Ayşe Kaya",
    editorialBoard: ["Ayşe Kaya", "Zeynep Çelik", "Selim Can", "Fatma Koç"],
    graphicDesign: ["Ahmet Demir", "MAİDER Bilişim Kulübü"],
    contactEmail: "maider@mehmetakifinan.meb.k12.tr",
    schoolAddress: "Mehmet Akif İnan Ortaokulu, Eğitim Kampüsü No: 12",
    website: "https://mehmetakifinan.meb.k12.tr",
    legalNotice: "MAİDER E-Dergisi’nde yayımlanan yazı, resim ve projelerin tüm yayın hakları Mehmet Akif İnan Ortaokulu’na aittir. Kaynak gösterilerek alıntı yapılabilir.",
  },
  archives: [
    { id: "arc-9", issueNumber: 9, month: "Eylül", year: 2026, title: "Yeni Eğitim Yılı ve Bilim Coşkusu", coverUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80", canvaUrl: "https://www.canva.com" },
    { id: "arc-8", issueNumber: 8, month: "Ağustos", year: 2026, title: "Yaz Okulu ve Robotik Kampı", coverUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80", canvaUrl: "https://www.canva.com" },
    { id: "arc-7", issueNumber: 7, month: "Temmuz", year: 2026, title: "Bilim ve Doğa Keşifleri", coverUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80", canvaUrl: "https://www.canva.com" },
  ],
  articles: [
    {
      id: "art-1",
      issueId: "issue-maider-10",
      category: "STEM",
      title: "Geleceğin Akıllı Şehirlerini Tasarlıyoruz",
      subtitle: "8-B Sınıfı Öğrencilerimizin Otonom Akıllı Şehir Maketi",
      author: "Ayşe Kaya & 8-B Robotik Takımı",
      authorRole: "Fen Bilimleri Öğretmeni",
      targetGrades: ["8-B", "Robotik & STEM Takımı"],
      tags: ["STEM", "Robotik", "Yapay Zekâ"],
      content: "Günümüzde kent nüfusunun hızla artması enerji yönetimi, çevre kirliliği ve ulaşım problemlerini beraberinde getirmektedir. Mehmet Akif İnan Ortaokulu STEM Atölyesi’nde hayata geçirdiğimiz bu projede, sensörlerle donatılmış akıllı sokak lambaları, yağmur suyunu filtreleyip depolayan yeşil binalar ve güneş enerjisiyle çalışan raylı toplu taşıma modelleri geliştirdik. Öğrencilerimiz algoritma kurma, 3B modelleme ve devre tasarımı süreçlerini bizzat deneyimleyerek geleceğin şehir mimarisine bugünden adım attılar.",
      pullQuote: "Geleceğin teknolojisi, bugünün meraklı çocuklarının hayal gücünde yeşerir.",
      mainPhoto: { id: "p-stem-1", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80", caption: "STEM Laboratuvarı Akıllı Şehir Proje Masası", isMain: true },
      photos: [
        { id: "p-stem-1", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80", caption: "STEM Laboratuvarı Akıllı Şehir Proje Masası", isMain: true },
        { id: "p-stem-2", url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80", caption: "Sensör devresi montajı" },
        { id: "p-stem-3", url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80", caption: "Öğrenci proje sunumu" }
      ],
      videoUrl: "https://www.youtube.com",
      stemData: {
        problem: "Hızlı şehirleşmenin getirdiği yüksek enerji tüketimi ve karbon salınımı kentsel yaşamı tehdit etmektedir.",
        purpose: "Yenilenebilir enerji ve IoT sensörleriyle kendi elektriğini üreten ve yöneten minyatür bir akıllı şehir inşa etmek.",
        process: "Arduino mikrodenetleyiciler, LDR ışık sensörleri, mini güneş panelleri ve geri dönüştürülmüş materyallerle 3 haftalık atölye çalışması.",
        result: "Sokak aydınlatmasında %40 enerji tasarrufu sağlandı; öğrencilerimiz algoritma ve mühendislik disiplinlerini başarıyla uyguladı."
      },
      status: "Yayına Hazır",
      createdBy: "Ayşe Kaya",
      createdRole: "Öğretmen",
      createdAt: "2026-09-01T10:00:00Z",
      updatedAt: "2026-09-05T14:30:00Z"
    }
  ],
  pages: [
    {
      id: "p-1",
      pageNumber: 1,
      issueId: "issue-maider-10",
      sectionId: "sec-kapak",
      templateId: "M01",
      layoutVariant: "A",
      category: "Kapak",
      title: "Geleceğin Akıllı Şehirleri",
      subtitle: "Öğrencilerimiz Yapay Zekâ ve Yeşil Enerjiyle Yarının Dünyasını İnşa Ediyor",
      photos: [{ id: "cp-1", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80", isMain: true }],
      extraData: { slogan: "Geleceğe İlham Veren Akıllı Okul Dergisi" }
    },
    {
      id: "p-2",
      pageNumber: 2,
      issueId: "issue-maider-10",
      sectionId: "sec-kapak",
      templateId: "M02",
      layoutVariant: "A",
      category: "İçindekiler",
      title: "İçindekiler",
      subtitle: "MAİDER 10. Sayı Rehberi",
      photos: []
    },
    {
      id: "p-3",
      pageNumber: 3,
      issueId: "issue-maider-10",
      sectionId: "sec-editor",
      templateId: "M03",
      layoutVariant: "A",
      category: "Editörden",
      title: "Öğrenmenin ve Üretmenin Sınırsız Coşkusu",
      subtitle: "Sevgili Öğrencilerimiz, Değerli Öğretmenlerimiz ve Kıymetli Velilerimiz,",
      author: "Mustafa Yılmaz",
      authorRole: "Okul Müdürü",
      content: "Mehmet Akif İnan Ortaokulu ailesi olarak dijital yayıncılık yolculuğumuzun 10. sayısına ulaşmanın haklı gururunu yaşıyoruz. MAİDER, yalnızca bir okul dergisi değil; atölyelerimizde üretilen bilginin, sınıflarımızda yeşeren sanatın ve öğrencilerimizin gözlerindeki merak kıvılcımının somut bir yansımasıdır.\n\nBu sayımızda akıllı şehirlerden uzayın derinliklerine, robotik turnuva zaferlerimizden genç şairlerimizin dizelerine kadar dopdolu bir içerik hazırladık. Emeği geçen tüm öğretmen ve öğrencilerimizi yürekten kutluyorum.",
      pullQuote: "Bilgi paylaşıldıkça büyür, ilham verdikçe geleceğe ışık tutar.",
      photos: [{ id: "ed-1", url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80", caption: "Okul Müdürü Mustafa Yılmaz" }]
    },
    {
      id: "p-4",
      pageNumber: 4,
      issueId: "issue-maider-10",
      sectionId: "sec-stem",
      templateId: "M08",
      layoutVariant: "A",
      category: "STEM",
      title: "Geleceğin Akıllı Şehirlerini Tasarlıyoruz",
      subtitle: "8-B Sınıfı Öğrencilerimizin Otonom Akıllı Şehir Maketi",
      author: "Ayşe Kaya & 8-B Robotik Takımı",
      authorRole: "Fen Bilimleri Öğretmeni",
      content: "STEM atölyemizde hayata geçirdiğimiz bu projede, sensörlerle donatılmış akıllı sokak lambaları, yağmur suyunu filtreleyip depolayan yeşil binalar ve güneş enerjisiyle çalışan raylı toplu taşıma modelleri geliştirdik. Öğrencilerimiz algoritma kurma, 3B modelleme ve devre tasarımı süreçlerini bizzat deneyimlediler.",
      pullQuote: "Geleceğin teknolojisi, bugünün meraklı çocuklarının hayal gücünde yeşerir.",
      photos: [
        { id: "p-stem-1", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80", caption: "STEM Laboratuvarı Akıllı Şehir Projesi" },
        { id: "p-stem-2", url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80", caption: "Sensör testleri" },
        { id: "p-stem-3", url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80", caption: "Öğrenci proje sunumu" }
      ],
      qrUrl: "https://www.youtube.com",
      qrLabel: "Proje Tanıtım Videosu",
      extraData: {
        stemData: {
          problem: "Hızlı şehirleşmenin getirdiği yüksek enerji tüketimi ve karbon salınımı kentsel yaşamı tehdit etmektedir.",
          purpose: "Yenilenebilir enerji ve IoT sensörleriyle kendi elektriğini üreten minyatür bir akıllı şehir kurmak.",
          process: "Arduino mikrodenetleyiciler, LDR ışık sensörleri ve güneş panelleriyle 3 haftalık entegrasyon.",
          result: "Sokak aydınlatmasında %40 enerji tasarrufu sağlandı; öğrencilerimiz mühendislik disiplinlerini uyguladı."
        }
      }
    },
    {
      id: "p-5",
      pageNumber: 5,
      issueId: "issue-maider-10",
      sectionId: "sec-stem",
      templateId: "M07",
      layoutVariant: "A",
      category: "Bilim",
      title: "James Webb Uzay Teleskobu ve Evrenin Gizemleri",
      subtitle: "Zamanın Başlangıcına Açılan Kozmik Pencere",
      author: "Selim Can",
      authorRole: "Astronomi Kulübü Danışmanı",
      content: "Dünya’dan 1.5 milyon kilometre uzaklıktaki L2 Lagrange noktasında görev yapan James Webb Uzay Teleskobu, evrenin ilk galaksilerini kızılötesi gözleriyle taramaya devam ediyor. Kulüp öğrencilerimizle teleskobun ilettiği ham spektral verileri inceledik ve yıldız doğum bölgelerinin büyüleyici fotoğraflarını renklendirdik. Bilim merakı, insanı yıldızlara ulaştıran en güçlü kanattır.",
      pullQuote: "Gökyüzüne bakan her çocuk, geleceğin astronomudur.",
      photos: [
        { id: "p-sci-1", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80", caption: "James Webb Derin Alan Kızılötesi Görüntüsü" },
        { id: "p-sci-2", url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80", caption: "Astronomi Kulübü Teleskop Atölyesi" }
      ],
      qrUrl: "https://science.nasa.gov",
      qrLabel: "NASA Canlı Verileri"
    },
    {
      id: "p-6",
      pageNumber: 6,
      issueId: "issue-maider-10",
      sectionId: "sec-etkinlik",
      templateId: "M10",
      layoutVariant: "A",
      category: "Okul Etkinliği",
      title: "29 Ekim Cumhuriyet Bayramı Coşkusu Okulumuzda",
      subtitle: "Tüm Öğrenci ve Öğretmenlerimizle Tek Yürek Kutlama",
      author: "Kültür & Tören Komisyonu",
      content: "Cumhuriyetimizin yeni yaşını okulumuz bahçesinde ve konferans salonumuzda düzenlediğimiz görkemli etkinliklerle kutladık. Şiir dinletileri, koro gösterileri ve okul bando takımımızın coşkulu marşlarıyla bayram sevincini doyasıya yaşadık. Emeği geçen tüm öğretmen ve öğrencilerimizi tebrik ediyoruz.",
      photos: [
        { id: "ev-1", url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80", caption: "Okul Koromuzun Cumhuriyet Konseri" },
        { id: "ev-2", url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80", caption: "Tören Geçişi" },
        { id: "ev-3", url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80", caption: "Öğrenci Şiir Dinletisi" },
        { id: "ev-4", url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80", caption: "Ödül Töreni" }
      ]
    },
    {
      id: "p-7",
      pageNumber: 7,
      issueId: "issue-maider-10",
      sectionId: "sec-roportaj",
      templateId: "M17",
      layoutVariant: "A",
      category: "Başarı",
      title: "TÜBİTAK ve Robotik Turnuvasında İl Birinciliği!",
      subtitle: "Mehmet Akif İnan Ortaokulu Adını Zirveye Yazdırdı",
      author: "Bilişim & Robotik Takımı",
      content: "İl genelinde düzenlenen Ortaokullar Arası Otonom Robotik Yarışması’nda okulumuz \"MAİDER ROBOTİK\" takımı birincilik kupasını kaldırdı. Çizgi izleyen ve engelden kaçan robot kategorisinde en kısa sürede parkuru tamamlayan öğrencilerimiz, Türkiye finallerinde okulumuzu temsil etme hakkı kazandı.",
      pullQuote: "Başarı; azim, takım ruhu ve doğru rehberliğin doğal sonucudur.",
      photos: [
        { id: "ach-1", url: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80", caption: "Şampiyonluk Kupası Takdim Anı" },
        { id: "ach-2", url: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=600&q=80", caption: "Pist Üzerinde Robot Testi" }
      ]
    },
    {
      id: "p-8",
      pageNumber: 8,
      issueId: "issue-maider-10",
      sectionId: "sec-oyun",
      templateId: "M24",
      layoutVariant: "A",
      category: "Oyun",
      title: "Akıllı Fen Bilimleri Labirenti",
      subtitle: "Öğrendiklerini Wordwall Oyunuyla Eğlenerek Pekiştir!",
      content: "Bu sayıda fen bilgisi dersinde işlediğimiz kuvvet, enerji dönüşümü ve hücre bölünmesi konularını interaktif bir oyuna dönüştürdük. Aşağıdaki QR kodu telefonunuzun kamerasıyla taratarak veya Canva üzerinden butona tıklayarak labirent oyununu başlatabilir, sınıf arkadaşlarınla puan tablosunda yarışabilirsin!",
      photos: [
        { id: "game-1", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80", caption: "Wordwall İnteraktif Labirent Önizlemesi" }
      ],
      qrUrl: "https://wordwall.net",
      qrLabel: "Oyunu Başlatmak İçin Tara",
      interactiveButton: {
        text: "OYUNU BAŞLAT 🎮",
        url: "https://wordwall.net"
      }
    },
    {
      id: "p-9",
      pageNumber: 9,
      issueId: "issue-maider-10",
      sectionId: "sec-kultur",
      templateId: "M20",
      layoutVariant: "A",
      category: "Dijital Vatandaşlık",
      title: "Yapay Zekâ Çağında Dijital Ayak İzi ve Güvenlik",
      subtitle: "İnterneti Güvenli ve Bilinçli Kullanma Rehberi",
      author: "Rehberlik & Psikolojik Danışmanlık Servisi",
      content: "İnternette paylaştığımız her fotoğraf, tıkladığımız her bağlantı ve arama motorlarına yazdığımız her kelime bizim dijital ayak izimizi oluşturur. Dijital dünyada güçlü parolalar seçmek, kişisel verilerimizi korumak, siber zorbalığa geçit vermemek ve üretken yapay zekâ araçlarını etik kurallar çerçevesinde kullanmak hepimizin sorumluluğudur.",
      pullQuote: "Güçlü şifre, açık fikirli kafa ve bilinçli internet!",
      photos: [
        { id: "digi-1", url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80", caption: "Bilişim Sınıfı Güvenli İnternet Semineri" }
      ],
      qrUrl: "https://orgm.meb.gov.tr",
      qrLabel: "MEB Güvenli İnternet Rehberi"
    },
    {
      id: "p-10",
      pageNumber: 10,
      issueId: "issue-maider-10",
      sectionId: "sec-oyun",
      templateId: "M23",
      layoutVariant: "A",
      category: "Künye",
      title: "Yayın Künyesi",
      subtitle: "Mehmet Akif İnan Ortaokulu Kurumsal İletişim",
      photos: []
    },
    {
      id: "p-15",
      pageNumber: 15,
      issueId: "issue-maider-10",
      sectionId: "sec-stem",
      templateId: "M04",
      layoutVariant: "A",
      category: "BİLİM VE TEKNOLOJİ",
      title: "ÇİFTE MİNARELİ MEDRESE",
      subtitle: "Selçuklu Taş İşçiliğinin ve Turkuaz Çinili Minarelerin Asırlık Şaheseri",
      author: "MAİDER Ekibi",
      authorRole: "Kültür & Sanat Masası",
      content: `Sivas kent merkezinde 1271 yılında İlhanlılar Dönemi vezirlerinden Sahip Şemseddin Mehmed Cüveyni tarafından inşa ettirilen Çifte Minareli Medrese, Anadolu Selçuklu taş süsleme sanatının ve mimarlık dehasının zirve noktalarından biri olarak kabul edilir. Günümüze sadece doğu cephesindeki anıtsal taç kapısı ve gökyüzüne uzanan iki zarif minaresi ulaşmış olsa da yapı, ilk günkü asalet ve zarafetini korumaktadır.

### TAŞA KAZINAN GEOMETRİK MUCİZE
Medresenin görkemli taç kapısı; bitkisel motifler, geometrik bordürler ve mukarnaslı kavsarasıyla adeta açık hava heykelini andırmaktadır. Kapının her iki yanından yükselen minareler, sırlı tuğla ve firuze çini mozaiklerin ahenkli dansını sunar. Selçuklu ustalarının matematiksel hassasiyeti, güneş ışınlarının açısına göre cephede ışık ve gölge oyunları meydana getirir.

> 💡 **BİLİYOR MUYDUNUZ?**
> Çifte Minareli Medrese'nin minarelerinde kullanılan turkuaz renkli çiniler, Selçuklu çini sanatında gökyüzünü ve sonsuzluğu simgeleyen özel bir sırlama tekniğiyle üretilmiştir.

### ASIRLARA MEYDAN OKUYAN İLİM YUVASI
Döneminde hadis, fıkıh ve temel tıp bilimlerinin okutulduğu iki katlı ve dört eyvanlı medrese planıyla inşa edilen yapı, yüzyıllar boyunca Anadolu'nun en saygın ilim merkezleri arasında yer almıştır. Bugün Sivas'ın kalbinde dimdik duran bu eşsiz şaheser, kadim tarihimizin köklerini geleceğin genç nesillerine ilham veren bir gurur abidesi olarak aktarmaya devam etmektedir.`,
      pullQuote: "Taşa kazınan Selçuklu zarafeti ve gökyüzüne uzanan çinili minareler, geçmişin ilmini bugünün merakıyla buluşturuyor.",
      sourceReference: "Sivas Valiliği İl Kültür ve Turizm Müdürlüğü & Vakıflar Genel Müdürlüğü Arşivi",
      photos: [
        {
          id: "photo-cifte-minare-15",
          url: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=85",
          caption: "Sivas Çifte Minareli Medrese - Taç Kapı ve Minareler",
          isMain: true
        }
      ]
    },
    {
      id: "p-16",
      pageNumber: 16,
      issueId: "issue-maider-10",
      sectionId: "sec-oyun",
      templateId: "M25",
      layoutVariant: "A",
      category: "Kapanış",
      title: "16. Sayımızda Görüşmek Üzere!",
      subtitle: "Mehmet Akif İnan Ortaokulu Geleceğe Kanat Açıyor",
      photos: [
        { id: "back-1", url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80", caption: "Okul Topluluğumuz" }
      ]
    }
  ]
};

// Generates 12 separate monthly issues for the year
export function createYearlyIssues(): MagazineIssue[] {
  return MONTHS_DATA.map((m) => {
    // If it's September (index 8, Sayı 9) or October (index 9), use our rich DEFAULT_MAIDER_ISSUE
    if (m.index === 8 || m.index === 9) {
      return {
        ...DEFAULT_MAIDER_ISSUE,
        id: `issue-maider-${m.defaultIssueNumber}`,
        monthIndex: m.index,
        month: m.name,
        issueNumber: m.defaultIssueNumber,
        coverTitle: `${m.name} 2026 Sayısı: Geleceği İnşa Eden Gençler`,
        publishDate: `${m.name} 2026`,
        pages: DEFAULT_MAIDER_ISSUE.pages.map(p => ({
          ...p,
          issueId: `issue-maider-${m.defaultIssueNumber}`
        }))
      };
    }

    // Otherwise create a structured starter issue for this month
    const issueId = `issue-maider-m${m.index + 1}`;
    const starterCoverImage = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80";

    return {
      id: issueId,
      title: "MAİDER",
      subtitle: `Mehmet Akif İnan Ortaokulu E-Dergisi • ${m.name} Sayısı`,
      schoolName: "Mehmet Akif İnan Ortaokulu",
      issueNumber: m.defaultIssueNumber,
      month: m.name,
      monthIndex: m.index,
      year: 2026,
      coverTitle: `${m.name} 2026 Sayısı: Geleceği İnşa Eden Gençler`,
      coverSubtitle: `${m.season} süresince öğrencilerimizin gerçekleştirdiği bilim, kültür ve sanat faaliyetleri.`,
      slogan: "Geleceğe İlham Veren Akıllı Okul Dergisi",
      editorName: "Mehmet Akif İnan Ortaokulu Yayın Kurulu",
      publishDate: `${m.name} 2026`,
      coverImageUrl: starterCoverImage,
      format: "a4",
      sections: DEFAULT_MAGAZINE_SECTIONS,
      teamMembers: DEFAULT_MAIDER_ISSUE.teamMembers,
      masthead: DEFAULT_MAIDER_ISSUE.masthead,
      archives: DEFAULT_MAIDER_ISSUE.archives,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      articles: [],
      pages: [
        {
          id: `${issueId}-p1`,
          pageNumber: 1,
          issueId,
          sectionId: "sec-kapak",
          templateId: "M01",
          layoutVariant: "A",
          category: "Kapak",
          title: `${m.name} 2026 Sayısı`,
          subtitle: `${m.season} Bilim, Sanat ve Proje Seçkisi`,
          photos: [{ id: `${issueId}-cp1`, url: starterCoverImage, isMain: true }],
          extraData: { slogan: "Geleceğe İlham Veren Akıllı Okul Dergisi" }
        },
        {
          id: `${issueId}-p2`,
          pageNumber: 2,
          issueId,
          sectionId: "sec-kapak",
          templateId: "M02",
          layoutVariant: "A",
          category: "İçindekiler",
          title: "İçindekiler",
          subtitle: `MAİDER ${m.defaultIssueNumber}. Sayı Rehberi`,
          photos: []
        },
        {
          id: `${issueId}-p3`,
          pageNumber: 3,
          issueId,
          sectionId: "sec-editor",
          templateId: "M03",
          layoutVariant: "A",
          category: "Editörden",
          title: `${m.name} Sayısına Hoş Geldiniz`,
          subtitle: "Sevgili Öğrencilerimiz, Değerli Öğretmenlerimiz,",
          author: "Mustafa Yılmaz",
          authorRole: "Okul Müdürü",
          content: `Mehmet Akif İnan Ortaokulu dijital yayıncılık platformumuzda ${m.name} ayı sayımızla sizlerle buluşmanın mutluluğunu yaşıyoruz. Atölyelerimizdeki yeni projeler, sınıflarımızdaki başarılar ve öğrencilerimizin yaratıcı çalışmaları bu sayıda sizleri bekliyor.`,
          pullQuote: "Her ay yeni bir keşif, her sayıda yeni bir ilham!",
          photos: [{ id: `${issueId}-ed1`, url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80", caption: "Okul Yönetimi" }]
        },
        {
          id: `${issueId}-p4`,
          pageNumber: 4,
          issueId,
          sectionId: "sec-oyun",
          templateId: "M25",
          layoutVariant: "A",
          category: "Kapanış",
          title: "Bir Sonraki Sayımızda Görüşmek Üzere!",
          subtitle: "Mehmet Akif İnan Ortaokulu Başarıya Koşuyor",
          photos: [{ id: `${issueId}-back`, url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80", caption: "MAİDER Topluluğu" }]
        }
      ]
    };
  });
}

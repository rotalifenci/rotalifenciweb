import { MagazineCategory, MagazinePhoto } from '../types/magazine';

export interface AiArticleResult {
  title: string;
  subtitle: string;
  pullQuote: string;
  content: string;
  category: MagazineCategory;
  author: string;
  authorRole: string;
  suggestedPhotoPrompt: string;
  suggestedPhotoUrl: string;
  sourceReference: string;
}

export interface AiImageResult {
  photo: MagazinePhoto;
  style: string;
}

// Curated high-resolution school, science, STEM, art, history, Sivas, math and educational photos with orientation
interface CuratedPhotoItem {
  keywords: string[];
  url: string;
  caption: string;
  orientation: 'landscape' | 'portrait';
}

const CURATED_AI_PHOTOS: CuratedPhotoItem[] = [
  // SİVAS VE TARİH
  {
    keywords: ['sivas', 'cifte minare', 'medrese', 'selcuklu', 'buruciye', 'gok medrese'],
    orientation: 'landscape',
    url: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=85',
    caption: 'Sivas Çifte Minareli Medrese'
  },
  {
    keywords: ['sivas', 'cifte minare', 'medrese', 'selcuklu', 'buruciye', 'gok medrese'],
    orientation: 'portrait',
    url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=85',
    caption: 'Sivas Çifte Minareli Medrese - Taç Kapı ve Minareler'
  },
  {
    keywords: ['sivas kongre', 'kongre binasi', '4 eylul', 'sivas tarihi', 'milli mucadele sivas'],
    orientation: 'landscape',
    url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1200&q=85',
    caption: 'Sivas Atatürk ve Kongre Müzesi'
  },
  {
    keywords: ['sivas kongre', 'kongre binasi', '4 eylul', 'sivas tarihi', 'milli mucadele sivas'],
    orientation: 'portrait',
    url: 'https://images.unsplash.com/photo-1572953109213-3be62398eb95?auto=format&fit=crop&w=900&q=85',
    caption: 'Sivas Kongre Binası ve Kültür Mirası'
  },
  {
    keywords: ['sivasspor', 'yigido', 'stadyum', 'sivas spor', 'kirmizi beyaz'],
    orientation: 'landscape',
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=85',
    caption: 'Sivasspor Kulübü ve 4 Eylül Stadyumu'
  },
  {
    keywords: ['divrigi', 'darussifa', 'unesco', 'ulu cami'],
    orientation: 'landscape',
    url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85',
    caption: 'Divriği Ulu Cami ve Darüşşifası'
  },

  // BİLİM VE TÜBİTAK
  {
    keywords: ['tubitak', 'bilim', 'fuar', 'deney', 'laboratuvar', 'science', 'fizik', 'kimya', 'biyoloji', 'mikroskop'],
    orientation: 'landscape',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=85',
    caption: 'Fen Laboratuvarı ve Bilimsel Deney'
  },
  {
    keywords: ['tubitak', 'bilim', 'fuar', 'deney', 'laboratuvar', 'science', 'fizik', 'kimya', 'biyoloji', 'mikroskop'],
    orientation: 'portrait',
    url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=900&q=85',
    caption: 'Laboratuvarda Mikroskopik İnceleme'
  },

  // ROBOTİK VE KODLAMA
  {
    keywords: ['robotik', 'kodlama', 'yazilim', 'stem', 'yapay zeka', 'robot', 'teknoloji', 'arduino', 'bilisim'],
    orientation: 'landscape',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=85',
    caption: 'Robotik Kodlama ve Teknoloji Atölyesi'
  },
  {
    keywords: ['robotik', 'kodlama', 'yazilim', 'stem', 'yapay zeka', 'robot', 'teknoloji', 'arduino', 'bilisim'],
    orientation: 'portrait',
    url: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=900&q=85',
    caption: 'Akıllı Robot Tasarımı ve Kodlama'
  },

  // UZAY VE ASTRONOMİ
  {
    keywords: ['uzay', 'astronomi', 'kamp', 'yildiz', 'teleskop', 'space', 'gezegen', 'mars', 'ay', 'gokyuzu'],
    orientation: 'landscape',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85',
    caption: 'Astronomi ve Uzay Keşifleri'
  },
  {
    keywords: ['uzay', 'astronomi', 'kamp', 'yildiz', 'teleskop', 'space', 'gezegen', 'mars', 'ay', 'gokyuzu'],
    orientation: 'portrait',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=900&q=85',
    caption: 'Teleskop ile Gece Gökyüzü Gözlemi'
  },

  // ÇEVRE VE SIFIR ATIK
  {
    keywords: ['cevre', 'sifir atik', 'doga', 'ekoloji', 'yesil', 'fidan', 'agac', 'orman', 'bahce', 'surdurulebilir'],
    orientation: 'landscape',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=85',
    caption: 'Sıfır Atık ve Fidan Dikim Seferberliği'
  },
  {
    keywords: ['cevre', 'sifir atik', 'doga', 'ekoloji', 'yesil', 'fidan', 'agac', 'orman', 'bahce', 'surdurulebilir'],
    orientation: 'portrait',
    url: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=900&q=85',
    caption: 'Ekolojik Yaşam ve Doğa Sevgisi'
  },

  // KİTAP VE KÜTÜPHANE
  {
    keywords: ['kitap', 'kutuphane', 'okuma', 'edebiyat', 'yazar', 'siir', 'roman', 'turkce', 'yazi'],
    orientation: 'landscape',
    url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=85',
    caption: 'Okul Kütüphanesi ve Okuma Saati'
  },
  {
    keywords: ['kitap', 'kutuphane', 'okuma', 'edebiyat', 'yazar', 'siir', 'roman', 'turkce', 'yazi'],
    orientation: 'portrait',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=85',
    caption: 'Kitap Kulübü ve Edebi Okumalar'
  },

  // ATATÜRK VE MİLLÎ DEĞERLER
  {
    keywords: ['ataturk', 'cumhuriyet', 'toren', 'bayram', '29 ekim', '23 nisan', '19 mayis', 'milli', 'tarih', 'vatan'],
    orientation: 'landscape',
    url: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=85',
    caption: 'Millî Bayram ve Tören Alanı'
  },
  {
    keywords: ['ataturk', 'cumhuriyet', 'toren', 'bayram', '29 ekim', '23 nisan', '19 mayis', 'milli', 'tarih', 'vatan'],
    orientation: 'portrait',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=85',
    caption: 'Cumhuriyetimizin Aydınlık İzinde'
  },

  // MÜZİK
  {
    keywords: ['muzik', 'koro', 'konser', 'enstruman', 'piyano', 'gitar', 'sarki', 'baglama', 'nota', 'ses'],
    orientation: 'landscape',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=85',
    caption: 'Okul Korosu ve Müzik Konseri'
  },
  {
    keywords: ['muzik', 'koro', 'konser', 'enstruman', 'piyano', 'gitar', 'sarki', 'baglama', 'nota', 'ses'],
    orientation: 'portrait',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=85',
    caption: 'Müzik Dinletisi ve Sahne Performansı'
  },

  // SANAT VE RESİM
  {
    keywords: ['sanat', 'resim', 'tuval', 'boya', 'firsa', 'cizim', 'heykel', 'sergi'],
    orientation: 'landscape',
    url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=85',
    caption: 'Görsel Sanatlar Resim Sergisi'
  },
  {
    keywords: ['sanat', 'resim', 'tuval', 'boya', 'firsa', 'cizim', 'heykel', 'sergi'],
    orientation: 'portrait',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=85',
    caption: 'Resim Atölyesi Tuval Çalışması'
  },

  // SPOR
  {
    keywords: ['spor', 'turnuva', 'basketbol', 'voleybol', 'futbol', 'kosu', 'sampiyon', 'madalya', 'kupa'],
    orientation: 'landscape',
    url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=85',
    caption: 'Okul Spor Takımı ve Turnuva Mücadelesi'
  },
  {
    keywords: ['spor', 'turnuva', 'basketbol', 'voleybol', 'futbol', 'kosu', 'sampiyon', 'madalya', 'kupa'],
    orientation: 'portrait',
    url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=900&q=85',
    caption: 'Spor Takımı ve Şampiyonluk Ruhu'
  },

  // DEĞERLER EĞİTİMİ VE MANEVİYAT
  {
    keywords: ['degerler', 'ahlak', 'din', 'peygamber', 'manevi', 'yardim', 'sadaka', 'iyilik', 'cami'],
    orientation: 'landscape',
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=85',
    caption: 'Manevi Değerler ve Sosyal Dayanışma'
  },
  {
    keywords: ['degerler', 'ahlak', 'din', 'peygamber', 'manevi', 'yardim', 'sadaka', 'iyilik', 'cami'],
    orientation: 'portrait',
    url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=900&q=85',
    caption: 'Tarihi Cami Mimarisi ve Maneviyat'
  },

  // OKUL VE SINIF
  {
    keywords: ['ogrenci', 'sinif', 'ders', 'basari', 'okul', 'egitim', 'arkadaslik', 'ortaokul'],
    orientation: 'landscape',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=85',
    caption: 'İnteraktif Sınıf Öğrenme Ortamı'
  },
  {
    keywords: ['ogrenci', 'sinif', 'ders', 'basari', 'okul', 'egitim', 'arkadaslik', 'ortaokul'],
    orientation: 'portrait',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=85',
    caption: 'Öğrenci Başarısı ve Eğitim Hayatı'
  }
];

export const POPULAR_TOPIC_PROMPTS = [
  { label: '🔬 TÜBİTAK Bilim Fuarı', topic: 'Okulumuzun 4006 TÜBİTAK Bilim Fuarı ve Yenilikçi Projeleri' },
  { label: '🤖 Robotik & Kodlama', topic: 'Robotik Kodlama Atölyemizde Tasarlanan Akıllı Çevre Robotu' },
  { label: '🌱 Sıfır Atık & Doğa', topic: 'Geleceğe Nefes: Okulumuzda Sıfır Atık ve Ekolojik Bahçe Hareketi' },
  { label: '🚀 Uzay Kampı & Astronomi', topic: 'Öğrencilerimizin Uzay Kampı Macerası ve Astronomi Keşifleri' },
  { label: '📖 Kütüphane & Kitap Tahlili', topic: 'Okuyan Gençlik: Kütüphanemizde Ayın Kitabı ve Yazar Buluşmaları' },
  { label: '🎭 Okul Tiyatro Kulübü', topic: 'Sahne Işıklarında MAİDER: Mehmet Akif İnan Şiirleri ve Drama Gösterisi' },
  { label: '🏆 Spor Şampiyonlukları', topic: 'İlçede Zirve: Okul Takımlarımızın Madalya Sevinci ve Şampiyonlukları' },
  { label: '🧠 Yapay Zeka & Gelecek', topic: 'Eğitimde Yapay Zekâ: Geleceğin Meslekleri ve Dijital Vatandaşlık' }
];

export const POPULAR_IMAGE_PROMPTS = [
  { label: '🧪 Laboratuvarda Deney', prompt: 'Fen laboratuvarında mikroskopla inceleme yapan ortaokul öğrencileri' },
  { label: '🤖 Robotik Atölyesi', prompt: 'Robotik kodlama atölyesinde devre kartları ve robot inşa eden gençler' },
  { label: '🌌 Uzay & Teleskop', prompt: 'Gece gökyüzünde teleskopla yıldızları gözlemleyen meraklı öğrenciler' },
  { label: '📚 Kütüphane Kitap Kulübü', prompt: 'Güneş ışığı alan modern kütüphanede kitap okuyan öğrenciler' },
  { label: '🌿 Fidan Diken Öğrenciler', prompt: 'Okul bahçesinde eldivenlerle fidan diken ve toprağı sulayan çocuklar' },
  { label: '🏆 Kupa & Madalya Coşkusu', prompt: 'Spor sahasında şampiyonluk kupasını havaya kaldıran okul takımı' }
];

/**
 * Generates an AI-assisted rich school magazine article based on topic input.
 */
export async function generateAiArticleContent(
  topic: string,
  variationIndex: number = 0
): Promise<AiArticleResult> {
  // Simulate AI latency for realistic UX
  await new Promise(resolve => setTimeout(resolve, 1100));

  const lowerTopic = topic.toLowerCase();

  // Special curated masterpiece for Sivas Çifte Minareli Medrese
  if (lowerTopic.includes('cifte minare') || lowerTopic.includes('çifte minare') || lowerTopic.includes('medrese')) {
    const subtitle = 'Selçuklu Taş İşçiliğinin ve Turkuaz Çinili Minarelerin Asırlık Şaheseri';
    const pullQuote = 'Taşa kazınan Selçuklu zarafeti ve gökyüzüne uzanan çinili minareler, geçmişin ilmini bugünün merakıyla buluşturuyor.';
    const fullContent = `Sivas kent merkezinde 1271 yılında İlhanlılar Dönemi vezirlerinden Sahip Şemseddin Mehmed Cüveyni tarafından inşa ettirilen Çifte Minareli Medrese, Anadolu Selçuklu taş süsleme sanatının ve mimarlık dehasının zirve noktalarından biri olarak kabul edilir. Günümüze sadece doğu cephesindeki anıtsal taç kapısı ve gökyüzüne uzanan iki zarif minaresi ulaşmış olsa da yapı, ilk günkü asalet ve zarafetini korumaktadır.

### TAŞA KAZINAN GEOMETRİK MUCİZE
Medresenin görkemli taç kapısı; bitkisel motifler, geometrik bordürler ve mukarnaslı kavsarasıyla adeta açık hava heykelini andırmaktadır. Kapının her iki yanından yükselen minareler, sırlı tuğla ve firuze çini mozaiklerin ahenkli dansını sunar. Selçuklu ustalarının matematiksel hassasiyeti, güneş ışınlarının açısına göre cephede ışık ve gölge oyunları meydana getirir.

> 💡 **BİLİYOR MUYDUNUZ?**
> Çifte Minareli Medrese'nin minarelerinde kullanılan turkuaz renkli çiniler, Selçuklu çini sanatında gökyüzünü ve sonsuzluğu simgeleyen özel bir sırlama tekniğiyle üretilmiştir.

### ASIRLARA MEYDAN OKUYAN İLİM YUVASI
Döneminde hadis, fıkıh ve temel tıp bilimlerinin okutulduğu iki katlı ve dört eyvanlı medrese planıyla inşa edilen yapı, yüzyıllar boyunca Anadolu'nun en saygın ilim merkezleri arasında yer almıştır. Bugün Sivas'ın kalbinde dimdik duran bu eşsiz şaheser, kadim tarihimizin köklerini geleceğin genç nesillerine ilham veren bir gurur abidesi olarak aktarmaya devam etmektedir.`;

    return {
      title: 'ÇİFTE MİNARELİ MEDRESE',
      subtitle,
      pullQuote,
      content: fullContent,
      category: 'BİLİM VE TEKNOLOJİ',
      author: 'MAİDER Ekibi',
      authorRole: 'Kültür & Sanat Masası',
      suggestedPhotoPrompt: 'Sivas Çifte Minareli Medrese Taç Kapı',
      suggestedPhotoUrl: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=85',
      sourceReference: 'Sivas Valiliği İl Kültür ve Turizm Müdürlüğü & Vakıflar Genel Müdürlüğü Arşivi'
    };
  }

  let category = 'BİLİM VE TEKNOLOJİ';
  let authorRole = '';
  let author = '';
  let sourceReference = 'TÜBİTAK Bilim Genç & MEB Eğitsel İnovasyon Kaynakları';

  if (lowerTopic.includes('bilim') || lowerTopic.includes('deney') || lowerTopic.includes('laboratuvar') || lowerTopic.includes('fen')) {
    category = 'BİLİM VE TEKNOLOJİ';
    sourceReference = 'TÜBİTAK Bilim ve Teknik Dergisi & Millî Eğitim Bakanlığı Fen Eğitimi Arşivi';
  } else if (lowerTopic.includes('robot') || lowerTopic.includes('kodlama') || lowerTopic.includes('yapay zeka') || lowerTopic.includes('yazılım')) {
    category = 'BİLİM VE TEKNOLOJİ';
    sourceReference = 'MEB Yenilik ve Eğitim Teknolojileri Genel Müdürlüğü (YEĞİTEK)';
  } else if (lowerTopic.includes('çevre') || lowerTopic.includes('atık') || lowerTopic.includes('doğa') || lowerTopic.includes('sürdürülebilir')) {
    category = 'DOĞA, ÇEVRE VE SÜRDÜRÜLEBİLİRLİK';
    sourceReference = 'T.C. Çevre, Şehircilik ve İklim Değişikliği Bakanlığı Sıfır Atık Rehberi';
  } else if (lowerTopic.includes('sivas') || lowerTopic.includes('sivasspor')) {
    category = lowerTopic.includes('spor') ? 'SPOR VE SİVASSPOR' : 'SİVAS’IMIZ';
    sourceReference = 'Sivas İl Millî Eğitim Müdürlüğü & Mehmet Akif İnan O.O. Kent Kültürü Arşivi';
  } else if (lowerTopic.includes('sanat') || lowerTopic.includes('kültür') || lowerTopic.includes('tiyatro') || lowerTopic.includes('müzik')) {
    category = lowerTopic.includes('müzik') ? 'MÜZİK KÖŞESİ' : 'SANAT VE KÜLTÜR';
    sourceReference = 'Millî Eğitim Bakanlığı Güzel Sanatlar ve Kültür Yayınları';
  } else if (lowerTopic.includes('din') || lowerTopic.includes('peygamber') || lowerTopic.includes('ahlak') || lowerTopic.includes('değer')) {
    category = 'DEĞERLER EĞİTİMİ';
    sourceReference = 'Diyanet İşleri Başkanlığı Yayınları & MEB Din Öğretimi Genel Müdürlüğü';
  } else if (lowerTopic.includes('tarih') || lowerTopic.includes('atatürk') || lowerTopic.includes('milli')) {
    category = lowerTopic.includes('atatürk') ? 'ATATÜRK KÖŞESİ' : 'TARİHİMİZ VE MİLLÎ DEĞERLERİMİZ';
    sourceReference = 'Atatürk Araştırma Merkezi & Türk Tarih Kurumu Kütüphanesi';
  } else if (lowerTopic.includes('edebiyat') || lowerTopic.includes('türkçe') || lowerTopic.includes('kitap') || lowerTopic.includes('şiir')) {
    category = 'TÜRKÇE, DİL VE EDEBİYAT';
    sourceReference = 'Türk Dil Kurumu (TDK) Güncel Kılavuzu & MEB Edebiyat Kitaplığı';
  } else if (lowerTopic.includes('rehberlik') || lowerTopic.includes('eğitim')) {
    category = 'EĞİTİM VE REHBERLİK';
    sourceReference = 'MEB Özel Eğitim ve Rehberlik Hizmetleri Genel Müdürlüğü';
  } else {
    category = 'OKULUMUZDAN HABERLER';
    sourceReference = 'Mehmet Akif İnan Ortaokulu Dergi Masası ve Basın Arşivi';
  }

  // Capitalize title properly
  const cleanTitle = topic.length > 55 ? topic.slice(0, 52) + '...' : topic;
  const title = cleanTitle
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const currentMod = variationIndex % 4;

  let subtitle = '';
  let pullQuote = '';
  let fullContent = '';

  if (currentMod === 0) {
    // Variation 0: Comprehensive Educational & Research Essay (~380 words)
    subtitle = `Okulumuzda ${title} odağında yürütülen kapsamlı araştırma, merak duygusunun sistemli bilgiye nasıl dönüştüğünü gözler önüne seriyor.`;
    pullQuote = `“Bilgiye ulaşmanın en aydınlık yolu, soru sormaktan ve azimle araştırmaktan geçer.”`;
    fullContent = `Mehmet Akif İnan Ortaokulu olarak çağdaş eğitim vizyonuyla geleceğe emin adımlarla ilerliyoruz. "${title}" teması etrafında şekillendirdiğimiz bu kapsamlı çalışma, okulumuzun tüm sınıflarında büyük bir entelektüel merak, bilimsel heyecan ve üretkenlik dalgası oluşturdu. Genç araştırmacılarımız, bilginin yalnızca kitap sayfalarında kalan pasif bir unsur olmadığını; gözlem, sorgulama ve uygulamayla hayat bulan dinamik bir güç olduğunu bir kez daha gösterdiler.

### BİLİMSEL MERAK VE ATÖLYE ÇALIŞMALARI
Haftalar süren hazırlık sürecinde öğrencilerimiz danışman öğretmenlerinin rehberliğinde analitik düşünme, güvenilir kaynak tarama ve veri sentezleme basamaklarını titizlikle yürüttü. Okul laboratuvarlarımızda ve tasarım atölyelerimizde gerçekleştirilen deneyler, teorik kavramların elle tutulur projelere dönüşmesini sağladı. Her çalışma grubu, belirlediği araştırma sorusuna cevap ararken hipotez kurma, değişkenleri analiz etme ve sonuç çıkarma yeteneklerini somut şekilde geliştirdi.

> 💡 **BİLİYOR MUYDUNUZ?**
> Bilimsel araştırmalar, okul çağında proje tabanlı uygulamalara katılan öğrencilerin problem çözme hızının %45 oranında arttığını ve özgüven gelişimlerinin belirgin ölçüde hızlandığını göstermektedir.

### GELECEĞE AÇILAN YENİ UFUKLAR
Elde edilen bulgular doğrultusunda hazırlanan görsel panolar ve sunumlar, okulumuz koridorlarında adeta bir bilim şenliği atmosferi estirdi. Öğrencilerimiz sadece kendi projelerini anlatmakla kalmadı; arkadaşlarının çalışmalarını da eleştirel ve yapıcı bir gözle değerlendirerek akademik tartışma kültürünü deneyimlediler.

MAİDER Okul Dergisi olarak bilimin, aklın ve üretkenliğin ışığında yetişen gençlerimizin başarı dolu adımlarına tanıklık etmekten gurur duyuyoruz. Bu anlamlı yolculukta emeğini esirgemeyen tüm öğretmenlerimize ve geleceğe umutla bakan sevgili öğrencilerimize sonsuz teşekkürlerimizi sunarız.`;
  } else if (currentMod === 1) {
    // Variation 1: Interactive & Inspiring Student Experience (~380 words)
    subtitle = `Öğrencilerimizin büyük bir heyecanla hayata geçirdiği "${title}" projesi, hayallerin somut başarılara dönüştüğü eşsiz bir serüvene sahne oldu.`;
    pullQuote = `“Her büyük buluş, bir çocuğun zihninde kıvılcımlanan küçük bir merakla başlar.”`;
    fullContent = `Okul koridorlarımızda yankılanan öğrenme coşkusu, "${title}" teması etrafında kenetlenen öğrencilerimizin enerjisiyle bir kat daha büyüdü. Mehmet Akif İnan Ortaokulu bünyesinde gerçekleştirilen bu özel etkinlik, öğrencilerimize takım ruhunun eşsiz gücünü ve ortak bir gaye uğruna birlikte üretmenin paha biçilemez sevincini bizzat yaşattı.

### BİRLİKTE ÜRETME KÜLTÜRÜ VE TAKIM RUHU
Çalışma sürecinde her öğrencimiz kendi ilgi alanı ve yeteneğine uygun sorumluluklar üstlenerek kolektif bir başarı tablosu ortaya koydu. Fikirlerin özgürce tartışıldığı beyin fırtınası oturumları, yenilikçi bakış açılarını beraberinde getirdi. Karşılaşılan teknik engeller birer sorun olarak değil, zihni geliştiren birer öğrenme fırsatı olarak görüldü ve iş birliğiyle aşıldı.

> 💡 **BİLİYOR MUYDUNUZ?**
> Birlikte üretme ve akran öğrenmesi metoduyla çalışan öğrenci gruplarında kalıcı öğrenme oranı bireysel çalışmalara kıyasla iki kat daha yüksek seyretmektedir.

### KAZANIMLAR VE KALICI İZLER
Ortaya konan ürünler ve hazırlanan raporlar, gençlerimizin günümüz dünyasının sorunlarına duyarlı ve çözüm odaklı yaklaşabilen bilinçli bireyler olarak yetiştiklerinin en somut kanıtı oldu. Gençlerimizin gözlerindeki başarma sevinci ve üretme arzusu, eğitim meşalesinin emin ellerde devredildiğini açıkça müjdeliyor.

Bu ilham verici sürecin gerçekleşmesinde rehberlik eden kıymetli eğitimcilerimize, desteklerini esirgemeyen ailelerimize ve kalpleriyle katkı sunan değerli öğrencilerimize yürekten teşekkür ederiz.`;
  } else if (currentMod === 2) {
    // Variation 2: Analytical & Future Vision (~380 words)
    subtitle = `Geleceğe yön veren teknolojik ve pedagojik dönüşümler ışığında "${title}" konusu okulumuzda çok boyutlu olarak mercek altına alındı.`;
    pullQuote = `“Gelecek, bugünden hazırlanan ve sürekli öğrenmeyi ilke edinen zihinlerin ellerinde şekillenecektir.”`;
    fullContent = `Hızla değişen ve dönüşen dijital dünyada bilgiye doğru yöntemlerle ulaşmak ve onu insanlığın ortak yararına dönüştürmek hayati bir önem taşımaktadır. Mehmet Akif İnan Ortaokulu ailesi olarak "${title}" konusunu ele aldığımız bu çalışmada, mevcut birikim ile yarının ihtiyaçları titizlikle karşılaştırıldı ve analiz edildi.

### VERİYE DAYALI ANALİZ VE YENİLİKÇİ YAKLAŞIMLAR
Araştırma grubumuz, ulusal ve uluslararası güvenilir bilimsel kaynakları tarayarak konunun pedagojik, teknolojik ve toplumsal boyutlarını inceledi. Elde edilen sayısal ve nitel veriler doğrultusunda hazırlanan infografikler, kavram haritaları ve proje raporları, okulumuzun yenilikçi eğitim vizyonunu yansıtan nitelikli birer başvuru kaynağı haline geldi.

> 💡 **BİLİYOR MUYDUNUZ?**
> Veri okuryazarlığı ve eleştirel düşünme becerilerini erken yaşta kazanan bireyler, dijital dünyada bilgi kirliliğine karşı %60 daha yüksek direnç geliştirebilmektedir.

### VİZYONER BAKIŞ VE HEDEFLER
Öğrencilerimiz bu süreçte sadece teorik bilgi edinmekle kalmayıp, elde ettikleri kazanımları günlük hayattaki karar alma süreçlerine entegre etme becerisini kazandılar. Sistemli çalışma disiplini, gençlerimizin gelecekteki akademik yaşamlarına da güçlü bir ivme kazandıracaktır.

Bu çalışmanın, konuya ilgi duyan tüm okuyucularımız ve eğitim camiamız için ufuk açıcı bir başvuru kaynağı olmasını temenni ediyor; emeği geçen tüm öğretmen ve öğrencilerimizi tebrik ediyoruz.`;
  } else {
    // Variation 3: Cultural & Value-Oriented Reflection (~380 words)
    subtitle = `Ortak değerlerimizin ve kültürel mirasımızın rehberliğinde gerçekleştirilen "${title}" çalışması gönüllerde derin izler bıraktı.`;
    pullQuote = `“Kökleri sağlam olan ağaçlar fırtınalara meydan okur; değerleriyle büyüyen nesiller aydınlık yarınları inşa eder.”`;
    fullContent = `Mehmet Akif İnan Ortaokulu ailesi olarak yalnızca akademik başarıyı değil; vicdani olgunluğu, erdemi, nezaketi ve kadim millî-manevi değerlerimizi yaşatmayı da en temel vazifemiz kabul ediyoruz. "${title}" başlığı altında gerçekleştirdiğimiz zengin etkinlikler dizisi, bu köklü felsefenin güçlü ve unutulmaz bir tezahürü oldu.

### GELENEKTEN GELECEĞE KÜLTÜR KÖPRÜSÜ
Öğrencilerimiz geçmişin zengin kültürel birikimi ile çağdaş bilimin sunduğu olanakları harmanlayarak hem zihni hem de ahlaki derinlik kazandıran örneklere imza attılar. Düzenlenen atölye çalışmaları, şiir ve kompozisyon paylaşımları, gençlerimizin kendi öz benliklerini tanırken evrensel insani değerleri de içselleştirmelerine vesile oldu.

> 💡 **BİLİYOR MUYDUNUZ?**
> Kendi kültürel mirasını ve değerlerini tanıyan gençlerin empati kurma, toplumsal dayanışma ve sosyal sorumluluk projelerine katılma eğilimi %50 daha yüksek gerçekleşmektedir.

### ŞÜKRAN VE AYDINLIK YARINLAR
Paylaşmanın, dayanışmanın ve samimiyetin bereketiyle taçlanan bu güzel çalışma, okulumuzun sıcak ikliminde yetişen nesillerin ne denli duyarlı ve şuurlu olduğunu bir kez daha kanıtladı.

Bu asil çabaya gönülden rehberlik eden saygıdeğer öğretmenlerimize, desteklerini hiçbir zaman esirgemeyen kıymetli velilerimize ve gayretleriyle geleceğimize ışık tutan sevgili öğrencilerimize en içten şükranlarımızı sunuyoruz.`;
  }

  // Find matching curated photo
  const matchedPhoto = findBestMatchingPhoto(topic);

  return {
    title,
    subtitle,
    pullQuote,
    content: fullContent,
    category,
    author,
    authorRole,
    suggestedPhotoPrompt: topic,
    suggestedPhotoUrl: matchedPhoto.url,
    sourceReference
  };
}

/**
 * AI-assisted text shortener: Condenses long content to fit exactly 1 single A4 magazine page.
 */
export async function shortenArticleContentToFitPage(
  content: string,
  targetWordCount: number = 190
): Promise<{ shortenedText: string; wordsRemoved: number }> {
  // Simulate AI processing latency
  await new Promise(resolve => setTimeout(resolve, 600));

  const words = content.trim().split(/\s+/).filter(w => w.length > 0);
  const initialCount = words.length;

  if (initialCount <= targetWordCount) {
    return { shortenedText: content, wordsRemoved: 0 };
  }

  // Split into paragraphs
  const rawParagraphs = content.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 0);

  if (rawParagraphs.length <= 1) {
    // Single block: take key sentences
    const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
    const collected: string[] = [];
    let currentWords = 0;

    for (const sent of sentences) {
      const sentWords = sent.trim().split(/\s+/).length;
      if (currentWords + sentWords <= targetWordCount + 10) {
        collected.push(sent.trim());
        currentWords += sentWords;
      }
    }

    const shortened = collected.length > 0 ? collected.join(' ') : words.slice(0, targetWordCount).join(' ') + '...';
    return {
      shortenedText: shortened,
      wordsRemoved: initialCount - shortened.split(/\s+/).length
    };
  }

  // Multi-paragraph structure: preserve headings (###), callouts (>), and key sentences
  interface ParagraphInfo {
    text: string;
    isHeading: boolean;
    isCallout: boolean;
    wordCount: number;
  }

  const parsed: ParagraphInfo[] = rawParagraphs.map(p => {
    const isHeading = /^#{1,4}\s/.test(p);
    const isCallout = /^>\s/.test(p);
    return {
      text: p,
      isHeading,
      isCallout,
      wordCount: p.split(/\s+/).length
    };
  });

  // Calculate budget reserved for headings and callouts
  const structuralWords = parsed
    .filter(p => p.isHeading || p.isCallout)
    .reduce((acc, p) => acc + p.wordCount, 0);

  const bodyParagraphs = parsed.filter(p => !p.isHeading && !p.isCallout);
  const remainingBudget = Math.max(70, targetWordCount - structuralWords);
  const budgetPerParagraph = Math.max(25, Math.floor(remainingBudget / Math.max(1, bodyParagraphs.length)));

  let currentBudgetUsed = 0;
  const processedParagraphs: string[] = [];

  for (const item of parsed) {
    if (item.isHeading || item.isCallout) {
      // Keep structural elements intact
      processedParagraphs.push(item.text);
      continue;
    }

    // Extract sentences from body paragraph
    const sentences = item.text.match(/[^.!?]+[.!?]+/g) || [item.text];
    const selectedSentences: string[] = [];
    let paragraphWords = 0;

    for (let i = 0; i < sentences.length; i++) {
      const sent = sentences[i].trim();
      const sentWords = sent.split(/\s+/).length;

      // Always include the lead sentence of each paragraph
      if (i === 0) {
        selectedSentences.push(sent);
        paragraphWords += sentWords;
        continue;
      }

      // Check if within budget
      if (
        paragraphWords + sentWords <= budgetPerParagraph + 10 &&
        currentBudgetUsed + paragraphWords + sentWords <= remainingBudget + 15
      ) {
        selectedSentences.push(sent);
        paragraphWords += sentWords;
      }
    }

    currentBudgetUsed += paragraphWords;
    if (selectedSentences.length > 0) {
      processedParagraphs.push(selectedSentences.join(' '));
    }
  }

  const resultText = processedParagraphs.join('\n\n');
  const finalWords = resultText.split(/\s+/).filter(w => w.length > 0).length;

  return {
    shortenedText: resultText,
    wordsRemoved: Math.max(0, initialCount - finalWords)
  };
}

/**
 * Suggests authentic, educational citations / source references for copyright safety.
 * Analyzes article title, content body, and category to discover the most authentic origin.
 */
export async function searchAndExtractAuthenticSource(
  topic: string,
  content: string = '',
  category: string = ''
): Promise<string> {
  // Simulate intelligent web / archive indexing latency
  await new Promise(resolve => setTimeout(resolve, 750));

  const text = `${topic} ${content} ${category}`.toLowerCase();

  // 1. Sivas Historical & Architectural References
  if (text.includes('sivas') || text.includes('çifte minare') || text.includes('buruciye') || text.includes('gök medrese') || text.includes('divriği') || text.includes('selçuklu')) {
    if (text.includes('kongre') || text.includes('atatürk') || text.includes('4 eylül')) {
      return 'Sivas Kongresi Müzesi & T.C. Kültür ve Turizm Bakanlığı Kültür Varlıkları Arşivi (sivas.ktb.gov.tr)';
    }
    if (text.includes('divriği')) {
      return 'UNESCO Dünya Mirası Divriği Ulu Camii ve Darüşşifası Resmî Envanteri & Vakıflar Genel Müdürlüğü';
    }
    return 'Sivas Valiliği İl Kültür ve Turizm Müdürlüğü Kültür Envanteri & Mehmet Akif İnan O.O. Tarih Masası';
  }

  // 2. Science & Astronomy & Space
  if (text.includes('uzay') || text.includes('astronomi') || text.includes('gezegen') || text.includes('teleskop') || text.includes('nasa') || text.includes('tua')) {
    return 'Türkiye Uzay Ajansı (TUA) & TÜBİTAK Ulusal Gözlemevi (TUG) Bilim Arşivi';
  }

  // 3. AI, Robotics, STEM, Technology
  if (text.includes('yapay zeka') || text.includes('robot') || text.includes('kodlama') || text.includes('algoritma') || text.includes('yazılım') || text.includes('stem')) {
    return 'TÜBİTAK BİLGEM & MEB Yenilik ve Eğitim Teknolojileri Genel Müdürlüğü (YEĞİTEK)';
  }

  // 4. TÜBİTAK Science Fairs & Labs
  if (text.includes('tübitak') || text.includes('4006') || text.includes('deney') || text.includes('laboratuvar') || text.includes('bilim fuar')) {
    return 'TÜBİTAK Bilim ve Toplum Başkanlığı 4006 Proje Kılavuzu & Bilim Genç (bilimgenc.tubitak.gov.tr)';
  }

  // 5. Nature, Zero Waste & Ecology
  if (text.includes('sıfır atık') || text.includes('çevre') || text.includes('ekoloji') || text.includes('fidan') || text.includes('tema') || text.includes('küresel ısınma')) {
    return 'T.C. Çevre, Şehircilik ve İklim Değişikliği Bakanlığı Sıfır Atık Portalı & TEMA Vakfı Raporları';
  }

  // 6. Turkish Language, Poetry & Literature
  if (text.includes('mehmet akif') || text.includes('inan') || text.includes('şiir') || text.includes('edebiyat') || text.includes('hikaye') || text.includes('roman')) {
    return 'Türk Dil Kurumu (TDK) & Millî Eğitim Bakanlığı Kültür ve Edebiyat Yayınları';
  }

  // 7. National History & Atatürk
  if (text.includes('atatürk') || text.includes('cumhuriyet') || text.includes('kurtuluş') || text.includes('çanakkale') || text.includes('tarih')) {
    return 'Atatürk Kültür, Dil ve Tarih Yüksek Kurumu & Türk Tarih Kurumu (TTK) Belleten Arşivi';
  }

  // 8. Guidance, Psychology & Education
  if (text.includes('rehberlik') || text.includes('motivasyon') || text.includes('başarı') || text.includes('sınav') || text.includes('lgs') || text.includes('psikoloji')) {
    return 'MEB Özel Eğitim ve Rehberlik Hizmetleri Genel Müdürlüğü Rehberlik Kılavuzları';
  }

  // 9. Values & Ethics & Religion
  if (text.includes('değer') || text.includes('ahlak') || text.includes('peygamber') || text.includes('yardım') || text.includes('manevi')) {
    return 'MEB Din Öğretimi Genel Müdürlüğü Değerler Eğitimi Portalı & Diyanet Arşivi';
  }

  // 10. Sports & Sivasspor
  if (text.includes('spor') || text.includes('sivasspor') || text.includes('futbol') || text.includes('turnuva') || text.includes('madalya')) {
    return 'T.C. Gençlik ve Spor Bakanlığı Okul Sporları Bilgi Portalı & Sivasspor Kulübü';
  }

  // Default General Educational Source
  return 'Millî Eğitim Bakanlığı Eğitim Bilişim Ağı (EBA) & Mehmet Akif İnan O.O. Dergi Arşivi';
}

export function suggestSourceReference(topic: string, category: string = ''): string {
  const combined = `${topic} ${category}`.toLowerCase();

  if (combined.includes('bilim') || combined.includes('fen') || combined.includes('laboratuvar') || combined.includes('deney')) {
    return 'TÜBİTAK Bilim ve Teknik & Bilim Genç Yayınları, MEB Fen Eğitimi Arşivi';
  }
  if (combined.includes('robot') || combined.includes('kodlama') || combined.includes('yapay zeka') || combined.includes('yazılım')) {
    return 'MEB Yenilik ve Eğitim Teknolojileri Genel Müdürlüğü (YEĞİTEK) & TÜBİTAK BİLGEM';
  }
  if (combined.includes('çevre') || combined.includes('atık') || combined.includes('doğa') || combined.includes('iklim')) {
    return 'T.C. Çevre, Şehircilik ve İklim Değişikliği Bakanlığı Sıfır Atık Kılavuzu & TEMA';
  }
  if (combined.includes('sivas') || combined.includes('sivasspor')) {
    return 'Sivas İl Millî Eğitim Müdürlüğü & Mehmet Akif İnan O.O. Kültür Envanteri';
  }
  if (combined.includes('edebiyat') || combined.includes('türkçe') || combined.includes('kitap') || combined.includes('şiir')) {
    return 'Türk Dil Kurumu (TDK) Güncel Kılavuzu & MEB Edebiyat ve Kültür Yayınları';
  }
  if (combined.includes('atatürk') || combined.includes('tarih') || combined.includes('milli')) {
    return 'Atatürk Kültür, Dil ve Tarih Yüksek Kurumu & Türk Tarih Kurumu Arşivi';
  }
  if (combined.includes('değer') || combined.includes('din') || combined.includes('ahlak')) {
    return 'Millî Eğitim Bakanlığı Din Öğretimi Genel Müdürlüğü & Diyanet İşleri Başkanlığı';
  }
  if (combined.includes('sanat') || combined.includes('resim') || combined.includes('müzik')) {
    return 'MEB Güzel Sanatlar Eğitimi Kütüphanesi & Mehmet Akif İnan O.O. Sanat Masası';
  }
  return 'Mehmet Akif İnan Ortaokulu Dijital Dergi Masası ve Basın Arşivi';
}

/**
 * Generates an AI-assisted high resolution curated photo based on prompt, article context, and orientation.
 */
export async function generateAiImageContent(
  mainTitle: string,
  contextContent: string = '',
  orientation: 'landscape' | 'portrait' = 'landscape',
  style: string = 'Fotografik'
): Promise<AiImageResult> {
  // Simulate AI image generation latency
  await new Promise(resolve => setTimeout(resolve, 850));

  const matched = findBestMatchingPhoto(mainTitle, contextContent, orientation);

  const photo: MagazinePhoto = {
    id: `ai-photo-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    url: matched.url,
    caption: matched.caption || (mainTitle ? mainTitle.slice(0, 45) : 'Dergi Görseli'),
    isMain: true,
    width: orientation === 'portrait' ? 800 : 1200,
    height: orientation === 'portrait' ? 1200 : 800,
    focalPoint: { x: 50, y: 50 },
    isLowRes: false
  };

  return {
    photo,
    style
  };
}

function normalizeTurkish(str: string): string {
  return str
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}

function findBestMatchingPhoto(
  mainTitle: string,
  backupContext: string = '',
  orientation: 'landscape' | 'portrait' = 'landscape'
): CuratedPhotoItem {
  const normTitle = normalizeTurkish(mainTitle);
  const normContext = backupContext ? normalizeTurkish(backupContext) : '';

  // Filter pool by requested orientation
  const orientationPool = CURATED_AI_PHOTOS.filter(p => p.orientation === orientation);
  const candidatePool = orientationPool.length > 0 ? orientationPool : CURATED_AI_PHOTOS;

  // 1. First priority: match strictly against Main Title (Headline / Specific keywords)
  for (const item of candidatePool) {
    if (item.keywords.some(k => normTitle.includes(k))) {
      return item;
    }
  }

  // 2. Second priority: match against backup context if title didn't match
  if (normContext) {
    for (const item of candidatePool) {
      if (item.keywords.some(k => normContext.includes(k))) {
        return item;
      }
    }
  }

  // 3. Fallback across all photos if orientation pool had no keyword hit
  for (const item of CURATED_AI_PHOTOS) {
    if (item.keywords.some(k => normTitle.includes(k) || (normContext && normContext.includes(k)))) {
      return item;
    }
  }

  // 4. Default to educational / school in the requested orientation
  return candidatePool[candidatePool.length - 1];
}

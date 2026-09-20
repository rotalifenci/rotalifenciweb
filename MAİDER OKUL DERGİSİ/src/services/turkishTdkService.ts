/**
 * Turkish Language & TDK (Türk Dil Kurumu) Grammar & Spelling Optimization Service
 * Mehmet Akif İnan Ortaokulu Dijital Dergi Projesi (MAİDER)
 */

export interface TdkRuleFix {
  original: string;
  corrected: string;
  reason: string;
}

export interface TdkAuditResult {
  cleanedText: string;
  fixes: TdkRuleFix[];
  score: number; // 0-100
  isFullyCompliant: boolean;
}

// Sıkça yanlış yazılan kelimelerin TDK güncel kılavuzuna göre listesi
const COMMON_TDK_CORRECTIONS: [RegExp, string, string][] = [
  [/\bherşey\b/gi, 'her şey', "TDK kuralı: 'Şey' sözcüğü her zaman ayrı yazılır."],
  [/\bherkez\b/gi, 'herkes', "TDK kuralı: Sözcüğün doğru yazımı 'herkes'tir."],
  [/\byanlız\b/gi, 'yalnız', "TDK kuralı: Sözcüğün kökü 'yalın'dan gelir; doğru yazımı 'yalnız'dır."],
  [/\byalnış\b/gi, 'yanlış', "TDK kuralı: Sözcüğün kökü 'yanıl'maktan gelir; doğru yazımı 'yanlış'tır."],
  [/\bbir çok\b/gi, 'birçok', "TDK kuralı: 'Birçok' belgisiz sıfatı bitişik yazılır."],
  [/\bbir kaç\b/gi, 'birkaç', "TDK kuralı: 'Birkaç' belgisiz sıfatı bitişik yazılır."],
  [/\bhiç bir\b/gi, 'hiçbir', "TDK kuralı: 'Hiçbir' belgisiz sıfatı bitişik yazılır."],
  [/\bhiçbirşey\b/gi, 'hiçbir şey', "TDK kuralı: 'Hiçbir şey' şeklinde yazılır."],
  [/\bher bir\b/gi, 'her bir', "TDK kuralı: 'Her bir' ayrı yazılır."],
  [/\btabiki\b/gi, 'tabii ki', "TDK kuralı: Doğru yazımı 'tabii ki'dir."],
  [/\btabi ki\b/gi, 'tabii ki', "TDK kuralı: Doğru yazımı iki 'i' ile 'tabii ki'dir."],
  [/\bşarz\b/gi, 'şarj', "TDK kuralı: Doğru yazımı 'şarj'dır."],
  [/\bşarzlı\b/gi, 'şarjlı', "TDK kuralı: Doğru yazımı 'şarjlı'dır."],
  [/\bşarz etmek\b/gi, 'şarj etmek', "TDK kuralı: Doğru yazımı 'şarj etmek'tir."],
  [/\borjinal\b/gi, 'orijinal', "TDK kuralı: Doğru yazımı 'orijinal'dir."],
  [/\bünvan\b/gi, 'unvan', "TDK kuralı: Güncel TDK yazımı 'unvan'dır."],
  [/\blaboratuar\b/gi, 'laboratuvar', "TDK kuralı: Güncel TDK yazımı 'laboratuvar'dır."],
  [/\blaboratuarı\b/gi, 'laboratuvarı', "TDK kuralı: 'laboratuvarı' şeklinde yazılır."],
  [/\blaboratuarda\b/gi, 'laboratuvarda', "TDK kuralı: 'laboratuvarda' şeklinde yazılır."],
  [/\bantreman\b/gi, 'antrenman', "TDK kuralı: Doğru yazımı 'antrenman'dır."],
  [/\begsoz\b|\beksoz\b|\begzoz\b/gi, 'egzoz', "TDK kuralı: Doğru yazımı 'egzoz'dur."],
  [/\bkravat\b/gi, 'kravat', "TDK kuralı: Doğru yazımı 'kravat'tır."],
  [/\bmakina\b/gi, 'makine', "TDK kuralı: Güncel TDK yazımı 'makine'dir."],
  [/\bmadem ki\b/gi, 'mademki', "TDK kuralı: 'Mademki' bağlacı bitişik yazılır (SİMBAHÇEM kuralı)."],
  [/\bhalbuki\b/gi, 'hâlbuki', "TDK kuralı: 'Hâlbuki' düzeltme işareti ile bitişik yazılır."],
  [/\boyleysine\b/gi, 'öylesine', "TDK kuralı: Doğru yazımı 'öylesine'dir."],
  [/\bfarketmek\b/gi, 'fark etmek', "TDK kuralı: Ses düşmesi veya türemesi olmayan birleşik fiiller ayrı yazılır."],
  [/\bfarkettim\b/gi, 'fark ettim', "TDK kuralı: 'Fark ettim' ayrı yazılır."],
  [/\bfarkedildi\b/gi, 'fark edildi', "TDK kuralı: 'Fark edildi' ayrı yazılır."],
  [/\bterketmek\b/gi, 'terk etmek', "TDK kuralı: 'Terk etmek' ayrı yazılır."],
  [/\barzetmek\b/gi, 'arz etmek', "TDK kuralı: 'Arz etmek' ayrı yazılır."],
  [/\bayırtetmek\b/gi, 'ayırt etmek', "TDK kuralı: 'Ayırt etmek' ayrı yazılır."],
  [/\byoketmek\b/gi, 'yok etmek', "TDK kuralı: 'Yok etmek' ayrı yazılır."],
  [/\bsaol\b|\bsağol\b/gi, 'sağ ol', "TDK kuralı: Doğru yazımı 'sağ ol'dur."],
  [/\bhoşçakal\b/gi, 'hoşça kal', "TDK kuralı: 'Hoşça kal' ayrı yazılır."],
  [/\bhoşgeldiniz\b/gi, 'hoş geldiniz', "TDK kuralı: 'Hoş geldiniz' ayrı yazılır."],
  [/\bbaşbaşa\b/gi, 'baş başa', "TDK kuralı: İkilemeler ayrı yazılır."],
  [/\bel ele\b/gi, 'el ele', "TDK kuralı: İkilemeler ayrı yazılır."],
  [/\bgözgöze\b/gi, 'göz göze', "TDK kuralı: İkilemeler ayrı yazılır."],
  [/\byan yana\b/gi, 'yan yana', "TDK kuralı: İkilemeler ayrı yazılır."],
  [/\byanyana\b/gi, 'yan yana', "TDK kuralı: 'Yan yana' ikilemesi ayrı yazılır."],
  [/\bartarda\b/gi, 'art arda', "TDK kuralı: 'Art arda' ayrı yazılır."],
  [/\bgitgide\b/gi, 'gitgide', "TDK kuralı: Kalıplaşmış zarf-fiil 'gitgide' bitişik yazılır."],
  [/\bbirdenbire\b/gi, 'birdenbire', "TDK kuralı: 'Birdenbire' bitişik yazılır."],
  [/\bhafriyat\b|\bharfiyat\b/gi, 'hafriyat', "TDK kuralı: Doğru yazımı 'hafriyat'tır."],
  [/\bmuhattap\b/gi, 'muhatap', "TDK kuralı: Tek 't' ile 'muhatap' yazılır."],
  [/\binisiyatif\b|\binisiyatif\b/gi, 'inisiyatif', "TDK kuralı: Doğru yazımı 'inisiyatif'tir."],
  [/\bprosedür\b|\bprosüdür\b/gi, 'prosedür', "TDK kuralı: Doğru yazımı 'prosedür'dür."],
  [/\bmataryel\b|\bmateryal\b/gi, 'materyal', "TDK kuralı: Doğru yazımı 'materyal'dir."],
  [/\benteresan\b/gi, 'ilginç (enteresan)', "TDK önerisi: Türkçe karşılığı 'ilginç' tercih edilebilir."],
  [/\bdata\b/gi, 'veri', "TDK önerisi: 'Data' yerine Türkçe karşılığı olan 'veri' tercih edilir."],
  [/\baktivite\b/gi, 'etkinlik', "TDK önerisi: 'Aktivite' yerine Türkçe karşılığı olan 'etkinlik' tercih edilir."]
];

/**
 * Optimizes text according to TDK spelling, punctuation, and Turkish capitalization rules.
 */
export function optimizeTextWithTdk(rawText: string): TdkAuditResult {
  if (!rawText || !rawText.trim()) {
    return { cleanedText: '', fixes: [], score: 100, isFullyCompliant: true };
  }

  let text = rawText;
  const fixes: TdkRuleFix[] = [];

  // 1. Kelime bazlı TDK tashihleri
  for (const [regex, replacement, reason] of COMMON_TDK_CORRECTIONS) {
    if (regex.test(text)) {
      const match = text.match(regex);
      if (match && match[0].toLowerCase() !== replacement.toLowerCase()) {
        fixes.push({
          original: match[0],
          corrected: replacement,
          reason
        });
      }
      text = text.replace(regex, replacement);
    }
  }

  // 2. Noktalama işaretlerinden sonra boşluk denetimi (.,?!:;)
  // Harf veya rakamdan sonra gelen noktalama işaretinin ardına boşluk gelmiyorsa ekle
  const punctuationRegex = /([.,?!:;])([A-Za-zÇçĞğIıİöÖşŞüÜ])/g;
  if (punctuationRegex.test(text)) {
    fixes.push({
      original: 'Noktalamadan sonra bitişik harf',
      corrected: 'Noktalamadan sonra bir boşluk',
      reason: 'TDK noktalama kuralı: Noktalama işaretlerinden sonra bir boşluk bırakılmalıdır.'
    });
    text = text.replace(punctuationRegex, '$1 $2');
  }

  // 3. Çoklu gereksiz boşlukları tek boşluğa indirme
  text = text.replace(/[ \t]{2,}/g, ' ');

  // 4. Paragraf ve cümle başlarını büyük harfe tamamlama
  text = text.replace(/(^|[.!?]\s+)([a-zçğıöşü])/g, (_, prefix, letter) => {
    return prefix + letter.toLocaleUpperCase('tr-TR');
  });

  // 5. 'da/de' bağlacı yaygın hata kontrolü: "öğrenciler de", "biz de", "okulumuz da"
  const dadeRegex = /\b(öğrenciler|biz|sen|ben|siz|öğretmenler|okulumuz|dergimiz|insanlar)(de|da)\b/g;
  if (dadeRegex.test(text)) {
    fixes.push({
      original: 'Bitişik yazılmış dahi anlamındaki de/da',
      corrected: 'Ayrı yazılan de/da',
      reason: "TDK kuralı: 'Dahi / bile' anlamındaki de/da bağlacı her zaman ayrı yazılır."
    });
    text = text.replace(dadeRegex, '$1 $2');
  }

  const score = Math.max(70, Math.min(100, 100 - fixes.length * 5));

  return {
    cleanedText: text,
    fixes,
    score,
    isFullyCompliant: fixes.length === 0
  };
}

/**
 * Validates whether string contains properly encoded Turkish characters
 */
export function hasProperTurkishSupport(text: string): boolean {
  // Check that Turkish characters are rendered natively and not as mangled symbols (like Ã¼, ÄŸ, etc.)
  const mojibakePattern = /(Ã¼|ÄŸ|Ä±|Ã¶|ÅŸ|Ã§|Ã‡|Ä°|Ã–|Ãœ|Åž|Äž)/;
  return !mojibakePattern.test(text);
}

// ============================================================================
// TÜBİTAK 2204-B – SİVAS'IN DİJİTAL TARİH ATLASI
// Ölçme, Değerlendirme ve Bilimsel Araştırma Veri Modülü (Ön Test & Son Test)
// ============================================================================

window.SIVAS_EVALUATION = {
  questions: [
    {
      id: "q1",
      dimension: "Tarihsel Bilgi",
      type: "multiple-choice",
      monumentId: "cifte-minareli-medrese",
      question: "Sivas Çifte Minareli Medrese (Dârülhadis) hangi tarihsel dönemde ve kimin baniliğinde inşa edilmiştir?",
      options: [
        "A) Klasik Osmanlı Dönemi – Mimar Sinan",
        "B) Mengücekliler Dönemi – Ahmed Şah",
        "C) İlhanlı / Anadolu Selçuklu Çağı – Şemseddin Cüveynî",
        "D) Danişmendliler Dönemi – Melik Gazi"
      ],
      correctIndex: 2,
      evidenceNote: "Eserin taçkapısındaki H. 670 (M. 1271) tarihli Arapça sülüs kitabesinde İlhanlı Veziri Şemseddin Cüveyni'nin ismi açıkça tescillidir."
    },
    {
      id: "q2",
      dimension: "Tarihsel Kanıtları Yorumlama",
      type: "inscription-analysis",
      monumentId: "gok-medrese",
      question: "Gök Medrese'nin mermer taçkapısında yer alan 'Hayat Ağacı' ve çift başlı kartal / kuş kabartmaları, Selçuklu sanatında hangi tarihsel ve kültürel inancın kanıtıdır?",
      options: [
        "A) Orta Asya Türk mitolojisindeki evren, güç ve sonsuzluk sembolizminin taş mimariye yansıması",
        "B) Bizans saray mimarisinin doğrudan kopyalanması",
        "C) Yalnızca süsleme amaçlı rastgele desenler olması",
        "D) Roma İmparatorluğu taş ustalığının taklit edilmesi"
      ],
      correctIndex: 0,
      evidenceNote: "Akademik kaynaklar ve Türk Tarih Kurumu yayınları, Hayat Ağacı motifinin Orta Asya'dan Anadolu'ya taşınan kadim bir kozmolojik sembol olduğunu doğrulamaktadır."
    },
    {
      id: "q3",
      dimension: "Karşılaştırma Becerisi",
      type: "monument-comparison",
      monumentId: "cifte-minareli-medrese",
      question: "1271 yılında aynı meydanda inşa edilen Çifte Minareli Medrese ile Gök Medrese karşılaştırıldığında, hangisi mimari süsleme yaklaşımındaki temel FARKIDIR?",
      options: [
        "A) Çifte Minare'de ahşap, Gök Medrese'de tuğla kullanılması",
        "B) Gök Medrese'de figürlü kabartmalar (hayat ağacı, kuşlar) öne çıkarken, Çifte Minare'de geometrik yıldız geçmeler ve derin mukarnaslı bezemelerin ağırlıkta olması",
        "C) Çifte Minare'nin kubbeli, Gök Medrese'nin tek minareli olması",
        "D) İki yapının da aynı mimar tarafından tamamen farksız inşa edilmesi"
      ],
      correctIndex: 1,
      evidenceNote: "1271 Sivas medreseleri mimarlık tarihi açısından aynı dönemde farklı atölyelerin ürettiği zengin tezyinat çeşitliliğini kanıtlar."
    },
    {
      id: "q4",
      dimension: "Kültürel Miras Farkındalığı",
      type: "heritage-awareness",
      monumentId: "divrigi-ulu-camii",
      question: "Divriği Ulu Camii ve Darüşşifası'nın 1985 yılında UNESCO Dünya Kültür Mirası Listesi'ne alınmasındaki en belirleyici mimari özellik nedir?",
      options: [
        "A) Türkiye'nin en büyük yüzölçümüne sahip camisi olması",
        "B) Taçkapılarındaki üç boyutlu, asimetrik ve hiçbir motifi birbirini tekrarlamayan benzersiz yüksek kabartma taş heykeltıraşlığı",
        "C) Yapımında hiç harç kullanılmamış olması",
        "D) Tamamen altından süslemeler barındırması"
      ],
      correctIndex: 1,
      evidenceNote: "UNESCO Dünya Mirası gerekçesinde eserin 'Anadolu'nun El Hamra'sı' olarak anılan benzersiz asimetrik taş oymacılığı esastır."
    },
    {
      id: "q5",
      dimension: "Tarihsel Kanıtları Yorumlama",
      type: "open-inference",
      monumentId: "sifaiye-medresesi",
      question: "Şifaiye Medresesi'nin aynı zamanda İzzettin Keykavus'un türbesini barındırması ve bir tıp okulu/hastane olarak planlanması, Selçuklu devletinin vakıf anlayışı ve insana bakışı hakkında neyi kanıtlar?",
      options: [
        "A) Hükümdarların şifa kurumlarıyla kendilerini bütünleştirerek topluma hizmeti ebedi bir hayır ve ibadet saydıklarını",
        "B) Sağlık hizmetlerinin yalnızca saray mensuplarına özel olduğunu",
        "C) Tıp biliminin dinî yapılardan tamamen uzak tutulduğunu",
        "D) Yapının sadece savaş zamanında askeri karargâh olduğunu"
      ],
      correctIndex: 0,
      evidenceNote: "Vakfiye metinleri ve Darüşşifa mimarisi, Selçuklu sosyal devlet ve vakıf medeniyetinin zirvesini belgeler."
    }
  ],

  // Sonuçları LocalStorage üzerinde saklama
  saveTestResult(studentCode, testType, answers, score, openResponse) {
    const records = this.getAllResults();
    const resultObj = {
      id: "res_" + Date.now(),
      studentCode: studentCode || "Öğrenci-" + Math.floor(100 + Math.random() * 900),
      testType: testType, // 'pre' (Ön Test) veya 'post' (Son Test)
      date: new Date().toISOString(),
      score: score,
      total: this.questions.length,
      percentage: Math.round((score / this.questions.length) * 100),
      answers: answers,
      openResponse: openResponse || ""
    };

    records.push(resultObj);
    localStorage.setItem("sivas_eval_results", JSON.stringify(records));
    return resultObj;
  },

  getAllResults() {
    try {
      const data = localStorage.getItem("sivas_eval_results");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  exportToCsv() {
    const results = this.getAllResults();
    if (results.length === 0) {
      alert("Henüz kaydedilmiş bir test sonucu bulunmamaktadır.");
      return;
    }

    let csvContent = "\uFEFF"; // UTF-8 BOM for Excel Turkish character compatibility
    csvContent += "Kayit_ID;Ogrenci_Kodu;Test_Turu;Tarih;Puan;Toplam_Soru;Yuzde_Basari;Ogrenci_Cikarimi\n";

    results.forEach(r => {
      const safeInference = (r.openResponse || "").replace(/;/g, ",").replace(/\n/g, " ");
      csvContent += `${r.id};${r.studentCode};${r.testType === "pre" ? "Ön Test" : "Son Test"};${r.date.slice(0, 10)};${r.score};${r.total};%${r.percentage};"${safeInference}"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `tubitak_2204b_sivas_arastirma_verileri_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

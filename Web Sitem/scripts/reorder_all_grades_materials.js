const fs = require('fs');
const path = require('path');

const targetJsonPaths = ['data/materials.json', '../data/materials.json'];

function detectQType(title, format, fileName) {
  const t = (title || '').toLowerCase();
  const f = (format || '').toLowerCase();
  const fn = (fileName || '').toLowerCase();

  if (t.includes('kısa cevap') || t.includes('kisa cevap') || t.includes('boşluk') || t.includes('bosluk') || f.includes('kısa cevap') || fn.includes('kisa-cevap')) {
    return 'short_answer';
  }
  if (t.includes('açık uçlu') || t.includes('acik uclu') || t.includes('klasik') || f.includes('açık uçlu') || fn.includes('acik-uclu')) {
    return 'open_ended';
  }
  if (t.includes('kavram') || f.includes('kavram') || fn.includes('kavram')) {
    return 'concept_map';
  }
  return 'multiple_choice';
}

function getCleanTypeName(qtype) {
  switch(qtype) {
    case 'multiple_choice': return 'Çoktan Seçmeli Yaprak Test';
    case 'short_answer': return 'Kısa Cevaplı / Boşluk Doldurma';
    case 'open_ended': return 'Açık Uçlu Klasik Sınav';
    case 'concept_map': return 'Kavram Haritası';
    default: return 'Kazanım Testi';
  }
}

targetJsonPaths.forEach(jsonPath => {
  if (!fs.existsSync(jsonPath)) return;
  const materials = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // Separate non-test materials and test materials
  const nonTests = materials.filter(m => m.category !== 'denemeler');
  const tests = materials.filter(m => m.category === 'denemeler');

  // Also discover files in testler/ that are not yet in tests
  const diskFiles = fs.readdirSync('testler').filter(f => f.endsWith('.html'));
  diskFiles.forEach(df => {
    const exists = tests.some(t => t.fileName === df || (t.fileUrl && t.fileUrl.endsWith(df)));
    if (!exists) {
      // Determine grade
      let grade = '5';
      let unit = '1. Ünite: Gökyüzündeki Komşularımız ve Biz';
      if (df.startsWith('6-sinif')) {
        grade = '6';
        unit = '1. Ünite: Güneş Sistemi ve Tutulmalar';
      } else if (df.startsWith('7-sinif')) {
        grade = '7';
        unit = '1. Ünite: Uzay Çağı';
      } else if (df.startsWith('8-sinif')) {
        grade = '8';
        unit = '1. Ünite: Mevsimler ve İklim';
      }

      const qtype = detectQType(df, '', df);
      tests.push({
        id: `mat-test-${grade}-1-${Date.now()}-${Math.floor(Math.random()*1000)}`,
        grade,
        category: 'denemeler',
        targetSection: '1',
        title: df,
        unit,
        desc: `${grade}. Sınıf Fen Bilimleri MEB Maarif Modeli uyumlu interaktif çalışma.`,
        fileName: df,
        fileUrl: `testler/${df}`,
        imageUrl: `assets/test-kapak-${grade}.svg`,
        kapakResmi: `assets/test-kapak-${grade}.svg`,
        cover: `assets/test-kapak-${grade}.svg`,
        format: qtype === 'multiple_choice' ? 'YAPRAK TEST' : 'AÇIK UÇLU SINAV',
        hasBlob: false,
        tags: [
          `${grade}. sınıf`,
          '1. ünite',
          'denemeler',
          'yazılıya hazırlık',
          'rotalı fenci',
          'meb maarif modeli'
        ],
        visibility: 'public',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  });

  // Group tests by Grade (5, 6, 7, 8) and then by QType
  const grades = ['5', '6', '7', '8'];
  const processedTests = [];

  grades.forEach(g => {
    const gradeTests = tests.filter(t => String(t.grade).replace(/^grade-/, '') === g);

    const typeGroups = {
      multiple_choice: [],
      short_answer: [],
      open_ended: [],
      concept_map: []
    };

    gradeTests.forEach(t => {
      const qt = detectQType(t.title, t.format, t.fileName);
      typeGroups[qt].push(t);
    });

    // Renumber each question type starting from 1!
    Object.keys(typeGroups).forEach(qt => {
      const group = typeGroups[qt];
      const typeLabel = getCleanTypeName(qt);

      group.forEach((item, index) => {
        const testNum = index + 1; // 1'den başlayarak sırala
        
        // Soru sayısını tespit et
        let qCount = item.questionCount || 15;
        const qMatch = (item.title || '').match(/(\d+)\s*Soru/i) || (item.fileName || '').match(/(\d+)-sor/i);
        if (qMatch && qMatch[1]) {
          qCount = parseInt(qMatch[1], 10);
        } else {
          // Diskten tam soru sayısını oku
          const diskPath = path.join('testler', item.fileName);
          if (fs.existsSync(diskPath)) {
            const h = fs.readFileSync(diskPath, 'utf8');
            const sm = h.match(/const TOTAL_QUESTIONS = (\d+);/);
            if (sm && sm[1]) qCount = parseInt(sm[1], 10);
          }
        }
        item.questionCount = qCount;
        item.testNumber = testNum;
        item.title = `Test ${testNum} - ${typeLabel} (${qCount} Soru)`;
        item.downloadCount = `📝 ${qCount} Soru • Test-${testNum}`;
        item.format = qt === 'multiple_choice' ? 'YAPRAK TEST' : 'AÇIK UÇLU SINAV';

        processedTests.push(item);
      });
    });
  });

  // Combine back
  const finalMaterials = [...nonTests, ...processedTests];
  fs.writeFileSync(jsonPath, JSON.stringify(finalMaterials, null, 2), 'utf8');
  console.log(`Successfully reordered tests starting from 1 in: ${jsonPath} (Total denemeler: ${processedTests.length})`);
});

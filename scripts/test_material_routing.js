const fs = require('fs');
const path = require('path');

const materials = JSON.parse(fs.readFileSync('data/materials.json', 'utf8'));

// Mock the open modal calls
function testMaterial(mat) {
  const id = mat.id;
  let fallbackUrl = mat.fileUrl || '#';
  let fileName = mat.fileName || 'materyal.pdf';
  let category = mat.category || '';
  let title = mat.title || '';
  let format = mat.format || '';

  const found = mat;

  let checkFormat = String((found && found.format) || format || '').toUpperCase();
  let checkFile = String((found && (found.fileName || found.name)) || fileName || '').toLocaleLowerCase('tr-TR');
  const checkTitle = String((found && found.title) || title || '').toLocaleLowerCase('tr-TR');
  const checkCat = String((found && found.category) || category || '').toLocaleLowerCase('tr-TR');
  const gradeStr = String((found && found.grade) || '5').replace(/^grade-/, '').trim();
  let targetUrl = (found && found.fileUrl && found.fileUrl !== '#') ? found.fileUrl : ((fallbackUrl && fallbackUrl !== '#') ? fallbackUrl : '');

  // 1. PDF
  const isPdfFile = checkFormat.includes('PDF') ||
                    checkFile.endsWith('.pdf') ||
                    (targetUrl && (targetUrl.toLowerCase().includes('.pdf') || targetUrl.startsWith('data:application/pdf'))) ||
                    (found && String(found.format || '').toUpperCase().includes('PDF')) ||
                    (found && String(found.fileName || '').toLowerCase().endsWith('.pdf')) ||
                    (found && String(found.fileUrl || '').toLowerCase().includes('.pdf'));

  if (isPdfFile) {
    return { action: 'PDF_BOOK_MODAL', targetUrl, title };
  }

  // 2. HTML Presentation
  const isHtmlPresentation = (
      targetUrl.includes('sunumlar/') ||
      id === 'mat-5-1-sunum-gunes-dunya-ay' ||
      ((checkFormat.includes('İNTERAKTİF SUNUM') || checkFormat.includes('HTML SUNUM') || checkCat === 'ders-sunumu') && !targetUrl.includes('oyunlar/') && (checkFile.endsWith('.html') || targetUrl.endsWith('.html')))
  );

  if (isHtmlPresentation && targetUrl && targetUrl !== '#') {
    return { action: 'HTML_PRESENTATION_MODAL', targetUrl, title };
  }

  // 3. PPTX
  const isPresentation = !isPdfFile && !isHtmlPresentation && (
      checkFile.endsWith('.pptx') || checkFile.endsWith('.ppt') ||
      targetUrl.endsWith('.pptx') || targetUrl.endsWith('.ppt') ||
      checkFormat.includes('PPT') || checkFormat.includes('SLAYT') ||
      checkFormat === 'SUNUM' ||
      (id && String(id).startsWith('sunum-')) ||
      (checkCat === 'ders-sunumu' && !checkFile.endsWith('.pdf') && !checkFormat.includes('PDF'))
  );

  if (isPresentation) {
    return { action: 'PPTX_PRESENTATION_MODAL', targetUrl, title };
  }

  // 4. 3D Games
  if (
      id === 'mat-5-1-oyun-gunes-dunya-ay-3d' ||
      id === 'builtin-oyun-5-gunes-dunya-ay' ||
      id === 'gunes-dunya-ay-3d' ||
      targetUrl.includes('oyunlar/gunes-dunya-ay-3d.html') ||
      ((checkTitle.includes('hareket laboratuvarı') || checkTitle.includes('hareket laboratuvari')) && !checkTitle.includes('sunum') && !targetUrl.includes('sunumlar/'))
  ) {
    return { action: 'GAME_MODAL', game: 'gunes-dunya-ay-3d.html', title };
  }

  if (
      id === 'mat-apollo11-aya-inis-3d' ||
      id === 'builtin-oyun-apollo11-aya-inis' ||
      id === 'builtin-oyun-6-aya-inis' ||
      id === 'aya-inis-3d' ||
      targetUrl.includes('oyunlar/aya-inis-3d.html') ||
      ((checkTitle.includes("ay'a iniş") || checkTitle.includes('aya inis') || checkTitle.includes('apollo 11')) && !checkTitle.includes('sunum') && !targetUrl.includes('sunumlar/'))
  ) {
    return { action: 'GAME_MODAL', game: 'aya-inis-3d.html', title };
  }

  if (
      id === 'mat-6-1-oyun-gunes-sistemi-3d' ||
      id === 'builtin-oyun-6-gunes-sistemi' ||
      id === 'gunes-sistemi-3d' ||
      targetUrl.includes('oyunlar/gunes-sistemi-3d.html') ||
      ((checkTitle.includes('güneş sistemi – 3d') || checkTitle.includes('keşif laboratuvarı') || checkTitle.includes('dijital planetaryum')) && !checkTitle.includes('sunum') && !targetUrl.includes('sunumlar/') && !targetUrl.includes('.pptx'))
  ) {
    return { action: 'GAME_MODAL', game: 'gunes-sistemi-3d.html', title };
  }

  if (
      id === 'mat-5-1-oyun-kozmik-kosu-3d' ||
      id === 'builtin-oyun-5-kozmik-kosu' ||
      id === 'kozmik-kosu-3d' ||
      targetUrl.includes('oyunlar/kozmik-kosu-3d.html') ||
      ((checkTitle.includes('kozmik koşu') || checkTitle.includes('kozmik kosu') || checkTitle.includes('ay evresi avı')) && !checkTitle.includes('sunum') && !targetUrl.includes('sunumlar/'))
  ) {
    return { action: 'GAME_MODAL', game: 'kozmik-kosu-3d.html', title };
  }

  return { action: 'OTHER', targetUrl, title };
}

// Test cases:
const testCases = [
  'mat-5-1-sunum-gunes-dunya-ay',
  'mat-5-1-oyun-gunes-dunya-ay-3d',
  'mat-afa89ec0-6f45-4b55-af70-bbfaa863b877',
  'mat-6-1-oyun-gunes-sistemi-3d',
  'mat-5-1-oyun-kozmik-kosu-3d',
  'mat-apollo11-aya-inis-3d',
  'book-5'
];

let allPassed = true;
testCases.forEach(id => {
  const m = materials.find(item => item.id === id);
  if (!m) {
    console.error('Material not found:', id);
    allPassed = false;
    return;
  }
  const res = testMaterial(m);
  console.log(`[TEST ${id}] =>`, res.action, '| targetUrl:', res.targetUrl || res.game);
  if (id === 'mat-5-1-sunum-gunes-dunya-ay' && res.action !== 'HTML_PRESENTATION_MODAL') {
    console.error('FAIL: mat-5-1-sunum-gunes-dunya-ay should be HTML_PRESENTATION_MODAL!');
    allPassed = false;
  }
  if (id === 'mat-5-1-oyun-gunes-dunya-ay-3d' && res.action !== 'GAME_MODAL') {
    console.error('FAIL: mat-5-1-oyun-gunes-dunya-ay-3d should be GAME_MODAL!');
    allPassed = false;
  }
  if (id === 'mat-afa89ec0-6f45-4b55-af70-bbfaa863b877' && res.action !== 'PPTX_PRESENTATION_MODAL') {
    console.error('FAIL: 6-1-sunum.pptx should be PPTX_PRESENTATION_MODAL!');
    allPassed = false;
  }
});

if (allPassed) {
  console.log('🎉 ALL ROUTING TESTS PASSED PERFECTLY!');
} else {
  process.exit(1);
}

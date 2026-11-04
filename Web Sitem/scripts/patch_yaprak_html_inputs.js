const fs = require('fs');

function patchHtml(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  // Update script tags with new cache buster
  html = html.replace(/js\/question_preparation_state\.js\?v=[^"']+/g, 'js/question_preparation_state.js?v=20261101_v4');
  html = html.replace(/js\/visual_match_engine\.js\?v=[^"']+/g, 'js/visual_match_engine.js?v=20261101_v4');
  html = html.replace(/js\/yaprak-test\.js\?v=[^"']+/g, 'js/yaprak-test.js?v=20261101_v4');

  // Add inline onchange/oninput if not already present
  html = html.replace(
    'id="qt_cb_multiple_choice" class="qt-checkbox" data-type="multiple_choice" data-label="Çoktan Seçmeli" checked',
    'id="qt_cb_multiple_choice" class="qt-checkbox" data-type="multiple_choice" data-label="Çoktan Seçmeli" checked onchange="if(window.updateQtTotalCount) window.updateQtTotalCount()"'
  );

  html = html.replace(
    'id="qt_count_multiple_choice" class="qt-count-input" min="1" max="30" value="10"',
    'id="qt_count_multiple_choice" class="qt-count-input" min="1" max="30" value="10" oninput="if(window.updateQtTotalCount) window.updateQtTotalCount()"'
  );

  html = html.replace(
    'id="qt_cb_short_answer" class="qt-checkbox" data-type="short_answer" data-label="Kısa Cevaplı"',
    'id="qt_cb_short_answer" class="qt-checkbox" data-type="short_answer" data-label="Kısa Cevaplı" onchange="if(window.updateQtTotalCount) window.updateQtTotalCount()"'
  );

  html = html.replace(
    'id="qt_count_short_answer" class="qt-count-input" min="1" max="30" value="5" disabled',
    'id="qt_count_short_answer" class="qt-count-input" min="1" max="30" value="5" disabled oninput="if(window.updateQtTotalCount) window.updateQtTotalCount()"'
  );

  html = html.replace(
    'id="qt_cb_open_ended" class="qt-checkbox" data-type="open_ended" data-label="Açık Uçlu"',
    'id="qt_cb_open_ended" class="qt-checkbox" data-type="open_ended" data-label="Açık Uçlu" onchange="if(window.updateQtTotalCount) window.updateQtTotalCount()"'
  );

  html = html.replace(
    'id="qt_count_open_ended" class="qt-count-input" min="1" max="30" value="5" disabled',
    'id="qt_count_open_ended" class="qt-count-input" min="1" max="30" value="5" disabled oninput="if(window.updateQtTotalCount) window.updateQtTotalCount()"'
  );

  html = html.replace(
    'id="qt_cb_activity" class="qt-checkbox" data-type="activity" data-label="Etkinlik"',
    'id="qt_cb_activity" class="qt-checkbox" data-type="activity" data-label="Etkinlik" onchange="if(window.updateQtTotalCount) window.updateQtTotalCount()"'
  );

  html = html.replace(
    'id="qt_count_activity" class="qt-count-input" min="1" max="50" value="5" disabled',
    'id="qt_count_activity" class="qt-count-input" min="1" max="50" value="5" disabled oninput="if(window.updateQtTotalCount) window.updateQtTotalCount()"'
  );

  // Update initial badge text
  html = html.replace('📊 Toplam: 10 Soru</span>', '📊 Toplam: 10 Soru / İçerik</span>');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Patched ${filePath}`);
}

patchHtml('yaprak-test.html');
patchHtml('../yaprak-test.html');

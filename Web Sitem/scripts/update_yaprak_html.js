const fs = require('fs');

function updateYaprakHtml(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Soru Türleri ve Sayıları Paneli
  const oldFormRowStart = html.indexOf('<!-- Soru Sayısı, Soru Tarzı ve Zorluk Seviyesi -->');
  const oldFormRowEnd = html.indexOf('<!-- Üretim Butonu -->');

  if (oldFormRowStart === -1 || oldFormRowEnd === -1) {
    console.error('Target form section not found in', filePath);
    return;
  }

  const newFormSection = `<!-- Soru Türleri ve Bağımsız Soru Sayıları (Maarif Modeli 4 Tür) -->
            <div class="form-group qt-multiselect-panel">
              <div class="label-with-action">
                <label>Soru Türleri ve Sayıları (Çoklu Seçim)</label>
                <span class="qt-total-badge" id="qtTotalCountBadge">📊 Toplam: 10 Soru</span>
              </div>
              <div class="qt-hint-text">Aynı anda birden fazla soru türü seçebilir, her birinin soru sayısını ayrı ayrı belirleyebilirsiniz:</div>
              
              <div class="qt-checkbox-list" id="qtCheckboxList">
                <!-- 1. Çoktan Seçmeli -->
                <div class="qt-item-row is-active" id="qt_row_multiple_choice">
                  <label class="qt-checkbox-label" for="qt_cb_multiple_choice">
                    <input type="checkbox" id="qt_cb_multiple_choice" class="qt-checkbox" data-type="multiple_choice" data-label="Çoktan Seçmeli" checked>
                    <span class="qt-icon">🔘</span>
                    <span class="qt-info">
                      <span class="qt-name">Çoktan Seçmeli</span>
                      <span class="qt-sub">4 Seçenekli LGS / MEB Sınav Formatı</span>
                    </span>
                  </label>
                  <div class="qt-count-box">
                    <input type="number" id="qt_count_multiple_choice" class="qt-count-input" min="1" max="30" value="10">
                    <span class="qt-unit">soru</span>
                  </div>
                </div>

                <!-- 2. Kısa Cevaplı / Boşluk Doldurma -->
                <div class="qt-item-row" id="qt_row_short_answer">
                  <label class="qt-checkbox-label" for="qt_cb_short_answer">
                    <input type="checkbox" id="qt_cb_short_answer" class="qt-checkbox" data-type="short_answer" data-label="Kısa Cevaplı">
                    <span class="qt-icon">✏️</span>
                    <span class="qt-info">
                      <span class="qt-name">Kısa Cevaplı / Boşluk Doldurma</span>
                      <span class="qt-sub">Tek Kelimelik / Kısa İfadeli Net Cevaplar</span>
                    </span>
                  </label>
                  <div class="qt-count-box">
                    <input type="number" id="qt_count_short_answer" class="qt-count-input" min="1" max="30" value="5" disabled>
                    <span class="qt-unit">soru</span>
                  </div>
                </div>

                <!-- 3. Açık Uçlu (Klasik) -->
                <div class="qt-item-row" id="qt_row_open_ended">
                  <label class="qt-checkbox-label" for="qt_cb_open_ended">
                    <input type="checkbox" id="qt_cb_open_ended" class="qt-checkbox" data-type="open_ended" data-label="Açık Uçlu">
                    <span class="qt-icon">📝</span>
                    <span class="qt-info">
                      <span class="qt-name">Açık Uçlu (Klasik)</span>
                      <span class="qt-sub">Bilimsel Süreç, Deney Analizi ve Gerekçe</span>
                    </span>
                  </label>
                  <div class="qt-count-box">
                    <input type="number" id="qt_count_open_ended" class="qt-count-input" min="1" max="30" value="5" disabled>
                    <span class="qt-unit">soru</span>
                  </div>
                </div>

                <!-- 4. Kavram Haritası -->
                <div class="qt-item-row" id="qt_row_concept_map">
                  <label class="qt-checkbox-label" for="qt_cb_concept_map">
                    <input type="checkbox" id="qt_cb_concept_map" class="qt-checkbox" data-type="concept_map" data-label="Kavram Haritası">
                    <span class="qt-icon">🗺️</span>
                    <span class="qt-info">
                      <span class="qt-name">Kavram Haritası</span>
                      <span class="qt-sub">Eksik Bırakılan Kavram ve İlişkileri Bulma</span>
                    </span>
                  </label>
                  <div class="qt-count-box">
                    <input type="number" id="qt_count_concept_map" class="qt-count-input" min="1" max="30" value="3" disabled>
                    <span class="qt-unit">soru</span>
                  </div>
                </div>
              </div>

              <!-- Çıktı Dosyası Modu Seçimi -->
              <div class="qt-output-format-card">
                <div class="qt-output-title"><i class="fa-solid fa-folder-tree text-primary"></i> <strong>Çıktı Dosyası Formatı:</strong></div>
                <div class="qt-output-radios">
                  <label class="qt-radio-item" title="Her soru türü için müstakil bir yaprak test dosyası oluşturur ve web sitesinde ilgili bölüme aktarır.">
                    <input type="radio" name="qtOutputMode" id="qtModeSeparate" value="separate" checked>
                    <span><strong>Her soru türünü ayrı dosyada oluştur</strong> (Önerilen)</span>
                  </label>
                  <label class="qt-radio-item" title="Tüm seçili türlerdeki soruları tek bir karma test dosyasında birleştirir.">
                    <input type="radio" name="qtOutputMode" id="qtModeMerged" value="merged">
                    <span><strong>Bütün soruları tek dosyada birleştir</strong></span>
                  </label>
                </div>
              </div>

              <!-- Geriye Dönük Uyumluluk Gizli Elemanları -->
              <select id="questionTypeInput" style="display:none;" aria-hidden="true">
                <option value="multiple_choice" selected>Çoktan Seçmeli</option>
                <option value="short_answer">Kısa Cevaplı</option>
                <option value="open_ended">Açık Uçlu</option>
                <option value="concept_map">Kavram Haritası</option>
              </select>
              <input type="hidden" id="countInput" value="10">
            </div>

            <!-- Zorluk Seviyesi -->
            <div class="form-group">
              <label for="difficultyInput">Zorluk Seviyesi</label>
              <select id="difficultyInput" class="form-control">
                <option value="Karma (Dengeli - Kolay/Orta/Zor)" selected>Karma (Dengeli LGS / MEB)</option>
                <option value="Kolay">Kolay (Kavrama)</option>
                <option value="Orta">Orta (Uygulama)</option>
                <option value="Zor">Zor (Yeni Nesil Analiz)</option>
              </select>
            </div>

            `;

  html = html.substring(0, oldFormRowStart) + newFormSection + html.substring(oldFormRowEnd);

  // 2. Çoklu Üretim İlerleme Paneli & Dosya Sekmeleri (Preview kısmına)
  if (!html.includes('batchFileTabsBar')) {
    const previewHeaderMarker = '<div class="preview-header-sticky">';
    const batchTabsHtml = `
          <!-- Çoklu Soru Türü Dosya Sekmeleri ve Toplu Yayınlama Çubuğu -->
          <div class="batch-file-tabs-bar" id="batchFileTabsBar" style="display: none;">
            <div class="batch-tabs-list" id="batchTabsList"></div>
            <button type="button" class="btn-batch-publish" id="batchPublishAllBtn" title="Üretilen tüm test dosyalarını web sitesine otomatik aktar">
              <span>🚀</span> <span>Tüm Dosyaları Web Siteme Aktar</span>
            </button>
          </div>
    `;
    if (html.includes(previewHeaderMarker)) {
      html = html.replace(previewHeaderMarker, previewHeaderMarker + '\n' + batchTabsHtml);
    }
  }

  // 3. Cache buster versiyon güncelle
  const ts = Date.now();
  html = html.replace(/js\/curriculum-data\.js\?v=[^"']+/g, `js/curriculum-data.js?v=${ts}`);
  html = html.replace(/js\/yaprak-test\.js\?v=[^"']+/g, `js/yaprak-test.js?v=${ts}`);
  html = html.replace(/css\/yaprak-test\.css\?v=[^"']+/g, `css/yaprak-test.css?v=${ts}`);

  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Successfully updated HTML:', filePath);
}

updateYaprakHtml('yaprak-test.html');
updateYaprakHtml('../yaprak-test.html');
updateYaprakHtml('../Yaprak Test/public/index.html');

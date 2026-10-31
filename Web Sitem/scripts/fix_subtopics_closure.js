const fs = require('fs');

const files = ['js/app.js', '../js/app.js'];

files.forEach(p => {
  if (!fs.existsSync(p)) return;
  let code = fs.readFileSync(p, 'utf8');

  const marker = "<!-- 📌 4 Soru Türü Filtreleme Butonları";
  const markerIdx = code.indexOf(marker);
  if (markerIdx === -1) {
    console.log('Marker not found in', p);
    return;
  }

  // Find the subtopic join right before the marker
  const beforeMarker = code.substring(0, markerIdx);
  const afterMarker = code.substring(markerIdx);

  const lastJoin = beforeMarker.lastIndexOf("}).join('')}");
  if (lastJoin !== -1) {
    const insertPos = lastJoin + "}).join('')}".length;
    // Check if </div> is already there
    const sliceBetween = beforeMarker.substring(insertPos);
    if (!sliceBetween.includes("</div>")) {
      const newBefore = beforeMarker.substring(0, insertPos) + "\n                                        </div>\n" + sliceBetween;
      code = newBefore + afterMarker;
      
      // Now remove one extra </div> at the end of qtype container
      const qtypeEndMarker = "<span>🗺️ Kavram Haritası</span>";
      const qtypeEndIdx = code.indexOf(qtypeEndMarker);
      if (qtypeEndIdx !== -1) {
        const afterQtype = code.substring(qtypeEndIdx);
        // Find the next </div>\s*</div>
        const fixedAfterQtype = afterQtype.replace(/(<\/div>\s*)(<\/div>\s*)(`;)/m, "$1$3");
        code = code.substring(0, qtypeEndIdx) + fixedAfterQtype;
      }
      fs.writeFileSync(p, code, 'utf8');
      console.log('Successfully inserted closing </div> for subtopic-pill-container in:', p);
    } else {
      console.log('Already had closing </div> in:', p);
    }
  }
});

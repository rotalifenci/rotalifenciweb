const fs = require('fs');
const path = require('path');

const appPath = path.join(process.cwd(), 'js/app.js');
let code = fs.readFileSync(appPath, 'utf8');

// 1. Update initNavigation to handle auth overlay check
const navSearch = 'document.getElementById("btnOpenAdmin")?.addEventListener("click", () => {';
const navIdx = code.indexOf(navSearch);
if (navIdx !== -1) {
  const navEnd = code.indexOf('});', navIdx);
  const newNavAdmin = `document.getElementById("btnOpenAdmin")?.addEventListener("click", () => {
      this.populateAdminMonumentsDropdown();
      const authOverlay = document.getElementById("adminAuthLock");
      if (authOverlay) {
        authOverlay.style.display = this.isAdminUnlocked ? "none" : "flex";
      }
      document.getElementById("modalAdmin").style.display = "flex";
    });`;
  code = code.substring(0, navIdx) + newNavAdmin + code.substring(navEnd + 3);
}

// 2. Add auth and JSON import/export to initAdminPanel
const adminStartSearch = 'initAdminPanel() {\n    const form = document.getElementById("adminMonumentForm");';
const admStartIdx = code.indexOf(adminStartSearch);
if (admStartIdx !== -1) {
  const insertAuth = `initAdminPanel() {
    this.isAdminUnlocked = false;
    const authOverlay = document.getElementById("adminAuthLock");
    const passInput = document.getElementById("txtAdminPassword");
    const btnUnlock = document.getElementById("btnUnlockAdmin");
    const authError = document.getElementById("adminAuthError");

    const checkPassword = () => {
      const val = (passInput?.value || "").trim().toLowerCase();
      if (val === "tubitak2204" || val === "admin58" || val === "sivas58" || val === "tubitak") {
        this.isAdminUnlocked = true;
        if (authOverlay) authOverlay.style.display = "none";
        if (authError) authError.style.display = "none";
      } else {
        if (authError) authError.style.display = "block";
      }
    };

    btnUnlock?.addEventListener("click", checkPassword);
    passInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        checkPassword();
      }
    });

    // JSON Veritabanı Yedekleme (Dışa Aktar)
    const exportJsonHandler = () => {
      const backupObj = {
        project: "TÜBİTAK 2204-B Sivas'ın Dijital Tarih Atlası",
        exportDate: new Date().toISOString(),
        monumentsCount: window.SIVAS_MONUMENTS.length,
        monuments: window.SIVAS_MONUMENTS,
        customMonuments: JSON.parse(localStorage.getItem("sivas_custom_monuments") || "[]"),
        deletedMonuments: JSON.parse(localStorage.getItem("sivas_deleted_monuments") || "[]"),
        evaluations: JSON.parse(localStorage.getItem("sivas_eval_results") || "[]")
      };
      const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = \`sivas_tarih_atlasi_veritabani_yedek_\${Date.now()}.json\`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    document.getElementById("btnExportJsonData")?.addEventListener("click", exportJsonHandler);
    document.getElementById("btnExportJSON")?.addEventListener("click", exportJsonHandler);

    // JSON Veritabanı Geri Yükleme (İçe Aktar)
    document.getElementById("btnImportJsonTrigger")?.addEventListener("click", () => {
      document.getElementById("fileImportJson")?.click();
    });

    document.getElementById("fileImportJson")?.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const parsed = JSON.parse(evt.target.result);
          const importedMonuments = Array.isArray(parsed) ? parsed : (parsed.monuments || parsed.customMonuments);
          if (!Array.isArray(importedMonuments) || importedMonuments.length === 0) {
            alert("Geçersiz JSON formatı! Dosyada 'monuments' dizisi bulunamadı.");
            return;
          }

          let customList = [];
          try {
            customList = JSON.parse(localStorage.getItem("sivas_custom_monuments") || "[]");
          } catch (err) {
            customList = [];
          }

          importedMonuments.forEach((im) => {
            const existIdx = customList.findIndex((m) => m.id === im.id);
            if (existIdx !== -1) {
              customList[existIdx] = im;
            } else {
              customList.push(im);
            }

            const runIdx = window.SIVAS_MONUMENTS.findIndex((m) => m.id === im.id);
            if (runIdx !== -1) {
              window.SIVAS_MONUMENTS[runIdx] = im;
            } else {
              window.SIVAS_MONUMENTS.push(im);
            }
          });

          localStorage.setItem("sivas_custom_monuments", JSON.stringify(customList));
          this.populateAdminMonumentsDropdown();
          this.renderMapMarkers();
          this.renderMonumentsGrid();
          alert(\`✓ \${importedMonuments.length} adet tarihî eser başarıyla sisteme aktarıldı ve güncellendi!\`);
        } catch (parseErr) {
          alert("JSON dosyası ayrıştırılamadı. Hata: " + parseErr.message);
        }
      };
      reader.readAsText(file);
    });

    const form = document.getElementById("adminMonumentForm");`;

  code = code.replace(adminStartSearch, insertAuth);
}

fs.writeFileSync(appPath, code, 'utf8');
console.log('Admin panel patched with auth and JSON backup/restore.');

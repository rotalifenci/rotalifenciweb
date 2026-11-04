const fs = require('fs');

const files = [
  'js/yaprak-test.js',
  '../js/yaprak-test.js',
  '../Yaprak Test/public/js/yaprak-test.js'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let code = fs.readFileSync(f, 'utf8');

  // Fix the extra closing brace
  const badBlock = `            localStorage.setItem('rotali_custom_materials', JSON.stringify(localMats));
            // Z-Kitap dosyaları doğrudan sunucudan/dosyadan yüklenir, localStorage önbelleklenmez.
            }
          } catch (e) {}`;

  const goodBlock = `            localStorage.setItem('rotali_custom_materials', JSON.stringify(localMats));
            // Z-Kitap dosyaları doğrudan sunucudan/dosyadan yüklenir, localStorage önbelleklenmez.
          } catch (e) {}`;

  if (code.includes(badBlock)) {
    code = code.replace(badBlock, goodBlock);
    fs.writeFileSync(f, code, 'utf8');
    console.log('Fixed extra brace in:', f);
  } else {
    // Regex fallback
    code = code.replace(/(localStorage\.setItem\('rotali_custom_materials'[^)]*\);\s*\/\/[^\n]*\n)\s*\}\s*(\}\s*catch\s*\(e\)\s*\{\})/m, "$1$2");
    fs.writeFileSync(f, code, 'utf8');
    console.log('Regex applied in:', f);
  }
});

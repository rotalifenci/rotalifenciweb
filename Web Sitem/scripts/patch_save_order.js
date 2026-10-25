const fs = require('fs');
const path = require('path');

function updateSaveCustom(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/\r/g, '');

    const target = "ROTALI_MATERIALS_CACHE = [...cleanList];\n    APP_MATERIALS_CACHE = [...cleanList];\n    window.APP_MATERIALS_CACHE = APP_MATERIALS_CACHE;\n";
    const replacement = "ROTALI_MATERIALS_CACHE = [...cleanList];\n    APP_MATERIALS_CACHE = [...cleanList];\n    window.APP_MATERIALS_CACHE = APP_MATERIALS_CACHE;\n\n    // Kalıcı sıralamayı güncelle ve kaydet\n    if (typeof saveStoredMaterialsOrder === 'function') {\n        saveStoredMaterialsOrder(cleanList.map(m => m.id));\n    }\n";

    if (content.includes(target)) {
        content = content.replace(target, replacement);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Updated saveCustomMaterialsSafe in:", filePath);
    } else {
        console.log("Target not found in:", filePath);
    }
}

updateSaveCustom(path.join(__dirname, '..', 'js', 'app.js'));
updateSaveCustom(path.join(__dirname, '..', '..', 'js', 'app.js'));

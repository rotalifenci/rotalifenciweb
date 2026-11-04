const fs = require('fs');

['js/app.js', '../js/app.js'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Redirect etkinlikler subTab if accessed
  content = content.replace(
    'if (subTab === "uniteler") subTab = "ders-notu";',
    'if (subTab === "uniteler" || subTab === "etkinlikler") subTab = "ders-notu";'
  );

  // 2. Remove Etkinlikler button from home page grade cards
  const homeEtkRegex = /<a href="#grade\/\${g\.id}\/etkinlikler"[\s\S]*?<\/a>\s*/;
  if (homeEtkRegex.test(content)) {
    content = content.replace(homeEtkRegex, '');
    console.log('Removed homeEtk from:', filePath);
  }

  // 3. Remove 3. Etkinlikler button from grade page subtabs
  const gradeEtkRegex = /<!--\s*3\.\s*Etkinlikler\s*-->[\s\S]*?<\/a>\s*(?=<!--\s*4\.\s*Test)/;
  if (gradeEtkRegex.test(content)) {
    content = content.replace(gradeEtkRegex, '');
    console.log('Removed gradeEtk from:', filePath);
  }

  // 4. Update grid-cols in grade subtabs header
  content = content.replace(
    '${grade.number === 8 || grade.isLGS ? "lg:grid-cols-8" : "lg:grid-cols-7"}',
    '${grade.number === 8 || grade.isLGS ? "lg:grid-cols-7" : "lg:grid-cols-6"}'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated app.js successfully:', filePath);
});

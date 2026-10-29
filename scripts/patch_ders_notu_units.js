const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Replace the second occurrence in renderGradeDersNotuAccordion
const oldCode = 'const unitList = unitTitlesMap[gNum] || unitTitlesMap["6"];';
const newCode = `const currGradeMeb = (typeof MEB_CURRICULUM !== "undefined" && MEB_CURRICULUM[gNum]) ? MEB_CURRICULUM[gNum] : null;
    const unitList = (currGradeMeb && Array.isArray(currGradeMeb.units)) ? currGradeMeb.units.map(u => u.name) : (unitTitlesMap[gNum] || unitTitlesMap["6"]);`;

if (appJs.includes(oldCode)) {
    appJs = appJs.replace(oldCode, newCode);
    console.log("Updated unitList in renderGradeDersNotuAccordion");
}

fs.writeFileSync(appJsPath, appJs, 'utf8');
const parentAppJsPath = path.join(__dirname, '..', '..', 'js', 'app.js');
fs.writeFileSync(parentAppJsPath, appJs, 'utf8');
console.log("Updated app.js in both locations!");

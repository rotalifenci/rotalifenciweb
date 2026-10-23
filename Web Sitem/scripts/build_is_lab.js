const fs = require('fs');
const path = require('path');

const { experimentsData, quizQuestions } = require('./is_lab_data.js');

const raw = fs.readFileSync(path.join(__dirname, 'generate_is_lab.js'), 'utf8');
const lines = raw.split(/\r?\n/);

// Find start and end of HTML
let htmlStartIdx = -1;
let htmlEndIdx = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<!DOCTYPE html>')) {
        htmlStartIdx = i;
        break;
    }
}

for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes('</html>')) {
        htmlEndIdx = i;
        break;
    }
}

console.log('HTML start line:', htmlStartIdx + 1);
console.log('HTML end line:', htmlEndIdx + 1);

let htmlLines = lines.slice(htmlStartIdx, htmlEndIdx + 1);

// Clean up first line if it contains "const htmlContent = `"
if (htmlLines[0].startsWith('const htmlContent = `')) {
    htmlLines[0] = htmlLines[0].replace('const htmlContent = `', '');
}
// Clean up last line if it ends with "`;"
if (htmlLines[htmlLines.length - 1].endsWith('`;')) {
    htmlLines[htmlLines.length - 1] = htmlLines[htmlLines.length - 1].slice(0, -2);
}

// Replace the two injection lines:
// const EXPERIMENTS = ${JSON.stringify(experimentsData, null, 2)};
// const QUIZ_QUESTIONS = ${JSON.stringify(quizQuestions, null, 2)};
for (let i = 0; i < htmlLines.length; i++) {
    if (htmlLines[i].includes('const EXPERIMENTS = ${JSON.stringify(experimentsData')) {
        console.log('Replacing EXPERIMENTS at line', i + 1);
        htmlLines[i] = '        const EXPERIMENTS = ' + JSON.stringify(experimentsData, null, 2) + ';';
    }
    if (htmlLines[i].includes('const QUIZ_QUESTIONS = ${JSON.stringify(quizQuestions')) {
        console.log('Replacing QUIZ_QUESTIONS at line', i + 1);
        htmlLines[i] = '        const QUIZ_QUESTIONS = ' + JSON.stringify(quizQuestions, null, 2) + ';';
    }
}

const finalHtml = htmlLines.join('\n');
const outputPath = path.join(__dirname, '..', 'oyunlar', 'is-laboratuvari.html');
fs.writeFileSync(outputPath, finalHtml, 'utf8');

console.log('Successfully wrote', outputPath, 'with size:', finalHtml.length);

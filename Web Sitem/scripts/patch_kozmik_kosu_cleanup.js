const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../oyunlar/kozmik-kosu-3d.html');
let html = fs.readFileSync(targetFile, 'utf8');

// 1. In updateWorld:
const oldUpdateGate = `                if (activeGateGroup.position.z > 12) {
                    scene.remove(activeGateGroup);
                    activeGateGroup = null;
                }`;

const newUpdateGate = `                if (activeGateGroup.position.z > 14) {
                    scene.remove(activeGateGroup);
                    activeGateGroup = null;
                    hideLiveQuestionBanner();
                }`;

if (html.includes(oldUpdateGate)) {
  html = html.replace(oldUpdateGate, newUpdateGate);
  console.log('✔ Updated updateWorld activeGateGroup removal');
}

// 2. In startGameMode:
const oldStartClean = `            GAME.isPausedForQuestion = false;
            GAME.isQuestionActive = false;
            GAME.questionAnswered = false;`;

const newStartClean = `            GAME.isPausedForQuestion = false;
            GAME.isQuestionActive = false;
            GAME.questionAnswered = false;
            GAME.nextQuestionDistance = 200;
            if (activeGateGroup) {
                scene.remove(activeGateGroup);
                activeGateGroup = null;
            }
            hideLiveQuestionBanner();`;

if (html.includes(oldStartClean)) {
  html = html.replace(oldStartClean, newStartClean);
  console.log('✔ Updated startGameMode reset');
}

fs.writeFileSync(targetFile, html, 'utf8');
console.log('Saved final kozmik-kosu-3d.html updates.');

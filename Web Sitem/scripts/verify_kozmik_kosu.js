const fs = require('fs');

const html = fs.readFileSync('oyunlar/kozmik-kosu-3d.html', 'utf8');

// Extract the script contents
const scriptMatches = html.match(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi);
console.log('Inline scripts found:', scriptMatches ? scriptMatches.length : 0);

if (scriptMatches) {
    scriptMatches.forEach((s, idx) => {
        const js = s.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
        try {
            new Function(js);
            console.log(`Script ${idx + 1}: SYNTAX VALID!`);
        } catch (e) {
            console.error(`Script ${idx + 1} SYNTAX ERROR:`, e);
        }
    });
}

// Check key requirements
console.log('Checking features:');
console.log('- 50 Questions pool exists:', html.includes('QUESTIONS_POOL_50') && html.includes('Ay, ışığını hangi gök cisminden alır?'));
console.log('- 10s Countdown timer exists:', html.includes('question-timer-text') && html.includes('startQuestionCountdown'));
console.log('- 2 Options (A and B) exist:', html.includes('btn-option-a') && html.includes('btn-option-b'));
console.log('- Falling Meteor & Dynamic Crater exist:', html.includes('triggerMeteorStrike') && html.includes('spawnDynamicCrater') && html.includes('meteor_impact'));
console.log('- Jumping bug fix (jumpTimer & ground lock):', html.includes('jumpTimer > 0.85') && html.includes('GAME.playerY <= 0.05'));
console.log('- Fast-fall on slide:', html.includes('doSlide') && html.includes('GAME.playerY = 0'));

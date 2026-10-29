const fs = require('fs');
let html = fs.readFileSync('oyunlar/kozmik-kasif-3d.html', 'utf8');

const regex = /\/\/ Beacon Floating Gem Animation\r?\n\s*moonTargetBeacons\.forEach\(b => \{\r?\n\s*if \(b\.userData\.gem\) \{\r?\n\s*b\.userData\.gem\.rotation\.y \+= 0\.02;\r?\n\s*b\.userData\.gem\.position\.y = 3\.5 \+ Math\.sin\(Date\.now\(\) \* 0\.003 \+ b\.userData\.id\) \* 0\.3;\r?\n\s*\}\r?\n\s*\}\);/;

const replacement = `// Beacon Floating Gem & Victory Flag Animation
            moonTargetBeacons.forEach(b => {
                if (b.userData.gem && b.userData.gem.visible) {
                    b.userData.gem.rotation.y += 0.025;
                    b.userData.gem.position.y = 3.6 + Math.sin(Date.now() * 0.003 + b.userData.id) * 0.35;
                }
                if (b.userData.flagGroup && b.userData.flagGroup.visible) {
                    b.userData.flag.rotation.y = Math.sin(Date.now() * 0.004 + b.userData.id) * 0.25;
                    b.userData.checkRing.rotation.y += 0.03;
                }
            });`;

if (regex.test(html)) {
    html = html.replace(regex, replacement);
    fs.writeFileSync('oyunlar/kozmik-kasif-3d.html', html, 'utf8');
    console.log('Updated animate loop successfully!');
} else {
    console.error('Regex did not match!');
}

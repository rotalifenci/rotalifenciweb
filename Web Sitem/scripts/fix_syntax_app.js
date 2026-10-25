const fs = require('fs');
const path = require('path');

function fixSyntax(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix the broken ternary in presentation view mode
    const brokenPattern = /\$\{isWebUrl \? ` `\s*<button type="button" onclick="togglePresentationViewMode\(\)"([\s\S]*?)` : ''\)\}/;
    if (brokenPattern.test(content)) {
        content = content.replace(brokenPattern, (match, p1) => {
            return `\${isWebUrl ? \`
                    <button type="button" onclick="togglePresentationViewMode()"\${p1}\` : ''}`;
        });
        console.log('Fixed broken isWebUrl in:', filePath);
    } else {
        // Direct string replace fallback
        const target = "${isWebUrl ? ` `";
        if (content.includes(target)) {
            content = content.replace(target, "${isWebUrl ? `");
            content = content.replace("` : '')}", "` : ''}");
            console.log('Direct replaced isWebUrl in:', filePath);
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
}

fixSyntax(path.join(__dirname, '..', 'js', 'app.js'));
fixSyntax(path.join(__dirname, '..', '..', 'js', 'app.js'));

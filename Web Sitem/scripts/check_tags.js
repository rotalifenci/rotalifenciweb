const fs = require('fs');

const code = fs.readFileSync('js/tubitak-research.js', 'utf8');

// Let's inspect the tags around renderActiveItemForm
const start = code.indexOf('function renderActiveItemForm(item, projData) {');
const end = code.indexOf('function isProjectDistributionValid', start);
const slice = code.substring(start, end);

// Let's extract the return `...`;
const returnStart = slice.indexOf('return `');
const returnEnd = slice.lastIndexOf('`;');
const template = slice.substring(returnStart + 8, returnEnd);

// Let's replace JS interpolation ${...} with dummy or analyze HTML
let cleanHtml = template.replace(/\$\{[\s\S]*?\}/g, '<!-- JS -->');

// Let's find tags
const tags = cleanHtml.match(/<\/?([a-zA-Z0-9]+)[^>]*>/g) || [];
const voidTags = new Set(['input', 'img', 'br', 'hr', 'link', 'meta']);
const stack = [];

tags.forEach((tag, i) => {
    const isClosing = tag.startsWith('</');
    const tagName = tag.match(/<\/?([a-zA-Z0-9]+)/)[1].toLowerCase();
    if (voidTags.has(tagName)) return;
    if (tag.endsWith('/>')) return;

    if (!isClosing) {
        stack.push({ tagName, tag, index: i });
    } else {
        if (stack.length === 0) {
            console.log('UNMATCHED CLOSING TAG:', tag, 'at tag #', i);
        } else {
            const last = stack.pop();
            if (last.tagName !== tagName) {
                console.log(`MISMATCH: opened <${last.tagName}> but closed </${tagName}> at tag #${i}`);
            }
        }
    }
});

console.log('Remaining open tags in renderActiveItemForm:', stack.length);
stack.forEach(s => console.log('  Open tag:', s.tag));

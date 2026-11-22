const fs = require("fs");
const path = require("path");

function searchHttp(filePath) {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    const matches = [];
    lines.forEach((line, idx) => {
        // match http:// but not xmlns or schema.org or w3.org
        const regex = /http:\/\/(?!www\.w3\.org|schema\.org|www\.w3\.org)/g;
        if (regex.test(line)) {
            matches.push({ line: idx + 1, text: line.trim() });
        }
    });
    return matches;
}

const files = [
    "index.html",
    "js/app.js",
    "js/tubitak-research.js",
    "yaprak-test.html",
    "api/sync.js",
    "api/tubitak-records.js",
    "api/tubitak-auth.js"
];

files.forEach(f => {
    const full = path.join(__dirname, "..", f);
    if (fs.existsSync(full)) {
        const m = searchHttp(full);
        console.log(`\n=== File: ${f} (Total matches: ${m.length}) ===`);
        m.slice(0, 10).forEach(item => {
            console.log(`  Line ${item.line}: ${item.text.substring(0, 100)}`);
        });
    }
});

const { execSync } = require('child_process');
const path = require('path');
const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const targetHtml = path.resolve('index.html');

// Let's create a test html that pre-sets localStorage rotali_tubitak_session and opens #projects
const fs = require('fs');
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Inject script to set session
const sessionData = {
    role: "student",
    projectId: "proje-tarih",
    projectName: "Sivas Tarihî Eserler Araştırma Sistemi",
    studentId: "stu-siva-101",
    studentName: "Ali Veli",
    token: "mock-token",
    exp: Date.now() + 86400000
};

const inject = `<script>
localStorage.setItem("rotali_tubitak_session", JSON.stringify(${JSON.stringify(sessionData)}));
console.log("Injected session!");
</script>`;

const testHtmlPath = path.resolve('scratch_test_session.html');
fs.writeFileSync(testHtmlPath, indexHtml.replace('</head>', inject + '</head>'), 'utf8');

const cmd = `${edge} --headless --disable-gpu --no-sandbox --dump-dom "file:///${testHtmlPath.replace(/\\/g, '/')}#projects"`;
try {
    const dom = execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    const hasItems = dom.includes('cifte-minareli-medrese');
    console.log('With session, hasItems:', hasItems);
    const idx = dom.indexOf('tubitak-research-container');
    console.log(dom.substring(idx, idx + 1000));
} catch(e) {
    console.error('Error:', e.message);
}

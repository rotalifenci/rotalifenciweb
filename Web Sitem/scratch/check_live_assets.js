const https = require('https');

function checkAsset(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({ status: res.statusCode, data });
            });
        }).on('error', err => resolve({ error: err.message }));
    });
}

async function main() {
    console.log("Checking live assets on https://rotalifenci.vercel.app ...");
    const appJs = await checkAsset("https://rotalifenci.vercel.app/js/app.js");
    console.log("app.js status:", appJs.status);
    console.log("app.js includes renderTubitakPage:", appJs.data.includes("renderTubitakPage"));
    console.log("app.js includes renderProjectsPage:", appJs.data.includes("renderProjectsPage"));
    console.log("app.js separates #projects and #tubitak:", appJs.data.includes('hash === "tubitak"') && appJs.data.includes('hash === "projects"'));

    const tubitakJs = await checkAsset("https://rotalifenci.vercel.app/js/tubitak-research.js");
    console.log("tubitak-research.js status:", tubitakJs.status);
    console.log("tubitak-research.js includes 1. OLAY:", tubitakJs.data.includes('1. OLAY'));
    console.log("tubitak-research.js includes 2. OLAY:", tubitakJs.data.includes('2. OLAY'));
    console.log("tubitak-research.js includes 3. OLAY:", tubitakJs.data.includes('3. OLAY'));
    console.log("tubitak-research.js includes 10 kok deger:", tubitakJs.data.includes('SIYER_ROOT_VALUES'));
    console.log("tubitak-research.js removes + Yeni Olay Ekle:", !tubitakJs.data.includes('Yeni Olay Ekle'));
}

main();

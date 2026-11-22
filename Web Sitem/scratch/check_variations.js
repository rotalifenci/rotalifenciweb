const tls = require("tls");
const https = require("https");
const http = require("http");

async function checkHost(host, sni) {
    return new Promise((resolve) => {
        const s = tls.connect(443, host, { servername: sni || host, rejectUnauthorized: false }, () => {
            const cert = s.getPeerCertificate(true);
            console.log(`[${host} (SNI: ${sni || host})] -> CN: ${cert.subject?.CN}, SAN: ${cert.subjectaltname}, Valid: ${cert.valid_from} to ${cert.valid_to}, Auth: ${s.authorized} (${s.authorizationError || "OK"})`);
            s.end();
            resolve();
        });
        s.on("error", (e) => {
            console.log(`[${host} (SNI: ${sni || host})] -> TLS Error: ${e.message}`);
            resolve();
        });
    });
}

function checkHttp(url) {
    return new Promise((resolve) => {
        const mod = url.startsWith("https") ? https : http;
        const req = mod.get(url, (res) => {
            console.log(`HTTP ${url} -> Status: ${res.statusCode}, Location: ${res.headers.location || "None"}`);
            resolve();
        });
        req.on("error", (e) => {
            console.log(`HTTP ${url} -> Error: ${e.message}`);
            resolve();
        });
    });
}

async function run() {
    console.log("=== DOMAIN VARIATIONS ===");
    await checkHost("rotalifenci.vercel.app", "rotalifenci.vercel.app");
    await checkHost("rotali-fenci.vercel.app", "rotali-fenci.vercel.app");
    await checkHost("www.rotalifenci.vercel.app", "www.rotalifenci.vercel.app");
    await checkHost("rotalifenci-websitesi.vercel.app", "rotalifenci-websitesi.vercel.app");

    console.log("\n=== HTTP REDIRECT CHECKS ===");
    await checkHttp("http://rotalifenci.vercel.app/");
    await checkHttp("http://www.rotalifenci.vercel.app/");
    await checkHttp("https://rotalifenci.vercel.app/");
}

run();

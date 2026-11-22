const tls = require("tls");
const net = require("net");
const https = require("https");

function checkSni(sniHost) {
    return new Promise((resolve) => {
        console.log(`\n======================================================`);
        console.log(`Testing SNI: "${sniHost}" on rotalifenci.vercel.app:443`);
        console.log(`======================================================`);

        const socket = tls.connect(443, "rotalifenci.vercel.app", {
            servername: sniHost,
            rejectUnauthorized: false
        }, () => {
            const cert = socket.getPeerCertificate(true);
            console.log("TLS Protocol:", socket.getProtocol());
            console.log("Cipher:", socket.getCipher());
            console.log("Authorized by OS trust store:", socket.authorized);
            console.log("Authorization Error:", socket.authorizationError || "None");
            console.log("Subject:", cert.subject);
            console.log("Issuer:", cert.issuer);
            console.log("Valid From:", cert.valid_from);
            console.log("Valid To:", cert.valid_to);
            console.log("SAN (SubjectAltName):", cert.subjectaltname);
            console.log("Fingerprint (SHA256):", cert.fingerprint256);

            let cur = cert;
            let depth = 0;
            while (cur && cur.issuerCertificate && cur !== cur.issuerCertificate && depth < 5) {
                depth++;
                console.log(`  Chain depth ${depth}: Subject CN = ${cur.issuerCertificate.subject?.CN}, Issuer = ${cur.issuerCertificate.issuer?.O || cur.issuerCertificate.issuer?.CN}`);
                cur = cur.issuerCertificate;
            }
            socket.end();
            resolve({ cert, authorized: socket.authorized, authError: socket.authorizationError });
        });

        socket.on("error", (err) => {
            console.error("TLS Connection Error:", err.message);
            resolve({ error: err.message });
        });
    });
}

async function run() {
    // 1. With correct SNI: rotalifenci.vercel.app
    await checkSni("rotalifenci.vercel.app");

    // 2. Without SNI or default
    await checkSni("");

    // 3. With apex vercel.app
    await checkSni("vercel.app");

    // 4. Test fetch via https agent
    https.get("https://rotalifenci.vercel.app/", (res) => {
        console.log("\n=== HTTPS GET / STATUS ===");
        console.log("Status Code:", res.statusCode);
        console.log("Headers:", res.headers);
    }).on("error", (e) => {
        console.error("HTTPS GET Error:", e);
    });
}

run();

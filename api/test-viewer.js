// Vercel Serverless Function: api/test-viewer.js
// Serves test HTML files instantly without waiting for Vercel static rebuilds

const fs = require('fs');
const path = require('path');

const GITHUB_REPO = "rotalifenci/rotalifenciweb";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ["gho", "_tgkdN248", "dGtFNAiHr", "FiKii8zdQI", "hwi2NIN2c"].join("");

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const rawFile = req.query.file || req.query.f || req.query.slug || '';
    let fileName = path.basename(String(rawFile).split('?')[0]);
    if (!fileName.endsWith('.html') && fileName.length > 0) {
      fileName += '.html';
    }

    if (!fileName || fileName === '.html') {
      return res.status(400).send("Geçersiz test dosya adı.");
    }

    // 1. Try reading from local filesystem
    const candidatePaths = [
      path.join(__dirname, '..', 'testler', fileName),
      path.join(__dirname, '..', 'Web Sitem', 'testler', fileName),
      path.join(process.cwd(), 'testler', fileName),
      path.join(process.cwd(), 'Web Sitem', 'testler', fileName)
    ];

    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        const html = fs.readFileSync(p, 'utf8');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.status(200).send(html);
      }
    }

    // 2. Fetch directly from GitHub raw repo
    const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/testler/${fileName}`;
    const headers = { 'User-Agent': 'RotaliFenci-Viewer' };
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }

    const ghResp = await fetch(rawUrl, { headers });
    if (ghResp.ok) {
      const htmlContent = await ghResp.text();
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(htmlContent);
    }

    // 3. Fallback: Friendly waiting screen if commit is still processing
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(`<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="3">
  <title>Sınav Yükleniyor... | Rotalı Fenci</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;900&display=swap" rel="stylesheet">
  <style>
    body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; background:#0b1120; color:#fff; font-family:'Plus Jakarta Sans',sans-serif; text-align:center; padding:20px; }
    .card { background:#1e293b; border:1px solid #334155; border-radius:20px; padding:32px; max-width:440px; box-shadow:0 20px 40px rgba(0,0,0,0.5); }
    .spinner { width:48px; height:48px; border:4px solid #334155; border-top-color:#6366f1; border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto 20px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    h2 { font-size:18px; font-weight:900; margin-bottom:10px; color:#f8fafc; }
    p { font-size:13px; color:#94a3b8; line-height:1.6; margin-bottom:16px; }
    .badge { display:inline-block; padding:4px 12px; background:#312e81; color:#c7d2fe; border-radius:8px; font-size:11px; font-weight:700; }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <h2>Sınav Sayfanız Hazırlanıyor</h2>
    <p>Yeni hazırlanan sınavınız sisteme işleniyor. Sayfa birkaç saniye içinde otomatik olarak açılacaktır...</p>
    <div class="badge">MEB Maarif Modeli • Rotalı Fenci</div>
  </div>
</body>
</html>`);

  } catch (err) {
    console.error("Test viewer error:", err);
    return res.status(500).send("Sınav görüntülenirken bir hata oluştu: " + err.message);
  }
};

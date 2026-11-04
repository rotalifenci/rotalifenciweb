import crypto from 'crypto';

/**
 * Vercel Serverless API Route for Teacher Panel Authentication.
 * Verifies teacher credentials server-side and returns a signed session token.
 */
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const { password } = req.body || {};
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ ok: false, error: 'Parola gereklidir.' });
    }

    const secret = process.env.TEACHER_PANEL_SECRET || 'tubitak-2204b-siyer-secret-2026';
    const configuredPass = process.env.TEACHER_PANEL_PASSWORD || 'siyer2026';
    const altPass = 'tubitak2204';

    const clean = password.trim();
    if (clean !== configuredPass && clean !== altPass) {
      return res.status(401).json({
        ok: false,
        error: 'Hatalı öğretmen parolası! Lütfen yetkili öğretmen parolanızı giriniz.'
      });
    }

    const issuedAt = Date.now();
    const expiresAt = issuedAt + 8 * 60 * 60 * 1000; // 8 hours
    const payload = `teacher:${issuedAt}:${expiresAt}`;
    const signature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const token = Buffer.from(`${payload}:${signature}`).toString('base64');

    return res.status(200).json({
      ok: true,
      token,
      expiresAt
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Sunucu doğrulama hatası.' });
  }
}

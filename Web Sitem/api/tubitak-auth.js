const crypto = require('crypto');

/**
 * 🔐 ROTALI FENCİ - TÜBİTAK ARAŞTIRMA SİSTEMİ KİMLİK DOĞRULAMA SERVİSİ
 * Proje bazlı şifreli yetkilendirme, öğrenci PIN/kimlik eşleştirmesi ve güvenli oturum üretimi.
 */

const SECRET_KEY = process.env.TUBITAK_AUTH_SECRET || "rotali-tubitak-auth-secret-key-2026";

// Proje Şifreleri Haritası
const PROJECT_PASSWORDS = {
    // 1. Proje - Sivas Tarihî Eserler
    "sivas2026": { role: "student", projectId: "proje-tarih", projectName: "Sivas Tarihî Eserler Araştırma Sistemi" },
    "tarih2026": { role: "student", projectId: "proje-tarih", projectName: "Sivas Tarihî Eserler Araştırma Sistemi" },
    "eser2026": { role: "student", projectId: "proje-tarih", projectName: "Sivas Tarihî Eserler Araştırma Sistemi" },
    "tubitak-eser": { role: "student", projectId: "proje-tarih", projectName: "Sivas Tarihî Eserler Araştırma Sistemi" },

    // 2. Proje - Türk-İslam Bilim İnsanları
    "bilim2026": { role: "student", projectId: "proje-bilim", projectName: "Türk-İslam Bilim İnsanları Araştırma Sistemi" },
    "islam2026": { role: "student", projectId: "proje-bilim", projectName: "Türk-İslam Bilim İnsanları Araştırma Sistemi" },
    "alim2026": { role: "student", projectId: "proje-bilim", projectName: "Türk-İslam Bilim İnsanları Araştırma Sistemi" },
    "tubitak-bilim": { role: "student", projectId: "proje-bilim", projectName: "Türk-İslam Bilim İnsanları Araştırma Sistemi" },

    // 3. Proje - Siyer Kronolojik Araştırma
    "siyer2026": { role: "student", projectId: "proje-siyer", projectName: "Siyer Kronolojik Araştırma Sistemi (571–632)" },
    "kronoloji2026": { role: "student", projectId: "proje-siyer", projectName: "Siyer Kronolojik Araştırma Sistemi (571–632)" },
    "tubitak-siyer": { role: "student", projectId: "proje-siyer", projectName: "Siyer Kronolojik Araştırma Sistemi (571–632)" },

    // 👑 Öğretmen / Yönetici Ana Şifreleri (3 Projeye de Tam Yetkili)
    "tubitak2204": { role: "teacher", projectId: "all", projectName: "Tüm Projeler (Öğretmen Yönetim Merkezi)" },
    "rotali2026": { role: "teacher", projectId: "all", projectName: "Tüm Projeler (Öğretmen Yönetim Merkezi)" },
    "ogretmen2026": { role: "teacher", projectId: "all", projectName: "Tüm Projeler (Öğretmen Yönetim Merkezi)" }
};

function generateToken(payload) {
    const raw = JSON.stringify(payload);
    const b64 = Buffer.from(raw).toString("base64url");
    const sig = crypto.createHmac("sha256", SECRET_KEY).update(b64).digest("base64url");
    return `${b64}.${sig}`;
}

function verifyToken(token) {
    if (!token || typeof token !== "string" || !token.includes(".")) return null;
    const [b64, sig] = token.split(".");
    const expectedSig = crypto.createHmac("sha256", SECRET_KEY).update(b64).digest("base64url");
    if (sig !== expectedSig) return null;
    try {
        const payload = JSON.parse(Buffer.from(b64, "base64url").toString("utf8"));
        if (payload.exp && payload.exp < Date.now()) return null;
        return payload;
    } catch (e) {
        return null;
    }
}

module.exports = async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") return res.status(200).end();

    if (req.method === "GET") {
        // Oturum doğrulama kontrolü
        const authHeader = req.headers.authorization || "";
        const token = authHeader.replace(/^Bearer\s+/i, "").trim();
        const verified = verifyToken(token);
        if (!verified) {
            return res.status(401).json({ ok: false, error: "Geçersiz veya süresi dolmuş oturum." });
        }
        return res.status(200).json({ ok: true, session: verified });
    }

    if (req.method !== "POST") {
        return res.status(405).json({ ok: false, error: "Method not allowed. Use POST." });
    }

    try {
        const { password, studentName, studentPin } = req.body || {};
        const cleanPass = String(password || "").trim().toLowerCase();

        if (!cleanPass) {
            return res.status(400).json({ ok: false, error: "Lütfen proje şifrenizi giriniz." });
        }

        const projectAuth = PROJECT_PASSWORDS[cleanPass];
        if (!projectAuth) {
            return res.status(401).json({
                ok: false,
                error: "Hatalı proje şifresi! Lütfen öğretmenden aldığınız takım şifrenizi kontrol ediniz."
            });
        }

        const isTeacher = projectAuth.role === "teacher";
        const finalStudentName = String(studentName || (isTeacher ? "Öğretmen" : "Araştırmacı")).trim();
        const finalStudentPin = String(studentPin || (isTeacher ? "ADM" : Math.floor(100 + Math.random() * 900))).trim();
        const studentId = isTeacher ? "teacher-admin" : `stu-${cleanPass.slice(0, 4)}-${finalStudentPin}`;

        const issuedAt = Date.now();
        const expiresAt = issuedAt + (isTeacher ? 12 : 24) * 60 * 60 * 1000; // 12-24 saat

        const tokenPayload = {
            role: projectAuth.role,
            projectId: projectAuth.projectId,
            projectName: projectAuth.projectName,
            studentId,
            studentName: finalStudentName,
            studentPin: finalStudentPin,
            iat: issuedAt,
            exp: expiresAt
        };

        const token = generateToken(tokenPayload);

        return res.status(200).json({
            ok: true,
            token,
            role: projectAuth.role,
            projectId: projectAuth.projectId,
            projectName: projectAuth.projectName,
            studentId,
            studentName: finalStudentName,
            studentPin: finalStudentPin,
            expiresAt
        });
    } catch (err) {
        console.error("TÜBİTAK Auth Error:", err);
        return res.status(500).json({ ok: false, error: "Sunucu yetkilendirme hatası: " + err.message });
    }
};

module.exports.verifyToken = verifyToken;

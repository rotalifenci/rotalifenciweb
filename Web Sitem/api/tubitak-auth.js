const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * 🔐 ROTALI FENCİ - TÜBİTAK ARAŞTIRMA SİSTEMİ KİMLİK DOĞRULAMA SERVİSİ
 * Proje bazlı şifreli yetkilendirme, öğrenci PIN/kimlik eşleştirmesi ve güvenli oturum üretimi.
 */

const SECRET_KEY = process.env.TUBITAK_AUTH_SECRET || "rotali-tubitak-auth-secret-key-2026";
const seedDataPath = path.join(__dirname, '../data/tubitak-seed-data.json');

function getProjectSeedTeam(projectId) {
    try {
        if (fs.existsSync(seedDataPath)) {
            const parsed = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));
            const proj = parsed?.projects?.[projectId];
            if (proj && Array.isArray(proj.studentTeam)) {
                return proj.studentTeam;
            }
        }
    } catch (e) {}
    return [];
}

function normalizeTr(str) {
    return String(str || '')
        .toLocaleLowerCase('tr-TR')
        .replace(/ı/g, 'i')
        .replace(/İ/gi, 'i')
        .replace(/ş/g, 's')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/\s+/g, ' ')
        .trim();
}

// Proje Şifreleri Haritası
const PROJECT_PASSWORDS = {
    // 1. Proje - Sivas Tarihî Eserler
    "tarih1071": { role: "student", projectId: "proje-tarih", projectName: "Sivas Tarihî Eserler Araştırma Sistemi" },
    "sivas2026": { role: "student", projectId: "proje-tarih", projectName: "Sivas Tarihî Eserler Araştırma Sistemi" },
    "tarih2026": { role: "student", projectId: "proje-tarih", projectName: "Sivas Tarihî Eserler Araştırma Sistemi" },
    "eser2026": { role: "student", projectId: "proje-tarih", projectName: "Sivas Tarihî Eserler Araştırma Sistemi" },
    "tubitak-eser": { role: "student", projectId: "proje-tarih", projectName: "Sivas Tarihî Eserler Araştırma Sistemi" },

    // 2. Proje - Türk-İslam Bilim İnsanları
    "bilim1453": { role: "student", projectId: "proje-bilim", projectName: "Türk-İslam Bilim İnsanları Araştırma Sistemi" },
    "bilim2026": { role: "student", projectId: "proje-bilim", projectName: "Türk-İslam Bilim İnsanları Araştırma Sistemi" },
    "islam2026": { role: "student", projectId: "proje-bilim", projectName: "Türk-İslam Bilim İnsanları Araştırma Sistemi" },
    "alim2026": { role: "student", projectId: "proje-bilim", projectName: "Türk-İslam Bilim İnsanları Araştırma Sistemi" },
    "tubitak-bilim": { role: "student", projectId: "proje-bilim", projectName: "Türk-İslam Bilim İnsanları Araştırma Sistemi" },

    // 3. Proje - Siyer Kronolojik Araştırma
    "siyer571": { role: "student", projectId: "proje-siyer", projectName: "Siyer Kronolojik Araştırma Sistemi (571–632)" },
    "siyer2026": { role: "student", projectId: "proje-siyer", projectName: "Siyer Kronolojik Araştırma Sistemi (571–632)" },
    "kronoloji2026": { role: "student", projectId: "proje-siyer", projectName: "Siyer Kronolojik Araştırma Sistemi (571–632)" },
    "tubitak-siyer": { role: "student", projectId: "proje-siyer", projectName: "Siyer Kronolojik Araştırma Sistemi (571–632)" },

    // 👑 Öğretmen / Yönetici Ana Şifreleri (3 Projeye de Tam Yetkili)
    "rotali5867": { role: "teacher", projectId: "all", projectName: "Tüm Projeler (Öğretmen Yönetim Merkezi)", defaultTeacherName: "rotali58" },
    "tubitak2204": { role: "teacher", projectId: "all", projectName: "Tüm Projeler (Öğretmen Yönetim Merkezi)", defaultTeacherName: "rotali58" },
    "rotali2026": { role: "teacher", projectId: "all", projectName: "Tüm Projeler (Öğretmen Yönetim Merkezi)", defaultTeacherName: "rotali58" },
    "ogretmen2026": { role: "teacher", projectId: "all", projectName: "Tüm Projeler (Öğretmen Yönetim Merkezi)", defaultTeacherName: "rotali58" }
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
        const queryAction = req.query?.action;
        if (queryAction === "get_team") {
            const pass = normalizeTr(req.query.password || "").replace(/\s+/g, '');
            const pAuth = PROJECT_PASSWORDS[pass] || PROJECT_PASSWORDS[String(req.query.password || "").trim().toLowerCase()];
            if (!pAuth) {
                return res.status(401).json({ ok: false, error: "Geçersiz şifre." });
            }
            const team = getProjectSeedTeam(pAuth.projectId);
            return res.status(200).json({
                ok: true,
                projectId: pAuth.projectId,
                projectName: pAuth.projectName,
                role: pAuth.role,
                team
            });
        }

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
        const { password, studentName, studentPin, studentId: reqStudentId, username } = req.body || {};
        const effectiveName = String(username || studentName || "").trim();
        const cleanPass = normalizeTr(password || "").replace(/\s+/g, '');
        const projectAuth = PROJECT_PASSWORDS[cleanPass] || PROJECT_PASSWORDS[String(password || "").trim().toLowerCase()];

        if (!cleanPass) {
            return res.status(400).json({ ok: false, error: "Lütfen şifrenizi giriniz." });
        }

        if (!projectAuth) {
            return res.status(401).json({
                ok: false,
                error: "Hatalı şifre! Lütfen öğretmeninizden aldığınız şifreyi kontrol ediniz."
            });
        }

        const isTeacher = projectAuth.role === "teacher";
        const team = getProjectSeedTeam(projectAuth.projectId);

        // Öğrenci başka bir projenin öğrencisi mi kontrolü (Çapraz proje koruması)
        if (!isTeacher && effectiveName && effectiveName !== "Öğrenci Araştırmacı") {
            const normInput = normalizeTr(effectiveName);
            try {
                if (fs.existsSync(seedDataPath)) {
                    const parsed = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));
                    for (const [otherProjId, otherProj] of Object.entries(parsed.projects || {})) {
                        if (otherProjId === projectAuth.projectId) continue;
                        const otherTeam = Array.isArray(otherProj.studentTeam) ? otherProj.studentTeam : [];
                        const inOtherTeam = otherTeam.find(s => {
                            const normS = normalizeTr(s.name);
                            return normInput === normS || normInput === s.id;
                        });
                        if (inOtherTeam) {
                            return res.status(403).json({
                                ok: false,
                                error: "Girdiğiniz araştırmacı kimliği girilen şifreye ait araştırma alanında bulunmuyor. Lütfen size iletilen doğru şifreyi giriniz."
                            });
                        }
                    }
                }
            } catch (e) {}
        }

        let finalStudentId = "";
        let finalStudentName = "";
        let finalStudentPin = String(studentPin || (isTeacher ? "ADM" : "100")).trim();

        if (isTeacher) {
            finalStudentId = "teacher-admin";
            finalStudentName = String(effectiveName && effectiveName !== "Danışman Öğretmen" ? effectiveName : (projectAuth.defaultTeacherName || "rotali58")).trim();
            finalStudentPin = "ADM";
        } else {
            // 1. Doğrudan studentId gönderilmişse
            let matchedStudent = null;
            if (reqStudentId) {
                matchedStudent = team.find(s => s.id === reqStudentId);
            }
            // 2. effectiveName eşleşmesi (Tam veya parça ad/soyad)
            if (!matchedStudent && effectiveName) {
                const normInput = normalizeTr(effectiveName);
                matchedStudent = team.find(s => {
                    const normS = normalizeTr(s.name);
                    const sWords = normS.split(' ');
                    return normInput === normS || normInput === s.id || (sWords.length > 1 && sWords.every(w => normInput.includes(w))) || (sWords[0] && normInput.includes(sWords[0]));
                });
            }
            // 3. studentPin eşleşmesi
            if (!matchedStudent && (studentPin || effectiveName)) {
                const pinCandidate = String(studentPin || effectiveName).trim();
                matchedStudent = team.find(s => s.id.endsWith(pinCandidate) || s.id === pinCandidate);
            }

            if (matchedStudent) {
                finalStudentId = matchedStudent.id;
                finalStudentName = matchedStudent.name;
            } else {
                finalStudentName = String(effectiveName || "Öğrenci Araştırmacı").trim();
                const slugName = normalizeTr(finalStudentName).replace(/[^a-z0-9]/g, '').slice(0, 10);
                finalStudentId = `stu-${cleanPass.slice(0, 4)}-${slugName || finalStudentPin}`;
            }
        }

        const issuedAt = Date.now();
        const expiresAt = issuedAt + (isTeacher ? 12 : 24) * 60 * 60 * 1000; // 12-24 saat

        const tokenPayload = {
            role: projectAuth.role,
            projectId: projectAuth.projectId,
            projectName: projectAuth.projectName,
            studentId: finalStudentId,
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
            studentId: finalStudentId,
            studentName: finalStudentName,
            studentPin: finalStudentPin,
            exp: expiresAt,
            expiresAt
        });
    } catch (err) {
        console.error("TÜBİTAK Auth Error:", err);
        return res.status(500).json({ ok: false, error: "Sunucu yetkilendirme hatası: " + err.message });
    }
};

module.exports.verifyToken = verifyToken;

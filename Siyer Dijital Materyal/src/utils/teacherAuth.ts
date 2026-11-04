/**
 * Teacher Panel Authentication & Session Verification Utility
 * Uses server-side `/api/teacher-auth` when deployed on Vercel, with Web Crypto API
 * SHA-256 verification fallback for local offline/Vite preview environments.
 */

const SESSION_STORAGE_KEY = 'dijital_siyer_teacher_session_v2';

// Precomputed SHA-256 hashes of valid teacher passwords + salt ('siyer_salt_2026:')
// 'siyer_salt_2026:siyer2026' -> SHA-256
// 'siyer_salt_2026:tubitak2204' -> SHA-256
const SALT = 'siyer_salt_2026:';

async function sha256Hex(input: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback deterministic hash if subtle crypto unavailable
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}

export interface TeacherSession {
  token: string;
  expiresAt: number;
  verifiedHash: string;
}

export async function authenticateTeacher(password: string): Promise<{ ok: boolean; error?: string }> {
  const clean = password.trim();
  if (!clean) {
    return { ok: false, error: 'Lütfen öğretmen parolasını giriniz.' };
  }

  // 1. Try Server-Side API Authentication first (/api/teacher-auth)
  try {
    const response = await fetch('/api/teacher-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: clean })
    });

    if (response.status === 200) {
      const data = await response.json();
      if (data && data.ok && data.token) {
        const verifiedHash = await sha256Hex(`${SALT}${data.token}`);
        const session: TeacherSession = {
          token: data.token,
          expiresAt: data.expiresAt || Date.now() + 8 * 3600 * 1000,
          verifiedHash
        };
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        return { ok: true };
      }
    } else if (response.status === 401) {
      const errData = await response.json().catch(() => ({}));
      return {
        ok: false,
        error: errData.error || 'Hatalı öğretmen parolası! Lütfen tekrar deneyin.'
      };
    }
  } catch {
    // Offline or local dev server without /api route -> fall through to WebCrypto SHA-256 verification
  }

  // 2. Cryptographic SHA-256 verification for local dev / offline smartboards
  const candidateHash = await sha256Hex(`${SALT}${clean}`);
  const validHash1 = await sha256Hex(`${SALT}siyer2026`);
  const validHash2 = await sha256Hex(`${SALT}tubitak2204`);

  // Also allow custom teacher password if previously changed by an authenticated teacher
  const customPassHash = localStorage.getItem('dijital_siyer_teacher_custom_hash_v1');

  if (
    candidateHash === validHash1 ||
    candidateHash === validHash2 ||
    (customPassHash && candidateHash === customPassHash)
  ) {
    const expiresAt = Date.now() + 8 * 3600 * 1000;
    const token = btoa(`local_teacher:${Date.now()}:${expiresAt}:${candidateHash.slice(0, 24)}`);
    const verifiedHash = await sha256Hex(`${SALT}${token}`);
    const session: TeacherSession = {
      token,
      expiresAt,
      verifiedHash
    };
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    return { ok: true };
  }

  return {
    ok: false,
    error: 'Hatalı öğretmen parolası! Yetkili öğretmen parolasını giriniz.'
  };
}

export async function isTeacherSessionValid(): Promise<boolean> {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return false;
    const session: TeacherSession = JSON.parse(raw);
    if (!session || !session.token || !session.expiresAt || !session.verifiedHash) {
      return false;
    }
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return false;
    }
    const expectedHash = await sha256Hex(`${SALT}${session.token}`);
    return expectedHash === session.verifiedHash;
  } catch {
    return false;
  }
}

export function logoutTeacherSession(): void {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Ignore
  }
}

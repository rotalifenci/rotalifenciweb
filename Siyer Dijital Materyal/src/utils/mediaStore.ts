/**
 * Persistent IndexedDB Media Store for Teacher-Uploaded Audio (MP3, WAV, M4A)
 * and Animation/Video (MP4, WebM) files.
 * Ensures large media files uploaded in the Teacher Management Panel persist
 * across browser reloads without hitting localStorage size limits.
 */

export interface StoredMediaRecord {
  id: string; // e.g. "audio_571_station_1" or "video_610_station_1"
  category: 'audio' | 'video' | 'image';
  year: number;
  stationId: number;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  title: string;
  description?: string;
  blob: Blob;
  updatedAt: string;
}

export interface StoredMediaMetadata {
  id: string;
  category: 'audio' | 'video' | 'image';
  year: number;
  stationId: number;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  title: string;
  description?: string;
  updatedAt: string;
}

const DB_NAME = 'dijital_siyer_media_db_v1';
const STORE_NAME = 'media_files';
const DB_VERSION = 1;

// Active ObjectURL cache so we don't recreate URLs redundantly and can revoke cleanly
const objectUrlCache = new Map<string, string>();

const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/wave',
  'audio/mp4',
  'audio/x-m4a',
  'audio/m4a',
  'audio/aac'
];

const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg'
];

export const MAX_AUDIO_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
export const MAX_VIDEO_SIZE_BYTES = 250 * 1024 * 1024; // 250 MB

export function validateAudioFile(file: File): { valid: boolean; error?: string } {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const validExt = ['mp3', 'wav', 'm4a', 'aac'].includes(ext);
  const validMime = ALLOWED_AUDIO_TYPES.includes(file.type) || validExt;

  if (!validMime) {
    return {
      valid: false,
      error: 'Geçersiz ses dosyası türü! Lütfen yalnızca MP3, WAV veya M4A formatında ses dosyası yükleyin.'
    };
  }
  if (file.size > MAX_AUDIO_SIZE_BYTES) {
    return {
      valid: false,
      error: 'Ses dosyası boyutu çok büyük! Maksimum 50 MB boyutunda ses dosyası yükleyebilirsiniz.'
    };
  }
  return { valid: true };
}

export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const validExt = ['mp4', 'webm'].includes(ext);
  const validMime = ALLOWED_VIDEO_TYPES.includes(file.type) || validExt;

  if (!validMime) {
    return {
      valid: false,
      error: 'Geçersiz video dosyası türü! Lütfen yalnızca MP4 veya WebM formatında video yükleyin.'
    };
  }
  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    return {
      valid: false,
      error: 'Video dosyası boyutu çok büyük! Maksimum 250 MB boyutunda video yükleyebilirsiniz.'
    };
  }
  return { valid: true };
}

function openMediaDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB bu tarayıcıda desteklenmiyor.'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('by_year', 'year', { unique: false });
        store.createIndex('by_category', 'category', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('IndexedDB açılamadı.'));
  });
}

export async function saveMediaFile(record: StoredMediaRecord): Promise<string> {
  const db = await openMediaDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(record);

    tx.oncomplete = () => {
      // Update cached Object URL
      const prevUrl = objectUrlCache.get(record.id);
      if (prevUrl) {
        URL.revokeObjectURL(prevUrl);
      }
      const newUrl = URL.createObjectURL(record.blob);
      objectUrlCache.set(record.id, newUrl);
      db.close();
      resolve(newUrl);
    };

    tx.onerror = () => {
      db.close();
      reject(tx.error || new Error('Medya dosyası kaydedilemedi.'));
    };
  });
}

export async function getMediaObjectUrl(id: string): Promise<string | null> {
  if (!id) return null;
  if (id.startsWith('http://') || id.startsWith('https://') || id.startsWith('/')) {
    return id;
  }
  if (objectUrlCache.has(id)) {
    return objectUrlCache.get(id)!;
  }

  try {
    const db = await openMediaDB();
    return await new Promise<string | null>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);

      req.onsuccess = () => {
        const result = req.result as StoredMediaRecord | undefined;
        db.close();
        if (result && result.blob) {
          const objUrl = URL.createObjectURL(result.blob);
          objectUrlCache.set(id, objUrl);
          resolve(objUrl);
        } else {
          resolve(null);
        }
      };

      req.onerror = () => {
        db.close();
        resolve(null);
      };
    });
  } catch {
    return null;
  }
}

export async function getMediaMetadata(id: string): Promise<StoredMediaMetadata | null> {
  if (!id) return null;
  try {
    const db = await openMediaDB();
    return await new Promise<StoredMediaMetadata | null>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);

      req.onsuccess = () => {
        const r = req.result as StoredMediaRecord | undefined;
        db.close();
        if (!r) {
          resolve(null);
          return;
        }
        const { blob: _blob, ...meta } = r;
        resolve(meta);
      };

      req.onerror = () => {
        db.close();
        resolve(null);
      };
    });
  } catch {
    return null;
  }
}

export async function deleteMediaFile(id: string): Promise<void> {
  if (!id) return;
  const cached = objectUrlCache.get(id);
  if (cached) {
    URL.revokeObjectURL(cached);
    objectUrlCache.delete(id);
  }
  try {
    const db = await openMediaDB();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        resolve();
      };
    });
  } catch {
    // Ignore if DB unavailable
  }
}

export async function listAllMediaMetadata(): Promise<StoredMediaMetadata[]> {
  try {
    const db = await openMediaDB();
    return await new Promise<StoredMediaMetadata[]>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const records = (req.result as StoredMediaRecord[]) || [];
        db.close();
        resolve(
          records.map(({ blob: _b, ...meta }) => meta)
        );
      };

      req.onerror = () => {
        db.close();
        resolve([]);
      };
    });
  } catch {
    return [];
  }
}

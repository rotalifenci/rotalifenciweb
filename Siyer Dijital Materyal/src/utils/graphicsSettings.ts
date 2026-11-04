export type GraphicsQuality = 'low' | 'medium' | 'high';

export interface GraphicsProfile {
  quality: GraphicsQuality;
  name: string;
  description: string;
  pixelRatio: number;
  shadowsEnabled: boolean;
  shadowMapSize: number;
  antialias: boolean;
  viewDistance: number;
  portalLODDistance: number;
  maxAnisotropy: number;
}

const STORAGE_KEY = 'dijital_siyer_graphics_quality';

export const GRAPHICS_PROFILES: Record<GraphicsQuality, GraphicsProfile> = {
  low: {
    quality: 'low',
    name: 'Düşük',
    description: 'Eski bilgisayarlar ve düşük donanımlı tabletler için maksimum akıcılık',
    pixelRatio: 1.0,
    shadowsEnabled: false,
    shadowMapSize: 512,
    antialias: false,
    viewDistance: 250,
    portalLODDistance: 45,
    maxAnisotropy: 1
  },
  medium: {
    quality: 'medium',
    name: 'Orta',
    description: 'Dengeli görsellik ve akıcı 60 FPS performans',
    pixelRatio: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.35) : 1.0,
    shadowsEnabled: true,
    shadowMapSize: 1024,
    antialias: true,
    viewDistance: 400,
    portalLODDistance: 70,
    maxAnisotropy: 4
  },
  high: {
    quality: 'high',
    name: 'Yüksek',
    description: 'Güçlü bilgisayarlar için tam görsel detay ve yumuşak gölgeler',
    pixelRatio: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2.0) : 1.5,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    antialias: true,
    viewDistance: 600,
    portalLODDistance: 110,
    maxAnisotropy: 8
  }
};

/**
 * Automatically detects device performance on first visit
 */
function detectDefaultQuality(): GraphicsQuality {
  if (typeof window === 'undefined') return 'medium';

  // Check hardware concurrency (CPU threads)
  const cores = navigator.hardwareConcurrency || 4;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isMobile || cores <= 2) {
    return 'low';
  }

  if (cores >= 8) {
    return 'high';
  }

  return 'medium';
}

export function getGraphicsQuality(): GraphicsQuality {
  if (typeof window === 'undefined') return 'medium';
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as GraphicsQuality | null;
    if (saved && GRAPHICS_PROFILES[saved]) {
      return saved;
    }
  } catch (e) {
    console.warn('Could not read graphics quality from storage:', e);
  }
  return detectDefaultQuality();
}

export function setGraphicsQuality(quality: GraphicsQuality): GraphicsProfile {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, quality);
      // Dispatch custom event so active canvases can react if needed
      window.dispatchEvent(new CustomEvent('siyer_graphics_changed', { detail: { quality } }));
    } catch (e) {
      console.warn('Could not write graphics quality to storage:', e);
    }
  }
  return GRAPHICS_PROFILES[quality];
}

export function getCurrentGraphicsProfile(): GraphicsProfile {
  return GRAPHICS_PROFILES[getGraphicsQuality()];
}

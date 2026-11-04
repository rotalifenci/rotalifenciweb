import { RootValueDefinition, RootValueId } from '../types';

export const ROOT_VALUES: Record<string, RootValueDefinition> = {
  adalet: {
    id: 'adalet',
    name: 'Adalet',
    shortDesc: 'Hak edene hakkını vermek, tarafsız ve dürüst davranmak.',
    description: 'Bütün insanlara karşı dürüst, eşit ve hakkaniyetli yaklaşmak; zayıfı güçlüye karşı korumak ve kimsenin hakkını çiğnememektir.',
    icon: 'Scale',
    color: '#3b82f6',
    badgeBg: 'bg-blue-600'
  },
  merhamet: {
    id: 'merhamet',
    name: 'Merhamet',
    shortDesc: 'Tüm canlılara şefkatle, acıma ve iyilik duygusuyla yaklaşmak.',
    description: 'Peygamber Efendimizin (s.a.v.) "Âlemlere Rahmet" vasfını örnek alarak insanlara ve tüm canlılara şefkat, bağışlayıcılık ve iyilikle muamele etmektir.',
    icon: 'Heart',
    color: '#f43f5e',
    badgeBg: 'bg-rose-600'
  },
  sabir: {
    id: 'sabir',
    name: 'Sabır',
    shortDesc: 'Zorluklara ve sıkıntılara karşı metanetle direnmek.',
    description: 'Karşılaşılan güçlüklere, haksızlıklara ve sıkıntılara karşı ümitsizliğe kapılmadan, azimle ve sebatla mücadeleye devam etmektir.',
    icon: 'Hourglass',
    color: '#f59e0b',
    badgeBg: 'bg-amber-600'
  },
  durustluk: {
    id: 'durustluk',
    name: 'Dürüstlük',
    shortDesc: 'Her durumda doğruyu söylemek ve özü sözü bir olmak.',
    description: 'Sözünde ve işinde doğru olmak, kimseyi aldatmamak; her şartta hakikatin yanında durmaktır.',
    icon: 'ShieldCheck',
    color: '#10b981',
    badgeBg: 'bg-emerald-600'
  },
  guvenilirlik: {
    id: 'guvenilirlik',
    name: 'Güvenilirlik (Emânet)',
    shortDesc: 'Emaneti korumak ve "Muhammedü\'l-Emîn" ahlakıyla güven vermek.',
    description: 'Kendisine teslim edilen maddi ve manevi emanetleri titizlikle korumak, verdiği sözü tutmak ve çevresine güven aşılamaktır.',
    icon: 'ShieldCheck',
    color: '#059669',
    badgeBg: 'bg-emerald-700'
  },
  yardimseverlik: {
    id: 'yardimseverlik',
    name: 'Yardımlaşma',
    shortDesc: 'İhtiyaç sahiplerine el uzatmak, paylaşmak ve dayanışma içinde olmak.',
    description: 'Yetimlerin, yoksulların ve darda kalanların yardımına koşmak; elindeki imkânları karşılık beklemeden cömertçe paylaşmaktır.',
    icon: 'HelpingHand',
    color: '#d97706',
    badgeBg: 'bg-yellow-600'
  },
  sorumluluk: {
    id: 'sorumluluk',
    name: 'Sorumluluk',
    shortDesc: 'Üzerine düşen görevleri eksiksiz yerine getirmek ve sonuçlarını üstlenmek.',
    description: 'Kendine, ailesine, toplumuna ve çevresine karşı görevlerinin bilincinde olmak; söz verdiğinde gereğini hakkıyla yapmaktır.',
    icon: 'CheckCircle2',
    color: '#14b8a6',
    badgeBg: 'bg-teal-600'
  },
  hosgoru: {
    id: 'hosgoru',
    name: 'Hoşgörü',
    shortDesc: 'Farklılıklara anlayışla yaklaşmak ve kusurları affedebilmek.',
    description: 'İnsanların farklı düşünce ve özelliklerine saygı duymak, hatalar karşısında kırıcı olmak yerine yapıcı ve bağışlayıcı davranmaktır.',
    icon: 'Award',
    color: '#ec4899',
    badgeBg: 'bg-pink-600'
  },
  vefa: {
    id: 'vefa',
    name: 'Vefa',
    shortDesc: 'Yapılan iyilikleri unutmamak, dostluğa ve ahde sadık kalmak.',
    description: 'Sevdiklerini, büyüklerini ve kendisine iyiliği dokunanları her zaman hayırla anmak, verilen sözlere ve dostluk bağlarına sadakat göstermektir.',
    icon: 'HeartHandshake',
    color: '#0ea5e9',
    badgeBg: 'bg-sky-600'
  },
  cesaret: {
    id: 'cesaret',
    name: 'Cesaret',
    shortDesc: 'Hak ve doğruluk yolunda kararlılıkla durmak.',
    description: 'Zorluklar ve tehlikeler karşısında paniğe kapılmadan, doğruları savunmak ve mazlumun yanında sağlam bir iradeyle durabilmektir.',
    icon: 'Compass',
    color: '#ea580c',
    badgeBg: 'bg-orange-600'
  },
  paylasma: {
    id: 'paylasma',
    name: 'Paylaşma (İnfak)',
    shortDesc: 'Sahip olduğu nimetleri kardeşleriyle gönülden bölüşmek.',
    description: 'Maddi ve manevi imkânlarını, bilgisini ve sevgisini çevresindekilerle cömertçe paylaşarak toplumsal bereketi artırmaktır.',
    icon: 'HelpingHand',
    color: '#ca8a04',
    badgeBg: 'bg-yellow-700'
  },
  kardeslik: {
    id: 'kardeslik',
    name: 'Kardeşlik (Uhuvvet)',
    shortDesc: 'Ensar ve Muhacir ruhuyla birlik, beraberlik ve muhabbet kurmak.',
    description: 'İnsanlar arasında ayrım gözetmeksizin gönül köprüleri kurmak, sevinçte ve tasada bir araya gelerek kenetlenmektir.',
    icon: 'HeartHandshake',
    color: '#06b6d4',
    badgeBg: 'bg-cyan-600'
  },
  dostluk: {
    id: 'dostluk',
    name: 'Dostluk',
    shortDesc: 'Zor zamanlarda yanında olmak, güven vermek ve sırdaş olmak.',
    description: 'Sevgi, güven ve sadakatle birbirine bağlanmak; en zor zamanlarda arkadaşının yanında durmak ve ona destek olmaktır.',
    icon: 'HeartHandshake',
    color: '#0284c7',
    badgeBg: 'bg-sky-700'
  },
  oz_denetim: {
    id: 'oz_denetim',
    name: 'Öz Denetim',
    shortDesc: 'Duygu ve davranışlarını kontrol edebilmek, sabırla hareket etmek.',
    description: 'Öfke, acelecilik ve nefsin isteklerine karşı irade göstermek; kurallara kendi isteğiyle uymak ve doğru olanı seçebilmektir.',
    icon: 'Compass',
    color: '#8b5cf6',
    badgeBg: 'bg-purple-600'
  },
  saygi: {
    id: 'saygi',
    name: 'Saygı',
    shortDesc: 'İnsanların onuruna, farklılıklarına ve haklarına değer vermek.',
    description: 'Büyüklere hürmet, küçüklere şefkat göstermek; başkalarının fikirlerine, inançlarına ve kişisel haklarına özenle yaklaşmaktır.',
    icon: 'Award',
    color: '#db2777',
    badgeBg: 'bg-pink-700'
  },
  sevgi: {
    id: 'sevgi',
    name: 'Sevgi',
    shortDesc: 'Yaratılmış her varlığa şefkat ve merhametle yaklaşmak.',
    description: 'İnsanları, canlıları ve doğayı Allah\'ın bir emaneti olarak sevmek; kalbinde kin ve nefret yerine şefkat ve merhameti büyütmektir.',
    icon: 'Heart',
    color: '#ef4444',
    badgeBg: 'bg-red-600'
  },
  vatanseverlik: {
    id: 'vatanseverlik',
    name: 'Vatanseverlik',
    shortDesc: 'Yaşadığı yurdu korumak, toplumun huzuru ve iyiliği için çalışmak.',
    description: 'Doğup büyüdüğü topraklara sevgiyle bağlanmak, milletinin ve insanlığın barışı, huzuru ve kalkınması için fedakârca çalışmaktır.',
    icon: 'Landmark',
    color: '#e11d48',
    badgeBg: 'bg-rose-700'
  }
};

const CUSTOM_VALUES_STORAGE_KEY = 'dijital_siyer_custom_values_v1';

export function loadCustomValues(): RootValueDefinition[] {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(CUSTOM_VALUES_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return [];
}

export function saveCustomValues(customValues: RootValueDefinition[]): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CUSTOM_VALUES_STORAGE_KEY, JSON.stringify(customValues));
  } catch {
    // ignore
  }
}

export function getAllRootValuesMap(): Record<RootValueId, RootValueDefinition> {
  const merged: Record<RootValueId, RootValueDefinition> = { ...ROOT_VALUES };
  const custom = loadCustomValues();
  custom.forEach(cv => {
    merged[cv.id] = cv;
  });
  return merged;
}

export function getAllRootValuesList(): RootValueDefinition[] {
  return Object.values(getAllRootValuesMap());
}

export const ROOT_VALUES_LIST = Object.values(ROOT_VALUES);

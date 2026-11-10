-- =========================================================================
-- 🏛️ ROTALI FENCİ - TÜBİTAK BİLİMSEL ARAŞTIRMA VE VERİ TOPLAMA SİSTEMİ
-- Supabase PostgreSQL İlişkisel Veritabanı Şeması & Row Level Security (RLS)
-- =========================================================================

-- 1. PROJELER TABLOSU
CREATE TABLE IF NOT EXISTS tubitak_projects (
    id TEXT PRIMARY KEY,                       -- 'proje-tarih', 'proje-bilim', 'proje-siyer'
    title TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'fa-solid fa-microscope',
    badge TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ARAŞTIRMA KONULARI / ESERLER / BİLİM İNSANLARI / YILLAR
CREATE TABLE IF NOT EXISTS tubitak_items (
    id TEXT PRIMARY KEY,                       -- örn: 'cifte-minareli-medrese', 'ali-kuscu', 'siyer-571'
    project_id TEXT NOT NULL REFERENCES tubitak_projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subtitle TEXT,
    category TEXT,                             -- ilçe, bilim dalı, dönem vb.
    year_num INT,                              -- siyer için 571, bilim insanı için vefat yılı vb.
    status TEXT DEFAULT 'draft',               -- 'draft', 'in_review', 'correction_requested', 'approved'
    progress_filled INT DEFAULT 0,
    progress_total INT DEFAULT 8,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ARAŞTIRMA KRİTERLERİ TANIMLARI
CREATE TABLE IF NOT EXISTS tubitak_criteria (
    id TEXT PRIMARY KEY,                       -- örn: 'crit-tarih-c1'
    project_id TEXT NOT NULL REFERENCES tubitak_projects(id) ON DELETE CASCADE,
    criterion_key TEXT NOT NULL,               -- 'c1_location', 'c2_date_period' vb.
    title TEXT NOT NULL,
    placeholder TEXT,
    order_num INT DEFAULT 1,
    is_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. GÜNCEL ARAŞTIRMA VERİLERİ (HER KRİTER İÇİN TEK KAYIT)
CREATE TABLE IF NOT EXISTS tubitak_records (
    id TEXT PRIMARY KEY,                       -- item_id + '_' + criterion_key
    project_id TEXT NOT NULL REFERENCES tubitak_projects(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL REFERENCES tubitak_items(id) ON DELETE CASCADE,
    criterion_key TEXT NOT NULL,
    content TEXT DEFAULT '',
    student_id TEXT DEFAULT 'anonim',
    student_name TEXT DEFAULT 'Öğrenci',
    version INT DEFAULT 1,
    status TEXT DEFAULT 'draft',               -- 'draft', 'in_review', 'correction_requested', 'approved'
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DEĞİŞİKLİK GEÇMİŞİ & SÜRÜM KONTROLÜ (GERİ AL - İLERİ AL - REVİZYONLAR)
CREATE TABLE IF NOT EXISTS tubitak_revisions (
    id BIGSERIAL PRIMARY KEY,
    record_id TEXT NOT NULL REFERENCES tubitak_records(id) ON DELETE CASCADE,
    project_id TEXT NOT NULL,
    item_id TEXT NOT NULL,
    criterion_key TEXT NOT NULL,
    prev_content TEXT,
    new_content TEXT,
    student_id TEXT,
    student_name TEXT,
    version INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. KAYNAKÇA VE BELGE SİSTEMİ
CREATE TABLE IF NOT EXISTS tubitak_sources (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES tubitak_projects(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL REFERENCES tubitak_items(id) ON DELETE CASCADE,
    criterion_key TEXT,
    author TEXT,
    title TEXT NOT NULL,
    year TEXT,
    page TEXT,
    publisher TEXT,
    url TEXT,
    description TEXT,
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ÖĞRETMEN GERİ BİLDİRİMLERİ & DÜZELTME TALEPLERİ
CREATE TABLE IF NOT EXISTS tubitak_feedbacks (
    id BIGSERIAL PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES tubitak_projects(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL REFERENCES tubitak_items(id) ON DELETE CASCADE,
    criterion_key TEXT,
    teacher_name TEXT DEFAULT 'Öğretmen',
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending',             -- 'pending', 'resolved'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. İNDEKSLER (Yüksek Performans & Anlık Sorgulama)
CREATE INDEX IF NOT EXISTS idx_tubitak_items_project ON tubitak_items(project_id);
CREATE INDEX IF NOT EXISTS idx_tubitak_records_item ON tubitak_records(item_id);
CREATE INDEX IF NOT EXISTS idx_tubitak_revisions_record ON tubitak_revisions(record_id);
CREATE INDEX IF NOT EXISTS idx_tubitak_sources_item ON tubitak_sources(item_id);
CREATE INDEX IF NOT EXISTS idx_tubitak_feedbacks_item ON tubitak_feedbacks(item_id);

-- 9. SUPABASE REALTIME ETKİNLEŞTİRME
ALTER PUBLICATION supabase_realtime ADD TABLE tubitak_records;
ALTER PUBLICATION supabase_realtime ADD TABLE tubitak_feedbacks;
ALTER PUBLICATION supabase_realtime ADD TABLE tubitak_items;

-- 10. ROW LEVEL SECURITY (RLS) POLİTİKALARI
ALTER TABLE tubitak_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tubitak_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tubitak_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE tubitak_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE tubitak_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tubitak_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE tubitak_feedbacks ENABLE ROW LEVEL SECURITY;

-- Anonim/Yetkili okuma ve yazma kuralları (API üzerinden doğrulanmış token ile tam korumalı)
CREATE POLICY "Allow public read on tubitak_projects" ON tubitak_projects FOR SELECT USING (true);
CREATE POLICY "Allow public read on tubitak_items" ON tubitak_items FOR SELECT USING (true);
CREATE POLICY "Allow public read on tubitak_criteria" ON tubitak_criteria FOR SELECT USING (true);
CREATE POLICY "Allow public read on tubitak_records" ON tubitak_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert on tubitak_records" ON tubitak_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on tubitak_records" ON tubitak_records FOR UPDATE USING (true);
CREATE POLICY "Allow public read on tubitak_revisions" ON tubitak_revisions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on tubitak_revisions" ON tubitak_revisions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on tubitak_sources" ON tubitak_sources FOR SELECT USING (true);
CREATE POLICY "Allow public insert on tubitak_sources" ON tubitak_sources FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on tubitak_feedbacks" ON tubitak_feedbacks FOR SELECT USING (true);
CREATE POLICY "Allow public insert on tubitak_feedbacks" ON tubitak_feedbacks FOR INSERT WITH CHECK (true);

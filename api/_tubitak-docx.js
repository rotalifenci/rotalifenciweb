const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    convertMillimetersToTwip,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    ShadingType,
    HeadingLevel
} = require('docx');
const JSZip = require('jszip');

/**
 * Rotalı Fenci - TÜBİTAK Proje 1 Gerçek Word (.docx) ve Toplu ZIP Üreticisi
 * Yalnızca veritabanında kayıtlı araştırma metinlerini kriter başlıkları olmadan aktarır.
 */

function sanitizeDocxFilename(title) {
    const cleaned = String(title || 'Tarihi_Eser')
        .replace(/[<>:"/\\|?*\x00-\x1f]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    return `${cleaned || 'Tarihi_Eser'}.docx`;
}

function buildAsciiFallbackFilename(utf8Name) {
    return String(utf8Name || 'belge.docx')
        .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
        .replace(/ü/g, 'u').replace(/Ü/g, 'U')
        .replace(/ş/g, 's').replace(/Ş/g, 'S')
        .replace(/ı/g, 'i').replace(/İ/g, 'I')
        .replace(/ö/g, 'o').replace(/Ö/g, 'O')
        .replace(/ç/g, 'c').replace(/Ç/g, 'C')
        .replace(/[^\x20-\x7E]/g, '')
        .replace(/\s+/g, '_') || 'belge.docx';
}

function extractMonumentTextParagraphs(item, criteriaList, recordsMap) {
    const paragraphs = [];
    if (!item || !Array.isArray(criteriaList)) return paragraphs;

    for (const crit of criteriaList) {
        const recordKey = `${item.id}__${crit.key}`;
        const saved = recordsMap && recordsMap[recordKey];
        const rawText = saved && typeof saved.content === 'string'
            ? saved.content
            : (item.criteria && typeof item.criteria[crit.key] === 'string' ? item.criteria[crit.key] : '');

        if (!rawText || !rawText.trim()) continue;

        const lines = rawText.replace(/\r\n/g, '\n').split('\n');
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;
            paragraphs.push(trimmedLine);
        }
    }

    return paragraphs;
}

async function buildPlainTextDocxBuffer(textParagraphs) {
    const marginTwips = convertMillimetersToTwip(25); // 2.5 cm

    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: 'Times New Roman',
                        size: 24 // 12 pt (half-points)
                    },
                    paragraph: {
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: {
                            line: 360, // 1.5 satır aralığı (240 = tek)
                            after: 120 // 6 pt paragraf sonrası boşluk (20 twips = 1 pt)
                        }
                    }
                }
            }
        },
        sections: [
            {
                properties: {
                    page: {
                        size: {
                            width: convertMillimetersToTwip(210), // A4 genişlik
                            height: convertMillimetersToTwip(297) // A4 yükseklik
                        },
                        margin: {
                            top: marginTwips,
                            right: marginTwips,
                            bottom: marginTwips,
                            left: marginTwips
                        }
                    }
                },
                children: textParagraphs.map((text) => new Paragraph({
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: {
                        line: 360,
                        after: 120
                    },
                    children: [
                        new TextRun({
                            text,
                            font: 'Times New Roman',
                            size: 24
                        })
                    ]
                }))
            }
        ]
    });

    return Packer.toBuffer(doc);
}

async function generateMonumentDocxBuffer(item, criteriaList, recordsMap) {
    const textParagraphs = extractMonumentTextParagraphs(item, criteriaList, recordsMap);
    if (textParagraphs.length === 0) {
        return null;
    }

    const buffer = await buildPlainTextDocxBuffer(textParagraphs);
    return {
        buffer,
        filename: sanitizeDocxFilename(item.title),
        paragraphCount: textParagraphs.length
    };
}

async function generateSiyerYearDocxBuffer(yearItem, eventIds, criteriaList, recordsMap) {
    const orderedEvents = Array.isArray(eventIds) && eventIds.length > 0
        ? eventIds
        : [yearItem.id];

    const allParagraphs = [];
    let nonEmptyEvents = 0;

    for (const evId of orderedEvents) {
        const evParagraphs = extractMonumentTextParagraphs({ id: evId, criteria: yearItem.criteria || {} }, criteriaList, recordsMap);
        if (evParagraphs.length === 0) continue;
        if (nonEmptyEvents > 0) {
            allParagraphs.push('');
        }
        allParagraphs.push(...evParagraphs);
        nonEmptyEvents++;
    }

    if (allParagraphs.length === 0) {
        return null;
    }

    const buffer = await buildPlainTextDocxBuffer(allParagraphs);
    const yearLabel = String(yearItem.year || yearItem.id).replace(/^siyer-/, '');
    return {
        buffer,
        filename: sanitizeDocxFilename(yearLabel),
        paragraphCount: allParagraphs.length,
        eventCount: nonEmptyEvents
    };
}

async function generateAllMonumentsZipBuffer(items, criteriaList, recordsMap, zipFilename) {
    const zip = new JSZip();
    const included = [];
    const skipped = [];
    const usedNames = new Set();

    for (const item of items || []) {
        const result = await generateMonumentDocxBuffer(item, criteriaList, recordsMap);
        if (!result) {
            skipped.push(item.title || item.id);
            continue;
        }
        let uniqueName = result.filename;
        if (usedNames.has(uniqueName)) {
            const base = uniqueName.replace(/\.docx$/i, '');
            uniqueName = `${base}_${item.orderIndex || included.length + 1}.docx`;
        }
        usedNames.add(uniqueName);
        zip.file(uniqueName, result.buffer);
        included.push(uniqueName);
    }

    if (included.length === 0) {
        return {
            buffer: null,
            included,
            skipped
        };
    }

    const zipBuffer = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
    });

    return {
        buffer: zipBuffer,
        filename: zipFilename || 'Sivas_Tarihi_Eserler_Arastirma_Metinleri.zip',
        included,
        skipped
    };
}

async function generateAllSiyerYearsZipBuffer(items, siyerEventsMeta, criteriaList, recordsMap, zipFilename) {
    const zip = new JSZip();
    const included = [];
    const skipped = [];
    const usedNames = new Set();
    const eventsMeta = siyerEventsMeta && typeof siyerEventsMeta === 'object' ? siyerEventsMeta : {};

    for (const item of items || []) {
        const extraIds = Array.isArray(eventsMeta[item.id]) ? eventsMeta[item.id] : [];
        const eventIds = [item.id, ...extraIds.filter((id) => id && id !== item.id)];
        const result = await generateSiyerYearDocxBuffer(item, eventIds, criteriaList, recordsMap);
        if (!result) {
            skipped.push(String(item.year || item.title || item.id));
            continue;
        }
        let uniqueName = result.filename;
        if (usedNames.has(uniqueName)) {
            const base = uniqueName.replace(/\.docx$/i, '');
            uniqueName = `${base}_${item.orderIndex || included.length + 1}.docx`;
        }
        usedNames.add(uniqueName);
        zip.file(uniqueName, result.buffer);
        included.push(uniqueName);
    }

    if (included.length === 0) {
        return {
            buffer: null,
            included,
            skipped
        };
    }

    const zipBuffer = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
    });

    return {
        buffer: zipBuffer,
        filename: zipFilename || 'Siyer_571_632_Arastirma_Metinleri.zip',
        included,
        skipped
    };
}

/**
 * Karşılaştırmalı Tarih ve Kanıt Analizi Raporu (.docx) Üreticisi
 */
async function generateComparisonDocxBuffer(comparison, monumentsClassification) {
    if (!comparison) return null;

    const marginTwips = convertMillimetersToTwip(20); // 2 cm
    const monIds = Array.isArray(comparison.monumentIds) ? comparison.monumentIds : [];
    const monNames = monIds.map(id => {
        const found = monumentsClassification && monumentsClassification[id];
        return found ? found.name : id;
    });

    const docChildren = [];

    // Başlık ve Kurum Bilgisi
    docChildren.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 80 },
            children: [
                new TextRun({
                    text: "T.C. MİLLÎ EĞİTİM BAKANLIĞI / TÜBİTAK 2204-B ORTAOKUL ÖĞRENCİLERİ ARAŞTIRMA PROJELERİ",
                    bold: true,
                    size: 20, // 10 pt
                    font: 'Times New Roman',
                    color: '475569'
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 120 },
            children: [
                new TextRun({
                    text: "SİVAS TARİH VE KÜLTÜREL MİRASI KARŞILAŞTIRMALI TARİH VE KANIT ANALİZİ RAPORU",
                    bold: true,
                    size: 28, // 14 pt
                    font: 'Times New Roman',
                    color: '0F172A'
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 240 },
            children: [
                new TextRun({
                    text: `Karşılaştırılan Eserler: ${monNames.join(' — ')}`,
                    bold: true,
                    italics: true,
                    size: 24, // 12 pt
                    font: 'Times New Roman',
                    color: '2563EB'
                })
            ]
        })
    );

    // Meta Bilgi Tablosu
    const metaTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        shading: { fill: "F8FAFC", type: ShadingType.CLEAR },
                        children: [new Paragraph({ children: [new TextRun({ text: "Araştırmacı Öğrenci:", bold: true, size: 20, font: 'Times New Roman' }), new TextRun({ text: ` ${comparison.studentName || 'Belirtilmedi'}`, size: 20, font: 'Times New Roman' })] })]
                    }),
                    new TableCell({
                        shading: { fill: "F8FAFC", type: ShadingType.CLEAR },
                        children: [new Paragraph({ children: [new TextRun({ text: "Yapı Grubu:", bold: true, size: 20, font: 'Times New Roman' }), new TextRun({ text: ` ${comparison.groupTitle || 'Tarihî Yapılar'}`, size: 20, font: 'Times New Roman' })] })]
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        shading: { fill: "F8FAFC", type: ShadingType.CLEAR },
                        children: [new Paragraph({ children: [new TextRun({ text: "Rapor Tarihi:", bold: true, size: 20, font: 'Times New Roman' }), new TextRun({ text: ` ${new Date(comparison.updatedAt || Date.now()).toLocaleDateString('tr-TR')}`, size: 20, font: 'Times New Roman' })] })]
                    }),
                    new TableCell({
                        shading: { fill: "F8FAFC", type: ShadingType.CLEAR },
                        children: [new Paragraph({ children: [new TextRun({ text: "İnceleme Durumu:", bold: true, size: 20, font: 'Times New Roman' }), new TextRun({ text: ` ${comparison.status === 'approved' ? 'Onaylandı' : (comparison.status === 'submitted' ? 'İncelemede' : (comparison.status === 'revision_requested' ? 'Düzeltme İstendi' : 'Taslak'))}`, size: 20, font: 'Times New Roman' })] })]
                    })
                ]
            })
        ]
    });
    docChildren.push(metaTable);
    docChildren.push(new Paragraph({ spacing: { after: 200 }, children: [] }));

    function addAcademicSection(title, contentText, emptyFallback = "Veri girilmedi.") {
        docChildren.push(
            new Paragraph({
                spacing: { before: 240, after: 100 },
                children: [
                    new TextRun({
                        text: title,
                        bold: true,
                        size: 24, // 12 pt
                        font: 'Times New Roman',
                        color: '1E293B'
                    })
                ]
            })
        );
        const text = (contentText && contentText.trim()) ? contentText.trim() : emptyFallback;
        const paragraphs = text.split(/\r?\n/).filter(p => p.trim());
        if (paragraphs.length === 0) {
            docChildren.push(
                new Paragraph({
                    spacing: { after: 120 },
                    children: [new TextRun({ text: emptyFallback, italics: true, color: '64748B', size: 22, font: 'Times New Roman' })]
                })
            );
        } else {
            paragraphs.forEach(p => {
                docChildren.push(
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { line: 300, after: 100 },
                        children: [new TextRun({ text: p, size: 22, font: 'Times New Roman' })]
                    })
                );
            });
        }
    }

    // BÖLÜM 1: KARŞILAŞTIRMA ARAŞTIRMA SORUSU
    addAcademicSection("1. KARŞILAŞTIRMA ARAŞTIRMA SORUSU", comparison.question, "Karşılaştırma sorusu henüz belirlenmedi.");

    // BÖLÜM 2: 10 ÖLÇÜTLÜ KARŞILAŞTIRMA TABLOSU
    docChildren.push(
        new Paragraph({
            spacing: { before: 240, after: 100 },
            children: [
                new TextRun({
                    text: "2. KARŞILAŞTIRMALI TARİHSEL ÖZELLİKLER TABLOSU (10 ÖLÇÜT)",
                    bold: true,
                    size: 24,
                    font: 'Times New Roman',
                    color: '1E293B'
                })
            ]
        })
    );

    const criteriaDefs = [
        { id: "c_eser_adi", title: "1. Eser Adı" },
        { id: "c_yapim_tarihi", title: "2. Yapım Tarihi" },
        { id: "c_tarihsel_donem", title: "3. Tarihsel Dönem" },
        { id: "c_ilk_amac", title: "4. İlk Yapılış Amacı" },
        { id: "c_bani", title: "5. Banisi" },
        { id: "c_mimari_plan", title: "6. Mimari Plan" },
        { id: "c_yapi_malzemesi", title: "7. Yapı Malzemesi" },
        { id: "c_susleme_kitabe", title: "8. Süsleme ve Kitabe Özellikleri" },
        { id: "c_tarihsel_degisiklikler", title: "9. Tarihsel Değişiklikler" },
        { id: "c_gunumuz_durumu", title: "10. Günümüzdeki Kullanım ve Korunma" }
    ];

    const tableRows = [];

    // Header Row
    const headerCells = [
        new TableCell({
            width: { size: 28, type: WidthType.PERCENTAGE },
            shading: { fill: "E2E8F0", type: ShadingType.CLEAR },
            children: [new Paragraph({ children: [new TextRun({ text: "Karşılaştırma Ölçütü", bold: true, size: 20, font: 'Times New Roman' })] })]
        })
    ];
    const colWidth = Math.floor(72 / Math.max(1, monNames.length));
    monNames.forEach(name => {
        headerCells.push(
            new TableCell({
                width: { size: colWidth, type: WidthType.PERCENTAGE },
                shading: { fill: "E2E8F0", type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: name, bold: true, size: 20, font: 'Times New Roman' })] })]
            })
        );
    });
    tableRows.push(new TableRow({ children: headerCells }));

    // Data Rows
    criteriaDefs.forEach(crit => {
        const rowCells = [
            new TableCell({
                width: { size: 28, type: WidthType.PERCENTAGE },
                shading: { fill: "F1F5F9", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: crit.title, bold: true, size: 18, font: 'Times New Roman' })] })]
            })
        ];

        monIds.forEach(id => {
            const tableVal = comparison.tableData && comparison.tableData[crit.id] && comparison.tableData[crit.id][id];
            let cellText = (tableVal && typeof tableVal === 'string' && tableVal.trim()) ? tableVal.trim() : null;

            if (!cellText) {
                // Fallback from classification metadata
                const meta = monumentsClassification && monumentsClassification[id];
                if (meta) {
                    if (crit.id === 'c_eser_adi') cellText = meta.name;
                    else if (crit.id === 'c_yapim_tarihi') cellText = meta.buildYear;
                    else if (crit.id === 'c_tarihsel_donem') cellText = meta.period;
                    else if (crit.id === 'c_ilk_amac') cellText = meta.initialPurpose;
                    else if (crit.id === 'c_bani') cellText = meta.builder;
                    else if (crit.id === 'c_mimari_plan') cellText = meta.planType;
                    else if (crit.id === 'c_yapi_malzemesi') cellText = meta.materials;
                    else if (crit.id === 'c_susleme_kitabe') cellText = meta.ornamentKitabe;
                    else if (crit.id === 'c_tarihsel_degisiklikler') cellText = meta.changes;
                    else if (crit.id === 'c_gunumuz_durumu') cellText = `${meta.currentUse} (${meta.preservationStatus})`;
                }
            }

            rowCells.push(
                new TableCell({
                    width: { size: colWidth, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: cellText || "Veri girilmedi", italics: !cellText, color: cellText ? '0F172A' : '64748B', size: 18, font: 'Times New Roman' })] })]
                })
            );
        });

        tableRows.push(new TableRow({ children: rowCells }));
    });

    docChildren.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: tableRows }));
    docChildren.push(new Paragraph({ spacing: { after: 160 }, children: [] }));

    // BÖLÜM 3: BENZERLİKLER
    addAcademicSection("3. BENZERLİKLER ANALİZİ", comparison.similarities, "Seçilen eserler arasındaki ortak ve benzer yönler henüz girilmedi.");

    // BÖLÜM 4: FARKLILIKLAR
    addAcademicSection("4. FARKLILIKLAR ANALİZİ", comparison.differences, "Seçilen eserler arasındaki mimari, dönemsel ve işlevsel farklılıklar henüz girilmedi.");

    // BÖLÜM 5: TARİHSEL DEĞİŞİM VE SÜREKLİLİK
    addAcademicSection("5. TARİHSEL DEĞİŞİM VE SÜREKLİLİK", comparison.continuity, "Tarihsel süreçte süregelen gelenekler ve değişen mimari/toplumsal özellikler henüz girilmedi.");

    // BÖLÜM 6: TARİHSEL KANITLAR VE YORUMLAR
    addAcademicSection("6. TARİHSEL KANITLAR VE YORUMLAR", comparison.evidenceAnalysis, "Doğrudan kaynakta bulunan bilgi ile öğrencinin tarihsel yorumları henüz girilmedi.");

    // BÖLÜM 7: KARŞILAŞTIRMA SONUCU
    addAcademicSection("7. KARŞILAŞTIRMA SONUCU VE TARİHSEL ÇIKARIM", comparison.conclusion, "Araştırma sorusuna dayalı karşılaştırma sonucu henüz yazılmadı.");

    // BÖLÜM 8: BİLİMSEL KAYNAKÇA VE KANIT LİSTESİ
    docChildren.push(
        new Paragraph({
            spacing: { before: 240, after: 100 },
            children: [
                new TextRun({
                    text: "8. BİLİMSEL KAYNAKÇA VE KANIT LİSTESİ",
                    bold: true,
                    size: 24,
                    font: 'Times New Roman',
                    color: '1E293B'
                })
            ]
        })
    );

    const evidences = Array.isArray(comparison.evidences) ? comparison.evidences : [];
    if (evidences.length === 0) {
        docChildren.push(
            new Paragraph({
                spacing: { after: 120 },
                children: [new TextRun({ text: "Doğrudan kanıt veya kaynak kaydı henüz eklenmedi.", italics: true, color: '64748B', size: 20, font: 'Times New Roman' })]
            })
        );
    } else {
        const evidenceRows = [
            new TableRow({
                children: [
                    new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, shading: { fill: "E2E8F0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Kanıt Niteliği / Türü", bold: true, size: 18, font: 'Times New Roman' })] })] }),
                    new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, shading: { fill: "E2E8F0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Yazar / Eser Adı", bold: true, size: 18, font: 'Times New Roman' })] })] }),
                    new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, shading: { fill: "E2E8F0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Yıl / Sayfa", bold: true, size: 18, font: 'Times New Roman' })] })] }),
                    new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, shading: { fill: "E2E8F0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Açıklama / Kanıt İlişkisi", bold: true, size: 18, font: 'Times New Roman' })] })] })
                ]
            })
        ];

        evidences.forEach(ev => {
            const isPrim = ev.isPrimary ? "Birincil Tarihî Kanıt" : "İkincil Araştırma";
            const kindText = `${isPrim}\n(${ev.type || 'Kaynak'})`;
            const citeText = `${ev.author ? ev.author + ' — ' : ''}${ev.title || 'Başlıksız Kaynak'}`;
            const detailText = `${ev.year || '-'}${ev.page ? ' / s. ' + ev.page : ''}`;

            evidenceRows.push(
                new TableRow({
                    children: [
                        new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: kindText, bold: !!ev.isPrimary, color: ev.isPrimary ? '166534' : '334155', size: 16, font: 'Times New Roman' })] })] }),
                        new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: citeText, size: 16, font: 'Times New Roman' })] })] }),
                        new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: detailText, size: 16, font: 'Times New Roman' })] })] }),
                        new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: ev.desc || ev.url || '-', size: 16, font: 'Times New Roman' })] })] })
                    ]
                })
            );
        });

        docChildren.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: evidenceRows }));
        docChildren.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
    }

    // BÖLÜM 9: ÖĞRETMEN DEĞERLENDİRME RUBRİĞİ
    docChildren.push(
        new Paragraph({
            spacing: { before: 240, after: 100 },
            children: [
                new TextRun({
                    text: "9. AKADEMİK DEĞERLENDİRME RUBRİĞİ VE DANIŞMAN GERİ BİLDİRİMİ",
                    bold: true,
                    size: 24,
                    font: 'Times New Roman',
                    color: '1E293B'
                })
            ]
        })
    );

    const rubric = comparison.rubric || {};
    const rubricRows = [
        new TableRow({
            children: [
                new TableCell({ width: { size: 60, type: WidthType.PERCENTAGE }, shading: { fill: "E2E8F0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Değerlendirme Boyutu", bold: true, size: 18, font: 'Times New Roman' })] })] }),
                new TableCell({ width: { size: 40, type: WidthType.PERCENTAGE }, shading: { fill: "E2E8F0", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Puan (1-4 Ölçeği)", bold: true, size: 18, font: 'Times New Roman' })] })] })
            ]
        }),
        new TableRow({
            children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "1. Tarihsel Bilgilerin Doğruluğu", size: 18, font: 'Times New Roman' })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${rubric.dim1_accuracy || '-'} / 4`, bold: true, size: 18, font: 'Times New Roman' })] })] })
            ]
        }),
        new TableRow({
            children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "2. Kaynak ve Tarihsel Kanıt Kullanma", size: 18, font: 'Times New Roman' })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${rubric.dim2_evidence || '-'} / 4`, bold: true, size: 18, font: 'Times New Roman' })] })] })
            ]
        }),
        new TableRow({
            children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "3. Benzerlik ve Farklılıkları Belirleme", size: 18, font: 'Times New Roman' })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${rubric.dim3_comparison || '-'} / 4`, bold: true, size: 18, font: 'Times New Roman' })] })] })
            ]
        }),
        new TableRow({
            children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "4. Değişim ve Sürekliliği Açıklama", size: 18, font: 'Times New Roman' })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${rubric.dim4_continuity || '-'} / 4`, bold: true, size: 18, font: 'Times New Roman' })] })] })
            ]
        }),
        new TableRow({
            children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "5. Kanıta Dayalı Sonuç Oluşturma", size: 18, font: 'Times New Roman' })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${rubric.dim5_conclusion || '-'} / 4`, bold: true, size: 18, font: 'Times New Roman' })] })] })
            ]
        }),
        new TableRow({
            children: [
                new TableCell({ shading: { fill: "F1F5F9", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "TOPLAM PUAN", bold: true, size: 20, font: 'Times New Roman' })] })] }),
                new TableCell({ shading: { fill: "F1F5F9", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${rubric.total || (Number(rubric.dim1_accuracy||0) + Number(rubric.dim2_evidence||0) + Number(rubric.dim3_comparison||0) + Number(rubric.dim4_continuity||0) + Number(rubric.dim5_conclusion||0)) || '-'} / 20`, bold: true, size: 20, color: '2563EB', font: 'Times New Roman' })] })] })
            ]
        })
    ];
    docChildren.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: rubricRows }));

    if (rubric.feedback && rubric.feedback.trim()) {
        docChildren.push(
            new Paragraph({
                spacing: { before: 140, after: 60 },
                children: [new TextRun({ text: "Öğretmen / Danışman Değerlendirme Notu:", bold: true, size: 20, font: 'Times New Roman' })]
            }),
            new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: { line: 280, after: 120 },
                children: [new TextRun({ text: rubric.feedback.trim(), italics: true, color: '1E293B', size: 20, font: 'Times New Roman' })]
            })
        );
    }

    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: { font: 'Times New Roman', size: 24 }
                }
            }
        },
        sections: [
            {
                properties: {
                    page: {
                        size: {
                            width: convertMillimetersToTwip(210),
                            height: convertMillimetersToTwip(297)
                        },
                        margin: {
                            top: marginTwips,
                            right: marginTwips,
                            bottom: marginTwips,
                            left: marginTwips
                        }
                    }
                },
                children: docChildren
            }
        ]
    });

    const buffer = await Packer.toBuffer(doc);
    const safeTitle = sanitizeDocxFilename(`Karsilastirma_${comparison.groupTitle || 'Tarih'}_${monNames.slice(0, 2).join('_vs_')}`);

    return {
        buffer,
        filename: safeTitle,
        paragraphCount: docChildren.length
    };
}

module.exports = {
    sanitizeDocxFilename,
    buildAsciiFallbackFilename,
    extractMonumentTextParagraphs,
    generateMonumentDocxBuffer,
    generateAllMonumentsZipBuffer,
    generateSiyerYearDocxBuffer,
    generateAllSiyerYearsZipBuffer,
    generateComparisonDocxBuffer
};

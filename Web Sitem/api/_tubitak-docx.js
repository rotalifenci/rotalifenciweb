const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    convertMillimetersToTwip
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

async function generateMonumentDocxBuffer(item, criteriaList, recordsMap) {
    const textParagraphs = extractMonumentTextParagraphs(item, criteriaList, recordsMap);
    if (textParagraphs.length === 0) {
        return null;
    }

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

    const buffer = await Packer.toBuffer(doc);
    return {
        buffer,
        filename: sanitizeDocxFilename(item.title),
        paragraphCount: textParagraphs.length
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

module.exports = {
    sanitizeDocxFilename,
    buildAsciiFallbackFilename,
    extractMonumentTextParagraphs,
    generateMonumentDocxBuffer,
    generateAllMonumentsZipBuffer
};

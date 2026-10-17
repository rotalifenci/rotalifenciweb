import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update isHtmlPresentation in openOrDownloadMaterial
old_html_block = """    // 🚀 1.8 🌟 İNTERAKTİF HTML5 AKILLI TAHTA SUNUMLARI (3D Sinematik Sunum)
    const isHtmlPresentation = (checkFile.endsWith(".html") || (targetUrl && targetUrl.includes(".html")) || checkFormat.includes("İNTERAKTİF SUNUM") || checkFormat.includes("HTML SUNUM"));
    if (isHtmlPresentation && targetUrl && targetUrl !== "#") {
        const fullUrl = targetUrl.startsWith("http") ? targetUrl : new URL(targetUrl, window.location.origin + window.location.pathname.replace(/\\/[^/]*$/, "/")).href;
        const win = window.open(fullUrl, '_blank');
        if (!win || win.closed || typeof win.closed === 'undefined') {
            window.location.href = fullUrl;
        }
        return;
    }"""

new_html_block = """    // 🚀 1.8 🌟 İNTERAKTİF HTML5 AKILLI TAHTA SUNUMLARI (3D Sinematik Sunum)
    const isHtmlPresentation = (checkFile.endsWith(".html") || (targetUrl && targetUrl.includes(".html")) || checkFormat.includes("İNTERAKTİF SUNUM") || checkFormat.includes("HTML SUNUM"));
    if (isHtmlPresentation && targetUrl && targetUrl !== "#") {
        const fullUrl = targetUrl.startsWith("http") ? targetUrl : new URL(targetUrl, window.location.origin + window.location.pathname.replace(/\\/[^/]*$/, "/")).href;
        await openFullScreenPresentationModal({
            id: (found && found.id) || id,
            title: (found && found.title) || title || "Akıllı Tahta 3D Ders Sunumu",
            fileName: (found && found.fileName) || fileName || "sunum.html",
            fileUrl: fullUrl,
            format: "İNTERAKTİF SUNUM",
            unit: (found && found.unit) || "",
            grade: gradeStr,
            cover: coverUrl,
            isHtmlEmbed: true
        });
        return;
    }"""

if old_html_block in content:
    content = content.replace(old_html_block, new_html_block)
    print("SUCCESS: Updated isHtmlPresentation in openOrDownloadMaterial!")
else:
    print("WARNING: Could not find exact old_html_block, let's search via regex")

# Let's check openFullScreenPresentationModal and renderFullScreenPresentationModal
print("Content length:", len(content))

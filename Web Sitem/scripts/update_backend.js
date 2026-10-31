const fs = require('fs');

function updateFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  const startMarker = 'let typeSpecificInstructions = "";';
  const endMarker = 'const sourceInstructionBlock =';

  const startIdx = code.indexOf(startMarker);
  const endIdx = code.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    console.error('Markers not found in', filePath);
    return;
  }

  const newInstructions = `let typeSpecificInstructions = "";
    if (question_type === "short_answer") {
      typeSpecificInstructions = \`SORU TÜRÜ: KISA CEVAPLI / BOŞLUK DOLDURMA
- Sorular tek kelimelik veya kısa ifadelerle net cevaplanabilecek şekilde kurgulanmalıdır.
- Soru kökünde öğrencinin boşluğu doldurması veya kısa cevabı yazması istenir.
- Kısa cevaplı sorularda gereksiz şekil veya daire üretme; sadece bilimsel olarak gerekli ise sade bir SVG şema üret.
- "options" alanını {} yap.
- "type" alanına "short_answer" yaz.
- "correct_answer" alanına beklenen net kısa cevabı yaz.\`;
    } else if (question_type === "open_ended") {
      typeSpecificInstructions = \`SORU TÜRÜ: AÇIK UÇLU (KLASİK / SÜREÇ VE DENEY ANALİZİ)
- Öğrencinin neden-sonuç ilişkisini, deney düzeneğini veya bilimsel gerekçeyi açıklamasını isteyen derinlikli sorular yaz.
- "options" alanını {} yap.
- "type" alanına "open_ended" yaz.
- "correct_answer" veya "explanation" alanına model çözümü ve puanlama kriterini yaz.\`;
    } else if (question_type === "concept_map") {
      typeSpecificInstructions = \`SORU TÜRÜ: KAVRAM HARİTASI (EKSİK KAVRAMLARI BULMA)
- Konuyla ilgili hiyerarşik veya ilişkisel bir kavram haritası şeması kurgula.
- Kavram haritasında bazı kutular veya bağlantılar '?' (veya I, II, III gibi numaralarla) eksik bırakılsın.
- "visual_svg" alanına mutlaka temiz, beyaz zeminli (#ffffff), şık kutucuklar ve yönlendirici oklar içeren bir SVG kavram haritası şeması üret. Eksik kutulara '?' veya 'I', 'II' yaz.
- "type" alanına "concept_map" yaz.
- Soru kökünde öğrenciye kavram haritasında numaralandırılmış eksik kutulara hangi kavramların gelmesi gerektiğini sor.
- Çoktan seçmeli seçenekler (A, B, C, D) sun veya net kısa cevap olarak belirt. "correct_answer" alanına eksik kavramları sırasıyla yaz.\`;
    } else {
      typeSpecificInstructions = \`SORU TÜRÜ: ÇOKTAN SEÇMELİ (4 SEÇENEKLİ LGS / MEB)
- Her soruda mutlaka "options" altında A, B, C, D seçenekleri ve tek net "correct_answer" bulunmalıdır.
- Soru kökünde 'değildir', 'olamaz', 'kesinlikle' gibi ifadeler kullanılabilir.
- "type" alanına "multiple_choice" yaz.\`;
    }

    `;

  code = code.substring(0, startIdx) + newInstructions + code.substring(endIdx);
  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Successfully updated:', filePath);
}

updateFile('api/generate-questions.js');
updateFile('../api/generate-questions.js');

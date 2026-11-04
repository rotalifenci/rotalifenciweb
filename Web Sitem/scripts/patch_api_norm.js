const fs = require('fs');

['api/generate-questions.js', '../api/generate-questions.js'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // Replace normalized questions return object
  const oldReturnBlock = `      return {
        id: q.id || idx + 1,
        type: q.type || question_type || "multiple_choice",
        visual_svg: enhanceCelestialVisual(q.visual_svg || "", questionText, opts, correct),
        grid_items: Array.isArray(q.grid_items) ? q.grid_items.map(cleanTurkishAndLatex) : [],
        question: questionText,
        options: opts,
        correct_answer: correct,
        learning_outcome: q.learning_outcome || outcomesList[0] || "Kaynak Belge Kazanımı",
        difficulty: q.difficulty || difficulty,
        explanation: cleanTurkishAndLatex(q.explanation || "")
      };`;

  const newReturnBlock = `      const isAct = (q.type === 'activity' || question_type === 'activity');
      const actType = q.activity_type || (isAct ? ((activity_types[idx % (activity_types.length || 1)] || {}).type || 'matching') : null);

      return {
        id: q.id || idx + 1,
        type: isAct ? 'activity' : (q.type || question_type || "multiple_choice"),
        activity_type: actType,
        activity_title: cleanTurkishAndLatex(q.activity_title || (isAct ? \`Etkinlik \${idx + 1}\` : "")),
        instruction: cleanTurkishAndLatex(q.instruction || ""),
        activity_data: q.activity_data || null,
        visual_svg: enhanceCelestialVisual(q.visual_svg || "", questionText, opts, correct),
        grid_items: Array.isArray(q.grid_items) ? q.grid_items.map(cleanTurkishAndLatex) : [],
        question: questionText,
        options: opts,
        correct_answer: correct,
        learning_outcome: q.learning_outcome || outcomesList[0] || "Kaynak Belge Kazanımı",
        difficulty: q.difficulty || difficulty,
        explanation: cleanTurkishAndLatex(q.explanation || "")
      };`;

  const hasCRLF = code.includes('\r\n');
  const target = hasCRLF ? oldReturnBlock.replace(/\n/g, '\r\n') : oldReturnBlock;
  const rep = hasCRLF ? newReturnBlock.replace(/\n/g, '\r\n') : newReturnBlock;

  if (code.includes(target)) {
    code = code.replace(target, rep);
    fs.writeFileSync(filePath, code, 'utf8');
    console.log('Successfully injected activity fields into normalizedQuestions in:', filePath);
  } else {
    console.log('Return block NOT matched in:', filePath);
  }
});

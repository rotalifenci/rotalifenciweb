const fs = require('fs');

function fixReqBody(filePath) {
  let raw = fs.readFileSync(filePath, 'utf8');
  const isCrlf = raw.includes('\r\n');
  let code = raw.replace(/\r\n/g, '\n');

  const oldDestruct = `    const {
      questions,
      grade = "5",
      unit = "1. Ünite",
      targetSection = "1",
      category = "soru-bankasi",
      title = "",
      desc = "",
      subject = "Fen Bilimleri"
    } = req.body || {};`;

  const newDestruct = `    const {
      questions,
      grade = "5",
      unit = "1. Ünite",
      targetSection = "1",
      category = "soru-bankasi",
      title = "",
      desc = "",
      subject = "Fen Bilimleri",
      topic = "",
      subtopic = "",
      isAllOutcomes = false,
      learning_outcome = "",
      question_type = ""
    } = req.body || {};`;

  if (code.includes(oldDestruct)) {
    code = code.replace(oldDestruct, newDestruct);
    if (isCrlf) code = code.replace(/\n/g, '\r\n');
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`Successfully fixed destruct in ${filePath}`);
  } else {
    console.log(`oldDestruct not matched in ${filePath}`);
  }
}

fixReqBody('api/publish-test.js');
fixReqBody('../api/publish-test.js');

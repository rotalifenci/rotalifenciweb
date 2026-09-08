require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.6-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.3
    }
  });

  const prompt = `MEB 5. Sınıf Fen Bilimleri "Ay'ın dönme ve dolanma hareketlerini ile ana/ara evrelerini model üzerinde gösterir." çıktısına uygun 2 adet soru hazırla.
Format:
[
  {
    "id": 1,
    "question": "...",
    "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
    "correct_answer": "A",
    "learning_outcome": "Ay'ın dönme ve dolanma hareketlerini ile ana/ara evrelerini model üzerinde gösterir.",
    "difficulty": "Orta",
    "explanation": "..."
  }
]`;

  try {
    const res = await model.generateContent(prompt);
    const data = JSON.parse(res.response.text());
    console.log("SUCCESS! Generated", data.length, "questions:");
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("FAIL:", err);
  }
}

test();

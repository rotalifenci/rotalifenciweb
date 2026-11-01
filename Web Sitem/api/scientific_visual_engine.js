/**
 * Rotalı Fenci - Bilimsel & Gerçekçi Soru Görsel Motoru
 * MEB ve Türkiye Yüzyılı Maarif Modeli Standartlarına Tam Uyumlu
 * (visual_match_engine.js ile tam entegre çalışır)
 */

const {
  normalizeText,
  hasWord,
  makeImg,
  stripObserverPhrases,
  generateVisualBrief,
  checkVisualCompatibility,
  getHarmonizedVisual
} = require('./visual_match_engine.js');

function getScientificVisual(questionText, options = {}, currentVisual = '', correctAnswer = '') {
  return getHarmonizedVisual(questionText, options, correctAnswer, currentVisual);
}

module.exports = {
  getScientificVisual,
  normalizeText,
  hasWord,
  makeImg,
  stripObserverPhrases,
  generateVisualBrief,
  checkVisualCompatibility,
  getHarmonizedVisual
};

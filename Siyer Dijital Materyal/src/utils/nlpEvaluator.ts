/**
 * Turkish NLP Evaluator for Open-Ended Student Answers
 * Handles case-folding, Turkish char normalization, punctuation trimming,
 * typo tolerance (Levenshtein distance), and teacher's alternative answers.
 */

export function normalizeTurkishText(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Standard Levenshtein distance calculation
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export interface EvaluationResult {
  isCorrect: boolean;
  similarityScore: number;
  matchedAnswer?: string;
  feedback: string;
}

export function evaluateStudentAnswer(
  studentInput: string,
  correctAnswer: string,
  alternativeAnswers: string[] = []
): EvaluationResult {
  const normalizedInput = normalizeTurkishText(studentInput);
  if (!normalizedInput) {
    return {
      isCorrect: false,
      similarityScore: 0,
      feedback: 'Lütfen bir cevap yazınız.'
    };
  }

  const allAccepted = [correctAnswer, ...alternativeAnswers].map(normalizeTurkishText);

  // 1. Direct exact or substring match
  for (const accepted of allAccepted) {
    if (normalizedInput === accepted) {
      return {
        isCorrect: true,
        similarityScore: 1.0,
        matchedAnswer: accepted,
        feedback: 'Tebrikler! Cevabın tam ve doğru.'
      };
    }
    // Substring contains check for phrases (e.g. user answered "Ebrehe ordusu" when answer is "Ebrehe")
    if (accepted.length >= 4 && normalizedInput.includes(accepted)) {
      return {
        isCorrect: true,
        similarityScore: 0.95,
        matchedAnswer: accepted,
        feedback: 'Çok güzel! Doğru anahtar kavramı belirttin.'
      };
    }
    if (normalizedInput.length >= 4 && accepted.includes(normalizedInput)) {
      // If student input is almost the answer
      if (normalizedInput.length / accepted.length > 0.7) {
        return {
          isCorrect: true,
          similarityScore: 0.9,
          matchedAnswer: accepted,
          feedback: 'Tebrikler! Doğru cevaba ulaştın.'
        };
      }
    }
  }

  // 2. Fuzzy Levenshtein Distance for typos (e.g. "ebreha" instead of "ebrehe")
  let bestScore = 0;
  let closestMatch = '';

  for (const accepted of allAccepted) {
    const dist = levenshteinDistance(normalizedInput, accepted);
    const maxLen = Math.max(normalizedInput.length, accepted.length);
    const score = 1 - dist / maxLen;

    if (score > bestScore) {
      bestScore = score;
      closestMatch = accepted;
    }
  }

  // Threshold: > 0.75 similarity accepted with minor typo tolerance
  if (bestScore >= 0.75) {
    return {
      isCorrect: true,
      similarityScore: bestScore,
      matchedAnswer: closestMatch,
      feedback: 'Tebrikler! Ufak bir yazım farkına rağmen cevabın doğru kabul edildi.'
    };
  }

  return {
    isCorrect: false,
    similarityScore: bestScore,
    feedback: 'Cevabın tam olarak doğru görünmüyor. İpucunu inceleyip tekrar deneyebilirsin.'
  };
}

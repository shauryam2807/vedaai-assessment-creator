import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';
import { IAssignment } from '../types';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

/**
 * Constructs a highly detailed prompt that instructs the AI model to generate
 * a structured assessment paper in valid JSON format.
 */
export function buildPrompt(assignment: IAssignment): string {
  const {
    title,
    subject,
    topic,
    gradeLevel,
    questionTypes,
    numberOfQuestions,
    totalMarks,
    difficultyDistribution,
    additionalInstructions,
  } = assignment;

  // Map readable labels for question types
  const typeLabels: Record<string, string> = {
    mcq: 'Multiple Choice Questions (MCQ)',
    true_false: 'True/False',
    short_answer: 'Short Answer',
    long_answer: 'Long Answer / Essay',
    fill_blanks: 'Fill in the Blanks',
  };

  const requestedTypes = questionTypes.map((t) => typeLabels[t] || t).join(', ');

  // Calculate question counts per difficulty
  const easyCount = Math.round((difficultyDistribution.easy / 100) * numberOfQuestions);
  const hardCount = Math.round((difficultyDistribution.hard / 100) * numberOfQuestions);
  const mediumCount = numberOfQuestions - easyCount - hardCount; // remainder to avoid rounding errors

  return `
You are an expert educational assessment creator. Generate a complete question paper based on the following specifications.

═══════════════════════════════════════════
ASSESSMENT SPECIFICATIONS
═══════════════════════════════════════════
• Title: ${title}
• Subject: ${subject}
${topic ? `• Topic/Chapter: ${topic}` : ''}
${gradeLevel ? `• Grade Level: ${gradeLevel}` : ''}
• Question Types Requested: ${requestedTypes}
• Total Number of Questions: ${numberOfQuestions}
• Total Marks: ${totalMarks}
• Difficulty Distribution:
  - Easy: ${difficultyDistribution.easy}% (≈${easyCount} questions)
  - Medium: ${difficultyDistribution.medium}% (≈${mediumCount} questions)
  - Hard: ${difficultyDistribution.hard}% (≈${hardCount} questions)
${additionalInstructions ? `• Additional Instructions: ${additionalInstructions}` : ''}

═══════════════════════════════════════════
OUTPUT REQUIREMENTS
═══════════════════════════════════════════

1. STRUCTURE: Group questions by type into sections labeled "A", "B", "C", etc.
   - Each section should contain only ONE type of question.
   - Each section needs a title (e.g., "Multiple Choice Questions") and a brief instruction for students.

2. MARKS: The total marks across ALL questions MUST equal exactly ${totalMarks}.
   - Distribute marks sensibly: MCQs and True/False get fewer marks each, Long Answer gets more.

3. DIFFICULTY: Follow the difficulty distribution as closely as possible.

4. QUESTIONS:
   - Each question must have: questionNumber (global, 1-indexed), text, type, difficulty, marks, answer.
   - For MCQs: provide exactly 4 options as an array. Answer should be the correct option letter (e.g., "A").
   - For True/False: answer should be "True" or "False".
   - For Fill in the Blanks: use "___" in the question text. Answer is the word/phrase.
   - For Short Answer: answer should be a concise model answer (2-3 sentences).
   - For Long Answer: answer should be a detailed model answer (1-2 paragraphs).

5. METADATA:
   - Include a "duration" field (estimated time in minutes).
   - Include an "instructions" array with 3-5 general exam instructions for students.

6. FORMAT: Return ONLY valid JSON. No explanations, no markdown, no code fences — just pure JSON.

═══════════════════════════════════════════
REQUIRED JSON SCHEMA
═══════════════════════════════════════════

{
  "title": "string",
  "subject": "string",
  "totalMarks": number,
  "duration": number,
  "instructions": ["string"],
  "sections": [
    {
      "sectionLabel": "A" | "B" | "C" | ...,
      "title": "string",
      "instructions": "string",
      "questions": [
        {
          "questionNumber": number,
          "text": "string",
          "type": "mcq" | "true_false" | "short_answer" | "long_answer" | "fill_blanks",
          "difficulty": "easy" | "medium" | "hard",
          "marks": number,
          "options": ["string"] | null,
          "answer": "string"
        }
      ]
    }
  ]
}

Generate the assessment now. Return ONLY the JSON object.
`.trim();
}

/**
 * Calls the Google Gemini 1.5 Flash model with the constructed prompt
 * and returns the raw text response.
 */
export async function generateQuestions(assignment: IAssignment): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = buildPrompt(assignment);

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  if (!text) {
    throw new Error('Gemini returned an empty response');
  }

  return text;
}

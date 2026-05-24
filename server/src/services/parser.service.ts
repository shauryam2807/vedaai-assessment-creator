import { z } from 'zod';
import { IAssignment, IGeneratedPaper } from '../types';

// ──────────────────────────────────────────────
//  JSON Extraction
// ──────────────────────────────────────────────

/**
 * Extracts a JSON string from an LLM response that may contain
 * markdown code fences, extra text, or other wrapping.
 */
export function extractJSON(text: string): string {
  // 1. Try to extract from ```json ... ``` or ``` ... ``` blocks
  const codeBlockRegex = /```(?:json)?\s*\n?([\s\S]*?)```/;
  const codeBlockMatch = text.match(codeBlockRegex);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  // 2. Try to find a top-level JSON object { ... }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return text.substring(firstBrace, lastBrace + 1);
  }

  // 3. Return trimmed text as-is and let JSON.parse fail with a clear error
  return text.trim();
}

// ──────────────────────────────────────────────
//  Zod Validation Schema
// ──────────────────────────────────────────────

const QuestionSchema = z.object({
  questionNumber: z.number(),
  text: z.string().min(1, 'Question text is required'),
  type: z.enum(['mcq', 'true_false', 'short_answer', 'long_answer', 'fill_blanks']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  marks: z.number().min(1),
  options: z.array(z.string()).optional().nullable(),
  answer: z.string().min(1, 'Answer is required'),
});

const SectionSchema = z.object({
  sectionLabel: z.string(),
  title: z.string(),
  instructions: z.string().default(''),
  questions: z.array(QuestionSchema).min(1),
});

export const GeneratedPaperSchema = z.object({
  title: z.string(),
  subject: z.string(),
  totalMarks: z.number(),
  duration: z.number(),
  instructions: z.array(z.string()).default([]),
  sections: z.array(SectionSchema).min(1),
});

export type ParsedPaper = z.infer<typeof GeneratedPaperSchema>;

// ──────────────────────────────────────────────
//  Parse & Validate
// ──────────────────────────────────────────────

/**
 * Parses a raw LLM text response into a validated paper object.
 *
 * Steps:
 * 1. Extract JSON from markdown / surrounding text
 * 2. Parse with JSON.parse
 * 3. Validate structure with Zod
 * 4. Cross-validate totals against the original assignment
 */
export function parseLLMResponse(
  rawResponse: string,
  assignment: IAssignment
): ParsedPaper {
  // Step 1 — extract
  const jsonString = extractJSON(rawResponse);

  // Step 2 — parse
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    throw new Error(
      `Failed to parse LLM response as JSON: ${(err as Error).message}\n` +
        `Extracted text (first 500 chars): ${jsonString.substring(0, 500)}`
    );
  }

  // Step 3 — Zod validate
  const result = GeneratedPaperSchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.errors
      .map((e) => `  • ${e.path.join('.')}: ${e.message}`)
      .join('\n');
    throw new Error(`LLM response failed schema validation:\n${issues}`);
  }

  const paper = result.data;

  // Step 4 — cross-validate
  const allQuestions = paper.sections.flatMap((s) => s.questions);
  const actualTotalMarks = allQuestions.reduce((sum, q) => sum + q.marks, 0);
  const actualQuestionCount = allQuestions.length;

  // Warn but don't fail on minor mark differences (±10% tolerance)
  const marksTolerance = assignment.totalMarks * 0.1;
  if (Math.abs(actualTotalMarks - assignment.totalMarks) > marksTolerance) {
    console.warn(
      `⚠️  Marks mismatch: expected ${assignment.totalMarks}, got ${actualTotalMarks}. ` +
        `Adjusting paper totalMarks to actual.`
    );
    paper.totalMarks = actualTotalMarks;
  }

  if (actualQuestionCount !== assignment.numberOfQuestions) {
    console.warn(
      `⚠️  Question count mismatch: expected ${assignment.numberOfQuestions}, got ${actualQuestionCount}. ` +
        `Proceeding with actual count.`
    );
  }

  return paper;
}

import { Document, Types } from 'mongoose';

// ──────────────────────────────────────────────
//  Enums & Literal Types
// ──────────────────────────────────────────────

/** Supported question types for assessment generation */
export type QuestionType = 'mcq' | 'true_false' | 'short_answer' | 'long_answer' | 'fill_blanks';

/** Difficulty levels for individual questions */
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/** Lifecycle status of an assignment */
export type AssignmentStatus = 'pending' | 'processing' | 'completed' | 'failed';

// ──────────────────────────────────────────────
//  Assignment
// ──────────────────────────────────────────────

/** Distribution percentages for difficulty levels (must sum to 100) */
export interface IDifficultyDistribution {
  easy: number;
  medium: number;
  hard: number;
}

/** Core assignment document shape */
export interface IAssignment {
  title: string;
  subject: string;
  topic?: string;
  gradeLevel?: string;
  dueDate: Date;
  questionTypes: QuestionType[];
  numberOfQuestions: number;
  totalMarks: number;
  difficultyDistribution: IDifficultyDistribution;
  additionalInstructions?: string;
  uploadedFileUrl?: string;
  status: AssignmentStatus;
  generatedPaperId?: Types.ObjectId;
}

/** Mongoose document version of IAssignment */
export interface IAssignmentDocument extends IAssignment, Document {}

// ──────────────────────────────────────────────
//  Generated Paper
// ──────────────────────────────────────────────

/** A single question within a section */
export interface IQuestion {
  questionNumber: number;
  text: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  marks: number;
  options?: string[];
  answer: string;
}

/** A section groups related questions (e.g. Section A — MCQs) */
export interface ISection {
  sectionLabel: string;
  title: string;
  instructions: string;
  questions: IQuestion[];
}

/** Metadata about the generation run */
export interface IGenerationMetadata {
  generatedAt: Date;
  modelUsed: string;
  generationTimeMs: number;
}

/** The fully generated assessment paper */
export interface IGeneratedPaper {
  assignmentId: Types.ObjectId;
  title: string;
  subject: string;
  totalMarks: number;
  duration: number;
  instructions: string[];
  sections: ISection[];
  metadata?: IGenerationMetadata;
}

/** Mongoose document version of IGeneratedPaper */
export interface IGeneratedPaperDocument extends IGeneratedPaper, Document {}

// ──────────────────────────────────────────────
//  WebSocket event payloads
// ──────────────────────────────────────────────

export interface GenerationStartedPayload {
  assignmentId: string;
  message: string;
}

export interface GenerationProgressPayload {
  assignmentId: string;
  progress: number;
  message: string;
}

export interface GenerationCompletedPayload {
  assignmentId: string;
  paperId: string;
  message: string;
}

export interface GenerationFailedPayload {
  assignmentId: string;
  error: string;
}

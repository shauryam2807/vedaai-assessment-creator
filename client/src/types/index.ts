export type QuestionType = 'mcq' | 'true_false' | 'short_answer' | 'long_answer' | 'fill_blanks';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type AssignmentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface IAssignment {
  _id: string;
  title: string;
  subject: string;
  topic?: string;
  gradeLevel?: string;
  dueDate: Date | string;
  questionTypes: QuestionType[];
  numberOfQuestions: number;
  totalMarks: number;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  additionalInstructions?: string;
  uploadedFileUrl?: string;
  status: AssignmentStatus;
  generatedPaperId?: string;
}

export interface IGeneratedPaper {
  _id: string;
  assignmentId: string;
  title: string;
  subject: string;
  totalMarks: number;
  duration?: string;
  instructions: string[];
  sections: ISection[];
  metadata?: {
    generatedAt: string | Date;
    modelUsed?: string;
    generationTimeMs?: number;
  };
}

export interface ISection {
  sectionLabel: string;
  title: string;
  instructions: string;
  questions: IQuestion[];
}

export interface IQuestion {
  questionNumber: number;
  text: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  marks: number;
  options?: string[];
  answer?: string;
}

export interface AssignmentFormData {
  title: string;
  subject: string;
  topic?: string;
  gradeLevel?: string;
  dueDate: string;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  additionalInstructions?: string;
}

import mongoose, { Schema } from 'mongoose';
import { IGeneratedPaperDocument } from '../types';

const QuestionSchema = new Schema(
  {
    questionNumber: { type: Number, required: true },
    text: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['mcq', 'true_false', 'short_answer', 'long_answer', 'fill_blanks'],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['easy', 'medium', 'hard'],
    },
    marks: { type: Number, required: true, min: 1 },
    options: { type: [String], default: undefined },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const SectionSchema = new Schema(
  {
    sectionLabel: { type: String, required: true },
    title: { type: String, required: true },
    instructions: { type: String, default: '' },
    questions: { type: [QuestionSchema], required: true },
  },
  { _id: false }
);

const GeneratedPaperSchema = new Schema<IGeneratedPaperDocument>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: [true, 'Assignment ID is required'],
    },
    title: { type: String, required: true },
    subject: { type: String, required: true },
    totalMarks: { type: Number, required: true },
    duration: { type: Number, required: true },
    instructions: { type: [String], default: [] },
    sections: { type: [SectionSchema], required: true },
    metadata: {
      generatedAt: { type: Date, default: Date.now },
      modelUsed: { type: String, default: 'gemini-1.5-flash' },
      generationTimeMs: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

export const GeneratedPaper = mongoose.model<IGeneratedPaperDocument>(
  'GeneratedPaper',
  GeneratedPaperSchema
);

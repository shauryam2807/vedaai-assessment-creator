import mongoose, { Schema } from 'mongoose';
import { IAssignmentDocument } from '../types';

const AssignmentSchema = new Schema<IAssignmentDocument>(
  {
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    topic: {
      type: String,
      trim: true,
    },
    gradeLevel: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    questionTypes: {
      type: [String],
      required: [true, 'At least one question type is required'],
      enum: ['mcq', 'true_false', 'short_answer', 'long_answer', 'fill_blanks', 'diagram', 'numerical'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one question type must be specified',
      },
    },
    numberOfQuestions: {
      type: Number,
      required: [true, 'Number of questions is required'],
      min: [1, 'Must have at least 1 question'],
    },
    totalMarks: {
      type: Number,
      required: [true, 'Total marks is required'],
      min: [1, 'Total marks must be at least 1'],
    },
    difficultyDistribution: {
      easy: { type: Number, required: true, min: 0, max: 100 },
      medium: { type: Number, required: true, min: 0, max: 100 },
      hard: { type: Number, required: true, min: 0, max: 100 },
    },
    additionalInstructions: {
      type: String,
      trim: true,
    },
    uploadedFileUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    generatedPaperId: {
      type: Schema.Types.ObjectId,
      ref: 'GeneratedPaper',
    },
  },
  {
    timestamps: true,
  }
);

export const Assignment = mongoose.model<IAssignmentDocument>('Assignment', AssignmentSchema);

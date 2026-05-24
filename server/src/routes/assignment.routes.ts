import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import {
  createAssignment,
  getAssignment,
  listAssignments,
  deleteAssignment,
  getGeneratedPaper,
  regenerateAssignment,
  downloadPDF,
} from '../controllers/assignment.controller';

const router = Router();

// ──────────────────────────────────────────────
//  Request Validation Schema
// ──────────────────────────────────────────────

const CreateAssignmentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  subject: z.string().min(1, 'Subject is required').max(100),
  topic: z.string().max(200).optional(),
  gradeLevel: z.string().max(50).optional(),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  questionTypes: z
    .array(z.enum(['mcq', 'true_false', 'short_answer', 'long_answer', 'fill_blanks', 'diagram', 'numerical']))
    .min(1, 'At least one question type is required'),
  numberOfQuestions: z.number().int().min(1, 'Must have at least 1 question').max(100),
  totalMarks: z.number().int().min(1, 'Total marks must be at least 1').max(500),
  difficultyDistribution: z.object({
    easy: z.number().min(0).max(100),
    medium: z.number().min(0).max(100),
    hard: z.number().min(0).max(100),
  }).refine(
    (d) => d.easy + d.medium + d.hard === 100,
    { message: 'Difficulty percentages must sum to 100' }
  ),
  additionalInstructions: z.string().max(1000).optional(),
  uploadedFileUrl: z.string().url().optional(),
});

// ──────────────────────────────────────────────
//  Routes
// ──────────────────────────────────────────────

/** Create a new assignment and trigger AI generation */
router.post('/', validate(CreateAssignmentSchema), createAssignment);

/** Get all assignments */
router.get('/', listAssignments);

/** Get assignment details by ID */
router.get('/:id', getAssignment);

/** Delete assignment by ID */
router.delete('/:id', deleteAssignment);

/** Get the generated paper for an assignment */
router.get('/:id/paper', getGeneratedPaper);

/** Regenerate the paper for an existing assignment */
router.post('/:id/regenerate', regenerateAssignment);

/** Download the generated paper as a PDF */
router.get('/:id/pdf', downloadPDF);

export default router;

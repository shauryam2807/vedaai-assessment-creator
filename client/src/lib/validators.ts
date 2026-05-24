import { z } from "zod";

export const assignmentFormSchema = z.object({
  title: z.string().optional().default(""),
  subject: z.string().min(1, "Subject is required"),
  topic: z.string().optional(),
  gradeLevel: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  questionTypes: z.array(z.string()).min(1, "At least one question type is required"),
  numberOfQuestions: z.number().min(1, "At least 1 question required").max(100),
  totalMarks: z.number().min(1, "Total marks must be at least 1"),
  difficultyDistribution: z.object({
    easy: z.number().min(0).max(100),
    medium: z.number().min(0).max(100),
    hard: z.number().min(0).max(100),
  }).refine((data) => data.easy + data.medium + data.hard === 100, {
    message: "Difficulty distribution must equal 100%",
    path: ["hard"],
  }),
  additionalInstructions: z.string().max(2000).optional(),
});

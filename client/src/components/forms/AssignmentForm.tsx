import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { assignmentFormSchema } from "@/lib/validators";
import { AssignmentFormData } from "@/types";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { FileUpload } from "../ui/FileUpload";
import { QuestionTypesManager, QuestionTypeData } from "./QuestionTypesManager";

export function AssignmentForm() {
  const router = useRouter();
  const { submitAssignment, generationStatus } = useAssignmentStore();
  
  // Custom state for question rows (to easily calculate totals and map to API)
  const [questionRows, setQuestionRows] = useState<QuestionTypeData[]>([
    { id: "1", type: "mcq", count: 4, marksPerQuestion: 1 },
    { id: "2", type: "short_answer", count: 3, marksPerQuestion: 2 },
  ]);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      title: "",
      subject: "",
      gradeLevel: "",
      dueDate: "",
      difficultyDistribution: {
        easy: 40,
        medium: 40,
        hard: 20
      },
      additionalInstructions: ""
    }
  });

  // Sync custom state to react-hook-form
  useEffect(() => {
    const totalQ = questionRows.reduce((sum, row) => sum + row.count, 0);
    const totalM = questionRows.reduce((sum, row) => sum + (row.count * row.marksPerQuestion), 0);
    const types = Array.from(new Set(questionRows.map(r => r.type)));
    
    setValue("numberOfQuestions", totalQ);
    setValue("totalMarks", totalM);
    setValue("questionTypes", types);
  }, [questionRows, setValue]);

  const onSubmit = async (data: AssignmentFormData) => {
    // 1. Calculate totals from questionRows
    const totalQuestions = questionRows.reduce((sum, row) => sum + row.count, 0);
    const totalMarks = questionRows.reduce((sum, row) => sum + (row.count * row.marksPerQuestion), 0);
    const types = Array.from(new Set(questionRows.map(r => r.type)));

    if (totalQuestions === 0) {
      toast.error("Please add at least one question.");
      return;
    }

    // Build the final payload
    const payload: AssignmentFormData = {
      ...data,
      title: data.title || `Assessment - ${data.subject || 'General'}`,
      subject: data.subject || "General",
      // Append detailed breakdown to instructions so AI knows exactly what to do
      additionalInstructions: `
Detailed Breakdown:
${questionRows.map(r => `- ${r.count} ${r.type.replace('_', ' ')} questions (${r.marksPerQuestion} marks each)`).join('\n')}

User Instructions:
${data.additionalInstructions || 'None'}
      `.trim()
    };

    try {
      const id = await submitAssignment(payload);
      toast.success("Assignment created! Generating paper...");
      router.push(`/assessment/${id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create assessment");
    }
  };

  const isSubmitting = generationStatus === 'submitting';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="assignment-form">
      <div className="form-card">
        <div className="card-header">
          <h2 className="card-title">Assignment Details</h2>
          <p className="card-subtitle">Basic information about your assignment</p>
        </div>

        <div className="form-content">
          {/* Form Fields Header - Title, Subject, Class */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Title (Optional)</label>
              <input 
                className="form-input" 
                placeholder="e.g. Mid-Term Exam"
                {...register("title")}
              />
            </div>
            <div className="form-group flex-1">
              <label className="form-label">Subject</label>
              <input 
                className="form-input" 
                placeholder="e.g. Science"
                {...register("subject")}
              />
              {errors.subject && <p className="form-error">{errors.subject.message}</p>}
            </div>
            <div className="form-group flex-1">
              <label className="form-label">Class / Grade</label>
              <input 
                className="form-input" 
                placeholder="e.g. 8th"
                {...register("gradeLevel")}
              />
            </div>
          </div>

          <FileUpload onFileSelect={(file) => console.log('File selected:', file)} />

          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input 
              type="date"
              className="form-input" 
              {...register("dueDate")}
            />
            {errors.dueDate && <p className="form-error">{errors.dueDate.message}</p>}
          </div>

          <div className="form-group manager-group">
            <QuestionTypesManager 
              rows={questionRows}
              onChange={setQuestionRows}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Additional Information (For better output)</label>
            <textarea 
              className="form-textarea" 
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
              {...register("additionalInstructions")}
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline nav-btn" onClick={() => router.push('/')}>
          <ArrowLeft size={16} />
          Previous
        </button>
        <button type="submit" className="btn btn-primary nav-btn next-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : 'Next'}
          <ArrowRight size={16} />
        </button>
      </div>

      <style jsx>{`
        .assignment-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .card-header {
          margin-bottom: 2rem;
        }

        .card-title {
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .card-subtitle {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .form-content {
          display: flex;
          flex-direction: column;
        }

        .form-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .flex-1 {
          flex: 1;
        }

        .manager-group {
          margin-top: 1rem;
          margin-bottom: 2rem;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
        }

        .nav-btn {
          border-radius: var(--radius-full);
          padding: 0.75rem 1.5rem;
          font-weight: 600;
        }

        .next-btn {
          background-color: var(--brand-dark);
          color: white;
        }

        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
          }
        }
      `}</style>
    </form>
  );
}

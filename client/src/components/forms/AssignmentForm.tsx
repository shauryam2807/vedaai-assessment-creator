import { useState, useEffect, useRef, DragEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { assignmentFormSchema } from "@/lib/validators";
import { AssignmentFormData } from "@/types";
import { useAssignmentStore } from "@/store/useAssignmentStore";

interface QRow {
  id: number;
  type: string;
  q: number;
  m: number;
}

const ALL_TYPES = [
  "Multiple Choice Questions",
  "Short Questions",
  "Long Answer Questions",
  "True/False Questions",
  "Fill in the Blanks",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "Match the Following",
];

const TYPE_VALUE_MAP: Record<string, string> = {
  "Multiple Choice Questions": "mcq",
  "Short Questions": "short_answer",
  "Long Answer Questions": "long_answer",
  "True/False Questions": "true_false",
  "Fill in the Blanks": "fill_blanks",
  "Diagram/Graph-Based Questions": "diagram",
  "Numerical Problems": "numerical",
  "Match the Following": "match",
};

const DEFAULT_ROWS: QRow[] = [
  { id: 1, type: "Multiple Choice Questions", q: 4, m: 1 },
  { id: 2, type: "Short Questions", q: 3, m: 2 },
  { id: 3, type: "Diagram/Graph-Based Questions", q: 5, m: 5 },
  { id: 4, type: "Numerical Problems", q: 5, m: 5 },
];

export function AssignmentForm() {
  const router = useRouter();
  const { submitAssignment, generationStatus } = useAssignmentStore();

  const [rows, setRows] = useState<QRow[]>(DEFAULT_ROWS);
  const [nextId, setNextId] = useState(DEFAULT_ROWS.length + 1);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      title: "",
      subject: "",
      gradeLevel: "",
      dueDate: "",
      difficultyDistribution: { easy: 40, medium: 40, hard: 20 },
      additionalInstructions: "",
    },
  });

  // Sync question rows to form
  useEffect(() => {
    const totalQ = rows.reduce((s, r) => s + r.q, 0);
    const totalM = rows.reduce((s, r) => s + r.q * r.m, 0);
    const types = Array.from(new Set(rows.map(r => TYPE_VALUE_MAP[r.type] || r.type)));
    setValue("numberOfQuestions", totalQ);
    setValue("totalMarks", totalM);
    setValue("questionTypes", types);
  }, [rows, setValue]);

  // Sync due date
  useEffect(() => {
    setValue("dueDate", dueDate);
  }, [dueDate, setValue]);

  const totalQuestions = rows.reduce((s, r) => s + r.q, 0);
  const totalMarks = rows.reduce((s, r) => s + r.q * r.m, 0);
  const progressPct = Math.min(40 + rows.length * 8, 95);

  /* ── Question row actions ── */
  function stepVal(id: number, field: "q" | "m", delta: number) {
    setRows(prev => prev.map(r =>
      r.id === id ? { ...r, [field]: Math.max(0, r[field] + delta) } : r
    ));
  }

  function updateType(id: number, val: string) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, type: val } : r));
  }

  function removeRow(id: number) {
    if (rows.length <= 1) return;
    setRows(prev => prev.filter(r => r.id !== id));
  }

  function addRow() {
    setRows(prev => [...prev, { id: nextId, type: ALL_TYPES[0], q: 3, m: 2 }]);
    setNextId(prev => prev + 1);
  }

  /* ── File handling ── */
  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setFileName(file.name);
  }

  function removeFile() {
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  /* ── Date formatter ── */
  function formatDate(val: string) {
    let v = val.replace(/\D/g, "");
    if (v.length >= 3 && v.length <= 4) v = v.slice(0, 2) + "-" + v.slice(2);
    else if (v.length > 4) v = v.slice(0, 2) + "-" + v.slice(2, 4) + "-" + v.slice(4, 8);
    setDueDate(v);
  }

  /* ── Submit ── */
  const onSubmit = async (data: AssignmentFormData) => {
    const totalQ = rows.reduce((s, r) => s + r.q, 0);
    if (totalQ === 0) {
      toast.error("Please add at least one question.");
      return;
    }

    const payload: AssignmentFormData = {
      ...data,
      title: data.title || `Assessment - ${data.subject || "General"}`,
      subject: data.subject || "General",
      additionalInstructions: `
Detailed Breakdown:
${rows.map(r => `- ${r.q} ${r.type} (${r.m} marks each)`).join("\n")}

User Instructions:
${data.additionalInstructions || "None"}
      `.trim(),
    };

    try {
      const id = await submitAssignment(payload);
      toast.success("Assignment created! Generating paper...");
      router.push(`/assessment/${id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create assessment");
    }
  };

  const isSubmitting = generationStatus === "submitting";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="ca-form">
      <style>{`
        /* ─── PROGRESS BAR ───────────────────────────────── */
        .ca-progress-wrap {
          height:5px; background:#E5E7EB; border-radius:3px;
          margin-bottom:22px; overflow:hidden;
        }
        .ca-progress-fill {
          height:100%; background:var(--bg-dark-btn, #1C1C1E);
          border-radius:3px; transition:width .4s ease;
        }

        /* ─── FORM CARD ──────────────────────────────────── */
        .ca-form-card {
          background:var(--bg-white, #fff); border-radius:var(--radius-lg, 12px);
          padding:28px 28px 32px;
          box-shadow:0 1px 4px rgba(0,0,0,.07);
        }
        .ca-section-title { font-size:16px; font-weight:700; margin-bottom:3px; }
        .ca-section-sub { font-size:13px; color:var(--text-secondary, #6B7280); margin-bottom:22px; }

        /* ─── UPLOAD ZONE ────────────────────────────────── */
        .ca-upload-zone {
          border: 2px dashed #C8CACF;
          border-radius:var(--radius-lg, 12px);
          background:#FAFAFA;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          padding:32px 20px 24px;
          cursor:pointer; transition:border-color .2s, background .2s;
          margin-bottom:10px;
        }
        .ca-upload-zone:hover { border-color:#9CA3AF; background:#F5F5F5; }
        .ca-upload-zone.dragover { border-color:var(--bg-dark-btn, #1C1C1E); background:#F0F0F0; }
        .ca-upload-icon { margin-bottom:12px; color:var(--text-primary, #1A1A1A); }
        .ca-upload-main { font-size:14px; font-weight:600; margin-bottom:4px; }
        .ca-upload-hint { font-size:12px; color:var(--text-muted, #9CA3AF); margin-bottom:14px; }
        .ca-browse-btn {
          background:var(--bg-white, #fff); border:1px solid var(--border, #E5E7EB);
          border-radius:var(--radius-pill, 50px); padding:8px 22px;
          font-size:13px; font-weight:500; font-family:var(--font);
          cursor:pointer; transition:background .14s;
        }
        .ca-browse-btn:hover { background:#F5F5F5; }
        .ca-upload-caption { font-size:12.5px; color:var(--text-secondary, #6B7280); text-align:center; margin-bottom:24px; }

        /* Uploaded preview */
        .ca-uploaded-preview {
          display:flex; align-items:center; gap:10px;
          background:#F5F5F5; border-radius:8px; padding:10px 14px; margin-bottom:10px;
        }
        .ca-file-icon { font-size:20px; }
        .ca-file-name { font-size:13px; font-weight:500; flex:1; }
        .ca-file-remove {
          background:transparent; border:none; cursor:pointer;
          color:var(--text-secondary, #6B7280); font-size:16px; line-height:1;
          padding:2px 6px; border-radius:4px; transition:background .14s;
        }
        .ca-file-remove:hover { background:var(--border, #E5E7EB); }

        /* ─── DUE DATE ───────────────────────────────────── */
        .ca-field-label { font-size:14px; font-weight:600; margin-bottom:10px; }
        .ca-date-wrap {
          display:flex; align-items:center;
          border:1px solid var(--border, #E5E7EB); border-radius:8px;
          padding:0 14px; background:var(--bg-white, #fff); height:46px;
          margin-bottom:24px;
        }
        .ca-date-wrap input {
          flex:1; border:none; outline:none;
          font-size:14px; font-family:var(--font);
          color:var(--text-primary, #1A1A1A); background:transparent;
        }
        .ca-date-wrap input::placeholder { color:var(--text-muted, #9CA3AF); }
        .ca-date-icon {
          background:transparent; border:none; cursor:pointer;
          color:var(--text-secondary, #6B7280); display:flex; align-items:center;
        }

        /* ─── QUESTION TYPE TABLE ────────────────────────── */
        .ca-qt-label { font-size:14px; font-weight:600; margin-bottom:12px; }
        .ca-qt-header {
          display:grid; grid-template-columns: 1fr 100px 100px;
          gap:12px; align-items:center;
          font-size:12.5px; font-weight:600; color:var(--text-secondary, #6B7280);
          padding:0 4px 8px; border-bottom:1px solid #C8CACF;
          margin-bottom:10px;
        }
        .ca-qt-header .col-right { text-align:center; }
        .ca-qt-row {
          display:grid; grid-template-columns: 1fr auto 100px 100px;
          gap:10px; align-items:center; margin-bottom:10px;
          animation:ca-rowIn .18s ease;
        }
        @keyframes ca-rowIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:none} }

        /* Dropdown */
        .ca-select-wrap {
          position:relative; display:flex; align-items:center;
          border:1px solid var(--border, #E5E7EB); border-radius:8px;
          background:var(--bg-white, #fff); height:42px; padding:0 10px 0 14px;
        }
        .ca-select {
          flex:1; border:none; outline:none; appearance:none;
          font-size:13.5px; font-family:var(--font);
          color:var(--text-primary, #1A1A1A); background:transparent; cursor:pointer;
        }
        .ca-select-wrap svg { pointer-events:none; color:var(--text-secondary, #6B7280); flex-shrink:0; }

        /* Remove row btn */
        .ca-qt-remove {
          width:28px; height:28px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          border:1px solid var(--border, #E5E7EB); background:white;
          cursor:pointer; color:var(--text-secondary, #6B7280); flex-shrink:0;
          transition:border-color .14s, color .14s;
        }
        .ca-qt-remove:hover { border-color:#EF4444; color:#EF4444; }

        /* Stepper */
        .ca-stepper {
          display:flex; align-items:center; justify-content:center; gap:6px;
          border:1px solid var(--border, #E5E7EB); border-radius:8px; height:42px;
          padding:0 6px;
        }
        .ca-step-btn {
          width:24px; height:24px; border-radius:5px; border:none;
          background:transparent; cursor:pointer; font-size:16px; font-weight:500;
          color:var(--text-secondary, #6B7280); display:flex; align-items:center; justify-content:center;
          transition:background .14s; flex-shrink:0; line-height:1;
        }
        .ca-step-btn:hover { background:#F5F5F5; color:var(--text-primary, #1A1A1A); }
        .ca-step-val {
          min-width:24px; text-align:center;
          font-size:14px; font-weight:600; color:var(--text-primary, #1A1A1A);
        }

        /* Add Question Type */
        .ca-add-btn {
          display:flex; align-items:center; gap:10px;
          background:transparent; border:none; font-family:var(--font);
          font-size:13.5px; font-weight:600; color:var(--text-primary, #1A1A1A);
          cursor:pointer; padding:6px 0; margin-top:4px;
          transition:opacity .18s;
        }
        .ca-add-btn:hover { opacity:.75; }
        .ca-add-circle {
          width:30px; height:30px; border-radius:50%;
          background:var(--bg-dark-btn, #1C1C1E); color:white;
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0; font-size:18px; line-height:1;
        }

        /* Totals row */
        .ca-totals {
          text-align:right; margin-top:16px; margin-bottom:24px;
          font-size:13.5px; color:var(--text-secondary, #6B7280); line-height:1.9;
        }
        .ca-totals strong { color:var(--text-primary, #1A1A1A); font-weight:700; }

        /* ─── ADDITIONAL INFO ────────────────────────────── */
        .ca-textarea-wrap { position:relative; }
        .ca-textarea {
          width:100%; min-height:100px; border:1px solid var(--border, #E5E7EB);
          border-radius:8px; padding:14px 44px 14px 14px;
          font-size:13.5px; font-family:var(--font); color:var(--text-primary, #1A1A1A);
          background:#FAFAFA; resize:vertical; outline:none;
          transition:border-color .18s; line-height:1.6;
        }
        .ca-textarea:focus { border-color:#9CA3AF; background:white; }
        .ca-textarea::placeholder { color:var(--text-muted, #9CA3AF); }
        .ca-mic-btn {
          position:absolute; bottom:12px; right:12px;
          background:transparent; border:none; cursor:pointer;
          color:var(--text-secondary, #6B7280); transition:color .14s;
        }
        .ca-mic-btn:hover { color:var(--text-primary, #1A1A1A); }

        /* ─── BOTTOM ACTIONS ─────────────────────────────── */
        .ca-form-actions {
          display:flex; align-items:center; justify-content:space-between;
          margin-top:32px;
        }
        .ca-prev-btn {
          display:flex; align-items:center; gap:7px;
          background:white; color:var(--text-primary, #1A1A1A);
          border:1.5px solid var(--border, #E5E7EB); border-radius:var(--radius-pill, 50px);
          padding:12px 24px; font-size:14px; font-weight:600;
          font-family:var(--font); cursor:pointer; transition:background .14s;
        }
        .ca-prev-btn:hover { background:#F5F5F5; }
        .ca-next-btn {
          display:flex; align-items:center; gap:7px;
          background:var(--bg-dark-btn, #1C1C1E); color:white;
          border:none; border-radius:var(--radius-pill, 50px);
          padding:13px 28px; font-size:14px; font-weight:600;
          font-family:var(--font); cursor:pointer;
          transition:opacity .18s, transform .18s;
          box-shadow:0 4px 14px rgba(0,0,0,.2);
        }
        .ca-next-btn:hover { opacity:.88; transform:translateY(-1px); }
        .ca-next-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; }

        @media (max-width:768px) {
          .ca-form-card { padding:20px 16px 24px; }
          .ca-qt-header { display:none; }
          .ca-qt-row { grid-template-columns: 1fr auto; grid-template-rows:auto auto; gap:8px; }
          .ca-form-actions { gap:12px; }
        }
      `}</style>

      {/* Progress bar */}
      <div className="ca-progress-wrap">
        <div className="ca-progress-fill" style={{ width: `${progressPct}%` }}></div>
      </div>

      {/* Form card */}
      <div className="ca-form-card">
        <p className="ca-section-title">Assignment Details</p>
        <p className="ca-section-sub">Basic information about your assignment</p>

        {/* Upload Zone */}
        {!fileName ? (
          <div
            className={`ca-upload-zone${dragOver ? " dragover" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="ca-upload-icon">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 24V12M13 17l5-5 5 5"/>
                <path d="M6 26c0 2.2 1.8 4 4 4h16c2.2 0 4-1.8 4-4"/>
                <path d="M8 22a6 6 0 01-2-4.5C6 13 9.5 10 14 10c.7 0 1.4.1 2 .3A7 7 0 0130 16c0 2-.8 3.8-2 5.1"/>
              </svg>
            </div>
            <p className="ca-upload-main">Choose a file or drag &amp; drop it here</p>
            <p className="ca-upload-hint">JPEG, PNG, upto 10MB</p>
            <button type="button" className="ca-browse-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
              Browse Files
            </button>
          </div>
        ) : (
          <div className="ca-uploaded-preview">
            <span className="ca-file-icon">🖼️</span>
            <span className="ca-file-name">{fileName}</span>
            <button type="button" className="ca-file-remove" onClick={removeFile}>×</button>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          accept=".jpeg,.jpg,.png"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
        <p className="ca-upload-caption">Upload images of your preferred document/image</p>

        {/* Due Date */}
        <p className="ca-field-label">Due Date</p>
        <div className="ca-date-wrap">
          <input
            type="text"
            placeholder="DD-MM-YYYY"
            value={dueDate}
            onChange={(e) => formatDate(e.target.value)}
          />
          <button type="button" className="ca-date-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="14" height="13" rx="2"/>
              <path d="M6 1v4M12 1v4M2 8h14"/>
            </svg>
          </button>
        </div>

        {/* Question Type */}
        <p className="ca-qt-label">Question Type</p>
        <div className="ca-qt-header">
          <span>Question Type</span>
          <span className="col-right">No. of Questions</span>
          <span className="col-right">Marks</span>
        </div>

        <div>
          {rows.map((row) => (
            <div className="ca-qt-row" key={row.id}>
              <div className="ca-select-wrap">
                <select
                  className="ca-select"
                  value={row.type}
                  onChange={(e) => updateType(row.id, e.target.value)}
                >
                  {ALL_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 5l4 4 4-4"/>
                </svg>
              </div>

              <button type="button" className="ca-qt-remove" onClick={() => removeRow(row.id)} title="Remove">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/>
                </svg>
              </button>

              <div className="ca-stepper">
                <button type="button" className="ca-step-btn" onClick={() => stepVal(row.id, "q", -1)}>−</button>
                <span className="ca-step-val">{row.q}</span>
                <button type="button" className="ca-step-btn" onClick={() => stepVal(row.id, "q", 1)}>+</button>
              </div>

              <div className="ca-stepper">
                <button type="button" className="ca-step-btn" onClick={() => stepVal(row.id, "m", -1)}>−</button>
                <span className="ca-step-val">{row.m}</span>
                <button type="button" className="ca-step-btn" onClick={() => stepVal(row.id, "m", 1)}>+</button>
              </div>
            </div>
          ))}
        </div>

        <button type="button" className="ca-add-btn" onClick={addRow}>
          <span className="ca-add-circle">+</span>
          Add Question Type
        </button>

        {/* Totals */}
        <div className="ca-totals">
          Total Questions : <strong>{totalQuestions}</strong>&nbsp;&nbsp;&nbsp;
          Total Marks : <strong>{totalMarks}</strong>
        </div>

        {/* Additional Information */}
        <p className="ca-field-label">Additional Information <span style={{ fontWeight: 400, color: "var(--text-secondary, #6B7280)" }}>(For better output)</span></p>
        <div className="ca-textarea-wrap">
          <textarea
            className="ca-textarea"
            rows={4}
            placeholder="e.g Generate a question paper for 3 hour exam duration..."
            {...register("additionalInstructions")}
          />
          <button type="button" className="ca-mic-btn" title="Voice input">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="1" width="6" height="9" rx="3"/>
              <path d="M3 9a6 6 0 0012 0"/>
              <line x1="9" y1="16" x2="9" y2="17"/>
              <line x1="6" y1="17" x2="12" y2="17"/>
            </svg>
          </button>
        </div>

        {/* Actions */}
        <div className="ca-form-actions">
          <button type="button" className="ca-prev-btn" onClick={() => window.history.back()}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M10 3L5 7.5 10 12"/>
            </svg>
            Previous
          </button>
          <button type="submit" className="ca-next-btn" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Next"}
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M5 3l5 4.5L5 12"/>
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
}

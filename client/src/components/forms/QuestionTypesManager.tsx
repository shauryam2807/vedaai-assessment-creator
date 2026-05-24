import { X, Plus } from "lucide-react";
import { CounterInput } from "../ui/CounterInput";

export interface QuestionTypeData {
  id: string; // Unique ID for React keys
  type: string;
  count: number;
  marksPerQuestion: number;
}

interface QuestionTypesManagerProps {
  rows: QuestionTypeData[];
  onChange: (rows: QuestionTypeData[]) => void;
}

const AVAILABLE_TYPES = [
  { value: "mcq", label: "Multiple Choice Questions" },
  { value: "short_answer", label: "Short Questions" },
  { value: "diagram", label: "Diagram/Graph-Based Questions" },
  { value: "numerical", label: "Numerical Problems" },
  { value: "long_answer", label: "Long Answer Questions" },
  { value: "true_false", label: "True/False" },
];

export function QuestionTypesManager({ rows, onChange }: QuestionTypesManagerProps) {
  const addRow = () => {
    // Find a type that isn't used yet, or just default to the first one
    const usedTypes = new Set(rows.map(r => r.type));
    const nextType = AVAILABLE_TYPES.find(t => !usedTypes.has(t.value))?.value || AVAILABLE_TYPES[0].value;
    
    onChange([
      ...rows,
      {
        id: Math.random().toString(36).substring(7),
        type: nextType,
        count: 1,
        marksPerQuestion: 1,
      }
    ]);
  };

  const removeRow = (id: string) => {
    if (rows.length <= 1) return; // Prevent deleting the last row
    onChange(rows.filter(r => r.id !== id));
  };

  const updateRow = (id: string, updates: Partial<QuestionTypeData>) => {
    onChange(
      rows.map(row => 
        row.id === id ? { ...row, ...updates } : row
      )
    );
  };

  const totalQuestions = rows.reduce((sum, row) => sum + row.count, 0);
  const totalMarks = rows.reduce((sum, row) => sum + (row.count * row.marksPerQuestion), 0);

  return (
    <div className="manager-wrapper">
      <div className="table-header">
        <div className="col-type">Question Type</div>
        <div className="col-count">No. of Questions</div>
        <div className="col-marks">Marks</div>
      </div>

      <div className="rows-container">
        {rows.map((row) => (
          <div key={row.id} className="question-row">
            <div className="col-type">
              <select 
                className="form-select type-select"
                value={row.type}
                onChange={(e) => updateRow(row.id, { type: e.target.value })}
              >
                {AVAILABLE_TYPES.map(type => (
                  <option 
                    key={type.value} 
                    value={type.value}
                    disabled={rows.some(r => r.id !== row.id && r.type === type.value)}
                  >
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              type="button" 
              className="remove-row-btn"
              onClick={() => removeRow(row.id)}
              disabled={rows.length <= 1}
            >
              <X size={16} />
            </button>

            <div className="col-count">
              <CounterInput 
                value={row.count} 
                onChange={(val) => updateRow(row.id, { count: val })} 
                min={1} 
                max={50} 
              />
            </div>

            <div className="col-marks">
              <CounterInput 
                value={row.marksPerQuestion} 
                onChange={(val) => updateRow(row.id, { marksPerQuestion: val })} 
                min={1} 
                max={20} 
              />
            </div>
          </div>
        ))}
      </div>

      <div className="actions-row">
        <button 
          type="button" 
          className="btn btn-ghost add-btn"
          onClick={addRow}
          disabled={rows.length >= AVAILABLE_TYPES.length}
        >
          <div className="add-icon-bg">
            <Plus size={14} color="white" />
          </div>
          Add Question Type
        </button>

        <div className="totals-summary">
          <p>Total Questions: <strong>{totalQuestions}</strong></p>
          <p>Total Marks: <strong>{totalMarks}</strong></p>
        </div>
      </div>

      <style jsx>{`
        .manager-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .table-header {
          display: flex;
          padding-right: 32px; /* space for the X button */
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .rows-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .question-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .col-type {
          flex: 1;
        }

        .type-select {
          border-radius: var(--radius-full);
          padding: 0.6rem 1rem;
          cursor: pointer;
        }

        .col-count, .col-marks {
          width: 100px;
          display: flex;
          justify-content: center;
        }

        .remove-row-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
          border-radius: 50%;
        }

        .remove-row-btn:hover:not(:disabled) {
          background: #FEE2E2;
          color: var(--error);
        }

        .remove-row-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .actions-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-top: 0.5rem;
        }

        .add-btn {
          font-weight: 600;
          color: var(--text-primary);
          padding: 0.5rem;
        }

        .add-icon-bg {
          background-color: var(--brand-dark);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .totals-summary {
          text-align: right;
          font-size: 0.95rem;
          color: var(--text-primary);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
      `}</style>
    </div>
  );
}

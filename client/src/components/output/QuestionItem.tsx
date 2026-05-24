import { IQuestion } from "@/types";

export function QuestionItem({ question }: { question: IQuestion }) {
  // Helper to format difficulty for display
  const formatDifficulty = (diff: string) => {
    return diff.charAt(0).toUpperCase() + diff.slice(1);
  };

  return (
    <div className="question-item">
      <div className="question-text">
        {question.questionNumber}. [{formatDifficulty(question.difficulty)}] {question.text} [{question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}]
      </div>
      
      {question.type === 'mcq' && question.options && (
        <div className="question-options">
          {question.options.map((opt, i) => (
            <div key={i} className="option-item">
              {String.fromCharCode(97 + i)}) {opt.replace(/^[A-D]\)\s*/, '')}
            </div>
          ))}
        </div>
      )}
      
      {/* Blank space for answering based on type */}
      {(question.type === 'short_answer' || question.type === 'long_answer') && (
        <div className="answer-blank"></div>
      )}

      <style jsx>{`
        .question-item {
          margin-bottom: 1.5rem;
          font-family: inherit;
        }

        .question-text {
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 0.5rem;
        }

        .question-options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-left: 1.5rem;
          margin-top: 0.5rem;
        }

        .option-item {
          font-size: 0.95rem;
        }

        .answer-blank {
          margin-top: 2rem;
          margin-bottom: 1rem;
          border-bottom: 1px dashed #ccc;
          min-height: ${question.type === 'long_answer' ? '120px' : '60px'};
        }
      `}</style>
    </div>
  );
}

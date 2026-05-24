import { IGeneratedPaper } from "@/types";

export function PaperHeader({ paper }: { paper: IGeneratedPaper }) {
  // Use mock school name since it's not in the DB schema for now
  const schoolName = "Delhi Public School, Sector-4, Bokaro";
  
  return (
    <div className="paper-header">
      <h1 className="paper-title">{schoolName}</h1>
      <h2 className="paper-subtitle">Subject: {paper.subject}</h2>
      <h2 className="paper-subtitle">Class: 5th</h2>

      <div className="paper-meta">
        <span>Time Allowed: 45 minutes</span>
        <span>Maximum Marks: {paper.totalMarks}</span>
      </div>

      <div className="general-instructions">
        All questions are compulsory unless stated otherwise.
      </div>

      <style jsx>{`
        .paper-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .paper-title {
          font-size: 1.25rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #000;
        }

        .paper-subtitle {
          font-size: 1.1rem;
          font-weight: normal;
          margin-bottom: 0.25rem;
          color: #000;
        }

        .paper-meta {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
          margin-bottom: 1.5rem;
          font-weight: normal;
          font-size: 0.95rem;
        }

        .general-instructions {
          text-align: left;
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
        }
      `}</style>
    </div>
  );
}

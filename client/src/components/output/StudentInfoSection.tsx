export function StudentInfoSection() {
  return (
    <div className="student-info-section">
      <div className="info-line">
        <span className="info-label">Name:</span>
        <div className="info-blank name-blank"></div>
      </div>
      <div className="info-line">
        <span className="info-label">Roll Number:</span>
        <div className="info-blank roll-blank"></div>
      </div>
      <div className="info-line">
        <span className="info-label">Class: 5th</span>
        <span className="info-label section-label">Section:</span>
        <div className="info-blank section-blank"></div>
      </div>

      <style jsx>{`
        .student-info-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 3rem;
          font-family: "Times New Roman", Times, serif;
          font-size: 0.95rem;
        }

        .info-line {
          display: flex;
          align-items: flex-end;
        }

        .info-label {
          margin-right: 0.5rem;
          white-space: nowrap;
        }

        .section-label {
          margin-left: 1rem;
        }

        .info-blank {
          border-bottom: 1px solid #000;
          height: 1.2rem;
        }

        .name-blank {
          width: 250px;
        }

        .roll-blank {
          width: 200px;
        }

        .section-blank {
          width: 100px;
        }
      `}</style>
    </div>
  );
}

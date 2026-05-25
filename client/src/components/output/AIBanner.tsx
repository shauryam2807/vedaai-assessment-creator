import { Download } from "lucide-react";

interface AIBannerProps {
  userName?: string;
  subject?: string;
  grade?: string;
  onDownload: () => void;
}

export function AIBanner({ 
  userName = "Lakshya", 
  subject = "Science", 
  grade = "Grade 8",
  onDownload 
}: AIBannerProps) {
  return (
    <div className="ai-response-block hide-on-print">
      <p className="ai-response-text">
        Certainly, {userName}! Here are customized Question Paper for your {grade} {subject} classes on the NCERT chapters:
      </p>
      
      <button className="download-pdf-btn" onClick={onDownload}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 1v8M4 6l3 3 3-3"/>
          <path d="M2 10v2a1 1 0 001 1h8a1 1 0 001-1v-2"/>
        </svg>
        Download as PDF
      </button>

      <style jsx>{`
        .ai-response-block {
          background: #2C2C2C;
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
          padding: 22px 28px;
          color: white;
          margin-bottom: 0;
        }

        .ai-response-text {
          font-size: 14.5px;
          font-weight: 500;
          line-height: 1.65;
          margin-bottom: 16px;
        }

        .download-pdf-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: white;
          color: var(--text-primary);
          border: none;
          border-radius: var(--radius-full);
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 600;
          transition: opacity 0.18s;
          cursor: pointer;
          font-family: var(--font);
        }
        .download-pdf-btn:hover {
          opacity: 0.88;
        }

        @media (max-width: 768px) {
          .ai-response-block {
            padding: 16px 20px;
            border-radius: var(--radius-lg) var(--radius-lg) 0 0;
          }
        }
      `}</style>
    </div>
  );
}

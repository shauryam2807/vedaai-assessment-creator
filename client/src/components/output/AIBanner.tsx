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
    <div className="ai-banner hide-on-print">
      <p className="ai-message">
        Certainly, {userName}! Here are customized Question Paper for your {grade} {subject} classes on the NCERT chapters:
      </p>
      
      <button className="btn btn-outline download-btn" onClick={onDownload}>
        <Download size={16} />
        Download as PDF
      </button>

      <style jsx>{`
        .ai-banner {
          background-color: var(--bg-banner);
          color: white;
          padding: 1.5rem 2rem;
          border-radius: var(--radius-lg);
          margin-bottom: -1rem; /* Overlaps slightly with paper below or just sits above */
          padding-bottom: 2.5rem; /* Extra padding at bottom to look like it wraps */
          position: relative;
          z-index: 1;
        }

        .ai-message {
          font-size: 1.05rem;
          line-height: 1.5;
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .download-btn {
          background-color: white;
          color: var(--bg-banner);
          border: none;
          font-weight: 600;
        }
        
        .download-btn:hover {
          background-color: var(--bg-hover);
        }

        @media (max-width: 768px) {
          .ai-banner {
            padding: 1rem 1.5rem 2rem;
            border-radius: 0;
            margin-left: -1rem;
            margin-right: -1rem;
            margin-top: -1rem;
          }
        }
      `}</style>
    </div>
  );
}

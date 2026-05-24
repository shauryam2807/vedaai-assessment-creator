import { Printer, RefreshCw } from "lucide-react";
import { useAssignmentStore } from "@/store/useAssignmentStore";

export function ActionBar({ assignmentId, paperId }: { assignmentId: string, paperId: string }) {
  const { regenerate, generationStatus } = useAssignmentStore();

  const handleRegenerate = async () => {
    if (confirm("Are you sure you want to regenerate this paper? The current one will be lost.")) {
      await regenerate(assignmentId);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="action-bar hide-on-print">
      <button 
        className="btn btn-outline" 
        onClick={handleRegenerate}
        disabled={generationStatus === 'processing'}
      >
        <RefreshCw size={16} className={generationStatus === 'processing' ? 'spin' : ''} />
        Regenerate Paper
      </button>

      <button 
        className="btn btn-primary" 
        onClick={handlePrint}
      >
        <Printer size={16} />
        Print Paper
      </button>

      <style jsx>{`
        .action-bar {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 3rem;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

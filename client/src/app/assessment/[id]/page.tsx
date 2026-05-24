"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { GeneratingOverlay } from "@/components/shared/GeneratingOverlay";
import { QuestionPaper } from "@/components/output/QuestionPaper";
import { AIBanner } from "@/components/output/AIBanner";
import { api } from "@/lib/api";

export default function AssessmentPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { isConnected } = useWebSocket(id);
  const { generationStatus, generatedPaper, fetchPaper, setAssignmentId } = useAssignmentStore();

  useEffect(() => {
    if (id) {
      setAssignmentId(id);
    }
  }, [id, setAssignmentId]);

  useEffect(() => {
    // Attempt to fetch paper if status is unknown or just loaded
    if (id && !generatedPaper && generationStatus !== 'submitting' && generationStatus !== 'processing') {
      fetchPaper(id);
    }
  }, [id, fetchPaper, generatedPaper, generationStatus]);

  if (generationStatus === 'submitting' || generationStatus === 'processing' || (!generatedPaper && generationStatus !== 'failed')) {
    return <GeneratingOverlay />;
  }

  if (generationStatus === 'failed') {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <h2>Generation Failed</h2>
        <p style={{ color: 'var(--error)' }}>Something went wrong. Please try again.</p>
        <button className="btn btn-primary" onClick={() => window.location.href='/create'} style={{ marginTop: '1rem' }}>
          Back to Create
        </button>
      </div>
    );
  }

  if (!generatedPaper) return null;

  const handleDownload = () => {
    window.open(api.getDownloadPDFUrl(id), '_blank');
  };

  return (
    <div style={{ paddingBottom: '5rem', maxWidth: '900px', margin: '0 auto' }}>
      <AIBanner 
        userName="Teacher" 
        grade={generatedPaper.subject} // Optional mapping since paper model doesn't explicitly store gradeLevel
        subject={generatedPaper.subject}
        onDownload={handleDownload} 
      />
      <div style={{ marginTop: '1rem' }}>
        <QuestionPaper paper={generatedPaper} />
      </div>
    </div>
  );
}

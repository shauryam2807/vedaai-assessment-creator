import { useAssignmentStore } from "@/store/useAssignmentStore";

export function GeneratingOverlay() {
  const { generationProgress, progressMessage } = useAssignmentStore();

  return (
    <div className="generating-overlay">
      <div className="generating-content">
        <div className="spinner-container">
          <div className="spinner-outer"></div>
          <div className="spinner-inner"></div>
        </div>
        
        <h2>Generating Assessment...</h2>
        
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{ width: `${generationProgress}%` }}
          ></div>
        </div>
        
        <p style={{ color: 'var(--text-secondary)' }}>
          {progressMessage || 'Initializing AI model...'}
        </p>
      </div>
    </div>
  );
}

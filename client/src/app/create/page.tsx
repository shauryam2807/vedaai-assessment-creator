"use client";

import { AssignmentForm } from "@/components/forms/AssignmentForm";

export default function CreatePage() {
  return (
    <div className="create-page-container">
      <div className="create-header">
        <div className="title-row">
          <div className="status-dot"></div>
          <h1 className="page-title">Create Assignment</h1>
        </div>
        <p className="page-subtitle">Set up a new assignment for your students</p>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar-fill"></div>
        {/* We can split it visually into steps like Figma */}
        <div className="progress-step step-1 active"></div>
        <div className="progress-step step-2"></div>
      </div>

      <AssignmentForm />

      <style jsx>{`
        .create-page-container {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding-bottom: 4rem;
        }

        .create-header {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          background-color: var(--brand-green);
          border-radius: 50%;
        }

        .page-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .page-subtitle {
          color: var(--text-secondary);
          font-size: 0.95rem;
          margin-left: calc(12px + 0.75rem); /* Align with title text */
        }

        .progress-bar-container {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .progress-step {
          flex: 1;
          height: 4px;
          background-color: var(--border-light);
          border-radius: 2px;
        }

        .progress-step.active {
          background-color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}

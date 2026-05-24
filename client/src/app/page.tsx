"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, Plus, FileQuestion, Sparkles } from "lucide-react";
import { AssignmentCard } from "@/components/ui/AssignmentCard";
import { EmptyStateIllustration } from "@/components/ui/EmptyStateIllustration";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { assignments, isLoadingAssignments, fetchAssignments, removeAssignment } = useAssignmentStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAssignments().catch(err => {
      console.error("Failed to fetch assignments:", err);
      // We don't show toast here as it might be annoying on load if backend is down
    });
  }, [fetchAssignments]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAssignments(searchQuery);
  };

  const handleDelete = async (id: string) => {
    try {
      await removeAssignment(id);
      toast.success("Assignment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete assignment");
    }
  };

  // Mock data for display purposes if backend is completely empty and we want to see the UI
  // I'll leave this empty for now and let the empty state show.

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">
            <span className="title-dot"></span>
            Assignments
          </h1>
          <p className="page-subtitle">Manage and create assignments for your classes</p>
        </div>
        
        <div className="header-actions">
          <Link href="/create">
            <button className="btn btn-primary hide-mobile">
              <Plus size={18} />
              Create Assignment
            </button>
          </Link>
        </div>
      </div>

      <div className="dashboard-controls">
        <button className="btn btn-outline filter-btn">
          <Filter size={18} />
          Filter By
        </button>
        
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search Assignment" 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>

      {isLoadingAssignments ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading assignments...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="empty-state">
          <EmptyStateIllustration />
          <h2 className="empty-title">No assignments yet</h2>
          <p className="empty-subtitle">
            Create your first assignment to start collecting and grading student<br/>
            submissions. You can set up rubrics, define marking criteria, and let AI<br/>
            assist with grading.
          </p>
          <Link href="/create" style={{ textDecoration: 'none' }}>
            <button className="btn empty-action">
              <Plus size={18} strokeWidth={2.5} />
              Create Your First Assignment
            </button>
          </Link>
        </div>
      ) : (
        <div className="assignments-grid">
          {assignments.map(assignment => (
            <AssignmentCard 
              key={assignment._id} 
              assignment={assignment} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .dashboard-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          height: 100%;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .page-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .title-dot {
          width: 12px;
          height: 12px;
          background-color: var(--brand-green);
          border-radius: 50%;
          display: inline-block;
        }

        .page-subtitle {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .dashboard-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .filter-btn {
          border-radius: var(--radius-full);
          padding: 0.5rem 1rem;
          font-weight: 500;
        }

        .search-form {
          flex: 1;
          max-width: 400px;
        }

        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
        }

        .search-input {
          width: 100%;
          background-color: var(--bg-white);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-full);
          padding: 0.6rem 1rem 0.6rem 2.5rem;
          font-family: inherit;
          font-size: 0.9rem;
          color: var(--text-primary);
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--border-focus);
          box-shadow: 0 0 0 1px var(--border-focus);
        }

        .assignments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
          margin-top: 1rem;
          flex: 1;
        }

        .empty-title {
          font-size: 1.15rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #18181B;
        }

        .empty-subtitle {
          color: #8D8D99;
          font-size: 0.85rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          font-weight: 400;
        }

        .empty-action {
          background-color: #18181B;
          color: white;
          border-radius: var(--radius-full);
          padding: 0.6rem 1.25rem;
          font-weight: 400;
          font-size: 0.85rem;
          border: none;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.2s;
        }
        
        .empty-action:hover {
          background-color: #27272A;
          transform: translateY(-1px);
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          color: var(--text-secondary);
          gap: 1rem;
        }

        .spinner {
          width: 30px;
          height: 30px;
          border: 3px solid var(--border-light);
          border-top-color: var(--brand-accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .hide-mobile {
            display: none;
          }

          .dashboard-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .search-form {
            max-width: 100%;
          }
          
          .assignments-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

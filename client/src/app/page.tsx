"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

  return (
    <div className="dashboard-container">
      {isLoadingAssignments ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading assignments...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="empty-state">
          <EmptyStateIllustration />
          <p className="empty-title">No assignments yet</p>
          <p className="empty-sub">
            Create your first assignment to start collecting and grading student
            submissions. You can set up rubrics, define marking criteria, and let AI
            assist with grading.
          </p>
          <Link href="/create" style={{ textDecoration: 'none' }}>
            <button className="create-first-btn">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="7.5" y1="1" x2="7.5" y2="14"/><line x1="1" y1="7.5" x2="14" y2="7.5"/>
              </svg>
              Create Your First Assignment
            </button>
          </Link>
        </div>
      ) : (
        <>
          {/* List header */}
          <div className="list-page-header">
            <div className="page-title-row">
              <span className="status-dot"></span>
              <h1 className="page-title">Assignments</h1>
            </div>
            <p className="page-sub">Manage and create assignments for your classes.</p>
          </div>

          {/* Filter / Search row */}
          <div className="filter-row">
            <button className="filter-btn">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M1 3h12M3 7h8M5 11h4"/>
              </svg>
              Filter By
            </button>
            <form className="search-wrap" onSubmit={handleSearch}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
                <circle cx="6" cy="6" r="4"/><line x1="10" y1="10" x2="13" y2="13"/>
              </svg>
              <input
                type="text"
                placeholder="Search Assignment"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Cards grid */}
          <div className="cards-grid">
            {assignments.map(assignment => (
              <AssignmentCard
                key={assignment._id}
                assignment={assignment}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Floating create assignment button */}
          <Link href="/create" style={{ textDecoration: 'none' }}>
            <button className="floating-btn">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="7.5" y1="1" x2="7.5" y2="14"/><line x1="1" y1="7.5" x2="14" y2="7.5"/>
              </svg>
              Create Assignment
            </button>
          </Link>
        </>
      )}

      <style jsx>{`
        .dashboard-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          animation: screenIn 0.18s ease;
        }

        @keyframes screenIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── EMPTY STATE ── */
        .empty-state {
          display: flex;
          height: 100%;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          gap: 10px;
        }

        .empty-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .empty-sub {
          font-size: 13.5px;
          color: var(--text-secondary);
          max-width: 360px;
          line-height: 1.65;
        }

        .create-first-btn {
          margin-top: 14px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: var(--bg-dark-btn);
          color: white;
          border: none;
          border-radius: var(--radius-full);
          padding: 14px 28px;
          font-size: 14px;
          font-weight: 600;
          transition: opacity 0.18s, transform 0.18s;
          cursor: pointer;
          font-family: var(--font);
        }
        .create-first-btn:hover {
          opacity: 0.85;
          transform: translateY(-2px);
        }

        /* ── LIST VIEW ── */
        .list-page-header {
          margin-bottom: 20px;
        }

        .page-title-row {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 3px;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          background: var(--success);
          border-radius: 50%;
        }

        .page-title {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.3px;
          margin: 0;
        }

        .page-sub {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .filter-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-light);
          margin-bottom: 22px;
          gap: 12px;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          padding: 7px 12px;
          border-radius: var(--radius-sm);
          transition: background 0.14s;
          cursor: pointer;
          font-family: var(--font);
        }
        .filter-btn:hover {
          background: var(--border-light);
        }

        .search-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-white);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 8px 12px;
          width: 270px;
        }
        .search-wrap input {
          border: none;
          outline: none;
          font-size: 13px;
          color: var(--text-primary);
          background: transparent;
          width: 100%;
          font-family: var(--font);
        }
        .search-wrap input::placeholder {
          color: var(--text-muted);
        }

        .cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          padding-bottom: 80px;
        }

        /* ── FLOATING BUTTON ── */
        .floating-btn {
          position: fixed;
          bottom: 30px;
          left: calc(var(--sidebar-w) + 50%);
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 7px;
          background: var(--bg-dark-btn);
          color: white;
          border: none;
          border-radius: var(--radius-full);
          padding: 13px 26px;
          font-size: 14px;
          font-weight: 600;
          box-shadow: var(--shadow-lg);
          transition: opacity 0.18s, transform 0.18s;
          z-index: 50;
          cursor: pointer;
          font-family: var(--font);
        }
        .floating-btn:hover {
          opacity: 0.88;
          transform: translateX(-50%) translateY(-2px);
        }

        /* ── LOADING STATE ── */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          color: var(--text-secondary);
          gap: 1rem;
          flex: 1;
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

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .cards-grid {
            grid-template-columns: 1fr;
          }
          .search-wrap {
            width: 100%;
          }
          .filter-row {
            flex-wrap: wrap;
          }
          .floating-btn {
            display: none;
          }
          .empty-state {
            padding: 20px 20px 80px;
          }
        }
      `}</style>
    </div>
  );
}

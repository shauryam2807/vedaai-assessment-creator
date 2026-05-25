"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { IAssignment } from "@/types";

interface AssignmentCardProps {
  assignment: IAssignment;
  onDelete: (id: string) => void;
}

export function AssignmentCard({ assignment, onDelete }: AssignmentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format dates: '20-06-2025' format like in Figma
  const formatShortDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const assignedDate = assignment.generatedPaperId ? formatShortDate(new Date()) : formatShortDate(new Date());
  const dueDate = formatShortDate(assignment.dueDate);

  return (
    <div className="asgn-card">
      <div className="card-top">
        <span className="card-title">{assignment.title}</span>
        <div className="menu-container" ref={menuRef}>
          <button
            className="card-three-dot"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
          >
            <svg width="4" height="16" viewBox="0 0 4 16" fill="currentColor">
              <circle cx="2" cy="2" r="1.5"/>
              <circle cx="2" cy="8" r="1.5"/>
              <circle cx="2" cy="14" r="1.5"/>
            </svg>
          </button>

          {menuOpen && (
            <div className="ctx-menu">
              <Link
                href={`/assessment/${assignment._id}`}
                className="ctx-item"
                onClick={() => setMenuOpen(false)}
              >
                View Assignment
              </Link>
              <button
                className="ctx-item danger"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this assignment?")) {
                    onDelete(assignment._id);
                  }
                  setMenuOpen(false);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="card-bottom">
        <div className="card-date">
          <span className="date-label">Assigned on </span>
          <span className="date-val">: {assignedDate}</span>
        </div>
        <div className="card-date">
          <span className="date-label">Due </span>
          <span className="date-val">: {dueDate}</span>
        </div>
      </div>

      <style jsx>{`
        .asgn-card {
          background: var(--bg-white);
          border-radius: var(--radius-lg);
          padding: 20px 22px 18px;
          box-shadow: var(--shadow-sm);
          position: relative;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .asgn-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-1px);
        }

        .card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 28px;
        }

        .card-title {
          font-size: 15.5px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .menu-container {
          position: relative;
        }

        .card-three-dot {
          background: transparent;
          border: none;
          padding: 3px 5px;
          border-radius: 5px;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          transition: background 0.14s;
          cursor: pointer;
        }
        .card-three-dot:hover {
          background: var(--border-light);
        }

        .ctx-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 10px;
          box-shadow: var(--shadow-dropdown);
          min-width: 160px;
          z-index: 200;
          overflow: hidden;
          animation: menuPop 0.12s ease-out;
        }

        .ctx-item {
          padding: 12px 16px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.1s;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          font-family: var(--font);
          color: var(--text-primary);
          display: block;
          text-decoration: none;
        }
        .ctx-item:hover {
          background: var(--bg-hover);
        }
        .ctx-item.danger {
          color: var(--error);
        }
        .ctx-item.danger:hover {
          background: #FEE2E2;
        }

        .card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12.5px;
        }

        .date-label {
          font-weight: 700;
          color: var(--text-primary);
        }

        .date-val {
          color: var(--text-secondary);
        }

        @keyframes menuPop {
          from { opacity: 0; transform: scale(0.95) translateY(-4px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </div>
  );
}

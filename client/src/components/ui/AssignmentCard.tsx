"use client";

import { MoreVertical, Trash2, Eye } from "lucide-react";
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

  const assignedDate = assignment.generatedPaperId ? formatShortDate(new Date()) : formatShortDate(new Date()); // Assuming creation date is now for mockup, ideally from DB
  const dueDate = formatShortDate(assignment.dueDate);

  return (
    <div className="assignment-card">
      <div className="card-header">
        <h3 className="card-title">{assignment.title}</h3>
        <div className="menu-container" ref={menuRef}>
          <button 
            className="menu-trigger" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MoreVertical size={20} />
          </button>
          
          {menuOpen && (
            <div className="dropdown-menu">
              <Link href={`/assessment/${assignment._id}`} className="dropdown-item">
                <Eye size={16} />
                View Assignment
              </Link>
              <button 
                className="dropdown-item delete-item" 
                onClick={() => {
                  if (confirm("Are you sure you want to delete this assignment?")) {
                    onDelete(assignment._id);
                  }
                  setMenuOpen(false);
                }}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="card-footer">
        <span className="date-info">Assigned on: {assignedDate}</span>
        <span className="date-info">Due: {dueDate}</span>
      </div>

      <style jsx>{`
        .assignment-card {
          background-color: var(--bg-white);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          box-shadow: var(--shadow-card);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .assignment-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .card-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          padding-right: 1rem;
        }

        .menu-container {
          position: relative;
        }

        .menu-trigger {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          transition: background-color 0.2s, color 0.2s;
        }

        .menu-trigger:hover {
          background-color: var(--bg-hover);
          color: var(--text-primary);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: var(--bg-white);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-dropdown);
          padding: 0.5rem;
          min-width: 160px;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.75rem;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.2s;
          text-decoration: none;
        }

        .dropdown-item:hover {
          background-color: var(--bg-hover);
        }

        .delete-item {
          color: var(--error);
        }

        .delete-item:hover {
          background-color: #FEE2E2;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .date-info {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAssignmentStore } from "@/store/useAssignmentStore";

export function Sidebar() {
  const pathname = usePathname();
  const { assignments } = useAssignmentStore();

  const navItems = [
    { href: "/", label: "Home", icon: "home", isActive: false },
    { href: "#", label: "My Groups", icon: "groups", isActive: false },
    { href: "/", label: "Assignments", icon: "assignments", isActive: true, showBadge: true },
    { href: "#", label: "AI Teacher's Toolkit", icon: "ai-toolkit", isActive: false },
    { href: "#", label: "My Library", icon: "library", isActive: false },
  ];

  const navIcons: Record<string, React.ReactNode> = {
    home: (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <rect x="2" y="2" width="6" height="6" rx="1.5"/><rect x="10" y="2" width="6" height="6" rx="1.5"/>
        <rect x="2" y="10" width="6" height="6" rx="1.5"/><rect x="10" y="10" width="6" height="6" rx="1.5"/>
      </svg>
    ),
    groups: (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" width="18" height="18">
        <circle cx="7" cy="6" r="3"/><circle cx="13" cy="7" r="2.2"/>
        <path d="M1 15c0-3 2.7-5 6-5s6 2 6 5"/><path d="M13 10c1.8.3 4 1.4 4 4"/>
      </svg>
    ),
    assignments: (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <rect x="3" y="2" width="12" height="14" rx="2"/>
        <path d="M6 6h6M6 9h6M6 12h4"/>
      </svg>
    ),
    "ai-toolkit": (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" width="18" height="18">
        <rect x="2" y="3" width="14" height="10" rx="2"/>
        <path d="M6 16h6M9 13v3"/>
        <path d="M6 7.5 L9 10 L12 7.5" strokeWidth="1.5"/>
      </svg>
    ),
    library: (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <path d="M4 2h7l3 3v11a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z"/>
        <path d="M11 2v4h4M6 9h6M6 12h4"/>
      </svg>
    ),
  };

  return (
    <aside className="sidebar hide-on-print">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 15 L10 4 L16 15" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 11 L13 11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="logo-text">VedaAI</span>
      </div>

      {/* Create Button */}
      <Link href="/create" style={{ textDecoration: 'none' }}>
        <button className="sidebar-create-btn">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="8" y1="2" x2="8" y2="14"/><line x1="2" y1="8" x2="14" y2="8"/>
          </svg>
          Create Assignment
        </button>
      </Link>

      {/* Navigation */}
      <nav className="nav-list">
        {navItems.map((item) => {
          const active = item.isActive || pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`nav-item ${active ? "active" : ""}`}
            >
              {navIcons[item.icon]}
              <span>{item.label}</span>
              {item.showBadge && (
                <span className="nav-badge">{assignments.length || 0}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="settings-nav">
          <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" width="18" height="18">
            <circle cx="9" cy="9" r="2.5"/>
            <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.2 3.2l1.4 1.4M13.4 13.4l1.4 1.4M3.2 14.8l1.4-1.4M13.4 4.6l1.4-1.4"/>
          </svg>
          Settings
        </div>
        <div className="school-card">
          <div className="school-avatar-wrap">🏫</div>
          <div className="school-info">
            <div className="school-name">Delhi Public School</div>
            <div className="school-city">Bokaro Steel City</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sidebar {
          width: var(--sidebar-w);
          min-width: var(--sidebar-w);
          background: var(--bg-white);
          height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 20px 14px 18px;
          border-right: 1px solid var(--border-light);
          flex-shrink: 0;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 6px 8px;
          margin-bottom: 22px;
        }

        .logo-icon {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: linear-gradient(145deg, #E84E1B 0%, #F97316 55%, #FBAE5C 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(232,78,27,0.35);
        }

        .logo-text {
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.3px;
          color: var(--text-primary);
        }

        .sidebar-create-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          background: var(--bg-dark-btn);
          color: #fff;
          border: none;
          border-radius: var(--radius-full);
          padding: 12px 20px;
          font-size: 13.5px;
          font-weight: 600;
          width: 100%;
          margin-bottom: 24px;
          transition: opacity 0.18s, transform 0.18s;
          cursor: pointer;
          font-family: var(--font);
        }
        .sidebar-create-btn:hover {
          opacity: 0.84;
          transform: translateY(-1px);
        }

        .nav-list {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: background 0.14s, color 0.14s;
          margin-bottom: 1px;
          position: relative;
          text-decoration: none;
        }
        .nav-item:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }
        .nav-item.active {
          background: var(--bg-active);
          color: var(--text-primary);
          font-weight: 600;
        }

        .nav-badge {
          margin-left: auto;
          background: var(--orange);
          color: white;
          font-size: 11px;
          font-weight: 700;
          border-radius: 20px;
          padding: 2px 7px;
          min-width: 20px;
          text-align: center;
        }

        .sidebar-footer {
          border-top: 1px solid var(--border-light);
          padding-top: 14px;
        }

        .settings-nav {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          margin-bottom: 10px;
          transition: background 0.14s;
        }
        .settings-nav:hover {
          background: var(--bg-hover);
        }

        .school-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          background: var(--bg-active);
          cursor: pointer;
        }

        .school-avatar-wrap {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          background: #F3DEC0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .school-info .school-name {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .school-info .school-city {
          font-size: 12px;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .sidebar {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
}

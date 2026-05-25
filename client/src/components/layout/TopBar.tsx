"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function TopBar() {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.startsWith('/create')) return 'Create New';
    if (pathname.startsWith('/assessment')) return 'Create New';
    return 'Assignment';
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="mob-topbar hide-on-print">
        <div className="mob-logo">
          <div className="mob-logo-icon">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M4 15 L10 4 L16 15" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 11 L13 11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          VedaAI
        </div>
        <div className="mob-actions">
          <button className="mob-icon-btn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M10 2a6 6 0 016 6v3l1.5 2.5H2.5L4 11V8a6 6 0 016-6z"/>
              <path d="M8.5 17a1.5 1.5 0 003 0"/>
            </svg>
            <span className="notif-dot"></span>
          </button>
          <div className="mob-user-avatar">J</div>
          <button className="mob-icon-btn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="5" x2="17" y2="5"/>
              <line x1="3" y1="10" x2="17" y2="10"/>
              <line x1="3" y1="15" x2="17" y2="15"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Desktop Top Bar */}
      <header className="topbar hide-on-print">
        <div className="topbar-left">
          {pathname !== '/' && (
            <Link href="/" className="topbar-back">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 3L5 8l5 5"/>
              </svg>
            </Link>
          )}

          <div className="topbar-breadcrumb">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" width="15" height="15" style={{ opacity: 0.7 }}>
              <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1"/>
              <rect x="9" y="1.5" width="5.5" height="5.5" rx="1"/>
              <rect x="1.5" y="9" width="5.5" height="5.5" rx="1"/>
              <rect x="9" y="9" width="5.5" height="5.5" rx="1"/>
            </svg>
            <span className="breadcrumb-text">{getTitle()}</span>
          </div>
        </div>

        <div className="topbar-right">
          <div className="notif-wrap">
            <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M10 2a6 6 0 016 6v3l1.5 2.5H2.5L4 11V8a6 6 0 016-6z"/>
              <path d="M8.5 17a1.5 1.5 0 003 0"/>
            </svg>
            <span className="notif-dot"></span>
          </div>

          <div className="user-chip">
            <div className="user-avatar">J</div>
            <span className="user-name">John Doe</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="chevron-down">
              <path d="M3 5l4 4 4-4"/>
            </svg>
          </div>
        </div>
      </header>

      <style jsx>{`
        /* ── DESKTOP TOP BAR ── */
        .topbar {
          height: var(--topbar-h);
          background: var(--bg-white);
          border-bottom: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          flex-shrink: 0;
        }

        .topbar-left, .topbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .topbar-back {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: background 0.14s;
          text-decoration: none;
        }
        .topbar-back:hover {
          background: var(--bg-hover);
        }

        .topbar-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .breadcrumb-text {
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 400;
        }

        .notif-wrap {
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.14s;
          color: var(--text-primary);
        }
        .notif-wrap:hover {
          background: var(--bg-hover);
        }

        .notif-dot {
          position: absolute;
          top: 7px;
          right: 7px;
          width: 8px;
          height: 8px;
          background: var(--orange);
          border-radius: 50%;
          border: 1.5px solid white;
        }

        .user-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 10px 4px 5px;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: background 0.14s;
        }
        .user-chip:hover {
          background: var(--bg-hover);
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f093fb, #f5576c);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 13px;
          font-weight: 700;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .chevron-down {
          color: var(--text-secondary);
        }

        /* ── MOBILE TOP BAR ── */
        .mob-topbar {
          display: none;
          height: 56px;
          background: white;
          border-bottom: 1px solid var(--border-light);
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          flex-shrink: 0;
        }

        .mob-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 800;
        }

        .mob-logo-icon {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: linear-gradient(145deg, #E84E1B 0%, #F97316 55%, #FBAE5C 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .mob-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mob-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          cursor: pointer;
          position: relative;
          color: var(--text-primary);
        }

        .mob-user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f093fb, #f5576c);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 13px;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .topbar {
            display: none;
          }
          .mob-topbar {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}

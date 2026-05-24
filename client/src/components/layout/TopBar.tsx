"use client";

import { ArrowLeft, Bell, ChevronDown, Menu, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TopBar() {
  const pathname = usePathname();

  return (
    <header className="topbar hide-on-print">
      <div className="topbar-left">
        <button className="icon-btn mobile-menu-btn">
          <Menu size={20} />
        </button>
        
        {pathname !== '/' && (
          <Link href="/" className="icon-btn back-btn" style={{ marginRight: '-8px' }}>
            <ArrowLeft size={18} strokeWidth={2.5} />
          </Link>
        )}
        
        <div className="breadcrumb">
          <div className="breadcrumb-icon">
            <LayoutGrid size={16} strokeWidth={2.5} />
          </div>
          <span className="breadcrumb-text" style={{ fontSize: '0.9rem', color: '#6B6B7B' }}>Assignment</span>
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-btn notification-btn">
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>

        <div className="user-menu">
          <div className="user-avatar-small">
            <img src="https://ui-avatars.com/api/?name=JD&background=F3F4F6&color=1A1A1A" alt="John Doe" />
          </div>
          <span className="user-name">John Doe</span>
          <ChevronDown size={16} className="dropdown-icon" />
        </div>
      </div>

      <style jsx>{`
        .topbar {
          height: var(--topbar-h);
          background-color: var(--bg-topbar);
          border-radius: 16px;
          margin: 12px 12px 0 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 12px;
          z-index: 40;
        }

        .topbar-left, .topbar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .icon-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .icon-btn:hover {
          background-color: var(--bg-hover);
          color: var(--text-primary);
        }

        .mobile-menu-btn {
          display: none;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.95rem;
        }

        .breadcrumb-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
        }

        .notification-btn {
          position: relative;
        }

        .notification-dot {
          position: absolute;
          top: 8px;
          right: 10px;
          width: 6px;
          height: 6px;
          background-color: var(--brand-accent);
          border-radius: 50%;
          border: 1px solid var(--bg-white);
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-md);
          transition: background-color 0.2s;
        }

        .user-menu:hover {
          background-color: var(--bg-hover);
        }

        .user-avatar-small img {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-name {
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .dropdown-icon {
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .topbar {
            padding: 0 1rem;
          }
          .mobile-menu-btn {
            display: flex;
          }
          .user-name, .dropdown-icon {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}

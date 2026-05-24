"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutGrid, 
  Users, 
  FileText, 
  Box, 
  Clock, 
  Settings,
  Sparkles,
  Shield
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: LayoutGrid },
    { href: "#", label: "My Groups", icon: Users },
    { href: "/", label: "Assignments", icon: FileText, badge: 10, isActive: pathname === "/" || pathname === "/create" || pathname.startsWith("/assessment") },
    { href: "#", label: "AI Teacher's Toolkit", icon: Box },
    { href: "#", label: "My Library", icon: Clock, badge: 32 },
  ];

  return (
    <aside className="sidebar hide-on-print">
      <div className="sidebar-header">
        <Link href="/" className="logo">
          <div className="logo-icon-bg">
            <Shield size={18} color="white" />
          </div>
          <span className="logo-text">VedaAI</span>
        </Link>
      </div>

      <div className="sidebar-content">
        <div className="sidebar-action">
          <Link href="/create" style={{ textDecoration: 'none' }}>
            <button className="btn btn-primary btn-create">
              <Sparkles size={16} />
              Create Assignment
            </button>
          </Link>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive || pathname === item.href;
            
            return (
              <Link 
                key={item.label} 
                href={item.href} 
                className={`nav-item ${active ? "active" : ""}`}
              >
                <div className="nav-item-content">
                  <Icon size={18} className="nav-icon" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer">
        <Link href="#" className="nav-item">
          <div className="nav-item-content">
            <Settings size={18} className="nav-icon" />
            <span>Settings</span>
          </div>
        </Link>
        
        <div className="user-profile">
          <div className="user-avatar">
            <img src="https://ui-avatars.com/api/?name=DPS&background=F3F4F6&color=1A1A1A" alt="DPS" />
          </div>
          <div className="user-info">
            <div className="user-name">Delhi Public School</div>
            <div className="user-school">Bokaro Steel City</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sidebar {
          width: 304px;
          height: calc(100vh - 24px);
          margin: 12px;
          background-color: var(--bg-white);
          position: fixed;
          top: 0;
          left: 0;
          display: flex;
          flex-direction: column;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          z-index: 50;
        }

        .sidebar-header {
          padding: 1.5rem 1.5rem 0.5rem 1.5rem;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--brand-dark);
        }

        .logo-icon-bg {
          background: linear-gradient(135deg, var(--brand-accent), #B83A20);
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          letter-spacing: -0.5px;
        }

        .sidebar-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 1rem 1.5rem;
        }

        .sidebar-action {
          padding: 0;
        }

        .btn-create {
          width: 100%;
          border-radius: var(--radius-full);
          padding: 0.75rem;
          font-weight: 500;
          font-size: 0.95rem;
          background-color: #2F2F32;
          color: white;
          border: 1px solid var(--brand-accent);
          box-shadow: inset 0 0 0 1px rgba(232, 93, 58, 0.5), 0 4px 12px rgba(232, 93, 58, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .btn-create:hover {
          transform: translateY(-1px);
          box-shadow: inset 0 0 0 1px rgba(232, 93, 58, 0.8), 0 6px 16px rgba(232, 93, 58, 0.25);
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .nav-item:hover {
          background-color: var(--bg-hover);
          color: var(--text-primary);
        }

        .nav-item.active {
          background-color: var(--bg-hover);
          color: var(--text-primary);
          font-weight: 600;
        }

        .nav-item-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .nav-icon {
          opacity: 0.8;
        }

        .nav-item.active .nav-icon {
          opacity: 1;
        }

        .nav-badge {
          background-color: var(--brand-accent);
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.15rem 0.6rem;
          border-radius: var(--radius-full);
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0.5rem;
          background-color: #F5F5F7;
          border-radius: var(--radius-lg);
          margin-top: 0.5rem;
        }

        .user-avatar img {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-school {
          font-size: 0.75rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </aside>
  );
}

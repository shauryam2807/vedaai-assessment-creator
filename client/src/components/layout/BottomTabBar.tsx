"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomTabBar() {
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: "Home", isActive: false },
    { href: "/", label: "Assignments", isActive: pathname === "/" || pathname === "/create" || pathname.startsWith("/assessment") },
    { href: "#", label: "Library", isActive: false },
    { href: "#", label: "AI Toolkit", isActive: false },
  ];

  const tabIcons: Record<string, React.ReactNode> = {
    Home: (
      <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="12" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="12" width="7" height="7" rx="1.5"/><rect x="12" y="12" width="7" height="7" rx="1.5"/>
      </svg>
    ),
    Assignments: (
      <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <rect x="4" y="2" width="14" height="18" rx="2"/>
        <path d="M8 8h6M8 12h6M8 16h4"/>
      </svg>
    ),
    Library: (
      <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22">
        <rect x="3" y="3" width="7" height="16" rx="1.5"/><rect x="12" y="3" width="7" height="16" rx="1.5"/>
      </svg>
    ),
    "AI Toolkit": (
      <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22">
        <rect x="2" y="4" width="18" height="12" rx="2"/>
        <path d="M8 19h6M11 16v3"/><path d="M7 9l4 3 4-3"/>
      </svg>
    ),
  };

  return (
    <>
      {/* Floating Action Button for Mobile */}
      <div className="mob-fab-wrap hide-on-print">
        <Link href="/create">
          <button className="mob-fab">+</button>
        </Link>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="mob-bottom-nav hide-on-print">
        {tabs.map((tab) => {
          const active = tab.isActive || pathname === tab.href;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`mob-nav-item ${active ? "active" : ""}`}
            >
              {tabIcons[tab.label]}
              <span className="mob-nav-label">{tab.label}</span>
            </Link>
          );
        })}
      </nav>

      <style jsx>{`
        .mob-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #1C1C1E;
          height: 64px;
          align-items: center;
          justify-content: space-around;
          z-index: 100;
        }

        .mob-fab-wrap {
          display: none;
        }

        .mob-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          cursor: pointer;
          flex: 1;
          padding: 8px 4px;
          color: #555;
          border: none;
          background: transparent;
          text-decoration: none;
        }
        .mob-nav-item.active {
          color: white;
        }

        .mob-nav-label {
          font-size: 10px;
          font-weight: 500;
        }

        .mob-fab {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 4px 16px rgba(0,0,0,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: var(--text-primary);
          font-weight: 300;
        }

        @media (max-width: 768px) {
          .mob-bottom-nav {
            display: flex;
          }
          .mob-fab-wrap {
            display: block;
            position: fixed;
            bottom: 76px;
            right: 16px;
            z-index: 99;
          }
        }
      `}</style>
    </>
  );
}

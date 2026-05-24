"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, FileText, Clock, Box, Plus } from "lucide-react";

export function BottomTabBar() {
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: "Home", icon: LayoutGrid },
    { href: "/", label: "Assignments", icon: FileText, isActive: pathname === "/" || pathname === "/create" || pathname.startsWith("/assessment") },
    { href: "#", label: "Library", icon: Clock },
    { href: "#", label: "AI Toolkit", icon: Box },
  ];

  return (
    <>
      {/* Floating Action Button for Mobile */}
      <div className="fab-container hide-on-print">
        <Link href="/create">
          <button className="fab-btn shadow-lg">
            <Plus size={24} color="white" />
          </button>
        </Link>
      </div>

      <nav className="bottom-tab-bar hide-on-print">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.isActive || pathname === tab.href;

          return (
            <Link 
              key={tab.label} 
              href={tab.href}
              className={`tab-item ${active ? "active" : ""}`}
            >
              <div className="tab-icon-wrapper">
                <Icon size={20} className={active ? "icon-active" : "icon-inactive"} />
              </div>
              <span className="tab-label">{tab.label}</span>
              {active && <div className="tab-indicator"></div>}
            </Link>
          );
        })}
      </nav>

      <style jsx>{`
        .bottom-tab-bar {
          display: none; /* Hidden on desktop */
        }
        
        .fab-container {
          display: none; /* Hidden on desktop */
        }

        @media (max-width: 768px) {
          .bottom-tab-bar {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 70px;
            background-color: var(--brand-dark);
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            justify-content: space-around;
            align-items: center;
            z-index: 50;
            padding-bottom: env(safe-area-inset-bottom);
          }

          .tab-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            width: 25%;
            height: 100%;
            position: relative;
            color: var(--text-muted);
            text-decoration: none;
          }

          .tab-item.active {
            color: white;
          }

          .icon-inactive {
            color: #6B6B7B;
          }

          .icon-active {
            color: white;
          }

          .tab-label {
            font-size: 0.65rem;
            font-weight: 500;
          }

          .tab-indicator {
            position: absolute;
            top: 10px;
            right: 25%;
            width: 4px;
            height: 4px;
            background-color: white;
            border-radius: 50%;
            /* Alternatively, Figma shows a sparkle or dot near the icon */
          }

          .fab-container {
            display: block;
            position: fixed;
            bottom: 90px; /* Above the tab bar */
            right: 20px;
            z-index: 45;
          }

          .fab-btn {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background-color: var(--brand-accent);
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(232, 93, 58, 0.4);
            cursor: pointer;
          }
        }
      `}</style>
    </>
  );
}

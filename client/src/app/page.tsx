"use client";

import { useState } from "react";

interface Assignment {
  id: number;
  title: string;
  assigned: string;
  due: string;
}

const initialAssignments: Assignment[] = [
  { id:1, title:"Quiz on Electricity", assigned:"20-06-2025", due:"21-06-2025" },
  { id:2, title:"Quiz on Electricity", assigned:"20-06-2025", due:"21-06-2025" },
  { id:3, title:"Quiz on Electricity", assigned:"20-06-2025", due:"21-06-2025" },
  { id:4, title:"Quiz on Electricity", assigned:"20-06-2025", due:"21-06-2025" },
  { id:5, title:"Quiz on Electricity", assigned:"20-06-2025", due:"21-06-2025" },
  { id:6, title:"Quiz on Electricity", assigned:"20-06-2025", due:"21-06-2025" },
];

export default function Dashboard() {
  const [currentScreen, setCurrentScreen] = useState<string>("empty");
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  function showScreen(name: string) {
    setCurrentScreen(name);
    setOpenMenuId(null);
  }

  function navClick(id: string) {
    if (id === "assignments") {
      showScreen(assignments.length === 0 ? "empty" : "assignments");
    } else if (id === "ai-toolkit") {
      showScreen("ai");
    } else {
      showScreen("empty");
    }
  }

  function toggleMenu(e: React.MouseEvent, id: number) {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  }

  function viewAssignment(id: number) {
    setOpenMenuId(null);
    showScreen("ai");
  }

  function deleteAssignment(id: number) {
    setOpenMenuId(null);
    const next = assignments.filter(a => a.id !== id);
    setAssignments(next);
    if (next.length === 0) showScreen("empty");
  }

  function closeMenus() {
    setOpenMenuId(null);
  }

  const topbarTitle = currentScreen === "ai" ? "Create New" : "Assignment";
  const activeNav = currentScreen === "ai" ? "" : "assignments";

  return (
    <>
      <style>{`
        /* ─── LAYOUT ─────────────────────────────────────── */
        .app { display: flex; height: 100vh; overflow: hidden; }

        /* ─── SIDEBAR ────────────────────────────────────── */
        .sidebar {
          width: var(--sidebar-w); min-width: var(--sidebar-w);
          background: var(--bg-white); height: 100vh;
          display: flex; flex-direction: column;
          padding: 20px 14px 18px;
          border-right: 1px solid var(--border); flex-shrink: 0;
        }
        .sidebar-logo { display: flex; align-items: center; gap: 9px; padding: 6px 8px; margin-bottom: 22px; }
        .logo-icon {
          width: 34px; height: 34px; border-radius: 8px;
          background: linear-gradient(145deg, #E84E1B 0%, #F97316 55%, #FBAE5C 100%);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; box-shadow: 0 2px 8px rgba(232,78,27,0.35);
        }
        .logo-text { font-size: 18px; font-weight: 800; letter-spacing: -0.3px; color: var(--text-primary); }
        .sidebar-create-btn {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          background: var(--bg-dark-btn); color: #fff; border: none;
          border-radius: var(--radius-pill); padding: 12px 20px;
          font-size: 13.5px; font-weight: 600; width: 100%; margin-bottom: 24px;
          transition: opacity 0.18s, transform 0.18s;
        }
        .sidebar-create-btn:hover { opacity: 0.84; transform: translateY(-1px); }
        .nav-list { flex: 1; }
        .nav-item {
          display: flex; align-items: center; gap: 10px; padding: 10px 12px;
          border-radius: var(--radius-md); font-size: 14px; font-weight: 500;
          color: var(--text-secondary); cursor: pointer;
          transition: background 0.14s, color 0.14s; margin-bottom: 1px; position: relative;
        }
        .nav-item:hover { background: var(--bg-active-nav); color: var(--text-primary); }
        .nav-item.active { background: var(--bg-active-nav); color: var(--text-primary); font-weight: 600; }
        .nav-item svg { width: 18px; height: 18px; flex-shrink: 0; }
        .nav-badge {
          margin-left: auto; background: var(--orange); color: white;
          font-size: 11px; font-weight: 700; border-radius: 20px;
          padding: 2px 7px; min-width: 20px; text-align: center;
        }
        .sidebar-footer { border-top: 1px solid var(--border); padding-top: 14px; }
        .settings-nav {
          display: flex; align-items: center; gap: 10px; padding: 10px 12px;
          border-radius: var(--radius-md); font-size: 14px; font-weight: 500;
          color: var(--text-secondary); cursor: pointer; margin-bottom: 10px; transition: background 0.14s;
        }
        .settings-nav:hover { background: var(--bg-active-nav); }
        .settings-nav svg { width: 18px; height: 18px; }
        .school-card {
          display: flex; align-items: center; gap: 10px; padding: 10px 12px;
          border-radius: 10px; background: var(--bg-active-nav); cursor: pointer;
        }
        .school-avatar-wrap {
          width: 38px; height: 38px; border-radius: 50%; overflow: hidden; flex-shrink: 0;
          background: #F3DEC0; display: flex; align-items: center; justify-content: center; font-size: 20px;
        }
        .school-info .school-name { font-size: 13px; font-weight: 700; color: var(--text-primary); }
        .school-info .school-city { font-size: 12px; color: var(--text-secondary); }

        /* ─── MAIN WRAPPER ───────────────────────────────── */
        .main-wrapper { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

        /* ─── TOP BAR ────────────────────────────────────── */
        .topbar {
          height: var(--topbar-h); background: var(--bg-white);
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; padding: 0 24px; gap: 10px; flex-shrink: 0;
        }
        .topbar-back {
          width: 34px; height: 34px; border-radius: 8px; border: none; background: transparent;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-secondary); transition: background 0.14s;
        }
        .topbar-back:hover { background: var(--bg-active-nav); }
        .topbar-breadcrumb { display: flex; align-items: center; gap: 6px; flex: 1; font-size: 14px; color: var(--text-secondary); }
        .topbar-breadcrumb svg { width: 15px; height: 15px; opacity: 0.7; }
        .topbar-actions { display: flex; align-items: center; gap: 10px; }
        .notif-wrap {
          position: relative; width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.14s; color: var(--text-primary);
        }
        .notif-wrap:hover { background: var(--bg-active-nav); }
        .notif-dot {
          position: absolute; top: 7px; right: 7px; width: 8px; height: 8px;
          background: var(--orange); border-radius: 50%; border: 1.5px solid white;
        }
        .user-chip {
          display: flex; align-items: center; gap: 8px; padding: 4px 10px 4px 5px;
          border-radius: var(--radius-pill); cursor: pointer; transition: background 0.14s;
        }
        .user-chip:hover { background: var(--bg-active-nav); }
        .user-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, #f093fb, #f5576c);
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 13px; font-weight: 700;
        }
        .user-name { font-size: 14px; font-weight: 600; }
        .chevron-down { color: var(--text-secondary); }

        /* ─── PAGE CONTENT ───────────────────────────────── */
        .page-content { flex: 1; overflow-y: auto; padding: 28px 32px; position: relative; }
        .page-content::-webkit-scrollbar { width: 4px; }
        .page-content::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 2px; }
        .page-content::-webkit-scrollbar-track { background: transparent; }

        /* ─── SCREENS ────────────────────────────────────── */
        .screen { display: none; animation: screenIn 0.18s ease; }
        .screen.active { display: block; }
        .screen-empty { display: none; height: 100%; align-items: center; justify-content: center; flex-direction: column; text-align: center; gap: 10px; }
        .screen-empty.active { display: flex; }

        @keyframes screenIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ─── EMPTY STATE ────────────────────────────────── */
        .empty-illus { width: 240px; margin-bottom: 10px; }
        .empty-title { font-size: 18px; font-weight: 700; }
        .empty-sub { font-size: 13.5px; color: var(--text-secondary); max-width: 360px; line-height: 1.65; }
        .create-first-btn {
          margin-top: 14px; display: inline-flex; align-items: center; gap: 7px;
          background: var(--bg-dark-btn); color: white; border: none;
          border-radius: var(--radius-pill); padding: 14px 28px;
          font-size: 14px; font-weight: 600; transition: opacity 0.18s, transform 0.18s;
        }
        .create-first-btn:hover { opacity: 0.85; transform: translateY(-2px); }

        /* ─── ASSIGNMENT LIST ────────────────────────────── */
        .list-page-header { margin-bottom: 20px; }
        .page-title-row { display: flex; align-items: center; gap: 9px; margin-bottom: 3px; }
        .status-dot { width: 10px; height: 10px; background: var(--green); border-radius: 50%; }
        .page-title { font-size: 22px; font-weight: 800; letter-spacing: -0.3px; }
        .page-sub { font-size: 13px; color: var(--text-secondary); }
        .filter-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 0; border-bottom: 1px solid var(--border); margin-bottom: 22px; gap: 12px;
        }
        .filter-btn {
          display: flex; align-items: center; gap: 6px; background: transparent; border: none;
          font-size: 13px; font-weight: 500; color: var(--text-secondary);
          padding: 7px 12px; border-radius: var(--radius-sm); transition: background 0.14s;
        }
        .filter-btn:hover { background: var(--border); }
        .search-wrap {
          display: flex; align-items: center; gap: 8px; background: var(--bg-white);
          border: 1px solid var(--border); border-radius: 8px; padding: 8px 12px; width: 270px;
        }
        .search-wrap input { border: none; outline: none; font-size: 13px; color: var(--text-primary); background: transparent; width: 100%; }
        .search-wrap input::placeholder { color: var(--text-muted); }
        .cards-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding-bottom: 80px; }
        .asgn-card {
          background: var(--bg-white); border-radius: var(--radius-lg);
          padding: 20px 22px 18px; box-shadow: var(--shadow-sm);
          position: relative; transition: box-shadow 0.2s, transform 0.2s;
        }
        .asgn-card:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); }
        .card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; }
        .card-title { font-size: 15.5px; font-weight: 700; }
        .card-three-dot {
          background: transparent; border: none; padding: 3px 5px; border-radius: 5px;
          color: var(--text-secondary); display: flex; align-items: center;
          transition: background 0.14s; position: relative;
        }
        .card-three-dot:hover { background: var(--border); }
        .card-bottom { display: flex; align-items: center; justify-content: space-between; font-size: 12.5px; }
        .date-label { font-weight: 700; color: var(--text-primary); }
        .date-val { color: var(--text-secondary); }

        /* ─── CONTEXT MENU ───────────────────────────────── */
        .ctx-menu {
          position: absolute; top: 40px; right: 14px; background: white;
          border-radius: 10px;
          box-shadow: 0 6px 24px rgba(0,0,0,0.13), 0 0 0 1px rgba(0,0,0,0.04);
          min-width: 160px; z-index: 200; overflow: hidden; display: none;
        }
        .ctx-menu.open { display: block; animation: menuPop 0.12s ease-out; }
        @keyframes menuPop {
          from { opacity:0; transform: scale(0.95) translateY(-4px); }
          to   { opacity:1; transform: scale(1) translateY(0); }
        }
        .ctx-item {
          padding: 12px 16px; font-size: 13px; font-weight: 500; cursor: pointer;
          transition: background 0.1s; border: none; background: transparent;
          width: 100%; text-align: left; font-family: var(--font);
          color: var(--text-primary); display: block;
        }
        .ctx-item:hover { background: var(--bg-active-nav); }
        .ctx-item.danger { color: var(--red); }

        /* ─── FLOATING BUTTON ────────────────────────────── */
        .floating-btn {
          position: fixed; bottom: 30px;
          left: calc(var(--sidebar-w) + 50%); transform: translateX(-50%);
          display: flex; align-items: center; gap: 7px;
          background: var(--bg-dark-btn); color: white; border: none;
          border-radius: var(--radius-pill); padding: 13px 26px;
          font-size: 14px; font-weight: 600; box-shadow: var(--shadow-lg);
          transition: opacity 0.18s, transform 0.18s; z-index: 50;
        }
        .floating-btn:hover { opacity: 0.88; transform: translateX(-50%) translateY(-2px); }

        /* ─── AI / QUESTION PAPER ────────────────────────── */
        .ai-response-block {
          background: var(--bg-ai-header); border-radius: var(--radius-lg) var(--radius-lg) 0 0;
          padding: 22px 28px; color: white; margin-bottom: 0;
        }
        .ai-response-text { font-size: 14.5px; font-weight: 500; line-height: 1.65; margin-bottom: 16px; }
        .download-pdf-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: white; color: var(--text-primary); border: none;
          border-radius: var(--radius-pill); padding: 10px 20px;
          font-size: 13px; font-weight: 600; transition: opacity 0.18s;
        }
        .download-pdf-btn:hover { opacity: 0.88; }
        .question-paper {
          background: white; border-radius: 0 0 var(--radius-lg) var(--radius-lg);
          padding: 40px 52px; box-shadow: var(--shadow-sm);
        }
        .qp-school { text-align: center; margin-bottom: 22px; }
        .qp-school h2 { font-size: 19px; font-weight: 800; letter-spacing: -0.2px; }
        .qp-school p { font-size: 15px; font-weight: 500; margin-top: 4px; }
        .qp-divider { border: none; border-top: 1px solid var(--border); margin: 16px 0; }
        .qp-meta { display: flex; justify-content: space-between; font-size: 13.5px; margin-bottom: 14px; }
        .qp-instruction { font-size: 13.5px; margin-bottom: 14px; font-weight: 500; }
        .qp-field { font-size: 13.5px; margin-bottom: 8px; }
        .qp-section { text-align: center; font-size: 15px; font-weight: 700; margin: 20px 0 10px; }
        .qp-subsec { font-size: 13.5px; font-weight: 700; margin-bottom: 3px; }
        .qp-subsec-note { font-size: 12.5px; font-style: italic; color: var(--text-secondary); margin-bottom: 12px; }
        .qp-q { font-size: 13.5px; line-height: 1.65; margin-bottom: 10px; }

        /* ─── MOBILE TOP BAR ─────────────────────────────── */
        .mob-topbar {
          display: none; height: 56px; background: white;
          border-bottom: 1px solid var(--border);
          align-items: center; justify-content: space-between; padding: 0 16px; flex-shrink: 0;
        }
        .mob-logo { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 800; }
        .mob-actions { display: flex; align-items: center; gap: 8px; }
        .mob-icon-btn {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: none; background: transparent; cursor: pointer; position: relative; color: var(--text-primary);
        }

        /* ─── MOBILE BOTTOM NAV ──────────────────────────── */
        .mob-bottom-nav {
          display: none; position: fixed; bottom: 0; left: 0; right: 0;
          background: #1C1C1E; height: 64px;
          align-items: center; justify-content: space-around; z-index: 100;
        }
        .mob-nav-item {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          cursor: pointer; flex: 1; padding: 8px 4px; color: #555;
          border: none; background: transparent; font-family: var(--font);
        }
        .mob-nav-item.active { color: white; }
        .mob-nav-item svg { width: 22px; height: 22px; }
        .mob-nav-label { font-size: 10px; font-weight: 500; }
        .mob-fab {
          position: fixed; bottom: 76px; right: 16px;
          width: 52px; height: 52px; border-radius: 50%; background: white;
          box-shadow: 0 4px 16px rgba(0,0,0,0.18); display: none;
          align-items: center; justify-content: center;
          border: none; font-size: 24px; cursor: pointer; z-index: 99; color: var(--text-primary);
        }

        /* ─── RESPONSIVE ─────────────────────────────────── */
        @media (max-width: 768px) {
          .app { flex-direction: column; height: 100vh; }
          .sidebar { display: none; }
          .topbar { display: none; }
          .mob-topbar { display: flex; }
          .mob-bottom-nav { display: flex; }
          .mob-fab { display: flex; }
          .page-content { padding: 16px 16px 80px; }
          .cards-grid { grid-template-columns: 1fr; }
          .search-wrap { width: 100%; }
          .filter-row { flex-wrap: wrap; }
          .floating-btn { display: none; }
          .question-paper { padding: 24px 20px; }
          .screen-empty { padding: 20px 20px 80px; }
        }
      `}</style>

      {/* Click anywhere to close menus */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className="app" onClick={closeMenus}>

        {/* ══════════════ SIDEBAR ══════════════ */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 15 L10 4 L16 15" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 11 L13 11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="logo-text">VedaAI</span>
          </div>

          <button className="sidebar-create-btn" onClick={() => showScreen('assignments')}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="8" y1="2" x2="8" y2="14"/><line x1="2" y1="8" x2="14" y2="8"/>
            </svg>
            Create Assignment
          </button>

          <nav className="nav-list">
            <div className="nav-item" onClick={() => navClick('home')}>
              <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="6" height="6" rx="1.5"/><rect x="10" y="2" width="6" height="6" rx="1.5"/>
                <rect x="2" y="10" width="6" height="6" rx="1.5"/><rect x="10" y="10" width="6" height="6" rx="1.5"/>
              </svg>
              Home
            </div>
            <div className="nav-item" onClick={() => navClick('groups')}>
              <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <circle cx="7" cy="6" r="3"/><circle cx="13" cy="7" r="2.2"/>
                <path d="M1 15c0-3 2.7-5 6-5s6 2 6 5"/><path d="M13 10c1.8.3 4 1.4 4 4"/>
              </svg>
              My Groups
            </div>
            <div className={`nav-item${activeNav === 'assignments' ? ' active' : ''}`} onClick={() => navClick('assignments')}>
              <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="2" width="12" height="14" rx="2"/>
                <path d="M6 6h6M6 9h6M6 12h4"/>
              </svg>
              Assignments
              <span className="nav-badge">{assignments.length}</span>
            </div>
            <div className="nav-item" onClick={() => navClick('ai-toolkit')}>
              <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <rect x="2" y="3" width="14" height="10" rx="2"/>
                <path d="M6 16h6M9 13v3"/>
                <path d="M6 7.5 L9 10 L12 7.5" strokeWidth="1.5"/>
              </svg>
              AI Teacher&apos;s Toolkit
            </div>
            <div className="nav-item" onClick={() => navClick('library')}>
              <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 2h7l3 3v11a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z"/>
                <path d="M11 2v4h4M6 9h6M6 12h4"/>
              </svg>
              My Library
            </div>
          </nav>

          <div className="sidebar-footer">
            <div className="settings-nav">
              <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
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
        </aside>

        {/* ══════════════ MAIN WRAPPER ══════════════ */}
        <div className="main-wrapper">

          {/* Mobile Top Bar */}
          <header className="mob-topbar">
            <div className="mob-logo">
              <div className="logo-icon" style={{width:'28px',height:'28px',borderRadius:'6px'}}>
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
              <div className="user-avatar" style={{width:'32px',height:'32px',fontSize:'13px'}}>J</div>
              <button className="mob-icon-btn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="5" x2="17" y2="5"/><line x1="3" y1="10" x2="17" y2="10"/><line x1="3" y1="15" x2="17" y2="15"/>
                </svg>
              </button>
            </div>
          </header>

          {/* Desktop Top Bar */}
          <header className="topbar">
            <button className="topbar-back">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 3L5 8l5 5"/>
              </svg>
            </button>
            <div className="topbar-breadcrumb">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1"/><rect x="9" y="1.5" width="5.5" height="5.5" rx="1"/>
                <rect x="1.5" y="9" width="5.5" height="5.5" rx="1"/><rect x="9" y="9" width="5.5" height="5.5" rx="1"/>
              </svg>
              <span>{topbarTitle}</span>
            </div>
            <div className="topbar-actions">
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

          {/* ══════════════ PAGE CONTENT ══════════════ */}
          <div className="page-content">

            {/* Screen: Empty State */}
            <div className={`screen screen-empty${currentScreen === 'empty' ? ' active' : ''}`}>
              <svg className="empty-illus" viewBox="0 0 260 210" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="78" y="28" width="110" height="130" rx="10" fill="#E8E8F0" stroke="#D0D0E0" strokeWidth="1.5"/>
                <rect x="85" y="42" width="60" height="7" rx="3.5" fill="#C8C8D8"/>
                <rect x="85" y="56" width="90" height="5" rx="2.5" fill="#D8D8E8"/>
                <rect x="85" y="67" width="75" height="5" rx="2.5" fill="#D8D8E8"/>
                <rect x="85" y="78" width="82" height="5" rx="2.5" fill="#D8D8E8"/>
                <rect x="138" y="22" width="80" height="52" rx="7" fill="#F0F0F8" stroke="#D8D8E8" strokeWidth="1.5"/>
                <rect x="147" y="33" width="45" height="5" rx="2.5" fill="#D0D0E0"/>
                <rect x="147" y="44" width="58" height="4" rx="2" fill="#D8D8E8"/>
                <circle cx="122" cy="128" r="44" fill="#EBEBF5"/>
                <circle cx="122" cy="128" r="38" fill="#F5F5FC" stroke="#D8D8EC" strokeWidth="2"/>
                <circle cx="122" cy="128" r="22" fill="#FEE2E2"/>
                <path d="M113 119l18 18M131 119l-18 18" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round"/>
                <line x1="152" y1="158" x2="168" y2="174" stroke="#AAABB8" strokeWidth="5.5" strokeLinecap="round"/>
                <path d="M70 72l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z" fill="#9B8EC4" opacity="0.8"/>
                <circle cx="188" cy="108" r="4" fill="#9B8EC4" opacity="0.6"/>
                <path d="M108 124h28M108 132h28" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
                <path d="M170 40 Q195 28 195 55" stroke="#9B8EC4" strokeWidth="2" strokeLinecap="round" fill="none" strokeDasharray="4 3"/>
              </svg>
              <p className="empty-title">No assignments yet</p>
              <p className="empty-sub">Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.</p>
              <button className="create-first-btn" onClick={() => showScreen('assignments')}>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="7.5" y1="1" x2="7.5" y2="14"/><line x1="1" y1="7.5" x2="14" y2="7.5"/>
                </svg>
                Create Your First Assignment
              </button>
            </div>

            {/* Screen: Assignments List */}
            <div className={`screen${currentScreen === 'assignments' ? ' active' : ''}`}>
              <div className="list-page-header">
                <div className="page-title-row">
                  <span className="status-dot"></span>
                  <h1 className="page-title">Assignments</h1>
                </div>
                <p className="page-sub">Manage and create assignments for your classes.</p>
              </div>
              <div className="filter-row">
                <button className="filter-btn">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M1 3h12M3 7h8M5 11h4"/>
                  </svg>
                  Filter By
                </button>
                <div className="search-wrap">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
                    <circle cx="6" cy="6" r="4"/><line x1="10" y1="10" x2="13" y2="13"/>
                  </svg>
                  <input type="text" placeholder="Search Assignment"/>
                </div>
              </div>
              <div className="cards-grid">
                {assignments.map((a) => (
                  <div className="asgn-card" key={a.id}>
                    <div className="card-top">
                      <span className="card-title">{a.title}</span>
                      <button className="card-three-dot" onClick={(e) => toggleMenu(e, a.id)}>
                        <svg width="4" height="16" viewBox="0 0 4 16" fill="currentColor">
                          <circle cx="2" cy="2" r="1.5"/><circle cx="2" cy="8" r="1.5"/><circle cx="2" cy="14" r="1.5"/>
                        </svg>
                      </button>
                      <div className={`ctx-menu${openMenuId === a.id ? ' open' : ''}`}>
                        <button className="ctx-item" onClick={() => viewAssignment(a.id)}>View Assignment</button>
                        <button className="ctx-item danger" onClick={() => deleteAssignment(a.id)}>Delete</button>
                      </div>
                    </div>
                    <div className="card-bottom">
                      <div className="card-date">
                        <span className="date-label">Assigned on </span>
                        <span className="date-val">: {a.assigned}</span>
                      </div>
                      <div className="card-date">
                        <span className="date-label">Due </span>
                        <span className="date-val">: {a.due}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Screen: AI Teacher's Toolkit */}
            <div className={`screen${currentScreen === 'ai' ? ' active' : ''}`}>
              <div className="ai-response-block">
                <p className="ai-response-text">Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade 8 Science classes on the NCERT chapters:</p>
                <button className="download-pdf-btn">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 1v8M4 6l3 3 3-3"/><path d="M2 10v2a1 1 0 001 1h8a1 1 0 001-1v-2"/>
                  </svg>
                  Download as PDF
                </button>
              </div>
              <div className="question-paper">
                <div className="qp-school">
                  <h2>Delhi Public School, Sector-4, Bokaro</h2>
                  <p>Subject: English</p>
                  <p>Class: 5th</p>
                </div>
                <hr className="qp-divider"/>
                <div className="qp-meta">
                  <span>Time Allowed: 45 minutes</span>
                  <span>Maximum Marks: 20</span>
                </div>
                <p className="qp-instruction">All questions are compulsory unless stated otherwise.</p>
                <div style={{marginBottom:'24px'}}>
                  <p className="qp-field">Name: _______________</p>
                  <p className="qp-field">Roll Number: ___________</p>
                  <p className="qp-field">Class: 5th Section: _______</p>
                </div>
                <p className="qp-section">Section A</p>
                <p className="qp-subsec">Short Answer Questions</p>
                <p className="qp-subsec-note">Attempt all questions. Each question carries 2 marks</p>
                <p className="qp-q">1. [Easy] Define electroplating. Explain its purpose. [2 Marks]</p>
                <p className="qp-q">2. [Medium] What is the principle behind electroplating? Describe the role of the electrolyte in the process. [2 Marks]</p>
                <p className="qp-q">3. [Hard] Compare the properties of conductors and insulators. Give two examples of each. [2 Marks]</p>
                <p className="qp-section">Section B</p>
                <p className="qp-subsec">Long Answer Questions</p>
                <p className="qp-subsec-note">Attempt any 2 questions. Each question carries 5 marks</p>
                <p className="qp-q">4. [Medium] Explain the process of electroplating with a neat diagram. Label the anode, cathode and electrolyte. [5 Marks]</p>
                <p className="qp-q">5. [Hard] Why is gold plating done on silver jewellery? Discuss the commercial and aesthetic reasons in detail. [5 Marks]</p>
              </div>
            </div>

          </div>{/* /page-content */}

          {/* Floating create assignment button */}
          {currentScreen === 'assignments' && (
            <button className="floating-btn" onClick={() => alert('Create Assignment modal')}>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="7.5" y1="1" x2="7.5" y2="14"/><line x1="1" y1="7.5" x2="14" y2="7.5"/>
              </svg>
              Create Assignment
            </button>
          )}

        </div>{/* /main-wrapper */}
      </div>{/* /app */}

      {/* Mobile Bottom Nav */}
      <nav className="mob-bottom-nav">
        <button className="mob-nav-item" onClick={() => navClick('home')}>
          <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="12" y="3" width="7" height="7" rx="1.5"/>
            <rect x="3" y="12" width="7" height="7" rx="1.5"/><rect x="12" y="12" width="7" height="7" rx="1.5"/>
          </svg>
          <span className="mob-nav-label">Home</span>
        </button>
        <button className={`mob-nav-item${activeNav === 'assignments' ? ' active' : ''}`} onClick={() => navClick('assignments')}>
          <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="14" height="18" rx="2"/>
            <path d="M8 8h6M8 12h6M8 16h4"/>
          </svg>
          <span className="mob-nav-label">Assignments</span>
        </button>
        <button className="mob-nav-item" onClick={() => navClick('library')}>
          <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="3" width="7" height="16" rx="1.5"/><rect x="12" y="3" width="7" height="16" rx="1.5"/>
          </svg>
          <span className="mob-nav-label">Library</span>
        </button>
        <button className="mob-nav-item" onClick={() => navClick('ai-toolkit')}>
          <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="2" y="4" width="18" height="12" rx="2"/>
            <path d="M8 19h6M11 16v3"/><path d="M7 9l4 3 4-3"/>
          </svg>
          <span className="mob-nav-label">AI Toolkit</span>
        </button>
      </nav>

      {/* Mobile FAB */}
      <button className="mob-fab" onClick={() => alert('Create Assignment')}>+</button>
    </>
  );
}

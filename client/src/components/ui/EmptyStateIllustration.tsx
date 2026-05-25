export function EmptyStateIllustration() {
  return (
    <div className="illustration-wrapper">
      <svg className="empty-illus" viewBox="0 0 260 210" fill="none" xmlns="http://www.w3.org/2000/svg" width="240">
        {/* Back document */}
        <rect x="78" y="28" width="110" height="130" rx="10" fill="#E8E8F0" stroke="#D0D0E0" strokeWidth="1.5"/>
        <rect x="85" y="42" width="60" height="7" rx="3.5" fill="#C8C8D8"/>
        <rect x="85" y="56" width="90" height="5" rx="2.5" fill="#D8D8E8"/>
        <rect x="85" y="67" width="75" height="5" rx="2.5" fill="#D8D8E8"/>
        <rect x="85" y="78" width="82" height="5" rx="2.5" fill="#D8D8E8"/>

        {/* Second doc hint */}
        <rect x="138" y="22" width="80" height="52" rx="7" fill="#F0F0F8" stroke="#D8D8E8" strokeWidth="1.5"/>
        <rect x="147" y="33" width="45" height="5" rx="2.5" fill="#D0D0E0"/>
        <rect x="147" y="44" width="58" height="4" rx="2" fill="#D8D8E8"/>

        {/* Magnifying glass circle */}
        <circle cx="122" cy="128" r="44" fill="#EBEBF5"/>
        <circle cx="122" cy="128" r="38" fill="#F5F5FC" stroke="#D8D8EC" strokeWidth="2"/>

        {/* Red X cross */}
        <circle cx="122" cy="128" r="22" fill="#FEE2E2"/>
        <path d="M113 119l18 18M131 119l-18 18" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" className="draw-x"/>

        {/* Magnifying handle */}
        <line x1="152" y1="158" x2="168" y2="174" stroke="#AAABB8" strokeWidth="5.5" strokeLinecap="round"/>

        {/* Sparkle top-left */}
        <path d="M70 72l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z" fill="#9B8EC4" opacity="0.8" className="pulse"/>

        {/* Small dot */}
        <circle cx="188" cy="108" r="4" fill="#9B8EC4" opacity="0.6" className="pulse-slow"/>

        {/* Decorative lines on magnifier */}
        <path d="M108 124h28M108 132h28" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>

        {/* Curved line top-right */}
        <path d="M170 40 Q195 28 195 55" stroke="#9B8EC4" strokeWidth="2" strokeLinecap="round" fill="none" strokeDasharray="4 3" className="float-slow"/>
      </svg>

      <style jsx>{`
        .illustration-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 10px;
        }

        .empty-illus {
          animation: screenIn 0.5s ease forwards;
        }

        .float-slow {
          animation: float 4s ease-in-out infinite;
        }

        .pulse {
          animation: pulse 2s ease-in-out infinite;
          transform-origin: 70px 72px;
        }

        .pulse-slow {
          animation: pulseOpacity 3s ease-in-out infinite;
        }

        .draw-x {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: drawX 0.6s ease forwards 0.5s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
        }

        @keyframes pulseOpacity {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        @keyframes screenIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes drawX {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}

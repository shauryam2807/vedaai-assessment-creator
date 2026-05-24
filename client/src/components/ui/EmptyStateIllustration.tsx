export function EmptyStateIllustration() {
  return (
    <div className="illustration-wrapper">
      <svg
        width="280"
        height="240"
        viewBox="0 0 280 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="empty-svg"
      >
        {/* Background Circle */}
        <circle cx="140" cy="120" r="90" fill="#F3F4F6" />

        {/* Curvy line left */}
        <path
          className="float-slow"
          d="M 60 115 C 80 115, 80 85, 100 85"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
          fill="transparent"
        />
        {/* Loop in curvy line */}
        <path
          className="float-slow"
          d="M 100 85 C 105 85, 105 100, 95 100 C 85 100, 85 90, 95 85"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
          fill="transparent"
        />

        {/* Floating Tag Top Right */}
        <g className="float-medium" filter="url(#shadow)">
          <rect x="180" y="60" width="40" height="24" rx="6" fill="white" />
          <circle cx="190" cy="72" r="3" fill="#CBD5E1" />
          <rect x="198" y="70" width="14" height="4" rx="2" fill="#E2E8F0" />
        </g>

        {/* Star bottom left */}
        <path
          className="pulse"
          d="M 65 145 Q 75 145 75 135 Q 75 145 85 145 Q 75 145 75 155 Q 75 145 65 145 Z"
          fill="#38BDF8"
        />

        {/* Small dot right */}
        <circle cx="210" cy="130" r="4" fill="#3B82F6" className="pulse-slow" />

        {/* Document */}
        <g className="document" filter="url(#shadow)">
          <rect x="100" y="70" width="80" height="100" rx="8" fill="white" />
          <rect x="116" y="90" width="30" height="6" rx="3" fill="#0F172A" />
          <rect x="116" y="108" width="48" height="6" rx="3" fill="#E2E8F0" />
          <rect x="116" y="124" width="48" height="6" rx="3" fill="#E2E8F0" />
          <rect x="116" y="140" width="28" height="6" rx="3" fill="#E2E8F0" />
        </g>

        {/* Magnifying Glass */}
        <g className="magnifier bounce-in">
          {/* Handle */}
          <path
            d="M 160 160 L 195 195"
            stroke="#E2E8F0"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Lens */}
          <circle
            cx="145"
            cy="145"
            r="32"
            fill="white"
            stroke="#E2E8F0"
            strokeWidth="8"
          />
          <circle
            cx="145"
            cy="145"
            r="28"
            fill="white"
            stroke="#F8FAFC"
            strokeWidth="2"
          />
          
          {/* Red X */}
          <path
            className="draw-x"
            d="M 130 130 L 160 160 M 160 130 L 130 160"
            stroke="#EF4444"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </g>

        <defs>
          <filter
            id="shadow"
            x="-10"
            y="-10"
            width="120"
            height="140"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.05" />
          </filter>
        </defs>
      </svg>

      <style jsx>{`
        .illustration-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .float-slow {
          animation: float 4s ease-in-out infinite;
        }

        .float-medium {
          animation: float 3s ease-in-out infinite;
          transform-origin: center;
        }

        .pulse {
          animation: pulse 2s ease-in-out infinite;
          transform-origin: 75px 145px;
        }

        .pulse-slow {
          animation: pulseOpacity 3s ease-in-out infinite;
        }

        .document {
          animation: slideUp 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        .magnifier {
          animation: popIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s forwards;
          opacity: 0;
          transform: scale(0.5);
          transform-origin: 145px 145px;
        }

        .draw-x {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: drawX 0.6s ease forwards 0.8s;
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

        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes popIn {
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes drawX {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}

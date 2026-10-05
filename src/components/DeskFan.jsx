import React from 'react';

/**
 * Realistic Vintage Industrial Security Desk Fan for FNAK
 * Features high-detail metallic textures, articulated cast-iron base,
 * wire basket grill with concentric rings and radial spokes,
 * aerodynamic curved blades with dynamic motion blur, and motor housing.
 */
export default function DeskFan({ isBlackout = false, className = '' }) {
  const isRunning = !isBlackout;

  return (
    <div className={`relative select-none pointer-events-none filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)] ${className}`}>
      <svg
        viewBox="0 0 200 240"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Shadow blur filter */}
          <filter id="fan-shadow-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>

          {/* Cast Iron Base Gradient */}
          <linearGradient id="fan-base-body" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="35%" stopColor="#1e293b" />
            <stop offset="85%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="fan-base-rim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="25%" stopColor="#334155" />
            <stop offset="50%" stopColor="#64748b" />
            <stop offset="75%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Neck Column & Pivot Chrome Gradient */}
          <linearGradient id="fan-neck-metal" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="30%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#f1f5f9" />
            <stop offset="70%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Motor Housing Gradient */}
          <linearGradient id="fan-motor-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="30%" stopColor="#1e293b" />
            <stop offset="70%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Heavy Steel Cage Rim Gradient */}
          <linearGradient id="fan-steel-rim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="30%" stopColor="#f8fafc" />
            <stop offset="50%" stopColor="#475569" />
            <stop offset="85%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Aerodynamic Blade Gradient */}
          <linearGradient id="fan-blade-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="25%" stopColor="#94a3b8" />
            <stop offset="60%" stopColor="#475569" />
            <stop offset="90%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Motion Blur Sweep Gradient */}
          <radialGradient id="fan-motion-sweep" cx="50%" cy="50%" r="50%">
            <stop offset="40%" stopColor="rgba(226, 232, 240, 0.45)" />
            <stop offset="70%" stopColor="rgba(148, 163, 184, 0.25)" />
            <stop offset="95%" stopColor="rgba(30, 41, 59, 0.05)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Central Rotor Hub Cap Gradient */}
          <radialGradient id="fan-hub-cap" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#cbd5e1" />
            <stop offset="65%" stopColor="#475569" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>

          {/* Vintage Brand Medallion */}
          <radialGradient id="fan-medallion" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#eab308" />
            <stop offset="85%" stopColor="#854d0e" />
            <stop offset="100%" stopColor="#422006" />
          </radialGradient>

          {/* Reusable Aerodynamic Curved Blade Definition */}
          <path
            id="fan-single-blade"
            d="M 94 76 C 88 56 68 36 76 25 C 83 15 106 14 116 22 C 124 29 120 50 106 76 Z"
            fill="url(#fan-blade-grad)"
            stroke="#1e293b"
            strokeWidth="0.8"
          />
        </defs>

        {/* 1. Cast Shadow on Table Surface */}
        <ellipse cx="100" cy="233" rx="54" ry="7" fill="rgba(0,0,0,0.75)" filter="url(#fan-shadow-blur)" />

        {/* 2. Heavy Cast-Iron Beveled Base */}
        <g id="fan-base-group">
          {/* Base bottom stepped rim */}
          <ellipse cx="100" cy="226" rx="46" ry="10" fill="url(#fan-base-rim)" />
          <ellipse cx="100" cy="223" rx="42" ry="9" fill="#0f172a" />
          {/* Base cone body */}
          <path
            d="M 58 223 C 60 208 72 198 100 198 C 128 198 140 208 142 223 Z"
            fill="url(#fan-base-body)"
            stroke="#334155"
            strokeWidth="0.8"
          />
          {/* Base top tier rim */}
          <ellipse cx="100" cy="205" rx="26" ry="6" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />

          {/* Speed Control Switch Dial */}
          <ellipse cx="100" cy="216" rx="14" ry="5.5" fill="#090d16" stroke="#475569" strokeWidth="0.8" />
          {/* Speed tick markers */}
          <circle cx="89" cy="216" r="0.8" fill="#94a3b8" />
          <circle cx="94" cy="213" r="0.8" fill="#94a3b8" />
          <circle cx="100" cy="212" r="0.8" fill="#94a3b8" />
          <circle cx="106" cy="213" r="0.8" fill="#94a3b8" />
          {/* Dial Knob */}
          <ellipse cx="100" cy="216" rx="5" ry="3.5" fill="#334155" stroke="#94a3b8" strokeWidth="0.6" />
          <line x1="100" y1="213.5" x2="100" y2="218.5" stroke="#f8fafc" strokeWidth="0.8" />
          {/* Power status indicator LED */}
          <circle cx="111" cy="216" r="1.3" fill={isRunning ? '#22c55e' : '#ef4444'} />
        </g>

        {/* 3. Articulated Chrome Neck Column & Pivot Assembly */}
        <g id="fan-neck-group">
          {/* Telescopic neck bar */}
          <path
            d="M 94 144 L 93 204 L 107 204 L 106 144 Z"
            fill="url(#fan-neck-metal)"
            stroke="#1e293b"
            strokeWidth="0.8"
          />
          {/* Swivel knuckle / joint */}
          <rect x="91" y="138" width="18" height="13" rx="3.5" fill="url(#fan-base-body)" stroke="#475569" strokeWidth="0.8" />
          {/* Tilt adjustment wing nut screw on side */}
          <ellipse cx="113" cy="144" rx="4" ry="2.2" fill="#cbd5e1" stroke="#334155" strokeWidth="0.6" />
          <rect x="110" y="143" width="3" height="2" fill="#64748b" />
        </g>

        {/* 4. Motor Housing (Mounted behind the center of the cage) */}
        <g id="fan-motor-group">
          {/* Cylindrical motor canister */}
          <rect
            x="81"
            y="65"
            width="38"
            height="40"
            rx="8"
            fill="url(#fan-motor-grad)"
            stroke="#334155"
            strokeWidth="1"
          />
          {/* Cooling ventilation ribs */}
          <line x1="84" y1="73" x2="116" y2="73" stroke="#020617" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="84" y1="79" x2="116" y2="79" stroke="#020617" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="84" y1="85" x2="116" y2="85" stroke="#020617" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="84" y1="91" x2="116" y2="91" stroke="#020617" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="84" y1="97" x2="116" y2="97" stroke="#020617" strokeWidth="1.5" strokeLinecap="round" />
          {/* Top oscillation toggle pull-knob */}
          <rect x="96.5" y="58" width="7" height="8" rx="2" fill="#64748b" stroke="#334155" strokeWidth="0.6" />
        </g>

        {/* 5. Back Safety Wire Grill Basket */}
        <g id="fan-back-cage" opacity="0.65">
          <circle cx="100" cy="85" r="58" stroke="#334155" strokeWidth="1.2" fill="none" />
          <circle cx="100" cy="85" r="42" stroke="#334155" strokeWidth="1" fill="none" />
          <circle cx="100" cy="85" r="24" stroke="#334155" strokeWidth="1" fill="none" />
          {/* Rear wire spokes */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="100"
              y1="85"
              x2="100"
              y2="27"
              stroke="#1e293b"
              strokeWidth="1"
              transform={`rotate(${deg} 100 85)`}
            />
          ))}
        </g>

        {/* 6. Spinning Fan Blades Assembly */}
        <g
          id="fan-blades-group"
          className={isRunning ? 'fan-rotating' : ''}
          style={{ transformOrigin: '100px 85px' }}
        >
          {/* High-speed motion blur sweep disc (translucent prop wash) */}
          {isRunning && (
            <circle
              cx="100"
              cy="85"
              r="58"
              fill="url(#fan-motion-sweep)"
              opacity="0.85"
            />
          )}

          {/* 4 Aerodynamic Curved Teardrop Blades */}
          <use href="#fan-single-blade" transform="rotate(0 100 85)" />
          <use href="#fan-single-blade" transform="rotate(90 100 85)" />
          <use href="#fan-single-blade" transform="rotate(180 100 85)" />
          <use href="#fan-single-blade" transform="rotate(270 100 85)" />

          {/* Central Rotor Hub */}
          <circle cx="100" cy="85" r="14" fill="url(#fan-hub-cap)" stroke="#475569" strokeWidth="1.2" />
          <circle cx="100" cy="85" r="5.5" fill="#0f172a" />
          {/* Spindle center bolt */}
          <circle cx="100" cy="85" r="2.5" fill="#94a3b8" />
        </g>

        {/* 7. Front Wire Safety Cage (In front of blades) */}
        <g id="fan-front-cage">
          {/* Concentric Wire Rings */}
          <circle cx="100" cy="85" r="54" stroke="#64748b" strokeWidth="1" fill="none" opacity="0.85" />
          <circle cx="100" cy="85" r="41" stroke="#64748b" strokeWidth="1" fill="none" opacity="0.85" />
          <circle cx="100" cy="85" r="27" stroke="#64748b" strokeWidth="1" fill="none" opacity="0.85" />

          {/* 16 Radial Wire Spokes */}
          {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((deg) => (
            <line
              key={deg}
              x1="100"
              y1="85"
              x2="100"
              y2="21"
              stroke="#64748b"
              strokeWidth="0.9"
              transform={`rotate(${deg} 100 85)`}
              opacity="0.85"
            />
          ))}

          {/* Outer Heavy Steel Protective Rim */}
          <circle
            cx="100"
            cy="85"
            r="64"
            stroke="url(#fan-steel-rim)"
            strokeWidth="3.2"
            fill="none"
          />

          {/* Rim Clamping Brackets (holding front and back cages together) */}
          <rect x="97" y="19" width="6" height="4" rx="1" fill="#cbd5e1" stroke="#334155" strokeWidth="0.6" />
          <rect x="97" y="147" width="6" height="4" rx="1" fill="#cbd5e1" stroke="#334155" strokeWidth="0.6" />
          <rect x="34" y="82" width="4" height="6" rx="1" fill="#cbd5e1" stroke="#334155" strokeWidth="0.6" />
          <rect x="162" y="82" width="4" height="6" rx="1" fill="#cbd5e1" stroke="#334155" strokeWidth="0.6" />

          {/* Center Vintage Brand Medallion Badge */}
          <circle
            cx="100"
            cy="85"
            r="12.5"
            fill="url(#fan-medallion)"
            stroke="#713f12"
            strokeWidth="1.2"
          />
          <circle
            cx="100"
            cy="85"
            r="10.5"
            fill="none"
            stroke="#fef08a"
            strokeWidth="0.7"
            strokeDasharray="2 1"
          />
          <text
            x="100"
            y="88"
            textAnchor="middle"
            fontSize="6"
            fontWeight="900"
            fontFamily="monospace"
            fill="#422006"
            letterSpacing="0.8"
          >
            FNAK
          </text>
        </g>

        {/* 8. Specular Glass / Chrome Reflection Highlight */}
        <path
          d="M 52 50 C 70 34 110 32 140 45 C 122 36 82 38 52 50 Z"
          fill="rgba(255, 255, 255, 0.45)"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

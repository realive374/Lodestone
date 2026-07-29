export default function Logo({ size = 40, className = '' }) {
  const uid = `ls-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Lodestone"
    >
      <defs>
        <linearGradient id={`${uid}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="45%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id={`${uid}-needle`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#e0e7ff" />
        </linearGradient>
      </defs>
      {/* Magnetic field arcs */}
      <path
        d="M 60 18 Q 22 22 16 55 Q 14 78 32 92"
        stroke={`url(#${uid}-grad)`}
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M 60 18 Q 98 22 104 55 Q 106 78 88 92"
        stroke={`url(#${uid}-grad)`}
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M 60 102 Q 22 98 16 65 Q 14 42 32 28"
        stroke={`url(#${uid}-grad)`}
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M 60 102 Q 98 98 104 65 Q 106 42 88 28"
        stroke={`url(#${uid}-grad)`}
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.35"
      />
      {/* Stone body */}
      <ellipse cx="60" cy="60" rx="27" ry="32" fill={`url(#${uid}-grad)`} />
      {/* Compass needle (diagonal) */}
      <polygon points="60,32 51,60 60,88 69,60" fill={`url(#${uid}-needle)`} opacity="0.95" />
      <polygon points="60,32 51,60 60,60" fill="#fbbf24" opacity="0.9" />
      {/* Center hub */}
      <circle cx="60" cy="60" r="5.5" fill={`url(#${uid}-grad)`} />
      <circle cx="60" cy="60" r="2" fill="#fff" opacity="0.9" />
    </svg>
  );
}
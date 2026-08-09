type IconProps = { className?: string };

const base = 'block';

function Squircle({
  children,
  from,
  to,
  className,
}: {
  children?: React.ReactNode;
  from: string;
  to: string;
  className?: string;
  }) {
  const id = `g-${from.replace('#', '')}-${to.replace('#', '')}`;
  return (
    <svg viewBox="0 0 48 48" className={`${base} ${className ?? ''}`} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="11" fill={`url(#${id})`} />
      {children}
    </svg>
  );
}

export function TerminalIcon({ className }: IconProps) {
  return (
    <Squircle from="#3d3d3d" to="#1e1e1e" className={className}>
      <rect x="2" y="2" width="44" height="9" rx="11" fill="#4a4a4a" />
      <rect x="2" y="8" width="44" height="4" fill="#4a4a4a" />
      <path
        d="M12 22l6 5-6 5"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M22 33h13" stroke="#e95420" strokeWidth="2.6" strokeLinecap="round" />
    </Squircle>
  );
}

export function FilesIcon({ className }: IconProps) {
  return (
    <Squircle from="#5c5c5c" to="#3a3a3a" className={className}>
      <path
        d="M10 15.5a2.5 2.5 0 012.5-2.5h6.2c.7 0 1.4.3 1.8.9l1.4 1.8h13.6a2.5 2.5 0 012.5 2.5v14.3a2.5 2.5 0 01-2.5 2.5H12.5a2.5 2.5 0 01-2.5-2.5z"
        fill="#e95420"
      />
      <path
        d="M10 21h28v11.5a2.5 2.5 0 01-2.5 2.5H12.5a2.5 2.5 0 01-2.5-2.5z"
        fill="#f8f8f8"
        opacity="0.92"
      />
    </Squircle>
  );
}

export function FirefoxIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={`${base} ${className ?? ''}`} aria-hidden="true">
      <defs>
        <radialGradient id="ff-outer" cx="0.5" cy="0.25" r="0.85">
          <stop offset="0" stopColor="#ffd93f" />
          <stop offset="0.45" stopColor="#ff7139" />
          <stop offset="1" stopColor="#c5288a" />
        </radialGradient>
        <radialGradient id="ff-inner" cx="0.5" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#fff44f" />
          <stop offset="1" stopColor="#ff980e" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="21" fill="url(#ff-outer)" />
      <path
        d="M24 8c6 0 9.5 3.4 11 6.6-2.3-1.6-4.6-2-6.6-1.6 3.6 1.6 5.8 4.7 6.4 8.6.9 5.9-3.2 12.4-10.8 12.4-6.6 0-11.4-4.7-11.4-10.7 0-4 2-7.2 4.6-8.9-.5 2 .1 3.9 1.2 5-.4-3.9 1.8-8.2 5.6-10.4z"
        fill="url(#ff-inner)"
      />
    </svg>
  );
}

export function GalleryIcon({ className }: IconProps) {
  return (
    <Squircle from="#8a5cd8" to="#5b3aa8" className={className}>
      <rect x="10" y="13" width="28" height="22" rx="3" fill="#f5f5f5" />
      <circle cx="18" cy="20" r="3" fill="#ffc107" />
      <path d="M13 32l7.5-8.5L26 30l4.5-5L35 32z" fill="#4caf50" />
    </Squircle>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <Squircle from="#4a90d9" to="#2b6cb0" className={className}>
      <rect x="9" y="15" width="30" height="19" rx="3" fill="#ffffff" />
      <path
        d="M11 18l13 9 13-9"
        fill="none"
        stroke="#2b6cb0"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Squircle>
  );
}

export function SettingsIcon({ className }: IconProps) {
  return (
    <Squircle from="#5c5c5c" to="#333333" className={className}>
      <path
        d="M24 15.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17zm0 5a3.5 3.5 0 110 7 3.5 3.5 0 010-7z"
        fill="#ffffff"
      />
      <g fill="#ffffff">
        <rect x="22.2" y="8" width="3.6" height="5" rx="1.8" />
        <rect x="22.2" y="35" width="3.6" height="5" rx="1.8" />
        <rect x="8" y="22.2" width="5" height="3.6" rx="1.8" />
        <rect x="35" y="22.2" width="5" height="3.6" rx="1.8" />
      </g>
    </Squircle>
  );
}

export function MonitorIcon({ className }: IconProps) {
  return (
    <Squircle from="#3fa46a" to="#1e6b42" className={className}>
      <rect x="9" y="13" width="30" height="22" rx="3" fill="#0f2a1c" />
      <path
        d="M12 30l5-7 4 4 5-9 4 7 3-3 3 8"
        fill="none"
        stroke="#4ade80"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Squircle>
  );
}

export function TextEditorIcon({ className }: IconProps) {
  return (
    <Squircle from="#6b6b6b" to="#404040" className={className}>
      <path d="M14 10h13l8 8v20a2 2 0 01-2 2H14a2 2 0 01-2-2V12a2 2 0 012-2z" fill="#fafafa" />
      <path d="M27 10l8 8h-8z" fill="#c9c9c9" />
      <g stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round">
        <path d="M17 24h14M17 29h14M17 34h9" />
      </g>
    </Squircle>
  );
}

export function ResumeIcon({ className }: IconProps) {
  return (
    <Squircle from="#c0392b" to="#8e2419" className={className}>
      <path d="M14 9h13l8 8v22a2 2 0 01-2 2H14a2 2 0 01-2-2V11a2 2 0 012-2z" fill="#fafafa" />
      <path d="M27 9l8 8h-8z" fill="#d8d8d8" />
      <g stroke="#b03a2e" strokeWidth="2" strokeLinecap="round">
        <path d="M17 22h13M17 27h13M17 32h8" />
      </g>
      <rect x="20" y="35" width="16" height="9" rx="2" fill="#8e2419" />
      <text
        x="28"
        y="41.8"
        textAnchor="middle"
        fontSize="6.5"
        fontWeight="700"
        fill="#ffffff"
        fontFamily="Ubuntu, sans-serif"
      >
        PDF
      </text>
    </Squircle>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <Squircle from="#4a4a4a" to="#2b2b2b" className={className}>
      <path d="M15 17h18l-1.6 19a2.5 2.5 0 01-2.5 2.3h-9.8a2.5 2.5 0 01-2.5-2.3z" fill="#d8d8d8" />
      <rect x="13" y="13" width="22" height="4" rx="2" fill="#f0f0f0" />
      <rect x="20" y="10" width="8" height="3.5" rx="1.75" fill="#f0f0f0" />
      <g stroke="#9a9a9a" strokeWidth="1.8" strokeLinecap="round">
        <path d="M21 22v11M24 22v11M27 22v11" />
      </g>
    </Squircle>
  );
}

export function BriefcaseIcon({ className }: IconProps) {
  return (
    <Squircle from="#c76b3a" to="#8f4620" className={className}>
      <rect x="9" y="17" width="30" height="19" rx="3" fill="#f5e2d4" />
      <path
        d="M19 17v-2.5a2.5 2.5 0 012.5-2.5h5a2.5 2.5 0 012.5 2.5V17"
        fill="none"
        stroke="#f5e2d4"
        strokeWidth="2.6"
      />
      <rect x="9" y="24" width="30" height="3" fill="#c76b3a" />
      <rect x="21" y="22.5" width="6" height="6" rx="1.5" fill="#8f4620" />
    </Squircle>
  );
}

/*
 * Canonical's "Circle of Friends": three dots seated on a broken ring at 60°,
 * 180° and 300°, with each arc stopping short of the dot it meets.
 */
function CircleOfFriends() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="3.2">
      <path d="M25.36 11.07A13 13 0 0 0 12.12 18.71" />
      <path d="M12.12 29.29A13 13 0 0 0 25.36 36.93" />
      <path d="M34.52 31.64A13 13 0 0 0 34.52 16.36" />
      <g fill="currentColor" stroke="none">
        <circle cx="30.5" cy="12.74" r="4.6" />
        <circle cx="11" cy="24" r="4.6" />
        <circle cx="30.5" cy="35.26" r="4.6" />
      </g>
    </g>
  );
}

/** The mark on its own, tinted by `currentColor`. Used for the dock starter. */
export function UbuntuLogoMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={`${base} ${className ?? ''}`} aria-hidden="true">
      <CircleOfFriends />
    </svg>
  );
}

/** The mark reversed out of an Ubuntu orange disc, for the boot screen. */
export function UbuntuLogo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={`${base} ${className ?? ''}`} aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill="#e95420" />
      <g className="text-white">
        <CircleOfFriends />
      </g>
    </svg>
  );
}

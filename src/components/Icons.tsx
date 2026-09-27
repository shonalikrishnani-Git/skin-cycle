/**
 * Drawn icons rather than emoji. Emoji look different on every phone, can't take the app's
 * colours, and read as clip-art next to Georgia headings. These inherit `currentColor`, so a
 * Tailwind text colour class is all it takes to restyle one.
 */

const MOUTHS: Record<number, string> = {
  1: 'M9 19.2 Q14 14.2 19 19.2',
  2: 'M9.5 18.4 Q14 16.2 18.5 18.4',
  3: 'M9.5 17.6 L18.5 17.6',
  4: 'M9.5 16.2 Q14 19.6 18.5 16.2',
  5: 'M8.8 15.6 Q14 21.6 19.2 15.6',
};

type IconProps = { className?: string };

export function FaceIcon({ level, size = 28, className = '' }: IconProps & { level: number; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="10.3" cy="11.3" r="1.4" fill="currentColor" />
      <circle cx="17.7" cy="11.3" r="1.4" fill="currentColor" />
      <path d={MOUTHS[level] ?? MOUTHS[3]} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function SunIcon({ className = '' }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="3.6" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M10 1.8v2.2M10 16v2.2M1.8 10H4M16 10h2.2M4.2 4.2l1.6 1.6M14.2 14.2l1.6 1.6M4.2 15.8l1.6-1.6M14.2 5.8l1.6-1.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MoonIcon({ className = '' }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M15.5 12.6A6.5 6.5 0 0 1 7.4 4.5a6.5 6.5 0 1 0 8.1 8.1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon({ className = '' }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const CHEVRONS = {
  left: 'M12.5 5l-5 5 5 5',
  right: 'M7.5 5l5 5-5 5',
  up: 'M5 12.5l5-5 5 5',
  down: 'M5 7.5l5 5 5-5',
};

export function ChevronIcon({ direction, className = '' }: IconProps & { direction: keyof typeof CHEVRONS }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d={CHEVRONS[direction]}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlusIcon({ className = '' }: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function XIcon({ className = '' }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function LockIcon({ className = '' }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <rect x="4" y="8.5" width="12" height="9" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 8.5V6.2a3 3 0 0 1 6 0v2.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function BookIcon({ className = '' }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M10 5.5C8.5 4.3 6.3 3.8 3.5 4v11.5c2.8-.2 5 .3 6.5 1.5m0-11.5c1.5-1.2 3.7-1.7 6.5-1.5v11.5c-2.8-.2-5 .3-6.5 1.5m0-11.5V17"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DropIcon({ className = '' }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M10 2.8c2.9 3.4 5 6.3 5 8.9a5 5 0 0 1-10 0c0-2.6 2.1-5.5 5-8.9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CalendarIcon({ className = '' }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="4.5" width="14" height="12.5" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 8.5h14M7 2.8v3M13 2.8v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** The four phase colours as a small ring — the app's mark. */
export function LogoMark({ size = 28, className = '' }: IconProps & { size?: number }) {
  const r = 10;
  const c = 2 * Math.PI * r;
  const arcs = ['var(--color-menstrual)', 'var(--color-follicular)', 'var(--color-ovulatory)', 'var(--color-luteal)'];
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" className={className} aria-hidden="true">
      {arcs.map((color, i) => (
        <circle
          key={color}
          cx="14"
          cy="14"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="4.5"
          strokeDasharray={`${c / 4 - 2.2} ${c}`}
          strokeDashoffset={-(c / 4) * i}
          transform="rotate(-90 14 14)"
        />
      ))}
    </svg>
  );
}

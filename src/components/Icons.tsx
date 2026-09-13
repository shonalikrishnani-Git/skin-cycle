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

export function ChevronIcon({ direction, className = '' }: IconProps & { direction: 'left' | 'right' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d={direction === 'left' ? 'M12.5 5l-5 5 5 5' : 'M7.5 5l5 5-5 5'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

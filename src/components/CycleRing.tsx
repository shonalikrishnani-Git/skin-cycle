import { PHASE_META, phaseRanges, type Phase } from '../lib/cycle';

const SIZE = 248;
const CENTER = SIZE / 2;
const RADIUS = 98;
const STROKE = 22;
const GAP = 4;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * The whole month on one ring, each phase in its own colour, with a marker for today.
 *
 * Arcs are drawn as dashes on a circle: `0 <start> <length> <circumference>` means "draw nothing,
 * skip to where this phase begins, draw it, then skip the rest" — which avoids negative
 * dash offsets entirely.
 */
export function CycleRing({
  day,
  phase,
  cycleLength,
  periodLength,
}: {
  day: number;
  phase: Phase;
  cycleLength: number;
  periodLength: number;
}) {
  const ranges = phaseRanges(cycleLength, periodLength).filter((r) => r.start <= r.end);

  // A late period parks the marker at the end of the ring rather than wrapping round.
  const position = Math.min(day, cycleLength) - 0.5;
  const angle = (position / cycleLength) * 2 * Math.PI - Math.PI / 2;
  const markerX = CENTER + RADIUS * Math.cos(angle);
  const markerY = CENTER + RADIUS * Math.sin(angle);

  return (
    <div className="relative mx-auto w-full" style={{ maxWidth: SIZE }}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full h-auto block"
        role="img"
        aria-label={`Day ${day} of a ${cycleLength}-day cycle, ${phase.toLowerCase()} phase`}
      >
        <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="var(--color-line)" strokeWidth={STROKE} />

        {ranges.map((r) => {
          const start = ((r.start - 1) / cycleLength) * CIRCUMFERENCE;
          const length = ((r.end - r.start + 1) / cycleLength) * CIRCUMFERENCE;
          return (
            <circle
              key={r.phase}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke={PHASE_META[r.phase].stroke}
              strokeWidth={STROKE}
              strokeDasharray={`0 ${start + GAP / 2} ${Math.max(0, length - GAP)} ${CIRCUMFERENCE}`}
              transform={`rotate(-90 ${CENTER} ${CENTER})`}
              opacity={r.phase === phase ? 1 : 0.4}
            />
          );
        })}

        <circle cx={markerX} cy={markerY} r={12} fill="white" stroke="var(--color-ink)" strokeWidth={3} />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xs uppercase tracking-widest text-muted">Day</span>
        <span className="font-display text-6xl leading-none my-1">{day}</span>
        <span className={`text-sm font-medium ${PHASE_META[phase].ink}`}>{phase}</span>
      </div>
    </div>
  );
}

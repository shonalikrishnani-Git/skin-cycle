import { SKIN_LAYERS } from '../lib/science';

/**
 * A cross-section of skin, drawn to scale-ish, with the depth markers that matter.
 *
 * The point of the picture: your barrier is at the top and your collagen is near the bottom,
 * and almost everything you apply stops long before it gets there.
 */

const BANDS = [
  { id: 'corneum', y: 16, h: 30, fill: 'var(--color-accent-soft)' },
  { id: 'living-epidermis', y: 46, h: 74, fill: 'color-mix(in srgb, var(--color-accent) 22%, white)' },
  { id: 'dermis', y: 120, h: 124, fill: 'color-mix(in srgb, var(--color-accent) 42%, white)' },
  { id: 'hypodermis', y: 244, h: 64, fill: 'color-mix(in srgb, var(--color-warn) 26%, white)' },
];

// Two short lines rather than one long one — a single line overflows the viewBox on narrow screens.
const MARKERS = [
  { y: 31, lines: ['Most of what you apply', 'stops here'] },
  { y: 83, lines: ['Small actives, under 500 Da,', 'reach about here'] },
  { y: 182, lines: ['Your collagen is here —', 'creams cannot reach it'] },
];

export function SkinCrossSection({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <svg
      viewBox="0 0 520 330"
      className="w-full h-auto"
      role="img"
      aria-label="Cross-section of skin showing how deep skincare ingredients reach"
    >
      {BANDS.map((band) => {
        const layer = SKIN_LAYERS.find((l) => l.id === band.id)!;
        const active = selected === band.id;
        return (
          <g
            key={band.id}
            onClick={() => onSelect(band.id)}
            className="cursor-pointer"
            role="button"
            tabIndex={0}
            aria-pressed={active}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(band.id);
              }
            }}
          >
            <rect
              x={16}
              y={band.y}
              width={224}
              height={band.h}
              rx={6}
              fill={band.fill}
              stroke={active ? 'var(--color-accent)' : 'var(--color-line)'}
              strokeWidth={active ? 2.5 : 1}
            />
            <text
              x={30}
              y={band.y + band.h / 2 - 3}
              fontSize={13}
              fontWeight={active ? 700 : 600}
              fill="var(--color-ink)"
            >
              {layer.name}
            </text>
            <text x={30} y={band.y + band.h / 2 + 13} fontSize={11} fill="var(--color-muted)">
              {layer.plain}
            </text>
          </g>
        );
      })}

      {MARKERS.map((m, i) => (
        <g key={i} aria-hidden="true">
          <line
            x1={240}
            y1={m.y}
            x2={268}
            y2={m.y}
            stroke="var(--color-muted)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          <circle cx={268} cy={m.y} r={3} fill="var(--color-accent)" />
          <text x={278} y={m.y} fontSize={11.5} fill="var(--color-muted)">
            {m.lines.map((line, li) => (
              <tspan key={li} x={278} dy={li === 0 ? 0 : 14}>
                {line}
              </tspan>
            ))}
          </text>
        </g>
      ))}

      <text x={16} y={324} fontSize={10.5} fill="var(--color-muted)">
        Tap a layer to read what it does. Depths are illustrative, not to scale.
      </text>
    </svg>
  );
}

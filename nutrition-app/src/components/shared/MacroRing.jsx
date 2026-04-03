/**
 * MacroRing — SVG circular progress ring
 *
 * Props:
 *   label    — "Calories" | "Protein" etc.
 *   current  — current value
 *   goal     — target value
 *   unit     — "kcal" | "g"
 *   color    — stroke color
 *   size     — "lg" | "sm"
 */
export default function MacroRing({ label, current, goal, unit = 'g', color = 'var(--color-accent)', size = 'sm' }) {
  const isLarge = size === 'lg'
  const radius = isLarge ? 70 : 36
  const stroke = isLarge ? 10 : 6
  const svgSize = (radius + stroke) * 2
  const circumference = 2 * Math.PI * radius
  const percent = Math.min((current / goal) * 100, 100)
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} className="-rotate-90">
          {/* Background track */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-gray-100"
          />
          {/* Progress arc */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-bold leading-none"
            style={{
              fontSize: isLarge ? '1.5rem' : '0.85rem',
              color: 'var(--color-text)',
            }}
          >
            {current}
          </span>
          <span
            className="leading-none mt-0.5"
            style={{
              fontSize: isLarge ? '0.7rem' : '0.6rem',
              color: 'var(--color-muted)',
            }}
          >
            / {goal}{unit}
          </span>
        </div>
      </div>

      <span
        className="font-medium text-center"
        style={{
          fontSize: isLarge ? '0.85rem' : '0.7rem',
          color: 'var(--color-muted)',
        }}
      >
        {label}
      </span>
    </div>
  )
}

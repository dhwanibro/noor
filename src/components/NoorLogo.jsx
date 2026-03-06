// Clean, typographic logo — "Noor" in Cormorant Garamond
// The single O has a subtle gold dot of light underneath — minimal, editorial
export default function NoorLogo({ size = 'sm', dark = false }) {
  const configs = {
    sm: { width: 58, height: 28, fontSize: 22, tracking: 3 },
    md: { width: 86, height: 40, fontSize: 32, tracking: 4 },
    lg: { width: 120, height: 56, fontSize: 46, tracking: 5 },
  }
  const c = configs[size]
  const textColor = dark ? '#FAF8F5' : '#1A1814'
  const gold = '#C9A84C'

  return (
    <svg
      width={c.width}
      height={c.height}
      viewBox={`0 0 ${c.width} ${c.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Noor"
    >
      <text
        x="0"
        y={c.fontSize * 0.88}
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize={c.fontSize}
        fontWeight="600"
        fill={textColor}
        letterSpacing={c.tracking}
      >
        Noor
      </text>
      {/* Single gold dot — a point of light beneath the second O */}
      <circle
        cx={c.width * 0.72}
        cy={c.height - 4}
        r={2.2}
        fill={gold}
        opacity="0.9"
      />
    </svg>
  )
}

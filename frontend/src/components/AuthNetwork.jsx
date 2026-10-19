const links = [
  'M40 110 170 70 260 155 390 95 520 165 650 90',
  'M40 110 105 260 260 155 310 325 520 165 590 350',
  'M105 260 35 430 190 485 310 325 430 490 590 350 665 520',
  'M35 430 105 620 250 570 430 490 520 675 665 520',
  'M105 620 45 790 250 570 330 760 520 675 650 820',
  'M190 485 250 570 330 760',
]

const nodes = [
  [40, 110], [170, 70], [260, 155], [390, 95], [520, 165], [650, 90],
  [105, 260], [310, 325], [590, 350], [35, 430], [190, 485], [430, 490], [665, 520],
  [105, 620], [250, 570], [520, 675], [45, 790], [330, 760], [650, 820],
]

export default function AuthNetwork() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-65"
      viewBox="0 0 1440 900"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <g transform="scale(2.05 1)" stroke="#718a42" strokeOpacity="0.68" strokeWidth="1.4">
        {links.map((path, index) => (
          <path
            key={path}
            d={path}
            pathLength="1"
            className="auth-network-link"
            style={{ animationDelay: `${index * 0.65}s` }}
          />
        ))}
        <path d="M170 70Q220 20 310 35T520 165M40 110Q0 260 105 260M390 95Q470 35 650 90M590 350Q700 410 665 520M105 620Q170 690 45 790M430 490Q390 620 520 675" strokeDasharray="3 8" />
      </g>
      <g transform="scale(2.05 1)">
        {nodes.map(([x, y], index) => (
          <g key={`${x}-${y}`}>
            <circle
              cx={x}
              cy={y}
              r={index % 4 === 0 ? 12 : 8}
              fill="#c9f06a"
              fillOpacity="0.34"
              className="auth-network-halo"
              style={{ animationDelay: `${0.35 + index * 0.22}s` }}
            />
            <circle
              cx={x}
              cy={y}
              r={index % 4 === 0 ? 4 : 3}
              fill="#536e2e"
              fillOpacity="0.9"
              className="auth-network-node"
              style={{ animationDelay: `${0.35 + index * 0.22}s` }}
            />
          </g>
        ))}
      </g>
    </svg>
  )
}

"use client";

type HexKind = "outline" | "filled" | "small" | "strong";
type HexSpec = [x: number, y: number, kind: HexKind, strokeWidth?: number];

const hexagons: HexSpec[] = [
  [0, 0, "outline"], [138.6, 0, "strong"], [277.1, 0, "small"], [415.7, 0, "small"],
  [554.2, 0, "filled"], [692.8, 0, "filled"], [831.4, 0, "filled"], [969.9, 0, "outline"],
  [1247, 0, "outline"], [1385.6, 0, "outline"], [1524.2, 0, "outline"], [1662.7, 0, "outline"],
  [1801.3, 0, "outline"], [1939.8, 0, "strong"],

  [-69.3, 120, "filled"], [69.3, 120, "outline"], [207.8, 120, "filled"], [346.4, 120, "outline"],
  [485, 120, "filled"], [762.1, 120, "outline"], [900.6, 120, "small"], [1177.8, 120, "filled"],
  [1316.3, 120, "strong"], [1454.9, 120, "outline"], [1593.4, 120, "filled"],
  [1732, 120, "strong"], [1870.6, 120, "outline"],

  [0, 240, "outline"], [138.6, 240, "filled"], [277.1, 240, "small"], [415.7, 240, "outline"],
  [1524.2, 240, "strong"], [1662.7, 240, "outline"], [1801.3, 240, "outline"], [1939.8, 240, "outline"],

  [346.4, 360, "outline"], [485, 360, "outline"], [1593.4, 360, "filled"],
  [1732, 360, "small"], [1870.6, 360, "small"],

  [415.7, 480, "filled"], [1524.2, 480, "filled"], [1662.7, 480, "small"],
  [1801.3, 480, "outline"], [1939.8, 480, "outline"],

  [346.4, 600, "outline"], [1454.9, 600, "small"], [1593.4, 600, "small"],
  [1732, 600, "filled"], [1870.6, 600, "filled"],

  [1662.7, 720, "filled"], [1801.3, 720, "small"], [1939.8, 720, "outline"],

  [-69.3, 840, "outline"], [69.3, 840, "filled"], [207.8, 840, "filled"],
  [346.4, 840, "strong", 1.5], [485, 840, "outline"], [1593.4, 840, "outline"],
  [1732, 840, "filled"], [1870.6, 840, "filled"],

  [0, 960, "filled"], [138.6, 960, "filled"], [277.1, 960, "small"], [415.7, 960, "strong", 1.5],
  [1247, 960, "filled"], [1385.6, 960, "filled"], [1524.2, 960, "small"],
  [1662.7, 960, "strong", 1.5], [1801.3, 960, "strong", 1.5], [1939.8, 960, "outline"],

  [-69.3, 1080, "outline"], [69.3, 1080, "outline"], [207.8, 1080, "small"],
  [346.4, 1080, "filled"], [485, 1080, "outline"], [623.5, 1080, "strong", 1.5],
  [762.1, 1080, "filled"], [900.6, 1080, "outline"], [1039.2, 1080, "small"],
  [1177.8, 1080, "outline"], [1316.3, 1080, "strong", 1.5], [1454.9, 1080, "filled"],
  [1593.4, 1080, "outline"], [1732, 1080, "filled"], [1870.6, 1080, "outline"],

  [0, 1200, "outline"], [138.6, 1200, "outline"], [277.1, 1200, "filled"],
  [415.7, 1200, "filled"], [554.2, 1200, "filled"], [692.8, 1200, "small"],
  [831.4, 1200, "small"], [969.9, 1200, "small"], [1108.5, 1200, "small"],
  [1247, 1200, "filled"], [1385.6, 1200, "filled"], [1524.2, 1200, "filled"],
  [1662.7, 1200, "outline"], [1801.3, 1200, "outline"], [1939.8, 1200, "outline"],
];

function Hex({ spec: [x, y, kind, strokeWidth] }: { spec: HexSpec }) {
  if (kind === "small") {
    return (
      <use
        href="#hex-bg"
        transform={`translate(${x}, ${y}) scale(0.6)`}
        fill="rgba(37,99,235,0.06)"
        stroke="none"
      />
    );
  }

  const filled = kind === "filled";
  const strong = kind === "strong";

  return (
    <use
      href="#hex-bg"
      x={x}
      y={y}
      fill={filled ? "rgba(37,99,235,0.03)" : "none"}
      stroke={
        filled
          ? "rgba(59,130,246,0.05)"
          : strong
            ? "rgba(59,130,246,0.25)"
            : "rgba(59,130,246,0.12)"
      }
      strokeWidth={strokeWidth ?? (strong ? 1.5 : 1)}
    />
  );
}

function BeamMask({ side }: { side: "left" | "right" }) {
  const beamHexagons = hexagons.filter(([x, y, kind]) => {
    if (kind === "small") return false;
    if ((x === 415.7 || x === 1524.2) && y === 480) return false;
    return side === "left" ? x <= 969.9 : x >= 1177.8;
  });

  return (
    <g>
      {beamHexagons.map(([x, y], index) => (
        <use
          href="#hex-bg"
          x={x}
          y={y}
          fill="black"
          stroke="white"
          strokeWidth="3"
          key={index}
        />
      ))}
    </g>
  );
}

export default function SiteBackground() {
  return (
    <div className="moving-hex-background" aria-hidden="true">
      <svg
        className="moving-hex-background__svg"
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <polygon
            id="hex-bg"
            points="0,-80 69.28,-40 69.28,40 0,80 -69.28,40 -69.28,-40"
          />

          <linearGradient id="beam-gradient-left" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(120,190,255,0)" />
            <stop offset="35%" stopColor="rgba(120,190,255,0)" />
            <stop offset="50%" stopColor="rgba(120,190,255,0.38)" />
            <stop offset="65%" stopColor="rgba(120,190,255,0)" />
            <stop offset="100%" stopColor="rgba(120,190,255,0)" />
          </linearGradient>

          <linearGradient id="beam-gradient-right" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(140,200,255,0)" />
            <stop offset="35%" stopColor="rgba(140,200,255,0)" />
            <stop offset="50%" stopColor="rgba(140,200,255,0.38)" />
            <stop offset="65%" stopColor="rgba(140,200,255,0)" />
            <stop offset="100%" stopColor="rgba(140,200,255,0)" />
          </linearGradient>

          <g id="hexBlock-bg">
            {hexagons.map((spec, index) => (
              <Hex spec={spec} key={index} />
            ))}
          </g>

          <mask id="hex-mask-left">
            <rect width="1920" height="1080" fill="black" />
            <BeamMask side="left" />
          </mask>

          <mask id="hex-mask-right">
            <rect width="1920" height="1080" fill="black" />
            <BeamMask side="right" />
          </mask>
        </defs>

        <use href="#hexBlock-bg" />

        <rect
          className="moving-hex-background__beam"
          y="0"
          width="750"
          height="1080"
          fill="url(#beam-gradient-left)"
          mask="url(#hex-mask-left)"
        >
          <animate
            attributeName="x"
            values="-750; 750"
            dur="10s"
            repeatCount="indefinite"
          />
        </rect>

        <rect
          className="moving-hex-background__beam"
          y="0"
          width="850"
          height="1080"
          fill="url(#beam-gradient-right)"
          mask="url(#hex-mask-right)"
        >
          <animate
            attributeName="x"
            values="750; 2700"
            dur="13s"
            begin="-5s"
            repeatCount="indefinite"
          />
        </rect>
      </svg>
    </div>
  );
}

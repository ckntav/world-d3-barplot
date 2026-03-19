import * as d3 from "d3";
import { useEffect, useState, useRef } from "react";

const data = [
  { country: "🇺🇸 United States", students: 68 },
  { country: "🇫🇷 France", students: 21 },
  { country: "🇬🇧 United Kingdom", students: 21 },
  { country: "🇩🇪 Germany", students: 20 },
  { country: "🇨🇭 Switzerland", students: 13 },
  { country: "🇪🇸 Spain", students: 10 },
  { country: "🇳🇱 Netherlands", students: 9 },
  { country: "🇮🇳 India", students: 9 },
  { country: "🇸🇬 Singapore", students: 8 },
  { country: "🇮🇪 Ireland", students: 8 },
  { country: "🇸🇪 Sweden", students: 7 },
  { country: "🇦🇺 Australia", students: 7 },
  { country: "🇨🇦 Canada", students: 6 },
  { country: "🇫🇮 Finland", students: 5 },
  { country: "🇲🇽 Mexico", students: 4 },
  { country: "🇧🇷 Brazil", students: 4 },
  { country: "🇸🇦 Saudi Arabia", students: 3 },
  { country: "🇷🇴 Romania", students: 3 },
  { country: "🇵🇭 Philippines", students: 3 },
  { country: "🇳🇿 New Zealand", students: 3 },
];

const total = data.reduce((sum, d) => sum + d.students, 0);
const countryCount = data.length;

const HIGHLIGHT = "🇨🇦 Canada";

const MARGIN = { top: 20, right: 30, bottom: 20, left: 160 };
const WIDTH = 800;
const HEIGHT = 600;
const innerWidth = WIDTH - MARGIN.left - MARGIN.right;
const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom;

// Cubic ease out
function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Confetti particle
function randomConfetti(id) {
  return {
    id,
    x: Math.random() * WIDTH,
    y: -10,
    vx: (Math.random() - 0.5) * 4,
    vy: Math.random() * 4 + 2,
    color: ["#4f46e5", "#f59e0b", "#10b981", "#ec4899", "#ef4444", "#8b5cf6"][
      Math.floor(Math.random() * 6)
    ],
    size: Math.random() * 8 + 4,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
  };
}

function Barplot({ data, progress, setTooltip }) {
  const yScale = d3
    .scaleBand()
    .domain(data.map((d) => d.country))
    .range([0, innerHeight])
    .padding(0.2);

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.students)])
    .range([0, innerWidth]);

  const badgeW = 150;
  const badgeH = 64;
  const badgeX = innerWidth - badgeW;
  const badgeY = innerHeight - badgeH - 10;
  const badge2W = 150;
  const badge2H = 64;
  const badge2X = innerWidth - badge2W;
  const badge2Y = badgeY - badge2H - 12;

  const bandwidth = yScale.bandwidth();

  return (
    <svg width={WIDTH} height={HEIGHT} style={{ overflow: "visible" }}>
      <defs>
        <marker
          id="pinArrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path
            d="M2 1L8 5L2 9"
            fill="none"
            stroke="#b45309"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
        <linearGradient id="barGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#3730a3" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
        {data.map((d) => {
          const isHighlight = d.country === HIGHLIGHT;
          const barWidth = Math.max(xScale(d.students) * progress, 1);
          const y = yScale(d.country);
          const bh = bandwidth;
          const pillR = bh / 2;
          const barFill = isHighlight ? "url(#goldGrad)" : "url(#barGrad)";
          return (
            <g
              key={d.country}
              onMouseEnter={() => {
                const pct = ((d.students / total) * 100).toFixed(1);
                setTooltip({
                  visible: true,
                  x: barWidth + MARGIN.left + 8,
                  y: y + bh / 2 + MARGIN.top,
                  text: `${pct}% of cohort`,
                });
              }}
              onMouseLeave={() => setTooltip({ visible: false })}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={0}
                y={y}
                width={barWidth}
                height={bh}
                rx={pillR}
                ry={pillR}
                fill={barFill}
              />
              <text
                x={-8}
                y={y + bh / 2}
                textAnchor="end"
                dominantBaseline="central"
                fontSize={isHighlight ? 15 : 14}
                fontWeight={isHighlight ? 700 : 400}
                fill={isHighlight ? "#b45309" : "#111827"}
              >
                {d.country}
              </text>
              {progress === 1 && (
                <>
                  <text
                    x={xScale(d.students) + 10}
                    y={y + bh / 2}
                    dominantBaseline="central"
                    fontSize={13}
                    fontWeight={isHighlight ? 700 : 400}
                    fill={isHighlight ? "#b45309" : "#6b7280"}
                  >
                    {isHighlight ? `${d.students}` : d.students}
                  </text>
                  {isHighlight &&
                    (() => {
                      const arrowStartX = xScale(d.students) + 28;
                      const arrowEndX = xScale(d.students) + 70;
                      const midY = y + bh / 2;
                      const calloutY = midY - 38;
                      return (
                        <>
                          {/* Curved arrow from bar to callout */}
                          <path
                            d={`M ${arrowStartX} ${midY} C ${arrowStartX + 10} ${midY} ${arrowEndX - 10} ${calloutY + 10} ${arrowEndX} ${calloutY}`}
                            fill="none"
                            stroke="#b45309"
                            markerEnd="url(#pinArrow)"
                          />
                          {/* Callout box — offset to add space after arrow tip */}
                          <rect
                            x={arrowEndX + 8}
                            y={calloutY - 30}
                            width={148}
                            height={52}
                            rx={8}
                            fill="#fef3c7"
                          />
                          {/* Pin line */}
                          <text
                            x={arrowEndX + 18}
                            y={calloutY - 12}
                            fontSize={15}
                            dominantBaseline="central"
                            fill="#b45309"
                            fontWeight={700}
                          >
                            📍 I'm here!
                          </text>
                          {/* Québec + fleur de lys line */}
                          <text
                            x={arrowEndX + 18}
                            y={calloutY + 10}
                            fontSize={14}
                            dominantBaseline="central"
                            fill="#b45309"
                            fontStyle="italic"
                          >
                            Québec ⚜️
                          </text>
                        </>
                      );
                    })()}
                </>
              )}
            </g>
          );
        })}

        {/* Students badge */}
        <g transform={`translate(${badgeX}, ${badgeY})`}>
          <rect width={badgeW} height={badgeH} rx={12} fill="#4f46e5" />
          <text
            x={badgeW / 2}
            y={26}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={26}
            fontWeight={700}
            fill="#ffffff"
          >
            {Math.round(total * progress)}
          </text>
          <text
            x={badgeW / 2}
            y={52}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={11}
            fill="#c7d2fe"
          >
            students worldwide
          </text>
        </g>

        {/* Countries badge */}
        <g transform={`translate(${badge2X}, ${badge2Y})`}>
          <rect width={badge2W} height={badge2H} rx={12} fill="#4f46e5" />
          <text
            x={badge2W / 2}
            y={26}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={26}
            fontWeight={700}
            fill="#ffffff"
          >
            {countryCount}
          </text>
          <text
            x={badge2W / 2}
            y={52}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={11}
            fill="#c7d2fe"
          >
            countries represented
          </text>
        </g>
      </g>
    </svg>
  );
}

function ConfettiCanvas({ active }) {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    particles.current = Array.from({ length: 80 }, (_, i) => randomConfetti(i));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current = particles.current.filter(
        (p) => p.y < canvas.height + 20,
      );
      particles.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.rotation += p.rotationSpeed;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      if (particles.current.length > 0) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        width: WIDTH,
        height: HEIGHT,
      }}
    />
  );
}

export default function App() {
  const [progress, setProgress] = useState(0);
  const [tooltip, setTooltip] = useState({ visible: false });
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    const duration = 1400;
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeOut(t);
      setProgress(Math.min(eased, 1));
      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        setProgress(1);
        setConfetti(true);
      }
    };
    requestAnimationFrame(animate);
  }, []);

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        padding: "1.5rem",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        minWidth: "100vw",
        boxSizing: "border-box",
        margin: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2 style={{ marginBottom: "0", color: "#111827" }}>First cohort</h2>
      <h3
        style={{
          marginTop: "0.25rem",
          marginBottom: "0.75rem",
          fontWeight: 400,
          color: "#6b7280",
        }}
      >
        Where are we coming from?
      </h3>

      <div style={{ position: "relative", display: "inline-block" }}>
        <Barplot data={data} progress={progress} setTooltip={setTooltip} />
        <ConfettiCanvas active={confetti} />
        {tooltip.visible && (
          <div
            style={{
              position: "absolute",
              left: tooltip.x,
              top: tooltip.y,
              transform: "translateY(-50%)",
              backgroundColor: "#1f2937",
              color: "#fff",
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            {tooltip.text}
          </div>
        )}
      </div>

      <footer style={{ marginTop: "1rem", fontSize: "12px", color: "#6b7280" }}>
        This project is part of the course
        <br />
        <a
          href="https://www.react-graph-gallery.com/react-d3-dataviz-course"
          target="_blank"
          rel="noreferrer"
          style={{ color: "#4f46e5", textDecoration: "none", fontWeight: 500 }}
        >
          D3 ❤️ React
        </a>
      </footer>
    </div>
  );
}

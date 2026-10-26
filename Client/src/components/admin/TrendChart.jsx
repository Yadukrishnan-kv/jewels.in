import { useMemo, useState } from "react";
import { formatPrice } from "../../utils/currency.js";

const WIDTH = 600;
const HEIGHT = 180;
const PAD_TOP = 14;
const PAD_BOTTOM = 26;

export default function TrendChart({ data = [] }) {
  const [hoverIdx, setHoverIdx] = useState(null);

  const { points, areaPath, linePath, maxValue } = useMemo(() => {
    const values = data.map((d) => d.revenue);
    const max = Math.max(1, ...values);
    const step = data.length > 1 ? WIDTH / (data.length - 1) : WIDTH;
    const innerH = HEIGHT - PAD_TOP - PAD_BOTTOM;
    const pts = data.map((d, i) => ({
      x: data.length > 1 ? i * step : WIDTH / 2,
      y: PAD_TOP + innerH - (d.revenue / max) * innerH,
      ...d,
    }));
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    const area = `${line} L${pts[pts.length - 1]?.x ?? 0},${HEIGHT - PAD_BOTTOM} L${pts[0]?.x ?? 0},${HEIGHT - PAD_BOTTOM} Z`;
    return { points: pts, areaPath: area, linePath: line, maxValue: max };
  }, [data]);

  if (!data.length) return null;
  const active = hoverIdx !== null ? points[hoverIdx] : null;

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const idx = Math.round(ratio * (points.length - 1));
    setHoverIdx(Math.max(0, Math.min(points.length - 1, idx)));
  }

  return (
    <div className="relative">
      {active && (
        <div
          className="absolute -top-1 bg-primary text-white text-xs rounded-lg px-2.5 py-1.5 pointer-events-none shadow-elevated z-10 whitespace-nowrap"
          style={{ left: `${(active.x / WIDTH) * 100}%`, transform: "translate(-50%, -110%)" }}
        >
          <p className="font-semibold">{formatPrice(active.revenue)}</p>
          <p className="text-white/60 text-[0.65rem]">
            {new Date(active.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })} · {active.orders} order
            {active.orders === 1 ? "" : "s"}
          </p>
        </div>
      )}
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-[160px] md:h-[180px] overflow-visible"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIdx(null)}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(var(--color-accent-rgb))" stopOpacity="0.22" />
            <stop offset="100%" stopColor="rgb(var(--color-accent-rgb))" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={0}
            x2={WIDTH}
            y1={PAD_TOP + (HEIGHT - PAD_TOP - PAD_BOTTOM) * f}
            y2={PAD_TOP + (HEIGHT - PAD_TOP - PAD_BOTTOM) * f}
            stroke="rgb(var(--color-border-rgb))"
            strokeDasharray="4 5"
            strokeWidth="1"
          />
        ))}
        <path d={areaPath} fill="url(#trendFill)" />
        <path d={linePath} fill="none" stroke="rgb(var(--color-accent-rgb))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {active && (
          <>
            <line x1={active.x} x2={active.x} y1={PAD_TOP} y2={HEIGHT - PAD_BOTTOM} stroke="rgb(var(--color-accent-rgb))" strokeOpacity="0.2" />
            <circle cx={active.x} cy={active.y} r="4.5" fill="white" stroke="rgb(var(--color-accent-rgb))" strokeWidth="2.5" />
          </>
        )}
      </svg>
      <div className="flex justify-between text-[0.7rem] text-primary/35 mt-1 px-0.5">
        <span>{new Date(data[0].date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
        <span>{new Date(data[data.length - 1].date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
      </div>
      <span className="sr-only">Peak day revenue {formatPrice(maxValue)}</span>
    </div>
  );
}

import { useEffect, useState } from "react";

export function ScoreCircle({
  correct,
  total,
  percentage,
  tone = "primary",
}: {
  correct: number;
  total: number;
  percentage: number;
  tone?: "primary" | "neon";
}) {
  const [progress, setProgress] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1200;
    let frame = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(percentage * eased);
      setCount(Math.round(correct * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [percentage, correct]);

  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const stroke = tone === "neon" ? "var(--neon)" : "var(--primary)";

  return (
    <div className="relative grid h-48 w-48 place-items-center">
      <svg className="h-48 w-48 -rotate-90" viewBox="0 0 180 180" aria-hidden>
        <circle cx="90" cy="90" r={radius} fill="none" stroke="var(--muted)" strokeWidth="12" />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (circumference * progress) / 100}
          style={{ filter: `drop-shadow(0 0 10px ${stroke})` }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-display text-4xl font-bold tabular-nums">
          {count}
          <span className="text-xl text-muted-foreground">/{total}</span>
        </div>
        <div className="mt-1 text-sm font-semibold text-muted-foreground tabular-nums">
          {Math.round(progress)}%
        </div>
      </div>
      <span className="sr-only">
        Score {correct} out of {total}, {percentage} percent
      </span>
    </div>
  );
}

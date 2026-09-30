import { useEffect, useRef, useState } from "react";
import { LIFELINES, pickRandomLifeline, type LifelineId } from "@/lib/quiz-engine";
import { cn } from "@/lib/utils";

const SEGMENT_COLORS = [
  "color-mix(in oklab, var(--primary) 75%, black)",
  "color-mix(in oklab, var(--neon) 70%, black)",
  "color-mix(in oklab, var(--accent) 72%, black)",
  "color-mix(in oklab, var(--arcade) 70%, black)",
];

const SPIN_MS = 4200;

export function SpinWheel({
  locked,
  result,
  onResult,
}: {
  locked: boolean;
  result: LifelineId | null;
  onResult: (lifeline: LifelineId) => void;
}) {
  const [rotation, setRotation] = useState(() => (result ? targetRotation(indexOf(result)) : 0));
  const [spinning, setSpinning] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); }, []);

  const spin = () => {
    if (locked || spinning) return;
    const chosen = pickRandomLifeline();
    setSpinning(true);
    setRotation((prev) => {
      const base = Math.ceil(prev / 360) * 360;
      return base + 360 * 5 + targetRotation(indexOf(chosen));
    });
    timeoutRef.current = window.setTimeout(() => {
      setSpinning(false);
      onResult(chosen);
    }, SPIN_MS);
  };

  const gradient = `conic-gradient(${LIFELINES.map(
    (_, i) => `${SEGMENT_COLORS[i]} ${i * 90}deg ${(i + 1) * 90}deg`,
  ).join(", ")})`;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div
          aria-hidden
          className="absolute left-1/2 top-[-14px] z-20 h-0 w-0 -translate-x-1/2 border-x-[12px] border-t-[22px] border-x-transparent border-t-accent drop-shadow-[0_0_10px_var(--accent)]"
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-[-28px] rounded-full bg-neon/20 blur-3xl transition-opacity",
            spinning ? "opacity-100" : "opacity-60",
          )}
        />
        <div
          className="relative h-64 w-64 rounded-full border-4 border-border shadow-[0_0_60px_-10px_var(--neon)] sm:h-80 sm:w-80"
          style={{
            backgroundImage: gradient,
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? `transform ${SPIN_MS}ms cubic-bezier(0.17, 0.67, 0.16, 1)` : undefined,
          }}
          role="img"
          aria-label="Lifeline wheel with Hint, 50/50, Skip and +1 Life"
        >
          {LIFELINES.map((lifeline, i) => (
            <div
              key={lifeline.id}
              className="absolute left-1/2 top-1/2 h-1/2 origin-top"
              style={{ transform: `rotate(${i * 90 + 45}deg)` }}
            >
              <div className="mt-6 -translate-x-1/2 text-center">
                <div className="text-2xl" aria-hidden>
                  {lifeline.emoji}
                </div>
                <div className="mt-1 whitespace-nowrap font-display text-xs font-bold text-neon-foreground">
                  {lifeline.label}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute left-1/2 top-1/2 z-10 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-background bg-card font-display text-xs font-bold">
          SPIN
        </div>
      </div>

      <button
        onClick={spin}
        disabled={locked || spinning}
        className={cn(
          "inline-flex min-w-44 items-center justify-center rounded-xl px-6 py-3 font-display text-base font-bold transition-transform",
          locked || spinning
            ? "cursor-not-allowed bg-secondary text-muted-foreground"
            : "bg-arcade text-neon-foreground hover:scale-[1.03] active:scale-[0.98]",
        )}
      >
        {spinning ? "Spinning…" : locked ? "Wheel locked" : "SPIN"}
      </button>
    </div>
  );
}

function indexOf(id: LifelineId) {
  return Math.max(0, LIFELINES.findIndex((l) => l.id === id));
}

function targetRotation(index: number) {
  return (360 - (index * 90 + 45) + 360) % 360;
}

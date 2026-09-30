import { Clock } from "lucide-react";
import { formatTime } from "@/lib/quiz-engine";
import { cn } from "@/lib/utils";

export function Timer({ remainingSec }: { remainingSec: number }) {
  const urgent = remainingSec <= 5 * 60;
  return (
    <div
      role="timer"
      aria-live="off"
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border px-3 py-2 font-display text-base font-bold tabular-nums transition-colors",
        urgent
          ? "animate-pulse-glow border-destructive/60 bg-destructive/10 text-destructive"
          : "border-border bg-card/70 text-foreground",
      )}
    >
      <Clock className={cn("h-4 w-4", urgent && "animate-pulse")} aria-hidden />
      <span>{formatTime(remainingSec)}</span>
      <span className="sr-only">remaining</span>
    </div>
  );
}

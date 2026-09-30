import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { QuizResult } from "@/lib/quiz-engine";
import { formatTime } from "@/lib/quiz-engine";
import { cn } from "@/lib/utils";

export function HistoryCard({ result }: { result: QuizResult }) {
  const gameOver = result.endReason === "gameover";
  const date = new Date(result.date);
  return (
    <article className={cn("rounded-2xl p-5 animate-fade-up glass glass-hover", gameOver && "neon-frame")}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="min-w-0">
          <h3 className="truncate font-display text-base font-bold">
            {result.categoryName} <span className="text-muted-foreground">|</span> {result.topicName}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {date.toLocaleDateString()} · {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ·{" "}
            {formatTime(result.timeUsedSec)} used
          </p>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-display text-xl font-bold tabular-nums">
            {result.correct}/{result.total}
          </div>
          <div className="text-xs font-semibold text-muted-foreground">{result.percentage}%</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium">
        <span className="rounded-full bg-success/15 px-2.5 py-1 text-success">✅ {result.correct} correct</span>
        <span className="rounded-full bg-destructive/15 px-2.5 py-1 text-destructive">❌ {result.wrong} wrong</span>
        <span className="rounded-full bg-accent/15 px-2.5 py-1 text-accent">⏭️ {result.skipped} skipped</span>
        <span
          className={cn(
            "rounded-full px-2.5 py-1",
            gameOver ? "bg-neon/15 text-neon" : "bg-secondary text-muted-foreground",
          )}
        >
          {gameOver ? "💀 Game Over — lives lost" : result.endReason === "timeout" ? "⏱️ Time up" : "Completed"}
        </span>
      </div>

      <Link
        to="/result/$quizId"
        params={{ quizId: result.id }}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
      >
        View result <ArrowUpRight className="h-4 w-4" />
      </Link>
    </article>
  );
}

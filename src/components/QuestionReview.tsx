import { Check, SkipForward, X, CircleHelp } from "lucide-react";
import type { ReviewItem } from "@/lib/quiz-engine";
import { cn } from "@/lib/utils";

const LETTERS = ["A", "B", "C", "D"];

const STATUS = {
  correct: { label: "Correct", icon: Check, className: "bg-success/15 text-success border-success/40" },
  wrong: { label: "Wrong", icon: X, className: "bg-destructive/15 text-destructive border-destructive/40" },
  skipped: { label: "Skipped", icon: SkipForward, className: "bg-accent/15 text-accent border-accent/40" },
  unanswered: { label: "Unanswered", icon: CircleHelp, className: "bg-muted text-muted-foreground border-border" },
} as const;

export function QuestionReview({ items }: { items: ReviewItem[] }) {
  return (
    <ol className="grid gap-4">
      {items.map((item, i) => {
        const meta = STATUS[item.status];
        const Icon = meta.icon;
        return (
          <li key={i} className="rounded-2xl p-5 glass">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Question {i + 1}
                </p>
                <h3 className="mt-1 text-base font-semibold leading-snug">{item.question}</h3>
              </div>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                  meta.className,
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden /> {meta.label}
              </span>
            </div>

            <div className="mt-4 grid gap-2">
              {item.options.map((option, oi) => {
                const isCorrect = oi === item.correctAnswer;
                const isChosen = oi === item.chosen;
                return (
                  <div
                    key={oi}
                    className={cn(
                      "flex items-start gap-2.5 rounded-xl border px-3 py-2 text-sm",
                      isCorrect && "border-success/50 bg-success/10",
                      isChosen && !isCorrect && "border-destructive/50 bg-destructive/10",
                      !isCorrect && !isChosen && "border-border/60 bg-card/40 text-muted-foreground",
                    )}
                  >
                    <span className="font-display text-xs font-bold">{LETTERS[oi]}</span>
                    <span className="min-w-0 flex-1">{option}</span>
                    {isCorrect && <span className="shrink-0 text-xs font-semibold text-success">Correct</span>}
                    {isChosen && !isCorrect && (
                      <span className="shrink-0 text-xs font-semibold text-destructive">Your answer</span>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="mt-3 rounded-xl bg-secondary/60 px-3 py-2.5 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Explanation: </span>
              {item.explanation}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

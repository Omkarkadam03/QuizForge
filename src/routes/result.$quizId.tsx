import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ErrorState, LoadingState } from "@/components/states";
import { ScoreCircle } from "@/components/ScoreCircle";
import { QuestionReview } from "@/components/QuestionReview";
import { formatTime, LIFELINES } from "@/lib/quiz-engine";
import { useApp } from "@/lib/quiz-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/result/$quizId")({
  head: () => ({
    meta: [
      { title: "Quiz Result — QuizForge" },
      { name: "description", content: "See your QuizForge score, percentage, time used and a full explanation-backed question review." },
      { property: "og:title", content: "Quiz Result — QuizForge" },
      { property: "og:description", content: "Score, stats and a full question-by-question review with explanations." },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const { quizId } = Route.useParams();
  const { hydrated, getResult, preparePending } = useApp();
  const navigate = useNavigate();
  const result = getResult(quizId);

  if (!hydrated) {
    return (
      <AppShell>
        <LoadingState label="Loading your result…" />
      </AppShell>
    );
  }

  if (!result) {
    return (
      <AppShell>
        <ErrorState message="We couldn't find that result. It may have been cleared from this device." />
      </AppShell>
    );
  }

  const gameOver = result.endReason === "gameover";
  const lifeline = LIFELINES.find((l) => l.id === result.awardedLifeline);

  const tryAgain = () => {
    preparePending(result.category, result.topic);
    if (result.gamingMode) navigate({ to: "/gaming/spin" });
    else navigate({ to: "/rules/$category", params: { category: result.category } });
  };

  const stats = [
    { label: "Correct", value: result.correct, emoji: "✅", tone: "text-success" },
    { label: "Wrong", value: result.wrong, emoji: "❌", tone: "text-destructive" },
    { label: "Skipped", value: result.skipped, emoji: "⏭️", tone: "text-accent" },
    { label: "Time used", value: formatTime(result.timeUsedSec), emoji: "⏱️", tone: "text-primary" },
  ];

  return (
    <AppShell>
      <section className={cn("relative overflow-hidden rounded-3xl p-6 text-center glass sm:p-10", gameOver && "neon-frame")}>
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-drift" />
        <div className="relative animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {result.categoryName} · {result.topicName}
          </p>
          <h1 className={cn("mt-3 font-display text-3xl font-bold sm:text-4xl", gameOver ? "text-gradient-arcade" : "text-gradient")}>
            {gameOver ? "💀 Game Over!" : result.endReason === "timeout" ? "⏱️ Time's Up!" : "🎉 Quiz Completed!"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {gameOver
              ? "You ran out of lives — but every run makes you sharper."
              : result.percentage >= 70
                ? "Strong performance. Victory!"
                : "Solid attempt — review the answers and go again."}
          </p>

          <div className="mt-8 flex justify-center">
            <ScoreCircle
              correct={result.correct}
              total={result.total}
              percentage={result.percentage}
              tone={gameOver ? "neon" : "primary"}
            />
          </div>

          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border/70 bg-card/50 p-4">
                <div className="text-lg" aria-hidden>
                  {stat.emoji}
                </div>
                <div className={cn("mt-1 font-display text-xl font-bold tabular-nums", stat.tone)}>{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {result.gamingMode && (
            <div className="mx-auto mt-4 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-neon/30 bg-neon/10 p-4">
                <div className="font-display text-sm font-bold text-neon">❤️ Lives</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {result.livesLeft} of {result.initialLives} remaining ·{" "}
                  {result.initialLives - result.livesLeft} lost
                </p>
              </div>
              <div className="rounded-2xl border border-neon/30 bg-neon/10 p-4">
                <div className="font-display text-sm font-bold text-neon">🎁 Lifeline</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {lifeline ? `${lifeline.emoji} ${lifeline.label}` : "None"} ·{" "}
                  {result.awardedLifeline === "life"
                    ? "applied at start"
                    : result.lifelineUsed
                      ? "used"
                      : "unused"}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">Question Review</h2>
        <p className="mt-1 text-sm text-muted-foreground">Every question with your answer, the correct answer and why.</p>
        <div className="mt-6">
          <QuestionReview items={result.review} />
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <button
          onClick={tryAgain}
          className="inline-flex items-center rounded-xl bg-brand px-5 py-3 font-display text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          Try Again
        </button>
        <Link
          to="/category/$category"
          params={{ category: result.category }}
          className="inline-flex items-center rounded-xl border border-border bg-card/60 px-5 py-3 font-display text-sm font-bold transition-colors hover:border-primary/60"
        >
          Choose Another Topic
        </Link>
        <Link
          to="/"
          className="inline-flex items-center rounded-xl border border-border bg-card/60 px-5 py-3 font-display text-sm font-bold transition-colors hover:border-primary/60"
        >
          Back to Home
        </Link>
      </div>
    </AppShell>
  );
}

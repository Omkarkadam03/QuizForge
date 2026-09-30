import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Flag, Lightbulb } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LoadingState } from "@/components/states";
import { Timer } from "@/components/Timer";
import { LifeIndicator } from "@/components/LifeIndicator";
import { getCategory, getTopic } from "@/lib/quiz-bank";
import { LIFELINES, type QuizEndReason } from "@/lib/quiz-engine";
import { useApp } from "@/lib/quiz-store";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/quiz/$category/$topic")({
  head: () => ({
    meta: [
      { title: "Quiz in Progress — QuizForge" },
      { name: "description", content: "Answer 20 questions against a 30-minute timer in QuizForge." },
      { property: "og:title", content: "Quiz in Progress — QuizForge" },
      { property: "og:description", content: "20 questions, 30 minutes, one shot at the top score." },
    ],
  }),
  component: QuizPage,
});

const LETTERS = ["A", "B", "C", "D"];

function QuizPage() {
  const { category, topic } = Route.useParams();
  const { hydrated, quiz, pending, remainingSec, startQuiz, answer, goTo, useLifelineNow, submitQuiz } = useApp();
  const navigate = useNavigate();
  const [gameOver, setGameOver] = useState(false);
  const startedRef = useRef(false);
  const finishedRef = useRef(false);

  const categoryMeta = getCategory(category);
  const topicMeta = getTopic(category, topic);
  const gaming = category === "gaming";

  const finish = useCallback(
    (reason: QuizEndReason) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      const result = submitQuiz(reason);
      if (result) navigate({ to: "/result/$quizId", params: { quizId: result.id } });
      else navigate({ to: "/" });
    },
    [submitQuiz, navigate],
  );

  // Start (or resume) the quiz for this route.
  useEffect(() => {
    if (!hydrated || finishedRef.current) return;
    if (quiz) return;
    if (startedRef.current) return;
    const canStart = pending && pending.category === category && pending.topic === topic && (!gaming || pending.spun);
    if (canStart) {
      startedRef.current = true;
      if (!startQuiz(category, topic)) navigate({ to: "/category/$category", params: { category } });
    } else {
      navigate({ to: "/category/$category", params: { category } });
    }
  }, [hydrated, quiz, pending, category, topic, gaming, startQuiz, navigate]);

  // Timer expiry -> automatic submission.
  useEffect(() => {
    if (quiz && !quiz.submitted && remainingSec <= 0 && Date.now() >= quiz.endsAt) finish("timeout");
  }, [quiz, remainingSec, finish]);

  // Game over -> show a clear, non-blocking transition to the existing result page.
  // Do not use a delayed effect here: React Strict Mode can clean up a timer
  // created by an effect during its development re-run, leaving the overlay stuck.
  useEffect(() => {
    if (!quiz || !quiz.gamingMode || quiz.lives > 0 || gameOver) return;
    setGameOver(true);
  }, [quiz?.quizId, quiz?.gamingMode, quiz?.lives, gameOver]);

  if (!quiz) {
    return (
      <AppShell>
        <LoadingState label="Preparing your questions…" />
      </AppShell>
    );
  }

  const index = quiz.currentIndex;
  const question = quiz.questions[index];
  if (!question) {
    return (
      <AppShell>
        <LoadingState label="Loading question…" />
      </AppShell>
    );
  }

  const chosen = quiz.answers[index];
  const isSkipped = quiz.skipped.includes(index);
  const locked = gaming && Boolean(quiz.locked[index]);
  const hidden = quiz.fiftyFiftyHidden[index] ?? [];
  const lifelineMeta = LIFELINES.find((l) => l.id === quiz.awardedLifeline);
  const answeredCount = Object.keys(quiz.answers).length + quiz.skipped.length;
  const progress = ((index + 1) / quiz.questions.length) * 100;
  const lifelineAvailable =
    gaming && lifelineMeta && !quiz.lifelineUsed && quiz.awardedLifeline !== "life" && chosen === undefined && !isSkipped;

  return (
    <AppShell className="max-w-4xl">
      {gameOver && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/90 px-4 backdrop-blur-sm animate-fade-in">
          <div className="animate-pop text-center">
            <div className="text-6xl" aria-hidden>
              💀
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold text-gradient-arcade">GAME OVER</h2>
            <p className="mt-2 text-sm text-muted-foreground">All lives lost — your run has ended.</p>
            <button
              type="button"
              onClick={() => finish("gameover")}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3 font-display text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Continue to Results
            </button>
          </div>
        </div>
      )}

      <header className={cn("rounded-2xl p-4 glass sm:p-5", gaming && "neon-frame")}>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {categoryMeta?.name} Quiz
            </p>
            <h1 className={cn("truncate font-display text-xl font-bold sm:text-2xl", gaming && "text-gradient-arcade")}>
              {topicMeta?.name}
            </h1>
          </div>
          <Timer remainingSec={remainingSec} />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold">
            Question {index + 1} <span className="text-muted-foreground">of {quiz.questions.length}</span>
          </p>
          {gaming && <LifeIndicator lives={quiz.lives} initialLives={quiz.initialLives} />}
          <p className="text-xs text-muted-foreground">{answeredCount} handled</p>
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={index + 1} aria-valuemin={1} aria-valuemax={quiz.questions.length}>
          <div
            className={cn("h-full rounded-full transition-all duration-500", gaming ? "bg-arcade" : "bg-brand")}
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <section key={index} className="mt-5 animate-fade-up rounded-2xl p-5 glass sm:p-6">
        <h2 className="text-lg font-semibold leading-snug sm:text-xl">{question.question}</h2>

        {quiz.hintForIndex === index && (
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent animate-pop">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>
              <span className="font-semibold">Hint: </span>
              {question.hint}
            </span>
          </p>
        )}

        {isSkipped && (
          <p className="mt-4 rounded-xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
            ⏭️ You skipped this question — no life lost and it won't count as wrong.
          </p>
        )}

        <div className="mt-5 grid gap-3">
          {question.options.map((option, oi) => {
            if (hidden.includes(oi)) {
              return (
                <div key={oi} className="rounded-xl border border-dashed border-border/60 px-4 py-3.5 text-sm text-muted-foreground/50 line-through">
                  {LETTERS[oi]}. {option}
                </div>
              );
            }
            const selected = chosen === oi;
            const revealCorrect = locked && oi === question.correctAnswer;
            const revealWrong = locked && selected && oi !== question.correctAnswer;
            return (
              <button
                key={oi}
                onClick={() => answer(oi)}
                disabled={locked || isSkipped || gameOver}
                aria-pressed={selected}
                className={cn(
                  "group flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all",
                  "border-border/70 bg-card/40 hover:border-primary/60 hover:bg-card/70",
                  selected && !locked && "border-primary bg-primary/15 shadow-[0_0_0_1px_var(--primary)]",
                  revealCorrect && "border-success bg-success/15",
                  revealWrong && "border-destructive bg-destructive/15",
                  (locked || isSkipped) && "cursor-not-allowed",
                )}
              >
                <span
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-lg font-display text-xs font-bold",
                    selected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
                    revealCorrect && "bg-success text-success-foreground",
                    revealWrong && "bg-destructive text-destructive-foreground",
                  )}
                >
                  {LETTERS[oi]}
                </span>
                <span className="min-w-0 flex-1 pt-0.5">{option}</span>
                {revealCorrect && <span className="shrink-0 pt-0.5 text-xs font-semibold text-success">Correct</span>}
                {revealWrong && <span className="shrink-0 pt-0.5 text-xs font-semibold text-destructive">−1 life</span>}
              </button>
            );
          })}
        </div>

        {gaming && lifelineMeta && (
          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border/70 pt-4">
            <button
              onClick={useLifelineNow}
              disabled={!lifelineAvailable}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-transform",
                lifelineAvailable
                  ? "bg-arcade text-neon-foreground hover:scale-[1.03]"
                  : "cursor-not-allowed bg-secondary text-muted-foreground",
              )}
            >
              <span aria-hidden>{lifelineMeta.emoji}</span>
              {quiz.lifelineUsed ? `${lifelineMeta.label} used` : `Use ${lifelineMeta.label}`}
            </button>
            <p className="text-xs text-muted-foreground">
              {quiz.awardedLifeline === "life"
                ? "Your +1 Life bonus is already active — you started with 4 lives."
                : quiz.lifelineUsed
                  ? "Lifeline consumed. You've got this!"
                  : lifelineMeta.blurb}
            </p>
          </div>
        )}
      </section>

      <nav className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:items-center sm:justify-between">
        <button
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card/60 px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary/60 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>

        <div className="order-last col-span-2 sm:order-none">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] sm:w-auto">
                <Flag className="h-4 w-4" /> Submit Quiz
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Submit this quiz?</AlertDialogTitle>
                <AlertDialogDescription>
                  You've handled {answeredCount} of {quiz.questions.length} questions. Unanswered questions score zero
                  and you can't return to this attempt.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep going</AlertDialogCancel>
                <AlertDialogAction onClick={() => finish("submitted")}>Submit now</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <button
          onClick={() => (index === quiz.questions.length - 1 ? finish("completed") : goTo(index + 1))}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card/60 px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary/60"
        >
          {index === quiz.questions.length - 1 ? "Finish" : "Next"} <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </AppShell>
  );
}

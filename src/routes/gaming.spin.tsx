import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { SpinWheel } from "@/components/SpinWheel";
import { LIFELINES, type LifelineId } from "@/lib/quiz-engine";
import { getTopic } from "@/lib/quiz-bank";
import { useApp } from "@/lib/quiz-store";

export const Route = createFileRoute("/gaming/spin")({
  head: () => ({
    meta: [
      { title: "Spin the Wheel — QuizForge Arena" },
      { name: "description", content: "Spin the QuizForge lifeline wheel to win a Hint, 50/50, Skip or an extra life before your arena run." },
      { property: "og:title", content: "Spin the Wheel — QuizForge Arena" },
      { property: "og:description", content: "One spin, one lifeline, three lives. Welcome to the QuizForge arena." },
    ],
  }),
  component: SpinPage,
});

function SpinPage() {
  const { hydrated, pending, awardLifeline } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && (!pending || pending.category !== "gaming")) {
      navigate({ to: "/category/$category", params: { category: "gaming" } });
    }
  }, [hydrated, pending, navigate]);

  const topic = getTopic("gaming", pending?.topic);
  const awarded = (pending?.lifeline as LifelineId | null) ?? null;
  const meta = LIFELINES.find((l) => l.id === awarded);

  return (
    <AppShell>
      <div className="relative mx-auto max-w-3xl text-center">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-neon/15 blur-3xl animate-drift" />
        <div className="relative animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon">Gaming Arena · {topic?.name ?? "Topic"}</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-gradient-arcade">Spin the Wheel</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Win a special lifeline to help you during the quiz. You only get one spin.
          </p>
        </div>

        <div className="relative mt-10 flex justify-center">
          <SpinWheel locked={Boolean(pending?.spun)} result={awarded} onResult={(l) => awardLifeline(l)} />
        </div>

        {awarded && meta && (
          <div className="mt-10 animate-pop rounded-2xl p-6 neon-frame glass">
            <div className="text-3xl" aria-hidden>
              🎉
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold">You Won!</h2>
            <p className="mt-3 inline-flex items-center gap-2 rounded-xl bg-arcade px-5 py-2.5 font-display text-lg font-bold text-neon-foreground">
              <span aria-hidden>{meta.emoji}</span> {meta.label.toUpperCase()}
            </p>
            <p className="mx-auto mt-4 max-w-sm text-sm text-muted-foreground">
              {meta.blurb} You can use this lifeline once during the quiz.
            </p>
            <button
              onClick={() => navigate({ to: "/rules/$category", params: { category: "gaming" } })}
              className="mt-6 inline-flex items-center rounded-xl bg-brand px-5 py-3 font-display text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Continue to Rules
            </button>
          </div>
        )}

        {!awarded && (
          <div className="mt-10 grid gap-3 sm:grid-cols-4">
            {LIFELINES.map((l) => (
              <div key={l.id} className="rounded-xl p-3 text-left glass">
                <div className="text-xl" aria-hidden>
                  {l.emoji}
                </div>
                <div className="mt-1 font-display text-sm font-bold">{l.label}</div>
                <p className="mt-1 text-xs text-muted-foreground">{l.blurb}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

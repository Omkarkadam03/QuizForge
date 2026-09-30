import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ErrorState } from "@/components/states";
import { getCategory, getTopic, QUIZ_LENGTH } from "@/lib/quiz-bank";
import { LIFELINES, type LifelineId } from "@/lib/quiz-engine";
import { useApp } from "@/lib/quiz-store";

export const Route = createFileRoute("/rules/$category")({
  head: () => ({
    meta: [
      { title: "Quiz Rules — QuizForge" },
      { name: "description", content: "Read the QuizForge quiz rules — 20 questions, a 30-minute timer, and arena lives for the Gaming category." },
      { property: "og:title", content: "Quiz Rules — QuizForge" },
      { property: "og:description", content: "Know the rules before you start: timing, scoring, lives and lifelines." },
    ],
  }),
  component: RulesPage,
});

const NORMAL_RULES = [
  `${QUIZ_LENGTH} questions per quiz`,
  "30-minute timer, starting the moment the quiz begins",
  "Select one answer per question",
  "You can change your answer before submission",
  "You may submit the quiz at any time",
  "If the timer reaches zero, the quiz submits automatically",
  "Your score and a full answer review appear after submission",
];

function RulesPage() {
  const { category: categoryId } = Route.useParams();
  const { hydrated, pending, startQuiz } = useApp();
  const navigate = useNavigate();
  const category = getCategory(categoryId);
  const topic = getTopic(categoryId, pending?.topic);
  const gaming = categoryId === "gaming";
  const awarded = (pending?.lifeline as LifelineId | null) ?? null;
  const lifelineMeta = LIFELINES.find((l) => l.id === awarded);
  const lives = awarded === "life" ? 4 : 3;

  useEffect(() => {
    if (!hydrated) return;
    if (!pending || pending.category !== categoryId) {
      navigate({ to: "/category/$category", params: { category: categoryId } });
    } else if (gaming && !pending.spun) {
      navigate({ to: "/gaming/spin" });
    }
  }, [hydrated, pending, categoryId, gaming, navigate]);

  if (!category) {
    return (
      <AppShell>
        <ErrorState message="We couldn't find that category. Head back home and pick another one." />
      </AppShell>
    );
  }

  const begin = () => {
    if (!pending) return;
    const ok = startQuiz(pending.category, pending.topic);
    if (!ok) return;
    navigate({ to: "/quiz/$category/$topic", params: { category: pending.category, topic: pending.topic } });
  };

  const gamingRules = [
    `You start with ${lives} ${lives === 4 ? "lives (3 + your bonus life)" : "lives"}`,
    "A wrong answer costs one life — answers are final in the arena",
    "Your quiz ends immediately when all lives are lost",
    "You receive one random lifeline from the Spin Wheel",
    "You can use that lifeline once, at any time during the quiz",
    `Maximum of ${QUIZ_LENGTH} questions and 30 minutes`,
    "You may submit the quiz at any time",
    "Skipping a question costs no life and is not counted as wrong",
  ];

  const rules = gaming ? gamingRules : NORMAL_RULES;

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <div className={`animate-fade-up rounded-3xl p-6 sm:p-8 glass ${gaming ? "neon-frame" : ""}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {category.name} · {topic?.name ?? "Topic"}
          </p>
          <h1 className={`mt-3 font-display text-3xl font-bold ${gaming ? "text-gradient-arcade" : ""}`}>
            {gaming ? "Gaming Quiz Rules" : "Quiz Rules"}
          </h1>

          {gaming && lifelineMeta && (
            <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-neon/40 bg-neon/10 px-4 py-3">
              <span className="text-2xl" aria-hidden>
                {lifelineMeta.emoji}
              </span>
              <div className="min-w-0">
                <p className="font-display text-sm font-bold text-neon">Your lifeline: {lifelineMeta.label}</p>
                <p className="text-xs text-muted-foreground">{lifelineMeta.blurb}</p>
              </div>
            </div>
          )}

          <ul className="mt-6 grid gap-3">
            {rules.map((rule) => (
              <li key={rule} className="flex items-start gap-3 text-sm leading-relaxed">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="text-muted-foreground">{rule}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={begin}
            className={`mt-8 w-full rounded-xl px-5 py-3.5 font-display text-base font-bold transition-transform hover:scale-[1.01] active:scale-[0.99] ${
              gaming ? "bg-arcade text-neon-foreground" : "bg-brand text-primary-foreground"
            }`}
          >
            {gaming ? "I Understand — Start Quiz" : "Start Quiz"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Timer as TimerIcon, Layers, ListChecks } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CategoryCard } from "@/components/CategoryCard";
import { CATEGORIES, QUIZ_LENGTH, totalTopics } from "@/lib/quiz-bank";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QuizForge — Challenge Your Mind, Level Up Your Knowledge" },
      {
        name: "description",
        content:
          "QuizForge combines traditional 20-question quizzes with a gamified arena mode featuring lives, a spin wheel and strategic lifelines.",
      },
      { property: "og:title", content: "QuizForge — Challenge Your Mind" },
      {
        property: "og:description",
        content: "6 categories, 18 topics, 20 questions per quiz and a gamified arena mode.",
      },
    ],
  }),
  component: HomePage,
});

const STATS = [
  { icon: Layers, value: "6", label: "Categories" },
  { icon: ListChecks, value: String(totalTopics()), label: "Topics" },
  { icon: Sparkles, value: String(QUIZ_LENGTH), label: "Questions / quiz" },
  { icon: TimerIcon, value: "30", label: "Minutes" },
];

function HomePage() {
  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-3xl px-6 py-12 glass sm:px-10 sm:py-16">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-neon/15 blur-3xl animate-drift" />
        <div aria-hidden className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-drift" />
        <div className="relative max-w-2xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-semibold text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> Ed-tech meets arcade
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] sm:text-5xl">
            Challenge Your Mind.
            <br />
            <span className="text-gradient">Level Up Your Knowledge.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            QuizForge blends focused, exam-style quizzes with a gamified Gaming arena where lives, a spin wheel and
            strategic lifelines change how you play. Pick a topic, beat the clock, review every answer.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 font-display text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Start Quiz <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#categories"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-3 font-display text-sm font-bold transition-colors hover:border-primary/60"
            >
              Explore Categories
            </a>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-4 sm:gap-4">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="rounded-2xl p-4 animate-fade-up glass sm:p-5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <stat.icon className="h-5 w-5 text-primary" aria-hidden />
            <div className="mt-3 font-display text-2xl font-bold tabular-nums sm:text-3xl">{stat.value}</div>
            <div className="text-xs text-muted-foreground sm:text-sm">{stat.label}</div>
          </div>
        ))}
      </section>

      <section id="categories" className="mt-12 scroll-mt-24">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-bold">Categories</h2>
            <p className="mt-1 text-sm text-muted-foreground">Six tracks, three topics each. Gaming plays by its own rules.</p>
          </div>
          <Link to="/categories" className="shrink-0 text-sm font-semibold text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category, i) => (
            <CategoryCard key={category.id} category={category} index={i} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}

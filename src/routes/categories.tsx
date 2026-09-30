import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CategoryCard } from "@/components/CategoryCard";
import { CATEGORIES } from "@/lib/quiz-bank";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Quiz Categories — QuizForge" },
      { name: "description", content: "Browse all six QuizForge categories: Gaming, Academic, Aptitude, AI Tools, General Knowledge and Coding." },
      { property: "og:title", content: "Quiz Categories — QuizForge" },
      { property: "og:description", content: "Six categories and eighteen topics of quizzes, including the gamified Gaming arena." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <AppShell>
      <header className="animate-fade-up">
        <h1 className="font-display text-3xl font-bold">Choose your category</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Every category holds three topics with a 20-question, 30-minute quiz. The Gaming category swaps the classic
          format for an arena run with lives and lifelines.
        </p>
      </header>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category, i) => (
          <CategoryCard key={category.id} category={category} index={i} />
        ))}
      </div>
    </AppShell>
  );
}

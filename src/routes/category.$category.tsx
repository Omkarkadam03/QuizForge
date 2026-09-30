import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { TopicCard } from "@/components/TopicCard";
import { ErrorState } from "@/components/states";
import { getCategory } from "@/lib/quiz-bank";
import { useApp } from "@/lib/quiz-store";

export const Route = createFileRoute("/category/$category")({
  head: () => ({
    meta: [
      { title: "Choose a Topic — QuizForge" },
      { name: "description", content: "Pick a topic inside your chosen QuizForge category and start a 20-question quiz." },
      { property: "og:title", content: "Choose a Topic — QuizForge" },
      { property: "og:description", content: "Three topics per category, each with a full 20-question quiz." },
    ],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { category: categoryId } = Route.useParams();
  const category = getCategory(categoryId);
  const { preparePending } = useApp();
  const navigate = useNavigate();

  if (!category) {
    return (
      <AppShell>
        <ErrorState message="That category doesn't exist. Try picking one from the categories page." />
      </AppShell>
    );
  }

  const handleStart = (topicId: string) => {
    preparePending(category.id, topicId);
    if (category.special) navigate({ to: "/gaming/spin" });
    else navigate({ to: "/rules/$category", params: { category: category.id } });
  };

  return (
    <AppShell>
      <Link
        to="/categories"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All categories
      </Link>

      <header className="mt-4 animate-fade-up">
        <div className="flex flex-wrap items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-3xl" aria-hidden>
            {category.emoji}
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-bold">{category.name}</h1>
            <p className="text-sm text-muted-foreground">{category.tagline}</p>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">{category.description}</p>
        {category.special && (
          <p className="mt-4 inline-flex rounded-xl border border-neon/40 bg-neon/10 px-4 py-2.5 text-sm text-neon">
            Ready to test your skills? Choose a topic, then spin to unlock your advantage.
          </p>
        )}
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {category.topics.map((topic, i) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            special={category.special}
            index={i}
            onStart={() => handleStart(topic.id)}
          />
        ))}
      </div>
    </AppShell>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/states";
import { HistoryCard } from "@/components/HistoryCard";
import { useApp } from "@/lib/quiz-store";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Quiz History — QuizForge" },
      { name: "description", content: "Review every QuizForge attempt with scores, percentages, correct, wrong and skipped counts." },
      { property: "og:title", content: "Quiz History — QuizForge" },
      { property: "og:description", content: "Track your progress across all quiz attempts." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { history, clearHistory } = useApp();
  const navigate = useNavigate();

  return (
    <AppShell>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 animate-fade-up">
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-bold">Quiz History</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {history.length ? `${history.length} attempt${history.length > 1 ? "s" : ""} saved on this device.` : "Your past attempts appear here."}
          </p>
        </div>
        {history.length > 0 && (
          <Button variant="ghost" className="shrink-0 text-destructive hover:text-destructive" onClick={clearHistory}>
            Clear
          </Button>
        )}
      </header>

      <div className="mt-8">
        {history.length === 0 ? (
          <EmptyState
            emoji="📊"
            title="No attempts yet"
            description="Finish your first quiz and your score, review and stats will be saved right here."
            action={
              <Button className="bg-brand font-semibold text-primary-foreground" onClick={() => navigate({ to: "/categories" })}>
                Start your first quiz
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {history.map((result) => (
              <HistoryCard key={result.id} result={result} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <Link to="/" className="text-sm font-semibold text-primary hover:underline">
          Back to Home
        </Link>
      </div>
    </AppShell>
  );
}

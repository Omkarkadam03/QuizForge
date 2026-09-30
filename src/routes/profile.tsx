import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/quiz-store";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/quiz-engine";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — QuizForge" },
      { name: "description", content: "See your QuizForge demo profile, lifetime quiz stats and best score." },
      { property: "og:title", content: "Your Profile — QuizForge" },
      { property: "og:description", content: "Your demo account, quiz stats and performance summary." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, history, signOut } = useApp();
  const navigate = useNavigate();

  const attempts = history.length;
  const best = attempts ? Math.max(...history.map((h) => h.percentage)) : 0;
  const avg = attempts ? Math.round(history.reduce((s, h) => s + h.percentage, 0) / attempts) : 0;
  const totalTime = history.reduce((s, h) => s + h.timeUsedSec, 0);

  const stats = [
    { label: "Quizzes taken", value: String(attempts) },
    { label: "Best score", value: `${best}%` },
    { label: "Average score", value: `${avg}%` },
    { label: "Time played", value: formatTime(totalTime) },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <div className="animate-fade-up rounded-3xl p-6 glass sm:p-8">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-brand font-display text-2xl font-bold text-primary-foreground">
              {(user?.name?.[0] ?? "P").toUpperCase()}
            </span>
            <div className="min-w-0">
              <h1 className="truncate font-display text-2xl font-bold">{user?.name}</h1>
              <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Demo account · joined {user ? new Date(user.joinedAt).toLocaleDateString() : "—"}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border/70 bg-card/50 p-4">
                <div className="font-display text-xl font-bold tabular-nums">{stat.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/history"
              className="inline-flex items-center rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary/80"
            >
              View quiz history
            </Link>
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => {
                signOut();
                navigate({ to: "/login" });
              }}
            >
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

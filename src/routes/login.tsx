import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { useApp } from "@/lib/quiz-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — QuizForge" },
      { name: "description", content: "Sign in to QuizForge and start forging your knowledge with quizzes and arena challenges." },
      { property: "og:title", content: "Sign In — QuizForge" },
      { property: "og:description", content: "Access the QuizForge quiz platform and gamified arena mode." },
    ],
  }),
  component: LoginPage,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function LoginPage() {
  const { hydrated, user, signIn } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated && user) navigate({ to: "/" });
  }, [hydrated, user, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) return setError("Enter a valid email address.");
    if (password.length < 4) return setError("Password must be at least 4 characters.");
    setError(null);
    signIn(email);
    toast.success("Welcome to QuizForge!");
    navigate({ to: "/" });
  };

  const createDemo = () => {
    signIn("demo@quizforge.app", "Demo Player");
    toast.success("Demo account ready — let's forge!");
    navigate({ to: "/" });
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-10">
      <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-drift" />
      <div aria-hidden className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-neon/15 blur-3xl animate-drift" />

      <div className="relative w-full max-w-md animate-fade-up">
        <div className="mb-8 text-center">
          <div className="flex justify-center">
            <Logo />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold leading-tight">
            Challenge Your Mind.
            <br />
            <span className="text-gradient">Level Up Your Knowledge.</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Sign in to access 6 categories, 18 topics and the gamified Arena mode.
          </p>
        </div>

        <form onSubmit={submit} className="rounded-2xl p-6 glass" noValidate>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p role="alert" className="rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" className="h-11 w-full bg-brand font-display text-base font-bold text-primary-foreground hover:opacity-90">
              Sign In
            </Button>
            <div className="relative py-1 text-center">
              <span className="relative z-10 bg-transparent px-3 text-xs uppercase tracking-wide text-muted-foreground">
                or
              </span>
            </div>
            <Button type="button" variant="secondary" className="h-11 w-full font-semibold" onClick={createDemo}>
              Create Demo Account
            </Button>
          </div>
        </form>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          Demo mode — credentials stay in your browser.{" "}
          <Link to="/" className="text-primary hover:underline">
            Learn more
          </Link>
        </p>
      </div>
    </div>
  );
}

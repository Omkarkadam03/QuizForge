import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link to="/" className={cn("group flex items-center gap-2.5", className)} aria-label="QuizForge home">
      <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand text-lg shadow-[0_8px_24px_-10px_var(--primary)] transition-transform group-hover:scale-105">
        <span aria-hidden>⚡</span>
      </span>
      {!compact && (
        <span className="font-display text-lg font-bold tracking-tight">
          <span className="text-foreground">QUIZ</span>
          <span className="text-gradient">FORGE</span>
        </span>
      )}
    </Link>
  );
}

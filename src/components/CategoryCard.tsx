import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import type { CategoryMeta } from "@/lib/quiz-bank";
import { cn } from "@/lib/utils";

export function CategoryCard({ category, index = 0 }: { category: CategoryMeta; index?: number }) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl p-5 animate-fade-up glass glass-hover sm:p-6",
        category.special && "neon-frame",
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {category.special && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-neon/25 blur-3xl animate-drift"
        />
      )}
      <div className="grid grid-cols-[auto_1fr] items-start gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-secondary text-2xl" aria-hidden>
          {category.emoji}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-display text-lg font-bold">{category.name}</h3>
            {category.special && (
              <span className="inline-flex items-center gap-1 rounded-full bg-neon/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-neon">
                <Sparkles className="h-3 w-3" /> Arena mode
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">{category.tagline}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{category.description}</p>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/70 pt-4">
        <span className="text-xs font-medium text-muted-foreground">{category.topics.length} topics</span>
        <Link
          to="/category/$category"
          params={{ category: category.id }}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-transform hover:scale-[1.03]",
            category.special
              ? "bg-arcade text-neon-foreground"
              : "bg-secondary text-foreground hover:bg-secondary/80",
          )}
        >
          Explore <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function EmptyState({
  emoji = "🗂️",
  title,
  description,
  action,
}: {
  emoji?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid place-items-center rounded-2xl px-6 py-16 text-center glass">
      <div className="text-4xl" aria-hidden>
        {emoji}
      </div>
      <h2 className="mt-4 font-display text-xl font-bold">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="grid place-items-center py-20 text-muted-foreground">
      <span className="h-9 w-9 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      <p className="mt-3 text-sm">{label}</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <EmptyState
      emoji="⚠️"
      title="Something isn't right"
      description={message}
      action={
        <Link
          to="/"
          className="inline-flex items-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Back to Home
        </Link>
      }
    />
  );
}

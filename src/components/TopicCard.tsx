import { Play } from "lucide-react";
import type { TopicMeta } from "@/lib/quiz-bank";
import { cn } from "@/lib/utils";

export function TopicCard({
  topic,
  special,
  index = 0,
  onStart,
}: {
  topic: TopicMeta;
  special: boolean;
  index?: number;
  onStart: () => void;
}) {
  return (
    <article
      className={cn(
        "group flex flex-col rounded-2xl p-5 animate-fade-up glass glass-hover",
        special && "neon-frame",
      )}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-2xl" aria-hidden>
        {topic.icon}
      </span>
      <h3 className="mt-4 font-display text-lg font-bold">{topic.name}</h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">{topic.description}</p>
      <button
        onClick={onStart}
        className={cn(
          "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.99]",
          special ? "bg-arcade text-neon-foreground" : "bg-brand text-primary-foreground",
        )}
      >
        <Play className="h-4 w-4" />
        {special ? "Enter Arena" : "Start Quiz"}
      </button>
    </article>
  );
}

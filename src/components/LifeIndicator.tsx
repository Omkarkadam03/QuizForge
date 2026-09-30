import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function LifeIndicator({ lives, initialLives }: { lives: number; initialLives: number }) {
  return (
    <div className="flex items-center gap-1.5" role="status" aria-label={`${lives} of ${initialLives} lives remaining`}>
      {Array.from({ length: initialLives }).map((_, i) => {
        const alive = i < lives;
        return (
          <Heart
            key={i}
            aria-hidden
            className={cn(
              "h-5 w-5 transition-all duration-500",
              alive
                ? "fill-destructive text-destructive drop-shadow-[0_0_8px_var(--destructive)]"
                : "animate-shake fill-muted text-muted-foreground opacity-45",
            )}
          />
        );
      })}
      <span className="ml-1 text-xs font-semibold text-muted-foreground">
        {lives}/{initialLives}
      </span>
    </div>
  );
}

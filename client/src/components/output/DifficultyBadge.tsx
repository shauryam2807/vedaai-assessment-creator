import { cn, getDifficultyColor } from "@/lib/utils";

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colorClass = getDifficultyColor(difficulty);
  
  return (
    <span className={cn("badge", colorClass)}>
      {difficulty}
    </span>
  );
}

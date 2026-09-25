interface FeaturedBadgeProps {
  className?: string;
}

export function FeaturedBadge({ className = "" }: FeaturedBadgeProps) {
  return (
    <span
      className={`rounded-sm bg-orange-600 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-white dark:bg-orange-500 ${className}`}
    >
      Destacado
    </span>
  );
}

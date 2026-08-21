import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-zinc-800/60 hardware-accelerated",
        className
      )}
      {...props}
    />
  );
}

export function TenderCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 space-y-4 hardware-accelerated">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-28 rounded-md" />
          <Skeleton className="h-6 w-32 rounded-md" />
        </div>
        <Skeleton className="h-6 w-20 rounded-md" />
      </div>
      <Skeleton className="h-6 w-3/4 rounded-lg" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="h-4 w-36 rounded-md" />
      </div>
    </div>
  );
}

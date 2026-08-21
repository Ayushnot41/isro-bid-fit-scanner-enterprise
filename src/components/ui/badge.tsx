import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-zinc-700 text-zinc-300": variant === "default",
          "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20":
            variant === "success",
          "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20":
            variant === "warning",
          "bg-red-500/15 text-red-400 border border-red-500/20":
            variant === "danger",
          "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20":
            variant === "info",
        },
        className
      )}
      {...props}
    />
  );
}

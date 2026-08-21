"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
}

export function Progress({
  value,
  max = 100,
  className,
  barClassName,
}: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const getColor = () => {
    if (percentage >= 75) return "bg-emerald-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div
      className={cn("w-full h-2 bg-zinc-800 rounded-full overflow-hidden", className)}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className={cn("h-full rounded-full", getColor(), barClassName)}
      />
    </div>
  );
}

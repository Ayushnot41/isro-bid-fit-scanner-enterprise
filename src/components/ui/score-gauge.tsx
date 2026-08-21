"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showPercentage?: boolean;
}

export function ScoreGauge({
  score,
  size = 100,
  strokeWidth = 6,
  className,
  showPercentage = false,
}: ScoreGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const getColor = () => {
    if (clampedScore >= 75) return { stroke: "#10b981", text: "text-emerald-400" };
    if (clampedScore >= 50) return { stroke: "#f59e0b", text: "text-amber-400" };
    return { stroke: "#ef4444", text: "text-red-400" };
  };

  const colors = getColor();
  const isCompact = size < 80;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center flex-shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#27272a"
          strokeWidth={strokeWidth}
        />
        {/* Active Animated Arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>

      {/* Centered Score */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span
          className={cn(
            "font-extrabold font-mono tracking-tight leading-none",
            colors.text,
            isCompact ? "text-xs" : size >= 110 ? "text-2xl" : "text-base"
          )}
        >
          {clampedScore}{isCompact || showPercentage ? "%" : ""}
        </span>
        {!isCompact && (
          <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono mt-0.5">
            MATCH
          </span>
        )}
      </div>
    </div>
  );
}

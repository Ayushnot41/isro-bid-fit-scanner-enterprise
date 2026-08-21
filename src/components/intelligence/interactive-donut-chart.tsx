"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
  bgClass?: string;
  subtext?: string;
}

interface InteractiveDonutChartProps {
  title: string;
  segments: DonutSegment[];
  centerLabel: string;
  centerSublabel: string;
  valuePrefix?: string;
  valueSuffix?: string;
}

export function InteractiveDonutChart({
  title,
  segments,
  centerLabel,
  centerSublabel,
  valuePrefix = "",
  valueSuffix = "",
}: InteractiveDonutChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = segments.reduce((sum, s) => sum + s.value, 0);

  // SVG parameters
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute stroke dash offsets
  let accumulatedPercent = 0;
  const renderedSegments = segments.map((segment, idx) => {
    const percent = total > 0 ? segment.value / total : 0;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += percent;

    return {
      ...segment,
      percent: Math.round(percent * 1000) / 10,
      strokeDasharray,
      strokeDashoffset,
      idx,
    };
  });

  const activeSegment = hoveredIdx !== null ? renderedSegments[hoveredIdx] : null;

  return (
    <div className="p-5 rounded-2xl bg-[#13161a] border border-[#222730] shadow-md flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
          {title}
        </h4>
        <span className="text-[10px] font-mono text-zinc-500">Interactive</span>
      </div>

      {/* SVG Donut Container */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
        <div className="relative flex items-center justify-center shrink-0">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#0a0b0e"
              strokeWidth={strokeWidth}
            />

            {/* Render Segments */}
            {renderedSegments.map((s) => {
              const isHovered = hoveredIdx === s.idx;
              return (
                <circle
                  key={s.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={s.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={s.strokeDasharray}
                  strokeDashoffset={s.strokeDashoffset}
                  strokeLinecap="butt"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(s.idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 8px ${s.color}80)` : undefined,
                  }}
                />
              );
            })}
          </svg>

          {/* Center Label HUD */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
            <AnimatePresence mode="wait">
              {activeSegment ? (
                <motion.div
                  key={`hover-${activeSegment.idx}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                >
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block truncate max-w-[100px]">
                    {activeSegment.label}
                  </span>
                  <span className="text-base sm:text-lg font-bold font-mono text-white block mt-0.5" style={{ color: activeSegment.color }}>
                    {valuePrefix}{activeSegment.value.toLocaleString()}{valueSuffix}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 block">
                    {activeSegment.percent}%
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                >
                  <span className="text-sm sm:text-base font-bold font-mono text-white block">
                    {centerLabel}
                  </span>
                  <span className="text-[9px] font-mono uppercase text-zinc-500 block tracking-wider mt-0.5">
                    {centerSublabel}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Legend beside/below */}
        <div className="space-y-2 flex-1 w-full">
          {renderedSegments.map((s) => {
            const isHovered = hoveredIdx === s.idx;
            return (
              <div
                key={s.label}
                onMouseEnter={() => setHoveredIdx(s.idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-between text-xs border ${
                  isHovered
                    ? "bg-[#161c22] border-emerald-500/40 shadow-sm"
                    : "bg-[#0a0b0e] border-[#222730] hover:border-[#333b49]"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-zinc-300 truncate font-sans text-xs">
                    {s.label}
                  </span>
                </div>
                <div className="text-right shrink-0 font-mono text-xs pl-2">
                  <span className="text-white font-bold">
                    {valuePrefix}{s.value.toLocaleString()}{valueSuffix}
                  </span>
                  <span className="text-zinc-500 text-[10px] ml-1.5">
                    ({s.percent}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

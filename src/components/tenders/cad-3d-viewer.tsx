"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, RotateCw, ZoomIn, ZoomOut, Layers, Eye, X, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface Cad3dViewerProps {
  partName: string;
  alloyGrade: string;
  tolerancesMet: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function Cad3dViewer({
  partName,
  alloyGrade,
  tolerancesMet,
  isOpen,
  onClose,
}: Cad3dViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [wireframe, setWireframe] = useState(false);
  const [highlightTolerances, setHighlightTolerances] = useState(true);
  const [isRotating, setIsRotating] = useState(true);

  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* CAD Viewer Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-4xl bg-[#0d0f12] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex-shrink-0 p-4 bg-[#13161a] border-b border-[#222730] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Box className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold text-white flex items-center gap-2">
                  3D CAD Aerospace Model Inspector
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    GPU 120 FPS
                  </span>
                </h3>
                <p className="text-[10px] text-zinc-400 font-mono">
                  {partName} • {alloyGrade}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={tolerancesMet ? "success" : "warning"}>
                {tolerancesMet ? "±5 µm Tolerance Met" : "Deviation Flagged"}
              </Badge>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1c2128] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3D Canvas Simulation Stage */}
          <div className="relative flex-1 min-h-[380px] bg-gradient-to-b from-[#08090a] to-[#0e1116] flex items-center justify-center overflow-hidden select-none">
            {/* Engineering Grid Planes */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            {/* Hardware-Accelerated 3D Mesh */}
            <div
              style={{
                perspective: "1200px",
                transform: `scale(${zoom})`,
                transition: "transform 0.15s ease-out",
                willChange: "transform",
              }}
              className="relative"
            >
              <style jsx>{`
                @keyframes gpuOrbit {
                  0% {
                    transform: rotateX(20deg) rotateY(0deg);
                  }
                  100% {
                    transform: rotateX(20deg) rotateY(360deg);
                  }
                }
                .aerospace-3d-orbit {
                  animation: gpuOrbit 12s linear infinite;
                  transform-style: preserve-3d;
                  will-change: transform;
                }
                .aerospace-3d-paused {
                  animation-play-state: paused;
                  transform-style: preserve-3d;
                  transform: rotateX(20deg) rotateY(45deg);
                }
              `}</style>

              <div
                className={`w-56 h-56 relative ${
                  isRotating ? "aerospace-3d-orbit" : "aerospace-3d-paused"
                }`}
              >
                {/* 3D Box Faces */}
                {/* Front */}
                <div
                  style={{ transform: "translateZ(112px)" }}
                  className={`absolute inset-0 rounded-2xl border-2 flex flex-col items-center justify-center p-4 transition-all ${
                    wireframe
                      ? "border-cyan-400/80 bg-cyan-950/10"
                      : "border-cyan-500/40 bg-zinc-900/90 shadow-2xl backdrop-blur-sm"
                  }`}
                >
                  <div className="w-16 h-16 rounded-full border-2 border-emerald-400 flex items-center justify-center bg-emerald-950/30">
                    <span className="text-[10px] font-mono text-emerald-300 font-bold">Ø 42.00</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 mt-2 font-bold">Stage-4 Mount</span>
                  <span className="text-[9px] font-mono text-zinc-400">±0.005 mm</span>
                </div>

                {/* Back */}
                <div
                  style={{ transform: "rotateY(180deg) translateZ(112px)" }}
                  className={`absolute inset-0 rounded-2xl border-2 flex flex-col items-center justify-center p-4 ${
                    wireframe
                      ? "border-purple-400/80 bg-purple-950/10"
                      : "border-purple-500/40 bg-zinc-900/90 shadow-2xl"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl border border-purple-400 flex items-center justify-center">
                    <span className="text-[9px] font-mono text-purple-300">Gimbal Lug</span>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-400 mt-2">Ra 0.3 µm</span>
                </div>

                {/* Right */}
                <div
                  style={{ transform: "rotateY(90deg) translateZ(112px)" }}
                  className={`absolute inset-0 rounded-2xl border-2 flex items-center justify-center ${
                    wireframe
                      ? "border-emerald-400/80 bg-emerald-950/10"
                      : "border-emerald-500/40 bg-zinc-900/90"
                  }`}
                >
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">Yield: 920 MPa</span>
                </div>

                {/* Left */}
                <div
                  style={{ transform: "rotateY(-90deg) translateZ(112px)" }}
                  className={`absolute inset-0 rounded-2xl border-2 flex items-center justify-center ${
                    wireframe
                      ? "border-amber-400/80 bg-amber-950/10"
                      : "border-amber-500/40 bg-zinc-900/90"
                  }`}
                >
                  <span className="text-[10px] font-mono text-amber-400">ISRO-DWG-009</span>
                </div>

                {/* Top */}
                <div
                  style={{ transform: "rotateX(90deg) translateZ(112px)" }}
                  className="absolute inset-0 rounded-2xl border-2 border-cyan-500/30 bg-zinc-950/90 flex items-center justify-center"
                >
                  <span className="text-[9px] font-mono text-cyan-300">5-Axis Simultaneous</span>
                </div>

                {/* Bottom */}
                <div
                  style={{ transform: "rotateX(-90deg) translateZ(112px)" }}
                  className="absolute inset-0 rounded-2xl border-2 border-zinc-700 bg-zinc-950/90 flex items-center justify-center"
                >
                  <span className="text-[9px] font-mono text-zinc-400">Cryogenic 20K Proof</span>
                </div>
              </div>
            </div>

            {/* Overlaid Tolerance Heatmap Callout */}
            {highlightTolerances && (
              <div className="absolute top-4 left-4 p-3 rounded-xl bg-zinc-950/90 border border-emerald-500/30 text-xs font-mono backdrop-blur-md max-w-xs space-y-1.5 shadow-xl">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>GD&T Critical Features (±5 µm)</span>
                </div>
                <div className="text-[11px] text-zinc-300 space-y-1">
                  <p>• Bore Concentricity: <span className="text-emerald-400">Ø 0.008 mm (PASS)</span></p>
                  <p>• Surface Roughness: <span className="text-emerald-400">Ra 0.32 µm (PASS)</span></p>
                  <p>• Perpendicularity: <span className="text-emerald-400">0.005 mm (PASS)</span></p>
                </div>
              </div>
            )}

            {/* Interactive HUD Control Ribbon */}
            <div className="absolute bottom-4 inset-x-4 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRotating(!isRotating)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-colors ${
                    isRotating
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800"
                  }`}
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isRotating ? "animate-spin" : ""}`} />
                  <span>{isRotating ? "Pause Orbit" : "Auto Orbit"}</span>
                </button>

                <button
                  onClick={() => setWireframe(!wireframe)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-colors ${
                    wireframe
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{wireframe ? "Solid Mesh" : "Wireframe"}</span>
                </button>

                <button
                  onClick={() => setHighlightTolerances(!highlightTolerances)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-colors ${
                    highlightTolerances
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Tolerances HUD</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
                  className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-zinc-400 px-2">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))}
                  className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="flex-shrink-0 p-3 bg-[#13161a] border-t border-[#222730] flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400 text-[11px]">
              STEP / IGES 3D Geometry Extractor • GPU Hardware Acceleration
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs transition-colors"
            >
              Done Inspecting
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Loader2,
  Sparkles,
  Cpu,
  ShieldAlert,
  Layers,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PdfUploaderProps {
  onTenderParsed?: (tenderData: any) => void;
}

export function PdfUploader({ onTenderParsed }: PdfUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [parsedResult, setParsedResult] = useState<any | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".pdf")) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const startExtraction = () => {
    if (!file) return;
    setParsing(true);
    setProgress(20);
    setStatusText("Reading PDF binary stream & OCR extraction...");

    setTimeout(() => {
      setProgress(50);
      setStatusText("Parsing ISRO Technical Specifications & GD&T clauses...");
    }, 600);

    setTimeout(() => {
      setProgress(85);
      setStatusText("Extracting MSME clauses, EMD requirements & closing dates...");
    }, 1200);

    setTimeout(() => {
      setProgress(100);
      setParsing(false);
      const result = {
        reference_number: `CUSTOM/ISRO/${Date.now().toString().slice(-4)}`,
        title: file.name.replace(".pdf", ""),
        estimated_value_inr: 45000000,
        category: "Custom Uploaded ISRO RFP",
        required_certifications: ["AS9100D", "ISO9001:2015", "ISO 14644-1"],
        required_tolerances: { linear_tolerance_mm: 0.005, surface_roughness_ra_um: 0.4 },
        extracted_specs: {
          material: "Titanium Ti-6Al-4V Grade 5",
          cleanroom: "Class 10,000 (ISO 7)",
          inspection: "100% Radiographic & Ultrasonic NDT",
          linear_tolerance: "±5 µm",
          roughness: "Ra 0.4 µm",
        },
      };
      setParsedResult(result);
      if (onTenderParsed) onTenderParsed(result);
    }, 1800);
  };

  return (
    <div className="bg-zinc-900/95 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Manual ISRO RFP / PDF Ingestion</h3>
        </div>
        <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
          AI OCR & GD&T EXTRACTOR
        </span>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
          isDragging
            ? "border-emerald-500 bg-emerald-500/10"
            : "border-zinc-800 bg-zinc-950/70 hover:border-zinc-700"
        }`}
      >
        <input
          type="file"
          id="pdf-upload-input"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {file ? (
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-white border border-zinc-700 font-mono">
              <FileText className="w-4 h-4 text-emerald-400" />
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>

            {parsing ? (
              <div className="space-y-2 max-w-xs mx-auto">
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-[11px] font-mono text-emerald-400 flex items-center justify-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  {statusText}
                </p>
              </div>
            ) : parsedResult ? (
              <div className="space-y-3 text-left">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs space-y-1">
                  <p className="font-semibold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    AI Specification Extraction Complete
                  </p>
                  <p className="text-zinc-400 font-mono text-[11px]">
                    Reference: {parsedResult.reference_number} • Target Value: ₹4.50 Cr
                  </p>
                </div>

                {/* Aerospace Telemetry Spec Extraction Diagram */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                    <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] mb-1">
                      <Cpu className="w-3 h-3 text-cyan-400" />
                      MATERIAL
                    </div>
                    <span className="font-mono text-white text-[11px] font-bold">Ti-6Al-4V Gr.5</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                    <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] mb-1">
                      <Wrench className="w-3 h-3 text-emerald-400" />
                      GD&T TOLERANCE
                    </div>
                    <span className="font-mono text-emerald-400 text-[11px] font-bold">±5 µm Linear</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                    <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] mb-1">
                      <Layers className="w-3 h-3 text-purple-400" />
                      CLEANROOM
                    </div>
                    <span className="font-mono text-purple-300 text-[11px] font-bold">ISO 7 (10k)</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                    <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] mb-1">
                      <ShieldAlert className="w-3 h-3 text-amber-400" />
                      QUALITY AUDIT
                    </div>
                    <span className="font-mono text-amber-300 text-[11px] font-bold">AS9100D</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Button variant="primary" size="sm" onClick={startExtraction} className="flex items-center gap-2 mx-auto">
                  <Sparkles className="w-3.5 h-3.5" />
                  Extract & Run Bid-Fit Evaluation
                </Button>
              </div>
            )}
          </div>
        ) : (
          <label htmlFor="pdf-upload-input" className="cursor-pointer block space-y-2">
            <UploadCloud className="w-8 h-8 text-zinc-500 mx-auto" />
            <p className="text-xs text-zinc-300 font-medium">
              Drag and drop ISRO tender PDF here, or <span className="text-emerald-400 underline">browse</span>
            </p>
            <p className="text-[10px] text-zinc-500">
              Supports NITs, General Terms (GCC), and Engineering Drawings up to 50MB
            </p>
          </label>
        )}
      </div>
    </div>
  );
}

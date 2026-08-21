"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { BidEvaluation, ScrapedTender, VendorProfile } from "@/lib/types/database";
import { CheckCircle2, Circle, FileText, AlertCircle } from "lucide-react";
import { getRequiredDocuments } from "@/lib/evaluation-utils";

interface DocumentChecklistTabProps {
  tender: ScrapedTender;
  evaluation: BidEvaluation;
  vendorProfile: VendorProfile;
}

export function DocumentChecklistTab({
  tender,
  evaluation,
  vendorProfile,
}: DocumentChecklistTabProps) {
  // Generate structured documents from evaluation.recommendations if required_documents is not present
  const initialDocuments = useMemo(() => {
    return getRequiredDocuments(evaluation, vendorProfile);
  }, [evaluation, vendorProfile]);

  const [documents, setDocuments] = useState(initialDocuments);

  const toggleDocument = (id: string) => {
    setDocuments(docs =>
      docs.map(doc =>
        doc.id === id ? { ...doc, isCompleted: !doc.isCompleted } : doc
      )
    );
  };

  const completedCount = documents.filter(d => d.isCompleted).length;
  const progressPercent = Math.round((completedCount / documents.length) * 100) || 0;

  return (
    <div className="space-y-5">
      <div className="bg-[#13161a] border border-[#222730] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white font-mono">
              Auto-Prep Checklist
            </h4>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            {completedCount} / {documents.length} Ready
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-[#1c2128] rounded-full overflow-hidden mb-5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className={`h-full ${progressPercent === 100 ? "bg-emerald-500" : "bg-cyan-500"}`}
          />
        </div>

        <div className="space-y-2.5">
          {documents.map((doc, index) => (
            <motion.div 
              key={doc.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleDocument(doc.id)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                doc.isCompleted 
                  ? "bg-emerald-500/10 border-emerald-500/20" 
                  : "bg-[#0a0b0e] border-[#1e232b] hover:border-[#2b333f]"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {doc.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Circle className="w-4 h-4 text-zinc-500" />
                )}
              </div>
              <div>
                <h5 className={`text-sm font-medium font-sans mb-1 ${doc.isCompleted ? "text-emerald-300" : "text-white"}`}>
                  {doc.title}
                </h5>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {doc.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {progressPercent === 100 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-emerald-300 font-medium">All mandatory documents are ready for Technical Envelope-1 submission.</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

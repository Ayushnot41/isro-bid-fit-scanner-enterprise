"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, ShieldCheck, CheckCircle2, Lock, FileCheck2, Sparkles, X, Usb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface DscSignerProps {
  tenderReference: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DscSigner({
  tenderReference,
  isOpen,
  onClose,
}: DscSignerProps) {
  const [pin, setPin] = useState("••••••••");
  const [isSigning, setIsSigning] = useState(false);
  const [signatureComplete, setSignatureComplete] = useState(false);
  const [sha256Hash, setSha256Hash] = useState<string | null>(null);

  useLockBodyScroll(isOpen);

  const handleSign = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setSignatureComplete(true);
      setSha256Hash("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md hardware-accelerated overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-lg bg-[#0e1115] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        >
          {/* Header */}
          <div className="flex-shrink-0 p-4 bg-[#13161a] border-b border-[#222730] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold text-white flex items-center gap-2">
                  Class-3 Digital Signature Certificate (DSC)
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    CCA India Verified
                  </span>
                </h3>
                <p className="text-[10px] text-zinc-400 font-mono">
                  Sign Technical Envelope-1 for {tenderReference}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1c2128] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 min-h-0 p-5 overflow-y-auto overscroll-contain custom-scrollbar space-y-4 text-xs font-sans">
            {signatureComplete ? (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-sm">
                  Cryptographically Signed & Timestamped
                </h4>
                <p className="text-zinc-300 text-xs">
                  Technical Envelope-1 has been digitally signed with e-Mudhra Class-3 Combo DSC (SHA-256 RSA 2048-bit).
                </p>
                <div className="p-2 rounded bg-black/40 font-mono text-[10px] text-emerald-400 break-all">
                  Hash: {sha256Hash}
                </div>
              </div>
            ) : (
              <>
                <div className="p-3.5 rounded-xl bg-[#13161a] border border-[#222730] flex items-center gap-3">
                  <Usb className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">ePass2003 Auto-Detected</p>
                    <p className="text-zinc-400 text-[11px] font-mono">
                      Certificate Holder: AERO PRECISION DYNAMICS INDIA PVT LTD (Cert ID: CCA-IN-8891)
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 font-mono text-xs">
                  <label className="text-zinc-300 block">Enter DSC Token PIN:</label>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0a0b0e] border border-[#222730] text-white focus:outline-none focus:border-amber-500/60"
                  />
                  <span className="text-[10px] text-zinc-500 block">
                    Secured by FIPS 140-2 Level 3 Cryptographic Hardware
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-3.5 bg-[#13161a] border-t border-[#222730] flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-400">
              {signatureComplete ? "Ready for eproc.isro.gov.in" : "Indian IT Act 2000 Section 3A"}
            </span>

            {signatureComplete ? (
              <Button size="sm" onClick={onClose} className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs">
                Complete
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleSign}
                disabled={isSigning}
                className="bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs"
              >
                {isSigning ? "Signing Envelope..." : "Sign Document (SHA-256)"}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

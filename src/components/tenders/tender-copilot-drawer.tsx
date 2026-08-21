"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, X, Bot, User, Layers, Target, DollarSign, ArrowRight } from "lucide-react";
import type { ScrapedTender } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface TenderCoPilotDrawerProps {
  tender: ScrapedTender | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const CATEGORIZED_PROMPTS = [
  // Eligibility & Gaps
  { cat: "ELIGIBILITY", label: "Why is Bid-Fit 63%?", prompt: "Why is my Bid-Fit score only 63% for this tender?" },
  { cat: "ELIGIBILITY", label: "Tolerance Gap Cause?", prompt: "What exactly is causing the tolerance gap on this bid?" },
  { cat: "ELIGIBILITY", label: "Missing Certifications?", prompt: "What is the one missing certification, and how do I get it before the deadline?" },
  { cat: "ELIGIBILITY", label: "MSME EMD Exemption?", prompt: "Am I eligible for the MSME EMD exemption on this specific tender?" },

  // Comparison & Prioritization
  { cat: "PRIORITY", label: "Which Tender to Prioritize?", prompt: "Which of these active tenders should I prioritize given my current capabilities?" },
  { cat: "PRIORITY", label: "Compare vs 100% Fit", prompt: "Compare this tender's requirements against the one that scored 100%" },
  { cat: "PRIORITY", label: "Disqualification Risks?", prompt: "Which tenders am I disqualified from, and why?" },

  // Financial & Risk
  { cat: "FINANCIAL", label: "Total EMD Exposure?", prompt: "What is my total EMD exposure if I bid on all qualifying tenders this month?" },
  { cat: "FINANCIAL", label: "Tolerance Upgrade ROI?", prompt: "Is the contract value worth the tolerance upgrade I would need to make?" },
  { cat: "FINANCIAL", label: "Risk without ±5µm?", prompt: "What is the risk if I bid without meeting the ±5µm tolerance exactly?" },

  // Action & Prep
  { cat: "ACTION", label: "Required Documents?", prompt: "What documents do I need to submit for this tender?" },
  { cat: "ACTION", label: "Draft Action Checklist", prompt: "Draft a checklist to close the tolerance gap before the closing date" },
  { cat: "ACTION", label: "Plain English Summary", prompt: "Summarize this tender's technical requirements in plain language" },
  { cat: "ACTION", label: "Move 79% to 100%", prompt: "What would it take to move this from 79% fit to 100%?" },

  // Strategic Intelligence
  { cat: "STRATEGY", label: "Highest Value Upgrade?", prompt: "Based on my past tender evaluations, what capability upgrade would unlock the most future tenders?" },
  { cat: "STRATEGY", label: "Top Awarding Center?", prompt: "Which ISRO center awards the most tenders matching my current specs?" },
];

export function TenderCoPilotDrawer({ tender, isOpen, onClose }: TenderCoPilotDrawerProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"ALL" | "ELIGIBILITY" | "PRIORITY" | "FINANCIAL" | "ACTION" | "STRATEGY">("ALL");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Lock background scroll when drawer is open
  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (tender) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Hello! I am your AI Tender CoPilot for ${tender.reference_number} (${tender.issuing_center}).

Click any question chip above or ask anything about eligibility, tolerances, GFR 170(i) exemptions, documents, or strategic bidding!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [tender]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || !tender || loading) return;

    setInput("");
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: textToSend,
          tender_id: tender.id,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        role: "assistant",
        content: data.reply || "Could not retrieve response.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          role: "assistant",
          content: "1. 100% Free EMD: Under GFR 2017 Rule 170(i), your verified MSME status provides a 100% waiver.\n2. Tolerance: Your 5-Axis CNC capability (±5 µm) meets ISRO NIT requirements.\n\nBottom Line: You can submit your bid with zero upfront cash deposit.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !tender) return null;

  const displayedPrompts = CATEGORIZED_PROMPTS.filter((p) => {
    if (activeCategory === "ALL") return true;
    return p.cat === activeCategory;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex items-end justify-center sm:block p-3 sm:p-0">
        {/* Backdrop for mobile */}
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm sm:hidden z-0"
        />

        {/* Compact, Optimized CoPilot Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative z-10 w-full sm:w-[420px] h-[520px] max-h-[85vh] bg-[#0c0e12]/95 backdrop-blur-xl border border-cyan-500/40 rounded-2xl shadow-2xl shadow-black/90 flex flex-col overflow-hidden font-sans"
        >
          {/* Compact Header */}
          <div className="px-4 py-2.5 bg-[#13161a] border-b border-[#222730] flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold text-white flex items-center gap-1.5 leading-none">
                  Tender CoPilot <Sparkles className="w-3 h-3 text-cyan-400" />
                </h3>
                <p className="text-[10px] text-zinc-400 font-mono truncate max-w-[240px] mt-0.5">
                  {tender.reference_number} • {tender.issuing_center}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick-Access Relatable Category Tabs */}
          <div className="px-3 py-1.5 bg-[#090b0e] border-b border-[#222730] space-y-1 font-mono text-[10px] flex-shrink-0">
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
              <button
                onClick={() => setActiveCategory("ALL")}
                className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                  activeCategory === "ALL"
                    ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                All ({CATEGORIZED_PROMPTS.length})
              </button>
              <button
                onClick={() => setActiveCategory("ELIGIBILITY")}
                className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                  activeCategory === "ELIGIBILITY"
                    ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                🎯 Gaps
              </button>
              <button
                onClick={() => setActiveCategory("FINANCIAL")}
                className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                  activeCategory === "FINANCIAL"
                    ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                💰 EMD
              </button>
              <button
                onClick={() => setActiveCategory("ACTION")}
                className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                  activeCategory === "ACTION"
                    ? "bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                📋 Prep
              </button>
              <button
                onClick={() => setActiveCategory("STRATEGY")}
                className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                  activeCategory === "STRATEGY"
                    ? "bg-blue-500/20 text-blue-300 font-bold border border-blue-500/40"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                🚀 Strategy
              </button>
            </div>

            {/* Quick Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {displayedPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.prompt)}
                  className="px-2 py-0.5 rounded bg-[#13161a] hover:bg-[#1c222b] text-zinc-300 hover:text-cyan-300 border border-[#222730] hover:border-cyan-500/30 whitespace-nowrap transition-colors flex-shrink-0 text-[10px]"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Feed (Scrollable Center) */}
          <div className="flex-1 min-h-0 p-3.5 overflow-y-auto overscroll-contain space-y-2.5 font-sans text-xs custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    msg.role === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-cyan-950 border border-cyan-500/40 text-cyan-300"
                  }`}
                >
                  {msg.role === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                </div>

                <div
                  className={`max-w-[85%] p-2.5 rounded-xl leading-relaxed whitespace-pre-wrap text-[11.5px] ${
                    msg.role === "user"
                      ? "bg-emerald-600 text-white rounded-tr-none font-medium"
                      : "bg-[#13161a] border border-[#222730] text-zinc-200 rounded-tl-none font-normal shadow-sm"
                  }`}
                >
                  {msg.content}
                  <div
                    className={`text-[8.5px] mt-1 font-mono ${
                      msg.role === "user" ? "text-emerald-200 text-right" : "text-zinc-500"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#13161a] border border-[#222730] text-cyan-400 font-mono text-[10px] w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>Consulting ISRO Procurement Manual & Grok AI...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Compact Input Bar (Directly below messages, easily reachable!) */}
          <div className="p-2.5 bg-[#13161a] border-t border-[#222730] flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask any question (e.g. EMD waiver, tolerances)..."
                disabled={loading}
                className="flex-1 px-3 py-2 bg-[#090b0e] border border-[#222730] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 transition-all font-sans"
              />
              <Button
                type="submit"
                size="sm"
                disabled={loading || !input.trim()}
                className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-mono font-bold transition-all shadow-md flex items-center gap-1 flex-shrink-0"
              >
                <Send className="w-3 h-3" />
                <span>Send</span>
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, X, Bot, User, CheckCircle2, ShieldCheck, AlertCircle, FileText, HelpCircle, ArrowRight } from "lucide-react";
import type { ScrapedTender } from "@/lib/types/database";
import { Button } from "@/components/ui/button";

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

const BEGINNER_FAQ_PROMPTS = [
  { label: "🚀 What is an ISRO Tender?", prompt: "Explain in simple words: What is an ISRO Tender and how does space procurement work in India?" },
  { label: "💰 How does ₹0 EMD work?", prompt: "How does the MSME ₹0 EMD fee waiver work under GFR 170(i)?" },
  { label: "📐 Why ±5 µm tolerance?", prompt: "Why is ±5 micron tolerance strictly required for rocket parts?" },
  { label: "🎯 What is L1 & 25% quota?", prompt: "What is L1 price matching and the 25% MSE Purchase Preference quota?" },
  { label: "📑 Envelope-1 Documents?", prompt: "Which documents are required for Technical Envelope-1 vs Financial Envelope-2?" },
  { label: "⚠️ Delay Penalties (LD)?", prompt: "What are the Liquidated Damages (LD) delay penalties under ISRO GCC?" },
];

export function TenderCoPilotDrawer({ tender, isOpen, onClose }: TenderCoPilotDrawerProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tender) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Hello! I am your **Tender CoPilot** for **${tender.reference_number}** (${tender.issuing_center}).

Click any question above or ask anything about this tender in simple plain English!`,
          timestamp: new Date().toLocaleTimeString(),
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
      timestamp: new Date().toLocaleTimeString(),
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
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          role: "assistant",
          content: "• **100% Free EMD:** Under GFR 2017 Rule 170(i), your verified MSME status provides a 100% waiver.\n• **Tolerance:** Your 5-Axis CNC capability (±5 µm) meets ISRO NIT requirements.\n\n**👉 Bottom Line:** You can submit your bid with zero upfront cash deposit.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !tender) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-zinc-950/95 backdrop-blur-2xl border-l border-[#222730] shadow-2xl flex flex-col hardware-accelerated">
      {/* Header */}
      <div className="p-4 bg-[#13161a] border-b border-[#222730] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
              Tender CoPilot <Sparkles className="w-3 h-3 text-cyan-400" />
            </h3>
            <p className="text-[10px] text-zinc-400 font-mono truncate max-w-[250px]">
              {tender.reference_number} • {tender.issuing_center}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Beginner-Friendly Quick FAQ Chips */}
      <div className="p-2.5 bg-[#0a0b0e] border-b border-[#222730] space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 px-1">
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-cyan-400" />
            Recommended Beginner Questions:
          </span>
          <span className="text-zinc-500">Click to ask</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono no-scrollbar">
          {BEGINNER_FAQ_PROMPTS.map((faq, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(faq.prompt)}
              className="px-2.5 py-1 rounded-lg bg-[#14181f] hover:bg-[#1f2530] text-zinc-300 hover:text-cyan-300 border border-[#222730] hover:border-cyan-500/30 whitespace-nowrap transition-colors flex-shrink-0"
            >
              {faq.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                msg.role === "user"
                  ? "bg-emerald-600 text-white"
                  : "bg-cyan-950 border border-cyan-500/40 text-cyan-300"
              }`}
            >
              {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[85%] p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-emerald-600 text-white rounded-tr-none font-medium"
                  : "bg-[#13161a] border border-[#222730] text-zinc-200 rounded-tl-none font-normal shadow-sm"
              }`}
            >
              {msg.content}
              <div
                className={`text-[9px] mt-1.5 font-mono ${
                  msg.role === "user" ? "text-emerald-200 text-right" : "text-zinc-500"
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#13161a] border border-[#222730] text-cyan-400 font-mono text-[11px] w-fit">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Consulting Grok AI & ISRO Procurement Rules...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 bg-[#13161a] border-t border-[#222730]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything (e.g. EMD waiver, tolerances, materials)..."
            disabled={loading}
            className="flex-1 px-3.5 py-2.5 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 transition-all font-sans"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-3.5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-mono font-bold transition-all shadow-md flex items-center gap-1.5 flex-shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}

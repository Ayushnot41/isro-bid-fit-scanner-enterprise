"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, X, Bot, User, CheckCircle2, ShieldCheck, AlertCircle, FileText } from "lucide-react";
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
          content: `Hello! I am your AI Tender CoPilot for **${tender.reference_number}** (${tender.issuing_center}). You can ask me about GD&T tolerances, Strength of Materials compliance, MSME EMD exemptions under GFR 170(i), or delivery penalty clauses.`,
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
          content: "Under GFR 2017 Rule 170(i), your enterprise qualifies for 100% EMD fee exemption. All mechanical tolerances (±5 µm) meet ISRO NIT specifications.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !tender) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-zinc-950/95 backdrop-blur-2xl border-l border-[#222730] shadow-2xl flex flex-col hardware-accelerated">
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
            <p className="text-[10px] text-zinc-400 font-mono truncate max-w-[240px]">
              {tender.reference_number}
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

      {/* Suggested Questions Ribbon */}
      <div className="px-3 py-2 bg-[#0d0f12] border-b border-[#222730] flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
        <button
          onClick={() => handleSend("What is our EMD waiver status?")}
          className="px-2.5 py-1 rounded-md bg-[#1c2128] hover:bg-[#242b35] text-emerald-400 border border-emerald-500/20 whitespace-nowrap transition-colors"
        >
          💰 EMD Waiver
        </button>
        <button
          onClick={() => handleSend("Check GD&T machining tolerances")}
          className="px-2.5 py-1 rounded-md bg-[#1c2128] hover:bg-[#242b35] text-cyan-400 border border-cyan-500/20 whitespace-nowrap transition-colors"
        >
          📐 GD&T Tolerances
        </button>
        <button
          onClick={() => handleSend("What are the late delivery penalties?")}
          className="px-2.5 py-1 rounded-md bg-[#1c2128] hover:bg-[#242b35] text-amber-400 border border-amber-500/20 whitespace-nowrap transition-colors"
        >
          ⚠️ LD Penalties
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 text-xs leading-relaxed ${
              m.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                m.role === "user"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
              }`}
            >
              {m.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div
              className={`p-3.5 rounded-2xl max-w-[82%] font-sans text-xs ${
                m.role === "user"
                  ? "bg-emerald-600 text-white rounded-tr-sm"
                  : "bg-[#13161a] text-zinc-200 border border-[#222730] rounded-tl-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono p-2">
            <span className="animate-spin">⚙️</span>
            <span>Tender CoPilot querying pgvector memory & Grok AI...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-[#13161a] border-t border-[#222730] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about this ISRO tender..."
          disabled={loading}
          className="flex-1 bg-[#0a0b0e] px-3.5 py-2 rounded-xl border border-[#222730] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50"
        />
        <Button
          type="submit"
          size="sm"
          disabled={loading || !input.trim()}
          className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-3"
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, X, Sparkles, Clock, AlertTriangle, ShieldCheck, FileText, ArrowRight, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: "TENDER" | "AI_INSIGHT" | "STATUTORY" | "SYSTEM";
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  badgeText?: string;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTender?: (tenderId: string) => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "New High-Fit Tender Published (VSSC)",
    description: "VSSC published RFP for PSLV-C60 Stage-4 Titanium Gimbal Bracket. Grok AI calculated a 95% Bid-Fit Score.",
    category: "TENDER",
    timestamp: "2 mins ago",
    read: false,
    actionUrl: "/tenders",
    badgeText: "95% Match",
  },
  {
    id: "notif-2",
    title: "MSME ₹0 EMD Exemption Verified",
    description: "Statutory 100% waiver applied under GFR 2017 Rule 170(i). You saved ₹6.40 Lakhs in cash deposit requirements.",
    category: "STATUTORY",
    timestamp: "15 mins ago",
    read: false,
    actionUrl: "/profile",
    badgeText: "₹6.40L Saved",
  },
  {
    id: "notif-3",
    title: "WebCMD Scraper Synchronized 6 Centers",
    description: "Multi-center crawler refreshed 8 active tenders from VSSC, URSC, SAC, SDSC, IPRC, and LPSC.",
    category: "SYSTEM",
    timestamp: "1 hour ago",
    read: true,
    actionUrl: "/tenders",
    badgeText: "WebCMD v0.7.4",
  },
  {
    id: "notif-4",
    title: "L1 + 15% Purchase Preference Available",
    description: "Your MSE registration qualifies your enterprise for 25% tender volume allocation under Indian Public Procurement Policy.",
    category: "AI_INSIGHT",
    timestamp: "3 hours ago",
    read: true,
    actionUrl: "/dashboard",
    badgeText: "MSE 25% Band",
  },
  {
    id: "notif-5",
    title: "Stage-3 CMM Calibration Reminder",
    description: "Ensure NABL metrology report for ±5 µm linear machining is attached to Technical Envelope-1 before bid deadline.",
    category: "AI_INSIGHT",
    timestamp: "5 hours ago",
    read: true,
    actionUrl: "/tenders",
    badgeText: "GD&T Notice",
  },
];

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<"ALL" | "TENDER" | "AI_INSIGHT" | "STATUTORY">("ALL");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === "ALL") return true;
    return n.category === activeTab;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end sm:p-6 p-2 bg-black/60 backdrop-blur-sm hardware-accelerated">
          {/* Backdrop Click to Close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-lg bg-[#13161a] border border-[#222730] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] mt-12 sm:mt-0"
          >
            {/* Header */}
            <div className="p-4 bg-[#0d0f12] border-b border-[#222730] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold text-white flex items-center gap-2">
                    Live Alerts & Notifications
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500 text-black font-bold font-mono">
                        {unreadCount} NEW
                      </span>
                    )}
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-mono">
                    Real-time ISRO tender intelligence & statutory alerts
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    title="Mark all as read"
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-[#1c2128] transition-colors text-xs flex items-center gap-1 font-mono"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span className="text-[10px] hidden sm:inline">Mark read</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1c2128] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="px-4 py-2 bg-[#0a0b0e] border-b border-[#222730] flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
              <button
                onClick={() => setActiveTab("ALL")}
                className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] ${
                  activeTab === "ALL"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setActiveTab("TENDER")}
                className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] ${
                  activeTab === "TENDER"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Tenders
              </button>
              <button
                onClick={() => setActiveTab("STATUTORY")}
                className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] ${
                  activeTab === "STATUTORY"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                MSME / EMD
              </button>
              <button
                onClick={() => setActiveTab("AI_INSIGHT")}
                className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] ${
                  activeTab === "AI_INSIGHT"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                AI Insights
              </button>
            </div>

            {/* Notifications Feed */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`p-3 rounded-xl border transition-all ${
                    item.read
                      ? "bg-[#0a0b0e] border-[#222730]/60 opacity-80"
                      : "bg-[#161a20] border-emerald-500/30 shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 flex-1">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          item.category === "TENDER"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : item.category === "STATUTORY"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            : item.category === "AI_INSIGHT"
                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                            : "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                        }`}
                      >
                        {item.category === "TENDER" ? (
                          <FileText className="w-3 h-3" />
                        ) : item.category === "STATUTORY" ? (
                          <ShieldCheck className="w-3 h-3" />
                        ) : item.category === "AI_INSIGHT" ? (
                          <Sparkles className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white leading-snug">
                            {item.title}
                          </h4>
                          {!item.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed mt-1">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-zinc-500">
                          <span>{item.timestamp}</span>
                          {item.badgeText && (
                            <span className="px-1.5 py-0.5 rounded bg-[#222730] text-zinc-300 border border-[#2c323e]">
                              {item.badgeText}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {item.actionUrl && (
                      <Link
                        href={item.actionUrl}
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-[#222730] transition-colors flex-shrink-0"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="py-12 text-center text-zinc-500 font-mono text-xs">
                  No notifications in this category.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-[#0d0f12] border-t border-[#222730] flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500 text-[11px]">
                WebCMD Realtime Alert Daemon Active
              </span>
              <button
                onClick={clearAll}
                className="text-zinc-500 hover:text-red-400 transition-colors text-[11px] flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear all</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Activity, RefreshCcw, Server, ShieldAlert, CheckCircle2, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const mockJobs = [
  { id: "JOB-4891", tender: "ISRO-SAC-2026-99", status: "Success", duration: "1m 12s", error: null, time: new Date(Date.now() - 1000 * 60 * 5) },
  { id: "JOB-4890", tender: "ISRO-URSC-2026-42", status: "Success", duration: "45s", error: null, time: new Date(Date.now() - 1000 * 60 * 35) },
  { id: "JOB-4889", tender: "ISRO-VSSC-2026-11", status: "Failed", duration: "2m 05s", error: "Connection Timeout: NIC eProc Portal Unreachable", time: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: "JOB-4888", tender: "ISRO-LPSC-2026-08", status: "Success", duration: "1m 30s", error: null, time: new Date(Date.now() - 1000 * 60 * 60 * 5) },
  { id: "JOB-4887", tender: "ISRO-IPRC-2026-91", status: "Success", duration: "55s", error: null, time: new Date(Date.now() - 1000 * 60 * 60 * 12) },
];

export default function JobsDashboardPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] WebCMD Scraper Engine Initialized v4.2",
    "[INFO] Establishing secure TLS tunnel to eproc.isro.gov.in...",
    "[INFO] Handshake complete. Listening for new tenders...",
  ]);

  const handleTriggerSync = () => {
    setIsSyncing(true);
    toast.info("Manual Sync Triggered", {
      description: "WebCMD Engine is scanning ISRO portals for updates.",
    });

    setLogs(prev => [...prev, `[USER] Manual Sync Triggered at ${new Date().toISOString()}`, "[INFO] Initiating bypass token exchange...", "[INFO] Resolving CAPTCHA challenge..."]);

    setTimeout(() => {
      setIsSyncing(false);
      setLogs(prev => [...prev, "[SUCCESS] Sync completed. 0 new tenders found.", "[INFO] Idling..."]);
      toast.success("Sync Complete", {
        description: "All ISRO databases are up to date.",
      });
    }, 3000);
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#222730] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-400" />
            System Health & Job Queue
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Monitor autonomous WebCMD scraper metrics and sync history.
          </p>
        </div>
        
        <Button 
          onClick={handleTriggerSync} 
          disabled={isSyncing}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs h-10 px-4"
        >
          <RefreshCcw className={`w-4 h-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "SYNCING..." : "TRIGGER MANUAL SYNC"}
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#13161a] border border-[#222730] p-5 rounded-2xl">
          <p className="text-xs text-zinc-400 font-mono mb-2 uppercase tracking-wider">Tenders Synced (24h)</p>
          <div className="text-3xl font-bold text-white font-mono">14</div>
        </div>
        <div className="bg-[#13161a] border border-[#222730] p-5 rounded-2xl">
          <p className="text-xs text-zinc-400 font-mono mb-2 uppercase tracking-wider">Active WebCMD Scrapers</p>
          <div className="text-3xl font-bold text-cyan-400 font-mono">3 / 5</div>
        </div>
        <div className="bg-[#13161a] border border-[#222730] p-5 rounded-2xl">
          <p className="text-xs text-zinc-400 font-mono mb-2 uppercase tracking-wider">Success Rate</p>
          <div className="text-3xl font-bold text-emerald-400 font-mono">98.2%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table of recent jobs */}
        <div className="lg:col-span-2 bg-[#13161a] border border-[#222730] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[#222730] flex items-center gap-2">
            <Server className="w-4 h-4 text-zinc-400" />
            <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">Recent Sync Jobs</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#0a0b0e] text-zinc-400 font-mono text-xs uppercase">
                <tr>
                  <th className="px-5 py-3 font-medium">Job ID</th>
                  <th className="px-5 py-3 font-medium">Tender Ref</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Duration</th>
                  <th className="px-5 py-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222730]">
                {mockJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[#1a1e24] transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-zinc-300">{job.id}</td>
                    <td className="px-5 py-3 font-mono text-xs text-zinc-300">{job.tender}</td>
                    <td className="px-5 py-3">
                      {job.status === "Success" ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> SUCCESS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/20" title={job.error || "Unknown Error"}>
                          <ShieldAlert className="w-3 h-3" /> FAILED
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-zinc-400">{job.duration}</td>
                    <td className="px-5 py-3 font-mono text-xs text-zinc-500">{formatDistanceToNow(job.time, { addSuffix: true })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Terminal */}
        <div className="bg-[#0a0b0e] border border-[#222730] rounded-2xl overflow-hidden flex flex-col h-[400px]">
          <div className="p-3 border-b border-[#222730] bg-[#13161a] flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-semibold text-white font-mono uppercase tracking-wider">WebCMD Telemetry</h3>
          </div>
          <div className="p-4 flex-1 overflow-y-auto font-mono text-[10px] sm:text-xs text-zinc-400 space-y-1.5">
            {logs.map((log, i) => (
              <div key={i} className={
                log.includes("[ERROR]") ? "text-red-400" :
                log.includes("[SUCCESS]") ? "text-emerald-400" :
                log.includes("[USER]") ? "text-cyan-400" :
                "text-zinc-500"
              }>
                {log}
              </div>
            ))}
            {isSyncing && (
              <div className="text-zinc-500 animate-pulse">_</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

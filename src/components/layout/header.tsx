"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import { Bell, Search } from "lucide-react";

export function Header() {
  const { user } = useUser();

  return (
    <header className="h-16 border-b border-[#222730] bg-[#0d0f12]/90 backdrop-blur-md flex items-center justify-between px-6 sm:px-8 sticky top-0 z-30">
      {/* Search HUD */}
      <div className="relative w-72 sm:w-96">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search RFPs, ISRO Centers, GD&T drawings..."
          className="w-full pl-10 pr-12 py-2 bg-[#13161a] border border-[#222730] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-all font-sans"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono text-zinc-500 border border-[#222730] bg-[#08090a]">
          ⌘K
        </span>
      </div>

      {/* Right Telemetry & User Profile */}
      <div className="flex items-center gap-4">
        {/* Real-time sync badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#13161a] border border-[#222730] text-[11px] font-mono text-zinc-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>ISRO GFR 2017 Mode</span>
        </div>

        <button
          aria-label="Notifications"
          className="relative p-2 text-zinc-400 hover:text-white hover:bg-[#181c22] rounded-xl transition-all border border-transparent hover:border-[#222730]"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-[#0d0f12]" />
        </button>

        <div className="flex items-center gap-2.5 pl-2 border-l border-[#222730]">
          <UserButton
            afterSignOutUrl="/login"
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 rounded-xl",
              },
            }}
          />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-white leading-none">
              {user?.fullName || user?.primaryEmailAddress?.emailAddress?.split("@")[0] || "AeroPrecision India"}
            </p>
            <p className="text-[10px] font-mono text-zinc-500 leading-tight mt-0.5">
              Verified Aerospace MSME
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}


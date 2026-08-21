import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#08090a] flex items-center justify-center relative overflow-hidden p-4">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-md">
        <div className="text-center mb-1">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">ISRO Bid-Fit</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-md">PRO</span>
          </div>
          <p className="text-zinc-500 text-xs font-mono">Create your verified vendor account</p>
        </div>

        <SignUp
          routing="hash"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-[#0e1115] border border-[#222730] shadow-2xl shadow-black/60 rounded-2xl w-full",
            },
          }}
        />
      </div>
    </div>
  );
}

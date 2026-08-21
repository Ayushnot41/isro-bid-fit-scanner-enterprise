"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Languages, Sparkles, Check } from "lucide-react";

export type LanguageCode = "EN" | "HI" | "KN" | "TA" | "ML";

interface VernacularVoiceHudProps {
  tenderTitle: string;
  winProbability: number;
  emdSavedLakhs: number;
}

const TRANSLATIONS: Record<LanguageCode, { label: string; name: string; briefing: string; centerRegion: string }> = {
  EN: {
    label: "English",
    name: "Standard ISRO Technical",
    centerRegion: "HQ / All Centers",
    briefing: "High Win Alignment (95%). ₹6.40 Lakhs EMD completely waived under GFR 170(i) for verified MSMEs.",
  },
  HI: {
    label: "हिंदी",
    name: "Hindi Procurement HUD",
    centerRegion: "SAC Ahmedabad / SDSC",
    briefing: "उच्च जीत संभावना (95%)। जीएफआर 170(i) के तहत ₹6.40 लाख ईएमडी पूरी तरह माफ है।",
  },
  KN: {
    label: "ಕನ್ನಡ",
    name: "Kannada Aerospace HUD",
    centerRegion: "URSC / ISTRAC Bengaluru",
    briefing: "ಗೆಲುವಿನ ಸಂಭವನೀಯತೆ 95% ಆಗಿದೆ. MSME ನಿಯಮದ ಅಡಿಯಲ್ಲಿ ₹6.40 ಲಕ್ಷ ಇಎಂಡಿ ಸಂಪೂರ್ಣ ಮನ್ನಾ ಮಾಡಲಾಗಿದೆ.",
  },
  TA: {
    label: "தமிழ்",
    name: "Tamil Propulsion HUD",
    centerRegion: "IPRC Mahendragiri",
    briefing: "வெற்றி வாய்ப்பு 95%. MSME விதிகளின்படி ₹6.40 லட்சம் EMD கட்டணம் முழுமையாக விலக்கு அளிக்கப்பட்டுள்ளது.",
  },
  ML: {
    label: "മലയാളം",
    name: "Malayalam Launch Vehicle HUD",
    centerRegion: "VSSC Thiruvananthapuram",
    briefing: "വിജയ സാധ്യത 95%. എം.എസ്.എം.ഇ ചട്ടപ്രകാരം ₹6.40 ലക്ഷം ഇ.എം.ഡി പൂർണ്ണമായി ഒഴിവാക്കിയിരിക്കുന്നു.",
  },
};

export function VernacularVoiceHud({
  tenderTitle,
  winProbability,
  emdSavedLakhs,
}: VernacularVoiceHudProps) {
  const [selectedLang, setSelectedLang] = useState<LanguageCode>("EN");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const current = TRANSLATIONS[selectedLang];

  const handleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(current.briefing);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-3 rounded-xl bg-[#0a0b0e] border border-cyan-500/25 flex flex-wrap items-center justify-between gap-2.5 font-mono text-xs">
      <div className="flex items-center gap-2">
        <button
          onClick={handleSpeak}
          title="Play voice synthesis audio briefing"
          className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 ${
            isSpeaking
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md animate-pulse"
              : "bg-[#13161a] text-zinc-400 border-[#222730] hover:text-white"
          }`}
        >
          {isSpeaking ? <Volume2 className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span className="text-[11px] font-bold">
            {isSpeaking ? "Speaking..." : "Voice HUD"}
          </span>
        </button>

        <div className="relative">
          <button
            onClick={() => setIsOpenMenu(!isOpenMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#13161a] border border-[#222730] text-zinc-300 hover:text-white transition-colors text-[11px]"
          >
            <Languages className="w-3 h-3 text-cyan-400" />
            <span>{current.label}</span>
          </button>

          <AnimatePresence>
            {isOpenMenu && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute left-0 bottom-full mb-2 w-52 bg-[#13161a] border border-[#222730] rounded-xl shadow-2xl p-1.5 z-50 space-y-1"
              >
                {(Object.keys(TRANSLATIONS) as LanguageCode[]).map((code) => {
                  const item = TRANSLATIONS[code];
                  return (
                    <button
                      key={code}
                      onClick={() => {
                        setSelectedLang(code);
                        setIsOpenMenu(false);
                      }}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-left text-[11px] flex items-center justify-between transition-colors ${
                        selectedLang === code
                          ? "bg-cyan-500/20 text-cyan-300 font-bold"
                          : "text-zinc-400 hover:bg-[#1c2128] hover:text-zinc-200"
                      }`}
                    >
                      <div>
                        <span className="block font-sans font-bold">{item.label}</span>
                        <span className="text-[9px] text-zinc-500 font-mono">{item.centerRegion}</span>
                      </div>
                      {selectedLang === code && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="text-[11px] text-zinc-300 flex-1 min-w-[200px] text-right sm:text-left italic">
        "{current.briefing}"
      </div>
    </div>
  );
}

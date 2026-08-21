"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Languages, Sparkles, Check, Activity } from "lucide-react";

export type LanguageCode = "EN" | "HI" | "KN" | "TA" | "ML";

interface VernacularVoiceHudProps {
  tenderTitle: string;
  winProbability: number;
  emdSavedLakhs: number;
}

interface LanguageMetadata {
  label: string;
  name: string;
  centerRegion: string;
  langTag: string;
  voiceKeywords: string[];
}

const LANGUAGES: Record<LanguageCode, LanguageMetadata> = {
  EN: {
    label: "English",
    name: "Indian Aerospace English",
    centerRegion: "HQ / All Centers",
    langTag: "en-IN",
    voiceKeywords: ["neerja", "prabhat", "ravi", "heera", "natural", "neural", "google", "online", "india", "en-in", "en-gb", "en-us"],
  },
  HI: {
    label: "हिंदी",
    name: "Hindi Procurement Officer",
    centerRegion: "SAC Ahmedabad / SDSC",
    langTag: "hi-IN",
    voiceKeywords: ["swara", "madhur", "kalpana", "hemant", "natural", "neural", "google", "online", "hindi", "hi-in"],
  },
  KN: {
    label: "ಕನ್ನಡ",
    name: "Kannada Propulsion Expert",
    centerRegion: "URSC / ISTRAC Bengaluru",
    langTag: "kn-IN",
    voiceKeywords: ["gagan", "sapna", "natural", "neural", "google", "online", "kannada", "kn-in"],
  },
  TA: {
    label: "தமிழ்",
    name: "Tamil Propulsion Engineer",
    centerRegion: "IPRC Mahendragiri",
    langTag: "ta-IN",
    voiceKeywords: ["valluvar", "iniya", "natural", "neural", "google", "online", "tamil", "ta-in"],
  },
  ML: {
    label: "മലയാളം",
    name: "Malayalam Launch Vehicle Lead",
    centerRegion: "VSSC Thiruvananthapuram",
    langTag: "ml-IN",
    voiceKeywords: ["midhun", "sobhana", "natural", "neural", "google", "online", "malayalam", "ml-in"],
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
  const [activeVoiceName, setActiveVoiceName] = useState<string>("");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available speech synthesis voices with neural/natural prioritization
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const meta = LANGUAGES[selectedLang];
  const roundedWin = Math.round(winProbability || 95);
  const formattedEmd = (emdSavedLakhs || 6.4).toFixed(2);

  // Clean, human-phrased text with conversational inflection & pauses
  const getHumanBriefing = (lang: LanguageCode): string => {
    switch (lang) {
      case "EN":
        return `Tender briefing for ${tenderTitle}. Your manufacturing capabilities have a ${roundedWin} percent win alignment. Under Government Financial Rules 2017, clause 170, your ${formattedEmd} Lakh rupees Earnest Money Deposit is completely waived as an approved MSME supplier. All linear tolerances and aerospace certifications match ISRO requirements.`;
      case "HI":
        return `${tenderTitle} के लिए तकनीकी ब्रीफिंग। आपके कारखाने की क्षमता इस टेंडर से ${roundedWin} प्रतिशत मेल खाती है। भारत सरकार के नियम 170 के अनुसार, सूक्ष्म एवं लघु उद्योग होने के नाते आपका ${formattedEmd} लाख रुपये का ईएमडी शुल्क पूरी तरह माफ है।`;
      case "KN":
        return `${tenderTitle} ಟೆಂಡರ್ ಮೌಲ್ಯಮಾಪನ ಸಿದ್ಧವಾಗಿದೆ. ನಿಮ್ಮ ಸಂಸ್ಥೆಯು ${roundedWin} ಪ್ರತಿಶತ ಗೆಲುವಿನ ಸಂಭವನೀಯತೆ ಹೊಂದಿದೆ. ಎಂಎಸ್ಎಂಇ ನಿಯಮಾವಳಿಗಳ ಪ್ರಕಾರ ನಿಮ್ಮ ${formattedEmd} ಲಕ್ಷ ರೂಪಾಯಿ ಇಎಂಡಿ ಠೇವಣಿ ಶುಲ್ಕ ಸಂಪೂರ್ಣ ಮನ್ನಾ ಮಾಡಲಾಗಿದೆ.`;
      case "TA":
        return `${tenderTitle} குறித்த நேரடி அறிக்கை. உங்கள் நிறுவனத்தின் வெற்றி வாய்ப்பு ${roundedWin} சதவீதம். MSME விதிகளின்படி ${formattedEmd} லட்ச ரூபாய் EMD வைப்புத்தொகை முழுமையாக விலக்கு அளிக்கப்பட்டுள்ளது.`;
      case "ML":
        return `${tenderTitle} സാങ്കേതിക വിവരണം. നിങ്ങളുടെ സ്ഥാപനത്തിന് ${roundedWin} ശതമാനം വിജയ സാധ്യതയുണ്ട്. എം.എസ്.എം.ഇ ചട്ടപ്രകാരം ${formattedEmd} ലക്ഷം രൂപയുടെ ഇ.എം.ഡി ഡിപ്പോസിറ്റ് പൂർണ്ണമായി ഒഴിവാക്കിയിരിക്കുന്നു.`;
      default:
        return `Aerospace briefing: ${roundedWin}% win probability. ₹${formattedEmd} Lakhs EMD waived under MSME rules.`;
    }
  };

  // Human-like Natural Voice Selection Algorithm
  const selectBestHumanVoice = (langTag: string, keywords: string[]): SpeechSynthesisVoice | null => {
    if (availableVoices.length === 0) return null;

    // 1. Check for Exact Neural/Natural Indian/Regional voice
    for (const keyword of keywords) {
      const match = availableVoices.find((v) =>
        v.name.toLowerCase().includes(keyword) || v.voiceURI.toLowerCase().includes(keyword)
      );
      if (match) return match;
    }

    // 2. Check for matching language tag with 'Natural' or 'Online' or 'Google'
    const langMatches = availableVoices.filter(
      (v) => v.lang.toLowerCase().startsWith(langTag.toLowerCase().slice(0, 2))
    );

    const naturalLangMatch = langMatches.find(
      (v) =>
        v.name.toLowerCase().includes("natural") ||
        v.name.toLowerCase().includes("neural") ||
        v.name.toLowerCase().includes("google") ||
        v.name.toLowerCase().includes("online")
    );
    if (naturalLangMatch) return naturalLangMatch;

    if (langMatches.length > 0) return langMatches[0];

    // 3. Fallback to English Natural voice
    const fallbackNatural = availableVoices.find(
      (v) =>
        (v.lang.startsWith("en") &&
          (v.name.toLowerCase().includes("natural") ||
            v.name.toLowerCase().includes("online") ||
            v.name.toLowerCase().includes("google") ||
            v.name.toLowerCase().includes("siri") ||
            v.name.toLowerCase().includes("zira")))
    );

    return fallbackNatural || availableVoices[0] || null;
  };

  const handleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const humanText = getHumanBriefing(selectedLang);
    const utterance = new SpeechSynthesisUtterance(humanText);

    // Natural Human Speech Modulation Settings
    utterance.rate = 0.94; // Measured, natural presentation cadence
    utterance.pitch = 1.02; // Warm conversational vocal resonance
    utterance.volume = 1.0;

    const chosenVoice = selectBestHumanVoice(meta.langTag, meta.voiceKeywords);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
      utterance.lang = chosenVoice.lang;
      setActiveVoiceName(chosenVoice.name.replace(/Microsoft|Google|Desktop|Online \(Natural\) -/gi, "").trim());
    } else {
      utterance.lang = meta.langTag;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-3.5 rounded-2xl bg-[#0e1115] border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs shadow-lg shadow-black/40">
      <div className="flex items-center gap-2.5">
        {/* Play/Stop Button with Equalizer */}
        <button
          type="button"
          onClick={handleSpeak}
          title={isSpeaking ? "Stop voice briefing" : "Listen to human voice audio briefing"}
          className={`px-3 py-2 rounded-xl border transition-all flex items-center gap-2 cursor-pointer shadow-md ${
            isSpeaking
              ? "bg-cyan-500/25 text-cyan-300 border-cyan-500/60 shadow-cyan-950/40"
              : "bg-[#13161a] text-zinc-300 border-[#222730] hover:text-white hover:border-cyan-500/40 hover:bg-[#181c22]"
          }`}
        >
          {isSpeaking ? (
            <div className="flex items-center gap-1">
              <span className="w-1 h-3.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-4 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-2.5 bg-cyan-400 rounded-full animate-bounce" />
            </div>
          ) : (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          )}

          <div className="text-left">
            <span className="text-xs font-bold font-sans block leading-none">
              {isSpeaking ? "Pause Audio" : "Voice Briefing"}
            </span>
            <span className="text-[9px] text-zinc-400 font-mono leading-tight">
              {isSpeaking ? (activeVoiceName || "Human Neural AI") : "Natural Voice HUD"}
            </span>
          </div>
        </button>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpenMenu(!isOpenMenu)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#13161a] border border-[#222730] hover:border-cyan-500/40 text-zinc-200 hover:text-white transition-colors text-xs font-sans cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">{meta.label}</span>
          </button>

          <AnimatePresence>
            {isOpenMenu && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 bottom-full mb-2 w-60 bg-[#13161a] border border-cyan-500/30 rounded-xl shadow-2xl p-1.5 z-50 space-y-1 backdrop-blur-none"
              >
                <div className="px-2 py-1 text-[10px] font-mono text-zinc-400 uppercase tracking-wider border-b border-[#222730]">
                  Vernacular Audio Engines
                </div>

                {(Object.keys(LANGUAGES) as LanguageCode[]).map((code) => {
                  const item = LANGUAGES[code];
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        setSelectedLang(code);
                        setIsOpenMenu(false);
                        if (isSpeaking) {
                          window.speechSynthesis.cancel();
                          setIsSpeaking(false);
                        }
                      }}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        selectedLang === code
                          ? "bg-cyan-500/20 text-cyan-300 font-bold"
                          : "text-zinc-400 hover:bg-[#1c2128] hover:text-zinc-200"
                      }`}
                    >
                      <div>
                        <span className="block font-sans font-bold">{item.label}</span>
                        <span className="text-[9px] text-zinc-500 font-mono">{item.name}</span>
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

      {/* Spoken Briefing Text Transcript */}
      <div className="text-[11px] text-zinc-300 flex-1 min-w-[200px] text-left leading-relaxed bg-[#090b0e] p-2 rounded-xl border border-[#222730] font-sans">
        <span className="text-cyan-400 font-mono text-[10px] uppercase font-bold block mb-0.5">
          {meta.name} • Natural Audio Engine
        </span>
        <p className="italic text-zinc-300 text-xs">
          "{getHumanBriefing(selectedLang)}"
        </p>
      </div>
    </div>
  );
}

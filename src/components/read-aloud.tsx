"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

export function ReadAloud({ text, label }: { text: string | (() => string); label?: string }) {
  const t = useT();
  const language = useAppStore((s) => s.language);
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [failed, setFailed] = useState(false);
  const owned = useRef(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const content = typeof text === "string" ? text : "page";
  useEffect(() => {
    setSupported("speechSynthesis" in window && "SpeechSynthesisUtterance" in window);
    setSpeaking(false);
    return () => { clearTimeout(timeout.current); if (owned.current) window.speechSynthesis?.cancel(); owned.current = false; };
  }, [language, content]);
  const read = () => {
    clearTimeout(timeout.current);
    window.speechSynthesis.cancel();
    if (speaking) { owned.current = false; setSpeaking(false); return; }
    setFailed(false);
    try {
      const utterance = new SpeechSynthesisUtterance(typeof text === "string" ? text : text());
      utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
      utterance.rate = 0.9;
      utterance.onstart = () => clearTimeout(timeout.current);
      utterance.onend = () => { clearTimeout(timeout.current); owned.current = false; setSpeaking(false); };
      utterance.onerror = (event) => { clearTimeout(timeout.current); owned.current = false; setSpeaking(false); if (!["canceled", "interrupted"].includes(event.error)) setFailed(true); };
      owned.current = true; setSpeaking(true);
      timeout.current = setTimeout(() => { window.speechSynthesis.cancel(); owned.current = false; setSpeaking(false); setFailed(true); }, 4000);
      window.speechSynthesis.speak(utterance);
    } catch { clearTimeout(timeout.current); owned.current = false; setSpeaking(false); setFailed(true); }
  };
  return <div className="space-y-2"><Button type="button" variant="secondary" disabled={!supported} onClick={read}><Volume2 size={20} aria-hidden="true" />{speaking ? t("comfort.stopReading") : label || t("comfort.readAloud")}</Button>{!supported || failed ? <p role="status" className="text-sm">{t("comfort.speechFallback")}</p> : null}</div>;
}

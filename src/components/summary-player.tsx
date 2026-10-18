"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Square } from "lucide-react";
import { Button, ProgressBar } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

export function SummaryPlayer({ segments }: { segments: string[] }) {
  const t = useT();
  const language = useAppStore((state) => state.language);
  const [supported, setSupported] = useState(false);
  const [status, setStatus] = useState<"idle" | "playing" | "paused">("idle");
  const [heard, setHeard] = useState(0);
  const [failed, setFailed] = useState(false);
  const generation = useRef(0);
  const owned = useRef(false);
  const watchdog = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    const currentGeneration = generation;
    const speechOwned = owned;
    const timer = watchdog;
    setSupported("speechSynthesis" in window && "SpeechSynthesisUtterance" in window);
    setStatus("idle");
    setHeard(0);
    return () => {
      currentGeneration.current++;
      clearTimeout(timer.current);
      if (speechOwned.current) window.speechSynthesis?.cancel();
      speechOwned.current = false;
    };
  }, [language, segments]);
  const stop = () => {
    generation.current++;
    clearTimeout(watchdog.current);
    if (owned.current) window.speechSynthesis.cancel();
    owned.current = false;
    setStatus("idle");
    setHeard(0);
  };
  const playSegment = (index: number, run: number) => {
    if (index >= segments.length || run !== generation.current) { owned.current = false; setStatus("idle"); return; }
    try {
      const utterance = new SpeechSynthesisUtterance(segments[index]);
      utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
      utterance.rate = 0.9;
      utterance.onstart = () => clearTimeout(watchdog.current);
      utterance.onend = () => {
        clearTimeout(watchdog.current);
        if (run !== generation.current) return;
        setHeard(index + 1);
        playSegment(index + 1, run);
      };
      utterance.onerror = (event) => {
        clearTimeout(watchdog.current);
        if (run !== generation.current) return;
        owned.current = false;
        setStatus("idle");
        if (event.error !== "canceled" && event.error !== "interrupted") setFailed(true);
      };
      owned.current = true;
      watchdog.current = setTimeout(() => {
        if (run !== generation.current) return;
        window.speechSynthesis.cancel();
        owned.current = false;
        setStatus("idle");
        setFailed(true);
      }, 5000);
      window.speechSynthesis.speak(utterance);
    } catch { owned.current = false; setStatus("idle"); setFailed(true); }
  };
  const start = () => {
    if (!supported) return;
    clearTimeout(watchdog.current);
    if (owned.current) window.speechSynthesis.cancel();
    const run = ++generation.current;
    setHeard(0);
    setFailed(false);
    setStatus("playing");
    playSegment(0, run);
  };
  const pause = () => {
    try { window.speechSynthesis.pause(); setStatus("paused"); }
    catch { stop(); setFailed(true); }
  };
  const resume = () => {
    try { window.speechSynthesis.resume(); setStatus("playing"); }
    catch { stop(); setFailed(true); }
  };
  return <div className="space-y-3">
    <ProgressBar value={heard} max={segments.length} label={`${t("parent.audioProgress")}: ${heard}/${segments.length}`} />
    <div className="flex flex-wrap gap-2">
      {status === "idle" ? <Button disabled={!supported} onClick={start}><Play size={20} aria-hidden="true" />{t(heard === segments.length ? "parent.again" : "parent.listen")}</Button> : status === "paused" ? <Button onClick={resume}><Play size={20} aria-hidden="true" />{t("parent.resume")}</Button> : <Button onClick={pause}><Pause size={20} aria-hidden="true" />{t("parent.pause")}</Button>}
      {status !== "idle" ? <Button variant="secondary" onClick={stop}><Square size={18} aria-hidden="true" />{t("parent.stop")}</Button> : null}
    </div>
    {!supported || failed ? <p role="status" className="text-sm">{t("parent.audioFallback")}</p> : null}
  </div>;
}

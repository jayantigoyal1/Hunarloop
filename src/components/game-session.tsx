"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Pause, Play } from "lucide-react";
import { Button, ProgressBar } from "@/components/ui";
import { CatchStar, SequenceMemory, WordPop } from "@/components/talent-games";
import { games } from "@/data/games";
import { createMetrics, finalizeMetrics, GAME_DURATION_MS, sessionId, skillSignals, type GameId } from "@/lib/game-engine";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";

export function GameSkip() {
  const t = useT();
  return <Link href="/comfort" className="inline-flex min-h-12 items-center justify-center rounded-xl px-4 font-bold text-teal-700 underline">{t("games.skip")}</Link>;
}

export function SessionProgress() {
  const t = useT();
  const count = useAppStore((state) => state.gameSessionsCount);
  return <div className="space-y-2"><ProgressBar value={Math.min(count, 3)} max={3} label={`${t("games.sessions")} ${count}/3`} /><p className="text-sm text-ink/80">{t("games.patternNote")}</p></div>;
}

export function GameSession({ id }: { id: GameId }) {
  const router = useRouter();
  const t = useT();
  const language = useAppStore((state) => state.language);
  const calmMode = useAppStore((state) => state.calmMode);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [paused, setPaused] = useState(false);
  const metrics = useRef(createMetrics(id));
  const completed = useRef(false);
  const session = useRef(sessionId());
  const elapsed = useRef(0);
  const previousTick = useRef(0);
  const isPaused = useRef(false);
  const finishRef = useRef<(skip: boolean) => void>(() => {});
  const now = useCallback(() => Math.min(GAME_DURATION_MS, elapsed.current + (isPaused.current || !previousTick.current ? 0 : performance.now() - previousTick.current)), []);

  function pause(value: boolean) {
    elapsed.current = now();
    previousTick.current = performance.now();
    isPaused.current = value;
    setPaused(value);
    setElapsedMs(elapsed.current);
    if (value) window.speechSynthesis?.cancel();
  }

  finishRef.current = (skip) => {
    if (completed.current) return;
    completed.current = true;
    const duration = skip ? now() : GAME_DURATION_MS;
    isPaused.current = true;
    setPaused(true);
    window.speechSynthesis?.cancel();
    const result = finalizeMetrics(metrics.current, duration);
    const state = useAppStore.getState();
    if (state.onboardingConsent.games) {
      state.addGameResult({ id: session.current, gameId: id, points: skip ? 0 : 10, status: skip ? "skipped" : "completed", metrics: result, simulated: false, skillSignals: skip ? [] : skillSignals(result) });
      if (!skip) state.awardBadge("curious-explorer");
    }
    router.replace(skip ? "/comfort" : "/games/results");
  };

  useEffect(() => {
    previousTick.current = performance.now();
    const timer = window.setInterval(() => {
      const current = performance.now();
      if (!isPaused.current && !document.hidden && !completed.current) {
        elapsed.current = Math.min(GAME_DURATION_MS, elapsed.current + current - previousTick.current);
        setElapsedMs(elapsed.current);
        if (elapsed.current >= GAME_DURATION_MS) finishRef.current(false);
      }
      previousTick.current = current;
    }, 100);
    const visibility = () => {
      if (document.hidden) { isPaused.current = true; setPaused(true); window.speechSynthesis?.cancel(); }
      previousTick.current = performance.now();
    };
    document.addEventListener("visibilitychange", visibility);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", visibility); media.removeEventListener("change", updateMotion); window.speechSynthesis?.cancel(); };
  }, []);

  const seconds = Math.ceil((GAME_DURATION_MS - elapsedMs) / 1000);
  const props = { elapsedMs, paused, now, language };
  return <div className="space-y-3">
    <div className="sticky top-16 z-10 flex items-center justify-between rounded-xl bg-paper py-1">
      <span className="text-lg font-bold tabular-nums" aria-label={`${t("games.time")}: ${seconds}`}>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}</span>
      <button type="button" className="grid min-h-12 min-w-12 place-items-center rounded-xl text-teal-700" onClick={() => pause(!paused)} aria-label={t(paused ? "games.resume" : "games.pause")}>{paused ? <Play size={24} /> : <Pause size={24} />}</button>
      <Button type="button" variant="quiet" onClick={() => finishRef.current(true)}>{t("games.skip")}</Button>
    </div>
    <h1 className="text-xl font-extrabold">{games.find((game) => game.id === id)?.title[language]}</h1>
    <div className="relative">
      {metrics.current.kind === "word-pop" ? <WordPop {...props} metrics={metrics.current} /> : metrics.current.kind === "sequence-memory" ? <SequenceMemory {...props} metrics={metrics.current} /> : <CatchStar {...props} metrics={metrics.current} calm={calmMode || reducedMotion} />}
      {paused ? <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-2xl bg-paper/95 p-4"><span className="text-4xl" aria-hidden="true">🌿</span><p className="text-xl font-bold">{t("games.paused")}</p><Button type="button" onClick={() => pause(false)}><Play size={20} />{t("games.resume")}</Button></div> : null}
    </div>
  </div>;
}

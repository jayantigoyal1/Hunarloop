"use client";

import { useEffect, useRef, useState } from "react";
import { Circle, Eye, RotateCcw, Star, Volume2 } from "lucide-react";
import { Button } from "@/components/ui";
import { words } from "@/data/games";
import { useT } from "@/lib/i18n";
import type { Language } from "@/lib/store";
import type { SequenceMetrics, StarMetrics, WordMetrics } from "@/lib/game-engine";

export function speakPrompt(text: string, language: Language) {
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
  window.speechSynthesis.speak(utterance);
}

type PlayProps = { elapsedMs: number; paused: boolean; now: () => number; language: Language };

function wordRound() {
  const options = [...words];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return { options: options.slice(0, 4), target: options[Math.floor(Math.random() * 4)] };
}

export function WordPop({ metrics, elapsedMs, paused, now, language }: PlayProps & { metrics: WordMetrics }) {
  const t = useT();
  const [round, setRound] = useState(wordRound);
  const [visual, setVisual] = useState(false);
  const [ready, setReady] = useState(false);
  const [replay, setReplay] = useState(0);
  const [feedbackAt, setFeedbackAt] = useState<number | null>(null);
  const readyAt = useRef(0);
  const locked = useRef(false);

  useEffect(() => {
    setReady(false);
    locked.current = false;
    if (paused) return;
    if (visual) { readyAt.current = now(); setReady(true); return; }
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") { setVisual(true); return; }
    let cancelled = false;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(round.target[language]);
    utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
    const fallback = window.setTimeout(() => { if (!cancelled) setVisual(true); }, 4000);
    utterance.onend = () => {
      window.clearTimeout(fallback);
      if (!cancelled) { readyAt.current = now(); setReady(true); }
    };
    utterance.onerror = (event) => { if (!cancelled && event.error !== "interrupted" && event.error !== "canceled") setVisual(true); };
    window.speechSynthesis.speak(utterance);
    return () => { cancelled = true; window.clearTimeout(fallback); window.speechSynthesis.cancel(); };
  }, [round, visual, paused, language, replay, now]);

  useEffect(() => {
    if (feedbackAt !== null && elapsedMs - feedbackAt >= 350) { setFeedbackAt(null); setRound(wordRound()); }
  }, [elapsedMs, feedbackAt]);

  return <div className="space-y-3">
    <div className="flex min-h-20 items-center justify-center gap-4 rounded-2xl bg-teal-50">
      {visual ? <span role="img" aria-label={`${t("games.target")}: ${round.target[language]}`} className="text-5xl">{round.target.emoji}</span> : <button type="button" className="grid min-h-16 min-w-16 place-items-center rounded-full bg-teal-700 text-white" disabled={paused || feedbackAt !== null} onClick={() => setReplay((value) => value + 1)} aria-label={t("games.replay")}><Volume2 size={32} /></button>}
      <span className="text-3xl" role="status" aria-label={t(feedbackAt === null ? "games.match" : "games.nice")}>{feedbackAt === null ? "👆" : "🌱"}</span>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {round.options.map((word) => <button key={word.id} type="button" disabled={!ready || paused || feedbackAt !== null} className="game-bubble flex min-h-24 flex-col items-center justify-center gap-1 rounded-[2rem] border-2 border-teal-100 bg-white p-3 shadow-soft active:bg-teal-50" onClick={() => {
        if (locked.current) return;
        locked.current = true;
        const at = now();
        metrics.trials.push({ target: round.target.id, selected: word.id, correct: word.id === round.target.id, reactionMs: Math.max(0, Math.round(at - readyAt.current)), mode: visual ? "visual" : "audio" });
        setFeedbackAt(at);
      }} aria-label={word[language]}><span className="text-4xl" aria-hidden="true">{word.emoji}</span><span className="text-sm font-bold">{word[language]}</span></button>)}
    </div>
    <Button type="button" variant="quiet" disabled={paused || feedbackAt !== null} onClick={() => setVisual(!visual)}>{visual ? <Volume2 size={20} /> : <Eye size={20} />}{t(visual ? "games.audioMode" : "games.pictureMode")}</Button>
    {visual ? <p className="text-sm text-ink/75">{t("games.audioFallback")}</p> : null}
  </div>;
}

const shapes = ["●", "▲", "■", "◆"];
const randomTile = () => Math.floor(Math.random() * 4);

export function SequenceMemory({ metrics, elapsedMs, paused, now }: PlayProps & { metrics: SequenceMetrics }) {
  const t = useT();
  const [sequence, setSequence] = useState(() => [randomTile()]);
  const [phase, setPhase] = useState<"watch" | "repeat" | "celebrate">("watch");
  const [phaseAt, setPhaseAt] = useState(0);
  const [lastTap, setLastTap] = useState({ tile: -1, at: -1000 });
  const response = useRef<number[]>([]);
  const nextSequence = useRef<number[]>([]);
  const locked = useRef(false);

  useEffect(() => {
    if (paused) return;
    if (phase === "watch" && elapsedMs - phaseAt >= sequence.length * 800 + 300) {
      response.current = [];
      locked.current = false;
      setPhase("repeat");
    }
    if (phase === "celebrate" && elapsedMs - phaseAt >= 600) {
      setSequence(nextSequence.current);
      setPhaseAt(elapsedMs);
      setPhase("watch");
    }
  }, [elapsedMs, paused, phase, phaseAt, sequence]);

  const offset = Math.max(0, elapsedMs - phaseAt);
  const glow = phase === "watch" && offset % 800 < 550 ? sequence[Math.floor(offset / 800)] : phase === "repeat" && elapsedMs - lastTap.at < 250 ? lastTap.tile : -1;
  return <div className="space-y-4">
    <div className="flex min-h-16 items-center justify-center gap-3 rounded-xl bg-teal-50" role="status"><span className="text-3xl" aria-hidden="true">{phase === "watch" ? "👀" : phase === "repeat" ? "👆" : "🌱"}</span><span className="font-bold">{t(phase === "watch" ? "games.watch" : phase === "repeat" ? "games.yourTurn" : "games.nice")}</span></div>
    <div className="grid grid-cols-2 gap-3">
      {shapes.map((shape, tile) => <button type="button" key={tile} aria-label={`${tile + 1} ${shape}`} disabled={paused || phase !== "repeat"} className={`grid min-h-28 place-items-center rounded-2xl border-4 text-5xl ${glow === tile ? "border-ink bg-sun text-ink" : "border-teal-100 bg-teal-700 text-white"}`} onClick={() => {
        if (locked.current) return;
        const at = now();
        const answer = [...response.current, tile];
        response.current = answer;
        setLastTap({ tile, at });
        const correct = tile === sequence[answer.length - 1];
        if (!correct || answer.length === sequence.length) {
          locked.current = true;
          metrics.rounds.push({ sequence: [...sequence], response: answer, correct });
          if (correct) metrics.maxSpan = Math.max(metrics.maxSpan, sequence.length);
          nextSequence.current = correct ? [...sequence.slice(-11), randomTile()] : [randomTile()];
          setPhaseAt(at);
          setPhase("celebrate");
        }
      }}>{shape}</button>)}
    </div>
    <Button type="button" variant="quiet" disabled={paused || phase !== "repeat"} onClick={() => { response.current = []; setPhaseAt(now()); setPhase("watch"); }}><RotateCcw size={18} />{t("games.replay")}</Button>
  </div>;
}

type FallingItem = { id: number; star: boolean; lane: number; spawnedAt: number; bucket: number };

export function CatchStar({ metrics, elapsedMs, paused, now, calm }: PlayProps & { metrics: StarMetrics; calm: boolean }) {
  const t = useT();
  const [items, setItems] = useState<FallingItem[]>([]);
  const live = useRef<FallingItem[]>([]);
  const nextSpawn = useRef(0);
  const nextId = useRef(0);

  useEffect(() => {
    if (paused) return;
    let changed = false;
    const remaining = live.current.filter((item) => {
      if (elapsedMs - item.spawnedAt < 2800) return true;
      if (item.star) metrics.buckets[item.bucket].misses++;
      changed = true;
      return false;
    });
    if (elapsedMs >= nextSpawn.current && elapsedMs < 117000) {
      const item = { id: nextId.current++, star: Math.random() < 0.75, lane: Math.floor(Math.random() * 3), spawnedAt: elapsedMs, bucket: Math.min(3, Math.floor(elapsedMs / 30000)) };
      remaining.push(item);
      if (item.star) metrics.buckets[item.bucket].spawned++;
      nextSpawn.current = elapsedMs + 950;
      changed = true;
    }
    if (changed) { live.current = remaining; setItems(remaining); }
  }, [elapsedMs, paused, metrics]);

  return <div className="space-y-3">
    <div className="flex items-center justify-center gap-6 rounded-xl bg-teal-50 p-3 text-2xl" aria-label={t("games.star")}><span>⭐ 👆</span><span>⚫ ✋</span></div>
    <div className="relative h-72 overflow-hidden rounded-2xl border-2 border-teal-100 bg-white touch-manipulation" onClick={(event) => {
      if (!paused && event.target === event.currentTarget) metrics.taps.push({ atMs: Math.round(now()), target: "empty" });
    }}>
      {items.map((item) => <button key={item.id} type="button" disabled={paused} aria-label={t(item.star ? "games.star" : "games.decoy")} className="absolute grid h-14 w-14 place-items-center rounded-full focus-visible:outline-teal-700" style={{ left: `calc(${(item.lane + 0.5) * 100 / 3}% - 28px)`, top: calm ? `${40 + (item.id % 3) * 76}px` : `${Math.min(224, (elapsedMs - item.spawnedAt) / 2800 * 224)}px` }} onClick={(event) => {
        event.stopPropagation();
        if (!live.current.some((target) => target.id === item.id)) return;
        metrics.taps.push({ atMs: Math.round(now()), target: item.star ? "star" : "decoy" });
        if (item.star) metrics.buckets[item.bucket].hits++;
        live.current = live.current.filter((target) => target.id !== item.id);
        setItems(live.current);
      }}>{item.star ? <Star size={44} fill="#e8cd82" stroke="#63491b" /> : <Circle size={40} fill="#d1d5db" stroke="#4b5563" />}</button>)}
    </div>
  </div>;
}

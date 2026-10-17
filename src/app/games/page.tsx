"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Volume2 } from "lucide-react";
import { Badge, Button, Card, DemoBadge } from "@/components/ui";
import { GameSession, GameSkip, SessionProgress } from "@/components/game-session";
import { speakPrompt } from "@/components/talent-games";
import { games, roadmapGames } from "@/data/games";
import { useT } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import type { GameId } from "@/lib/game-engine";

export default function GamesPage() {
  const t = useT();
  const router = useRouter();
  const language = useAppStore((state) => state.language);
  const consent = useAppStore((state) => state.onboardingConsent.games);
  const setConsent = useAppStore((state) => state.setOnboardingConsent);
  const [selected, setSelected] = useState<GameId | "demo" | null>(null);
  const [playing, setPlaying] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const game = games.find((item) => item.id === selected);

  useEffect(() => {
    if (game && consent && !playing) speakPrompt(game.instruction[language], language);
    return () => window.speechSynthesis?.cancel();
  }, [game, consent, playing, language]);

  function simulate() {
    useAppStore.getState().simulateThreeSessions();
    router.push("/games/results");
  }

  if (playing && game && consent) return <GameSession id={game.id} />;

  return <div className="space-y-4 pb-4">
    <div className="sticky top-16 z-10 flex items-center justify-between bg-paper"><DemoBadge /><GameSkip /></div>
    {selected && !consent ? <Card className="space-y-4 rounded-2xl"><h1 className="text-2xl font-extrabold">{t("games.consent")}</h1><p className="leading-7">{t("games.consentNote")}</p><Button type="button" variant="quiet" onClick={() => speakPrompt(t("games.consentNote"), language)}><Volume2 size={20} />{t("games.listen")}</Button><label className="flex min-h-12 cursor-pointer items-start gap-3"><input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="mt-1 h-6 w-6 shrink-0 accent-teal-700" /><span>{t("games.agree")}</span></label><Button type="button" className="w-full" disabled={!agreed} onClick={() => { setConsent({ games: true }); if (selected === "demo") simulate(); }}>{t("games.continue")}</Button></Card> : game ? <Card className="space-y-5 rounded-2xl text-center"><span className="block text-7xl" aria-hidden="true">{game.emoji}</span><h1 className="text-2xl font-extrabold">{game.title[language]}</h1><p className="text-base leading-7">{game.instruction[language]}</p><Badge>{t("games.minutes")}</Badge><div><Button type="button" variant="quiet" onClick={() => speakPrompt(game.instruction[language], language)}><Volume2 size={20} />{t("games.listen")}</Button></div><Button type="button" className="w-full" onClick={() => { window.speechSynthesis?.cancel(); setPlaying(true); }}>{t("games.start")}<ArrowRight size={20} /></Button></Card> : <>
      <h1 className="text-2xl font-extrabold">{t("games.title")}</h1><p className="text-sm leading-6 text-ink/80">{t("games.intro")}</p>
      {games.map((item) => <button key={item.id} type="button" className="flex min-h-24 w-full items-center gap-4 rounded-2xl border border-teal-100 bg-white p-4 text-left shadow-soft" onClick={() => setSelected(item.id)}><span className="text-4xl" aria-hidden="true">{item.emoji}</span><span className="flex-1"><span className="block text-lg font-bold">{item.title[language]}</span><span className="text-sm text-teal-700">{t("games.minutes")}</span></span><ArrowRight size={20} aria-hidden="true" /></button>)}
      <Card className="space-y-3 rounded-2xl"><SessionProgress /><Link href="/games/results" className="inline-flex min-h-12 items-center font-bold text-teal-700 underline">{t("games.results")}</Link></Card>
      {roadmapGames.map((item) => <Card key={item.en} className="flex items-center gap-3 rounded-2xl"><span className="text-3xl" aria-hidden="true">{item.emoji}</span><div><h2 className="font-bold">{item[language]}</h2><Badge>{t("games.comingSoon")}</Badge></div></Card>)}
      <details className="text-sm text-ink/70"><summary className="min-h-12 cursor-pointer py-3">{t("games.demoControls")}</summary><div className="space-y-3 rounded-xl bg-teal-50 p-3"><p>{t("games.demoNote")}</p><Button type="button" variant="secondary" onClick={() => { if (consent) simulate(); else setSelected("demo"); }}>{t("games.simulate")}</Button></div></details>
    </>}
  </div>;
}

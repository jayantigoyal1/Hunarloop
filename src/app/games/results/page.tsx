"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge, Card, ConfidenceChip, DemoBadge } from "@/components/ui";
import { GameSkip, SessionProgress } from "@/components/game-session";
import { gameSkillLabel } from "@/data/games";
import { useT } from "@/lib/i18n";
import { isDeviceStorageAvailable, useAppStore } from "@/lib/store";

export default function GameResultsPage() {
  const t = useT();
  const state = useAppStore();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const latest = [...state.gameResults].reverse().find((result) => result.status !== "skipped");
  if (!ready) return <p role="status">{t("passport.loading")}</p>;
  return <div className="space-y-4 pb-4">
    <div className="sticky top-16 z-10 flex items-center justify-between bg-paper"><DemoBadge /><GameSkip /></div>
    <Card tone="hero" className="space-y-4 rounded-2xl"><span className="text-5xl" aria-hidden="true">🌟</span><h1 className="text-2xl font-extrabold">{t(latest ? "games.result" : "games.noResults")}</h1>{latest?.simulated ? <Badge>{t("games.simulated")}</Badge> : null}{latest ? <p className="text-lg font-bold">{t("games.strength")} {gameSkillLabel(latest.skillSignals[0] ?? "trying new activities", state.language)}!</p> : null}</Card>
    <Card className="space-y-3 rounded-2xl"><SessionProgress /><p className="text-sm leading-6">{t("games.private")}</p><p className="text-sm font-semibold text-teal-700" role="status">{t(isDeviceStorageAvailable() ? "games.saved" : "games.notSaved")}</p></Card>
    {latest ? <Card className="space-y-3 rounded-2xl"><h2 className="text-lg font-bold">{t("games.passportUpdated")}</h2>{latest.skillSignals.map((skill) => <div key={skill} className="space-y-2 rounded-xl bg-teal-50 p-3"><p className="font-semibold">{gameSkillLabel(skill, state.language)}</p><ConfidenceChip level={t("games.initial")} /></div>)}<p className="text-sm leading-6">{t("games.choiceNote")}</p><Link href="/passport" className="inline-flex min-h-12 items-center font-bold text-teal-700 underline">{t("games.passport")}</Link></Card> : null}
    <Link href="/games" className="flex min-h-12 items-center justify-center rounded-xl bg-teal-700 p-3 font-bold text-white">{t("games.more")}</Link><Link href="/comfort" className="flex min-h-12 items-center justify-center rounded-xl border border-teal-700 p-3 font-bold text-teal-700">{t("games.comfort")}</Link>
  </div>;
}

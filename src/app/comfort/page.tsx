"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Card, ConfidenceChip, DemoBadge } from "@/components/ui";
import { SessionProgress } from "@/components/game-session";
import { comfortSuggestions } from "@/lib/game-engine";
import { useT } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

export default function ComfortPage() {
  const t = useT();
  const state = useAppStore();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const suggestions = comfortSuggestions(state.gameResults);
  if (!ready) return <p role="status">{t("passport.loading")}</p>;
  return <div className="space-y-4 pb-4"><DemoBadge /><h1 className="text-2xl font-extrabold">{t("route.comfort.title")}</h1><Card className="space-y-3 rounded-2xl"><SessionProgress /><p className="text-sm leading-6">{t(suggestions.length ? "games.comfortIntro" : "games.waitPatterns")}</p><p className="text-sm font-semibold">{t("games.private")}</p></Card>
    {suggestions.length ? <p className="text-sm text-ink/75">{t("games.mockInference")}</p> : null}
    {suggestions.map((key) => <Card key={key} className="space-y-3 rounded-2xl"><h2 className="text-lg font-bold">{t(`passport.${key}`)}</h2><ConfidenceChip level={t("games.initial")} /><div className="flex flex-wrap gap-2"><Button type="button" aria-pressed={state.comfortSettings[key] === "accepted"} variant={state.comfortSettings[key] === "accepted" ? "primary" : "secondary"} onClick={() => state.setComfortSetting(key, "accepted")}>{t("passport.accept")}</Button><Button type="button" aria-pressed={state.comfortSettings[key] === "rejected"} variant={state.comfortSettings[key] === "rejected" ? "primary" : "quiet"} onClick={() => state.setComfortSetting(key, "rejected")}>{t("passport.reject")}</Button></div></Card>)}
    <Link href="/games" className="flex min-h-12 items-center justify-center rounded-xl border border-teal-700 p-3 font-bold text-teal-700">{t("games.more")}</Link><Link href="/careers" className="flex min-h-12 items-center justify-center rounded-xl bg-teal-700 p-3 font-bold text-white">{t("route.comfort.action")}</Link>
  </div>;
}

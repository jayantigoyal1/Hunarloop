"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Award, Lock, Trophy } from "lucide-react";
import { badges } from "@/data/badges";
import { opportunityCatalog } from "@/data/opportunity-catalog";
import { Badge, Card, DemoBadge, ProgressBar } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

const rewardLinks = [
  { id: "nsp-school-scholarship", key: "scholarship" },
  { id: "naps-apprenticeship", key: "stipend" },
  { id: "ncs-entry-task-search", key: "task" },
] as const;

export default function RewardsPage() {
  const t = useT();
  const state = useAppStore();
  const syncActivityBadges = state.syncActivityBadges;
  const passportEdited = state.passportEdited;
  const milestoneCount = state.rewardedMilestoneIds.length;
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); syncActivityBadges(); }, [state.onboardingDone, passportEdited, state.chosenCareerId, state.gameSessionsCount, milestoneCount, syncActivityBadges]);
  if (!ready) return <p role="status">{t("passport.loading")}</p>;
  const history = [...state.activityHistory].sort((a, b) => (Date.parse(b.occurredAt ?? "") || 0) - (Date.parse(a.occurredAt ?? "") || 0));
  const date = (value: string | null) => value ? new Intl.DateTimeFormat(state.language === "hi" ? "hi-IN" : "en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }).format(new Date(value)) : t("rewards.earlier");
  return <div className="space-y-5 pb-4">
    <Card tone="hero" className="space-y-3"><DemoBadge /><Trophy className="text-teal-700" size={30} aria-hidden="true" /><h1 className="text-3xl font-extrabold">{t("rewards.title")}</h1><p className="text-4xl font-extrabold text-teal-700">{state.points} <span className="text-lg">{t("passport.points")}</span></p><p className="font-semibold leading-6">{t("rewards.note")}</p><p className="text-sm leading-6">{t("rewards.rule")}</p></Card>
    <Card className="space-y-4"><h2 className="text-xl font-bold">{t("rewards.badges")}</h2><div className="grid grid-cols-2 gap-2">{badges.map((badge) => { const earned = state.earnedBadges.includes(badge.id); return <section key={badge.id} className={`min-w-0 space-y-2 rounded-xl border p-3 ${earned ? "border-teal-300 bg-teal-50" : "border-slate-300 bg-paper"}`} aria-label={badge.title[state.language] + " · " + t(earned ? "rewards.earned" : "rewards.locked")}><div className="flex items-center gap-2">{earned ? <Award size={22} className="text-teal-700" aria-hidden="true" /> : <Lock size={22} className="text-slate-600" aria-hidden="true" />}<Badge>{t(earned ? "rewards.earned" : "rewards.locked")}</Badge></div><h3 className="break-words font-bold">{badge.title[state.language]}</h3><p className="text-sm leading-5">{badge.description[state.language]}</p></section>; })}</div></Card>
    <Card className="space-y-4"><h2 className="text-xl font-bold">{t("rewards.progress")}</h2><ProgressBar value={Math.min(1, state.gameSessionsCount)} max={1} label={t("rewards.games")} /><ProgressBar value={Math.min(4, state.rewardedMilestoneIds.length)} max={4} label={t("rewards.plan")} /><ProgressBar value={Math.min(1, state.joinedCircleIds.length)} max={1} label={t("rewards.circle")} /></Card>
    <Card className="space-y-3"><h2 className="text-xl font-bold">{t("rewards.history")}</h2>{history.length ? <ol className="space-y-3 border-l-2 border-teal-200 pl-4">{history.map((item) => <li key={item.id} className="relative rounded-xl bg-paper p-3 before:absolute before:-left-[1.36rem] before:top-4 before:h-3 before:w-3 before:rounded-full before:bg-teal-700"><p className="font-bold">{t("rewards." + item.kind)}</p><p className="text-sm">{date(item.occurredAt)}{item.simulated ? " · " + t("rewards.simulated") : ""}</p><p className="text-sm font-semibold">{item.points > 0 ? "+" : ""}{item.points} {t("passport.points")}</p></li>)}</ol> : <p>{t("rewards.empty")}</p>}</Card>
    <Card className="space-y-3"><h2 className="text-xl font-bold">{t("rewards.real")}</h2><p className="text-sm leading-6">{t("rewards.realNote")}</p>{rewardLinks.map(({ id, key }) => { const item = opportunityCatalog.find((candidate) => candidate.id === id)!; return <section key={id} className="space-y-2 border-t border-teal-100 pt-3"><h3 className="font-bold">{t("rewards." + key)}</h3><p className="text-sm">{state.language === "hi" ? item.nameHi : item.name}</p><p className="text-xs">{t("op.verified")} {item.lastVerified.split(" ")[0]} · {t("op.notVerified")}</p><a className="flex min-h-12 items-center break-all text-sm font-bold text-teal-700 underline" href={item.officialUrl} target="_blank" rel="noreferrer">{t("op.source")}: {item.officialUrl}</a><Link href={`/opportunities?item=${id}`} className="flex min-h-12 items-center justify-center rounded-xl border border-teal-700 px-3 font-bold text-teal-700">{t("rewards.explore")}</Link></section>; })}</Card>
  </div>;
}

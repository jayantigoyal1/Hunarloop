"use client";

import Link from "next/link";
import { ArrowRight, Gift, Sparkles } from "lucide-react";
import { Card, DemoBadge } from "@/components/ui";
import { careers } from "@/data/careers";
import { milestoneId, roadmapFor } from "@/data/roadmap";
import { useT } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

export function HomeDashboard() {
  const t = useT();
  const state = useAppStore();
  const steps = [
    { done: state.profile.interests.length > 0, href: "/passport", key: "home.startPassport" },
    { done: state.gameSessionsCount > 0, href: "/games", key: "home.tryGame" },
    { done: Object.values(state.comfortSettings).some((choice) => choice !== "pending"), href: "/comfort", key: "home.chooseComfort" },
    { done: Boolean(state.chosenCareerId), href: "/careers", key: "home.exploreCareer" },
    { done: state.completedMilestoneIds.length > 0, href: "/roadmap", key: "home.startPlan" },
    { done: state.savedOpportunityIds.length > 0, href: "/opportunities", key: "home.findOpportunity" },
  ];
  const completed = steps.filter((step) => step.done).length;
  const next = steps.find((step) => !step.done) ?? { href: "/rewards", key: "home.review" };
  const career = careers.find((item) => item.id === state.chosenCareerId);
  const plan = career ? roadmapFor(career) : null;
  const today = plan?.weeks.flatMap((week) => week.activities[state.language].map((activity, index) => ({ activity, id: milestoneId(plan.careerId, week.week, index) }))).find((item) => !state.completedMilestoneIds.includes(item.id));
  const task = !career ? t(state.profile.interests.length ? "home.noPlan" : "home.firstTask") : today?.activity ?? t("home.doneTask");
  const circumference = 2 * Math.PI * 44;
  return <div className="space-y-5 pb-4">
    <Card tone="hero" className="space-y-4"><div className="flex items-center justify-between"><DemoBadge /><Sparkles size={24} className="text-teal-700" aria-hidden="true" /></div><p className="font-bold">{t("home.welcomeBack")}{state.profile.name ? `, ${state.profile.name}` : ""}</p><h1 className="text-3xl font-extrabold">{t("home.dashboard")}</h1><div className="flex items-center gap-4"><svg width="112" height="112" viewBox="0 0 112 112" role="img" aria-label={`${t("home.progressLabel")}: ${completed}/6`} className="shrink-0"><circle cx="56" cy="56" r="44" fill="none" stroke="#b8ded7" strokeWidth="10" /><circle cx="56" cy="56" r="44" fill="none" stroke="#0f766e" strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - completed / 6)} transform="rotate(-90 56 56)" /><text x="56" y="63" textAnchor="middle" fill="#193a3d" fontSize="24" fontWeight="800">{completed}/6</text></svg><div><p className="text-lg font-extrabold">{t("home.progressLabel")}</p><p className="text-sm">{t("home.stepCount")}</p></div></div></Card>
    <Card className="space-y-3"><h2 className="text-xl font-extrabold">{t("home.nextStep")}</h2><p className="text-sm">{t("home.todayIntro")}</p><Link href={next.href} className="flex min-h-12 items-center justify-between gap-2 rounded-xl bg-teal-700 px-4 py-3 font-bold text-white">{t(next.key)}<ArrowRight size={20} aria-hidden="true" /></Link></Card>
    <Card className="space-y-3"><h2 className="text-xl font-extrabold">{t("home.today")}</h2><p className="leading-6">{task}</p>{career ? <Link href="/roadmap" className="flex min-h-12 items-center font-bold text-teal-700 underline">{t("home.startPlan")}</Link> : <Link href="/careers" className="flex min-h-12 items-center font-bold text-teal-700 underline">{t("home.exploreCareer")}</Link>}</Card>
    <Card className="space-y-2"><Gift className="text-teal-700" aria-hidden="true" /><h2 className="text-xl font-extrabold">{t("home.pointsLabel")}</h2><p className="text-3xl font-extrabold text-teal-700">{state.points}</p><p className="text-sm">{t("home.pointsNote")}</p></Card>
    <p className="text-center text-sm">{t("home.guideHint")}</p>
  </div>;
}

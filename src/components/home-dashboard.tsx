"use client";

import Link from "next/link";
import { ArrowRight, Gift, MessageCircleQuestion, Sparkles } from "lucide-react";
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
  return <div className="space-y-4 pb-4">
    <div className="flex items-start justify-between gap-3 px-1"><div><p className="text-sm font-semibold text-ink/65">{t("home.welcomeBack")}{state.profile.name ? `, ${state.profile.name}` : ""}</p><h1 className="mt-1 text-3xl font-black tracking-tight">{t("home.dashboard")}</h1></div><DemoBadge /></div>
    <Card className="relative space-y-4 overflow-hidden border-teal-700 bg-teal-700 p-5 text-white"><div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" aria-hidden="true" /><div className="relative flex items-center justify-between"><p className="text-xs font-black uppercase tracking-[0.16em] text-sun">{t("home.progressLabel")}</p><Sparkles size={24} className="text-sun" aria-hidden="true" /></div><div className="relative flex items-center gap-4"><svg width="112" height="112" viewBox="0 0 112 112" role="img" aria-label={`${t("home.progressLabel")}: ${completed}/6`} className="shrink-0"><circle cx="56" cy="56" r="44" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="10" /><circle cx="56" cy="56" r="44" fill="none" stroke="#efd477" strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - completed / 6)} transform="rotate(-90 56 56)" /><text x="56" y="63" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="800">{completed}/6</text></svg><div className="min-w-0 flex-1"><p className="text-sm text-white/75">{t("home.nextStep")}</p><p className="mt-1 text-xl font-black leading-tight">{t(next.key)}</p><Link href={next.href} className="mt-3 flex min-h-12 items-center justify-between rounded-2xl bg-sun px-4 font-black text-ink">{t("home.continue")}<ArrowRight size={20} aria-hidden="true" /></Link></div></div></Card>
    <Link href="/onboarding" className="flex min-h-20 items-center gap-3 rounded-card border border-teal-100 bg-white p-4 shadow-soft"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sun/40"><MessageCircleQuestion size={24} aria-hidden="true" /></span><span className="min-w-0 flex-1"><span className="block font-black">{t("home.profileQuestions")}</span><span className="block text-sm leading-5 text-ink/65">{t("home.profileQuestionsNote")}</span></span><ArrowRight size={20} className="shrink-0" aria-hidden="true" /></Link>
    <Card className="space-y-3"><h2 className="text-xl font-extrabold">{t("home.today")}</h2><p className="leading-6">{task}</p>{career ? <Link href="/roadmap" className="flex min-h-12 items-center font-bold text-teal-700 underline">{t("home.startPlan")}</Link> : <Link href="/careers" className="flex min-h-12 items-center font-bold text-teal-700 underline">{t("home.exploreCareer")}</Link>}</Card>
    <Card className="space-y-2"><Gift className="text-teal-700" aria-hidden="true" /><h2 className="text-xl font-extrabold">{t("home.pointsLabel")}</h2><p className="text-3xl font-extrabold text-teal-700">{state.points}</p><p className="text-sm">{t("home.pointsNote")}</p></Card>
    <p className="text-center text-sm">{t("home.guideHint")}</p>
  </div>;
}

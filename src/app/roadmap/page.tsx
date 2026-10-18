"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, Headphones, Hand, Eye } from "lucide-react";
import { Badge, Button, Card, DemoBadge, ProgressBar } from "@/components/ui";
import { ReadAloud } from "@/components/read-aloud";
import { careers } from "@/data/careers";
import { pathwayLearning } from "@/data/pathway-learning";
import { milestoneId, practiceCoverage, roadmapFor, type LessonFormat } from "@/data/roadmap";
import { useT } from "@/lib/i18n";
import { isDeviceStorageAvailable, useAppStore } from "@/lib/store";

export default function RoadmapPage() {
  const t = useT();
  const state = useAppStore();
  const [ready, setReady] = useState(false);
  const [openWeek, setOpenWeek] = useState(1);
  useEffect(() => setReady(true), []);
  const career = careers.find((item) => item.id === state.chosenCareerId);
  if (!ready) return <p role="status">{t("passport.loading")}</p>;
  if (!career) return <Card className="space-y-4"><DemoBadge /><h1 className="text-2xl font-bold">{t("plan.title")}</h1><p>{t("plan.empty")}</p><Link href="/careers" className="flex min-h-12 items-center justify-center rounded-xl bg-teal-700 p-3 font-bold text-white">{t("paths.change")}</Link></Card>;
  const plan = roadmapFor(career);
  const visual = state.comfortSettings.visualExamples === "accepted" || state.profile.skills.some((skill) => ["visual matching", "drawing", "चित्र बनाना"].includes(skill.toLowerCase()));
  const audio = state.comfortSettings.audioInstructions === "accepted";
  const chunked = state.comfortSettings.stepByStepTasks === "accepted";
  const format: LessonFormat = state.roadmapFormat ?? (visual ? "visual" : state.audioFirst ? "audio" : "hands");
  const completed = plan.weeks.flatMap((week) => week.activities.en.map((_, i) => milestoneId(career.id, week.week, i))).filter((id) => state.completedMilestoneIds.includes(id)).length;
  const source = career.category === "Technical Trades" ? "https://dgt.gov.in/hi/CTS" : career.category === "Government" ? "https://rpsc.rajasthan.gov.in/" : "https://www.skillindiadigital.gov.in/";
  return <div className="space-y-5 pb-4">
    <Card tone="hero" className="space-y-3"><div className="flex items-center justify-between"><DemoBadge /><BookOpen size={28} aria-hidden="true" /></div><h1 className="text-2xl font-extrabold">{t("plan.title")}</h1><p className="text-lg font-bold">{career.title[state.language]}</p><p className="text-sm leading-6">{t("plan.intro")}</p><ProgressBar value={completed} max={16} label={`${t("plan.progress")}: ${completed}/16`} /><Badge>{state.points} {t("passport.points")}</Badge></Card>
    <Card className="space-y-3"><h2 className="font-bold">{t("plan.input")}</h2>
      {visual ? <p>{t("plan.visualInput")}</p> : null}{audio ? <p>{t("plan.audioInput")}</p> : null}{chunked ? <p>{t("plan.chunkInput")}</p> : null}
      {!visual && !audio && !chunked ? <p>{t("plan.noInput")}</p> : null}<p className="text-sm">{t("plan.inputNote")}</p><Link className="flex min-h-12 items-center font-bold text-teal-700 underline" href="/comfort">{t("plan.settings")}</Link>
    </Card>
    <fieldset className="space-y-3"><legend className="mb-2 text-lg font-bold">{t("plan.format")}</legend><div className="grid grid-cols-3 gap-2">{([{ id: "audio", Icon: Headphones }, { id: "visual", Icon: Eye }, { id: "hands", Icon: Hand }] as const).map(({ id, Icon }) => <Button key={id} className="flex-col px-1 text-sm" variant={format === id ? "primary" : "secondary"} aria-pressed={format === id} onClick={() => state.setRoadmapFormat(id)}><Icon size={20} aria-hidden="true" />{t(`plan.${id}`)}</Button>)}</div><p className="text-sm leading-6" data-testid="format-guidance">{t(`plan.${format}Hint`)}</p></fieldset>
    <p role="status" className="text-sm">{t(isDeviceStorageAvailable() ? "plan.saved" : "plan.unsaved")}</p>
    <div className="space-y-4">{plan.weeks.map((week) => <Card key={week.week} className="space-y-3" data-testid="roadmap-week">
      <h2 className="text-lg font-bold">{chunked ? <button className="flex min-h-12 w-full items-center justify-between gap-2 text-left" aria-expanded={openWeek === week.week} aria-controls={`week-${week.week}`} onClick={() => setOpenWeek(openWeek === week.week ? 0 : week.week)}><span>{t("plan.week")} {week.week} · {week.focus[state.language]}</span><span aria-hidden="true">{openWeek === week.week ? "−" : "+"}</span></button> : <>{t("plan.week")} {week.week} · {week.focus[state.language]}</>}</h2>
      {!chunked || openWeek === week.week ? <div id={`week-${week.week}`} className="space-y-3">
        {format === "audio" ? <ReadAloud text={week.focus[state.language] + ". " + week.activities[state.language].join(" ")} /> : null}
        <div className={format === "visual" ? "space-y-3 border-l-2 border-teal-200 pl-3" : "space-y-2"}>{week.activities[state.language].map((activity, index) => {
          const id = milestoneId(career.id, week.week, index);
          return <label key={id} className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-xl p-3 ${state.completedMilestoneIds.includes(id) ? "bg-teal-50" : "bg-paper"}`}>
            <input className="mt-1 h-6 w-6 shrink-0 accent-teal-700" type="checkbox" checked={state.completedMilestoneIds.includes(id)} onChange={(event) => state.setMilestoneComplete(id, event.target.checked)} />
            <span className="min-w-0 text-sm leading-6">{format === "visual" ? <span aria-hidden="true" className="mb-1 block text-lg font-bold text-teal-700">{index + 1} →</span> : format === "hands" ? <Hand size={20} aria-hidden="true" className="mb-1 text-teal-700" /> : null}{activity}<span className="mt-1 block text-xs text-ink/75">+5 {t("plan.points")}</span></span>
          </label>;
        })}</div>
      </div> : null}
    </Card>)}</div>
    <Card className="space-y-4"><h2 className="text-xl font-bold">{t("plan.gaps")}</h2><p className="text-sm leading-6">{t("plan.gapNote")}</p>{practiceCoverage(career.id, state.completedMilestoneIds).map((item, index) => <div key={index} className="space-y-1"><ProgressBar value={item.percent} label={`${t(["plan.basics", "plan.practice", "plan.readiness"][index])} · ${item.percent}%`} /><p className="text-xs">{item.done}/{item.total} {t("plan.progress")}</p></div>)}</Card>
    <Card className="space-y-4"><h2 className="text-xl font-bold">{t("plan.resources")}</h2><p className="text-sm leading-6">{t("plan.resourceNote")}</p>
      {["course", "exam", "certificate"].map((kind) => <section key={kind} className="space-y-2 border-t border-teal-100 pt-3"><h3 className="font-bold">{t(`plan.${kind}`)} · {career.title[state.language]}</h3><p className="text-sm font-semibold">{kind === "course" ? pathwayLearning[career.id].course[state.language] : t(`plan.${kind}Topic`) + " · " + pathwayLearning[career.id].course[state.language]}</p><p className="text-sm">{kind === "course" ? t("plan.courseDetail") : t(`plan.${kind}Detail`)}</p><a className="flex min-h-12 items-center font-bold text-teal-700 underline" href={source} target="_blank" rel="noreferrer">{t("plan.official")} ↗</a><p className="text-xs leading-5">{t("plan.verified")} 2026-10-18 · {t("plan.portalOnly")}</p></section>)}
    </Card>
    <Link href="/careers" className="flex min-h-12 items-center justify-center rounded-xl border border-teal-700 p-3 font-bold text-teal-700">{t("paths.change")}</Link>
  </div>;
}

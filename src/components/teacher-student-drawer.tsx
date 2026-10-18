"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Badge, Button, Card, DemoBadge } from "@/components/ui";
import { teacherDesk } from "@/data/teacher-dashboard";
import type { TeacherStudent } from "@/data/teacherStudents";
import { opportunityCatalog } from "@/data/opportunity-catalog";
import { useT } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

export function TeacherStudentDrawer({ student, onClose }: { student: TeacherStudent; onClose: () => void }) {
  const t = useT();
  const state = useAppStore();
  const dialog = useRef<HTMLDialogElement>(null);
  const desk = teacherDesk[student.id];
  const shared = student.id !== "asha-demo" || state.shareWithTeacher;
  const opportunity = opportunityCatalog.find((item) => item.id === desk.opportunityId)!;
  const activitySaved = state.teacherRecommendations.some((item) => item.studentId === student.id && item.kind === "activity" && item.itemId === desk.activityId);
  const opportunitySaved = state.teacherRecommendations.some((item) => item.studentId === student.id && item.kind === "opportunity" && item.itemId === desk.opportunityId);
  useEffect(() => {
    const modal = dialog.current!;
    const trigger = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal.showModal();
    return () => { modal.close(); document.body.style.overflow = overflow; if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: true }); };
  }, []);
  const verified = new Set(student.id === "asha-demo" ? state.teacherVerifiedSkills : (state.teacherValidatedSkills[student.id] ?? []));
  const interests = student.id === "asha-demo" ? state.profile.interests : desk.interests.map((item) => item[state.language]);
  const skills = student.id === "asha-demo" ? state.profile.skills : desk.skills.map((item) => item[state.language]);
  const goal = student.id === "asha-demo" ? state.profile.goals.join(", ") : desk.goal[state.language];
  return <dialog ref={dialog} aria-labelledby="teacher-detail-title" onCancel={(event) => { event.preventDefault(); onClose(); }} className="fixed inset-y-0 right-0 m-0 ml-auto h-dvh max-h-dvh w-screen max-w-full overflow-x-hidden border-0 bg-paper p-0 text-ink shadow-xl backdrop:bg-black/50 open:flex open:flex-col sm:max-w-2xl">
    <div className="flex shrink-0 items-center justify-between gap-2 border-b border-teal-100 bg-white p-3"><h2 id="teacher-detail-title" className="text-xl font-extrabold">{t("teacher.details")}: {student.name}</h2><button type="button" autoFocus onClick={onClose} aria-label={t("teacher.close")} className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-teal-100"><X aria-hidden="true" /></button></div>
    <div className="min-w-0 space-y-5 overflow-x-hidden overflow-y-auto overscroll-contain p-4 pb-8">
      <DemoBadge />
      {student.weeklyCompleted ? <p className="text-sm font-semibold">{t("teacher.weekly")}: {student.weeklyEngagement.join(" → ")}<br />{t("teacher.weeklyCompleted")}: {student.weeklyCompleted.join(" → ")}</p> : null}
      <Card className="space-y-3"><h3 className="text-lg font-bold">{t("teacher.signal")}</h3><Badge>{t("teacher." + desk.signal)}</Badge><p className="text-sm leading-6">{desk.signalReason[state.language]}</p><p className="text-sm leading-6">{t("teacher.uncertain")}</p><p className="font-semibold">{t("teacher.suggested")}: {desk.suggestedAction[state.language]}</p></Card>
      {!shared ? <Card className="space-y-2"><h3 className="text-lg font-bold">{t("teacher.passport")}</h3><p>{t("teacher.notShared")}</p></Card> : <>
        <Card className="space-y-3"><h3 className="text-lg font-bold">{t("teacher.passport")}</h3><Badge>{t(student.id === "asha-demo" ? "teacher.live" : "teacher.shared")}</Badge><p><strong>{t("teacher.interests")}:</strong> {interests.join(", ") || "—"}</p><p><strong>{t("teacher.skills")}:</strong> {skills.join(", ") || "—"}</p><p><strong>{t("teacher.goal")}:</strong> {goal || "—"}</p></Card>
        <Card className="space-y-3"><h3 className="text-lg font-bold">{t("teacher.awaiting")}</h3><p className="text-sm leading-6">{t("teacher.verifyNote")}</p>{desk.pendingSkills.map((skill) => <div key={skill.en} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-paper p-3"><span className="font-semibold">{skill[state.language]}</span>{verified.has(skill.en) ? <Badge>{t("teacher.verified")}</Badge> : <Button variant="secondary" onClick={() => state.verifyTeacherSkill(student.id, skill.en)}>{t("teacher.verify")}</Button>}</div>)}</Card>
        <Card className="space-y-3"><h3 className="text-lg font-bold">{t("teacher.support")}</h3><p className="text-sm leading-6">{t("teacher.choice")}</p>{(["seating", "instructions", "responses"] as const).map((kind) => <section key={kind} className="rounded-xl bg-teal-50 p-3"><h4 className="font-bold">{t("teacher." + kind)}</h4><p className="text-sm leading-6">{desk.support[kind][state.language]}</p></section>)}</Card>
        <Card className="space-y-3"><h3 className="text-lg font-bold">{t("teacher.activity")}</h3><p>{desk.activity[state.language]}</p><Button onClick={() => state.recommendTeacherItem(student.id, "activity", desk.activityId)}>{activitySaved ? t("teacher.recommended") : t("teacher.recommend")}</Button>{activitySaved ? <p role="status" className="text-sm">{t("teacher.noSend")}</p> : null}</Card>
        <Card className="space-y-3"><h3 className="text-lg font-bold">{t("teacher.opportunity")}</h3><p className="font-semibold">{state.language === "hi" ? opportunity.nameHi : opportunity.name}</p><p className="text-sm">{t("teacher.lastVerified")}: {opportunity.lastVerified} · {t("teacher.unverified")}</p><a href={opportunity.officialUrl} target="_blank" rel="noreferrer" className="flex min-h-12 items-center break-all font-bold text-teal-700 underline">{t("op.source")}: {opportunity.officialUrl}</a><div className="flex flex-wrap gap-2"><Button onClick={() => state.recommendTeacherItem(student.id, "opportunity", opportunity.id)}>{opportunitySaved ? t("teacher.referred") : t("teacher.refer")}</Button><Link href={`/opportunities?item=${opportunity.id}`} className="flex min-h-12 items-center rounded-xl border border-teal-700 px-4 font-bold text-teal-700">{t("teacher.openOpportunity")}</Link></div>{opportunitySaved ? <p role="status" className="text-sm">{t("teacher.noSend")}</p> : null}</Card>
      </>}
    </div>
  </dialog>;
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { Button, Card, DemoBadge, Badge, ProgressBar } from "@/components/ui";
import { TeacherStudentDrawer } from "@/components/teacher-student-drawer";
import { TeacherModuleCreator } from "@/components/teacher-module-creator";
import { teacherStudents } from "@/data/teacherStudents";
import { teacherDesk } from "@/data/teacher-dashboard";
import { useT } from "@/lib/i18n";
import { isDeviceStorageAvailable, useAppStore } from "@/lib/store";

export default function TeacherPage() {
  const t = useT();
  const language = useAppStore((state) => state.language);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  useEffect(() => setReady(true), []);
  const students = useMemo(() => teacherStudents.filter((student) => {
    const query = search.trim().toLocaleLowerCase();
    return (!query || (student.name + " " + student.village).toLocaleLowerCase().includes(query)) && (filter === "all" || teacherDesk[student.id].signal === filter);
  }), [search, filter]);
  if (!ready) return <p role="status">{t("passport.loading")}</p>;
  const selected = teacherStudents.find((student) => student.id === selectedId);
  return <div className="space-y-5 pb-6">
    <Card tone="hero" className="space-y-3"><DemoBadge /><Users className="text-teal-700" aria-hidden="true" /><h1 id="teacher-title" className="text-3xl font-extrabold">{t("teacher.title")}</h1><p>{t("teacher.intro")}</p><p className="rounded-xl bg-white p-3 font-bold leading-6">{t("teacher.private")}</p><p className="text-sm">{t("teacher.local")}</p></Card>
<div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]"><div className="space-y-4"><Card className="grid gap-3 sm:grid-cols-2"><label className="space-y-1"><span className="flex items-center gap-1 font-bold"><Search size={18} aria-hidden="true" />{t("teacher.search")}</span><input type="search" placeholder={t("teacher.searchHint")} value={search} onChange={(event) => setSearch(event.target.value)} className="min-h-12 w-full rounded-xl border border-teal-700 bg-white px-3" /></label><label className="space-y-1"><span className="font-bold">{t("teacher.filter")}</span><select value={filter} onChange={(event) => setFilter(event.target.value)} className="min-h-12 w-full rounded-xl border border-teal-700 bg-white px-3">{["all", "overwhelm", "disengagement", "steady"].map((kind) => <option key={kind} value={kind}>{t("teacher." + kind)}</option>)}</select></label></Card><p role="status" className="font-bold">{students.length} {t("teacher.students")}</p><div className="grid gap-3 md:grid-cols-2">{students.map((student) => { const desk = teacherDesk[student.id]; return <Card key={student.id} className="space-y-3"><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-extrabold">{student.name}</h2><Badge>{language === "hi" ? student.classLevel.replace("Class", "कक्षा") : student.classLevel}</Badge></div><p className="text-sm">{student.village}</p><ProgressBar value={student.progress} label={`${t("teacher.progress")}: ${student.progress}%`} /><p className="text-xs">{t("teacher.weekly")}: {student.weeklyEngagement.join(" → ")}</p><div className="rounded-xl bg-teal-50 p-3"><Badge>{t("teacher." + desk.signal)}</Badge><p className="mt-2 text-sm leading-6">{desk.signalReason[language]}</p><p className="mt-2 text-sm font-semibold leading-6">{t("teacher.suggested")}: {desk.suggestedAction[language]}</p></div><Button variant="secondary" onClick={() => setSelectedId(student.id)} className="w-full">{t("teacher.open")}</Button></Card>; })}</div>{students.length === 0 ? <Card><p>{t("teacher.none")}</p></Card> : null}</div><aside><TeacherModuleCreator /></aside></div>
    {!isDeviceStorageAvailable() ? <p role="status">{t("op.unsaved")}</p> : null}
    {selected ? <TeacherStudentDrawer key={selected.id} student={selected} onClose={() => setSelectedId(null)} /> : null}
  </div>;
}

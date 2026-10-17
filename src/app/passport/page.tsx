"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, Award, CheckCircle2, FilePlus2, ShieldCheck, X } from "lucide-react";
import { Badge, Button, Card, ConfidenceChip, DemoBadge, SectionTitle } from "@/components/ui";
import { EditableList, InlineField } from "@/components/passport-editors";
import { badges } from "@/data/badges";
import { useT } from "@/lib/i18n";
import { employerPreview, uniqueItems } from "@/lib/passport";
import { isDeviceStorageAvailable, useAppStore, type ComfortSettings } from "@/lib/store";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section aria-label={title}><Card className="space-y-4 rounded-2xl"><SectionTitle title={title} />{children}</Card></section>;
}

export default function PassportPage() {
  const t = useT();
  const state = useAppStore();
  const { profile, language } = state;
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(true);
  useEffect(() => { setReady(true); setSaved(isDeviceStorageAvailable()); }, [state]);

  const preview = employerPreview(profile);
  const signals = uniqueItems(state.gameResults.flatMap((result) => result.skillSignals)).filter((signal) => !profile.skills.includes(signal) && !state.dismissedSkillSignals.includes(signal));
  const earned = badges.filter((badge) => state.earnedBadges.includes(badge.id));
  const skillTag = (skill: string) => <Badge>{t(state.teacherVerifiedSkills.includes(skill) ? "passport.verified" : "passport.selfReported")}</Badge>;

  if (!ready) return <p role="status" className="p-4">{t("passport.loading")}</p>;

  return <div className="space-y-4 pb-4">
    <div className="space-y-2"><DemoBadge /><h1 className="text-2xl font-extrabold text-ink">{t("passport.title")}</h1><p className="text-sm leading-6 text-ink/80">{t("passport.intro")}</p></div>
    <p role="status" className={`flex items-center gap-2 rounded-xl p-3 text-sm font-semibold ${saved ? "bg-teal-50 text-teal-700" : "bg-sun/30 text-ink"}`}><CheckCircle2 size={18} className="shrink-0" aria-hidden="true" />{t(saved ? "passport.saved" : "passport.unsaved")}</p>

    <Card tone="hero" className="space-y-3 rounded-2xl">
      {(["name", "village", "district", "preferredLanguage"] as const).map((key) => <InlineField key={key} label={t(`passport.${key === "preferredLanguage" ? "language" : key}`)} value={profile[key]} onSave={(value) => state.updateProfile({ [key]: value, ...((key === "village" || key === "district") ? { constraints: { location: [key === "village" ? value : profile.village, key === "district" ? value : profile.district].filter(Boolean).join(", ") } } : {}) })} />)}
      <div className="grid grid-cols-2 gap-3 border-t border-teal-100 pt-3"><div><span className="text-2xl font-black">{state.points}</span><p className="text-sm">{t("passport.points")}</p></div><div><span className="text-2xl font-black">{state.earnedBadges.length}</span><p className="text-sm">{t("passport.badges")}</p></div></div>
      {!profile.name ? <Link className="inline-flex min-h-12 items-center text-sm font-bold text-teal-700 underline" href="/onboarding">{t("passport.emptyProfile")}</Link> : null}
    </Card>

    {(["interests", "skills", "goals"] as const).map((key) => <Section key={key} title={t(`passport.${key}`)}>
      <EditableList label={t(`passport.${key}`)} items={profile[key]} onChange={(items) => state.updateProfile({ [key]: items })} tag={key === "skills" ? skillTag : undefined} />
      {key === "skills" && profile.skills.some((skill) => state.teacherVerifiedSkills.includes(skill)) ? <p className="text-xs leading-5 text-ink/75">{t("passport.verificationNote")}</p> : null}
      {key === "skills" && signals.length > 0 ? <div className="space-y-3 border-t border-teal-100 pt-3"><h3 className="font-bold">{t("passport.signals")}</h3><p className="text-sm leading-6">{t("passport.signalNote")}</p>{signals.map((signal) => <div key={signal} className="space-y-2 rounded-xl border border-teal-100 p-3"><p className="break-words font-semibold">{signal}</p><ConfidenceChip level={t("passport.hypothesis")} /><div className="flex flex-wrap gap-2"><Button type="button" onClick={() => state.updateProfile({ skills: uniqueItems([...profile.skills, signal]) })}>{t("passport.accept")}</Button><Button type="button" variant="quiet" onClick={() => state.dismissSkillSignal(signal)}>{t("passport.reject")}</Button></div></div>)}</div> : null}
    </Section>)}

    <Section title={t("passport.constraints")}>
      {(["budget", "transport", "device", "connectivity"] as const).map((key) => <InlineField key={key} label={t(`passport.${key}`)} value={profile.constraints[key]} onSave={(value) => state.updateProfile({ constraints: { [key]: value } })} />)}
    </Section>

    <Section title={t("passport.preferences")}>
      <p className="text-sm leading-6 text-ink/80">{t("passport.preferencesNote")}</p>
      {(Object.keys(state.comfortSettings) as (keyof ComfortSettings)[]).map((key) => <label key={key} className="block space-y-2"><span className="text-sm font-bold">{t(`passport.${key}`)}</span><select className="min-h-12 w-full rounded-xl border border-teal-100 bg-paper px-3 text-base" value={state.comfortSettings[key]} onChange={(event) => state.setComfortSetting(key, event.target.value as "accepted" | "rejected" | "pending")}><option value="pending">{t("passport.undecided")}</option><option value="accepted">{t("passport.accepted")}</option><option value="rejected">{t("passport.rejected")}</option></select></label>)}
      <h3 className="font-bold">{t("passport.customPreferences")}</h3><EditableList label={t("passport.customPreferences")} items={state.learningPreferences} onChange={state.setLearningPreferences} />
    </Section>

    <Section title={t("passport.evidence")}>
      <p className="text-sm leading-6 text-ink/80">{t("passport.uploadNote")}</p>
      <label className="relative flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-teal-700 p-3 font-bold text-teal-700 focus-within:outline focus-within:outline-2 focus-within:outline-teal-700"><FilePlus2 size={20} aria-hidden="true" />{t("passport.upload")}<input type="file" multiple aria-label={t("passport.upload")} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" onChange={(event) => {
        const items = Array.from(event.target.files ?? []).map((file, index) => ({ id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`, name: file.name.slice(0, 120), fileName: file.name, addedAt: new Date().toISOString(), status: "pending" as const }));
        state.addEvidence(items);
        event.target.value = "";
      }} /></label>
      {state.passportEvidence.length === 0 ? <p className="text-sm text-ink/75">{t("passport.empty")}</p> : <ul className="space-y-3">{state.passportEvidence.map((item) => <li key={item.id} className="space-y-2 rounded-xl border border-teal-100 p-3"><InlineField label={t("passport.evidenceName")} value={item.name} onSave={(name) => state.renameEvidence(item.id, name || item.fileName)} /><p className="break-all text-xs text-ink/75">{item.fileName}</p><div className="flex items-center justify-between gap-2"><Badge>{t("passport.pending")}</Badge><button type="button" className="grid min-h-12 min-w-12 place-items-center rounded-xl text-teal-700 hover:bg-teal-50" aria-label={`${t("passport.remove")}: ${item.name}`} onClick={() => state.removeEvidence(item.id)}><X size={18} aria-hidden="true" /></button></div></li>)}</ul>}
    </Section>

    <Section title={t("passport.rewards")}>
      <div className="flex items-center gap-2"><Award className="text-teal-700" aria-hidden="true" /><strong>{state.points} {t("passport.points")} · {state.earnedBadges.length} {t("passport.badges")}</strong></div>
      {earned.length ? <div className="flex flex-wrap gap-2">{earned.map((badge) => <Badge key={badge.id}>{badge.title[language]}</Badge>)}</div> : <p className="text-sm text-ink/75">{t("passport.noBadges")}</p>}
    </Section>

    <Section title={t("passport.share")}>
      <label className="flex min-h-12 cursor-pointer items-center justify-between gap-3 font-semibold"><span>{t("passport.share")}</span><input type="checkbox" role="switch" checked={state.shareWithTeacher} onChange={(event) => state.setShareWithTeacher(event.target.checked)} className="h-6 w-6 shrink-0 accent-teal-700" /></label><p className="text-sm leading-6 text-ink/80">{t("passport.shareNote")}</p>
    </Section>

    <Section title={t("passport.employer")}>
      <ShieldCheck size={24} className="text-teal-700" aria-hidden="true" /><p className="text-sm leading-6 text-ink/80">{t("passport.employerNote")}</p>
      <div className="space-y-4 rounded-xl bg-paper p-3"><p className="break-words text-lg font-extrabold">{preview.name || "—"}</p>{(["interests", "skills", "goals"] as const).map((key) => <div key={key} className="space-y-2"><h3 className="text-sm font-bold">{t(`passport.${key}`)}</h3>{preview[key].length ? <ul className="space-y-2">{preview[key].map((item, index) => <li key={`${index}-${item}`} className="space-y-1 break-words text-sm"><span className="block">{item}</span>{key === "skills" ? skillTag(item) : null}</li>)}</ul> : <p>—</p>}</div>)}</div>
    </Section>
    <Link href="/games" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 font-bold text-white">{t("passport.next")}<ArrowRight size={18} aria-hidden="true" /></Link>
  </div>;
}

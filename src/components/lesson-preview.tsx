"use client";

import { useEffect, useState } from "react";
import { Button, Card } from "@/components/ui";
import { ReadAloud } from "@/components/read-aloud";
import { useT } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

export function LessonPreview() {
  const t = useT();
  const settings = useAppStore((s) => s.comfortSettings);
  const audioFirst = useAppStore((s) => s.audioFirst);
  const language = useAppStore((s) => s.language);
  const [adapted, setAdapted] = useState(true);
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const chunked = adapted && settings.stepByStepTasks === "accepted";
  const alternative = adapted && settings.alternativeResponses === "accepted";
  const steps = [1, 2, 3, 4].map((n) => t(`comfort.lesson.step${n}`));
  const lesson = chunked ? steps[step] : steps.join(" ");
  useEffect(() => { setStep(0); setAnswer(""); setSubmitted(false); }, [chunked, language]);
  return <Card className="space-y-4" role="region" aria-label={t("comfort.preview")}>
    <h2 className="text-xl font-bold">{t("comfort.preview")}</h2><p className="text-sm">{t("comfort.previewNote")}</p>
    <div className="flex flex-wrap gap-2">{[false, true].map((value) => <Button key={String(value)} variant={adapted === value ? "primary" : "secondary"} aria-pressed={adapted === value} onClick={() => setAdapted(value)}>{t(value ? "comfort.after" : "comfort.before")}</Button>)}</div>
    <div className={`space-y-4 rounded-xl p-3 ${adapted ? "bg-teal-50" : "lesson-original bg-paper"}`}>
      <h3 className="font-bold">🌱 {t("comfort.lesson.title")}</h3>
      {adapted && audioFirst ? <ReadAloud text={lesson} /> : null}
      <p data-testid="lesson-text" className="leading-7">{lesson}</p>
      {!(adapted && audioFirst) ? <ReadAloud text={lesson} /> : null}
      {chunked ? <><p>{t("comfort.lesson.step")} {step + 1}/4</p><div className="flex flex-wrap gap-2"><Button variant="secondary" disabled={step === 0} onClick={() => setStep(step - 1)}>{t("comfort.back")}</Button><Button disabled={step === 3} onClick={() => setStep(step + 1)}>{t("comfort.next")}</Button></div></> : null}
      <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); if (answer.trim()) setSubmitted(true); }}>
        <p className="font-bold">{t("comfort.lesson.question")}</p>
        {alternative ? <div className="flex flex-wrap gap-2">{[["soil", "🪴"], ["water", "💧"], ["light", "☀️"]].map(([key, emoji]) => <Button type="button" variant="secondary" key={key} aria-pressed={answer === t(`comfort.lesson.${key}`)} onClick={() => { setAnswer(t(`comfort.lesson.${key}`)); setSubmitted(false); }}>{emoji} {t(`comfort.lesson.${key}`)}</Button>)}</div> : null}
        <label className="block space-y-2"><span>{t("comfort.lesson.answer")}</span><input value={answer} onChange={(e) => { setAnswer(e.target.value); setSubmitted(false); }} className="min-h-12 w-full rounded-lg border border-teal-700 bg-white px-3" /></label>
        <Button disabled={!answer.trim()} type="submit">{t("comfort.lesson.submit")}</Button>
        {submitted ? <p role="status">{t("comfort.lesson.thanks")}</p> : null}
      </form>
    </div>
  </Card>;
}

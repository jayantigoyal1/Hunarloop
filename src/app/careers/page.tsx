"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Compass, MapPin, Sparkles } from "lucide-react";
import { Badge, Button, Card, DemoBadge } from "@/components/ui";
import { careers, type Career } from "@/data/careers";
import { careerDetails, recommendCareers, type CareerRoute } from "@/lib/career-engine";
import { useT } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

export default function CareersPage() {
  const t = useT();
  const router = useRouter();
  const state = useAppStore();
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState<CareerRoute>("nearby");
  const [compared, setCompared] = useState<string[]>([]);
  useEffect(() => { const timeout = setTimeout(() => setLoading(false), 2000); return () => clearTimeout(timeout); }, []);
  const recommendations = recommendCareers(state.profile, route);
  const money = (career: Career) => `₹${career.incomeRange.min.toLocaleString("en-IN")}–₹${career.incomeRange.max.toLocaleString("en-IN")}`;
  const choose = (id: string) => { state.setChosenCareerId(id); router.push("/roadmap"); };
  const time = (career: Career) => state.language === "hi" ? careerDetails[career.id].timeHi : career.timeToFirstIncome;
  const selected = compared.map((id) => careers.find((career) => career.id === id)!).filter(Boolean);
  if (loading) return <Card className="my-8 space-y-5 text-center" role="status"><Sparkles className="mx-auto animate-pulse text-teal-700" size={36} aria-hidden="true" /><DemoBadge /><h1 className="text-xl font-bold">{t("paths.analysing")}</h1><p className="text-sm">{t("paths.mock")}</p></Card>;
  return <div className="space-y-5 pb-4">
    <Card tone="hero" className="space-y-3"><div className="flex items-center justify-between"><DemoBadge /><Compass size={28} aria-hidden="true" /></div><h1 className="text-3xl font-extrabold">{t("paths.title")}</h1><p>{t("paths.intro")}</p><p className="text-sm leading-6">{t("paths.mock")}</p></Card>
    <div role="tablist" aria-label={t("paths.routes")} className="grid grid-cols-3 gap-1 rounded-xl bg-teal-50 p-1">
      {(["nearby", "earn", "long"] as const).map((value, index, all) => <button key={value} id={`tab-${value}`} role="tab" aria-selected={route === value} aria-controls="career-results" tabIndex={route === value ? 0 : -1} onClick={() => setRoute(value)} onKeyDown={(event) => {
        const offset = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
        if (!offset && event.key !== "Home" && event.key !== "End") return;
        event.preventDefault();
        const next = event.key === "Home" ? all[0] : event.key === "End" ? all[2] : all[(index + offset + 3) % 3];
        setRoute(next); document.getElementById(`tab-${next}`)?.focus();
      }} className={`min-h-12 rounded-lg px-1 py-2 text-sm font-bold ${route === value ? "bg-teal-700 text-white" : "text-teal-700"}`}>{t(`paths.${value}`)}</button>)}
    </div>
    <Card className="space-y-3" role="region" aria-label={t("paths.compareTitle")}><h2 className="text-xl font-bold">{t("paths.compareTitle")} · {selected.length}/2</h2><p className="text-sm">{t("paths.compareHint")}</p>
      {selected.length ? <Button variant="quiet" onClick={() => setCompared([])}>{t("paths.clear")}</Button> : null}
      {selected.length === 2 ? <div className="grid grid-cols-2 gap-2" data-testid="career-comparison">{selected.map((career) => <section key={career.id} className="min-w-0 space-y-3 rounded-xl bg-teal-50 p-2 text-sm"><h3 className="break-words font-bold">{career.title[state.language]}</h3><p>{t(`category.${career.category}`)}</p><div><p className="font-bold">{t("paths.income")}</p><p>{money(career)}</p></div><p>{time(career)}</p><p>{careerDetails[career.id].distanceKm} {t("paths.distance")}</p><p className="text-xs">{t("paths.source")} {t("paths.sourceNote")}</p><Button className="w-full px-2 text-sm" onClick={() => choose(career.id)}>{t("paths.choose")}</Button></section>)}</div> : null}
    </Card>
    <div role="tabpanel" id="career-results" aria-labelledby={`tab-${route}`} className="space-y-4">
      {recommendations.map(({ career, interests, skills, localFit, budgetFit, score }) => <Card key={career.id} data-testid="career-card" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2"><Badge>{t(`category.${career.category}`)}</Badge><span className="text-sm font-extrabold text-teal-700">{score}% {t("paths.match")}</span></div>
        <h2 className="text-xl font-extrabold">{career.title[state.language]}</h2>
        <div className="space-y-2 rounded-xl bg-paper p-3 text-sm leading-6"><h3 className="font-bold">{t("paths.why")}</h3><p>{career.whyRecommended[state.language]}</p>
          {interests.length ? <p className="break-words"><strong>{t("paths.interests")}:</strong> {interests.join(", ")}</p> : null}
          {skills.length ? <p className="break-words"><strong>{t("paths.skills")}:</strong> {skills.join(", ")}</p> : null}
          {!interests.length && !skills.length ? <p>{t("paths.explore")}</p> : null}
          {localFit ? <p>{t("paths.localFit")}</p> : null}
          {budgetFit ? <p>{t("paths.budgetFit")}</p> : null}
          <p className="break-words"><strong>{t("paths.constraints")}:</strong> {[state.profile.constraints.budget, state.profile.constraints.transport, state.profile.constraints.device, state.profile.constraints.connectivity].filter(Boolean).join(" · ")}</p>
        </div>
        <dl className="space-y-3 text-sm"><div><dt className="font-bold">{t("paths.income")}</dt><dd className="text-xl font-extrabold text-teal-700">{money(career)}</dd><dd className="mt-1 text-xs leading-5">{t("paths.source")} {state.language === "en" ? career.incomeRange.source : t("paths.sourceNote")}</dd></div><div><dt className="font-bold">{t("paths.time")}</dt><dd>{time(career)}</dd></div><div><dt className="flex items-center gap-1 font-bold"><MapPin size={16} aria-hidden="true" />{t("paths.training")}</dt><dd>{career.nearbyTraining[state.language]}</dd><dd className="mt-1 text-xs">{careerDetails[career.id].distanceKm} {t("paths.distance")}</dd></div></dl>
        <div className="flex flex-wrap gap-2"><Button onClick={() => choose(career.id)}>{t("paths.choose")}</Button><Button variant="secondary" aria-pressed={compared.includes(career.id)} disabled={compared.length === 2 && !compared.includes(career.id)} onClick={() => setCompared((current) => current.includes(career.id) ? current.filter((id) => id !== career.id) : [...current, career.id].slice(0, 2))}>{t(compared.includes(career.id) ? "paths.remove" : "paths.compare")}</Button></div>
      </Card>)}
    </div><p className="text-sm leading-6">{t("paths.trainingNote")}</p>
  </div>;
}

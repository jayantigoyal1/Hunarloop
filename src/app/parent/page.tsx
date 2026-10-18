"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HeartHandshake } from "lucide-react";
import { Badge, Card, ConfidenceChip, DemoBadge } from "@/components/ui";
import { SummaryPlayer } from "@/components/summary-player";
import { opportunityCatalog } from "@/data/opportunity-catalog";
import { supportClusters } from "@/lib/comfort";
import { useT } from "@/lib/i18n";
import { buildParentSummary, familySources } from "@/lib/parent-summary";
import { useAppStore } from "@/lib/store";

export default function ParentPage() {
  const t = useT();
  const state = useAppStore();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const summary = useMemo(() => buildParentSummary(state.chosenCareerId, state.language), [state.chosenCareerId, state.language]);
  const audioSegments = useMemo(() => summary.map((item) => item.text), [summary]);
  if (!ready) return <p role="status">{t("passport.loading")}</p>;
  const hasSignals = supportClusters(state.gameResults).some((cluster) => cluster.ready);
  const scholarship = opportunityCatalog.find((item) => item.id === "nsp-school-scholarship")!;
  return <div className="space-y-5 pb-4">
    <Card tone="hero" className="space-y-3"><DemoBadge /><HeartHandshake size={30} className="text-teal-700" aria-hidden="true" /><h1 className="text-3xl font-extrabold">{t("parent.title")}</h1><p className="text-sm leading-6">{t("parent.intro")}</p></Card>
    <Card className="space-y-3"><h2 className="text-xl font-bold">{t("parent.listen")}</h2><SummaryPlayer segments={audioSegments} /></Card>
    <Card className="space-y-4"><h2 className="text-xl font-bold">{t("parent.transcript")}</h2>{summary.map(({ key, text }) => <section key={key} className="space-y-1 border-t border-teal-100 pt-3"><h3 className="font-bold">{t("parent." + key)}</h3><p className="text-sm leading-6">{text}</p></section>)}{!state.chosenCareerId ? <Link href="/careers" className="flex min-h-12 items-center font-bold text-teal-700 underline">{t("parent.choose")}</Link> : null}<p className="text-xs">{t("op.verified")} {scholarship.lastVerified.split(" ")[0]} · {t("op.notVerified")}</p><a href={familySources.scholarship} target="_blank" rel="noreferrer" className="flex min-h-12 items-center break-all font-bold text-teal-700 underline">{t("op.source")}: {familySources.scholarship}</a></Card>
    <Card className="space-y-3"><h2 className="text-xl font-bold">{t("parent.story")}</h2><Badge>{t("common.demo")}</Badge><h3 className="font-bold">{t("parent.storyName")}</h3><p className="text-sm leading-6">{t("parent.storyText")}</p></Card>
    <Card className="space-y-3"><h2 className="text-xl font-bold">{t("parent.guide")}</h2><ol className="list-decimal space-y-3 pl-5 text-sm leading-6">{[1, 2, 3, 4].map((number) => <li key={number}>{t("parent.guide" + number)}</li>)}</ol></Card>
    {hasSignals ? <><Card className="space-y-3"><h2 className="text-xl font-bold">{t("parent.strengths")}</h2><ConfidenceChip level={t("passport.hypothesis")} /><p className="text-sm leading-6">{t("parent.strengthsText")}</p><p className="text-sm leading-6">{t("parent.familyLed")}</p></Card><Card className="space-y-3"><Badge>{t("common.demo")}</Badge><h2 className="text-xl font-bold">{t("parent.centre")}</h2><h3 className="font-bold">{t("parent.centreName")}</h3><p className="text-sm leading-6">{t("parent.centreText")}</p><p className="text-xs">{t("parent.checked")}</p><a href={familySources.health} target="_blank" rel="noreferrer" className="flex min-h-12 items-center break-all text-sm font-bold text-teal-700 underline">{t("parent.reference")} ↗</a></Card></> : null}
    <Card className="space-y-3"><h2 className="text-xl font-bold">{t("parent.resources")}</h2>{(["School", "Career", "Family"] as const).map((kind) => <section key={kind} className="space-y-2 border-t border-teal-100 pt-3"><h3 className="font-bold">{t("parent.resource" + kind)}</h3><p className="text-sm leading-6">{t("parent.resource" + kind + "Text")}</p>{kind === "Career" ? <><p className="text-xs">{t("parent.checked")}</p><a href={familySources.career} target="_blank" rel="noreferrer" className="flex min-h-12 items-center break-all text-sm font-bold text-teal-700 underline">{t("parent.reference")} ↗</a></> : null}</section>)}</Card>
  </div>;
}

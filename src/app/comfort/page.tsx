"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Card, ConfidenceChip, DemoBadge } from "@/components/ui";
import { SessionProgress } from "@/components/game-session";
import { FocusTimer } from "@/components/focus-timer";
import { LessonPreview } from "@/components/lesson-preview";
import { accommodationIds, supportClusters } from "@/lib/comfort";
import { useT } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

export default function ComfortPage() {
  const t = useT();
  const state = useAppStore();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <p role="status">{t("passport.loading")}</p>;
  return <div className="space-y-5 pb-4">
    <DemoBadge /><h1 className="text-2xl font-extrabold">{t("comfort.title")}</h1><p>{t("comfort.intro")}</p>
    <Card className="space-y-3"><SessionProgress /><h2 className="text-xl font-bold">{t("comfort.signals")}</h2><p className="font-bold">{t("comfort.notMedical")}</p><p className="text-sm">{t("comfort.confidenceNote")}</p>
      {supportClusters(state.gameResults).map((cluster) => <section key={cluster.id} className="space-y-2 border-t border-teal-100 pt-3"><h3 className="font-bold">{t(`comfort.${cluster.id}`)}</h3><ConfidenceChip level={t(`comfort.${cluster.confidence}`).replace("{n}", String(cluster.sessions))} /><p className="text-sm leading-6">{t(cluster.ready || cluster.id === "sensory" ? `comfort.${cluster.id}.detail` : "comfort.wait")}</p></section>)}
    </Card>
    <h2 className="text-xl font-bold">{t("comfort.choices")}</h2><p className="text-sm">{t("comfort.choiceNote")}</p>
    {accommodationIds.map((id) => {
      const active = id === "audioInstructions" ? state.audioFirst : state.comfortSettings[id] === "accepted";
      return <Card key={id} role="region" aria-labelledby={`choice-${id}`} className="space-y-3"><h3 id={`choice-${id}`} className="text-lg font-bold">{t(`comfort.${id}`)}</h3><Badge>{t(active ? "comfort.on" : "comfort.off")}</Badge><p className="text-sm leading-6">{t(`comfort.${id}.detail`)}</p>
        <div className="flex flex-wrap gap-2">{(["accepted", "rejected", "pending"] as const).map((choice) => <Button key={choice} variant={state.comfortSettings[id] === choice ? "primary" : "secondary"} aria-pressed={state.comfortSettings[id] === choice} onClick={() => state.setComfortSetting(id, choice)}>{t(choice === "accepted" ? "passport.accept" : choice === "rejected" ? "passport.reject" : "comfort.later")}</Button>)}</div>
      </Card>;
    })}
    <LessonPreview /><FocusTimer />
    <Card className="space-y-3"><h2 className="text-xl font-bold">{t("comfort.adapts")}</h2><table className="w-full table-fixed text-left text-sm"><thead><tr><th scope="col" className="w-1/3 p-2">{t("comfort.area")}</th><th scope="col" className="p-2">{t("comfort.change")}</th></tr></thead><tbody>{["ui", "plan", "teacher", "careers", "opportunities", "parents"].map((area) => <tr key={area} className="border-t border-teal-100"><th scope="row" className="break-words p-2 align-top">{t(`comfort.${area}`)}</th><td className="break-words p-2 leading-6">{t(`comfort.${area}.detail`)}</td></tr>)}</tbody></table></Card>
    <Card className="space-y-3"><h2 className="text-xl font-bold">{t("comfort.safeguards")}</h2><ul className="list-disc space-y-3 pl-5">{["private", "employers", "rewards", "professionals"].map((key) => <li key={key}>{t(`comfort.${key}`)}</li>)}</ul></Card>
  </div>;
}

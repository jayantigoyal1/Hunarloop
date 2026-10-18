"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { circleDetails, matchedCircles } from "@/data/circle-activities";
import { Badge, Button, Card, DemoBadge } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

export default function CirclesPage() {
  const t = useT();
  const state = useAppStore();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <p role="status">{t("passport.loading")}</p>;
  return <div className="space-y-5 pb-4">
    <Card tone="hero" className="space-y-3"><DemoBadge /><Users size={30} className="text-teal-700" aria-hidden="true" /><h1 className="text-3xl font-extrabold">{t("circles.title")}</h1><p>{t("circles.intro")}</p><p className="text-sm leading-6">{t("circles.local")}</p></Card>
    {matchedCircles(state.profile.interests).map(({ circle, matches }) => {
      const detail = circleDetails[circle.id];
      const joined = state.joinedCircleIds.includes(circle.id);
      const reported = state.reportedShowcaseIds.includes(detail.showcase.id);
      return <Card key={circle.id} data-testid="circle-card" className="space-y-4">
        <div className="flex flex-wrap gap-2"><Badge>{t("circles.supervised")}</Badge><Badge>{t(matches.length ? "circles.matched" : "circles.explore")}</Badge></div>
        <h2 className="text-xl font-extrabold">{circle.name[state.language]}</h2><p className="text-sm leading-6">{circle.description[state.language]}</p>
        {matches.length ? <p className="text-sm"><strong>{t("circles.matched")}:</strong> {matches.join(", ")}</p> : null}
        <p className="text-sm">{detail.meeting[state.language]} · {circle.members} {t("circles.members")}</p>
        <Button aria-pressed={joined} onClick={() => state.toggleJoinedCircle(circle.id)}>{t(joined ? "circles.leave" : "circles.join")}</Button>
        <section className="space-y-2 rounded-xl bg-teal-50 p-3"><h3 className="font-bold">{t("circles.project")}: {detail.project[state.language]}</h3><ol className="list-decimal space-y-2 pl-5 text-sm leading-6">{detail.steps[state.language].map((step) => <li key={step}>{step}</li>)}</ol></section>
        <section className="space-y-2 border-t border-teal-100 pt-3"><h3 className="font-bold">{t("circles.feed")}</h3><p className="text-sm">{t("circles.privacy")}</p>{reported ? <div className="space-y-2 rounded-xl bg-paper p-3"><p role="status" className="text-sm">{t("circles.reported")}</p><Button variant="secondary" onClick={() => state.restoreShowcase(detail.showcase.id)}>{t("circles.restore")}</Button></div> : <div className="space-y-2 rounded-xl bg-paper p-3"><p className="font-bold">{detail.showcase.name[state.language]}</p><p className="text-sm">{detail.showcase.text[state.language]}</p><Button variant="secondary" onClick={() => state.reportShowcase(detail.showcase.id)}>{t("circles.report")}</Button></div>}</section>
      </Card>;
    })}
    <Link href="/parent" className="flex min-h-12 items-center justify-center rounded-xl bg-teal-700 px-3 font-bold text-white">{t("route.circles.action")}</Link>
  </div>;
}

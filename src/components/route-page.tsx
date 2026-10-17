"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n";
import { Card, ConfidenceChip, DemoBadge, SectionTitle } from "@/components/ui";

const routes = {
  onboarding: { next: "/passport", key: "onboarding" }, passport: { next: "/games", key: "passport" },
  games: { next: "/comfort", key: "games" }, comfort: { next: "/careers", key: "comfort" },
  careers: { next: "/roadmap", key: "careers" }, roadmap: { next: "/opportunities", key: "roadmap" },
  opportunities: { next: "/rewards", key: "opportunities" }, rewards: { next: "/circles", key: "rewards" },
  circles: { next: "/parent", key: "circles" }, parent: { next: "/teacher", key: "parent" }, teacher: { next: "/", key: "teacher" },
} as const;

export function RoutePage({ route }: { route: keyof typeof routes }) {
  const translate = useT();
  const config = routes[route];
  return (
    <div className="space-y-3 pb-3">
      <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-bold text-teal-700 hover:underline"><ArrowLeft size={18} aria-hidden="true" />{translate("common.back")}</Link>
      <div className="flex items-center justify-between gap-3"><SectionTitle title={translate(`route.${config.key}.title`)} /><DemoBadge /></div>
      <Card className="space-y-3">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-sun/30 text-ink"><Sparkles size={23} aria-hidden="true" /></div>
        <p className="text-sm leading-6 text-ink/85">{translate(`route.${config.key}.description`)}</p>
        {route === "passport" || route === "careers" ? <ConfidenceChip /> : null}
        <div className="border-t border-teal-100 pt-3"><p className="mb-2 text-sm font-bold text-ink">{translate("common.step")}</p><Link href={config.next} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700">{translate(`route.${config.key}.action`)}<ArrowRight size={17} aria-hidden="true" /></Link></div>
      </Card>
      <p className="px-1 text-sm leading-5 text-ink/70">{translate("common.support")}</p>
    </div>
  );
}
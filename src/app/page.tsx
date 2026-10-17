"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n";
import { demoProfile } from "@/data/demo";
import { Card, DemoBadge, ProgressBar, SectionTitle } from "@/components/ui";

export default function HomePage() {
  const translate = useT();
  return (
    <div className="space-y-3 pb-3">
      <Card tone="hero" className="relative overflow-hidden px-4 py-4 shadow-soft">
        <div className="relative space-y-2">
          <div className="flex items-center justify-between gap-2"><p className="text-[11px] font-extrabold uppercase tracking-wider text-teal-700">{translate("home.eyebrow")}</p><DemoBadge /></div>
          <div className="space-y-1"><h1 className="max-w-xs text-2xl font-black leading-tight">{translate("home.title")}</h1><p className="max-w-sm text-sm leading-5 text-ink/80">{translate("home.description")}</p></div>
          <Link href="/onboarding" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-600">{translate("home.start")}<ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </Card>
      <Card className="space-y-3">
        <div className="flex items-center justify-between gap-3"><SectionTitle title={translate("home.progress")} /><span className="text-sm font-bold text-teal-700">{translate("home.progressValue")}</span></div>
        <ProgressBar value={demoProfile.completion} label="" />
        <p className="text-sm leading-5 text-ink/75">{translate("home.tip")}</p>
      </Card>
    </div>
  );
}

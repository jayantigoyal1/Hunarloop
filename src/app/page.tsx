"use client";

import Link from "next/link";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n";
import { demoProfile } from "@/data/demo";
import { Card, DemoBadge, ProgressBar, SectionTitle } from "@/components/ui";

export default function HomePage() {
  const translate = useT();
  return (
    <div className="space-y-5 pb-5">
      <Card className="relative overflow-hidden border-0 bg-teal-600 px-5 py-6 text-white shadow-soft">
        <div className="absolute -right-6 -top-8 h-36 w-36 rounded-full border-[18px] border-white/10" aria-hidden="true" />
        <div className="relative space-y-5">
          <div className="flex items-center justify-between gap-2"><p className="text-xs font-extrabold uppercase tracking-wider text-teal-50">{translate("home.eyebrow")}</p><DemoBadge /></div>
          <div className="space-y-3"><h1 className="max-w-xs text-3xl font-black leading-tight">{translate("home.title")}</h1><p className="max-w-sm text-base leading-7 text-white/90">{translate("home.description")}</p></div>
          <Link href="/onboarding" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-sun px-5 py-3 text-base font-bold text-ink hover:bg-yellow-300">{translate("home.start")}<ArrowRight size={19} aria-hidden="true" /></Link>
        </div>
      </Card>
      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-3"><SectionTitle title={translate("home.progress")} /><span className="text-sm font-bold text-teal-700">{translate("home.progressValue")}</span></div>
        <ProgressBar value={demoProfile.completion} label="" />
        <p className="text-sm leading-6 text-ink/75">{translate("home.tip")}</p>
      </Card>
      <Link href="/passport" className="block"><Card className="flex min-h-20 items-center gap-4 transition-colors hover:border-teal-500"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-sun/30 text-ink"><Compass size={24} aria-hidden="true" /></span><span className="flex-1 text-base font-extrabold text-ink">{translate("home.passport")}</span><Sparkles size={18} className="text-teal-600" aria-hidden="true" /></Card></Link>
      <p className="pb-1 text-center text-xs text-ink/60">{translate("common.footer")}</p>
    </div>
  );
}

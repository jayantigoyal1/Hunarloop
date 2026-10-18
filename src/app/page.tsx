"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, DemoBadge } from "@/components/ui";
import { HomeDashboard } from "@/components/home-dashboard";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { useT } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

export default function WelcomePage() {
  const router = useRouter();
  const translate = useT();
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const loadDemoProfile = useAppStore((state) => state.loadDemoProfile);
  const onboardingDone = useAppStore((state) => state.onboardingDone);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <LoadingSkeleton label={translate("common.loading")} />;
  if (onboardingDone) return <HomeDashboard />;

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 pb-4 pt-2">
      <Card tone="hero" className="relative space-y-5 overflow-hidden p-6">
        <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-sun/25" aria-hidden="true" />
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-teal-700 text-xl font-black text-white" aria-hidden="true">ह</span>
            <div>
              <p className="text-xl font-black leading-tight text-ink">HunarLoop</p>
              <p className="text-xs font-semibold text-ink/80">{translate("home.eyebrow")}</p>
            </div>
          </div>
          <DemoBadge />
        </div>
        <div className="relative mx-auto grid h-40 w-52 place-items-center rounded-[45%] bg-white/70" aria-hidden="true"><BookOpen size={84} strokeWidth={1.35} className="text-teal-700" /><span className="absolute right-5 top-5 text-3xl text-sun">✦</span></div>
        <h1 className="relative text-3xl font-black leading-tight tracking-tight text-ink">{translate("welcome.tagline")}</h1>
        <p className="text-sm leading-5 text-ink/75">{translate("home.description")}</p>
      </Card>

      <section aria-labelledby="language-heading" className="space-y-2">
        <h2 id="language-heading" className="text-sm font-bold text-ink">{translate("welcome.chooseLanguage")}</h2>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setLanguage("en")} aria-pressed={language === "en"} className={`min-h-14 rounded-xl border px-4 py-3 text-base font-extrabold ${language === "en" ? "border-teal-700 bg-teal-100 text-teal-700" : "border-teal-100 bg-white text-ink hover:bg-teal-50"}`}>
            English
          </button>
          <button type="button" onClick={() => setLanguage("hi")} aria-pressed={language === "hi"} className={`min-h-14 rounded-xl border px-4 py-3 text-base font-extrabold ${language === "hi" ? "border-teal-700 bg-teal-100 text-teal-700" : "border-teal-100 bg-white text-ink hover:bg-teal-50"}`}>
            हिन्दी
          </button>
        </div>
      </section>

      <button type="button" onClick={() => router.push("/onboarding")} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-base font-extrabold text-white hover:bg-teal-600">
        {translate("welcome.start")}<ArrowRight size={19} aria-hidden="true" />
      </button>

      <button type="button" onClick={() => { loadDemoProfile(); router.push("/passport"); }} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm font-bold text-ink hover:bg-teal-50">
        <Sparkles size={17} aria-hidden="true" />{translate("welcome.demo")}
      </button>

    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card, DemoBadge } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

export default function WelcomePage() {
  const router = useRouter();
  const translate = useT();
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const loadDemoProfile = useAppStore((state) => state.loadDemoProfile);

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 pb-4 pt-2">
      <Card tone="hero" className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-teal-700 text-xl font-black text-white" aria-hidden="true">ह</span>
            <div>
              <p className="text-xl font-black leading-tight text-ink">HunarLoop</p>
              <p className="text-xs font-semibold text-ink/65">{translate("home.eyebrow")}</p>
            </div>
          </div>
          <DemoBadge />
        </div>
        <h1 className="text-2xl font-black leading-tight text-ink">{translate("welcome.tagline")}</h1>
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
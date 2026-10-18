"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { BriefcaseBusiness, Gift, House, IdCard, Settings2, Wifi, WifiOff } from "lucide-react";
import { useT } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { Badge } from "@/components/ui";
import { FocusTimer } from "@/components/focus-timer";
import { ReadAloud } from "@/components/read-aloud";
import { DemoGuide } from "@/components/demo-guide";
import { useConnection } from "@/lib/use-connection";

const studentTabs = [
  { href: "/", key: "nav.home", Icon: House },
  { href: "/passport", key: "nav.passport", Icon: IdCard },
  { href: "/careers", key: "nav.careers", Icon: BriefcaseBusiness },
  { href: "/opportunities", key: "nav.opportunities", Icon: Wifi },
  { href: "/rewards", key: "nav.rewards", Icon: Gift },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const translate = useT();
  const language = useAppStore((state) => state.language);
  const toggleLanguage = useAppStore((state) => state.toggleLanguage);
  const calmMode = useAppStore((state) => state.calmMode);
  const setCalmMode = useAppStore((state) => state.setCalmMode);
  const dyslexicFont = useAppStore((state) => state.dyslexicFont);
  const setDyslexicFont = useAppStore((state) => state.setDyslexicFont);
  const audioFirst = useAppStore((state) => state.audioFirst);
  const focusTimer = useAppStore((state) => state.comfortSettings.focusTimer === "accepted");
  const setAudioFirst = useAppStore((state) => state.setAudioFirst);
  const offlineMode = useAppStore((state) => state.offlineMode);
  const setOfflineMode = useAppStore((state) => state.setOfflineMode);
  const { available, online, simulated } = useConnection();
  const onboardingDone = useAppStore((state) => state.onboardingDone);
  const showTabs = !["/onboarding", "/parent", "/teacher"].includes(pathname) && (pathname !== "/" || onboardingDone);
  const roleLinks = [
    { href: "/passport", key: "role.student", active: pathname !== "/teacher" && pathname !== "/parent" },
    { href: "/teacher", key: "role.teacher", active: pathname === "/teacher" },
    { href: "/parent", key: "role.parent", active: pathname === "/parent" },
  ];

  useEffect(() => {
    if (available) return;
    const followCachedPage = (event: MouseEvent) => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
      const anchor = event.target.closest("a[href]");
      if (!anchor || anchor.hasAttribute("download") || anchor.getAttribute("target")) return;
      const url = new URL(anchor.getAttribute("href")!, location.href);
      if (url.origin !== location.origin) return;
      event.preventDefault();
      location.assign(url.href);
    };
    document.addEventListener("click", followCachedPage, true);
    return () => document.removeEventListener("click", followCachedPage, true);
  }, [available]);

  useEffect(() => {
    document.documentElement.lang = language === "hi" ? "hi" : "en";
  }, [language]);

  return (
    <div className="min-h-screen bg-paper">
      <div className={`mx-auto flex min-h-screen w-full flex-col bg-paper ${pathname === "/teacher" ? "max-w-6xl" : "max-w-md"}`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:flex focus:min-h-12 focus:items-center focus:rounded-xl focus:bg-white focus:px-4 focus:font-bold focus:text-teal-800">{translate("a11y.skip")}</a>
        <header className="sticky top-0 z-20 border-b border-teal-100 bg-paper/95 px-3 py-2 backdrop-blur">
          <div className="flex min-h-12 items-center justify-between gap-1.5">
            <Link href="/" className="flex min-h-12 items-center gap-1.5 rounded-lg text-ink" aria-label={`${translate("brand.name")} · ${translate("nav.home")}`}>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-600 text-sm font-black text-white">ह</span>
              <span className="text-base font-extrabold">{translate("brand.name")}</span>
            </Link>
            <div className="flex items-center gap-1.5">
              <Badge className={`max-w-24 gap-1 ${available ? "bg-teal-50" : "bg-coral/15 text-ink"}`}>
                {available ? <Wifi size={14} className="shrink-0" aria-hidden="true" /> : <WifiOff size={14} className="shrink-0" aria-hidden="true" />}<span className="truncate" role="status">{translate(!online ? "header.offline" : simulated ? "header.simulated" : "header.online")}</span>
              </Badge>
              <details className="group relative">
                <summary className="grid min-h-12 min-w-12 cursor-pointer list-none place-items-center rounded-lg text-teal-700 hover:bg-teal-50 [&::-webkit-details-marker]:hidden" aria-label={translate("header.settings")} title={translate("header.settings")}><Settings2 size={20} aria-hidden="true" /></summary>
                <div className="absolute right-0 top-12 z-30 w-64 space-y-1 rounded-xl border border-teal-100 bg-white p-3 shadow-soft">
                  {[
                    { key: "header.calm", checked: calmMode, change: setCalmMode },
                    { key: "header.font", checked: dyslexicFont, change: setDyslexicFont },
                    { key: "header.audio", checked: audioFirst, change: setAudioFirst },
                    { key: "header.offlineDemo", checked: offlineMode, change: setOfflineMode },
                  ].map(({ key, checked, change }) => <label key={key} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg px-2 text-sm font-semibold text-ink hover:bg-teal-50"><input type="checkbox" checked={checked} onChange={(event) => change(event.target.checked)} className="h-5 w-5 accent-teal-700" />{translate(key)}</label>)}
                </div>
              </details>
              <button type="button" onClick={toggleLanguage} className="min-h-12 min-w-12 rounded-lg border border-teal-100 bg-white px-2 text-sm font-extrabold text-ink" aria-label={language === "en" ? "हिन्दी में बदलें" : "Switch to English"}>{language === "en" ? "हिं" : "EN"}</button>
            </div>
          </div>
          <nav aria-label={translate("role.label")} className="mt-1 grid grid-cols-3 gap-1 border-t border-teal-100 pt-2">
            {roleLinks.map(({ href, key, active }) => <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex min-h-12 items-center justify-center rounded-xl px-2 text-center text-sm font-bold ${active ? "bg-teal-700 text-white" : "bg-white text-teal-800 hover:bg-teal-50"}`}>{translate(key)}</Link>)}
          </nav>
          {!available ? <p role="status" className="mt-2 rounded-lg bg-sun/25 p-2 text-xs leading-5 text-ink">{translate("header.offlineHelp")}</p> : null}
        </header>
        <main id="main-content" tabIndex={-1} className="flex-1 space-y-3 px-3 pb-5 pt-3">
          {focusTimer && pathname !== "/comfort" && !pathname.startsWith("/games") ? <FocusTimer compact /> : null}
          {audioFirst && !["/", "/onboarding", "/comfort", "/parent"].includes(pathname) && !pathname.startsWith("/games") ? <ReadAloud label={translate("comfort.readPage")} text={() => document.querySelector<HTMLElement>("[data-page-content]")?.innerText ?? ""} /> : null}
          <div key={pathname} data-page-content className="page-enter">{children}</div>
        </main>
        {!pathname.startsWith("/games") && pathname !== "/onboarding" ? <DemoGuide /> : null}
        {showTabs ? (
          <nav aria-label={translate("a11y.studentNav")} className="sticky bottom-0 z-20 border-t border-teal-100 bg-white/95 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur">
            <ul className="grid grid-cols-5 gap-0.5">
              {studentTabs.map(({ href, key, Icon }) => {
                const active = pathname === href;
                return <li key={href}><Link href={href} aria-current={active ? "page" : undefined} className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 text-center text-[10px] font-bold leading-tight ${active ? "bg-teal-50 text-teal-700" : "text-ink/70 hover:bg-paper"}`}><Icon size={17} aria-hidden="true" /><span>{translate(key)}</span></Link></li>;
              })}
            </ul>
          </nav>
        ) : null}
      </div>
    </div>
  );
}

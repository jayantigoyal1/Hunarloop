"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { BriefcaseBusiness, Gift, House, IdCard, Leaf, Wifi, WifiOff } from "lucide-react";
import { useT } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { Badge } from "@/components/ui";

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
  const [online, setOnline] = useState(true);
  const showTabs = pathname !== "/parent" && pathname !== "/teacher";

  useEffect(() => {
    const updateStatus = () => setOnline(navigator.onLine);
    updateStatus();
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "hi" ? "hi" : "en";
  }, [language]);

  return (
    <div className={`min-h-screen bg-paper ${calmMode ? "calm" : ""}`}>
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-paper">
        <header className="sticky top-0 z-20 border-b border-teal-100 bg-paper/95 px-4 pb-3 pt-4 backdrop-blur">
          <div className="flex min-h-12 items-center justify-between gap-2">
            <Link href="/" className="flex min-h-12 items-center gap-2 rounded-lg text-ink" aria-label="HunarLoop home">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-600 text-sm font-black text-white">ह</span>
              <span className="text-lg font-extrabold">{translate("brand.name")}</span>
            </Link>
            <div className="flex items-center gap-2">
              <Badge className={online ? "gap-1 bg-teal-50" : "gap-1 bg-coral/15 text-ink"}>
                {online ? <Wifi size={14} aria-hidden="true" /> : <WifiOff size={14} aria-hidden="true" />}{translate(online ? "header.online" : "header.offline")}
              </Badge>
              <button type="button" className="grid h-11 w-11 place-items-center rounded-xl text-teal-700 hover:bg-teal-50" aria-label={translate("header.calm")} aria-pressed={calmMode} onClick={() => setCalmMode(!calmMode)} title={translate("header.calm")}><Leaf size={20} aria-hidden="true" /></button>
              <button type="button" onClick={toggleLanguage} className="min-h-11 min-w-12 rounded-xl border border-teal-100 bg-white px-2 text-sm font-extrabold text-ink" aria-label={language === "en" ? "हिन्दी में बदलें" : "Switch to English"}>{language === "en" ? "हिं" : "EN"}</button>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 pb-8 pt-5">{children}</main>
        {showTabs ? (
          <nav aria-label="Student navigation" className="sticky bottom-0 z-20 border-t border-teal-100 bg-white/95 px-1 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
            <ul className="grid grid-cols-5 gap-1">
              {studentTabs.map(({ href, key, Icon }) => {
                const active = pathname === href;
                return <li key={href}><Link href={href} aria-current={active ? "page" : undefined} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-center text-[10px] font-bold leading-tight ${active ? "bg-teal-50 text-teal-700" : "text-ink/70 hover:bg-paper"}`}><Icon size={19} aria-hidden="true" /><span>{translate(key)}</span></Link></li>;
              })}
            </ul>
          </nav>
        ) : null}
      </div>
    </div>
  );
}
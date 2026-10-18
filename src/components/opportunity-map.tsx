"use client";

import { Badge, Card } from "@/components/ui";
import { opportunityCatalog, type OpportunityListing } from "@/data/opportunity-catalog";
import { mapPositions } from "@/lib/opportunity-engine";
import { useT } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

const positions = mapPositions(opportunityCatalog);
export function OpportunityMap({ items, offline, onOpen }: { items: OpportunityListing[]; offline: boolean; onOpen: (id: string) => void }) {
  const t = useT();
  const language = useAppStore((s) => s.language);
  const village = useAppStore((s) => s.profile.village);
  const downloads = useAppStore((s) => s.opportunityDownloads);
  const pin = (item: OpportunityListing) => {
    const number = opportunityCatalog.findIndex((candidate) => candidate.id === item.id) + 1;
    const label = language === "hi" ? item.nameHi : item.name;
    return { number, label, disabled: offline && !downloads[item.id] };
  };
  return <Card className="space-y-3" role="region" aria-label={t("op.map")}>
    <h2 className="text-xl font-bold">{t("op.map")}</h2><p className="text-sm leading-6">{t("op.mapNote")}</p>
    <p className="break-words text-center font-bold">{village || t("op.village")}</p>
    <div className="relative mx-auto aspect-square w-full max-w-80" data-testid="village-map">
      <svg viewBox="0 0 320 320" className="absolute inset-0 h-full w-full" aria-hidden="true"><rect width="320" height="320" rx="24" fill="#f0fdfa" />{[72, 104, 136].map((radius) => <circle key={radius} cx="160" cy="160" r={radius} stroke="#0f766e" strokeOpacity=".5" strokeDasharray="4 5" fill="none" />)}<circle cx="160" cy="160" r="28" fill="#0f766e" /><path d="M145 160l15-13 15 13v14h-10v-10h-10v10h-10z" fill="white" /></svg>
      {items.filter((item) => item.distanceKm > 0).map((item) => {
        const point = positions.find((position) => position.id === item.id)!;
        const { number, label, disabled } = pin(item);
        return <button key={item.id} type="button" disabled={disabled} onClick={() => onOpen(item.id)} aria-label={t("op.pin") + " " + number + ": " + label + " · " + item.distanceKm + " " + t("op.km") + (disabled ? " · " + t("op.needs") : "")} title={label} className="absolute grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-teal-700 text-sm font-extrabold text-white shadow-sm disabled:bg-slate-500" style={{ left: point.x / 3.2 + "%", top: point.y / 3.2 + "%" }}>{number}</button>;
      })}
    </div>
    <div className="flex flex-wrap justify-center gap-2">{["0–10", "10–25", "25–50"].map((band) => <Badge key={band}>{band} {t("op.km")}</Badge>)}</div>
    {items.some((item) => item.distanceKm === 0) ? <div className="space-y-2 border-t border-teal-100 pt-3"><h3 className="font-bold">{t("op.online")}</h3>{items.filter((item) => item.distanceKm === 0).map((item) => { const { number, label, disabled } = pin(item); return <button type="button" key={item.id} disabled={disabled} onClick={() => onOpen(item.id)} className="flex min-h-12 w-full items-center gap-2 rounded-xl border border-teal-100 p-3 text-left text-sm font-semibold text-teal-700 disabled:text-slate-600"><span>#{number}</span><span>{label}{disabled ? " · " + t("op.needs") : ""}</span></button>; })}</div> : null}
  </Card>;
}

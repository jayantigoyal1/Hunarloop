"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button, Card, DemoBadge } from "@/components/ui";
import { ApplicationDrawer } from "@/components/application-drawer";
import { OpportunityCard } from "@/components/opportunity-card";
import { OpportunityMap } from "@/components/opportunity-map";
import { opportunityCatalog } from "@/data/opportunity-catalog";
import { defaultOpportunityFilters, filterOpportunities, type OpportunityFilters } from "@/lib/opportunity-engine";
import { useT } from "@/lib/i18n";
import { isDeviceStorageAvailable, useAppStore } from "@/lib/store";

export default function OpportunitiesPage() {
  const t = useT();
  const state = useAppStore();
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(0);
  const [connected, setConnected] = useState(true);
  const [filters, setFilters] = useState<OpportunityFilters>(defaultOpportunityFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  useEffect(() => {
    setReady(true);
    setNow(Date.now());
    const connection = () => setConnected(navigator.onLine);
    connection();
    window.addEventListener("online", connection);
    window.addEventListener("offline", connection);
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => { clearInterval(interval); window.removeEventListener("online", connection); window.removeEventListener("offline", connection); };
  }, []);
  const offline = state.offlineMode || !connected;
  const listings = opportunityCatalog.map((item) => state.opportunityDownloads[item.id]?.listing ?? item);
  const filtered = filterOpportunities(listings, filters, state.savedOpportunityIds, now);
  const selected = listings.find((item) => item.id === selectedId);
  const open = (id: string) => { if (!offline || state.opportunityDownloads[id]) setSelectedId(id); };
  if (!ready) return <p role="status">{t("passport.loading")}</p>;
  return <div className="space-y-5 pb-4">
    <Card tone="hero" className="space-y-3"><DemoBadge /><h1 id="opportunities-title" tabIndex={-1} className="text-3xl font-extrabold">{t("op.title")}</h1><p>{t("op.intro")}</p><p className="text-sm leading-6">{t("op.demoNote")}</p></Card>
    {offline ? <p role="status" className="rounded-xl bg-sun/20 p-3 text-sm leading-6">{t("op.offlineNote")}</p> : null}
    {!isDeviceStorageAvailable() ? <p role="status">{t("op.unsaved")}</p> : null}
    <Card className="space-y-4"><h2 className="flex items-center gap-2 text-xl font-bold"><SlidersHorizontal size={22} aria-hidden="true" />{t("op.filters")}</h2>
      <label className="block space-y-2"><span className="font-bold">{t("op.type")}</span><select value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })} className="min-h-12 w-full rounded-xl border border-teal-700 bg-white px-3"><option value="all">{t("op.all")}</option>{[...new Set(opportunityCatalog.map((item) => item.type))].map((type) => <option key={type} value={type}>{t("op.type." + type)}</option>)}</select></label>
      <label className="block space-y-1"><span className="font-bold">{t("op.distance")}: {filters.distance} {t("op.km")}</span><input type="range" min={0} max={50} step={5} value={filters.distance} onChange={(event) => setFilters({ ...filters, distance: Number(event.target.value) })} aria-valuetext={filters.distance + " " + t("op.km")} className="min-h-12 w-full cursor-pointer accent-teal-700" /><span className="block text-xs">{t("op.onlineIncluded")}</span></label>
      <div className="space-y-1">{([{ key: "womenOnly", label: "op.womenOnly" }, { key: "soon", label: "op.soon" }, { key: "savedOnly", label: "op.savedOnly" }] as const).map(({ key, label }) => <label key={key} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg bg-paper px-3"><input type="checkbox" className="h-6 w-6 shrink-0 accent-teal-700" checked={filters[key]} onChange={(event) => setFilters({ ...filters, [key]: event.target.checked })} /><span className="text-sm font-semibold">{t(label)}</span></label>)}</div>
      <label className="block space-y-2"><span className="font-bold">{t("op.support")}</span><select value={filters.support} onChange={(event) => setFilters({ ...filters, support: event.target.value as OpportunityFilters["support"] })} className="min-h-12 w-full rounded-xl border border-teal-700 bg-white px-3">{(["all", "accommodations", "rights"] as const).map((value) => <option key={value} value={value}>{t(value === "all" ? "op.supportAll" : "op." + value)}</option>)}</select></label>
      <Button variant="quiet" onClick={() => setFilters(defaultOpportunityFilters)}>{t("op.clear")}</Button>
    </Card>
    <p role="status" className="font-bold">{filtered.length} {t("op.results")}</p>
    <OpportunityMap items={filtered} offline={offline} onOpen={open} />
    {filtered.length ? <div className="space-y-4">{filtered.map((item) => <OpportunityCard key={item.id} item={item} number={opportunityCatalog.findIndex((candidate) => candidate.id === item.id) + 1} now={now} offline={offline} download={state.opportunityDownloads[item.id]} onOpen={() => open(item.id)} />)}</div> : <Card><p>{t("op.empty")}</p></Card>}
    {selected ? <ApplicationDrawer key={selected.id} item={selected} offline={offline} now={now} onClose={() => setSelectedId(null)} /> : null}
  </div>;
}

"use client";

import { Bookmark, MapPin } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import type { OpportunityDownload, OpportunityListing } from "@/data/opportunity-catalog";
import { deadlineStatus } from "@/lib/opportunity-engine";
import { useT } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

export function OpportunityFacts({ item, now, offline, download }: { item: OpportunityListing; now: number; offline: boolean; download?: OpportunityDownload }) {
  const t = useT();
  const language = useAppStore((s) => s.language);
  const deadline = deadlineStatus(item.deadlineAt, now);
  const date = (value: string) => new Intl.DateTimeFormat(language === "hi" ? "hi-IN" : "en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }).format(new Date(value));
  return <div className="space-y-2 text-sm">
    <p className="flex items-center gap-1"><MapPin size={16} aria-hidden="true" />{item.distanceKm === 0 ? t("op.online") : item.distanceKm + " " + t("op.km")}</p>
    <p><strong>{t("op.deadline")}:</strong> {deadline.kind === "days" ? deadline.days + " " + t("op.days") : t("op." + deadline.kind)}{item.deadlineAt ? " · " + date(item.deadlineAt) : ""}</p>
    <Badge>{t("op.verified")} {item.lastVerified.split(" ")[0]}</Badge><p className="text-xs">{t("op.notVerified")}</p>
    {download ? <p className="rounded-lg bg-teal-50 p-2 font-semibold">{t("op.downloaded")} {date(download.updatedAt)}</p> : offline ? <p className="rounded-lg bg-sun/30 p-2 font-semibold">{t("op.needs")}</p> : null}
  </div>;
}

export function OpportunityCard({ item, number, now, offline, download, onOpen }: { item: OpportunityListing; number: number; now: number; offline: boolean; download?: OpportunityDownload; onOpen: () => void }) {
  const t = useT();
  const language = useAppStore((s) => s.language);
  return <Card data-testid="opportunity-card" className="space-y-3">
    <div className="flex flex-wrap items-center justify-between gap-2"><Badge>#{number} · {t("op.type." + item.type)}</Badge>{download ? <Bookmark size={20} aria-label={t("op.savedOnly")} /> : null}</div>
    <h2 className="text-xl font-extrabold">{language === "hi" ? item.nameHi : item.name}</h2><p className="text-sm">{language === "hi" ? item.providerHi : item.provider}</p>
    <OpportunityFacts item={item} now={now} offline={offline} download={download} />
    <div className="flex flex-wrap gap-2">{(language === "hi" ? item.tagsHi : item.tags).map((tag) => <Badge key={tag}>{tag}</Badge>)}{item.accommodations ? <Badge>{t("op.accommodations")}</Badge> : null}{item.rights ? <Badge>{t("op.rights")}</Badge> : null}</div>
    <Button className="w-full" disabled={offline && !download} onClick={onOpen}>{t(offline && !download ? "op.needs" : "op.open")}</Button>
    {offline ? <span className="block text-sm">{t("op.source")} · {t("op.needs")}</span> : <a href={item.officialUrl} target="_blank" rel="noreferrer" className="flex min-h-12 items-center font-bold text-teal-700 underline">{t("op.source")} ↗</a>}
  </Card>;
}

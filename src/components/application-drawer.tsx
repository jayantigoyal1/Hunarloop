"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Badge, Button, DemoBadge } from "@/components/ui";
import { OpportunityFacts } from "@/components/opportunity-card";
import type { OpportunityListing } from "@/data/opportunity-catalog";
import { deadlineStatus, eligibilityResult } from "@/lib/opportunity-engine";
import { useT } from "@/lib/i18n";
import { isDeviceStorageAvailable, useAppStore } from "@/lib/store";

export function ApplicationDrawer({ item, offline, now, onClose }: { item: OpportunityListing; offline: boolean; now: number; onClose: () => void }) {
  const t = useT();
  const state = useAppStore();
  const dialog = useRef<HTMLDialogElement>(null);
  const [toast, setToast] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const download = state.opportunityDownloads[item.id];
  const documents = state.opportunityDocuments[item.id] ?? [];
  const unavailable = offline && !download;
  useEffect(() => {
    const modal = dialog.current!;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal.showModal();
    return () => {
      clearTimeout(timeout.current);
      modal.close();
      document.body.style.overflow = previousOverflow;
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: true });
      else document.getElementById("opportunities-title")?.focus({ preventScroll: true });
    };
  }, []);
  return <dialog ref={dialog} onKeyDown={(event) => {
    if (event.key !== "Tab") return;
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter((element) => element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }} aria-labelledby="application-title" onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target !== event.currentTarget) return; const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); }} className="fixed inset-x-0 bottom-0 top-auto m-0 mx-auto h-[90dvh] max-h-[90dvh] w-full max-w-md rounded-t-3xl border-0 bg-paper p-0 text-ink shadow-xl backdrop:bg-black/50 open:flex open:flex-col">
    <header className="flex shrink-0 items-center justify-between gap-2 border-b border-teal-100 bg-white p-3"><h2 id="application-title" className="text-lg font-bold">{t("op.details")}</h2><button type="button" autoFocus onClick={onClose} aria-label={t("op.close")} className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-teal-100"><X aria-hidden="true" /></button></header>
    <div className="space-y-5 overflow-y-auto overscroll-contain p-4 pb-8">
      <DemoBadge /><h3 className="text-2xl font-extrabold">{state.language === "hi" ? item.nameHi : item.name}</h3><p>{state.language === "hi" ? item.providerHi : item.provider}</p>
      <OpportunityFacts item={item} now={now} offline={offline} download={download} />
      {unavailable ? <p role="status">{t("op.needs")}</p> : <>
        <section className="space-y-3"><h3 className="text-lg font-bold">{t("op.eligibility")}</h3><p className="rounded-xl bg-sun/20 p-3 text-sm leading-6">{t("op.applicant")}</p><ul className="space-y-3">{item.rules.map((rule) => {
          const result = eligibilityResult(rule);
          return <li key={rule} className="rounded-xl border border-teal-100 bg-white p-3"><p className="font-bold"><span aria-hidden="true">{result.status === "match" ? "✓" : "✗"}</span> {t("op." + rule)}</p><Badge>{t(result.status === "unknown" ? "op.unknownCheck" : "op." + result.status)}</Badge><p className="mt-2 text-sm leading-6">{t(result.reason)}</p></li>;
        })}</ul></section>
        <section className="space-y-3"><h3 className="text-lg font-bold">{t("op.documents")} · {documents.length}/{item.documents.length}</h3><p className="text-sm leading-6">{t("op.documentNote")}</p>{(state.language === "hi" ? item.documentsHi : item.documents).map((document, index) => <label key={index} className="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl bg-white p-3"><input type="checkbox" className="mt-1 h-6 w-6 shrink-0 accent-teal-700" checked={documents.includes("doc-" + index)} onChange={(event) => state.setOpportunityDocument(item.id, "doc-" + index, event.target.checked)} /><span className="text-sm leading-6">{document}</span></label>)}</section>
        {item.accommodations || item.rights ? <section className="space-y-2 rounded-xl bg-teal-50 p-3"><h3 className="font-bold">{t("op.support")}</h3><p className="text-sm leading-6">{t("op.supportNote")}</p></section> : null}
        <section className="space-y-2"><h3 className="text-lg font-bold">{t("op.next")}</h3><p className="text-sm leading-6">{t(deadlineStatus(item.deadlineAt, now).kind === "closed" ? "op.closedNext" : "op.nextText")}</p></section>
        <div className="flex flex-wrap gap-2"><Button onClick={() => { state.toggleSavedOpportunity(item.id); if (offline && download) onClose(); }}>{t(download ? "op.remove" : "op.save")}</Button><Button variant="secondary" onClick={() => { clearTimeout(timeout.current); setToast(true); timeout.current = setTimeout(() => setToast(false), 5000); }}>{t("op.sms")}</Button></div>
        {toast ? <p role="status" className="rounded-xl bg-teal-50 p-3 font-semibold">{t("op.smsToast")}</p> : null}
        {!isDeviceStorageAvailable() ? <p role="status">{t("op.unsaved")}</p> : null}
      </>}
      <footer className="space-y-2 border-t border-teal-100 pt-4"><h3 className="font-bold">{t("op.citation")}</h3><p className="text-sm leading-6">{t("op.sourceNote")}</p>{offline ? <><p className="break-all text-sm">{item.officialUrl}</p><p>{t("op.needs")}</p></> : <a className="flex min-h-12 items-center break-all text-sm font-bold text-teal-700 underline" href={item.officialUrl} target="_blank" rel="noreferrer">{item.officialUrl}</a>}</footer>
    </div>
  </dialog>;
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CircleHelp, X } from "lucide-react";
import { Button, DemoBadge } from "@/components/ui";
import { useT } from "@/lib/i18n";

const steps = [
  { title: "guide.oneTitle", description: "guide.one", href: "/onboarding" },
  { title: "guide.twoTitle", description: "guide.two", href: "/passport" },
  { title: "guide.threeTitle", description: "guide.three", href: "/games" },
  { title: "guide.fourTitle", description: "guide.four", href: "/careers" },
  { title: "guide.fiveTitle", description: "guide.five", href: "/opportunities" },
  { title: "guide.sixTitle", description: "guide.six", href: "/parent" },
] as const;

export function DemoGuide() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const modal = dialog.current;
    const returnFocus = trigger.current;
    if (!modal || !open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal.showModal();
    return () => { modal.close(); document.body.style.overflow = overflow; returnFocus?.focus({ preventScroll: true }); };
  }, [open]);
  const step = steps[index];
  return <>
    <button ref={trigger} type="button" onClick={() => { setIndex(0); setOpen(true); }} aria-label={t("guide.open")} title={t("guide.open")} className="fixed bottom-[4.75rem] right-3 z-30 flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full bg-teal-800 p-3 font-bold text-white shadow-lg focus-visible:outline focus-visible:outline-4 focus-visible:outline-coral sm:right-6 sm:px-4"><CircleHelp size={20} aria-hidden="true" /><span className="sr-only sm:not-sr-only">{t("guide.open")}</span></button>
    {open ? <dialog ref={dialog} aria-labelledby="guide-title" onCancel={(event) => { event.preventDefault(); setOpen(false); }} className="fixed inset-x-3 bottom-24 top-auto m-auto max-h-[75dvh] w-[calc(100%-1.5rem)] max-w-md overflow-y-auto rounded-3xl border-0 bg-white p-5 text-ink shadow-xl backdrop:bg-black/60">
      <div className="flex items-start justify-between gap-2"><div className="space-y-2"><DemoBadge /><h2 id="guide-title" className="text-2xl font-extrabold">{t("guide.title")}</h2></div><button autoFocus type="button" onClick={() => setOpen(false)} aria-label={t("guide.close")} className="grid min-h-12 min-w-12 place-items-center rounded-xl border border-teal-200"><X aria-hidden="true" /></button></div>
      <p className="mt-4 text-sm font-bold">{t("guide.step")} {index + 1} {t("guide.of")} 6</p><ol aria-label={t("guide.title")} className="mt-2 flex gap-2">{steps.map((item, number) => <li key={item.title} className={`h-2 flex-1 rounded-full ${number <= index ? "bg-teal-700" : "bg-teal-100"}`} aria-label={`${t("guide.step")} ${number + 1}${number === index ? " · " + t(item.title) : ""}`} />)}</ol>
      <div className="min-h-36 space-y-3 py-5"><h3 className="text-xl font-bold">{t(step.title)}</h3><p className="leading-7">{t(step.description)}</p></div>
      <Link href={step.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center justify-center rounded-xl bg-teal-700 px-4 font-bold text-white">{t("guide.visit")}: {t(step.title)}</Link>
      <div className="mt-4 grid grid-cols-2 gap-2"><Button variant="secondary" disabled={index === 0} onClick={() => setIndex((value) => Math.max(0, value - 1))}>{t("guide.back")}</Button><Button disabled={index === steps.length - 1} onClick={() => setIndex((value) => Math.min(steps.length - 1, value + 1))}>{t("guide.next")}</Button></div>
    </dialog> : null}
  </>;
}

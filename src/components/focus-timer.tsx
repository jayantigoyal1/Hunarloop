"use client";

import { useEffect, useState } from "react";
import { Button, Card } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

export function FocusTimer({ compact = false }: { compact?: boolean }) {
  const t = useT();
  const timer = useAppStore((s) => s.focusTimerState);
  const enabled = useAppStore((s) => s.comfortSettings.focusTimer === "accepted");
  const start = useAppStore((s) => s.startFocusTimer);
  const pause = useAppStore((s) => s.pauseFocusTimer);
  const reset = useAppStore((s) => s.resetFocusTimer);
  const finish = useAppStore((s) => s.finishFocusTimer);
  const [now, setNow] = useState(0);
  useEffect(() => {
    const tick = () => { setNow(Date.now()); finish(); };
    tick();
    if (timer.endsAt === null) return;
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [timer.endsAt, finish]);
  const seconds = Math.ceil(Math.max(0, timer.endsAt !== null && now ? timer.endsAt - now : timer.remainingMs) / 1000);
  return <Card role="region" aria-label={t("comfort.focusTimer")} className="space-y-3">
    <h2 className="font-bold">{t(compact ? "comfort.focusTimer" : "comfort.timerTitle")}</h2>
    <p role="timer" className="text-3xl font-bold tabular-nums">{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</p>
    <div className="flex flex-wrap gap-2"><Button disabled={!enabled} onClick={timer.endsAt !== null ? pause : start}>{t(timer.endsAt !== null ? "comfort.timerPause" : seconds > 0 && seconds < 600 ? "comfort.timerResume" : "comfort.timerStart")}</Button><Button variant="secondary" onClick={reset}>{t("comfort.timerReset")}</Button></div>
    {!enabled ? <p className="text-sm">{t("comfort.timerHint")}</p> : null}
    {seconds === 0 ? <p role="status">{t("comfort.timerDone")}</p> : null}
  </Card>;
}

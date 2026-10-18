"use client";

import { LoadingSkeleton } from "@/components/loading-skeleton";
import { useT } from "@/lib/i18n";

export default function LoadingPage() {
  const t = useT();
  return <div className="space-y-4"><LoadingSkeleton label={t("common.loading")} /><LoadingSkeleton label={t("common.loading")} /></div>;
}

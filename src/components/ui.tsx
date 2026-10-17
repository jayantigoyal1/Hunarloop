import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { useT } from "@/lib/i18n";
import { clamp } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "quiet" };
type CardProps = HTMLAttributes<HTMLDivElement> & { tone?: "default" | "hero" };

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const styles = {
    primary: "bg-teal-600 text-white hover:bg-teal-700",
    secondary: "border border-teal-700 text-teal-700 hover:bg-teal-50",
    quiet: "text-ink hover:bg-teal-50",
  };
  return <button className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-base font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`} {...props} />;
}

export function Card({ tone = "default", className = "", ...props }: CardProps) {
  const surface = tone === "hero" ? "border-teal-100 bg-teal-50 text-ink" : "border-teal-100 bg-white";
  return <div className={`rounded-card border p-4 shadow-soft ${surface} ${className}`} {...props} />;
}

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex min-h-6 items-center rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700 ${className}`}>{children}</span>;
}

export function DemoBadge() {
  const translate = useT();
  return <Badge className="bg-sun/30 text-ink">{translate("common.demo")}</Badge>;
}

export function ProgressBar({ value, max = 100, label }: { value: number; max?: number; label?: string }) {
  const percentage = max > 0 ? clamp((value / max) * 100, 0, 100) : 0;
  return (
    <div className="w-full">
      {label ? <div className="mb-2 text-sm font-semibold text-ink">{label}</div> : null}
      <div className="h-2 overflow-hidden rounded-full bg-teal-100" role="progressbar" aria-label={label || "Progress"} aria-valuemin={0} aria-valuemax={max} aria-valuenow={clamp(value, 0, max)}>
        <div className="h-full rounded-full bg-teal-600 transition-[width]" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

export function SectionTitle({ title, eyebrow }: { title: string; eyebrow?: string }) {
  return <div className="space-y-1">{eyebrow ? <p className="text-xs font-extrabold uppercase tracking-wide text-teal-700">{eyebrow}</p> : null}<h2 className="text-xl font-extrabold leading-tight text-ink">{title}</h2></div>;
}

export function ConfidenceChip({ level = "Growing" }: { level?: string }) {
  return <Badge className="bg-sun/30 text-ink">{level}</Badge>;
}
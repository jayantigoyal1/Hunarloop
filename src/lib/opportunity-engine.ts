import type { EligibilityRule, OpportunityListing } from "@/data/opportunity-catalog";
import { demoApplicant } from "@/data/opportunity-catalog";

export type OpportunityFilters = { type: string; distance: number; womenOnly: boolean; soon: boolean; support: "all" | "accommodations" | "rights"; savedOnly: boolean };
export const defaultOpportunityFilters: OpportunityFilters = { type: "all", distance: 50, womenOnly: false, soon: false, support: "all", savedOnly: false };

export function deadlineStatus(deadline: string | null, now: number): { kind: "unknown" | "closed" | "today" | "days"; days: number } {
  if (!deadline || !Number.isFinite(Date.parse(deadline))) return { kind: "unknown", days: 0 };
  const end = Date.parse(deadline);
  if (end < now) return { kind: "closed", days: 0 };
  const indiaOffset = 19800000;
  const days = Math.floor((end + indiaOffset) / 86400000) - Math.floor((now + indiaOffset) / 86400000);
  return { kind: days === 0 ? "today" : "days", days };
}

export function filterOpportunities(items: OpportunityListing[], filters: OpportunityFilters, savedIds: string[], now: number) {
  return items.filter((item) => {
    const deadline = deadlineStatus(item.deadlineAt, now);
    return (filters.type === "all" || item.type === filters.type) &&
      item.distanceKm <= filters.distance &&
      (!filters.womenOnly || item.womenOnly) &&
      (!filters.soon || (["today", "days"].includes(deadline.kind) && deadline.days <= 7)) &&
      (filters.support === "all" || item[filters.support]) &&
      (!filters.savedOnly || savedIds.includes(item.id));
  });
}

export function eligibilityResult(rule: EligibilityRule): { status: "match" | "no-match" | "unknown"; reason: string } {
  if (rule === "age14") return { status: demoApplicant.age >= 14 ? "match" : "no-match", reason: "op.age14Reason" };
  if (rule === "age18") return { status: demoApplicant.age >= 18 ? "match" : "no-match", reason: "op.age18Reason" };
  if (rule === "class") return { status: demoApplicant.classNumber >= 10 ? "match" : "no-match", reason: "op.classReason" };
  if (rule === "state") return { status: demoApplicant.state === "Rajasthan" ? "match" : "no-match", reason: "op.stateReason" };
  return { status: "unknown", reason: rule === "women" ? "op.womenReason" : "op.providerReason" };
}

// Schematic bands, not bearings or exact geography. Slots stay stable as filters change.
export function mapPositions(items: OpportunityListing[]) {
  const counts = [0, 0, 0];
  return items.filter((item) => item.distanceKm > 0).map((item) => {
    const band = item.distanceKm <= 10 ? 0 : item.distanceKm <= 25 ? 1 : 2;
    const slot = counts[band]++;
    const angle = ((band === 1 ? -30 : -90) + slot * 120) * Math.PI / 180;
    const radius = [72, 104, 136][band];
    return { id: item.id, x: 160 + Math.cos(angle) * radius, y: 160 + Math.sin(angle) * radius };
  });
}

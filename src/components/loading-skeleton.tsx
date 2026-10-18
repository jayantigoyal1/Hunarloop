export function LoadingSkeleton({ label = "Loading" }: { label?: string }) {
  return <div role="status" aria-label={label} className="space-y-4 rounded-card border border-teal-100 bg-white p-5 shadow-soft"><span className="sr-only">{label}</span><div aria-hidden="true" className="skeleton h-6 w-2/3 rounded-lg" /><div aria-hidden="true" className="skeleton h-3 w-full rounded-lg" /><div aria-hidden="true" className="skeleton h-3 w-5/6 rounded-lg" /><div aria-hidden="true" className="skeleton h-12 w-full rounded-xl" /></div>;
}

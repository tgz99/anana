import { ShieldCheck } from "lucide-react";

export function DistributorBadge({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--accent-blue)] bg-[var(--accent-blue)]/10 ${className}`}
    >
      <ShieldCheck className="w-4 h-4 text-[var(--accent-blue)]" aria-hidden />
      <span className="text-xs font-bold tracking-widest text-[var(--accent-blue)] uppercase">
        Distributor Resmi
      </span>
    </div>
  );
}

type SensorCardProps = {
  name: string;
  status: "online" | "offline";
  value?: string;
  location?: string;
};

export function SensorCard({ name, status, value, location }: SensorCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-background/90 p-6 shadow-sm dark:border-white/10">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{name}</h3>
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${status === "online" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}`}
        >
          {status === "online" ? "Aktif" : "Offline"}
        </span>
      </div>
      {value ? (
        <p className="mt-4 text-2xl font-semibold text-foreground">{value}</p>
      ) : null}
      {location ? (
        <p className="mt-2 text-sm text-foreground/70">Lokasi: {location}</p>
      ) : null}
    </div>
  );
}

/* Reusable stat card: shows a label, a big number, and a colored accent */
export default function StatCard({ label, value, colorClass, icon }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
      {/* Colored icon circle */}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${colorClass}`}
      >
        {icon}
      </div>

      {/* Text */}
      <div>
        <p className="text-3xl font-bold text-slate-800 leading-none">
          {value ?? "—"}
        </p>
        <p className="text-sm text-slate-500 mt-1 font-medium">{label}</p>
      </div>
    </div>
  );
}

/* Header: branding, live/offline dot, last-updated timestamp */
export default function Header({ isLive, lastUpdated , onReset}) {
  // Format the last-updated time as HH:MM:SS
  const timeStr = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString()
    : null;

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Left: branding */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">🧿</span>
        <div>
          <h1 className="text-xl font-bold text-slate-800 leading-tight tracking-tight">
            DrishtiShathi AI
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Smart Retail Shelf Monitor · Powered by AI Detection
          </p>
        </div>
      </div>

      {/* Right: last updated + live badge */}
      <div className="flex items-center gap-3">
        {timeStr && (
          <span className="text-xs text-slate-400 hidden sm:block">
            Last updated: <span className="font-semibold text-slate-600">{timeStr}</span>
          </span>
        )}

        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 border text-xs font-semibold
            ${isLive
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-600"
            }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full flex-shrink-0
              ${isLive ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`}
          />
          {isLive ? "Live" : "Backend Offline"}

          
        </div>
        <button
            onClick={onReset}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Reset Demo
          </button>
      </div>
    </header>
  );
}

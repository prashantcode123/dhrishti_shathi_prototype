import { useEffect, useRef, useState } from "react";
import { STATUS_COLORS, timeAgo } from "../utils/helpers";

/* Single shelf tile — highlights briefly when status just changed */
function ShelfTile({ shelf, isNew }) {
  return (
    <div
      className={`
        bg-white rounded-xl border shadow-sm p-4 flex flex-col gap-2
        ${STATUS_COLORS[shelf.status]?.border || "border-slate-200"}
        transition-all duration-700
        ${isNew ? "ring-2 ring-blue-400 ring-offset-1 scale-[1.03]" : ""}
      `}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">
          {shelf.shelfId}
        </span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full
            ${STATUS_COLORS[shelf.status]?.bg} ${STATUS_COLORS[shelf.status]?.text}`}
        >
          {STATUS_COLORS[shelf.status]?.emoji} {shelf.status.replace("_", " ")}
        </span>
      </div>

      <p className="text-sm font-semibold text-slate-700 truncate">
        {shelf.product || <span className="text-slate-400 italic">No product</span>}
      </p>

      {shelf.quantity != null && (
        <p className="text-xs text-slate-500">
          Qty: <span className="font-semibold text-slate-700">{shelf.quantity}</span>
        </p>
      )}

      <div className={`h-1 rounded-full mt-auto ${STATUS_COLORS[shelf.status]?.dot}`} />
    </div>
  );
}

/* ShelfGrid with per-tile change detection */
export default function ShelfGrid({ shelves }) {
  const prevRef = useRef({});                 // shelfId -> last status
  const [highlighted, setHighlighted] = useState({}); // shelfId -> true/false

  useEffect(() => {
    if (!shelves || shelves.length === 0) return;

    const changed = {};
    shelves.forEach((s) => {
      if (prevRef.current[s.shelfId] !== undefined &&
          prevRef.current[s.shelfId] !== s.status) {
        changed[s.shelfId] = true;
      }
      prevRef.current[s.shelfId] = s.status;
    });

    if (Object.keys(changed).length > 0) {
      setHighlighted(changed);
      // Remove highlight after 2 seconds
      setTimeout(() => setHighlighted({}), 2000);
    }
  }, [shelves]);

  if (!shelves || shelves.length === 0) {
    return (
      <div className="text-center text-slate-400 py-10 text-sm">
        No shelves found. Run{" "}
        <code className="bg-slate-100 px-1 rounded">npm run seed</code> in the backend.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {shelves.map((shelf) => (
        <ShelfTile
          key={shelf.shelfId}
          shelf={shelf}
          isNew={!!highlighted[shelf.shelfId]}
        />
      ))}
    </div>
  );
}

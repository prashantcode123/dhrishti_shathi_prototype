import { useEffect, useRef, useState } from "react";
import { STATUS_COLORS, timeAgo } from "../utils/helpers";

/* Single alert card — highlights briefly when it's brand new */
function AlertCard({ alert, isNew }) {
  const colors = STATUS_COLORS[alert.issueType] || STATUS_COLORS.EMPTY;

  return (
    <div
      className={`
        rounded-xl border p-4 flex flex-col gap-1.5
        ${colors.bg} ${colors.border}
        transition-all duration-700
        ${isNew ? "ring-2 ring-blue-400 ring-offset-1 scale-[1.01]" : ""}
      `}
    >
      <div className="flex items-center justify-between">
        <span className={`font-bold text-sm ${colors.text}`}>
          {colors.emoji} {alert.issueType.replace("_", " ")} SHELF
        </span>
        <span className="text-xs text-slate-500">{timeAgo(alert.createdAt)}</span>
      </div>

      <p className="text-sm text-slate-700">
        <span className="font-semibold">{alert.shelfId}</span>
        {alert.product && ` · ${alert.product}`}
      </p>

      {alert.issueType === "LOW_STOCK" && alert.quantity != null && (
        <p className="text-xs text-slate-600">
          Qty remaining: <span className="font-semibold">{alert.quantity}</span>
        </p>
      )}

      {alert.issueType === "MISPLACED" &&
        alert.expectedPosition &&
        alert.detectedPosition && (
          <p className="text-xs text-slate-600">
            Expected: <span className="font-semibold">{alert.expectedPosition}</span>
            {" · "}Found:{" "}
            <span className="font-semibold">{alert.detectedPosition}</span>
          </p>
        )}

      <p className="text-xs text-slate-500">
        Confidence: {(alert.confidence * 100).toFixed(0)}%
      </p>
    </div>
  );
}

/* AlertList with new-alert highlight tracking */
export default function AlertList({ alerts }) {
  const seenIds = useRef(new Set());
  const [highlighted, setHighlighted] = useState({});

  useEffect(() => {
    if (!alerts || alerts.length === 0) return;

    const newOnes = {};
    alerts.forEach((a) => {
      if (!seenIds.current.has(a._id)) {
        newOnes[a._id] = true;
        seenIds.current.add(a._id);
      }
    });

    if (Object.keys(newOnes).length > 0) {
      setHighlighted(newOnes);
      setTimeout(() => setHighlighted({}), 2000);
    }
  }, [alerts]);

  if (!alerts || alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
        <span className="text-4xl">✅</span>
        <p className="text-slate-500 font-medium text-sm">No active alerts</p>
        <p className="text-slate-400 text-xs">All shelves are in good condition.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {alerts.map((alert) => (
        <AlertCard
          key={alert._id}
          alert={alert}
          isNew={!!highlighted[alert._id]}
        />
      ))}
    </div>
  );
}

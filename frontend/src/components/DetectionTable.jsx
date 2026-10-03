import { STATUS_COLORS, timeAgo } from "../utils/helpers";

/* Badge for issue type cell */
function IssueBadge({ issueType }) {
  const colors = STATUS_COLORS[issueType] || STATUS_COLORS.NORMAL;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}
    >
      {colors.emoji} {issueType.replace("_", " ")}
    </span>
  );
}

/* Table of recent detection events */
export default function DetectionTable({ detections }) {
  if (!detections || detections.length === 0) {
    return (
      <div className="text-center text-slate-400 py-10 text-sm">
        No detections yet. Run the simulator: <code className="bg-slate-100 px-1 rounded">npm run sim:auto</code>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Shelf</th>
            <th className="px-4 py-3">Issue</th>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Confidence</th>
            <th className="px-4 py-3">Source</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {detections.map((d) => (
            <tr key={d._id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                {timeAgo(d.createdAt)}
              </td>
              <td className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">
                {d.shelfId}
              </td>
              <td className="px-4 py-3">
                <IssueBadge issueType={d.issueType} />
              </td>
              <td className="px-4 py-3 text-slate-700 max-w-[160px] truncate">
                {d.product}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {(d.confidence * 100).toFixed(0)}%
              </td>
              <td className="px-4 py-3 text-slate-500 text-xs">{d.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

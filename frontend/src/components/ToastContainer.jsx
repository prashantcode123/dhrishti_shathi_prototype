const BORDER = {
  EMPTY: "border-red-500",
  LOW_STOCK: "border-yellow-500",
  MISPLACED: "border-orange-500",
};

export default function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex w-80 flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-lg border-l-4 bg-white p-4 shadow-lg ${
            BORDER[t.issueType] || "border-gray-400"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-bold text-gray-900">{t.title}</p>
            <button
              onClick={() => onDismiss(t.id)}
              className="text-gray-400 hover:text-gray-700"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-700">
            {t.shelfId} · {t.product}
          </p>
          {t.detail && <p className="mt-1 text-xs text-gray-500">{t.detail}</p>}
        </div>
      ))}
    </div>
  );
}
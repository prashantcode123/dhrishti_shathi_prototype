import { useState } from "react";
import { sendDetection } from "../services/api.js";

// ── Predefined templates per issue type (used for extra details) ─────────────
const TEMPLATES = {
  EMPTY: [{}],
  LOW_STOCK: [{ quantity: 1 }, { quantity: 2 }, { quantity: 3 }],
  MISPLACED: [
    { expectedPosition: "ROW-2-COL-3", detectedPosition: "ROW-2-COL-5" },
    { expectedPosition: "ROW-1-COL-1", detectedPosition: "ROW-3-COL-2" },
    { expectedPosition: "ROW-2-COL-1", detectedPosition: "ROW-1-COL-4" },
  ],
  NORMAL: [{}],
};

// Fallback products if a shelf has no product saved
const FALLBACK_PRODUCTS = [
  "Coca Cola 500ml",
  "Lays Classic Salted",
  "Pepsi 500ml",
  "Parle-G Biscuits",
  "Maggi 2-Minute Noodles",
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const randomConfidence = () =>
  parseFloat((0.85 + Math.random() * 0.13).toFixed(2));

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Pick a real shelf of this shop.
// Problems go to a healthy shelf; NORMAL goes to a shelf that has a problem.
const pickShelf = (shelves, type) => {
  const list = shelves || [];
  if (list.length === 0) return null;

  const pool =
    type === "NORMAL"
      ? list.filter((s) => s.status !== "NORMAL")
      : list.filter((s) => s.status === "NORMAL");

  return pickRandom(pool.length > 0 ? pool : list);
};

// Build the detection event for a given shelf
const buildPayload = (shelf, issueType) => {
  const extra = pickRandom(TEMPLATES[issueType]);
  return {
    shelfId: shelf.shelfId,
    issueType,
    product: shelf.defaultProduct || shelf.product || pickRandom(FALLBACK_PRODUCTS),
    ...extra, // quantity or positions, when relevant
    confidence: randomConfidence(),
    source: "SIMULATOR",
  };
};

// ── Button config ────────────────────────────────────────────────────────────
const BUTTONS = [
  {
    issueType: "EMPTY",
    label: "Simulate Empty Shelf",
    emoji: "🔴",
    base: "bg-red-50 border-red-200 text-red-700 hover:bg-red-100",
    loading: "bg-red-100 border-red-300 text-red-500",
  },
  {
    issueType: "LOW_STOCK",
    label: "Simulate Low Stock",
    emoji: "🟡",
    base: "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100",
    loading: "bg-yellow-100 border-yellow-300 text-yellow-500",
  },
  {
    issueType: "MISPLACED",
    label: "Simulate Misplaced Product",
    emoji: "🟠",
    base: "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100",
    loading: "bg-orange-100 border-orange-300 text-orange-500",
  },
  {
    issueType: "NORMAL",
    label: "Simulate Normal",
    emoji: "🟢",
    base: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100",
    loading: "bg-green-100 border-green-300 text-green-500",
  },
];

// ── Component ────────────────────────────────────────────────────────────────
export default function SimulatorPanel({ shelves, onSent }) {
  const [loadingType, setLoadingType] = useState(null);
  const [flash, setFlash] = useState(null); // { type: "success"|"error", msg }

  const handleClick = async (issueType) => {
    if (loadingType) return; // prevent double-click while busy

    const shelf = pickShelf(shelves, issueType);
    if (!shelf) {
      setFlash({ type: "error", msg: "❌ Shelves are still loading. Try again in a moment." });
      setTimeout(() => setFlash(null), 5000);
      return;
    }

    const payload = buildPayload(shelf, issueType);
    setLoadingType(issueType);
    setFlash(null);

    try {
      await sendDetection(payload);
      setFlash({
        type: "success",
        msg: `✅ ${issueType.replace("_", " ")} event sent to ${payload.shelfId} (${payload.product})`,
      });
      if (onSent) onSent(); // tell Dashboard to refetch
    } catch (err) {
      setFlash({
        type: "error",
        msg: `❌ ${err.response?.data?.message || err.message}`,
      });
    } finally {
      setLoadingType(null);
      setTimeout(() => setFlash(null), 5000);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            🤖 AI Detection Simulator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Replaces the Edge AI (YOLO) layer in this prototype.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {BUTTONS.map(({ issueType, label, emoji, base, loading }) => {
          const isLoading = loadingType === issueType;
          return (
            <button
              key={issueType}
              onClick={() => handleClick(issueType)}
              disabled={!!loadingType}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold text-sm
                transition-all duration-150 cursor-pointer disabled:cursor-not-allowed
                ${isLoading ? loading : base}
              `}
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{emoji}</span>
              )}
              {isLoading ? "Sending..." : label}
            </button>
          );
        })}
      </div>

      {flash && (
        <p
          className={`mt-3 text-sm font-medium px-3 py-2 rounded-lg ${
            flash.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {flash.msg}
        </p>
      )}
    </div>
  );
}
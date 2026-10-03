import { useState } from "react";
import { sendDetection } from "../services/api.js";

// ── Predefined product templates per issue type ──────────────────────────────
const TEMPLATES = {
  EMPTY: [
    { product: "Coca Cola 500ml" },
    { product: "Amul Taaza Milk 1L" },
    { product: "Thums Up 750ml" },
    { product: "Frooti Mango 250ml" },
  ],
  LOW_STOCK: [
    { product: "Lays Classic Salted", quantity: 2 },
    { product: "Maggi 2-Minute Noodles", quantity: 3 },
    { product: "Britannia Good Day", quantity: 1 },
    { product: "Kurkure Masala Munch", quantity: 2 },
  ],
  MISPLACED: [
    { product: "Pepsi 500ml", expectedPosition: "ROW-2-COL-3", detectedPosition: "ROW-2-COL-5" },
    { product: "Tata Salt 1kg", expectedPosition: "ROW-1-COL-1", detectedPosition: "ROW-3-COL-2" },
    { product: "Haldiram Bhujia 400g", expectedPosition: "ROW-2-COL-1", detectedPosition: "ROW-1-COL-4" },
  ],
  NORMAL: [
    { product: "Parle-G Biscuits" },
    { product: "Amul Butter 500g" },
    { product: "Fortune Sunflower Oil 1L" },
    { product: "Aashirvaad Atta 5kg" },
  ],
};

// Helpers ─────────────────────────────────────────────────────────────────────
const randomShelf = () => {
  const n = Math.floor(Math.random() * 12) + 1;
  return `SHELF-${String(n).padStart(2, "0")}`;
};

const randomConfidence = () =>
  parseFloat((0.85 + Math.random() * 0.13).toFixed(2));

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const buildPayload = (issueType) => {
  const template = pickRandom(TEMPLATES[issueType]);
  return {
    shelfId: randomShelf(),
    issueType,
    product: template.product,
    quantity: template.quantity,
    expectedPosition: template.expectedPosition,
    detectedPosition: template.detectedPosition,
    confidence: randomConfidence(),
    source: "SIMULATOR",
  };
};

// Button config ───────────────────────────────────────────────────────────────
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

// ── Component ─────────────────────────────────────────────────────────────────
export default function SimulatorPanel({ onSent }) {
  // Track loading and result state per issueType
  const [loadingType, setLoadingType] = useState(null);
  const [flash, setFlash] = useState(null); // { type: "success"|"error", msg }

  const handleClick = async (issueType) => {
    if (loadingType) return; // prevent double-click while busy
    const payload = buildPayload(issueType);
    setLoadingType(issueType);
    setFlash(null);

    try {
      await sendDetection(payload);
      setFlash({
        type: "success",
        msg: `✅ ${issueType.replace("_", " ")} event sent to ${payload.shelfId} (${payload.product})`,
      });
      // Tell Dashboard to refetch all data
      if (onSent) onSent();
    } catch (err) {
      setFlash({
        type: "error",
        msg: `❌ Failed to send: ${err.message}`,
      });
    } finally {
      setLoadingType(null);
      // Auto-clear flash message after 5 seconds
      setTimeout(() => setFlash(null), 5000);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      {/* Header */}
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

      {/* Buttons */}
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
                // Spinner when this button is loading
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{emoji}</span>
              )}
              {isLoading ? "Sending..." : label}
            </button>
          );
        })}
      </div>

      {/* Success / Error flash message */}
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

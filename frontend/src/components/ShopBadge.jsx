export default function ShopBadge({ shop, onSwitch }) {
  const on = shop?.notifications?.emailEnabled;
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-2 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-gray-900">
          🏪 {shop?.shopName || localStorage.getItem("shopName") || "Shop"}
        </p>
        <p className="text-xs text-gray-500">
          {shop?.city ? `${shop.city} · ` : ""}
          {on ? "🔔 Popup alerts ON" : "🔕 Popup alerts OFF"}
        </p>
      </div>
      <button
        onClick={onSwitch}
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
      >
        Switch shop
      </button>
    </div>
  );
}
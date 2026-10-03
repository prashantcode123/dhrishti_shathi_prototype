import { useState } from "react";
import { updateNotifications } from "../services/api";

const TYPES = [
  { value: "EMPTY", label: "🔴 Empty shelf" },
  { value: "LOW_STOCK", label: "🟡 Low stock" },
  { value: "MISPLACED", label: "🟠 Misplaced product" },
];

export default function NotificationSettings({ shop, onChange }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!shop) return null;
  const { emailEnabled, alertTypes } = shop.notifications;

  const save = async (payload) => {
    setSaving(true);
    setError("");
    try {
      const res = await updateNotifications(shop._id, payload);
      onChange(res.data);
    } catch (e) {
      setError(e.response?.data?.message || "Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  const toggleType = (type) => {
    const next = alertTypes.includes(type)
      ? alertTypes.filter((t) => t !== type)
      : [...alertTypes, type];
    save({ alertTypes: next });
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Notification settings</h3>
        {saving && <span className="text-xs text-gray-400">Saving...</span>}
      </div>

      <label className="mt-3 flex items-center justify-between text-sm text-gray-800">
        Popup alerts
        <input
          type="checkbox"
          checked={emailEnabled}
          onChange={(e) => save({ emailEnabled: e.target.checked })}
        />
      </label>

      <div className="mt-3 space-y-2">
        {TYPES.map((t) => (
          <label key={t.value} className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={alertTypes.includes(t.value)}
              disabled={!emailEnabled}
              onChange={() => toggleType(t.value)}
            />
            {t.label}
          </label>
        ))}
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
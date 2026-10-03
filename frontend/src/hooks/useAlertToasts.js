import { useEffect, useRef, useState, useCallback } from "react";

const TITLES = {
    EMPTY: "🔴 EMPTY SHELF",
    LOW_STOCK: "🟡 LOW STOCK",
    MISPLACED: "🟠 MISPLACED PRODUCT",
};

// Short beep using the browser's built-in audio. No file needed.
const beep = () => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.value = 0.1;
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
        // Sound is optional; ignore any browser restriction
    }
};

// Extra detail line depending on the issue type
const describe = (alert) => {
    if (alert.issueType === "LOW_STOCK" && alert.quantity != null) {
        return `Only ${alert.quantity} left`;
    }
    if (alert.issueType === "MISPLACED" && alert.expectedPosition) {
        return `Expected ${alert.expectedPosition}, found ${alert.detectedPosition}`;
    }
    return "";
};

// Pass `undefined` while data is still loading. Pass the alerts array once loaded.
export default function useAlertToasts(alerts, prefs) {
    const [toasts, setToasts] = useState([]);
    const seenIds = useRef(new Set());
    const initialized = useRef(false);
    const prefsRef = useRef(prefs);
    prefsRef.current = prefs; // always holds the latest settings

    const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

    useEffect(() => {
        if (!Array.isArray(alerts)) return; // not loaded yet

        // First real load: remember existing alerts, but don't show popups for them
        if (!initialized.current) {
            alerts.forEach((a) => seenIds.current.add(a._id));
            initialized.current = true;
            return;
        }

        const fresh = alerts.filter((a) => !seenIds.current.has(a._id));
        if (fresh.length === 0) return;

        // Mark everything as seen, even alerts the shop muted
        fresh.forEach((a) => seenIds.current.add(a._id));

        // Only show alert types this shop wants
        const { enabled = true, types } = prefsRef.current || {};
        const shown = enabled
            ? fresh.filter((a) => !types || types.includes(a.issueType))
            : [];
        if (shown.length === 0) return;

        const newToasts = shown.map((a) => ({
            id: a._id,
            issueType: a.issueType,
            title: TITLES[a.issueType] || a.issueType,
            shelfId: a.shelfId,
            product: a.product,
            detail: describe(a),
        }));

        setToasts((prev) => [...newToasts, ...prev].slice(0, 4)); // max 4 on screen
        beep();

        // Auto-hide after 6 seconds
        newToasts.forEach((t) => setTimeout(() => dismiss(t.id), 6000));
    }, [alerts, dismiss]);

    return { toasts, dismiss };
}
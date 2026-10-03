import { useCallback, useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import StatCard from "../components/StatCard.jsx";
import ShelfGrid from "../components/ShelfGrid.jsx";
import AlertList from "../components/AlertList.jsx";
import DetectionTable from "../components/DetectionTable.jsx";
import SimulatorPanel from "../components/SimulatorPanel.jsx";
import useAlertToasts from "../hooks/useAlertToasts";
import ToastContainer from "../components/ToastContainer";
import { usePolling } from "../hooks/usePolling.js";
import { useNavigate } from "react-router-dom";
import { getShop } from "../services/api";
import ShopBadge from "../components/ShopBadge";
import NotificationSettings from "../components/NotificationSettings";
import {
  getStats,
  getShelves,
  getAlerts,
  getDetections,
  resetDemo,
} from "../services/api.js";

/* ── Fetch all four endpoints in one Promise.all call ── */
const fetchAll = async () => {
  const [stats, shelves, alerts, detections] = await Promise.all([
    getStats(),
    getShelves(),
    getAlerts(),
    getDetections(20),
  ]);
  return { stats, shelves, alerts, detections };
};

/* Section wrapper */
function Section({ title, children }) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}

/* ── First-load spinner ── */
function Spinner() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-32">
      <div className="w-12 h-12 border-4 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
      <p className="text-slate-500 text-sm font-medium">
        Connecting to DrishtiShathi AI backend…
      </p>
    </div>
  );
}

export default function Dashboard() {

  const navigate = useNavigate();
  const [shop, setShop] = useState(null);

  const leaveShop = () => {
    localStorage.removeItem("shopId");
    localStorage.removeItem("shopName");
    navigate("/register");
  };

  // Load this shop's details; if the saved id is stale (e.g. after re-seeding), go back to register
  useEffect(() => {
    getShop(localStorage.getItem("shopId"))
      .then((res) => setShop(res.data))
      .catch((err) => {
        const s = err.response?.status;
        if (s === 404 || s === 400) leaveShop();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Track timestamp of the last successful fetch for the header
  const [lastUpdated, setLastUpdated] = useState(null);


  // Wrap fetchAll so we can capture the success timestamp
  const fetcher = useCallback(async () => {
    const result = await fetchAll();
    setLastUpdated(Date.now());
    return result;
  }, []);

  const { data, loading, error, refresh } = usePolling(fetcher, 3000);

  // Reset state for the Reset Demo button
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    const confirmed = window.confirm(
      "⚠️ Reset Demo?\n\nThis will delete all detections, all alerts, and set every shelf back to NORMAL.\n\nContinue?"
    );
    if (!confirmed) return;
    try {
      setResetting(true);
      await resetDemo();
      refresh(); // immediately re-fetch so UI reflects the clean state
    } catch (err) {
      alert("Reset failed: " + err.message);
    } finally {
      setResetting(false);
    }
  };

  // Unpack the combined result (null-safe defaults for first load)
  const stats = data?.stats || null;
  const shelves = data?.shelves || [];
  const alerts = data?.alerts || [];
  const detections = data?.detections || [];

  const isLive = !error && data !== null;

  const prefs = {
    enabled: shop?.notifications?.emailEnabled ?? true,
    types: shop?.notifications?.alertTypes,
  };
  const { toasts, dismiss } = useAlertToasts(alerts, prefs);

  // ── First-load state ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <Header isLive={false} lastUpdated={null} />
        <Spinner />
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      <Header isLive={isLive} lastUpdated={lastUpdated} onReset={handleReset} resetting={resetting} />
      <ShopBadge shop={shop} onSwitch={leaveShop} />
      {/* Backend offline banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3 text-sm text-red-700 flex items-center gap-2">
          <span className="text-lg">⚠️</span>
          <span>
            <span className="font-semibold">Backend offline</span> — {error}.
            Make sure{" "}
            <code className="bg-red-100 px-1 rounded">npm run dev</code> is
            running in{" "}
            <code className="bg-red-100 px-1 rounded">backend/</code>.
            Retrying every 3 s…
          </span>
        </div>
      )}

      <main className="flex-1 p-6 flex flex-col gap-6 max-w-screen-2xl mx-auto w-full">

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard
            label="Total Shelves"
            value={stats?.totalShelves}
            icon="🗄️"
            colorClass="bg-slate-100 text-slate-600"
          />
          <StatCard
            label="Empty Shelves"
            value={stats?.emptyShelves}
            icon="🔴"
            colorClass="bg-red-100 text-red-600"
          />
          <StatCard
            label="Low Stock"
            value={stats?.lowStockShelves}
            icon="🟡"
            colorClass="bg-yellow-100 text-yellow-600"
          />
          <StatCard
            label="Misplaced"
            value={stats?.misplacedShelves}
            icon="🟠"
            colorClass="bg-orange-100 text-orange-600"
          />
          <StatCard
            label="Active Alerts"
            value={stats?.activeAlerts}
            icon="🔔"
            colorClass="bg-purple-100 text-purple-600"
          />
          <NotificationSettings shop={shop} onChange={setShop} />
        </div>

        {/* ── SIMULATOR PANEL ── */}
        {/* onSent calls refresh() for an instant update without waiting for the next poll */}
        <SimulatorPanel shelves={shelves} onSent={refresh} alerts={alerts} />

        {/* ── SHELF GRID ── */}
        <Section title="📦 Shelf Status (All Shelves)">
          <ShelfGrid shelves={shelves} />
        </Section>

        {/* ── ALERTS + DETECTIONS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Section title={`🔔 Active Alerts (${alerts.length})`}>
            <AlertList alerts={alerts} />
          </Section>
          <Section title="🕵️ Recent Detections">
            <DetectionTable detections={detections} />
          </Section>
        </div>
      </main>

      <footer className="text-center text-xs text-slate-400 py-4 border-t border-slate-200">
        DrishtiShathi AI · Smart Retail Shelf Monitor · auto-refresh every 3 s
      </footer>
    </div>
  );
}

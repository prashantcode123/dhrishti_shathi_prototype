# 🛒 Smart Retail Shelf Monitor

An Edge-AI based system that watches retail shelves and turns detections into instant retailer alerts: **empty shelves, low stock, and misplaced products**.

> **Prototype note:** The AI layer (camera + YOLO) is simulated in this version. The simulator sends the exact same JSON that the real YOLO system will send later, so the backend and dashboard need no redesign.

## 🎯 Problem

Retail staff check shelves manually. Empty or misplaced products go unnoticed, causing lost sales and poor customer experience.

## 💡 Solution

Cameras monitor shelves, AI detects issues, and the retailer gets alerts on a live dashboard, with a popup the moment a problem appears.

## 🏗️ Architecture

```text
Prototype:
AI Simulator ──► Node.js + Express API ──► MongoDB Atlas ──► React Dashboard ──► Popup Alerts

Final system:
CCTV / IP Camera ─► RTSP ─► Edge AI (OpenCV + YOLO) ─► Shelf Analysis
                                   │
                                   ▼  same JSON, same endpoint
                          POST /api/detections
```

## ✨ Features

- Shop registration and login (JWT authentication, hashed passwords)
- Each shop sees only its own shelves, alerts, and history
- Live dashboard: stat cards, shelf status grid, active alerts, detection history
- Popup notifications for new alerts, with per-shop preferences (alert types on/off)
- Duplicate-alert protection and automatic resolve when a shelf returns to NORMAL
- AI Detection Simulator: dashboard buttons and a terminal script
- Reset Demo button (resets only the current shop)

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS, Axios, React Router |
| Backend | Node.js, Express, Mongoose, JWT, bcryptjs |
| Database | MongoDB Atlas |
| Future AI | Python, OpenCV, YOLO |

## 📁 Project Structure

```text
smart-retail-shelf-monitor/
├── backend/
│   └── src/
│       ├── config/        # database connection
│       ├── models/        # Shop, Shelf, Detection, Alert
│       ├── controllers/
│       ├── routes/
│       ├── services/      # detection logic, helpers
│       ├── middleware/    # auth, validation, error handling
│       ├── seed/          # demo shop + shelves
│       ├── simulator/     # terminal AI simulator
│       └── server.js
└── frontend/
    └── src/
        ├── components/    # StatCard, ShelfGrid, AlertList, SimulatorPanel, ...
        ├── pages/         # Login, RegisterShop, Dashboard
        ├── services/      # api.js (Axios)
        └── hooks/         # usePolling, useAlertToasts
```

## ⚙️ Setup

**Requirements:** Node.js 18+ and a MongoDB Atlas cluster.

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<long random string>
JWT_EXPIRES_IN=7d
DEVICE_API_KEY=<key used by the simulator / cameras>
```

Seed the demo shop and start the server:

```bash
npm run seed
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Open **http://localhost:5173**

### 3. Demo login

```text
Email:    demo@example.com
Password: demo1234
```

Or register your own shop from the Register page.

## 🔌 API

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/shops` | Public | Register a shop (returns a token) |
| POST | `/api/auth/login` | Public | Login (returns a token) |
| GET | `/api/auth/me` | Token | Current shop |
| GET | `/api/shops/:id` | Token | Shop details |
| PATCH | `/api/shops/:id/notifications` | Token | Update alert preferences |
| POST | `/api/detections` | Token **or** `x-api-key` | Receive a detection from the AI / simulator |
| GET | `/api/detections` | Token | Detection history |
| GET | `/api/shelves` | Token | Current shelf status |
| GET | `/api/alerts` | Token | Active alerts (`?status=ALL` for all) |
| GET | `/api/dashboard/stats` | Token | Dashboard numbers |
| POST | `/api/demo/reset` | Token | Reset the current shop's demo data |

Send the token as `Authorization: Bearer <token>`.

## 📦 Detection Format

The AI layer (simulator now, YOLO later) sends this JSON to `POST /api/detections`:

```json
{
  "shopId": "<shop id>",
  "shelfId": "SHELF-03",
  "issueType": "LOW_STOCK",
  "product": "Lays Classic",
  "quantity": 2,
  "confidence": 0.91,
  "source": "SIMULATOR"
}
```

| Field | Required | Notes |
|---|---|---|
| `shelfId` | Yes | e.g. `SHELF-01` |
| `issueType` | Yes | `EMPTY`, `LOW_STOCK`, `MISPLACED`, `NORMAL` |
| `product` | Yes | Product name |
| `confidence` | Yes | 0 to 1 |
| `quantity` | No | For `LOW_STOCK` |
| `expectedPosition`, `detectedPosition` | No | For `MISPLACED` |
| `shopId` | Devices only | Logged-in users get it from the token |
| `source` | No | `SIMULATOR`, `CAMERA-01`, etc. |

## 🤖 Using the Simulator

**Dashboard:** click *Simulate Empty Shelf / Low Stock / Misplaced Product / Normal*.

**Terminal** (from `backend/`, PowerShell):

```powershell
$env:SHOP_ID="<shop _id>"; $env:SHELF_COUNT="12"; npm run sim:empty
npm run sim:low
npm run sim:misplaced
npm run sim:normal
npm run sim:auto     # random event every 4 seconds, Ctrl+C to stop
```

## 🎬 Demo Flow (2 minutes)

1. Log in and show the dashboard, with all shelves normal.
2. Click **Simulate Empty Shelf**: the shelf turns red, the stat card updates, the alert appears, and a popup shows.
3. Click **Simulate Low Stock** and **Simulate Misplaced Product**.
4. Click **Simulate Normal**: the alert resolves automatically.
5. Open **Notification settings**, untick an alert type, and show that its popup stops.
6. Log out and log in as a second shop: its data is completely separate.

## 🚀 Future: YOLO / OpenCV Integration

A Python service will replace the simulator:

```text
Camera → RTSP → OpenCV frames → YOLO detection → Planogram comparison
       → issue classification → POST /api/detections (same JSON)
```

Planned improvements:

- Real camera integration (RTSP/NVR) on an edge device
- Planogram-based misplaced-product detection
- Real-time alerts via WebSockets
- Email, SMS, WhatsApp and mobile push notifications
- Multi-store management for retail chains
- Analytics: out-of-stock trends and restocking reports

## 🔒 Security Notes

- Passwords are hashed with bcrypt, and sessions use JWT.
- Secrets live in `.env`, which is excluded from Git.
- Cameras and simulators authenticate with an API key, not a user login.
- Change `JWT_SECRET` and `DEVICE_API_KEY` before any real deployment.

## 👥 Team

- Your Name: role
- Teammate: role

## 📄 License

Built for a hackathon prototype.
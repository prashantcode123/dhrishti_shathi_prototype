// Terminal AI Simulator for Smart Retail Shelf Monitor
// Simulates camera detection events from retail shelves and sends them to the backend API

const API_URL = process.env.API_URL || "http://localhost:5000/api/detections";

// Realistic Indian retail product presets by issue type
const PRODUCT_TEMPLATES = {
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
    {
      product: "Pepsi 500ml",
      expectedPosition: "ROW-2-COL-3",
      detectedPosition: "ROW-2-COL-5",
    },
    {
      product: "Tata Salt 1kg",
      expectedPosition: "ROW-1-COL-1",
      detectedPosition: "ROW-3-COL-2",
    },
    {
      product: "Haldiram Bhujia 400g",
      expectedPosition: "ROW-2-COL-1",
      detectedPosition: "ROW-1-COL-4",
    },
  ],
  NORMAL: [
    { product: "Parle-G Biscuits" },
    { product: "Amul Butter 500g" },
    { product: "Fortune Sunflower Oil 1L" },
    { product: "Aashirvaad Atta 5kg" },
  ],
};

// Generate a random shelf ID between SHELF-01 and SHELF-12
const getRandomShelf = () => {
  const shelfNum = Math.floor(Math.random() * 12) + 1;
  return `SHELF-${String(shelfNum).padStart(2, "0")}`;
};

// Generate confidence score between 0.85 and 0.98
const getRandomConfidence = () => {
  return parseFloat((0.85 + Math.random() * 0.13).toFixed(2));
};

// Build a detection event object
const generateEvent = (issueType) => {
  const templates = PRODUCT_TEMPLATES[issueType];
  const template = templates[Math.floor(Math.random() * templates.length)];

  return {
    shelfId: getRandomShelf(),
    issueType,
    product: template.product,
    quantity: template.quantity,
    expectedPosition: template.expectedPosition,
    detectedPosition: template.detectedPosition,
    confidence: getRandomConfidence(),
    source: "SIMULATOR",
  };
};

// Send an event payload to the backend API
const sendDetection = async (event) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });

    const statusText = response.status === 201 ? "SUCCESS (201 Created)" : `STATUS ${response.status}`;
    console.log(
      `[SIMULATOR] Sent ${event.issueType} on ${event.shelfId} (${event.product}) | Confidence: ${event.confidence} -> ${statusText}`
    );
  } catch (error) {
    console.error(`[SIMULATOR ERROR] Failed to send event to ${API_URL}: ${error.message}`);
    console.error("Make sure your backend server is running on port 5000 (npm run dev).");
  }
};

// Map CLI argument to valid issue type
const normalizeType = (arg) => {
  switch (arg?.toLowerCase()) {
    case "empty":
      return "EMPTY";
    case "low":
    case "low_stock":
      return "LOW_STOCK";
    case "misplaced":
      return "MISPLACED";
    case "normal":
      return "NORMAL";
    default:
      return null;
  }
};

// Main execution logic
const main = async () => {
  const arg = process.argv[2] || "random";
  const issueTypes = ["EMPTY", "LOW_STOCK", "MISPLACED", "NORMAL"];

  if (arg === "auto") {
    console.log("==================================================");
    console.log(" Starting Auto AI Simulator (every 4 seconds) ");
    console.log(" Press Ctrl+C to stop.");
    console.log("==================================================");

    const tick = async () => {
      const randomType = issueTypes[Math.floor(Math.random() * issueTypes.length)];
      const event = generateEvent(randomType);
      await sendDetection(event);
      const shopId = process.env.SHOP_ID;
      if (shopId) event.shopId = shopId;
    };

    await tick();
    setInterval(tick, 4000);
    return;
  }

  if (arg === "random") {
    const randomType = issueTypes[Math.floor(Math.random() * issueTypes.length)];
    const event = generateEvent(randomType);
    await sendDetection(event);
    return;
  }

  const issueType = normalizeType(arg);
  if (issueType) {
    const event = generateEvent(issueType);
    await sendDetection(event);
  } else {
    console.log("Usage: node src/simulator/simulate.js <empty|low|misplaced|normal|random|auto>");
    process.exit(1);
  }
};

main();

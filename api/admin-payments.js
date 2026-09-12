const { isAdminRequest } = require("./_admin-auth");
const { getFirestore } = require("./_firebase-admin");
const { requireMethod, sendJson } = require("./_http");

function serializeValue(value) {
  if (!value) return value;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(serializeValue);
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, serializeValue(nestedValue)])
    );
  }
  return value;
}

function formatAmount(amountMinor) {
  return Number((amountMinor || 0) / 100).toLocaleString("en-IN");
}

module.exports = async function handler(req, res) {
  if (!requireMethod(req, res, "GET")) return;

  if (!isAdminRequest(req)) {
    sendJson(res, 401, { error: "Admin login is required." });
    return;
  }

  try {
    const db = getFirestore();
    const snapshot = await db.collection("payments").orderBy("createdAtClient", "desc").limit(200).get();
    const payments = snapshot.docs.map((doc) => {
      const data = serializeValue(doc.data());
      return {
        ...data,
        id: doc.id,
        amount: formatAmount(data.amountMinor),
        receiptNumber: data.receiptNumber || doc.id,
        receiptDate: data.receiptDate || data.createdAtClient || data.createdAt || "Not recorded"
      };
    });

    sendJson(res, 200, { payments });
  } catch (error) {
    console.error("admin-payments failed:", error.stack || error.message);
    sendJson(res, 500, { error: error.message || "Could not load payments." });
  }
};

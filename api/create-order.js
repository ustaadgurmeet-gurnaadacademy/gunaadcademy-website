const { getFirestore } = require("./_firebase-admin");
const { readJson, requireMethod, sendJson } = require("./_http");

function sanitizeString(value, maxLength = 256) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function createReceiptNumber() {
  return `GA-${Date.now().toString().slice(-8)}`;
}

function amountToMinor(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be a positive number.");
  }
  return Math.round(amount * 100);
}

async function createRazorpayOrder({ amountMinor, receiptNumber, notes }) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay keys are not configured.");
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: amountMinor,
      currency: "INR",
      receipt: receiptNumber,
      notes
    })
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error?.description || "Razorpay order creation failed.");
  }

  return payload;
}

module.exports = async function handler(req, res) {
  if (!requireMethod(req, res, "POST")) return;

  try {
    const input = await readJson(req);
    const receiptNumber = createReceiptNumber();
    const amountMinor = amountToMinor(input.amount);
    const paymentRecord = {
      studentName: sanitizeString(input.studentName),
      phone: sanitizeString(input.phone, 32),
      email: sanitizeString(input.email, 320).toLowerCase(),
      studentId: sanitizeString(input.studentId, 64),
      learning: sanitizeString(input.learning),
      studentType: sanitizeString(input.studentType, 64),
      paymentFor: sanitizeString(input.paymentFor, 64),
      notes: sanitizeString(input.notes, 500),
      currency: "INR",
      amountMinor,
      receiptNumber,
      receiptDate: new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata"
      }).format(new Date()),
      paymentStatus: "ORDER_CREATED",
      paymentProvider: "RAZORPAY",
      createdAtClient: new Date().toISOString(),
      createdAt: new Date()
    };

    const order = await createRazorpayOrder({
      amountMinor,
      receiptNumber,
      notes: {
        receiptNumber,
        studentId: paymentRecord.studentId,
        paymentFor: paymentRecord.paymentFor
      }
    });

    const db = getFirestore();
    const docRef = await db.collection("payments").add({
      ...paymentRecord,
      razorpayOrderId: order.id,
      razorpayOrderStatus: order.status
    });

    sendJson(res, 200, {
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amountMinor,
      currency: "INR",
      firestoreId: docRef.id,
      receiptNumber,
      receiptDate: paymentRecord.receiptDate
    });
  } catch (error) {
    console.error("create-order failed:", error.message);
    sendJson(res, 400, { error: error.message || "Could not create Razorpay order." });
  }
};

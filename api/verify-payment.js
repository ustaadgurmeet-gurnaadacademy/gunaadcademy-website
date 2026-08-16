const crypto = require("crypto");
const { getFirestore } = require("./_firebase-admin");
const { readJson, requireMethod, sendJson } = require("./_http");

function timingSafeEqualHex(left, right) {
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function verifySignature({ orderId, paymentId, signature }) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) throw new Error("Razorpay key secret is not configured.");

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return timingSafeEqualHex(expected, signature);
}

module.exports = async function handler(req, res) {
  if (!requireMethod(req, res, "POST")) return;

  try {
    const input = await readJson(req);
    const firestoreId = String(input.firestoreId || "");
    const razorpayOrderId = String(input.razorpay_order_id || "");
    const razorpayPaymentId = String(input.razorpay_payment_id || "");
    const razorpaySignature = String(input.razorpay_signature || "");

    if (!firestoreId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw new Error("Missing payment verification fields.");
    }

    const db = getFirestore();
    const paymentRef = db.collection("payments").doc(firestoreId);
    const paymentSnap = await paymentRef.get();

    if (!paymentSnap.exists) throw new Error("Payment record was not found.");

    const payment = paymentSnap.data();
    if (payment.razorpayOrderId !== razorpayOrderId) {
      throw new Error("Razorpay order mismatch.");
    }

    const isValid = verifySignature({
      orderId: payment.razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature
    });

    if (!isValid) {
      await paymentRef.update({
        paymentStatus: "SIGNATURE_FAILED",
        razorpayPaymentId,
        razorpaySignature,
        verifiedAt: new Date()
      });
      throw new Error("Payment signature verification failed.");
    }

    await paymentRef.update({
      paymentStatus: "PAID",
      razorpayPaymentId,
      razorpaySignature,
      verifiedAt: new Date()
    });

    sendJson(res, 200, {
      ok: true,
      paymentStatus: "PAID",
      firestoreId,
      razorpayPaymentId
    });
  } catch (error) {
    console.error("verify-payment failed:", error.stack || error.message);
    sendJson(res, 400, { error: error.message || "Could not verify Razorpay payment." });
  }
};

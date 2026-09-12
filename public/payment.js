import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

const form = document.querySelector("#payment-form");
const receiptBox = document.querySelector("#receipt-box");
const receiptEmpty = document.querySelector("#receipt-empty");
const printReceiptButton = document.querySelector("#print-receipt");
const connectionStatus = document.querySelector("#connection-status");
const paymentStatus = document.querySelector("#payment-status");
const localPayments = [];

const firebaseConfig = window.GURNAAD_FIREBASE_CONFIG;
const hasFirebaseConfig = Boolean(firebaseConfig?.apiKey && !firebaseConfig.apiKey.startsWith("YOUR_"));
if (hasFirebaseConfig) initializeApp(firebaseConfig);
const FIRESTORE_TIMEOUT_MS = 12000;

if (hasFirebaseConfig) {
  connectionStatus.textContent = "Firebase ready";
  paymentStatus.textContent = "Ready for Razorpay test checkout. Payment verification happens on the server.";
} else {
  connectionStatus.textContent = "Local preview";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatAmount(value) {
  return Number(value || 0).toLocaleString("en-IN");
}

function parseAmountMinor(value) {
  return Math.round(Number(value || 0) * 100);
}

function formatReceiptDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function receiptLine(label, value) {
  return `<div class="receipt-line"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function renderReceipt(payment) {
  receiptEmpty.classList.add("is-hidden");
  printReceiptButton.classList.remove("is-hidden");
  receiptBox.classList.remove("is-hidden");
  receiptBox.innerHTML = `
    <div class="receipt-head">
      <img src="assets/brand/gurnaad-logo.png" alt="" />
      <div>
        <strong>Gurnaad Academy</strong>
        <span>Fee Payment Receipt</span>
      </div>
    </div>
    ${receiptLine("Receipt no.", payment.receiptNumber)}
    ${receiptLine("Date", payment.receiptDate)}
    ${receiptLine("Student", payment.studentName)}
    ${receiptLine("Student ID", payment.studentId)}
    ${receiptLine("Phone", payment.phone)}
    ${receiptLine("Email", payment.email)}
    ${receiptLine("Learning", payment.learning)}
    ${receiptLine("Student type", payment.studentType)}
    ${receiptLine("Payment for", payment.paymentFor)}
    ${receiptLine("Amount", `INR ${payment.amount}`)}
    ${payment.notes ? receiptLine("Notes", payment.notes) : ""}
    ${receiptLine("Status", payment.paymentStatus)}
  `;
}

function toPaymentRecord(formData) {
  return {
    studentName: formData.studentName.trim(),
    phone: formData.phone.trim(),
    email: formData.email.trim().toLowerCase(),
    studentId: formData.studentId.trim(),
    learning: formData.learning.trim(),
    studentType: formData.studentType,
    paymentFor: formData.paymentFor,
    notes: formData.notes.trim(),
    currency: "INR",
    amountMinor: parseAmountMinor(formData.amount),
    amount: formatAmount(formData.amount),
    receiptNumber: `GA-${Date.now().toString().slice(-8)}`,
    receiptDate: formatReceiptDate(),
    paymentStatus: "LOCAL_PREVIEW",
    paymentProvider: "RAZORPAY",
    createdAtClient: new Date().toISOString()
  };
}

function withTimeout(promise, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(() => reject(new Error(message)), FIRESTORE_TIMEOUT_MS);
    })
  ]);
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed: ${response.status}`);
  return data;
}

function openRazorpayCheckout({ order, record }) {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error("Razorpay checkout script is not loaded."));
      return;
    }

    const checkout = new window.Razorpay({
      key: order.keyId,
      amount: order.amountMinor,
      currency: order.currency,
      name: "Gurnaad Academy",
      description: record.paymentFor,
      order_id: order.orderId,
      prefill: {
        name: record.studentName,
        email: record.email,
        contact: record.phone
      },
      notes: {
        receiptNumber: order.receiptNumber,
        studentId: record.studentId
      },
      theme: { color: "#8d2f25" },
      handler: resolve,
      modal: {
        ondismiss() {
          reject(new Error("Payment checkout was closed before completion."));
        }
      }
    });

    checkout.open();
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const submitButton = form.querySelector("button[type='submit']");
  const record = toPaymentRecord(data);

  submitButton.disabled = true;
  submitButton.textContent = "Creating Razorpay order...";
  paymentStatus.textContent = "Creating Razorpay order...";

  try {
    if (!hasFirebaseConfig) {
      localPayments.unshift(record);
      renderReceipt(record);
      paymentStatus.textContent = "Local preview only. Add Firebase config and Vercel env vars for Razorpay.";
      form.reset();
      return;
    }

    const order = await withTimeout(
      postJson("/api/create-order", data),
      "Could not create Razorpay order. Check Vercel env vars and API route."
    );

    submitButton.textContent = "Opening Razorpay...";
    paymentStatus.textContent = "Opening Razorpay checkout...";
    const checkoutResult = await openRazorpayCheckout({ order, record });

    submitButton.textContent = "Verifying payment...";
    paymentStatus.textContent = "Verifying payment securely...";
    const verified = await withTimeout(
      postJson("/api/verify-payment", {
        firestoreId: order.firestoreId,
        razorpay_order_id: checkoutResult.razorpay_order_id,
        razorpay_payment_id: checkoutResult.razorpay_payment_id,
        razorpay_signature: checkoutResult.razorpay_signature
      }),
      "Payment verification did not respond."
    );

    const paidRecord = {
      ...record,
      receiptNumber: order.receiptNumber,
      receiptDate: order.receiptDate,
      paymentStatus: verified.paymentStatus,
      razorpayOrderId: order.orderId,
      razorpayPaymentId: verified.razorpayPaymentId
    };

    renderReceipt(paidRecord);
    paymentStatus.textContent = "Payment verified and receipt is ready.";
    form.reset();
  } catch (error) {
    console.error(error);
    paymentStatus.textContent = error.message || "Could not save payment details. Check Firebase config and Firestore rules.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Continue to Razorpay";
  }
});

printReceiptButton.addEventListener("click", () => {
  window.print();
});

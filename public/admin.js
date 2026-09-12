const loginView = document.querySelector("#login-view");
const dashboardView = document.querySelector("#dashboard-view");
const listView = document.querySelector("#payment-list-view");
const detailView = document.querySelector("#payment-detail-view");
const loginForm = document.querySelector("#admin-login-form");
const loginStatus = document.querySelector("#login-status");
const dashboardStatus = document.querySelector("#dashboard-status");
const paymentRows = document.querySelector("#admin-payment-rows");
const receiptContainer = document.querySelector("#admin-receipt");
const refreshButton = document.querySelector("#refresh-payments");
const logoutButton = document.querySelector("#logout-admin");
const backButton = document.querySelector("#back-to-list");
const printButton = document.querySelector("#print-admin-receipt");

let payments = [];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed: ${response.status}`);
  return data;
}

function showDashboard() {
  loginView.classList.add("is-hidden");
  dashboardView.classList.remove("is-hidden");
}

function showList() {
  detailView.classList.add("is-hidden");
  listView.classList.remove("is-hidden");
}

function showDetail() {
  listView.classList.add("is-hidden");
  detailView.classList.remove("is-hidden");
}

function renderRows() {
  paymentRows.innerHTML = payments.length
    ? payments.map((payment, index) => `
        <tr data-index="${index}" tabindex="0">
          <td>${index + 1}</td>
          <td>${escapeHtml(payment.studentName)}</td>
          <td>${escapeHtml(payment.studentId)}</td>
          <td>${escapeHtml(payment.paymentFor)}</td>
          <td>INR ${escapeHtml(payment.amount)}</td>
          <td><span class="status-badge ${payment.paymentStatus === "PAID" ? "is-paid" : ""}">${escapeHtml(payment.paymentStatus || "UNKNOWN")}</span></td>
          <td>${escapeHtml(formatDate(payment.createdAt || payment.createdAtClient || payment.receiptDate))}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="7">No payments found yet.</td></tr>`;
}

function receiptLine(label, value) {
  return `
    <div class="admin-receipt-line">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value || "Not provided")}</strong>
    </div>
  `;
}

function renderPaymentDetail(payment) {
  receiptContainer.innerHTML = `
    <div class="receipt-head">
      <img src="assets/brand/gurnaad-logo.png" alt="" />
      <div>
        <strong>Gurnaad Academy</strong>
        <span>Fee Payment Receipt</span>
      </div>
    </div>
    <div class="admin-receipt-grid">
      ${receiptLine("Receipt no.", payment.receiptNumber)}
      ${receiptLine("Date", formatDate(payment.createdAt || payment.createdAtClient || payment.receiptDate))}
      ${receiptLine("Student name", payment.studentName)}
      ${receiptLine("Student ID", payment.studentId)}
      ${receiptLine("Phone", payment.phone)}
      ${receiptLine("Email", payment.email)}
      ${receiptLine("Learning", payment.learning)}
      ${receiptLine("Student type", payment.studentType)}
      ${receiptLine("Payment for", payment.paymentFor)}
      ${receiptLine("Amount", `INR ${payment.amount}`)}
      ${receiptLine("Status", payment.paymentStatus)}
      ${receiptLine("Razorpay order", payment.razorpayOrderId)}
      ${receiptLine("Razorpay payment", payment.razorpayPaymentId)}
      ${receiptLine("Notes", payment.notes)}
    </div>
  `;
  showDetail();
}

async function loadPayments() {
  dashboardStatus.textContent = "Loading payment records...";
  const data = await requestJson("/api/admin-payments");
  payments = data.payments || [];
  renderRows();
  dashboardStatus.textContent = payments.length
    ? `Showing ${payments.length} latest payment record${payments.length === 1 ? "" : "s"}.`
    : "No payment records found yet.";
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = loginForm.querySelector("button[type='submit']");
  const payload = Object.fromEntries(new FormData(loginForm).entries());

  submitButton.disabled = true;
  submitButton.textContent = "Logging in...";
  loginStatus.textContent = "Checking admin login...";

  try {
    await requestJson("/api/admin-login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    showDashboard();
    await loadPayments();
  } catch (error) {
    loginStatus.textContent = error.message || "Could not log in.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Log in";
  }
});

paymentRows.addEventListener("click", (event) => {
  const row = event.target.closest("tr[data-index]");
  if (!row) return;
  renderPaymentDetail(payments[Number(row.dataset.index)]);
});

paymentRows.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  const row = event.target.closest("tr[data-index]");
  if (!row) return;
  renderPaymentDetail(payments[Number(row.dataset.index)]);
});

refreshButton.addEventListener("click", loadPayments);
backButton.addEventListener("click", showList);
printButton.addEventListener("click", () => window.print());

logoutButton.addEventListener("click", async () => {
  await requestJson("/api/admin-logout", { method: "POST" });
  window.location.reload();
});

loadPayments()
  .then(showDashboard)
  .catch(() => {
    loginView.classList.remove("is-hidden");
    dashboardView.classList.add("is-hidden");
  });

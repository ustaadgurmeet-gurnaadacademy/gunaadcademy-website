const crypto = require("crypto");

const ADMIN_EMAIL = "gurmeetragi64@gmail.com";
const COOKIE_NAME = "gurnaad_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function getSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.RAZORPAY_KEY_SECRET ||
    process.env.FIREBASE_PRIVATE_KEY ||
    "gurnaad-local-admin-session"
  );
}

function base64Url(value) {
  return Buffer.from(value).toString("base64url");
}

function sign(value) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function constantTimeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function createAdminToken() {
  const payload = base64Url(JSON.stringify({
    email: ADMIN_EMAIL,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  }));
  return `${payload}.${sign(payload)}`;
}

function parseCookies(req) {
  return String(req.headers.cookie || "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const [name, ...valueParts] = part.split("=");
      cookies[name] = decodeURIComponent(valueParts.join("="));
      return cookies;
    }, {});
}

function verifyAdminToken(token) {
  const [payload, signature] = String(token || "").split(".");
  if (!payload || !signature || !constantTimeEqual(sign(payload), signature)) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return data.email === ADMIN_EMAIL && Number(data.exp || 0) > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function isAdminRequest(req) {
  return verifyAdminToken(parseCookies(req)[COOKIE_NAME]);
}

function setAdminCookie(res, token) {
  const secure = process.env.VERCEL ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_SECONDS}${secure}`
  );
}

function clearAdminCookie(res) {
  const secure = process.env.VERCEL ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`
  );
}

function credentialsAreValid({ email, password }) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  return (
    String(email || "").trim().toLowerCase() === ADMIN_EMAIL &&
    Boolean(configuredPassword) &&
    String(password || "") === configuredPassword
  );
}

module.exports = {
  ADMIN_EMAIL,
  clearAdminCookie,
  createAdminToken,
  credentialsAreValid,
  isAdminRequest,
  setAdminCookie
};

const { createAdminToken, credentialsAreValid, setAdminCookie } = require("./_admin-auth");
const { readJson, requireMethod, sendJson } = require("./_http");

module.exports = async function handler(req, res) {
  if (!requireMethod(req, res, "POST")) return;

  try {
    const input = await readJson(req);

    if (!credentialsAreValid(input)) {
      sendJson(res, 401, { error: "Invalid admin email or password." });
      return;
    }

    setAdminCookie(res, createAdminToken());
    sendJson(res, 200, { ok: true });
  } catch (error) {
    console.error("admin-login failed:", error.message);
    sendJson(res, 400, { error: error.message || "Could not log in." });
  }
};

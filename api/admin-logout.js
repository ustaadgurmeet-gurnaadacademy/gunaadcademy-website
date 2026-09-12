const { clearAdminCookie } = require("./_admin-auth");
const { requireMethod, sendJson } = require("./_http");

module.exports = async function handler(req, res) {
  if (!requireMethod(req, res, "POST")) return;

  clearAdminCookie(res);
  sendJson(res, 200, { ok: true });
};

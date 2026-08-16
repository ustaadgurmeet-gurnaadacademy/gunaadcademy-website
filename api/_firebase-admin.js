const { cert, getApp, initializeApp } = require("firebase-admin/app");
const { getFirestore: getAdminFirestore } = require("firebase-admin/firestore");

function normalizePrivateKey(key) {
  if (!key) return key;

  const trimmed = key.trim();
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed === "string") return parsed.replace(/\\n/g, "\n");
    if (parsed?.private_key) return String(parsed.private_key).replace(/\\n/g, "\n");
  } catch {
    // Vercel manual entry normally stores this as plain text, not JSON.
  }

  return trimmed
    .replace(/^private_key\s*=\s*/i, "")
    .replace(/^"|"$/g, "")
    .replace(/\\n/g, "\n");
}

function getFirebaseAdminApp() {
  try {
    return getApp();
  } catch {
    // No Firebase Admin app has been initialized in this serverless instance yet.
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    return initializeApp({
      credential: cert({
        ...serviceAccount,
        private_key: normalizePrivateKey(serviceAccount.private_key)
      })
    });
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin credentials are not configured.");
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey
    })
  });
}

function getFirestore() {
  return getAdminFirestore(getFirebaseAdminApp());
}

module.exports = { getFirestore };

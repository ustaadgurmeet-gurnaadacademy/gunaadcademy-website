# Firebase Payment Portal Setup

The payment portal uses Firebase Web SDK browser modules and writes test records to:

```text
payments
```

## 1. Add Firebase Web Config

Create a Firebase project, add a Web app, then replace `public/firebase-config.js` with your real public Firebase config:

```js
window.GURNAAD_FIREBASE_CONFIG = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

Firebase web config is public client configuration, not a server secret. Do not place Razorpay secrets or email provider secrets in this file.

## 2. Test Firestore Rules

For local testing only, Firestore can allow writes and reads to `payments`.

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /payments/{paymentId} {
      allow create: if true;
      allow read: if true;
    }
  }
}
```

Before public launch, replace these rules with authenticated/admin-only read access and a server-verified payment write flow.

## 3. Stored Payment Shape

Each payment record stores:

- `studentName`
- `phone`
- `email`
- `studentId`
- `learning`
- `studentType`
- `paymentFor`
- `notes`
- `currency`
- `amountMinor`
- `receiptNumber`
- `receiptDate`
- `paymentStatus`
- `paymentProvider`
- `createdAtClient`
- `createdAt`

## 4. Next Production Steps

- Add Razorpay test keys to Vercel environment variables.
- Verify payment signatures server-side.
- Update the Firestore payment record to `PAID` only after verification.
- Send the receipt email from a server-side function using a no-reply provider.

## 5. Razorpay + Vercel Environment Variables

Add these in Vercel Project Settings -> Environment Variables:

```text
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
```

Alternative Firebase Admin setup:

```text
FIREBASE_SERVICE_ACCOUNT_JSON
```

Use either the three split Firebase Admin variables or the single JSON variable, not both.

Never put `RAZORPAY_KEY_SECRET`, `FIREBASE_PRIVATE_KEY`, or `FIREBASE_SERVICE_ACCOUNT_JSON` in `public/` files. Anything inside `public/` is visible in the browser.

## 6. Local Testing

After dependencies are installed:

```bash
npm run vercel:dev
```

The regular static preview server cannot run `/api/*` serverless routes. Razorpay must be tested through Vercel dev or a Vercel deployment.

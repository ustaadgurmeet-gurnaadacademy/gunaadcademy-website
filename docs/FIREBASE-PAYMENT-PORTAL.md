# Firebase Payment Portal Setup

The payment portal creates Razorpay orders through Vercel API routes and stores payment records in Firestore:

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

For early testing only, Firestore can allow public creates to `payments`. Admin reads are handled server-side through Firebase Admin credentials, so the public website does not need read access.

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /payments/{paymentId} {
      allow create: if true;
      allow read: if false;
    }
  }
}
```

Before public launch, move payment creation fully behind the server-verified payment flow and keep public reads denied.

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
ADMIN_PASSWORD
```

Alternative Firebase Admin setup:

```text
FIREBASE_SERVICE_ACCOUNT_JSON
```

Use either the three split Firebase Admin variables or the single JSON variable, not both.

`ADMIN_PASSWORD` is the password for `/admin`. Keep it in Vercel only; do not commit the real password to GitHub. Admin sessions use an HttpOnly cookie and expire after 7 days, or immediately when the admin clicks Log out.

Never put `RAZORPAY_KEY_SECRET`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_SERVICE_ACCOUNT_JSON`, or `ADMIN_PASSWORD` in `public/` files. Anything inside `public/` is visible in the browser.

## 6. Local Testing

After dependencies are installed:

```bash
npm run vercel:dev
```

The regular static preview server cannot run `/api/*` serverless routes. Razorpay must be tested through Vercel dev or a Vercel deployment.

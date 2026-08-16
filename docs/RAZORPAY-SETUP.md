# Razorpay Setup

## 1. Create Test Keys

In Razorpay Dashboard:

1. Switch to **Test Mode**.
2. Go to **Account & Settings**.
3. Open **API Keys**.
4. Generate keys.

You will get:

```text
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
```

The key ID is public enough to be sent to Checkout. The key secret must stay only in Vercel environment variables.

Do not paste `RAZORPAY_KEY_SECRET` into any file inside `public/`. Anything in `public/` can be opened from the browser or inspected online.

## 2. How The Flow Works

1. Student submits the payment form.
2. Browser calls `/api/create-order`.
3. Vercel creates a Razorpay order using `RAZORPAY_KEY_SECRET`.
4. Vercel stores an `ORDER_CREATED` payment record in Firestore.
5. Browser opens Razorpay Checkout with the returned order ID.
6. Razorpay returns payment ID, order ID, and signature to the browser.
7. Browser sends those fields to `/api/verify-payment`.
8. Vercel verifies HMAC-SHA256 using `RAZORPAY_KEY_SECRET`.
9. Vercel updates Firestore to `PAID`.
10. Browser shows the paid receipt.

This follows Razorpay's required server-side signature verification pattern.

## 3. Required Vercel Environment Variables

Add these in Vercel Project Settings -> Environment Variables for Preview and Production:

```text
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
```

For `FIREBASE_PRIVATE_KEY`, keep the full key including:

```text
-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----
```

If Vercel stores line breaks as `\n`, the API code converts them automatically.

You can also use one Firebase Admin JSON variable instead of the three split Firebase variables:

```text
FIREBASE_SERVICE_ACCOUNT_JSON
```

Use either `FIREBASE_SERVICE_ACCOUNT_JSON` or the three split Firebase variables. Do not use both.

## 4. Firestore Status Values

```text
ORDER_CREATED
PAID
SIGNATURE_FAILED
```

Only `PAID` should be treated as a completed payment.

## 5. Local And Vercel Testing

The static server can show the page, but it cannot run `/api/create-order` or `/api/verify-payment`.

Use Vercel for Razorpay testing:

```bash
npm run vercel:dev
```

or deploy a Vercel Preview and test from the preview URL.

## 6. Razorpay Test Payments

Use Razorpay Test Mode keys only while testing. Razorpay test mode simulates payments and does not deduct real money.

Useful test options from Razorpay's official docs:

- UPI success: `success@razorpay`
- UPI failure: `failure@razorpay`
- Cards: use Razorpay's test card list, any future expiry date, and any random CVV.

Keep Live Mode keys separate. When launch is ready, generate Live Mode keys in Razorpay and replace the Vercel environment variables.

## 7. Security Notes Before Launch

- `RAZORPAY_KEY_SECRET` stays only in Vercel environment variables.
- `FIREBASE_PRIVATE_KEY` or `FIREBASE_SERVICE_ACCOUNT_JSON` stays only in Vercel environment variables.
- `public/firebase-config.js` may contain Firebase Web config; it must not contain payment or admin secrets.
- Browser creates no `PAID` records directly. The server updates Firestore to `PAID` only after Razorpay signature verification.
- Current admin access uses the temporary code `1234`; replace it with proper Firebase Auth or server-side admin login before public launch.
- Current test Firestore rules allow reads for the admin table. Lock reads down before launch.

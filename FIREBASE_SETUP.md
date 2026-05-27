# Firebase Firestore Integration Setup

This guide walks you through enabling Firestore for users and orders in the Demo-POS app while keeping Vercel hosting on the free tier.

## Overview

The app now supports **optional** Firestore integration:
- **Users** are stored in Firestore collection `users` (globally)
- **Orders** are stored in Firestore collection `orders` (by branch)
- **Fall-back:** If Firestore is disabled or unreachable, the app uses `localStorage` (offline-first)
- **Cost:** Firebase has a generous free tier; Vercel hosting remains unaffected

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Create a new project** (or use an existing one)
3. Fill in the project details and continue
4. Enable Google Analytics if desired (optional)
5. Create the project and wait for completion

## Step 2: Set Up Firestore Database

1. In the Firebase Console, go to **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (or production mode if you set rules; see Step 4)
4. Select a region close to you (e.g., `us-central1`)
5. Click **Create** and wait for Firestore to initialize

## Step 3: Get Firebase Configuration

1. Go to **Project Settings** (gear icon → Project Settings)
2. Scroll to **Your apps** section
3. Click the **Web** icon (or create a web app if none exists)
4. Copy the Firebase config object — it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 4: Set Firestore Security Rules (Production)

In the Firebase Console, go to **Firestore Database** → **Rules** tab and replace with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Note:** For development/testing, you can use **test mode** (more permissive), but switch to strict rules before production.

## Step 5: Add Firebase Config to Your Environment

### Local Development (`.env` file)

Create or update `.env` in the project root:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_USE_FIRESTORE=true
```

### Vercel Deployment

1. Go to your Vercel project
2. **Settings** → **Environment Variables**
3. Add each variable above (copy from `.env` or Firebase Console)
4. Make sure `VITE_USE_FIRESTORE=true` is set
5. **Deploy** → redeploy the project

## Step 6: Test Locally

1. Run the development server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser
3. Create a user (Admin → Users → Add User)
4. Check the Firestore Console: you should see a new document in the `users` collection
5. Create an order (POS or Kitchen → create order)
6. Verify it appears in the `orders` collection in Firestore

## Cost Management (Free Tier)

### Firebase Free Tier Limits
- **Firestore:** 50K read ops, 20K write ops, 20K delete ops per day (free tier)
- **Storage:** 5 GB total (free tier)
- Generous for a small to medium restaurant POS

### How to Stay Within Free Tier
1. **Minimize reads:**
   - Load users/orders once on app startup and cache in `localStorage`
   - Only sync back to Firestore when explicitly saving (add/edit/delete)
2. **Avoid real-time listeners (`onSnapshot`):**
   - Current code uses one-time `getDocs()` queries, not listeners
   - If you add listeners later, be selective (avoid listening to entire collections)
3. **Batch operations where possible:**
   - Combine multiple updates before persisting
4. **Archive old data:**
   - Periodically export and delete old orders to keep collection size small

### Vercel Free Tier
- Vercel hosting is **not affected** by Firebase usage
- You can deploy on Vercel free tier even with Firestore enabled
- Firebase and Vercel billing are **independent**

## Disable Firestore (Revert to localStorage)

If you want to switch back to local-only storage (no Firebase):

1. Update `.env`:
   ```env
   VITE_USE_FIRESTORE=false
   ```
   (or remove the env var entirely; default is `false`)

2. Restart the dev server or redeploy

The app will automatically fall back to `localStorage` without any code changes.

## File Structure

New/modified files for Firestore:
- **New:** `src/lib/firestoreHelpers.js` — helper functions for Firestore CRUD
- **Modified:** `src/context/AppContext.jsx` — integrated Firestore reads/writes with localStorage fallback
- **Modified:** `src/firebase.js` — already had Firebase initialization (no changes needed)

## Firestore Collections Schema

### `users` Collection
```
{
  id: "1234567890",           // timestamp string, also used as Firestore doc ID
  name: "Ahmed",
  email: "cashier@pos.com",
  role: "cashier",            // admin, cashier, kitchen
  branch: "Main Branch"
}
```

### `orders` Collection
```
{
  id: "5678",                 // order ID
  branch: "Main Branch",
  items: [
    { id: 1, name: "...", price: 5.99, qty: 2 }
  ],
  baseTotal: 11.98,
  vatAmount: 1.68,
  total: 13.66,
  status: "pending",          // pending, preparing, ready, completed, cancelled
  timestamp: "5/27/2026, 10:30:00 AM"
}
```

## Troubleshooting

### Build Fails with "Cannot find module"
- Run `npm install` to install all dependencies
- Make sure `firebase` is in `package.json`

### Firestore not syncing
- Check browser console for errors
- Verify `VITE_USE_FIRESTORE=true` is set
- Confirm Firebase config in `.env` is correct
- Check Firestore rules allow writes (use test mode for dev)

### App still works without Firestore?
- Yes! The app falls back to `localStorage` automatically
- This is by design for offline-first, resilient behavior

### Too many Firestore reads/writes?
- Check browser console for `persistUserToFirestore` or `persistOrderToFirestore` errors
- Consider reducing the frequency of syncs or implementing request batching
- You can disable Firestore temporarily by setting `VITE_USE_FIRESTORE=false`

## Next Steps (Optional Enhancements)

1. **Implement authentication:** Use Firebase Auth so each user can only see their own data
2. **Real-time sync:** Add `onSnapshot` listeners for live order updates (careful with reads!)
3. **Data export:** Create reports that export Firestore data to CSV or PDF
4. **Backup strategy:** Set up scheduled exports of Firestore data (Firebase has built-in export tools)

## Questions?

Refer to [Firebase Documentation](https://firebase.google.com/docs) for more details.

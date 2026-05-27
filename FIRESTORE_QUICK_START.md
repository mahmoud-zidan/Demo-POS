# Firebase Firestore Setup for Demo-POS (ompos-93547)

Your Firebase config is now active in the project. Here's what to do next to fully enable Firestore.

## Current Status

✅ Firebase config added to `.env`  
✅ App code integrated with Firestore  
⚠️ Firestore writes failing due to missing security rules  

**Evidence:** When you created a user in the Admin panel, the app showed "User added successfully!" but the console logged: `Failed to persist user to Firestore: FirebaseError: Missing or insufficient permissions.`

This is **expected behavior** — the app falls back to `localStorage` automatically. Next step: allow Firestore writes via security rules.

## Step 1: Set Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project **ompos-93547**
3. Navigate to **Build** → **Firestore Database**
4. Click the **Rules** tab at the top
5. **Replace** all the text with the following rules:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read/write to users and orders (for development/test)
    // WARNING: This is permissive. For production, add authentication checks.
    match /users/{document=**} {
      allow read, write;
    }
    match /orders/{document=**} {
      allow read, write;
    }
    match /categories/{document=**} {
      allow read, write;
    }
    match /branches/{document=**} {
      allow read, write;
    }
    // Block all other collections by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

6. Click **Publish** to save the rules

**Important:** This rule set allows **anyone** to read/write. It's suitable for development/testing but not production. For production, add authentication:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 2: Test Locally

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser

3. Go to Admin → Users and create a new user

4. Check the browser console (F12 → Console tab):
   - **Good:** No Firestore errors
   - **Bad:** Still seeing "Failed to persist to Firestore" errors

5. Verify in Firebase Console:
   - Go to **Firestore Database** → **Collection Browser**
   - You should see a `users` collection with your new user document

## Step 3: Deploy to Vercel

1. Commit your changes:
   ```bash
   git add .
   git commit -m "Enable Firestore integration"
   ```

2. Push to GitHub:
   ```bash
   git push
   ```

3. Vercel auto-deploys, or manually trigger deployment

4. Your `.env` file **is not** committed (it's in `.gitignore`). Add the Firebase config to Vercel:
   - Go to your Vercel project → **Settings** → **Environment Variables**
   - Add the same variables from your local `.env`:
     ```
     VITE_FIREBASE_API_KEY
     VITE_FIREBASE_AUTH_DOMAIN
     VITE_FIREBASE_PROJECT_ID
     VITE_FIREBASE_STORAGE_BUCKET
     VITE_FIREBASE_MESSAGING_SENDER_ID
     VITE_FIREBASE_APP_ID
     VITE_USE_FIRESTORE=true
     ```
   - Redeploy the project (Redeploy button in Vercel)

## Step 4: Verify on Production

1. Open your Vercel live URL
2. Create a test user or order
3. Check Firestore Console — new documents should appear in `users` or `orders` collections
4. If you see Firestore errors in the browser console, verify:
   - All env vars are set correctly in Vercel
   - Firestore security rules are published
   - Your Firebase quota isn't exceeded

## How It Works Now

```
User creates/edits record in Admin UI
        ↓
App updates React state + localStorage instantly
        ↓
Background async task attempts Firestore persist
        ↓
If Firestore succeeds → data in both localStorage + Firestore ✓
If Firestore fails → data stays in localStorage only (app still works)
```

## Monitoring Firebase Usage

Your Firebase project free tier includes:
- **50K reads per day**
- **20K writes per day**
- **20K deletes per day**
- **1 GB storage**

To monitor usage:
1. Go to [Firebase Console](https://console.firebase.google.com/) → **ompos-93547**
2. Click **Usage** (bottom left sidebar)
3. View daily read/write/delete counts

For a small restaurant, typical daily usage:
- 1-2 reads at app startup
- 5-50 writes when creating/updating orders and users
- Well within free tier ✓

## Troubleshooting

**Q: Still seeing Firestore errors in browser console?**
- A: Give Firebase 1-2 minutes after publishing rules. Browser may cache old rules.
- Check that rules are actually published (click Publish button again).
- Try an incognito/private window to bypass browser cache.

**Q: Too many Firestore requests?**
- A: That's okay for development. Once deployed, consider:
  - Load users/orders once on app startup and cache (already done)
  - Avoid adding real-time listeners (`onSnapshot`) — current code uses one-time queries ✓
  - Batch writes where possible

**Q: Can I switch back to localStorage only?**
- A: Yes! Set `VITE_USE_FIRESTORE=false` and restart.

**Q: Data in Firestore but not showing in app?**
- A: Firestore is read-only source. If enabled, it loads on startup.
- Disable `VITE_USE_FIRESTORE=true` to use localStorage only.

## Next Steps (Optional)

1. **Add user authentication:** Use Firebase Auth so each user sees only their own data
2. **Real-time updates:** Add `onSnapshot` listeners for live order status (but watch read counts!)
3. **Backup strategy:** Set up automatic Firestore exports (Firebase has built-in tools)
4. **Data migration:** Script to move all existing localStorage data to Firestore

---

**Questions?** Refer to the main [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) guide or [Firestore Documentation](https://firebase.google.com/docs/firestore).

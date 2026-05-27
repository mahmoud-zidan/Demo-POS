# Firestore Migration Guide

This guide explains what happens when you enable Firestore for the first time with existing `localStorage` data.

## Scenario: You Have Existing Users/Orders in localStorage

If you've been using the Demo-POS app locally and have users and orders saved, here's what happens when you enable Firestore:

### Step 1: Enable Firestore
Set `VITE_USE_FIRESTORE=true` in your `.env` and restart the app.

### Step 2: First Load Behavior
When the app loads:
1. It tries to fetch users/orders from Firestore (empty, since you're starting fresh)
2. Falls back to `localStorage` (your existing data is still there)
3. Automatically mirrors `localStorage` data into React state
4. Going forward, **new users/orders** are synced to Firestore in the background

### Step 3: One-Time Sync (Manual)

To push all existing `localStorage` data to Firestore, use the browser console:

```javascript
// Open browser DevTools (F12) → Console tab

// Get existing users
const users = JSON.parse(localStorage.getItem('pos_users')) || [];
// Get existing orders (adjust 'Main Branch' if needed)
const orders = JSON.parse(localStorage.getItem('pos_orders_Main Branch_')) || [];

console.log('Users:', users);
console.log('Orders:', orders);

// Clear Firestore (optional - be careful!)
// Then manually add them via the Admin UI, or use Firestore console
```

**Alternative: Use the Admin UI**
1. Delete all users from Admin → Users
2. Re-create them through the Admin UI one by one
3. New users will automatically persist to Firestore
4. Do the same for any test orders

### Step 4: Verify Sync

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Go to **Firestore Database** → **Collection Browser**
3. Check `users` collection — you should see your users
4. Check `orders` collection — you should see your orders

### How Data Flows

```
Create User in Admin UI
        ↓
Stored in React state + localStorage
        ↓
Background task: persist to Firestore (if enabled)
        ↓
Next time app loads:
  - Try Firestore first (fetch users/orders)
  - If empty, fall back to localStorage
  - Mirror Firestore data to localStorage for offline use
```

## Important Notes

- **localStorage and Firestore are separate.** Changes in one don't automatically sync to the other
- **localStorage is primary for offline:** If Firestore is down, the app still works with cached `localStorage` data
- **Firestore becomes source of truth** once enabled — disable it again to go back to `localStorage`
- **No automatic cleanup:** Old `localStorage` data persists even if you enable Firestore. Optionally clear it manually in DevTools:
  ```javascript
  localStorage.removeItem('pos_users');
  localStorage.removeItem('pos_orders_Main Branch_');
  // repeat for other branches
  ```

## Example: Enable Firestore with Existing Data

1. You have 5 users and 20 orders in `localStorage`
2. Set `VITE_USE_FIRESTORE=true` and restart
3. App loads, sees Firestore is empty, falls back to `localStorage`
4. All 5 users and 20 orders are visible in the Admin UI (from `localStorage`)
5. You manually re-create 1 new user via Admin → Users → Add
6. That user immediately persists to Firestore ✓
7. All other 5 original users remain in `localStorage` only (not in Firestore) until you manually create them again

**To fully migrate:**
- Option A: Delete and re-create all users/orders through the Admin UI
- Option B: Use Firestore Console to manually upload data (requires uploading JSON)
- Option C: Write a small script to programmatically copy `localStorage` to Firestore

## Disable Firestore (Revert to localStorage)

If you enable Firestore but decide to go back to `localStorage` only:

1. Set `VITE_USE_FIRESTORE=false` in `.env`
2. Restart the app
3. App will use `localStorage` exclusively
4. Firestore data remains untouched (no automatic deletion)

## Clean Up

To fully remove Firestore integration:

1. Delete Firebase project (optional but clean)
2. Set `VITE_USE_FIRESTORE=false`
3. Remove Firebase env vars from `.env` (optional; they're just unused)
4. The app continues to work with `localStorage`

## Questions?

- **Can I sync manually?** Yes, but the app doesn't have a built-in sync button. You'd need to use the Firestore Console or write a custom sync script.
- **Will existing users see data loss?** No. The app falls back to `localStorage` automatically. Data is never deleted unless you explicitly remove it.
- **Can I test both modes?** Yes. Toggle `VITE_USE_FIRESTORE=true/false` and restart to switch between modes.

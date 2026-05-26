# Quick Start Guide - Admin Dashboard

## Getting Started in 5 Minutes

### Step 1: Login as Admin
1. Open the application
2. Select **Admin** role
3. Choose your branch
4. Enter password
5. You're in the Admin Dashboard! ✓

---

### Step 2: Create Your Categories

**Example Workflow:**

Go to **Admin Panel → Categories Tab**

1. **Add Category 1 - Shawarma**
   - Name: `شاورما`
   - Color: `#FF6B6B` (Red)
   - Click **Add Category**

2. **Add Category 2 - Drinks**
   - Name: `مشروبات`
   - Color: `#4ECDC4` (Teal)
   - Click **Add Category**

3. **Add Category 3 - Desserts**
   - Name: `الحلويات`
   - Color: `#FFD93D` (Yellow)
   - Click **Add Category**

✓ Categories Ready!

---

### Step 3: Add Menu Items

Go to **Admin Panel → Menu Items Tab**

**For Shawarma Category:**
1. Item Name: `شاورما دجاج`
   - Price: `5.99`
   - Category: `شاورما`
   - Image: (optional)
   - Click **Add Item**

2. Item Name: `شاورما لحم`
   - Price: `6.99`
   - Category: `شاورما`
   - Click **Add Item**

**For Drinks Category:**
1. Item Name: `كوكاكولا`
   - Price: `1.50`
   - Category: `مشروبات`
   - Click **Add Item**

✓ Menu Items Ready!

---

### Step 4: Create Your First Order

Go to **Admin Panel → Orders Tab → Create Order Panel**

**Method 1: Quick Add**
1. Click category buttons to organize items
2. Click `+Item` buttons to add to cart
3. Use `+` and `-` buttons to adjust quantities
4. Click **Create Order**

**Method 2: Edit Existing**
1. Click **Edit** button on any order
2. Modify items and quantities
3. Click **Save Changes**

**Example Order:**
- 2x شاورما دجاج
- 1x كوكاكولا
- Total: $13.47 (with 14% VAT)

Status: `Pending` → Ready!

---

### Step 5: Update Order Status

Go to **Admin Panel → Orders Tab**

**Status Buttons:**
- Click **Pending** → Order appears to kitchen
- Click **Preparing** → Kitchen is preparing
- Click **Ready** → Ready for pickup
- Click **Completed** ✓ → Order finished

---

### Step 6: Kitchen View

Go to **Kitchen Tab** (or Kitchen role)

You'll see:
- **NEW ORDERS** (Red) - Orders just received
- **IN PROGRESS** (Orange) - Being prepared
- **READY FOR PICKUP** (Green) - Ready to give to customer

**Actions:**
- Click **Start Preparing** → Moves to IN PROGRESS
- Click **Ready for Pickup** → Moves to READY
- Click **Complete Order** → Marks as done

---

### Step 7: Dashboard Statistics

Go to **Admin Panel → Dashboard Tab**

View:
- **Total Revenue** - All completed orders
- **Total Orders** - Count of all orders
- **Pending** - Orders waiting to be prepared
- **Completed** - Successfully completed orders

Plus recent orders list!

---

## Daily Workflow Example

### Morning:
1. **Admin starts day**
2. Go to Dashboard - check pending orders
3. Check Menu - ensure all items are available
4. Start getting orders from POS

### During Service:
1. **New orders come in** (from Cashier/POS)
2. Orders appear as **Pending**
3. **Kitchen sees orders** and updates status
4. Monitor progress in Kitchen Display
5. **Complete orders** when ready

### Using Orders Tab:
- **Filter by Status** to find specific orders
- **Edit** if customer requests changes
- **Delete** if order was mistake
- **Cancel** if customer leaves

---

## Common Tasks

### ❓ How to delete a category?
1. Go to Categories Tab
2. Find the category
3. Click **Delete** button
4. (Items in category become unassigned)

### ❓ How to change item price?
1. Currently: Delete and re-add with new price
2. Future: Add edit functionality

### ❓ How to modify an order after creation?
1. Go to Orders Tab
2. Find the order
3. Click **Edit** button
4. Modify items/quantities
5. Click **Save Changes**

### ❓ How to see only pending orders?
1. Go to Orders Tab
2. Click **Pending** button (top buttons)
3. Only pending orders show

### ❓ How to cancel an order?
1. Go to Orders Tab
2. Find the order
3. Click **Cancel** button
4. Status changes to "cancelled"

---

## Pro Tips 💡

### Tip 1: Use Colors Wisely
- Red for main items (Shawarma)
- Teal for drinks
- Yellow for desserts
- Makes kitchen display easier!

### Tip 2: Order Workflow
**Always follow:** Pending → Preparing → Ready → Completed
- Don't skip stages
- Kitchen needs status updates
- Helps track orders

### Tip 3: Category Organization
- Create categories by:
  - Food type (Shawarma, Sides, Drinks)
  - Or by cuisine style
  - Or by preparation method
- 3-5 categories is optimal

### Tip 4: Dashboard Check
- Check dashboard every hour
- Monitor pending orders
- Track revenue

### Tip 5: Kitchen Communication
- Status updates help kitchen staff
- Visual organization (colors) is important
- Complete orders promptly

---

## Default Data

Your system comes with:

**Categories:**
- شاورما (Red)
- مشروبات (Teal)

**Items:**
- شاورما دجاج - $5.99 (Shawarma)
- شاورما لحم - $6.99 (Shawarma)
- بطاطس - $2.99 (Shawarma)
- مشروب غازي - $1.50 (Drinks)

Feel free to edit or delete these!

---

## Troubleshooting

### ❌ Can't see my category after creating?
- Refresh the page
- Check browser console for errors
- Clear browser cache

### ❌ Items not showing in category?
- Verify item was assigned to that category
- Check if category still exists
- Try refreshing

### ❌ Order status won't update?
- Check if order exists
- Try clicking status button again
- Refresh and try again

### ❌ Cart is empty in order creation?
- Click the `+Item` buttons to add items
- Categories organize items - select category first

### ❌ Data disappearing after refresh?
- This system uses localStorage (browser storage)
- Clear cache might delete data
- Consider switching to Firebase for cloud storage

---

## Next Steps

1. ✅ Login as Admin
2. ✅ Create 2-3 categories
3. ✅ Add 5-10 menu items
4. ✅ Create a test order
5. ✅ Update status through workflow
6. ✅ Check Kitchen View
7. ✅ Mark as completed
8. ✅ Review Dashboard

**You're ready to go!** 🚀

---

## Support

**For Issues:**
1. Check ADMIN_FEATURES.md for detailed info
2. Check SYSTEM_ARCHITECTURE.md for flow diagrams
3. Review the code comments in files

**Key Files:**
- `src/context/AppContext.jsx` - State management
- `src/pages/Admin.jsx` - Admin dashboard
- `src/pages/Kitchen.jsx` - Kitchen display
- `src/pages/POS.jsx` - Cashier interface

---

**Happy Ordering! 🍔🥤**

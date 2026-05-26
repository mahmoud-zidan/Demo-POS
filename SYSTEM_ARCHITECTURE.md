# Admin Dashboard System Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    POS SYSTEM ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────────┘

                         ┌──────────────┐
                         │  AppContext  │
                         │   (Redux)    │
                         └──────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
          ┌─────▼─────┐   ┌─────▼─────┐   ┌────▼─────┐
          │ Categories │   │ MenuItems │   │  Orders  │
          └───────────┘   └───────────┘   └──────────┘
                │               │               │
                │               │               │
     ┌──────────▼──────────┬────▼────┬─────────▼──────────┐
     │                     │         │                    │
┌────▼────┐        ┌──────▼────┐   │            ┌────────▼────────┐
│  Admin   │        │   POS     │   │            │     Kitchen     │
│Dashboard │        │ Cashier   │   │            │    Display      │
└──────────┘        └───────────┘   │            └─────────────────┘
                                     │
                            ┌────────▼────────┐
                            │ localStorage    │
                            │  (Persistence)  │
                            └─────────────────┘

```

---

## Admin Dashboard Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN PANEL TABS                         │
└─────────────────────────────────────────────────────────────┘

   ┌──────────────┐
   │  Dashboard   │ ──> View Statistics & Recent Orders
   └──────────────┘
         │
   ┌──────────────┐
   │ Categories   │ ──> Add/Edit/Delete Categories
   └──────────────┘      └─> View items per category
         │
   ┌──────────────┐
   │ Menu Items   │ ──> Add/Edit/Delete Items
   └──────────────┘      └─> Organize by Category
         │
   ┌──────────────┐
   │   Orders     │ ──> Create/Edit/Delete Orders
   └──────────────┘      └─> Status Workflow Management
         │
   ┌──────────────┐
   │   Logout     │ ──> Exit Admin Panel
   └──────────────┘

```

---

## Order Status Workflow

```
┌──────────┐
│ Pending  │ ──────> New order received from cashier
└─────┬────┘
      │
      │ Admin clicks "Preparing"
      │
      ▼
┌──────────┐
│Preparing │ ──────> Kitchen starts preparing order
└─────┬────┘
      │
      │ Kitchen clicks "Ready for Pickup"
      │
      ▼
┌──────────┐
│  Ready   │ ──────> Order ready at counter
└─────┬────┘
      │
      │ Kitchen/Admin clicks "Complete"
      │
      ▼
┌──────────┐
│Completed │ ──────> Order delivered to customer ✓
└──────────┘

Alternative Path:
┌──────────┐
│Cancelled │ ◀─────── Can be set at any stage
└──────────┘

```

---

## Data Model

### Category
```javascript
{
  id: 1234567890,        // Unique timestamp-based ID
  name: "شاورما",        // Category name
  color: "#FF6B6B"       // Hex color for UI
}
```

### MenuItem
```javascript
{
  id: 1234567890,        // Unique ID
  name: "شاورما دجاج",    // Item name
  price: 5.99,           // Item price
  categoryId: 1,         // Reference to category
  image: "https://..."   // Image URL
}
```

### Order
```javascript
{
  id: "1234",            // Last 4 digits of timestamp
  branch: "Admin Branch", // Branch name
  items: [               // Array of items
    {
      id: 1,
      name: "شاورما دجاج",
      price: 5.99,
      categoryId: 1,
      qty: 2,
      image: "https://..."
    }
  ],
  baseTotal: 11.98,      // Before VAT
  vatAmount: 1.68,       // 14% VAT
  total: 13.66,          // Final total
  status: "pending",     // pending|preparing|ready|completed|cancelled
  timestamp: "5/25/2026" // Date and time
}
```

---

## User Roles & Permissions

```
┌─────────────────────────────────────────────────────────────┐
│                    ROLE: ADMIN                              │
├─────────────────────────────────────────────────────────────┤
│ ✓ Full access to dashboard                                  │
│ ✓ Create/Edit/Delete categories                             │
│ ✓ Create/Edit/Delete menu items                             │
│ ✓ Create/Edit/Delete orders                                 │
│ ✓ Update order status                                       │
│ ✓ View all statistics                                       │
│ ✓ View kitchen display                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   ROLE: KITCHEN                             │
├─────────────────────────────────────────────────────────────┤
│ ✓ View pending orders                                       │
│ ✓ Update order status (Pending → Preparing → Ready)         │
│ ✓ Mark order as completed                                   │
│ ✓ View order items and details                              │
│ ✗ Cannot create/edit orders                                 │
│ ✗ Cannot access menu/category management                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   ROLE: CASHIER/POS                         │
├─────────────────────────────────────────────────────────────┤
│ ✓ View menu items by category                               │
│ ✓ Create orders                                             │
│ ✓ Print receipts                                            │
│ ✗ Cannot edit orders                                        │
│ ✗ Cannot access admin features                              │
└─────────────────────────────────────────────────────────────┘

```

---

## Component Hierarchy

```
App
├── Login
│   └── Branch/Role Selection
├── Admin
│   ├── Dashboard Tab
│   ├── Categories Tab
│   ├── Menu Items Tab
│   ├── Orders Tab
│   └── Logout
├── Kitchen
│   ├── Pending Orders Section
│   ├── Preparing Orders Section
│   ├── Ready Orders Section
│   └── Completed Orders Summary
├── POS
│   ├── Category Filter
│   ├── Menu Grid
│   └── Cart/Checkout
└── AppContext
    ├── State Management
    ├── localStorage Sync
    └── API Functions
```

---

## Feature Checklist

### Category Management
- [x] Add categories with custom colors
- [x] Edit category name and color
- [x] Delete categories
- [x] View items count per category

### Menu Management
- [x] Add items with name, price, category, image
- [x] Assign items to categories
- [x] Delete items
- [x] Display items organized by category

### Order Management
- [x] Create orders
- [x] Edit order items/quantities
- [x] Update order status through workflow
- [x] Delete orders with confirmation
- [x] Cancel orders
- [x] View order details and totals

### Admin Dashboard
- [x] Dashboard with statistics
- [x] Tab navigation
- [x] Order filtering
- [x] Order creation panel

### Kitchen Display
- [x] Orders organized by status
- [x] Visual status indicators
- [x] Status update buttons
- [x] Completed orders summary

### Data Persistence
- [x] localStorage integration
- [x] Auto-save on changes
- [x] Sync across tabs

---

## How to Test

### 1. Test Category Creation
- Go to Admin → Categories
- Add a new category (e.g., "Desserts")
- Verify it appears in the list

### 2. Test Menu Management
- Go to Admin → Menu Items
- Add an item to the new category
- Verify it appears in the category section

### 3. Test Order Workflow
- Go to Admin → Orders
- Create a new order
- Click through all status buttons
- Verify status updates

### 4. Test Kitchen View
- Create an order with "pending" status
- Go to Kitchen view
- Verify order appears in "NEW ORDERS"
- Click "Start Preparing"
- Verify it moves to "IN PROGRESS"

### 5. Test Cashier
- Go to POS
- Use category filter
- Add items to cart
- Complete order

---

**System Design Complete! ✓**

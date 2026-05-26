// import { useState } from 'react';
// import { useApp } from '../context/AppContext';
// import { useNavigate } from 'react-router-dom';
// import { 
//   LayoutDashboard, Tag, Coffee, ShoppingBag, Store, Users, LogOut, 
//   Plus, Edit, Trash2, X, Check, ArrowUpRight, TrendingUp, DollarSign, Calendar, Flame, Edit3
// } from 'lucide-react';

// export default function Admin() {
//   const { 
//     setUserRole, orders, updateOrderStatus, deleteOrder, editOrder, addOrder, 
//     menuItems, addMenuItem, editMenuItem, deleteMenuItem,
//     categories, addCategory, editCategory, deleteCategory,
//     currentBranch, branches, addBranch, deleteBranch, 
//     users, addUser, editUser, deleteUser, setCurrentBranch,
//     language, setLang, t
//   } = useApp();
//   const navigate = useNavigate();

//   const filteredUsers = users.filter(u => u.branch === currentBranch);

//   // Navigation tab state: 'dashboard', 'categories', 'menu', 'orders', 'branches', 'users'
//   const [activeTab, setActiveTab] = useState('dashboard');

//   // Add Item State
//   const [newItem, setNewItem] = useState({ name: '', price: '', categoryId: '', image: '' });

//   // Edit Item State
//   const [editingItemId, setEditingItemId] = useState(null);
//   const [editingItemData, setEditingItemData] = useState({ name: '', price: '', categoryId: '', image: '' });

//   // Category States
//   const [newCategory, setNewCategory] = useState({ name: '', color: '#6366f1' });
//   const [editingCategoryId, setEditingCategoryId] = useState(null);
//   const [editingCategoryData, setEditingCategoryData] = useState({ name: '', color: '' });

//   // Order/Cart State
//   const [editingOrderId, setEditingOrderId] = useState(null);
//   const [cart, setCart] = useState([]);
//   const [orderStatusFilter, setOrderStatusFilter] = useState('all');

//   // Date Filter State
//   const [dateFilterType, setDateFilterType] = useState('all'); // all, today, week, month, custom
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   // Branch/User Management States
//   const [newBranchName, setNewBranchName] = useState('');
//   const [newUserName, setNewUserName] = useState('');
//   const [newUserEmail, setNewUserEmail] = useState('');
//   const [newUserRole, setNewUserRole] = useState('cashier');
//   const [editingUserId, setEditingUserId] = useState(null);
//   const [editingUserData, setEditingUserData] = useState({ name: '', email: '', role: 'cashier', branch: '' });

//   const handleLogout = () => {
//     setUserRole(null, null);
//     navigate('/login');
//   };

//   const getMenuItemsByCategory = (categoryId) => {
//     return menuItems.filter(item => item.categoryId === parseInt(categoryId) || item.categoryId === categoryId);
//   };

//   // Date Filter Helper
//   const getFilteredOrdersByDate = () => {
//     const now = new Date();
//     let filtered = orders;

//     if (dateFilterType === 'today') {
//       const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//       filtered = orders.filter(o => {
//         const orderDate = new Date(o.timestamp);
//         return new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate()) >= today;
//       });
//     } else if (dateFilterType === 'week') {
//       const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//       filtered = orders.filter(o => new Date(o.timestamp) >= weekAgo);
//     } else if (dateFilterType === 'month') {
//       const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//       filtered = orders.filter(o => new Date(o.timestamp) >= monthAgo);
//     } else if (dateFilterType === 'custom' && startDate && endDate) {
//       const start = new Date(startDate);
//       const end = new Date(endDate);
//       end.setHours(23, 59, 59);
//       filtered = orders.filter(o => {
//         const oDate = new Date(o.timestamp);
//         return oDate >= start && oDate <= end;
//       });
//     }
//     return filtered;
//   };

//   const filteredOrdersByDate = getFilteredOrdersByDate();

//   // Category Management
//   const handleAddCategory = (e) => {
//     e.preventDefault();
//     if (!newCategory.name) return;
//     addCategory({
//       name: newCategory.name,
//       color: newCategory.color
//     });
//     setNewCategory({ name: '', color: '#6366f1' });
//   };

//   const handleEditCategory = (id) => {
//     const cat = categories.find(c => c.id === id);
//     setEditingCategoryId(id);
//     setEditingCategoryData({ name: cat.name, color: cat.color });
//   };

//   const handleSaveCategory = (id) => {
//     editCategory(id, editingCategoryData);
//     setEditingCategoryId(null);
//     setEditingCategoryData({ name: '', color: '' });
//   };

//   // Menu Management
//   const handleAddItem = (e) => {
//     e.preventDefault();
//     if (!newItem.name || !newItem.price || !newItem.categoryId) return;
//     addMenuItem({
//       name: newItem.name,
//       price: parseFloat(newItem.price),
//       categoryId: parseInt(newItem.categoryId),
//       image: newItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'
//     });
//     setNewItem({ name: '', price: '', categoryId: '', image: '' });
//   };

//   const startEditItem = (item) => {
//     setEditingItemId(item.id);
//     setEditingItemData({
//       name: item.name,
//       price: item.price,
//       categoryId: item.categoryId,
//       image: item.image
//     });
//   };

//   const handleSaveItem = (e) => {
//     e.preventDefault();
//     if (!editingItemData.name || !editingItemData.price || !editingItemData.categoryId) return;
//     editMenuItem(editingItemId, {
//       name: editingItemData.name,
//       price: parseFloat(editingItemData.price),
//       categoryId: parseInt(editingItemData.categoryId),
//       image: editingItemData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'
//     });
//     setEditingItemId(null);
//   };

//   // Cart Management
//   const addToCart = (item) => {
//     const existing = cart.find(i => i.id === item.id);
//     if (existing) {
//       setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
//     } else {
//       setCart([...cart, { ...item, qty: 1 }]);
//     }
//   };

//   const removeFromCart = (id) => {
//     setCart(cart.filter(i => i.id !== id));
//   };

//   const updateCartQty = (id, qty) => {
//     if (qty <= 0) {
//       removeFromCart(id);
//     } else {
//       setCart(cart.map(i => i.id === id ? { ...i, qty } : i));
//     }
//   };

//   const startEditOrder = (order) => {
//     setEditingOrderId(order.id);
//     setCart(order.items || []);
//   };

//   const cancelEdit = () => {
//     setEditingOrderId(null);
//     setCart([]);
//   };

//   const saveOrder = () => {
//     if (cart.length === 0) {
//       alert('Cart cannot be empty. If you want to cancel, use the Delete button.');
//       return;
//     }

//     const baseTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
//     const vatAmount = baseTotal * 0.14;
//     const finalTotal = baseTotal + vatAmount;

//     if (editingOrderId) {
//       editOrder(editingOrderId, {
//         items: cart,
//         baseTotal: baseTotal,
//         vatAmount: vatAmount,
//         total: finalTotal
//       });
//       alert('Order updated successfully!');
//     } else {
//       addOrder({
//         id: Date.now().toString().slice(-4),
//         branch: currentBranch || 'Admin Branch',
//         items: cart,
//         baseTotal: baseTotal,
//         vatAmount: vatAmount,
//         total: finalTotal,
//         status: 'pending',
//         timestamp: new Date().toLocaleString()
//       });
//       alert('New order created successfully!');
//     }
//     setEditingOrderId(null);
//     setCart([]);
//   };

//   // Calculations (based on filtered orders)
//   const totalOrders = filteredOrdersByDate.length;
//   const totalRevenue = filteredOrdersByDate
//     .filter(o => o.status !== 'cancelled')
//     .reduce((sum, order) => sum + (order.total || 0), 0);

//   const statusCounts = {
//     pending: filteredOrdersByDate.filter(o => o.status === 'pending').length,
//     preparing: filteredOrdersByDate.filter(o => o.status === 'preparing').length,
//     ready: filteredOrdersByDate.filter(o => o.status === 'ready').length,
//     completed: filteredOrdersByDate.filter(o => o.status === 'completed').length,
//     cancelled: filteredOrdersByDate.filter(o => o.status === 'cancelled').length,
//   };

//   // Revenue by status
//   const revenueCounts = {
//     completed: filteredOrdersByDate.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.total || 0), 0),
//     cancelled: filteredOrdersByDate.filter(o => o.status === 'cancelled').reduce((sum, o) => sum + (o.total || 0), 0),
//   };

//   // Average order value
//   const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

//   const filteredOrders = orderStatusFilter === 'all' 
//     ? orders 
//     : orders.filter(o => o.status === orderStatusFilter);

//   // Chart data calculations
//   const getSalesByCategory = () => {
//     const sales = {};
//     categories.forEach(cat => {
//       sales[cat.id] = { id: cat.id, name: cat.name, color: cat.color, total: 0 };
//     });

//     filteredOrdersByDate.forEach(order => {
//       if (order.status !== 'cancelled') {
//         (order.items || []).forEach(item => {
//           if (sales[item.categoryId]) {
//             sales[item.categoryId].total += item.price * item.qty;
//           }
//         });
//       }
//     });
//     return Object.values(sales);
//   };

//   const salesByCategory = getSalesByCategory();
//   const maxCategorySales = Math.max(...salesByCategory.map(c => c.total), 1);

//   const getRecentSalesChartData = () => {
//     const days = [];
//     for (let i = 6; i >= 0; i--) {
//       const d = new Date();
//       d.setDate(d.getDate() - i);
//       const label = d.toLocaleDateString(undefined, { weekday: 'short' });
//       const dateStr = d.toDateString();
//       days.push({ label, dateStr, total: 0 });
//     }

//     filteredOrdersByDate.forEach(order => {
//       if (order.status !== 'cancelled') {
//         const orderDate = new Date(order.timestamp).toDateString();
//         const dayObj = days.find(d => d.dateStr === orderDate);
//         if (dayObj) {
//           dayObj.total += order.total || 0;
//         }
//       }
//     });
//     return days;
//   };

//   const recentSalesData = getRecentSalesChartData();
//   const maxDaySales = Math.max(...recentSalesData.map(d => d.total), 1);

//   // Branch & User functions
//   const handleAddBranch = (e) => {
//     e.preventDefault(); 
//     if (!newBranchName) return; 
//     addBranch(newBranchName); 
//     setNewBranchName('');
//     alert(`Branch "${newBranchName}" created!`);
//   };

//   const handleAddUser = (e) => {
//     e.preventDefault();
//     if (!newUserName || !newUserEmail) return;
//     // Include email and the selected branch for the new user
//     addUser({name: newUserName, email: newUserEmail, role: newUserRole, branch: currentBranch});
//     setNewUserName('');
//     setNewUserEmail('');
//     setNewUserRole('cashier');
//     alert('User added successfully!');
//   };

//   const startEditUser = (user) => {
//     setEditingUserId(user.id);
//     setEditingUserData({
//       name: user.name,
//       email: user.email || '',
//       role: user.role,
//       branch: user.branch || currentBranch
//     });
//   };

//   const saveEditUser = () => {
//     editUser(editingUserId, editingUserData); 
//     setEditingUserId(null); 
//     setEditingUserData({ name: '', email: '', role: 'cashier', branch: '' });
//     alert('User updated!');
//   };

//   return (
//     <div className="app-container">

//       {/* Sticky Left Navigation Sidebar */}
//       <div className="sidebar">
//         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 0.5rem 1.5rem 0.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
//           <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white' }}>
//             <Flame size={22} className="animate-pulse" />
//           </div>
//           <div>
//             <h2 style={{ fontSize: '1.25rem', margin: 0 }}>بيت الشاورما</h2>
//             <span className="text-xs text-muted">Admin Control Panel</span>
//           </div>
//         </div>

//         {/* Branch Scope Swapper */}
//         <div style={{ marginBottom: '1.5rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
//           <label className="text-sm text-muted" style={{ display: 'block', marginBottom: '0.25rem' }}>Current Branch</label>
//           <select 
//             value={currentBranch || ''} 
//             onChange={(e) => setCurrentBranch(e.target.value)}
//             style={{ padding: '0.4rem 0.75rem', fontSize: '0.9rem', backgroundColor: 'var(--background)' }}
//           >
//             {branches.map(b => (
//               <option key={b} value={b}>{b}</option>
//             ))}
//           </select>
//         </div>

//         {/* Tab Navigation Menu */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
//           <button 
//             className={`btn-outline ${activeTab === 'dashboard' ? 'btn-primary' : ''}`}
//             style={{ justifyContent: 'flex-start', padding: '0.7rem 1rem' }}
//             onClick={() => setActiveTab('dashboard')}
//           >
//             <LayoutDashboard size={18} /> Dashboard
//           </button>

//           <button 
//             className={`btn-outline ${activeTab === 'categories' ? 'btn-primary' : ''}`}
//             style={{ justifyContent: 'flex-start', padding: '0.7rem 1rem' }}
//             onClick={() => setActiveTab('categories')}
//           >
//             <Tag size={18} /> Categories
//           </button>

//           <button 
//             className={`btn-outline ${activeTab === 'menu' ? 'btn-primary' : ''}`}
//             style={{ justifyContent: 'flex-start', padding: '0.7rem 1rem' }}
//             onClick={() => setActiveTab('menu')}
//           >
//             <Coffee size={18} /> Menu Items
//           </button>

//           <button 
//             className={`btn-outline ${activeTab === 'orders' ? 'btn-primary' : ''}`}
//             style={{ justifyContent: 'flex-start', padding: '0.7rem 1rem' }}
//             onClick={() => setActiveTab('orders')}
//           >
//             <ShoppingBag size={18} /> Orders
//           </button>

//           <button 
//             className={`btn-outline ${activeTab === 'branches' ? 'btn-primary' : ''}`}
//             style={{ justifyContent: 'flex-start', padding: '0.7rem 1rem' }}
//             onClick={() => setActiveTab('branches')}
//           >
//             <Store size={18} /> Branches
//           </button>

//           <button 
//             className={`btn-outline ${activeTab === 'users' ? 'btn-primary' : ''}`}
//             style={{ justifyContent: 'flex-start', padding: '0.7rem 1rem' }}
//             onClick={() => setActiveTab('users')}
//           >
//             <Users size={18} /> Users
//           </button>
//         </div>

//         {/* Logout at bottom */}
//         <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
//           <button className="btn-outline" onClick={handleLogout} style={{ width: '100%', gap: '0.5rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
//             <LogOut size={16} /> Logout
//           </button>
//         </div>
//       </div>

//       {/* Main Panel Content */}
//       <div className="main-content">

//         {/* ==================== DASHBOARD TAB ==================== */}
//         {activeTab === 'dashboard' && (
//           <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//               <div>
//                 <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>📊 Dashboard</h1>
//                 <p className="text-muted">Real-time statistics & business reports for {currentBranch}</p>
//               </div>

//               {/* Language Selector */}
//               <button 
//                 className="btn-secondary"
//                 onClick={() => setLang(language === 'en' ? 'ar' : 'en')}
//                 style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
//               >
//                 {language === 'en' ? '🇸🇦 العربية' : '🇬🇧 English'}
//               </button>
//             </div>

//             {/* Date Filter Panel */}
//             <div className="glass-card" style={{ padding: '1.25rem' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
//                 <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
//                   {['all', 'today', 'week', 'month', 'custom'].map(type => (
//                     <button 
//                       key={type}
//                       className={`btn-outline ${dateFilterType === type ? 'btn-primary' : ''}`}
//                       onClick={() => setDateFilterType(type)}
//                       style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
//                     >
//                       {type === 'all' && 'All Time'}
//                       {type === 'today' && 'Today'}
//                       {type === 'week' && 'Last 7 Days'}
//                       {type === 'month' && 'Last 30 Days'}
//                       {type === 'custom' && 'Custom Range'}
//                     </button>
//                   ))}
//                 </div>
//                 {dateFilterType === 'custom' && (
//                   <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', animation: 'fadeIn 0.2s' }}>
//                     <input 
//                       type="date" 
//                       value={startDate}
//                       onChange={(e) => setStartDate(e.target.value)}
//                       style={{ padding: '0.4rem', width: '130px', fontSize: '0.85rem' }}
//                     />
//                     <span className="text-muted">to</span>
//                     <input 
//                       type="date" 
//                       value={endDate}
//                       onChange={(e) => setEndDate(e.target.value)}
//                       style={{ padding: '0.4rem', width: '130px', fontSize: '0.85rem' }}
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Statistics Cards */}
//             <div className="grid grid-cols-4">
//               <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)', background: 'linear-gradient(to right, rgba(99,102,241,0.05), transparent)' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
//                   <span>Revenue</span>
//                   <DollarSign size={18} />
//                 </div>
//                 <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#fff' }}>
//                   ${totalRevenue.toFixed(2)}
//                 </div>
//                 <div className="text-xs text-muted" style={{ marginTop: '0.5rem' }}>Active Orders scope</div>
//               </div>

//               <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--success)', background: 'linear-gradient(to right, rgba(16,185,129,0.05), transparent)' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
//                   <span>Total Orders</span>
//                   <ShoppingBag size={18} />
//                 </div>
//                 <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#fff' }}>
//                   {totalOrders}
//                 </div>
//                 <div className="text-xs text-muted" style={{ marginTop: '0.5rem' }}>Avg. Order: ${avgOrderValue}</div>
//               </div>

//               <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--warning)', background: 'linear-gradient(to right, rgba(245,158,11,0.05), transparent)' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
//                   <span>Pending</span>
//                   <Calendar size={18} />
//                 </div>
//                 <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#fff' }}>
//                   {statusCounts.pending}
//                 </div>
//                 <div className="text-xs text-muted" style={{ marginTop: '0.5rem' }}>Needs preparation</div>
//               </div>

//               <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--info)', background: 'linear-gradient(to right, rgba(6,182,212,0.05), transparent)' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
//                   <span>Completed</span>
//                   <Check size={18} />
//                 </div>
//                 <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#fff' }}>
//                   {statusCounts.completed}
//                 </div>
//                 <div className="text-xs text-muted" style={{ marginTop: '0.5rem' }}>Served & settled</div>
//               </div>
//             </div>

//             {/* Custom SVG / Div Charts */}
//             <div className="grid grid-cols-2">
//               {/* Category Sales Chart */}
//               <div className="glass-card" style={{ padding: '1.5rem' }}>
//                 <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                   <TrendingUp size={18} style={{ color: 'var(--secondary)' }} /> Sales By Category
//                 </h3>

//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
//                   {salesByCategory.length === 0 ? (
//                     <p className="text-muted text-center" style={{ padding: '2rem 0' }}>No sales data available</p>
//                   ) : (
//                     salesByCategory.map(cat => {
//                       const percentage = Math.min((cat.total / maxCategorySales) * 100, 100);
//                       return (
//                         <div key={cat.id}>
//                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
//                             <span style={{ fontWeight: 600 }}>{cat.name}</span>
//                             <span className="text-muted">${cat.total.toFixed(2)}</span>
//                           </div>
//                           <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
//                             <div 
//                               style={{ 
//                                 width: `${percentage}%`, 
//                                 height: '100%', 
//                                 backgroundColor: cat.color || 'var(--primary)', 
//                                 borderRadius: '999px',
//                                 boxShadow: `0 0 8px ${cat.color}aa`
//                               }}
//                             />
//                           </div>
//                         </div>
//                       );
//                     })
//                   )}
//                 </div>
//               </div>

//               {/* Weekly Sales Chart */}
//               <div className="glass-card" style={{ padding: '1.5rem' }}>
//                 <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                   <Calendar size={18} style={{ color: 'var(--primary)' }} /> Weekly Sales Trend
//                 </h3>

//                 <div style={{ display: 'flex', height: '180px', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.5rem', padding: '0 0.5rem' }}>
//                   {recentSalesData.map((day, idx) => {
//                     const heightPercent = Math.min((day.total / maxDaySales) * 100, 100);
//                     return (
//                       <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
//                         <div className="text-xs text-muted" style={{ fontSize: '0.7rem' }}>
//                           ${day.total.toFixed(0)}
//                         </div>
//                         <div 
//                           style={{ 
//                             width: '80%', 
//                             maxWidth: '35px',
//                             height: `${Math.max(heightPercent, 4)}%`, 
//                             background: 'linear-gradient(to top, var(--primary), var(--secondary))', 
//                             borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
//                             boxShadow: 'var(--shadow-glow)',
//                             transition: 'height 0.3s ease'
//                           }} 
//                           title={`${day.dateStr}: $${day.total.toFixed(2)}`}
//                         />
//                         <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{day.label}</div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>

//             {/* Recent Orders table */}
//             <div>
//               <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>📋 Recent Orders (Last 10)</h3>
//               <div className="glass-card" style={{ overflowX: 'auto' }}>
//                 <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
//                   <thead>
//                     <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
//                       <th style={{ padding: '1rem' }}>Order ID</th>
//                       <th style={{ padding: '1rem' }}>Time</th>
//                       <th style={{ padding: '1rem' }}>Items</th>
//                       <th style={{ padding: '1rem' }}>Status</th>
//                       <th style={{ padding: '1rem', textAlign: 'right' }}>Total Amount</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredOrdersByDate.length === 0 ? (
//                       <tr>
//                         <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
//                           No orders found for the selected range.
//                         </td>
//                       </tr>
//                     ) : (
//                       [...filteredOrdersByDate].reverse().slice(0, 10).map(order => (
//                         <tr key={order.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s' }} className="hover:bg-slate-800">
//                           <td style={{ padding: '1rem', fontWeight: 'bold' }}>#{order.id}</td>
//                           <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{order.timestamp}</td>
//                           <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
//                             {(order.items || []).map(i => `${i.qty}x ${i.name}`).join(', ')}
//                           </td>
//                           <td style={{ padding: '1rem' }}>
//                             <span className={`badge badge-${order.status}`}>{order.status}</span>
//                           </td>
//                           <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>
//                             ${(order.total || 0).toFixed(2)}
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ==================== CATEGORIES TAB ==================== */}
//         {activeTab === 'categories' && (
//           <div className="animate-fade-in">
//             <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🏷️ Category Management</h1>
//             <p className="text-muted" style={{ marginBottom: '2rem' }}>Organize Shawarma menu listings with customized categorization colors</p>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
//               {/* Left Column: Form */}
//               <div className="glass-card" style={{ padding: '1.75rem', height: 'fit-content' }}>
//                 <h3 style={{ marginBottom: '1.25rem', fontSize: '1.15rem' }}>
//                   {editingCategoryId ? 'Edit Category' : 'Create New Category'}
//                 </h3>

//                 <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
//                   <div>
//                     <label className="text-sm text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Category Name</label>
//                     <input 
//                       type="text" 
//                       placeholder="e.g., Shawarma Platters" 
//                       value={newCategory.name}
//                       onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
//                       required 
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Accent UI Color</label>
//                     <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
//                       <input 
//                         type="color" 
//                         value={newCategory.color}
//                         onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
//                         style={{ width: '60px', height: '42px', padding: '2px', cursor: 'pointer', border: '1px solid var(--border)' }}
//                       />
//                       <input 
//                         type="text" 
//                         value={newCategory.color}
//                         onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
//                         style={{ flex: 1, padding: '0.5rem' }}
//                       />
//                     </div>
//                   </div>

//                   <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
//                     <Plus size={18} /> Add Category
//                   </button>
//                 </form>
//               </div>

//               {/* Right Column: List */}
//               <div className="glass-card" style={{ padding: '1.75rem' }}>
//                 <h3 style={{ marginBottom: '1.25rem', fontSize: '1.15rem' }}>Existing Categories</h3>

//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
//                   {categories.length === 0 ? (
//                     <p className="text-muted text-center" style={{ padding: '2rem' }}>No categories registered</p>
//                   ) : (
//                     categories.map(cat => (
//                       <div 
//                         key={cat.id} 
//                         style={{ 
//                           display: 'flex', 
//                           justifyContent: 'space-between', 
//                           alignItems: 'center', 
//                           padding: '1rem 1.25rem', 
//                           backgroundColor: 'rgba(255,255,255,0.02)', 
//                           border: '1px solid var(--border)',
//                           borderRadius: 'var(--radius-sm)', 
//                           borderLeft: `5px solid ${cat.color}` 
//                         }}
//                       >
//                         {editingCategoryId === cat.id ? (
//                           <div style={{ display: 'flex', width: '100%', gap: '0.75rem', alignItems: 'center' }}>
//                             <input 
//                               type="text" 
//                               value={editingCategoryData.name}
//                               onChange={(e) => setEditingCategoryData({ ...editingCategoryData, name: e.target.value })}
//                               style={{ padding: '0.4rem', flex: 1 }}
//                             />
//                             <input 
//                               type="color" 
//                               value={editingCategoryData.color}
//                               onChange={(e) => setEditingCategoryData({ ...editingCategoryData, color: e.target.value })}
//                               style={{ width: '40px', height: '35px', padding: '2px', cursor: 'pointer' }}
//                             />
//                             <button className="btn-success" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleSaveCategory(cat.id)}>
//                               <Check size={14} /> Save
//                             </button>
//                             <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setEditingCategoryId(null)}>
//                               <X size={14} /> Cancel
//                             </button>
//                           </div>
//                         ) : (
//                           <>
//                             <div>
//                               <div style={{ fontWeight: 'bold', fontSize: '1.05rem', color: '#fff' }}>{cat.name}</div>
//                               <div className="text-xs text-muted" style={{ marginTop: '0.15rem' }}>
//                                 {getMenuItemsByCategory(cat.id).length} menu items associated
//                               </div>
//                             </div>
//                             <div style={{ display: 'flex', gap: '0.5rem' }}>
//                               <button className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleEditCategory(cat.id)}>
//                                 <Edit size={14} /> Edit
//                               </button>
//                               <button className="btn-danger" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }} onClick={() => {
//                                 if (confirm(`Delete category "${cat.name}"? Items linked will remain but category reference will be removed.`)) {
//                                   deleteCategory(cat.id);
//                                 }
//                               }}>
//                                 <Trash2 size={14} /> Delete
//                               </button>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ==================== MENU ITEMS TAB ==================== */}
//         {activeTab === 'menu' && (
//           <div className="animate-fade-in">
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
//               <div>
//                 <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>📋 Menu Management</h1>
//                 <p className="text-muted">Register, edit, and organize kitchen dishes and pricing</p>
//               </div>
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem' }}>
//               {/* Left Form: Add item */}
//               <div className="glass-card" style={{ padding: '1.75rem', height: 'fit-content' }}>
//                 <h3 style={{ marginBottom: '1.25rem', fontSize: '1.15rem' }}>Add Menu Item</h3>

//                 <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
//                   <div>
//                     <label className="text-sm text-muted" style={{ display: 'block', marginBottom: '0.4rem' }}>Dish Name</label>
//                     <input 
//                       type="text" 
//                       placeholder="e.g., Chicken Shawarma wrap" 
//                       value={newItem.name}
//                       onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
//                       required 
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm text-muted" style={{ display: 'block', marginBottom: '0.4rem' }}>Price ($)</label>
//                     <input 
//                       type="number" 
//                       step="0.01" 
//                       placeholder="0.00" 
//                       value={newItem.price}
//                       onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
//                       required 
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm text-muted" style={{ display: 'block', marginBottom: '0.4rem' }}>Category Link</label>
//                     <select 
//                       value={newItem.categoryId}
//                       onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}
//                       required
//                     >
//                       <option value="">Select Category</option>
//                       {categories.map(cat => (
//                         <option key={cat.id} value={cat.id}>{cat.name}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="text-sm text-muted" style={{ display: 'block', marginBottom: '0.4rem' }}>Image URL</label>
//                     <input 
//                       type="url" 
//                       placeholder="https://images.unsplash.com/..." 
//                       value={newItem.image}
//                       onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
//                     />
//                   </div>

//                   <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
//                     <Plus size={18} /> Add Menu Item
//                   </button>
//                 </form>
//               </div>

//               {/* Right: Items catalog grouped by category */}
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
//                 {categories.length === 0 ? (
//                   <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
//                     <p className="text-muted">Create a category first to list menu items.</p>
//                   </div>
//                 ) : (
//                   categories.map(category => {
//                     const items = getMenuItemsByCategory(category.id);
//                     return (
//                       <div key={category.id} className="glass-card animate-fade-in" style={{ padding: '1.5rem', borderLeft: `5px solid ${category.color}` }}>
//                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
//                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
//                             <div style={{ width: '12px', height: '12px', backgroundColor: category.color, borderRadius: '50%' }}></div>
//                             <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{category.name}</h3>
//                           </div>
//                           <span className="badge badge-pending" style={{ color: category.color, borderColor: category.color, textTransform: 'none' }}>
//                             {items.length} items
//                           </span>
//                         </div>

//                         {items.length === 0 ? (
//                           <p className="text-muted text-sm" style={{ padding: '1rem 0' }}>No items linked to this category</p>
//                         ) : (
//                           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1.25rem' }}>
//                             {items.map(item => (
//                               <div key={item.id} className="glass-card" style={{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)' }}>
//                                 <div style={{ height: '130px', position: 'relative' }}>
//                                   <img 
//                                     src={item.image} 
//                                     alt={item.name} 
//                                     style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
//                                   />
//                                   <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.25rem 0.5rem', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 'var(--radius-sm)', fontWeight: 'bold', fontSize: '0.85rem' }}>
//                                     ${item.price.toFixed(2)}
//                                   </div>
//                                 </div>

//                                 <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
//                                   <div style={{ fontWeight: 'bold', fontSize: '0.95rem', minHeight: '40px', color: '#fff' }}>{item.name}</div>

//                                   <div style={{ display: 'flex', gap: '0.4rem' }}>
//                                     <button 
//                                       className="btn-secondary" 
//                                       style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem' }}
//                                       onClick={() => startEditItem(item)}
//                                     >
//                                       <Edit size={14} /> Edit
//                                     </button>
//                                     <button 
//                                       className="btn-danger" 
//                                       style={{ padding: '0.4rem', fontSize: '0.8rem' }}
//                                       onClick={() => {
//                                         if (confirm(`Delete menu item "${item.name}"?`)) {
//                                           deleteMenuItem(item.id);
//                                         }
//                                       }}
//                                     >
//                                       <Trash2 size={14} />
//                                     </button>
//                                   </div>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </div>

//             {/* Modal popup to Edit Menu Item */}
//             {editingItemId && (
//               <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}>
//                 <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '2rem', backgroundColor: 'var(--surface)', border: '1px solid rgba(255,255,255,0.12)' }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
//                     <h3 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                       <Edit3 size={20} style={{ color: 'var(--primary)' }} /> Edit Menu Item
//                     </h3>
//                     <button className="btn-secondary" style={{ padding: '0.25rem', borderRadius: '50%' }} onClick={() => setEditingItemId(null)}>
//                       <X size={18} />
//                     </button>
//                   </div>

//                   <form onSubmit={handleSaveItem} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
//                     <div>
//                       <label className="text-sm text-muted" style={{ display: 'block', marginBottom: '0.4rem' }}>Dish Name</label>
//                       <input 
//                         type="text" 
//                         value={editingItemData.name}
//                         onChange={(e) => setEditingItemData({ ...editingItemData, name: e.target.value })}
//                         required 
//                       />
//                     </div>

//                     <div>
//                       <label className="text-sm text-muted" style={{ display: 'block', marginBottom: '0.4rem' }}>Price ($)</label>
//                       <input 
//                         type="number" 
//                         step="0.01" 
//                         value={editingItemData.price}
//                         onChange={(e) => setEditingItemData({ ...editingItemData, price: e.target.value })}
//                         required 
//                       />
//                     </div>

//                     <div>
//                       <label className="text-sm text-muted" style={{ display: 'block', marginBottom: '0.4rem' }}>Category Link</label>
//                       <select 
//                         value={editingItemData.categoryId}
//                         onChange={(e) => setEditingItemData({ ...editingItemData, categoryId: e.target.value })}
//                         required
//                       >
//                         {categories.map(cat => (
//                           <option key={cat.id} value={cat.id}>{cat.name}</option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="text-sm text-muted" style={{ display: 'block', marginBottom: '0.4rem' }}>Image URL</label>
//                       <input 
//                         type="url" 
//                         value={editingItemData.image}
//                         onChange={(e) => setEditingItemData({ ...editingItemData, image: e.target.value })}
//                       />
//                     </div>

//                     <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
//                       <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Changes</button>
//                       <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setEditingItemId(null)}>Cancel</button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ==================== ORDERS TAB ==================== */}
//         {activeTab === 'orders' && (
//           <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>

//             {/* Orders Feed */}
//             <div>
//               <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🛒 Orders Feed</h1>
//               <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Update live customer tickets or edit items in cart</p>

//               <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
//                 {['all', 'pending', 'preparing', 'ready', 'completed', 'cancelled'].map(status => (
//                   <button 
//                     key={status}
//                     className={`btn-outline ${orderStatusFilter === status ? 'btn-primary' : ''}`}
//                     onClick={() => setOrderStatusFilter(status)}
//                     style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', textTransform: 'capitalize' }}
//                   >
//                     {status} ({status === 'all' ? orders.length : orders.filter(o => o.status === status).length})
//                   </button>
//                 ))}
//               </div>

//               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '600px' }}>
//                 {filteredOrders.length === 0 ? (
//                   <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
//                     No orders matched this status
//                   </div>
//                 ) : (
//                   [...filteredOrders].reverse().map(order => (
//                     <div 
//                       key={order.id} 
//                       className="glass-card animate-fade-in" 
//                       style={{ 
//                         padding: '1.25rem', 
//                         borderLeft: `4px solid ${
//                           order.status === 'completed' ? 'var(--success)' : 
//                           order.status === 'ready' ? 'var(--info)' : 
//                           order.status === 'preparing' ? 'var(--primary)' : 
//                           order.status === 'cancelled' ? 'var(--danger)' : 'var(--warning)'
//                         }`
//                       }}
//                     >
//                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
//                         <div>
//                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                             <strong style={{ fontSize: '1.15rem', color: '#fff' }}>Order #{order.id}</strong>
//                             <span className="text-xs text-muted">({order.branch})</span>
//                           </div>
//                           <div className="text-xs text-muted" style={{ marginTop: '0.2rem' }}>{order.timestamp}</div>
//                         </div>
//                         <div style={{ textAlign: 'right' }}>
//                           <span className={`badge badge-${order.status}`} style={{ marginRight: '0.5rem' }}>{order.status}</span>
//                           <strong style={{ fontSize: '1.2rem', color: '#fff' }}>${(order.total || 0).toFixed(2)}</strong>
//                         </div>
//                       </div>

//                       <div style={{ padding: '0.75rem', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
//                         {(order.items || []).map((item, idx) => (
//                           <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
//                             <span>{item.qty}x {item.name}</span>
//                             <span className="text-muted">${(item.price * item.qty).toFixed(2)}</span>
//                           </div>
//                         ))}
//                       </div>

//                       {/* Status updates & Actions */}
//                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
//                         <div style={{ display: 'flex', gap: '0.35rem' }}>
//                           {['pending', 'preparing', 'ready', 'completed'].map(st => (
//                             <button 
//                               key={st}
//                               className={`btn-outline ${order.status === st ? 'btn-primary' : ''}`}
//                               onClick={() => updateOrderStatus(order.id, st)}
//                               style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', textTransform: 'capitalize' }}
//                             >
//                               {st}
//                             </button>
//                           ))}
//                         </div>

//                         <div style={{ display: 'flex', gap: '0.4rem' }}>
//                           <button 
//                             className="btn-secondary" 
//                             style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
//                             onClick={() => startEditOrder(order)}
//                             disabled={editingOrderId === order.id}
//                           >
//                             <Edit size={12} /> Edit
//                           </button>
//                           <button 
//                             className="btn-warning" 
//                             style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: '#fff' }}
//                             onClick={() => {
//                               if (confirm('Cancel this order?')) {
//                                 updateOrderStatus(order.id, 'cancelled');
//                               }
//                             }}
//                           >
//                             Cancel
//                           </button>
//                           <button 
//                             className="btn-danger" 
//                             style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
//                             onClick={() => {
//                               if (confirm('Permanently delete this order?')) {
//                                 deleteOrder(order.id);
//                               }
//                             }}
//                           >
//                             <Trash2 size={12} /> Delete
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>

//             {/* Sticky Edit/Create Order Panel */}
//             <div style={{ height: 'fit-content', position: 'sticky', top: '2rem' }}>
//               <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//                 <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                   {editingOrderId ? `Edit Order #${editingOrderId}` : 'Create Admin Order'}
//                 </h3>

//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '0.25rem' }}>
//                   <label className="text-xs text-muted" style={{ fontWeight: 'bold' }}>Quick Add Items</label>
//                   {categories.map(cat => {
//                     const items = getMenuItemsByCategory(cat.id);
//                     if (items.length === 0) return null;
//                     return (
//                       <div key={cat.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.4rem', marginBottom: '0.4rem' }}>
//                         <div style={{ fontSize: '0.75rem', color: cat.color, fontWeight: 'bold', marginBottom: '0.2rem' }}>{cat.name}</div>
//                         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
//                           {items.map(item => (
//                             <button 
//                               key={item.id} 
//                               className="btn-outline" 
//                               style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', borderColor: 'rgba(255,255,255,0.1)' }}
//                               onClick={() => addToCart(item)}
//                             >
//                               +{item.name} (${item.price})
//                             </button>
//                           ))}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1rem 0', maxHeight: '280px', overflowY: 'auto' }}>
//                   {cart.length === 0 ? (
//                     <p className="text-muted text-center text-sm" style={{ padding: '1rem 0' }}>Cart is empty</p>
//                   ) : (
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
//                       {cart.map(item => (
//                         <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
//                           <div style={{ fontSize: '0.85rem' }}>
//                             <div style={{ fontWeight: 'bold' }}>{item.name}</div>
//                             <div className="text-xs text-muted">${item.price.toFixed(2)}</div>
//                           </div>

//                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
//                             <button className="btn-outline" style={{ padding: '0.15rem 0.35rem', fontSize: '0.75rem' }} onClick={() => updateCartQty(item.id, item.qty - 1)}>-</button>
//                             <span style={{ fontSize: '0.85rem', width: '15px', textAlign: 'center' }}>{item.qty}</span>
//                             <button className="btn-outline" style={{ padding: '0.15rem 0.35rem', fontSize: '0.75rem' }} onClick={() => updateCartQty(item.id, item.qty + 1)}>+</button>
//                             <button className="btn-danger" style={{ padding: '0.15rem 0.35rem', fontSize: '0.75rem' }} onClick={() => removeFromCart(item.id)}>x</button>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {cart.length > 0 && (
//                   <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                       <span>Subtotal:</span>
//                       <span>${(cart.reduce((sum, item) => sum + (item.price * item.qty), 0)).toFixed(2)}</span>
//                     </div>
//                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                       <span>VAT (14%):</span>
//                       <span>${(cart.reduce((sum, item) => sum + (item.price * item.qty), 0) * 0.14).toFixed(2)}</span>
//                     </div>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '0.95rem', borderTop: '1px solid var(--border)', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
//                       <span>Total:</span>
//                       <span>${(cart.reduce((sum, item) => sum + (item.price * item.qty), 0) * 1.14).toFixed(2)}</span>
//                     </div>
//                   </div>
//                 )}

//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
//                   <button className="btn-success" style={{ width: '100%' }} onClick={saveOrder} disabled={cart.length === 0}>
//                     {editingOrderId ? 'Save Changes' : 'Checkout Order'}
//                   </button>
//                   {editingOrderId && (
//                     <button className="btn-secondary" style={{ width: '100%' }} onClick={cancelEdit}>
//                       Cancel Edit
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>

//           </div>
//         )}

//         {/* ==================== BRANCHES TAB ==================== */}
//         {activeTab === 'branches' && (
//           <div className="animate-fade-in">
//             <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🏢 Branch Management</h1>
//             <p className="text-muted" style={{ marginBottom: '2rem' }}>Add or delete franchise locations for Shawarma house networks</p>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
//               {/* Form */}
//               <div className="glass-card" style={{ padding: '1.75rem', height: 'fit-content' }}>
//                 <h3 style={{ marginBottom: '1.25rem', fontSize: '1.15rem' }}>Register New Branch</h3>
//                 <form onSubmit={handleAddBranch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//                   <div>
//                     <label className="text-sm text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Branch Name</label>
//                     <input 
//                       type="text" 
//                       placeholder="e.g., Cairo Heliopolis" 
//                       value={newBranchName} 
//                       onChange={e => setNewBranchName(e.target.value)} 
//                       required 
//                     />
//                   </div>
//                   <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
//                     <Plus size={18} /> Add Branch
//                   </button>
//                 </form>
//               </div>

//               {/* List */}
//               <div className="glass-card" style={{ padding: '1.75rem' }}>
//                 <h3 style={{ marginBottom: '1.25rem', fontSize: '1.15rem' }}>Active Branches Network</h3>

//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
//                   {branches.map(b => {
//                     const isSelected = b === currentBranch;
//                     return (
//                       <div 
//                         key={b} 
//                         style={{ 
//                           display: 'flex', 
//                           justifyContent: 'space-between', 
//                           alignItems: 'center', 
//                           padding: '1rem 1.25rem', 
//                           backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255,255,255,0.01)', 
//                           border: isSelected ? '1px solid rgba(99,102,241,0.3)' : '1px solid var(--border)',
//                           borderRadius: 'var(--radius-md)' 
//                         }}
//                       >
//                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setCurrentBranch(b)}>
//                           <Store size={20} style={{ color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }} />
//                           <div>
//                             <span style={{ fontWeight: isSelected ? 'bold' : 'normal', fontSize: '1.05rem', color: '#fff' }}>{b}</span>
//                             {isSelected && <span className="badge badge-preparing" style={{ marginLeft: '0.75rem', fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>ACTIVE SCOPE</span>}
//                           </div>
//                         </div>

//                         <button 
//                           className="btn-danger" 
//                           style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
//                           onClick={() => {
//                             if (confirm(`Delete branch "${b}"? This will clear all data matching this branch!`)) {
//                               deleteBranch(b);
//                             }
//                           }}
//                           disabled={branches.length <= 1}
//                         >
//                           <Trash2 size={14} /> Delete
//                         </button>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ==================== USERS TAB ==================== */}
//         {activeTab === 'users' && (
//           <div className="animate-fade-in">
//             <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>👥 User Roles & Permissions</h1>
//             <p className="text-muted" style={{ marginBottom: '2rem' }}>Manage employees access keys for cashiers, cooks, and admins</p>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
//               {/* Form */}
//               <div className="glass-card" style={{ padding: '1.75rem', height: 'fit-content' }}>
//                 <h3 style={{ marginBottom: '1.25rem', fontSize: '1.15rem' }}>
//                   {editingUserId ? 'Edit User Credentials' : 'Add Employee Account'}
//                 </h3>

//                 {editingUserId ? (
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
//                     <div>
//                       <label className="text-sm text-muted" style={{ display: 'block', marginBottom: '0.4rem' }}>Employee Name</label>
//                       <input 
//                         type="text" 
//                         value={editingUserData.name} 
//                         onChange={e => setEditingUserData({ ...editingUserData, name: e.target.value })} 
//                         required 
//                       />
//                     </div>

//                     <div>
//                       <label className="text-sm text-muted" style={{ display: 'block', marginBottom: '0.4rem' }}>Login Email</label>
//                       <input 
//                         type="email" 
//                         value={editingUserData.email} 
//                         onChange={e => setEditingUserData({ ...editingUserData, email: e.target.value })} 
//                         required 
//                       />
//                     </div>

//                     <div>
//                       <label className="text-sm text-muted" style={{ display: 'block', marginBottom: '0.4rem' }}>Assigned Access Role</label>
//                       <select 
//                         value={editingUserData.role} 
//                         onChange={e => setEditingUserData({ ...editingUserData, role: e.target.value })}
//                         required
//                       >
//                         <option value="admin">Admin Manager</option>
//                         <option value="cashier">Branch Cashier</option>
//                         <option value="kitchen">Kitchen Chef</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="text-sm text-muted" style={{ display: 'block', marginBottom: '0.4rem' }}>Branch</label>
//                       <select 
//                         value={editingUserData.branch} 
//                         onChange={e => setEditingUserData({ ...editingUserData, branch: e.target.value })}
//                         required
//                       >
//                         {branches.map(b => (
//                           <option key={b} value={b}>{b}</option>
//                         ))}
//                       </select>
//                     </div>

//                     <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
//                       <button className="btn-success" style={{ flex: 1 }} onClick={saveEditUser}>Save Changes</button>
//                       <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setEditingUserId(null)}>Cancel</button>
//                     </div>
//                   </div>
//                 ) : (
//                   <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
//                     <div>
//                       <label className="text-sm text-muted" style={{ display: 'block', marginBottom: '0.4rem' }}>Employee Name</label>
//                       <input 
//                         type="text" 
//                         placeholder="e.g., Ahmed Ali" 
//                         value={newUserName} 
//                         onChange={e => setNewUserName(e.target.value)} 
//                         required 
//                       />
//                     </div>

//                     <div>
//                       <label className="text-sm text-muted" style={{ display: 'block', marginBottom: '0.4rem' }}>Login Email</label>
//                       <input 
//                         type="email" 
//                         placeholder="e.g., ahmed@pos.com" 
//                         value={newUserEmail} 
//                         onChange={e => setNewUserEmail(e.target.value)} 
//                         required 
//                       />
//                     </div>

//                     <div>
//                       <label className="text-sm text-muted" style={{ display: 'block', marginBottom: '0.4rem' }}>Assigned Access Role</label>
//                       <select 
//                         value={newUserRole} 
//                         onChange={e => setNewUserRole(e.target.value)}
//                         required
//                       >
//                         <option value="admin">Admin Manager</option>
//                         <option value="cashier">Branch Cashier</option>
//                         <option value="kitchen">Kitchen Chef</option>
//                       </select>
//                     </div>

//                     <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
//                       <Plus size={18} /> Register Employee
//                     </button>
//                   </form>
//                 )}
//               </div>

//               {/* Table list */}
//               <div className="glass-card" style={{ padding: '1.75rem' }}>
//                 <h3 style={{ marginBottom: '1.25rem', fontSize: '1.15rem' }}>Registered Branch Staff ({filteredUsers.length})</h3>

//                 <div style={{ overflowX: 'auto' }}>
//                   <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
//                     <thead>
//                       <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
//                         <th style={{ padding: '0.75rem 1rem' }}>Name</th>
//                         <th style={{ padding: '0.75rem 1rem' }}>Email</th>
//                         <th style={{ padding: '0.75rem 1rem' }}>Access Level</th>
//                         <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredUsers.length === 0 ? (
//                         <tr>
//                           <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
//                             No employee accounts registered at this branch yet.
//                           </td>
//                         </tr>
//                       ) : (
//                         filteredUsers.map(user => (
//                           <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
//                             <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold', color: '#fff' }}>{user.name}</td>
//                             <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.email || '—'}</td>
//                             <td style={{ padding: '0.75rem 1rem' }}>
//                               <span className={`badge ${
//                                 user.role === 'admin' ? 'badge-cancelled' : 
//                                 user.role === 'kitchen' ? 'badge-pending' : 'badge-ready'
//                               }`} style={{ textTransform: 'capitalize' }}>
//                                 {user.role}
//                               </span>
//                             </td>
//                             <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
//                               <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
//                                 <button className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => startEditUser(user)}>
//                                   <Edit size={12} /> Edit
//                                 </button>
//                                 <button className="btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => {
//                                   if (confirm(`Remove employee account for "${user.name}"?`)) {
//                                     deleteUser(user.id);
//                                   }
//                                 }}>
//                                   <Trash2 size={12} /> Delete
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//       </div>

//     </div>
//   );
// }


import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Tag, Coffee, ShoppingBag, Store, Users, LogOut,
  Plus, Edit, Trash2, X, Check, TrendingUp, DollarSign, Calendar, Flame, Edit3
} from 'lucide-react';

export default function Admin() {
  const {
    setUserRole, orders, updateOrderStatus, deleteOrder, editOrder, addOrder,
    menuItems, addMenuItem, editMenuItem, deleteMenuItem,
    categories, addCategory, editCategory, deleteCategory,
    currentBranch, branches, addBranch, deleteBranch,
    users, addUser, editUser, deleteUser, setCurrentBranch,
    language, setLang, t
  } = useApp();
  const navigate = useNavigate();

  const filteredUsers = users.filter(u => u.branch === currentBranch);

  // Navigation tab state: 'dashboard', 'categories', 'menu', 'orders', 'branches', 'users'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Add Item State
  const [newItem, setNewItem] = useState({ name: '', price: '', categoryId: '', image: '' });

  // Edit Item State
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItemData, setEditingItemData] = useState({ name: '', price: '', categoryId: '', image: '' });

  // Category States
  const [newCategory, setNewCategory] = useState({ name: '', color: '#6366f1' });
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryData, setEditingCategoryData] = useState({ name: '', color: '' });

  // Order/Cart State
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [cart, setCart] = useState([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Date Filter State
  const [dateFilterType, setDateFilterType] = useState('all'); // all, today, week, month, custom
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Branch/User Management States
  const [newBranchName, setNewBranchName] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('cashier');
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUserData, setEditingUserData] = useState({ name: '', email: '', role: 'cashier', branch: '' });

  const handleLogout = () => {
    setUserRole(null, null);
    navigate('/login');
  };

  const getMenuItemsByCategory = (categoryId) => {
    return menuItems.filter(item => item.categoryId === parseInt(categoryId) || item.categoryId === categoryId);
  };

  // Date Filter Helper
  const getFilteredOrdersByDate = () => {
    const now = new Date();
    let filtered = orders;

    if (dateFilterType === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = orders.filter(o => {
        const orderDate = new Date(o.timestamp);
        return new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate()) >= today;
      });
    } else if (dateFilterType === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = orders.filter(o => new Date(o.timestamp) >= weekAgo);
    } else if (dateFilterType === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = orders.filter(o => new Date(o.timestamp) >= monthAgo);
    } else if (dateFilterType === 'custom' && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59);
      filtered = orders.filter(o => {
        const oDate = new Date(o.timestamp);
        return oDate >= start && oDate <= end;
      });
    }
    return filtered;
  };

  const filteredOrdersByDate = getFilteredOrdersByDate();

  // Category Management
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.name) return;
    addCategory({
      name: newCategory.name,
      color: newCategory.color
    });
    setNewCategory({ name: '', color: '#6366f1' });
  };

  const handleEditCategory = (id) => {
    const cat = categories.find(c => c.id === id);
    setEditingCategoryId(id);
    setEditingCategoryData({ name: cat.name, color: cat.color });
  };

  const handleSaveCategory = (id) => {
    editCategory(id, editingCategoryData);
    setEditingCategoryId(null);
    setEditingCategoryData({ name: '', color: '' });
  };

  // Menu Management
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price || !newItem.categoryId) return;
    addMenuItem({
      name: newItem.name,
      price: parseFloat(newItem.price),
      categoryId: parseInt(newItem.categoryId),
      image: newItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'
    });
    setNewItem({ name: '', price: '', categoryId: '', image: '' });
  };

  const startEditItem = (item) => {
    setEditingItemId(item.id);
    setEditingItemData({
      name: item.name,
      price: item.price,
      categoryId: item.categoryId,
      image: item.image
    });
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!editingItemData.name || !editingItemData.price || !editingItemData.categoryId) return;
    editMenuItem(editingItemId, {
      name: editingItemData.name,
      price: parseFloat(editingItemData.price),
      categoryId: parseInt(editingItemData.categoryId),
      image: editingItemData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'
    });
    setEditingItemId(null);
  };

  // Cart Management
  const addToCart = (item) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(i => i.id !== id));
  };

  const updateCartQty = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(i => i.id === id ? { ...i, qty } : i));
    }
  };

  const startEditOrder = (order) => {
    setEditingOrderId(order.id);
    setCart(order.items || []);
  };

  const cancelEdit = () => {
    setEditingOrderId(null);
    setCart([]);
  };

  const saveOrder = () => {
    if (cart.length === 0) {
      alert('Cart cannot be empty. If you want to cancel, use the Delete button.');
      return;
    }

    const baseTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const vatAmount = baseTotal * 0.14;
    const finalTotal = baseTotal + vatAmount;

    if (editingOrderId) {
      editOrder(editingOrderId, {
        items: cart,
        baseTotal: baseTotal,
        vatAmount: vatAmount,
        total: finalTotal
      });
      alert('Order updated successfully!');
    } else {
      addOrder({
        id: Date.now().toString().slice(-4),
        branch: currentBranch || 'Admin Branch',
        items: cart,
        baseTotal: baseTotal,
        vatAmount: vatAmount,
        total: finalTotal,
        status: 'pending',
        timestamp: new Date().toLocaleString()
      });
      alert('New order created successfully!');
    }
    setEditingOrderId(null);
    setCart([]);
  };

  // Calculations (based on filtered orders)
  const totalOrders = filteredOrdersByDate.length;
  const totalRevenue = filteredOrdersByDate
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, order) => sum + (order.total || 0), 0);

  const statusCounts = {
    pending: filteredOrdersByDate.filter(o => o.status === 'pending').length,
    preparing: filteredOrdersByDate.filter(o => o.status === 'preparing').length,
    ready: filteredOrdersByDate.filter(o => o.status === 'ready').length,
    completed: filteredOrdersByDate.filter(o => o.status === 'completed').length,
    cancelled: filteredOrdersByDate.filter(o => o.status === 'cancelled').length,
  };

  // Average order value
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

  const filteredOrders = orderStatusFilter === 'all'
    ? orders
    : orders.filter(o => o.status === orderStatusFilter);

  // Chart data calculations
  const getSalesByCategory = () => {
    const sales = {};
    categories.forEach(cat => {
      sales[cat.id] = { id: cat.id, name: cat.name, color: cat.color, total: 0 };
    });

    filteredOrdersByDate.forEach(order => {
      if (order.status !== 'cancelled') {
        (order.items || []).forEach(item => {
          if (sales[item.categoryId]) {
            sales[item.categoryId].total += item.price * item.qty;
          }
        });
      }
    });
    return Object.values(sales);
  };

  const salesByCategory = getSalesByCategory();
  const maxCategorySales = Math.max(...salesByCategory.map(c => c.total), 1);

  const getRecentSalesChartData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString(undefined, { weekday: 'short' });
      const dateStr = d.toDateString();
      days.push({ label, dateStr, total: 0 });
    }

    filteredOrdersByDate.forEach(order => {
      if (order.status !== 'cancelled') {
        const orderDate = new Date(order.timestamp).toDateString();
        const dayObj = days.find(d => d.dateStr === orderDate);
        if (dayObj) {
          dayObj.total += order.total || 0;
        }
      }
    });
    return days;
  };

  const recentSalesData = getRecentSalesChartData();
  const maxDaySales = Math.max(...recentSalesData.map(d => d.total), 1);

  // Branch & User functions
  const handleAddBranch = (e) => {
    e.preventDefault();
    if (!newBranchName) return;
    addBranch(newBranchName);
    setNewBranchName('');
    alert(`Branch "${newBranchName}" created!`);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    addUser({ name: newUserName, email: newUserEmail, role: newUserRole, branch: currentBranch });
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('cashier');
    alert('User added successfully!');
  };

  const startEditUser = (user) => {
    setEditingUserId(user.id);
    setEditingUserData({
      name: user.name,
      email: user.email || '',
      role: user.role,
      branch: user.branch || currentBranch
    });
  };

  const saveEditUser = () => {
    editUser(editingUserId, editingUserData);
    setEditingUserId(null);
    setEditingUserData({ name: '', email: '', role: 'cashier', branch: '' });
    alert('User updated!');
  };

  return (
    <div className="app-container">

      {/* Sticky Left Navigation Sidebar */}
      <div className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 0.5rem 1.5rem 0.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white' }}>
            <Flame size={22} className="animate-pulse" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>بيت الشاورما</h2>
            <span className="text-xs text-muted">Admin Control Panel</span>
          </div>
        </div>

        {/* Branch Scope Swapper */}
        <div style={{ marginBottom: '1.5rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
          <label className="text-sm text-muted" style={{ display: 'block', marginBottom: '0.25rem' }}>Current Branch</label>
          <select
            value={currentBranch || ''}
            onChange={(e) => setCurrentBranch(e.target.value)}
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.9rem', backgroundColor: 'var(--background)' }}
          >
            {branches.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Tab Navigation Menu */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
          <button
            className={`btn-outline ${activeTab === 'dashboard' ? 'btn-primary' : ''}`}
            style={{ justifyContent: 'flex-start', padding: '0.7rem 1rem' }}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>

          <button
            className={`btn-outline ${activeTab === 'categories' ? 'btn-primary' : ''}`}
            style={{ justifyContent: 'flex-start', padding: '0.7rem 1rem' }}
            onClick={() => setActiveTab('categories')}
          >
            <Tag size={18} /> Categories
          </button>

          <button
            className={`btn-outline ${activeTab === 'menu' ? 'btn-primary' : ''}`}
            style={{ justifyContent: 'flex-start', padding: '0.7rem 1rem' }}
            onClick={() => setActiveTab('menu')}
          >
            <Coffee size={18} /> Menu Items
          </button>

          <button
            className={`btn-outline ${activeTab === 'orders' ? 'btn-primary' : ''}`}
            style={{ justifyContent: 'flex-start', padding: '0.7rem 1rem' }}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={18} /> Orders
          </button>

          <button
            className={`btn-outline ${activeTab === 'branches' ? 'btn-primary' : ''}`}
            style={{ justifyContent: 'flex-start', padding: '0.7rem 1rem' }}
            onClick={() => setActiveTab('branches')}
          >
            <Store size={18} /> Branches
          </button>

          <button
            className={`btn-outline ${activeTab === 'users' ? 'btn-primary' : ''}`}
            style={{ justifyContent: 'flex-start', padding: '0.7rem 1rem' }}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} /> Users
          </button>
        </div>

        {/* Logout at bottom */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <button className="btn-outline" onClick={handleLogout} style={{ width: '100%', gap: '0.5rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="main-content">

        {/* ==================== DASHBOARD TAB ==================== */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>📊 Dashboard</h1>
                <p className="text-muted">Real-time statistics & business reports for {currentBranch}</p>
              </div>

              <button
                className="btn-secondary"
                onClick={() => setLang(language === 'en' ? 'ar' : 'en')}
                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
              >
                {language === 'en' ? '🇸🇦 العربية' : '🇬🇧 English'}
              </button>
            </div>

            {/* Date Filter Panel */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['all', 'today', 'week', 'month', 'custom'].map(type => (
                    <button
                      key={type}
                      className={`btn-outline ${dateFilterType === type ? 'btn-primary' : ''}`}
                      onClick={() => setDateFilterType(type)}
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                      {type === 'all' && 'All Time'}
                      {type === 'today' && 'Today'}
                      {type === 'week' && 'Last 7 Days'}
                      {type === 'month' && 'Last 30 Days'}
                      {type === 'custom' && 'Custom Range'}
                    </button>
                  ))}
                </div>
                {dateFilterType === 'custom' && (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      style={{ padding: '0.4rem', width: '130px', fontSize: '0.85rem' }}
                    />
                    <span className="text-muted">to</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      style={{ padding: '0.4rem', width: '130px', fontSize: '0.85rem' }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Revenue</span>
                  <DollarSign size={18} />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#fff' }}>
                  ${totalRevenue.toFixed(2)}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--success)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Total Orders</span>
                  <ShoppingBag size={18} />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#fff' }}>
                  {totalOrders}
                </div>
                <div className="text-xs text-muted" style={{ marginTop: '0.5rem' }}>Avg: ${avgOrderValue}</div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--warning)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Pending</span>
                  <Calendar size={18} />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#fff' }}>
                  {statusCounts.pending}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--info)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Completed</span>
                  <Check size={18} />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#fff' }}>
                  {statusCounts.completed}
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={18} style={{ color: 'var(--secondary)' }} /> Sales By Category
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {salesByCategory.length === 0 ? (
                    <p className="text-muted text-center">No sales data available</p>
                  ) : (
                    salesByCategory.map(cat => {
                      const percentage = Math.min((cat.total / maxCategorySales) * 100, 100);
                      return (
                        <div key={cat.id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
                            <span style={{ fontWeight: 600 }}>{cat.name}</span>
                            <span className="text-muted">${cat.total.toFixed(2)}</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: cat.color || 'var(--primary)', borderRadius: '999px' }} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={18} style={{ color: 'var(--primary)' }} /> Weekly Sales Trend
                </h3>
                <div style={{ display: 'flex', height: '180px', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.5rem' }}>
                  {recentSalesData.map((day, idx) => {
                    const heightPercent = Math.min((day.total / maxDaySales) * 100, 100);
                    return (
                      <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>${day.total.toFixed(0)}</div>
                        <div style={{ width: '80%', maxWidth: '35px', height: `${Math.max(heightPercent, 4)}%`, background: 'linear-gradient(to top, var(--primary), var(--secondary))', borderRadius: '4px 4px 0 0' }} />
                        <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{day.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>📋 Recent Orders (Last 10)</h3>
              <div className="glass-card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                      <th style={{ padding: '1rem' }}>Order ID</th>
                      <th style={{ padding: '1rem' }}>Time</th>
                      <th style={{ padding: '1rem' }}>Items</th>
                      <th style={{ padding: '1rem' }}>Status</th>
                      <th style={{ padding: '1rem', textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrdersByDate.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No orders found.</td>
                      </tr>
                    ) : (
                      [...filteredOrdersByDate].reverse().slice(0, 10).map(order => (
                        <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '1rem', fontWeight: 'bold' }}>#{order.id}</td>
                          <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{order.timestamp}</td>
                          <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                            {(order.items || []).map(i => `${i.qty}x ${i.name}`).join(', ')}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span className={`badge badge-${order.status}`}>{order.status}</span>
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>${(order.total || 0).toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== CATEGORIES TAB ==================== */}
        {activeTab === 'categories' && (
          <div className="animate-fade-in">
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🏷️ Category Management</h1>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>Organize menu items with customized accent presentation colors</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
              <div className="glass-card" style={{ padding: '1.75rem', height: 'fit-content' }}>
                <h3 style={{ marginBottom: '1.25rem' }}>{editingCategoryId ? 'Edit Category' : 'Create New Category'}</h3>
                <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label className="text-sm text-muted">Category Name</label>
                    <input type="text" placeholder="e.g., Shawarma Platters" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-sm text-muted">Accent UI Color</label>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <input type="color" value={newCategory.color} onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })} style={{ width: '60px', height: '42px', cursor: 'pointer' }} />
                      <input type="text" value={newCategory.color} onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })} />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%' }}><Plus size={18} /> Add Category</button>
                </form>
              </div>

              <div className="glass-card" style={{ padding: '1.75rem' }}>
                <h3>Existing Categories</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1rem' }}>
                  {categories.map(cat => (
                    <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderLeft: `5px solid ${cat.color}`, borderRadius: '4px' }}>
                      {editingCategoryId === cat.id ? (
                        <div style={{ display: 'flex', width: '100%', gap: '0.75rem', alignItems: 'center' }}>
                          <input type="text" value={editingCategoryData.name} onChange={(e) => setEditingCategoryData({ ...editingCategoryData, name: e.target.value })} style={{ flex: 1 }} />
                          <input type="color" value={editingCategoryData.color} onChange={(e) => setEditingCategoryData({ ...editingCategoryData, color: e.target.value })} style={{ width: '40px', height: '35px' }} />
                          <button className="btn-primary" onClick={() => handleSaveCategory(cat.id)}><Check size={16} /></button>
                          <button className="btn-outline" onClick={() => setEditingCategoryId(null)}><X size={16} /></button>
                        </div>
                      ) : (
                        <>
                          <div>
                            <h4 style={{ margin: 0 }}>{cat.name}</h4>
                            <span className="text-xs text-muted">{cat.color}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn-outline" onClick={() => handleEditCategory(cat.id)}><Edit size={14} /></button>
                            <button className="btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => { if (confirm('Delete category?')) deleteCategory(cat.id); }}><Trash2 size={14} /></button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== MENU ITEMS TAB ==================== */}
        {activeTab === 'menu' && (
          <div className="animate-fade-in">
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🍔 Menu Item Records</h1>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>Configure details, pricing, structural category and image thumbnails</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
              <div className="glass-card" style={{ padding: '1.75rem', height: 'fit-content' }}>
                <h3>{editingItemId ? '📝 Edit Item Attributes' : '✨ Add New Menu Item'}</h3>
                <form onSubmit={editingItemId ? handleSaveItem : handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                  <div>
                    <label className="text-sm text-muted">Item Name</label>
                    <input type="text" placeholder="e.g., Spicy Chicken Shawarma" value={editingItemId ? editingItemData.name : newItem.name} onChange={(e) => editingItemId ? setEditingItemData({ ...editingItemData, name: e.target.value }) : setNewItem({ ...newItem, name: e.target.value })} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="text-sm text-muted">Price ($)</label>
                      <input type="number" step="0.01" value={editingItemId ? editingItemData.price : newItem.price} onChange={(e) => editingItemId ? setEditingItemData({ ...editingItemData, price: e.target.value }) : setNewItem({ ...newItem, price: e.target.value })} required />
                    </div>
                    <div>
                      <label className="text-sm text-muted">Category Assignation</label>
                      <select value={editingItemId ? editingItemData.categoryId : newItem.categoryId} onChange={(e) => editingItemId ? setEditingItemData({ ...editingItemData, categoryId: e.target.value }) : setNewItem({ ...newItem, categoryId: e.target.value })} required>
                        <option value="">Select category...</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted">Image Asset URL</label>
                    <input type="url" placeholder="https://images.unsplash.com/..." value={editingItemId ? editingItemData.image : newItem.image} onChange={(e) => editingItemId ? setEditingItemData({ ...editingItemData, image: e.target.value }) : setNewItem({ ...newItem, image: e.target.value })} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>{editingItemId ? 'Save Alterations' : 'Register Item'}</button>
                    {editingItemId && <button type="button" className="btn-outline" onClick={() => setEditingItemId(null)}>Cancel</button>}
                  </div>
                </form>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {categories.map(cat => {
                  const items = getMenuItemsByCategory(cat.id);
                  return (
                    <div key={cat.id} className="glass-card" style={{ padding: '1.5rem' }}>
                      <h3 style={{ borderBottom: `2px solid ${cat.color}`, paddingBottom: '0.5rem' }}>{cat.name}</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                        {items.length === 0 ? <p className="text-muted text-xs italic">No items found.</p> : items.map(item => (
                          <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: '4px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <img src={item.image} alt={item.name} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />
                              <div>
                                <h4 style={{ margin: 0 }}>{item.name}</h4>
                                <span style={{ color: 'var(--success)', fontWeight: 600 }}>${parseFloat(item.price).toFixed(2)}</span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                              <button className="btn-outline" style={{ padding: '0.35rem' }} onClick={() => startEditItem(item)}><Edit size={12} /></button>
                              <button className="btn-outline" style={{ padding: '0.35rem', borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => { if (confirm(`Delete ${item.name}?`)) deleteMenuItem(item.id); }}><Trash2 size={12} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================== ORDERS TAB ==================== */}
        {activeTab === 'orders' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '2rem' }}>🛍️ Master Orders Pipeline</h1>
                <p className="text-muted">Fulfillment tracking, state routing and real-time dispatch monitoring</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['all', 'pending', 'preparing', 'ready', 'completed', 'cancelled'].map(st => (
                  <button key={st} className={`btn-outline text-xs ${orderStatusFilter === st ? 'btn-primary' : ''}`} style={{ padding: '0.4rem 0.75rem', textTransform: 'capitalize' }} onClick={() => setOrderStatusFilter(st)}>{st}</button>
                ))}
              </div>
            </div>

            {editingOrderId && (
              <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3>🛠️ Modification Mode: Order #{editingOrderId}</h3>
                  <button className="btn-outline" onClick={cancelEdit}><X size={14} /> Cancel</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label className="text-xs text-muted">Quick Menu Additions:</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto', marginTop: '0.5rem' }}>
                      {menuItems.map(item => (
                        <button key={item.id} className="btn-outline" style={{ fontSize: '0.8rem', justifyContent: 'space-between' }} onClick={() => addToCart(item)}>
                          <span>{item.name}</span> <span style={{ color: 'var(--success)' }}>+${item.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted">Basket Subtotal Matrix:</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '120px', overflowY: 'auto', margin: '0.5rem 0' }}>
                      {cart.map(cItem => (
                        <div key={cItem.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>{cItem.name}</span>
                          <input type="number" value={cItem.qty} style={{ width: '45px', padding: '0.1rem' }} onChange={(e) => updateCartQty(cItem.id, parseInt(e.target.value) || 0)} />
                        </div>
                      ))}
                    </div>
                    <button className="btn-primary" style={{ width: '100%', fontSize: '0.85rem' }} onClick={saveOrder}>Commit Modifications</button>
                  </div>
                </div>
              </div>
            )}

            <div className="glass-card" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '1rem' }}>ID</th>
                    <th style={{ padding: '1rem' }}>Timestamp/Branch</th>
                    <th style={{ padding: '1rem' }}>Basket Items</th>
                    <th style={{ padding: '1rem' }}>Pricing Summary</th>
                    <th style={{ padding: '1rem' }}>Workflow State Status</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>No matching records found.</td></tr>
                  ) : filteredOrders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem', fontWeight: 'bold' }}>#{order.id}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                        <div>{order.timestamp}</div>
                        <div className="text-xs text-muted">{order.branch}</div>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                        {(order.items || []).map((it, idx) => <span key={idx} style={{ marginRight: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.2rem', borderRadius: '4px' }}>{it.qty}x {it.name}</span>)}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                        <strong>${parseFloat(order.total || 0).toFixed(2)}</strong>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <select className={`badge badge-${order.status}`} value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)}>
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                          <button className="btn-outline" style={{ padding: '0.4rem' }} onClick={() => startEditOrder(order)}><Edit3 size={14} /></button>
                          <button className="btn-outline" style={{ padding: '0.4rem', borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => { if (confirm('Delete order record?')) deleteOrder(order.id); }}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== BRANCHES TAB ==================== */}
        {activeTab === 'branches' && (
          <div className="animate-fade-in">
            <h1 style={{ fontSize: '2rem' }}>🏪 Corporate Branches</h1>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>Isolate workflow data metrics per region location setup</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
              <div className="glass-card" style={{ padding: '1.75rem', height: 'fit-content' }}>
                <h3>Deploy New Branch</h3>
                <form onSubmit={handleAddBranch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  <input type="text" placeholder="e.g., Tagamoa Sector 5" value={newBranchName} onChange={(e) => setNewBranchName(e.target.value)} required />
                  <button type="submit" className="btn-primary"><Plus size={16} /> Deploy Branch</button>
                </form>
              </div>
              <div className="glass-card" style={{ padding: '1.75rem' }}>
                <h3>Active Operational Scopes</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                  {branches.map(br => (
                    <div key={br} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '4px' }}>
                      <span style={{ fontWeight: 600 }}>{br}</span>
                      <button className="btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)', padding: '0.35rem' }} onClick={() => { if (confirm(`Delete ${br}?`)) deleteBranch(br); }}><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== USERS TAB ==================== */}
        {activeTab === 'users' && (
          <div className="animate-fade-in">
            <h1 style={{ fontSize: '2rem' }}>👥 System Operator Accounts</h1>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>Manage role privileges bound to {currentBranch}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.75fr', gap: '2rem' }}>
              <div className="glass-card" style={{ padding: '1.75rem', height: 'fit-content' }}>
                <h3>{editingUserId ? '🔒 Alter Account Details' : '👤 Provision Staff Account'}</h3>
                <form onSubmit={(e) => { e.preventDefault(); editingUserId ? saveEditUser() : handleAddUser(e); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  <input type="text" placeholder="Profile Name" value={editingUserId ? editingUserData.name : newUserName} onChange={(e) => editingUserId ? setEditingUserData({ ...editingUserData, name: e.target.value }) : setNewUserName(e.target.value)} required />
                  <input type="email" placeholder="Email Handle" value={editingUserId ? editingUserData.email : newUserEmail} onChange={(e) => editingUserId ? setEditingUserData({ ...editingUserData, email: e.target.value }) : setNewUserEmail(e.target.value)} required />
                  <select value={editingUserId ? editingUserData.role : newUserRole} onChange={(e) => editingUserId ? setEditingUserData({ ...editingUserData, role: e.target.value }) : setNewUserRole(e.target.value)}>
                    <option value="cashier">Cashier Operator</option>
                    <option value="kitchen">Kitchen Manager</option>
                    <option value="admin">Global Administrator</option>
                  </select>
                  {editingUserId && (
                    <select value={editingUserData.branch} onChange={(e) => setEditingUserData({ ...editingUserData, branch: e.target.value })}>
                      {branches.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  )}
                  <button type="submit" className="btn-primary">Save Operator Card</button>
                </form>
              </div>
              <div className="glass-card" style={{ padding: '1.75rem' }}>
                <h3>Assigned Operators ({currentBranch})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                  {filteredUsers.length === 0 ? <p className="text-muted text-xs italic">No operator accounts assigned here.</p> : filteredUsers.map(user => (
                    <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '4px' }}>
                      <div>
                        <strong>{user.name}</strong> <span className="text-xs text-muted">({user.role})</span>
                        <div className="text-xs text-muted">{user.email}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button className="btn-outline" style={{ padding: '0.35rem' }} onClick={() => startEditUser(user)}><Edit size={12} /></button>
                        <button className="btn-outline" style={{ padding: '0.35rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => { if (confirm('Revoke access?')) deleteUser(user.id); }}><Trash2 size={12} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
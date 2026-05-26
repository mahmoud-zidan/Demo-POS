// import { useState, useEffect } from 'react';
// import { useApp } from '../context/AppContext';
// import { useNavigate } from 'react-router-dom';
// import {
//   ShoppingBag, Trash2, Printer, MapPin, Search, History, X, Plus, Minus, ArrowLeftRight, Check, Store, HelpCircle
// } from 'lucide-react';

// export default function POS() {
//   const { currentBranch, setUserRole, userRole, users, addOrder, deleteOrder, menuItems, categories, orders, updateOrderStatus } = useApp();
//   const currentUser = users.find(u => u.role === userRole && u.branch === currentBranch) || {};
//   const navigate = useNavigate();

//   const [cart, setCart] = useState([]);
//   const [lastOrder, setLastOrder] = useState(null);
//   const [activeCategory, setActiveCategory] = useState(null); // null means All
//   const [isDelivery, setIsDelivery] = useState(false);
//   const [deliveryAddress, setDeliveryAddress] = useState('');
//   const [deliveryFee, setDeliveryFee] = useState(5);
//   const [showKitchenReceipt, setShowKitchenReceipt] = useState(false);

//   // History Drawer State
//   const [showHistory, setShowHistory] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   // Get orders matching current branch (case-insensitive or exact match)
//   const branchOrders = orders.filter(o =>
//     o.branch === currentBranch || (!currentBranch && o.branch === 'Main Branch')
//   );

//   const filteredOrdersHistory = branchOrders.filter(o =>
//     o.id.includes(searchQuery) ||
//     (o.items || []).some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
//   );

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

//   const resetOrder = () => {
//     setCart([]);
//     setLastOrder(null);
//   };

//   const handleLogout = () => {
//     setUserRole(null, null);
//     navigate('/login');
//   };

//   const baseTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
//   const vatAmount = baseTotal * 0.14; // 14% VAT
//   const finalTotal = baseTotal + vatAmount;
//   const displayedTotal = finalTotal + (isDelivery ? deliveryFee : 0);

//   const checkout = () => {
//     const deliveryCost = isDelivery ? deliveryFee : 0;
//     const totalWithDelivery = finalTotal + deliveryCost;
//     const order = {
//       id: Date.now().toString().slice(-4),
//       branch: currentBranch || 'Main Branch',
//       items: cart,
//       baseTotal: baseTotal,
//       vatAmount: vatAmount,
//       deliveryCost: deliveryCost,
//       total: totalWithDelivery,
//       status: 'pending',
//       timestamp: new Date().toLocaleString(),
//       delivery: isDelivery,
//       address: deliveryAddress
//     };
//     addOrder(order);
//     setLastOrder(order);
//     setCart([]);
//     // Print POS receipt
//     setTimeout(() => {
//       window.print();
//     }, 100);
//     // Trigger kitchen receipt print shortly after
//     setTimeout(() => {
//       setShowKitchenReceipt(true);
//       setTimeout(() => {
//         window.print();
//         setShowKitchenReceipt(false);
//       }, 200);
//     }, 300);
//   };

//   const handleReprintReceipt = (order) => {
//     setLastOrder(order);
//     setTimeout(() => {
//       window.print();
//     }, 100);
//   };

//   const cancelOrder = () => {
//     if (lastOrder) {
//       deleteOrder(lastOrder.id);
//       setLastOrder(null);
//       setCart([]);
//       alert(`Order #${lastOrder.id} cancelled/deleted.`);
//     }
//   };

//   const displayItems = activeCategory
//     ? menuItems.filter(item => item.categoryId === activeCategory)
//     : menuItems;

//   const getCategoryColor = (categoryId) => {
//     return categories.find(c => c.id === categoryId)?.color || 'var(--primary)';
//   };

//   const getCategoryName = (categoryId) => {
//     return categories.find(c => c.id === categoryId)?.name || 'General';
//   };

//   return (
//     <>
//       <div className="app-container">

//         {/* Main Grid View: Left/Center area */}
//         <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

//           {/* Header */}
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
//             <div>
//               <h1 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
//                 <Store style={{ color: 'var(--primary)' }} /> Cairo House POS
//               </h1>
//               <span className="text-sm text-muted">Branch: <strong>{currentBranch || 'Main Branch'}</strong></span>
//             </div>

//             <div style={{ display: 'flex', gap: '0.50rem' }}>
//               <button className="btn-secondary" onClick={() => setShowHistory(true)}>
//                 <History size={16} /> Order History
//               </button>
//               <button className="btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={handleLogout}>
//                 Logout
//               </button>
//             </div>
//           </div>

//           {/* Category Filter bar */}
//           <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', whiteSpace: 'nowrap' }}>
//             <button
//               className={`btn-outline ${activeCategory === null ? 'btn-primary' : ''}`}
//               onClick={() => setActiveCategory(null)}
//               style={{ padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-sm)' }}
//             >
//               All Categories
//             </button>

//             {categories.map(category => (
//               <button
//                 key={category.id}
//                 className="btn-outline"
//                 onClick={() => setActiveCategory(category.id)}
//                 style={{
//                   padding: '0.5rem 1.25rem',
//                   borderRadius: 'var(--radius-sm)',
//                   borderColor: category.color,
//                   color: activeCategory === category.id ? 'white' : category.color,
//                   backgroundColor: activeCategory === category.id ? category.color : 'transparent',
//                   boxShadow: activeCategory === category.id ? `0 0 10px ${category.color}44` : 'none'
//                 }}
//               >
//                 {category.name}
//               </button>
//             ))}
//           </div>

//           {/* Menu Items Grid */}
//           <div className="grid grid-cols-4" style={{ flex: 1, contentVisibility: 'auto' }}>
//             {displayItems.length === 0 ? (
//               <div className="glass-card" style={{ gridColumn: 'span 4', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
//                 No dishes registered in this category. Go to Admin to add items.
//               </div>
//             ) : (
//               displayItems.map(item => (
//                 <div
//                   key={item.id}
//                   className="glass-card animate-fade-in"
//                   style={{
//                     cursor: 'pointer',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     borderTop: `4px solid ${getCategoryColor(item.categoryId)}`
//                   }}
//                   onClick={() => addToCart(item)}
//                 >
//                   <div style={{ height: '120px', overflow: 'hidden', position: 'relative' }}>
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                     />
//                     <div style={{ position: 'absolute', bottom: '0.4rem', right: '0.4rem', padding: '0.15rem 0.4rem', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: '#fff' }}>
//                       {getCategoryName(item.categoryId)}
//                     </div>
//                   </div>
//                   <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'space-between', flex: 1 }}>
//                     <h4 style={{ fontSize: '0.95rem', margin: 0, color: '#fff', fontWeight: 'bold' }}>{item.name}</h4>
//                     <p style={{ color: 'var(--primary)', fontWeight: 'bold', margin: 0 }}>${item.price.toFixed(2)}</p>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* Right Cart Sidebar (styled with standard CSS responsive parameters) */}
//         <div className="sidebar" style={{ borderLeft: '1px solid var(--border)', borderRight: 'none', display: 'flex', flexDirection: 'column', height: '100%', flexShrink: 0 }}>
//           <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//             <ShoppingBag size={20} style={{ color: 'var(--secondary)' }} /> Current Order
//           </h3>

//           <div style={{ flex: 1, overflowY: 'auto', margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.25rem' }}>
//             {cart.length === 0 ? (
//               <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}>
//                 <ShoppingBag size={48} style={{ marginBottom: '1rem' }} />
//                 <p className="text-muted text-center">Cart is empty</p>
//               </div>
//             ) : (
//               cart.map(item => (
//                 <div key={item.id} className="glass-card" style={{ padding: '0.75rem', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.01)' }}>
//                   <div style={{ flex: 1, marginRight: '0.5rem' }}>
//                     <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>{item.name}</div>
//                     <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>${item.price.toFixed(2)} each</div>
//                   </div>
//                   <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
//                     <button className="btn-outline" style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }} onClick={() => updateCartQty(item.id, item.qty - 1)}>-</button>
//                     <span style={{ minWidth: '18px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 'bold' }}>{item.qty}</span>
//                     <button className="btn-outline" style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }} onClick={() => updateCartQty(item.id, item.qty + 1)}>+</button>
//                     <button className="btn-danger" style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }} onClick={() => removeFromCart(item.id)}>X</button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <span className="text-muted">Subtotal:</span>
//                 <span>${baseTotal.toFixed(2)}</span>
//               </div>
//               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <span className="text-muted">VAT (14%):</span>
//                 <span>${vatAmount.toFixed(2)}</span>
//               </div>

//               {/* Delivery option */}
//               <div style={{ borderTop: '1px dashed var(--border)', padding: '0.75rem 0 0 0', marginTop: '0.3rem' }}>
//                 <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 600 }}>
//                   <input
//                     type="checkbox"
//                     checked={isDelivery}
//                     onChange={e => setIsDelivery(e.target.checked)}
//                     style={{ marginRight: '0.5rem', width: 'auto' }}
//                   />
//                   Delivery Mode (+${deliveryFee})
//                 </label>
//                 {isDelivery && (
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem', animation: 'fadeIn 0.2s' }}>
//                     <input
//                       type="text"
//                       placeholder="Delivery address"
//                       value={deliveryAddress}
//                       onChange={e => setDeliveryAddress(e.target.value)}
//                     />
//                     <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
//                       <span className="text-xs text-muted" style={{ whiteSpace: 'nowrap' }}>Fee ($):</span>
//                       <input
//                         type="number"
//                         min="0"
//                         value={deliveryFee}
//                         onChange={e => setDeliveryFee(parseFloat(e.target.value) || 0)}
//                         style={{ padding: '0.35rem 0.5rem' }}
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.5rem', marginTop: '0.3rem' }}>
//                 <strong style={{ fontSize: '1rem' }}>Total:</strong>
//                 <strong className="text-xl" style={{ color: 'var(--success)' }}>${displayedTotal.toFixed(2)}</strong>
//               </div>
//             </div>

//             <div style={{ display: 'flex', gap: '0.4rem', flexDirection: 'column' }}>
//               <button className="btn-success" style={{ width: '100%', padding: '0.8rem' }} onClick={checkout} disabled={cart.length === 0}>
//                 إتمام الطلب (Checkout)
//               </button>
//               <button className="btn-outline" style={{ width: '100%', padding: '0.5rem' }} onClick={resetOrder} disabled={cart.length === 0}>
//                 تفريغ السلة (Clear Cart)
//               </button>
//               <button className="btn-danger" style={{ width: '100%', padding: '0.5rem', gap: '0.4rem' }} onClick={cancelOrder} disabled={!lastOrder}>
//                 إلغاء الطلب (Cancel Last Order)
//               </button>
//             </div>
//           </div>
//         </div>

//       </div>

//       {/* --- Overlay Slide-out Order History Drawer --- */}
//       {showHistory && (
//         <div
//           style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}
//           onClick={() => setShowHistory(false)}
//         >
//           <div
//             className="glass animate-fade-in"
//             style={{ width: '100%', maxWidth: '480px', height: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderLeft: '1px solid var(--border)' }}
//             onClick={e => e.stopPropagation()}
//           >
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//               <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
//                 <History size={20} style={{ color: 'var(--primary)' }} /> Order History
//               </h3>
//               <button className="btn-secondary" style={{ padding: '0.25rem', borderRadius: '50%' }} onClick={() => setShowHistory(false)}>
//                 <X size={18} />
//               </button>
//             </div>

//             {/* Search Input */}
//             <div style={{ position: 'relative' }}>
//               <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
//               <input
//                 type="text"
//                 placeholder="Search by ID or dish name..."
//                 value={searchQuery}
//                 onChange={e => setSearchQuery(e.target.value)}
//                 style={{ paddingLeft: '2.25rem' }}
//               />
//             </div>

//             {/* List */}
//             <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.25rem' }}>
//               {filteredOrdersHistory.length === 0 ? (
//                 <p className="text-muted text-center" style={{ marginTop: '3rem' }}>No orders found matching search criteria.</p>
//               ) : (
//                 [...filteredOrdersHistory].reverse().map(order => (
//                   <div key={order.id} className="glass-card" style={{ padding: '1rem', border: '1px solid var(--border)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
//                       <div>
//                         <strong style={{ fontSize: '1rem', color: '#fff' }}>Order #{order.id}</strong>
//                         <div className="text-xs text-muted" style={{ marginTop: '0.15rem' }}>{order.timestamp}</div>
//                       </div>
//                       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
//                         <span className={`badge badge-${order.status}`} style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>{order.status}</span>
//                         <strong style={{ color: 'var(--primary)' }}>${(order.total || 0).toFixed(2)}</strong>
//                       </div>
//                     </div>

//                     <div style={{ padding: '0.5rem', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem', fontSize: '0.8rem' }}>
//                       {(order.items || []).map((i, idx) => (
//                         <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
//                           <span>{i.qty}x {i.name}</span>
//                           <span className="text-muted">${(i.price * i.qty).toFixed(2)}</span>
//                         </div>
//                       ))}
//                     </div>

//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       {order.delivery ? (
//                         <span className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} title={order.address}>
//                           <MapPin size={12} /> Delivery Address
//                         </span>
//                       ) : (
//                         <span></span>
//                       )}

//                       <button
//                         className="btn-primary"
//                         style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', gap: '0.25rem' }}
//                         onClick={() => handleReprintReceipt(order)}
//                       >
//                         <Printer size={12} /> Reprint Receipt
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- Hidden Receipt For Printing --- */}

//     </>
//   );
// }

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ShoppingBag, LogOut, Trash2, Plus, Minus, User, Coffee } from 'lucide-react';

export default function POS() {
  const {
    menuItems, categories, currentBranch, addOrder, setUserRole, language, setLang
  } = useApp();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');

  // Filtering Menu Items
  const filteredMenuItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.categoryId === parseInt(activeCategory) || item.categoryId === activeCategory);

  // Cart Handlers
  const addToCart = (item) => {
    const existing = cart.find(cartItem => cartItem.id === item.id);
    if (existing) {
      setCart(cart.map(cartItem => cartItem.id === item.id ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const updateQty = (id, change) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const nextQty = item.qty + change;
        return nextQty > 0 ? { ...item, qty: nextQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName('');
  };

  // Pricing Architecture
  const baseSubtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const vatAmount = baseSubtotal * 0.14; // 14% Egyptian Statutory VAT rate calculation
  const grandTotal = baseSubtotal + vatAmount;

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cannot process checkout workflow with an empty active ticket.');
      return;
    }

    const orderPayload = {
      id: Date.now().toString().slice(-4),
      branch: currentBranch || 'Cairo Central HQ Focus',
      customer: customerName.trim() || 'Walk-In Customer Asset',
      items: cart,
      baseTotal: baseSubtotal,
      vatAmount: vatAmount,
      total: grandTotal,
      status: 'pending',
      timestamp: new Date().toLocaleString()
    };

    addOrder(orderPayload);
    alert(`Order #${orderPayload.id} Dispatched to Kitchen Pipeline Successfully!`);
    clearCart();
  };

  const handleLogout = () => {
    setUserRole(null, null);
    navigate('/login');
  };

  return (
    <div className="app-container" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', height: '100vh', overflow: 'hidden', padding: 0 }}>

      {/* Primary Left Module: Menu Matrix Selector Catalog */}
      <div style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', overflowY: 'auto', borderRight: '1px solid var(--border)' }}>

        {/* Header Ribbon Actions Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Coffee style={{ color: 'var(--primary)' }} /> Counter Cashier POS Terminal
            </h1>
            <p className="text-xs text-muted" style={{ margin: '0.25rem 0 0 0' }}>Fulfillment Engine Context Scope: <strong>{currentBranch}</strong></p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }} onClick={() => setLang(language === 'en' ? 'ar' : 'en')}>
              {language === 'en' ? '🇸🇦 العربية' : '🇬🇧 English'}
            </button>
            <button className="btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', padding: '0.4rem' }} onClick={handleLogout} title="Sign Out">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Categories Dynamic Ribbon Bar */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          <button
            className={`btn-outline ${activeCategory === 'all' ? 'btn-primary' : ''}`}
            style={{ whiteSpace: 'nowrap', padding: '0.5rem 1.25rem' }}
            onClick={() => setActiveCategory('all')}
          >
            All Items
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`btn-outline ${activeCategory === String(cat.id) ? 'btn-primary' : ''}`}
              style={{
                whiteSpace: 'nowrap',
                padding: '0.5rem 1.25rem',
                borderBottom: activeCategory !== String(cat.id) ? `3px solid ${cat.color}` : '1px solid transparent'
              }}
              onClick={() => setActiveCategory(String(cat.id))}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Dynamic Catalog Interactive Grid Items */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', flex: 1 }}>
          {filteredMenuItems.map(item => (
            <div
              key={item.id}
              className="glass-card hover:scale-[1.02]"
              style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s ease' }}
              onClick={() => addToCart(item)}
            >
              <div style={{ position: 'relative', height: '120px', width: '100%' }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: 'var(--background)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--success)', border: '1px solid var(--border)' }}>
                  ${parseFloat(item.price).toFixed(2)}
                </div>
              </div>
              <div style={{ padding: '0.85rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, lineHeight: '1.3' }}>{item.name}</h3>
                <span className="text-xs text-muted" style={{ marginTop: '0.5rem', display: 'block' }}>Click to append to ticket</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Module Panel Side Drawer: Active Basket Order Checkout Manifest */}
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.01)', display: 'flex', flexDirection: 'column', height: '100%', borderLeft: '1px solid var(--border)' }}>

        {/* Guest Input Manifest Banner */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
            <ShoppingCart size={20} />
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Active Checkout Ticket</h2>
          </div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <User size={14} style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Guest Identification Name..."
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{ paddingLeft: '2.25rem', fontSize: '0.9rem', width: '100%' }}
            />
          </div>
        </div>

        {/* Scrollable Itemized Basket Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {cart.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', gap: '0.5rem' }}>
              <ShoppingBag size={32} strokeWidth={1.5} />
              <p style={{ fontSize: '0.85rem', margin: 0 }} className="italic">Active transaction receipt manifest is empty</p>
            </div>
          ) : (
            cart.map(cItem => (
              <div key={cItem.id} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', alignItems: 'center' }}>
                <img src={cItem.image} alt={cItem.name} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cItem.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 500 }}>${(cItem.price * cItem.qty).toFixed(2)}</span>
                </div>

                {/* Modifier Micro-Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <button className="btn-outline" style={{ padding: '0.25rem', borderRadius: '4px' }} onClick={() => updateQty(cItem.id, -1)}>
                    <Minus size={12} />
                  </button>
                  <span style={{ minWidth: '24px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 'bold' }}>{cItem.qty}</span>
                  <button className="btn-outline" style={{ padding: '0.25rem', borderRadius: '4px' }} onClick={() => updateQty(cItem.id, 1)}>
                    <Plus size={12} />
                  </button>
                  <button className="btn-outline" style={{ padding: '0.25rem', borderColor: 'var(--danger)', color: 'var(--danger)', borderRadius: '4px', marginLeft: '0.25rem' }} onClick={() => removeFromCart(cItem.id)}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Static Billing Summary Calculations and Action Buttons */}
        <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border)', backgroundColor: 'rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Subtotal Gross Basket</span>
              <span>${baseSubtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Statutory Sales VAT Tax (14%)</span>
              <span>${vatAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.5rem', marginTop: '0.25rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
              <span>Grand Total</span>
              <span style={{ color: 'var(--success)' }}>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem', marginTop: '0.25rem' }}>
            <button className="btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', width: '100%' }} onClick={clearCart} disabled={cart.length === 0}>
              Clear
            </button>
            <button className="btn-primary" style={{ width: '100%', fontWeight: 'bold' }} onClick={handleCheckout} disabled={cart.length === 0}>
              Process Ticket
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
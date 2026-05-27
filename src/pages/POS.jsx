import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ShoppingBag, LogOut, Trash2, Plus, Minus, User, Coffee } from 'lucide-react';

export default function POS() {
  const {
    menuItems, categories, currentBranch, addOrder, setUserRole, language, setLang, t
  } = useApp();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  
  // Delivery related states
  const [isDelivery, setIsDelivery] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(5);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  
  // State to hold the last order for receipt printing
  const [lastOrder, setLastOrder] = useState(null);

  // ==============================
  // RECEIPT REFS
  // ==============================
  const customerReceiptRef = useRef(null);
  const kitchenReceiptRef = useRef(null);

  // ==============================
  // AUTO PRINT RECEIPTS
  // ==============================
  useEffect(() => {
    if (!lastOrder) return;

    const printReceipts = async () => {
      // Wait for React to complete rendering the updated DOM
      await new Promise(resolve => setTimeout(resolve, 400));

      const customerReceipt = customerReceiptRef.current?.innerHTML;
      const kitchenReceipt = kitchenReceiptRef.current?.innerHTML;

      if (!customerReceipt || !kitchenReceipt) {
        console.error('Receipt content missing');
        return;
      }

      const printWindow = window.open('', '', 'width=400,height=900');

      printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            *{ box-sizing:border-box; }
            body{ font-family: Arial, sans-serif; color:#000; padding:10px; width:80mm; margin:auto; }
            .receipt{ width:100%; margin-bottom:25px; }
            .center{ text-align:center; }
            .title{ font-size:22px; font-weight:bold; margin-bottom:4px; }
            .subtitle{ font-size:12px; margin-bottom:10px; }
            .line{ border-top:1px dashed #000; margin:10px 0; }
            .item-row{ display:flex; justify-content:space-between; margin-bottom:6px; font-size:14px; }
            .bold{ font-weight:bold; }
            .big{ font-size:18px; }
            .section-title{ font-weight:bold; margin-bottom:8px; margin-top:10px; }
            .kitchen-item{ font-size:18px; font-weight:bold; margin-bottom:8px; }
            .page-break{ page-break-before:always; }
            @media print{
              body{ margin:0; padding:5px; }
              .page-break{ page-break-before:always; }
            }
          </style>
        </head>
        <body>
          ${customerReceipt}
          <div class="page-break"></div>
          ${kitchenReceipt}
        </body>
      </html>
    `);

      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        // Clear after printing
        setLastOrder(null);
      }, 700);
    };

    printReceipts();
  }, [lastOrder]);

  // ==============================
  // LOGIC & HANDLERS
  // ==============================
  
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
      alert(t('pos.emptyError'));
      return;
    }

    const orderPayload = {
      id: Date.now().toString().slice(-4),
      branch: currentBranch || 'Cairo Central HQ Focus',
      customer: customerName.trim() || 'Walk-In Customer Asset',
      items: cart,
      baseTotal: baseSubtotal,
      vatAmount: vatAmount,
      deliveryCost: isDelivery ? deliveryFee : 0,
      total: grandTotal + (isDelivery ? deliveryFee : 0),
      status: 'pending',
      timestamp: new Date().toLocaleString(),
      delivery: isDelivery,
      address: deliveryAddress
    };

    addOrder(orderPayload);
    alert(`${t('admin.orderId')} #${orderPayload.id} ${t('pos.successOrder')}`);
    setLastOrder(orderPayload);
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
              <Coffee style={{ color: 'var(--primary)' }} /> {t('pos.title')}
            </h1>
            <p className="text-xs text-muted" style={{ margin: '0.25rem 0 0 0' }}>{t('pos.fulfillmentScope')} <strong>{currentBranch}</strong></p>
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
            {t('pos.allCategories')}
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
                <span className="text-xs text-muted" style={{ marginTop: '0.5rem', display: 'block' }}>{t('pos.clickToAppend')}</span>
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
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{t('pos.cart')}</h2>
          </div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <User size={14} style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder={t('pos.guestPlaceholder')}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{ paddingLeft: '2.25rem', fontSize: '0.9rem', width: '100%' }}
            />
          </div>
          
          {/* Delivery Option */}
          <div style={{ marginTop: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={isDelivery}
                onChange={e => setIsDelivery(e.target.checked)}
                style={{ marginRight: '0.5rem', width: 'auto' }}
              />
              Delivery (+${deliveryFee})
            </label>
            {isDelivery && (
              <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <input
                  type="text"
                  placeholder="Delivery address"
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  style={{ padding: '0.35rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="text-xs text-muted" style={{ marginRight: '0.5rem' }}>Fee ($):</span>
                  <input
                    type="number"
                    min="0"
                    value={deliveryFee}
                    onChange={e => setDeliveryFee(parseFloat(e.target.value) || 0)}
                    style={{ padding: '0.35rem 0.5rem', width: '80px' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Itemized Basket Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {cart.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', gap: '0.5rem' }}>
              <ShoppingBag size={32} strokeWidth={1.5} />
              <p style={{ fontSize: '0.85rem', margin: 0 }} className="italic">{t('pos.cartEmptyManifest')}</p>
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
              <span className="text-muted">{t('pos.subtotal')}</span>
              <span>${baseSubtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">{t('pos.vat')}</span>
              <span>${vatAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.5rem', marginTop: '0.25rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
              <span>{t('pos.total')}</span>
              <span style={{ color: 'var(--success)' }}>${(grandTotal + (isDelivery ? deliveryFee : 0)).toFixed(2)}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem', marginTop: '0.25rem' }}>
            <button className="btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', width: '100%' }} onClick={clearCart} disabled={cart.length === 0}>
              {t('pos.clearCart')}
            </button>
            <button className="btn-primary" style={{ width: '100%', fontWeight: 'bold' }} onClick={handleCheckout} disabled={cart.length === 0}>
              {t('pos.checkout')}
            </button>
          </div>
        </div>

        {/* Hidden receipts for extraction */}
        {lastOrder && (
          <>
            {/* Customer Receipt */}
            <div ref={customerReceiptRef} style={{ display: 'none' }}>
              <div className="receipt">
                <div className="center">
                  <div className="title">بيت الشاورما</div>
                  <div className="subtitle">Customer Receipt</div>
                </div>
                <div className="line"></div>
                <div className="item-row"><span>Order #</span><span>{lastOrder.id}</span></div>
                <div className="item-row"><span>Date</span><span>{lastOrder.timestamp}</span></div>
                <div className="item-row"><span>Customer</span><span>{lastOrder.customer}</span></div>
                <div className="item-row"><span>Type</span><span>{lastOrder.delivery ? 'Delivery' : 'Pickup'}</span></div>
                <div className="line"></div>
                <div className="section-title">Order Details</div>
                {lastOrder.items.map((item, idx) => (
                  <div key={idx} className="item-row">
                    <span>{item.qty} x {item.name}</span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div className="line"></div>
                <div className="item-row"><span>Subtotal</span><span>${lastOrder.baseTotal.toFixed(2)}</span></div>
                <div className="item-row"><span>VAT 14%</span><span>${lastOrder.vatAmount.toFixed(2)}</span></div>
                {lastOrder.delivery && (
                  <>
                    <div className="item-row"><span>Delivery Fee</span><span>${lastOrder.deliveryCost.toFixed(2)}</span></div>
                    <div style={{ marginTop: '10px', fontSize: '13px' }}>
                      <strong>Address:</strong>
                      <div>{lastOrder.address}</div>
                    </div>
                  </>
                )}
                <div className="line"></div>
                <div className="item-row bold big"><span>Total</span><span>${lastOrder.total.toFixed(2)}</span></div>
                <div className="line"></div>
                <div className="center" style={{ marginTop: '15px', fontSize: '13px' }}>Thank You ❤️</div>
              </div>
            </div>
            
            {/* Kitchen Receipt */}
            <div ref={kitchenReceiptRef} style={{ display: 'none' }}>
              <div className="receipt">
                <div className="center">
                  <div className="title">KITCHEN COPY</div>
                  <div className="subtitle">بيت الشاورما</div>
                </div>
                <div className="line"></div>
                <div className="item-row"><span>Order #</span><span>{lastOrder.id}</span></div>
                <div className="item-row"><span>Time</span><span>{lastOrder.timestamp}</span></div>
                <div className="item-row"><span>Type</span><span style={{ fontWeight: 'bold' }}>{lastOrder.delivery ? 'DELIVERY' : 'PICKUP'}</span></div>
                {lastOrder.delivery && (
                  <>
                    <div className="line"></div>
                    <div style={{ fontSize: '14px' }}><strong>Address:</strong><div>{lastOrder.address}</div></div>
                  </>
                )}
                <div className="line"></div>
                <div className="section-title">ITEMS</div>
                {lastOrder.items.map((item, idx) => (
                  <div key={idx} className="kitchen-item">{item.qty} x {item.name}</div>
                ))}
                <div className="line"></div>
                <div className="center" style={{ fontSize: '22px', fontWeight: 'bold', marginTop: '10px' }}>{lastOrder.delivery ? 'DELIVERY' : 'PICKUP'}</div>
              </div>
            </div>
          </>
        )}
        
        {/* Print-specific styles */}
        <style>{`@media print { .receipt-print { display: block !important; position: static !important; }`}</style>
      </div>
    </div>
  );
}

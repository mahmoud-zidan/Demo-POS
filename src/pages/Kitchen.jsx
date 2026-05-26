import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckSquare, Square, Volume2, LogOut, CheckCircle2, ChevronRight, Flame } from 'lucide-react';

export default function Kitchen() {
  const { setUserRole, orders, updateOrderStatus, categories, t } = useApp();
  const navigate = useNavigate();

  // Active columns filter
  const activeOrders = orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'completed').slice(-8);

  const pendingOrders = activeOrders.filter(o => o.status === 'pending');
  const preparingOrders = activeOrders.filter(o => o.status === 'preparing');
  const readyOrders = activeOrders.filter(o => o.status === 'ready');

  // Trigger state to update relative timers every 10 seconds
  const [timeTrigger, setTimeTrigger] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeTrigger(prev => prev + 1);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Itemized checklist state: key is `orderId-itemIndex`
  const [checkedItems, setCheckedItems] = useState({});

  const toggleItemCheck = (orderId, idx) => {
    const key = `${orderId}-${idx}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Audio Alerts State
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [prevPendingCount, setPrevPendingCount] = useState(pendingOrders.length);

  // Play synthetic ding-dong tone when a new pending order arrives
  const playNotificationSound = () => {
    if (!audioEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      const playTone = (freq, startTime, duration) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        
        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      
      // Ding tone (D5)
      playTone(587.33, audioCtx.currentTime, 0.2);
      // Dong tone (A5) after 120ms
      setTimeout(() => {
        if (audioCtx.state !== 'closed') {
          playTone(880.00, audioCtx.currentTime, 0.35);
        }
      }, 120);
    } catch (err) {
      console.warn("Audio Context blocked or not supported by browser", err);
    }
  };

  // Monitor pending count changes
  useEffect(() => {
    if (pendingOrders.length > prevPendingCount) {
      playNotificationSound();
    }
    setPrevPendingCount(pendingOrders.length);
  }, [pendingOrders.length]);

  const getCategoryColor = (categoryId) => {
    return categories.find(c => c.id === parseInt(categoryId) || c.id === categoryId)?.color || '#6366f1';
  };

  const handleLogout = () => {
    setUserRole(null, null);
    navigate('/login');
  };

  const getOrderAgeString = (timestamp) => {
    try {
      const orderDate = new Date(timestamp);
      if (isNaN(orderDate.getTime())) return '';
      const diffMs = Date.now() - orderDate.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      return `${diffHours}h ago`;
    } catch (e) {
      return '';
    }
  };

  const renderOrderCard = (order) => {
    const isOverdue = (() => {
      try {
        const orderDate = new Date(order.timestamp);
        if (isNaN(orderDate.getTime())) return false;
        // Mark as overdue if waiting in kitchen for over 15 minutes
        return (Date.now() - orderDate.getTime()) > 15 * 60 * 1000;
      } catch (e) {
        return false;
      }
    })();

    return (
      <div 
        key={order.id} 
        className="glass-card animate-fade-in" 
        style={{ 
          padding: '1.25rem', 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '260px', 
          borderLeft: `4px solid ${
            order.status === 'pending' ? 'var(--danger)' : 
            order.status === 'preparing' ? 'var(--warning)' : 'var(--success)'
          }`,
          boxShadow: isOverdue ? '0 0 10px rgba(244,63,94,0.15)' : 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
          <div>
            <strong style={{ fontSize: '1.15rem', color: '#fff' }}>Order #{order.id}</strong>
            <div className="text-xs text-muted" style={{ marginTop: '0.15rem' }}>{order.branch}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
            <span className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, color: isOverdue ? 'var(--danger)' : 'var(--text-muted)' }}>
              <Clock size={12} /> {getOrderAgeString(order.timestamp)}
            </span>
          </div>
        </div>

        {/* Scrollable list of items with checklist functionality */}
        <div style={{ flex: 1, marginBottom: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {(order.items || []).map((item, idx) => {
            const isChecked = checkedItems[`${order.id}-${idx}`];
            return (
              <div 
                key={idx} 
                onClick={() => toggleItemCheck(order.id, idx)}
                style={{ 
                  padding: '0.5rem', 
                  backgroundColor: isChecked ? 'rgba(255,255,255,0.01)' : 'var(--surface-hover)', 
                  borderRadius: 'var(--radius-sm)', 
                  borderLeft: `3px solid ${getCategoryColor(item.categoryId)}`,
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  cursor: 'pointer',
                  opacity: isChecked ? 0.35 : 1,
                  textDecoration: isChecked ? 'line-through' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {isChecked ? <CheckSquare size={14} className="text-muted" /> : <Square size={14} style={{ color: 'var(--text-muted)' }} />}
                <div style={{ flex: 1, fontSize: '0.9rem' }}>
                  <strong style={{ color: '#fff' }}>{item.qty}x {item.name}</strong>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
          {order.status === 'pending' && (
            <button className="btn-primary" style={{ width: '100%', padding: '0.6rem' }} onClick={() => updateOrderStatus(order.id, 'preparing')}>
              {t('kitchen.startPrep')} <ChevronRight size={16} />
            </button>
          )}
          {order.status === 'preparing' && (
            <button className="btn-warning" style={{ width: '100%', padding: '0.6rem', color: 'var(--text-inverse)' }} onClick={() => updateOrderStatus(order.id, 'ready')}>
              {t('kitchen.markReady')} <ChevronRight size={16} />
            </button>
          )}
          {order.status === 'ready' && (
            <button className="btn-success" style={{ width: '100%', padding: '0.6rem' }} onClick={() => updateOrderStatus(order.id, 'completed')}>
              {t('kitchen.complete')} <CheckCircle2 size={16} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="app-container" style={{ flexDirection: 'column' }}>
      
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem', borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(19, 27, 46, 0.5)', backdropFilter: 'blur(10px)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, var(--danger), var(--warning))', color: 'white' }}>
            <Flame size={20} className="animate-pulse" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{t('kitchen.title')}</h2>
            <span className="text-xs text-muted">{t('kitchen.activeTickets')} <strong>{activeOrders.length}</strong></span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Audio Chime controls */}
          <button 
            className={`btn-outline ${audioEnabled ? 'btn-primary' : ''}`}
            onClick={() => {
              setAudioEnabled(!audioEnabled);
              // Test tone immediately
              if (!audioEnabled) {
                setTimeout(() => {
                  try {
                    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain); gain.connect(audioCtx.destination);
                    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
                    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
                    osc.start(); osc.stop(audioCtx.currentTime + 0.1);
                  } catch (e) {}
                }, 100);
              }
            }}
            style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}
          >
            <Volume2 size={16} /> {audioEnabled ? t('kitchen.soundOn') : t('kitchen.muted')}
          </button>
          
          <button className="btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', padding: '0.4rem 0.85rem' }} onClick={handleLogout}>
            <LogOut size={16} /> {t('kitchen.logout')}
          </button>
        </div>
      </div>

      {/* Kanban Board Lanes */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', padding: '2rem', minHeight: 0 }}>
        
        {/* Lane 1: Pending Orders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.5rem', borderBottom: '3px solid var(--danger)' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--danger)', borderRadius: '50%' }}></div>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{t('kitchen.pending')} ({pendingOrders.length})</h3>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.25rem' }}>
            {pendingOrders.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0.35 }}>
                <p className="text-muted text-sm text-center">{t('kitchen.noNewTickets')}</p>
              </div>
            ) : (
              pendingOrders.map(order => renderOrderCard(order))
            )}
          </div>
        </div>

        {/* Lane 2: Preparing Orders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.5rem', borderBottom: '3px solid var(--warning)' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--warning)', borderRadius: '50%' }}></div>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{t('kitchen.preparing')} ({preparingOrders.length})</h3>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.25rem' }}>
            {preparingOrders.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0.35 }}>
                <p className="text-muted text-sm text-center">{t('kitchen.noActivePrep')}</p>
              </div>
            ) : (
              preparingOrders.map(order => renderOrderCard(order))
            )}
          </div>
        </div>

        {/* Lane 3: Ready Orders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.5rem', borderBottom: '3px solid var(--success)' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--success)', borderRadius: '50%' }}></div>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{t('kitchen.ready')} ({readyOrders.length})</h3>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.25rem' }}>
            {readyOrders.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0.35 }}>
                <p className="text-muted text-sm text-center">{t('kitchen.noReadyTickets')}</p>
              </div>
            ) : (
              readyOrders.map(order => renderOrderCard(order))
            )}
          </div>
        </div>

      </div>

      {/* Bottom bar showing completed history */}
      {completedOrders.length > 0 && (
        <div style={{ padding: '1rem 2rem', borderTop: '1px solid var(--border)', backgroundColor: 'rgba(19, 27, 46, 0.3)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--primary)', borderRadius: '50%' }}></div>
            <h4 style={{ fontSize: '0.85rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>{t('kitchen.recentlyServed')}</h4>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            {completedOrders.map(order => (
              <div 
                key={order.id} 
                style={{ 
                  padding: '0.5rem 1rem', 
                  backgroundColor: 'rgba(255,255,255,0.03)', 
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--radius-sm)', 
                  textAlign: 'center',
                  minWidth: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.15rem'
                }}
              >
                <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#fff' }}>#{order.id}</span>
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>{order.timestamp.split(',')[1] || order.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

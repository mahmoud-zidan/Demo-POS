import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Shield,
  ShoppingBag,
  Utensils,
  KeyRound,
  LogIn
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const {
    setUserRole,
    users,
    t
  } = useApp();

  // =========================================
  // LOGIN
  // =========================================
  const handleLogin = (e, customEmail = null) => {
    if (e) e.preventDefault();

    const loginEmail = (customEmail || email || '')
      .trim()
      .toLowerCase();

    console.log('LOGIN EMAIL:', loginEmail);
    console.log('USERS:', users);

    // =========================================
    // FIND USER
    // =========================================

    const matchedUser = users.find(
      (u) =>
        (u.email || '').trim().toLowerCase() === loginEmail
    );

    // =========================================
    // DEFAULT ADMIN LOGIN
    // =========================================

    if (!matchedUser) {

      // Allow admin login even if not inside users array
      if (loginEmail === 'admin@pos.com') {

        console.log('DEFAULT ADMIN LOGIN');

        setUserRole('admin', null);

        navigate('/admin');

        return;
      }

      alert(t('login.userNotFound'));
      return;
    }

    // =========================================
    // NORMALIZE ROLE
    // =========================================

    const role = (matchedUser.role || '')
      .trim()
      .toLowerCase();

    // =========================================
    // BRANCHES ONLY FOR CASHIER & KITCHEN
    // =========================================

    const branch =
      role === 'admin'
        ? null
        : matchedUser.branch || 'Main Branch';

    console.log('MATCHED USER:', matchedUser);
    console.log('ROLE:', role);
    console.log('BRANCH:', branch);

    // =========================================
    // SAVE ROLE
    // =========================================

    setUserRole(role, branch);

    // =========================================
    // NAVIGATION
    // =========================================

    switch (role) {

      case 'admin':
        navigate('/admin');
        break;

      case 'cashier':
        navigate('/pos');
        break;

      case 'kitchen':
        navigate('/kitchen');
        break;

      default:
        console.error('INVALID ROLE:', role);
        alert(t('login.invalidRole'));
        break;
    }
  };

  // =========================================
  // QUICK LOGIN
  // =========================================

  const handleQuickLogin = (roleEmail) => {

    setEmail(roleEmail);

    setPassword('••••••••');

    setTimeout(() => {
      handleLogin(null, roleEmail);
    }, 100);
  };

  return (
    <div
      className="app-container"
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '2rem',
        padding: '1rem'
      }}
    >

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div
        style={{
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease-out'
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            marginBottom: '0.5rem',
            background:
              'linear-gradient(135deg, #ffffff, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          بيت الشاورما
        </h1>

        <p
          className="text-muted"
          style={{
            fontSize: '1.1rem',
            letterSpacing: '1px'
          }}
        >
          BETSHAWERMA POS & KDS
        </p>
      </div>

      {/* ========================================= */}
      {/* MAIN */}
      {/* ========================================= */}

      <div
        style={{
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '900px',
          animation: 'fadeIn 0.7s ease-out'
        }}
      >

        {/* ========================================= */}
        {/* LOGIN FORM */}
        {/* ========================================= */}

        <div
          className="glass-card"
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <KeyRound
              style={{ color: 'var(--primary)' }}
              size={24}
            />

            <h2
              style={{
                fontSize: '1.5rem',
                margin: 0
              }}
            >
              {t('login.title')}
            </h2>
          </div>

          <form
            onSubmit={handleLogin}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >

            {/* EMAIL */}

            <div>
              <label
                className="text-sm text-muted"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem'
                }}
              >
                {t('login.email')}
              </label>

              <input
                type="email"
                placeholder="admin@pos.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            {/* PASSWORD */}

            <div>
              <label
                className="text-sm text-muted"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem'
                }}
              >
                {t('login.password')}
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="btn-primary"
              style={{
                marginTop: '0.5rem',
                width: '100%',
                padding: '0.85rem'
              }}
            >
              <LogIn size={18} />
              {' '}{t('login.signInBtn')}
            </button>

          </form>
        </div>

        {/* ========================================= */}
        {/* QUICK ACCESS */}
        {/* ========================================= */}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%',
            maxWidth: '350px',
            justifyContent: 'center'
          }}
        >

          <h3
            style={{
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)'
            }}
          >
            {t('login.quickAccess')}
          </h3>

          {/* ========================================= */}
          {/* ADMIN */}
          {/* ========================================= */}

          <div
            className="glass-card"
            onClick={() =>
              handleQuickLogin('admin@pos.com')
            }
            style={{
              padding: '1rem 1.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              background:
                'rgba(99, 102, 241, 0.1)',
              borderColor:
                'rgba(99, 102, 241, 0.2)'
            }}
          >

            <div
              style={{
                padding: '0.75rem',
                borderRadius:
                  'var(--radius-sm)',
                backgroundColor:
                  'rgba(99, 102, 241, 0.15)',
                color: 'var(--primary)'
              }}
            >
              <Shield size={20} />
            </div>

            <div>
              <h4 style={{ margin: 0 }}>
                {t('login.admin')}
              </h4>

              <p className="text-xs text-muted">
                Full system management
              </p>
            </div>

          </div>

          {/* ========================================= */}
          {/* CASHIER */}
          {/* ========================================= */}

          <div
            className="glass-card"
            onClick={() =>
              handleQuickLogin('cashier@pos.com')
            }
            style={{
              padding: '1rem 1.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              background:
                'rgba(236, 72, 153, 0.08)',
              borderColor:
                'rgba(236, 72, 153, 0.15)'
            }}
          >

            <div
              style={{
                padding: '0.75rem',
                borderRadius:
                  'var(--radius-sm)',
                backgroundColor:
                  'rgba(236, 72, 153, 0.15)',
                color: 'var(--secondary)'
              }}
            >
              <ShoppingBag size={20} />
            </div>

            <div>
              <h4 style={{ margin: 0 }}>
                {t('login.cashier')}
              </h4>

              <p className="text-xs text-muted">
                Orders & receipts
              </p>
            </div>

          </div>

          {/* ========================================= */}
          {/* KITCHEN */}
          {/* ========================================= */}

          <div
            className="glass-card"
            onClick={() =>
              handleQuickLogin('kitchen@pos.com')
            }
            style={{
              padding: '1rem 1.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              background:
                'rgba(16, 185, 129, 0.08)',
              borderColor:
                'rgba(16, 185, 129, 0.15)'
            }}
          >

            <div
              style={{
                padding: '0.75rem',
                borderRadius:
                  'var(--radius-sm)',
                backgroundColor:
                  'rgba(16, 185, 129, 0.15)',
                color: 'var(--success)'
              }}
            >
              <Utensils size={20} />
            </div>

            <div>
              <h4 style={{ margin: 0 }}>
                {t('login.kitchen')}
              </h4>

              <p className="text-xs text-muted">
                Kitchen orders screen
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
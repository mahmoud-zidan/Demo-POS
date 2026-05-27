import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as fb from '../lib/firestoreHelpers';

// Enable Firestore integration by setting VITE_USE_FIRESTORE=true in your env (keeps localStorage fallback)
const USE_FIRESTORE = import.meta.env.VITE_USE_FIRESTORE === 'true';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(localStorage.getItem('pos_role') || null); 
  const [currentBranch, setCurrentBranch] = useState(localStorage.getItem('pos_branch') || null);
  const [branches, setBranches] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const defaultCategories = [
    { id: 1, name: 'شاورما', color: '#FF6B6B' },
    { id: 2, name: 'مشروبات', color: '#4ECDC4' },
  ];
  const [categories, setCategories] = useState([]);
  const defaultMenu = [
    { id: 1, name: 'شاورما دجاج', price: 5.99, categoryId: 1, image: 'https://images.unsplash.com/photo-1662489679119-94fc3108c5c7?w=500&q=80' },
    { id: 2, name: 'شاورما لحم', price: 6.99, categoryId: 1, image: 'https://images.unsplash.com/photo-1655194451010-0ecb1e9ea4c4?w=500&q=80' },
    { id: 3, name: 'بطاطس', price: 2.99, categoryId: 1, image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&q=80' },
    { id: 4, name: 'مشروب غازي', price: 1.50, categoryId: 2, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80' },
  ];
  
  const { t, i18n } = useTranslation();
  const language = i18n.language || 'en';
  const setLang = (lang) => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('pos_language', lang);
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Load branches: prefer Firestore when enabled, fallback to localStorage
      let branchList = [];
      if (USE_FIRESTORE) {
        try {
          const fbBranches = await fb.fetchBranches();
          if (fbBranches && fbBranches.length > 0) {
            branchList = fbBranches.map(b => b.name);
            localStorage.setItem('pos_branches', JSON.stringify(branchList));
          } else {
            const savedBranches = localStorage.getItem('pos_branches');
            branchList = savedBranches ? JSON.parse(savedBranches) : [];
            // Seed local branches to Firestore
            if (branchList.length > 0) {
              for (const bName of branchList) {
                await fb.addBranchFirestore({ name: bName, createdAt: new Date().toISOString() });
              }
            }
          }
        } catch (err) {
          console.error('Firestore fetchBranches failed', err);
          const savedBranches = localStorage.getItem('pos_branches');
          branchList = savedBranches ? JSON.parse(savedBranches) : [];
        }
      } else {
        const savedBranches = localStorage.getItem('pos_branches');
        branchList = savedBranches ? JSON.parse(savedBranches) : [];
      }
      setBranches(branchList);

      // Determine active branch for this context execution
      let activeBranch = currentBranch;
      if (!activeBranch && branchList.length > 0) {
        activeBranch = branchList[0];
        setCurrentBranch(activeBranch);
        localStorage.setItem('pos_branch', activeBranch);
      }

      // If no branches exist, seed a default 'Main Branch'
      if (branchList.length === 0) {
        activeBranch = 'Main Branch';
        setBranches([activeBranch]);
        localStorage.setItem('pos_branches', JSON.stringify([activeBranch]));
        setCurrentBranch(activeBranch);
        localStorage.setItem('pos_branch', activeBranch);
        if (USE_FIRESTORE) {
          try {
            await fb.addBranchFirestore({ name: activeBranch, createdAt: new Date().toISOString() });
          } catch (err) {
            console.error('Failed to seed default branch to Firestore', err);
          }
        }
      }

      const branchKey = activeBranch ? `${activeBranch}_` : '';

      // Load orders: prefer Firestore when enabled, fallback to localStorage
      if (USE_FIRESTORE) {
        try {
          const fbOrders = await fb.fetchOrders(activeBranch || null);
          if (fbOrders && fbOrders.length > 0) {
            setOrders(fbOrders);
            localStorage.setItem(`pos_orders_${branchKey}`, JSON.stringify(fbOrders));
          } else {
            const savedOrders = localStorage.getItem(`pos_orders_${branchKey}`);
            const localOrders = savedOrders ? JSON.parse(savedOrders) : [];
            setOrders(localOrders);
            // Migrate local orders to Firestore
            if (localOrders.length > 0) {
              for (const ord of localOrders) {
                await fb.addOrderFirestore({ ...ord, branch: ord.branch || activeBranch || null });
              }
            }
          }
        } catch (err) {
          console.error('Firestore fetchOrders failed', err);
          const savedOrders = localStorage.getItem(`pos_orders_${branchKey}`);
          setOrders(savedOrders ? JSON.parse(savedOrders) : []);
        }
      } else {
        const savedOrders = localStorage.getItem(`pos_orders_${branchKey}`);
        setOrders(savedOrders ? JSON.parse(savedOrders) : []);
      }

      // Load categories: prefer Firestore when enabled, fallback to localStorage
      if (USE_FIRESTORE) {
        try {
          const fbCategories = await fb.fetchCategories(activeBranch || null);
          if (fbCategories && fbCategories.length > 0) {
            setCategories(fbCategories);
            localStorage.setItem(`pos_categories_${branchKey}`, JSON.stringify(fbCategories));
          } else {
            const savedCategories = localStorage.getItem(`pos_categories_${branchKey}`);
            if (savedCategories) {
              const parsed = JSON.parse(savedCategories);
              setCategories(parsed);
              // Migrate local categories to Firestore
              for (const cat of parsed) {
                await fb.addCategoryFirestore({ ...cat, branch: activeBranch || null });
              }
            } else {
              setCategories(defaultCategories);
              localStorage.setItem(`pos_categories_${branchKey}`, JSON.stringify(defaultCategories));
              // Seed defaults to Firestore
              for (const cat of defaultCategories) {
                await fb.addCategoryFirestore({ ...cat, branch: activeBranch || null });
              }
            }
          }
        } catch (err) {
          console.error('Firestore fetchCategories failed', err);
          const savedCategories = localStorage.getItem(`pos_categories_${branchKey}`);
          if (savedCategories) {
            setCategories(JSON.parse(savedCategories));
          } else {
            setCategories(defaultCategories);
            localStorage.setItem(`pos_categories_${branchKey}`, JSON.stringify(defaultCategories));
          }
        }
      } else {
        const savedCategories = localStorage.getItem(`pos_categories_${branchKey}`);
        if (savedCategories) {
          setCategories(JSON.parse(savedCategories));
        } else {
          setCategories(defaultCategories);
          localStorage.setItem(`pos_categories_${branchKey}`, JSON.stringify(defaultCategories));
        }
      }

      const savedMenu = localStorage.getItem(`pos_menu_${branchKey}`);
      if (savedMenu) {
        setMenuItems(JSON.parse(savedMenu));
      } else {
        setMenuItems(defaultMenu);
        localStorage.setItem(`pos_menu_${branchKey}`, JSON.stringify(defaultMenu));
      }

      // Load users: prefer Firestore when enabled, fallback to localStorage
      if (USE_FIRESTORE) {
        try {
          const fbUsers = await fb.fetchUsers();
          if (fbUsers && fbUsers.length > 0) {
            setUsers(fbUsers);
            localStorage.setItem('pos_users', JSON.stringify(fbUsers));
          } else {
            const savedUsers = localStorage.getItem('pos_users');
            if (savedUsers) {
              const parsedUsers = JSON.parse(savedUsers);
              setUsers(parsedUsers);
              // Migrate local users to Firestore
              for (const usr of parsedUsers) {
                await fb.addUserFirestore({ ...usr, branch: usr.branch || activeBranch || 'Main Branch' });
              }
            } else {
              const defaultAdmin = [{
                id: Date.now().toString(),
                name: 'atito',
                email: 'admin@pos.com',
                role: 'admin',
                branch: activeBranch || 'Main Branch'
              }];
              setUsers(defaultAdmin);
              localStorage.setItem('pos_users', JSON.stringify(defaultAdmin));
              await fb.addUserFirestore(defaultAdmin[0]);
            }
          }
        } catch (err) {
          console.error('Firestore fetchUsers failed', err);
          const savedUsers = localStorage.getItem('pos_users');
          if (savedUsers) setUsers(JSON.parse(savedUsers));
        }
      } else {
        const savedUsers = localStorage.getItem('pos_users');
        if (savedUsers) setUsers(JSON.parse(savedUsers));
        else {
          const defaultAdmin = [{
            id: Date.now().toString(),
            name: 'atito',
            email: 'admin@pos.com',
            role: 'admin',
            branch: activeBranch || 'Main Branch'
          }];
          setUsers(defaultAdmin);
          localStorage.setItem('pos_users', JSON.stringify(defaultAdmin));
        }
      }
    };

    loadData().then(() => setLoading(false));

    const handleStorageChange = (e) => {
      if (
        e.key && (e.key.startsWith('pos_orders') || 
        e.key.startsWith('pos_menu') || 
        e.key.startsWith('pos_categories') || 
        e.key === 'pos_users')
      ) {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentBranch]);

  const setRoleAndBranch = (role, branch) => {
    setUserRole(role);
    setCurrentBranch(branch);
    if (role) {
      localStorage.setItem('pos_role', role);
      if (branch) localStorage.setItem('pos_branch', branch);
    } else {
      localStorage.removeItem('pos_role');
      localStorage.removeItem('pos_branch');
    }
    // Persist branches list if not already saved
    if (branches.length === 0) {
      const defaultBranch = branch || 'Main';
      const newBranches = [defaultBranch];
      setBranches(newBranches);
      localStorage.setItem('pos_branches', JSON.stringify(newBranches));
    }
  };

  const persistOrderToFirestore = async (order) => {
    if (!USE_FIRESTORE) return;
    try {
      await fb.addOrderFirestore(order);
    } catch (err) {
      console.error('Failed to persist order to Firestore:', err);
    }
  };

  const persistUserToFirestore = async (user) => {
    if (!USE_FIRESTORE) return;
    try {
      await fb.addUserFirestore(user);
    } catch (err) {
      console.error('Failed to persist user to Firestore:', err);
    }
  };

  const persistUserUpdateToFirestore = async (id, data) => {
    if (!USE_FIRESTORE) return;
    try {
      await fb.updateUserFirestore(id, data);
    } catch (err) {
      console.error('Failed to update user in Firestore:', err);
    }
  };

  const persistUserDeleteToFirestore = async (id) => {
    if (!USE_FIRESTORE) return;
    try {
      await fb.deleteUserFirestore(id);
    } catch (err) {
      console.error('Failed to delete user from Firestore:', err);
    }
  };

  const persistOrderUpdateToFirestore = async (id, data) => {
    if (!USE_FIRESTORE) return;
    try {
      await fb.updateOrderFirestore(id, data);
    } catch (err) {
      console.error('Failed to update order in Firestore:', err);
    }
  };

  const persistOrderDeleteToFirestore = async (id) => {
    if (!USE_FIRESTORE) return;
    try {
      await fb.deleteOrderFirestore(id);
    } catch (err) {
      console.error('Failed to delete order from Firestore:', err);
    }
  };

  // ==================== CATEGORY FIRESTORE HELPERS ====================
  const persistCategoryToFirestore = async (category) => {
    if (!USE_FIRESTORE) return;
    try {
      await fb.addCategoryFirestore({ ...category, branch: currentBranch || null });
    } catch (err) {
      console.error('Failed to persist category to Firestore:', err);
    }
  };

  const persistCategoryUpdateToFirestore = async (id, data) => {
    if (!USE_FIRESTORE) return;
    try {
      await fb.updateCategoryFirestore(id, data);
    } catch (err) {
      console.error('Failed to update category in Firestore:', err);
    }
  };

  const persistCategoryDeleteToFirestore = async (id) => {
    if (!USE_FIRESTORE) return;
    try {
      await fb.deleteCategoryFirestore(id);
    } catch (err) {
      console.error('Failed to delete category from Firestore:', err);
    }
  };

  // ==================== BRANCH FIRESTORE HELPERS ====================
  const persistBranchToFirestore = async (name) => {
    if (!USE_FIRESTORE) return;
    try {
      await fb.addBranchFirestore({ name, createdAt: new Date().toISOString() });
    } catch (err) {
      console.error('Failed to persist branch to Firestore:', err);
    }
  };

  const persistBranchDeleteToFirestore = async (name) => {
    if (!USE_FIRESTORE) return;
    try {
      await fb.deleteBranchFirestore(name);
    } catch (err) {
      console.error('Failed to delete branch from Firestore:', err);
    }
  };

  // ==================== ORDER CRUD ====================
  const addOrder = (order) => {
    const branchKey = currentBranch ? `${currentBranch}_` : '';
    const orderWithBranch = { ...order, branch: order.branch || currentBranch || null };
    const newOrders = [...orders, orderWithBranch];
    setOrders(newOrders);
    localStorage.setItem(`pos_orders_${branchKey}`, JSON.stringify(newOrders));
    persistOrderToFirestore(orderWithBranch);
  };

  const updateOrderStatus = (id, newStatus) => {
    const branchKey = currentBranch ? `${currentBranch}_` : '';
    const newOrders = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
    setOrders(newOrders);
    localStorage.setItem(`pos_orders_${branchKey}`, JSON.stringify(newOrders));
    persistOrderUpdateToFirestore(id, { status: newStatus });
  };

  const deleteOrder = (id) => {
    const branchKey = currentBranch ? `${currentBranch}_` : '';
    const newOrders = orders.filter(o => o.id !== id);
    setOrders(newOrders);
    localStorage.setItem(`pos_orders_${branchKey}`, JSON.stringify(newOrders));
    persistOrderDeleteToFirestore(id);
  };

  const editOrder = (id, updatedData) => {
    const branchKey = currentBranch ? `${currentBranch}_` : '';
    const newOrders = orders.map(o => o.id === id ? { ...o, ...updatedData } : o);
    setOrders(newOrders);
    localStorage.setItem(`pos_orders_${branchKey}`, JSON.stringify(newOrders));
    persistOrderUpdateToFirestore(id, updatedData);
  };

  // ==================== MENU ITEM CRUD ====================
  const addMenuItem = (item) => {
    const branchKey = currentBranch ? `${currentBranch}_` : '';
    const newMenu = [...menuItems, { ...item, id: Date.now() }];
    setMenuItems(newMenu);
    localStorage.setItem(`pos_menu_${branchKey}`, JSON.stringify(newMenu));
  };

  const editMenuItem = (id, updatedItem) => {
    const branchKey = currentBranch ? `${currentBranch}_` : '';
    const newMenu = menuItems.map(item => item.id === id ? { ...item, ...updatedItem } : item);
    setMenuItems(newMenu);
    localStorage.setItem(`pos_menu_${branchKey}`, JSON.stringify(newMenu));
  };

  const deleteMenuItem = (id) => {
    const branchKey = currentBranch ? `${currentBranch}_` : '';
    const newMenu = menuItems.filter(item => item.id !== id);
    setMenuItems(newMenu);
    localStorage.setItem(`pos_menu_${branchKey}`, JSON.stringify(newMenu));
  };

  // ==================== CATEGORY CRUD ====================
  const addCategory = (category) => {
    const branchKey = currentBranch ? `${currentBranch}_` : '';
    const newCat = { ...category, id: Date.now() };
    const newCategories = [...categories, newCat];
    setCategories(newCategories);
    localStorage.setItem(`pos_categories_${branchKey}`, JSON.stringify(newCategories));
    persistCategoryToFirestore(newCat);
  };

  const editCategory = (id, updatedCategory) => {
    const branchKey = currentBranch ? `${currentBranch}_` : '';
    const newCategories = categories.map(cat => cat.id === id ? { ...cat, ...updatedCategory } : cat);
    setCategories(newCategories);
    localStorage.setItem(`pos_categories_${branchKey}`, JSON.stringify(newCategories));
    persistCategoryUpdateToFirestore(id, updatedCategory);
  };

  const deleteCategory = (id) => {
    const branchKey = currentBranch ? `${currentBranch}_` : '';
    const newCategories = categories.filter(cat => cat.id !== id);
    setCategories(newCategories);
    localStorage.setItem(`pos_categories_${branchKey}`, JSON.stringify(newCategories));
    persistCategoryDeleteToFirestore(id);
  };

  // ==================== BRANCH CRUD ====================
  const addBranch = (name) => {
    const newBranches = [...branches, name];
    setBranches(newBranches);
    localStorage.setItem('pos_branches', JSON.stringify(newBranches));
    setCurrentBranch(name);
    localStorage.setItem('pos_branch', name);
    persistBranchToFirestore(name);
  };

  const deleteBranch = (name) => {
    const newBranches = branches.filter(b => b !== name);
    setBranches(newBranches);
    localStorage.setItem('pos_branches', JSON.stringify(newBranches));
    if (currentBranch === name) {
      const fallback = newBranches[0] || null;
      setCurrentBranch(fallback);
      if (fallback) localStorage.setItem('pos_branch', fallback); else localStorage.removeItem('pos_branch');
    }
    // Remove stored data for the branch
    const keys = ['orders', 'menu', 'categories', 'users'];
    keys.forEach(k => localStorage.removeItem(`pos_${k}_${name}_`));
    persistBranchDeleteToFirestore(name);
  };




  const value = {
    userRole,
    setUserRole: setRoleAndBranch,
    currentBranch,
    setCurrentBranch,
    branches,
    users,
    orders,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    editOrder,
    menuItems,
    addMenuItem,
    editMenuItem,
    deleteMenuItem,
    categories,
    addCategory,
    editCategory,
    deleteCategory,
    loading,
    language,
    setLang,
    t,
    // Branch management functions (use the Firestore-aware versions defined above)
    addBranch,
    deleteBranch,
    // User management functions
    addUser: (user) => {
      const normalizedUser = {
        ...user,
        id: Date.now().toString(),
        email: (user.email || '').trim().toLowerCase(),
        role: (user.role || 'cashier').trim().toLowerCase(),
        branch: user.branch || currentBranch || 'Main Branch',
      };
      const newUsers = [...users, normalizedUser];
      // Ensure branch is recorded in branches list
      const b = normalizedUser.branch;
      if (b && !branches.includes(b)) {
        const newBranches = [...branches, b];
        setBranches(newBranches);
        localStorage.setItem('pos_branches', JSON.stringify(newBranches));
      }
      setUsers(newUsers);
      localStorage.setItem('pos_users', JSON.stringify(newUsers));
      persistUserToFirestore(normalizedUser);
    },
    editUser: (id, data) => {
      const normalizedData = {
        ...data,
        email: data.email ? data.email.trim().toLowerCase() : data.email,
        role: data.role ? data.role.trim().toLowerCase() : data.role,
      };
      const newUsers = users.map(u => u.id === id ? { ...u, ...normalizedData } : u);
      setUsers(newUsers);
      localStorage.setItem('pos_users', JSON.stringify(newUsers));
      persistUserUpdateToFirestore(id, normalizedData);
    },
    deleteUser: (id) => {
      const newUsers = users.filter(u => u.id !== id);
      setUsers(newUsers);
      localStorage.setItem('pos_users', JSON.stringify(newUsers));
      persistUserDeleteToFirestore(id);
    },
  };

  return (
    <AppContext.Provider value={value}>
      {!loading && children}
    </AppContext.Provider>
  );
};

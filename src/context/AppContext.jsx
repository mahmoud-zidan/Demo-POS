import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
    const loadData = () => {
      // Load branches
      const savedBranches = localStorage.getItem('pos_branches');
      const branchList = savedBranches ? JSON.parse(savedBranches) : [];
      setBranches(branchList);
      // Ensure a current branch is selected
      if (!currentBranch && branchList.length > 0) {
        setCurrentBranch(branchList[0]);
        localStorage.setItem('pos_branch', branchList[0]);
      }

      const branchKey = currentBranch ? `${currentBranch}_` : '';
      // Load orders for current branch
      const savedOrders = localStorage.getItem(`pos_orders_${branchKey}`);
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      else setOrders([]);

      // Load categories for current branch
      const savedCategories = localStorage.getItem(`pos_categories_${branchKey}`);
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      } else {
        setCategories(defaultCategories);
        localStorage.setItem(`pos_categories_${branchKey}`, JSON.stringify(defaultCategories));
      }

      // Load menu for current branch
      const savedMenu = localStorage.getItem(`pos_menu_${branchKey}`);
      if (savedMenu) {
        setMenuItems(JSON.parse(savedMenu));
      } else {
        setMenuItems(defaultMenu);
        localStorage.setItem(`pos_menu_${branchKey}`, JSON.stringify(defaultMenu));
      }

      // Load users globally
      const savedUsers = localStorage.getItem('pos_users');
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      } else {
        const defaultAdmin = [{
          id: Date.now(),
          name: 'atito',
          email: 'admin@pos.com',
          role: 'admin',
          branch: currentBranch || 'Main Branch'
        }];
        setUsers(defaultAdmin);
        localStorage.setItem('pos_users', JSON.stringify(defaultAdmin));
      }
    };
    
    loadData();
    setLoading(false);

    const handleStorageChange = (e) => {
      if (
        e.key.startsWith('pos_orders') || 
        e.key.startsWith('pos_menu') || 
        e.key.startsWith('pos_categories') || 
        e.key === 'pos_users'
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

  const addOrder = (order) => {
    const branchKey = currentBranch ? `${currentBranch}_` : '';
    const newOrders = [...orders, order];
    setOrders(newOrders);
    localStorage.setItem(`pos_orders_${branchKey}`, JSON.stringify(newOrders));
  };

  const updateOrderStatus = (id, newStatus) => {
    const branchKey = currentBranch ? `${currentBranch}_` : '';
    const newOrders = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
    setOrders(newOrders);
    localStorage.setItem(`pos_orders_${branchKey}`, JSON.stringify(newOrders));
  };

  const deleteOrder = (id) => {
    const branchKey = currentBranch ? `${currentBranch}_` : '';
    const newOrders = orders.filter(o => o.id !== id);
    setOrders(newOrders);
    localStorage.setItem(`pos_orders_${branchKey}`, JSON.stringify(newOrders));
  };

  const editOrder = (id, updatedData) => {
    const branchKey = currentBranch ? `${currentBranch}_` : '';
    const newOrders = orders.map(o => o.id === id ? { ...o, ...updatedData } : o);
    setOrders(newOrders);
    localStorage.setItem(`pos_orders_${branchKey}`, JSON.stringify(newOrders));
  };

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

  const addCategory = (category) => {
    const branchKey = currentBranch ? `${currentBranch}_` : '';
    const newCategories = [...categories, { ...category, id: Date.now() }];
    setCategories(newCategories);
    localStorage.setItem(`pos_categories_${branchKey}`, JSON.stringify(newCategories));
  };

  const editCategory = (id, updatedCategory) => {
    const branchKey = currentBranch ? `${currentBranch}_` : '';
    const newCategories = categories.map(cat => cat.id === id ? { ...cat, ...updatedCategory } : cat);
    setCategories(newCategories);
    localStorage.setItem(`pos_categories_${branchKey}`, JSON.stringify(newCategories));
  };

  const deleteCategory = (id) => {
    const branchKey = currentBranch ? `${currentBranch}_` : '';
    const newCategories = categories.filter(cat => cat.id !== id);
    setCategories(newCategories);
    localStorage.setItem(`pos_categories_${branchKey}`, JSON.stringify(newCategories));
  };

  const addBranch = (name) => {
    const newBranches = [...branches, name];
    setBranches(newBranches);
    localStorage.setItem('pos_branches', JSON.stringify(newBranches));
    setCurrentBranch(name);
    localStorage.setItem('pos_branch', name);
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
    // Branch management functions
    addBranch: (name) => {
      const newBranches = [...branches, name];
      setBranches(newBranches);
      localStorage.setItem('pos_branches', JSON.stringify(newBranches));
      setCurrentBranch(name);
      localStorage.setItem('pos_branch', name);
    },
    deleteBranch: (name) => {
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
    },
    // User management functions
    addUser: (user) => {
      const normalizedUser = {
        ...user,
        id: Date.now(),
        email: (user.email || '').trim().toLowerCase(),
        role: (user.role || 'cashier').trim().toLowerCase(),
      };
      const newUsers = [...users, normalizedUser];
      setUsers(newUsers);
      localStorage.setItem('pos_users', JSON.stringify(newUsers));
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
    },
    deleteUser: (id) => {
      const newUsers = users.filter(u => u.id !== id);
      setUsers(newUsers);
      localStorage.setItem('pos_users', JSON.stringify(newUsers));
    },
  };

  return (
    <AppContext.Provider value={value}>
      {!loading && children}
    </AppContext.Provider>
  );
};

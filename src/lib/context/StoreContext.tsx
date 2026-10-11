'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, Category, InquiryItem, StockLog } from '../supabase/database.types';
import { INITIAL_CATEGORIES } from '../data/initialCategories';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { useAuth } from './AuthContext';
import { createClient } from '../supabase/client';

interface FilterState {
  search: string;
  categorySlug: string; // 'all', slug, or 'other'
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  lowStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc';
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  customCategories: Category[];
  standardCategories: Category[];
  filteredProducts: Product[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  // Inquiry Cart
  cart: InquiryItem[];
  addToCart: (product: Product, quantity?: number, note?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotalEstimate: number;
  // Inventory actions (Staff/Admin)
  updateStock: (productId: string, newStock: number, note?: string) => Promise<boolean>;
  stockLogs: StockLog[];
  // Product CRUD (Admin)
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<Product>;
  editProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  toggleProductStatus: (id: string) => Promise<boolean>;
  // Dynamic Category CRUD (Admin)
  addCategory: (name: string, description?: string) => Promise<Category>;
  editCategory: (id: string, updates: Partial<Category>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  // Supabase status
  isSupabaseConnected: boolean;
  checkSupabaseConnection: () => Promise<void>;
  resetToDefaultData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEY_PRODUCTS = 'retail_products_data_v1';
const STORAGE_KEY_CATEGORIES = 'retail_categories_data_v1';
const STORAGE_KEY_CART = 'retail_inquiry_cart_v1';
const STORAGE_KEY_LOGS = 'retail_stock_logs_v1';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { role, isStaff, isAdmin, profile } = useAuth();

  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<InquiryItem[]>([]);
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categorySlug: 'all',
    minPrice: 0,
    maxPrice: 10000,
    inStockOnly: false,
    lowStockOnly: false,
    sortBy: 'featured',
  });

  // Load local data and check Supabase on mount
  useEffect(() => {
    try {
      const storedCategories = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      }

      const storedProducts = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (storedProducts) {
        const parsed = JSON.parse(storedProducts);
        const migrated = parsed.map((p: any) => {
          if (p.images && p.images.length > 0) {
            p.images = p.images.map((img: string) =>
              img.includes('1584990347449')
                ? 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80'
                : img.includes('1599827552599')
                ? 'https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?auto=format&fit=crop&w=800&q=80'
                : img
            );
          }
          return p;
        });
        setProducts(migrated);
        localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(migrated));
      }

      const storedCart = localStorage.getItem(STORAGE_KEY_CART);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }

      const storedLogs = localStorage.getItem(STORAGE_KEY_LOGS);
      if (storedLogs) {
        setStockLogs(JSON.parse(storedLogs));
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }

    checkSupabaseConnection();
  }, []);

  // Save changes to localStorage
  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(newProducts));
    } catch (e) {
      console.error(e);
    }
  };

  const saveCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(newCategories));
    } catch (e) {
      console.error(e);
    }
  };

  const saveCart = (newCart: InquiryItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(newCart));
    } catch (e) {
      console.error(e);
    }
  };

  const saveStockLogs = (newLogs: StockLog[]) => {
    setStockLogs(newLogs);
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(newLogs));
    } catch (e) {
      console.error(e);
    }
  };

  const checkSupabaseConnection = async () => {
    const client = createClient();
    if (!client) {
      setIsSupabaseConnected(false);
      return;
    }
    try {
      const { data, error } = await client.from('categories').select('id').limit(1);
      if (!error && data) {
        setIsSupabaseConnected(true);
      } else {
        setIsSupabaseConnected(false);
      }
    } catch {
      setIsSupabaseConnected(false);
    }
  };

  const resetToDefaultData = () => {
    saveProducts(INITIAL_PRODUCTS);
    saveCategories(INITIAL_CATEGORIES);
    saveStockLogs([]);
  };

  // Cart actions
  const addToCart = (product: Product, quantity = 1, note = '') => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      if (note) updated[existingIndex].customerNote = note;
      saveCart(updated);
    } else {
      saveCart([...cart, { product, quantity, customerNote: note }]);
    }
  };

  const removeFromCart = (productId: string) => {
    saveCart(cart.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartTotalEstimate = useMemo(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cart]);

  // Inventory actions (Staff/Admin)
  const updateStock = async (productId: string, newStock: number, note?: string): Promise<boolean> => {
    const target = products.find((p) => p.id === productId);
    if (!target) return false;

    const previousStock = target.stock_quantity;
    const delta = newStock - previousStock;

    const updatedList = products.map((p) =>
      p.id === productId ? { ...p, stock_quantity: Math.max(0, newStock), updated_at: new Date().toISOString() } : p
    );
    saveProducts(updatedList);

    // Add log
    const newLog: StockLog = {
      id: 'log-' + Date.now(),
      product_id: productId,
      product_name: target.name,
      previous_stock: previousStock,
      new_stock: Math.max(0, newStock),
      delta,
      changed_by: profile.id,
      changed_by_name: profile.full_name,
      note: note || `ปรับสต็อกจาก ${previousStock} เป็น ${newStock}`,
      created_at: new Date().toISOString(),
    };
    saveStockLogs([newLog, ...stockLogs]);

    // If connected to Supabase, sync
    const client = createClient();
    if (client) {
      try {
        await client
          .from('products')
          .update({ stock_quantity: Math.max(0, newStock) })
          .eq('id', productId);
      } catch (e) {
        console.error('Supabase stock update error:', e);
      }
    }

    return true;
  };

  // Product CRUD (Admin)
  const addProduct = async (
    productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Product> => {
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now().toString(36),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    saveProducts([newProduct, ...products]);

    const client = createClient();
    if (client) {
      try {
        await client.from('products').insert([newProduct]);
      } catch (e) {
        console.error('Supabase product insert error:', e);
      }
    }

    return newProduct;
  };

  const editProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
    );
    saveProducts(updated);

    const client = createClient();
    if (client) {
      try {
        await client.from('products').update(updates).eq('id', id);
      } catch (e) {
        console.error('Supabase product edit error:', e);
      }
    }

    return true;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    saveProducts(products.filter((p) => p.id !== id));

    const client = createClient();
    if (client) {
      try {
        await client.from('products').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase product delete error:', e);
      }
    }

    return true;
  };

  const toggleProductStatus = async (id: string): Promise<boolean> => {
    const target = products.find((p) => p.id === id);
    if (!target) return false;
    return editProduct(id, { is_active: !target.is_active });
  };

  // Dynamic Category CRUD (Admin)
  const addCategory = async (name: string, description?: string): Promise<Category> => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-ก-๙]/g, '')
      .replace(/\s+/g, '-');

    const newCat: Category = {
      id: 'cat-custom-' + Date.now().toString(36),
      name,
      slug: slug || 'cat-' + Date.now(),
      is_custom: true, // Marked as custom category under "อื่นๆ"
      is_active: true,
      display_order: 10 + categories.length,
      description: description || 'หมวดหมู่ที่สร้างขึ้นโดยผู้ดูแลระบบ',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveCategories([...categories, newCat]);

    const client = createClient();
    if (client) {
      try {
        await client.from('categories').insert([newCat]);
      } catch (e) {
        console.error('Supabase category insert error:', e);
      }
    }

    return newCat;
  };

  const editCategory = async (id: string, updates: Partial<Category>): Promise<boolean> => {
    const updated = categories.map((c) =>
      c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
    );
    saveCategories(updated);

    const client = createClient();
    if (client) {
      try {
        await client.from('categories').update(updates).eq('id', id);
      } catch (e) {
        console.error('Supabase category edit error:', e);
      }
    }

    return true;
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    // Only custom categories can be deleted
    saveCategories(categories.filter((c) => c.id !== id));

    const client = createClient();
    if (client) {
      try {
        await client.from('categories').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase category delete error:', e);
      }
    }

    return true;
  };

  // Categories categorized
  const standardCategories = useMemo(
    () => categories.filter((c) => !c.is_custom),
    [categories]
  );
  const customCategories = useMemo(
    () => categories.filter((c) => c.is_custom),
    [categories]
  );

  // Filter products based on search, category, price, and active role RBAC
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // RBAC: Customer sees only active products
        if (!isStaff && !isAdmin && !product.is_active) {
          return false;
        }

        // Category Filter
        if (filters.categorySlug !== 'all') {
          if (filters.categorySlug === 'other') {
            // Match any custom categories
            const isCustomCat = customCategories.some((c) => c.id === product.category_id);
            if (!isCustomCat) return false;
          } else {
            const matchedCategory = categories.find((c) => c.slug === filters.categorySlug);
            if (matchedCategory && product.category_id !== matchedCategory.id) {
              return false;
            }
          }
        }

        // Price Filter
        if (product.price < filters.minPrice) return false;
        if (filters.maxPrice > 0 && product.price > filters.maxPrice) return false;

        // Stock Filters
        if (filters.inStockOnly && product.stock_quantity <= 0) return false;
        if (filters.lowStockOnly && (product.stock_quantity > 4 || product.stock_quantity === 0)) return false;

        // Search Filter (Thai & English, matches name, SKU, tags, description)
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase().trim();
          const matchName = product.name.toLowerCase().includes(query);
          const matchSku = product.sku?.toLowerCase().includes(query);
          const matchDesc = product.description?.toLowerCase().includes(query);
          const matchTags = product.tags.some((t) => t.toLowerCase().includes(query));
          if (!matchName && !matchSku && !matchDesc && !matchTags) {
            return false;
          }
        }

        return true;
      })
      .map((product) => {
        // Attach category relation
        const cat = categories.find((c) => c.id === product.category_id);
        // RBAC Security: Strip cost_price and staff_notes if customer
        if (!isStaff && !isAdmin) {
          const { cost_price, staff_notes, ...safeProduct } = product;
          return { ...safeProduct, category: cat };
        }
        return { ...product, category: cat };
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        if (filters.sortBy === 'stock-asc') return a.stock_quantity - b.stock_quantity;
        if (filters.sortBy === 'stock-desc') return b.stock_quantity - a.stock_quantity;
        return 0; // featured/default order
      });
  }, [products, categories, customCategories, filters, isStaff, isAdmin]);

  const resetFilters = () => {
    setFilters({
      search: '',
      categorySlug: 'all',
      minPrice: 0,
      maxPrice: 10000,
      inStockOnly: false,
      lowStockOnly: false,
      sortBy: 'featured',
    });
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        customCategories,
        standardCategories,
        filteredProducts,
        filters,
        setFilters,
        resetFilters,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartTotalEstimate,
        updateStock,
        stockLogs,
        addProduct,
        editProduct,
        deleteProduct,
        toggleProductStatus,
        addCategory,
        editCategory,
        deleteCategory,
        isSupabaseConnected,
        checkSupabaseConnection,
        resetToDefaultData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

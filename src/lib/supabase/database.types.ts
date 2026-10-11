export type UserRole = 'customer' | 'staff' | 'admin';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  is_custom: boolean; // true = หมวดหมู่ในกลุ่ม "อื่นๆ" ที่แอดมินสร้างเพิ่ม
  is_active: boolean;
  display_order: number;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string | null;
  price: number;
  cost_price?: number; // Internal: Staff & Admin only
  stock_quantity: number;
  category_id: string | null;
  images: string[];
  tags: string[];
  staff_notes?: string | null; // Internal: Staff & Admin only
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined relation helper
  category?: Category | null;
}

export interface StockLog {
  id: string;
  product_id: string;
  product_name?: string;
  previous_stock: number;
  new_stock: number;
  delta: number;
  changed_by?: string | null;
  changed_by_name?: string | null;
  note?: string | null;
  created_at: string;
}

export interface InquiryItem {
  product: Product;
  quantity: number;
  customerNote?: string;
}

export interface InquirySummary {
  customerName: string;
  customerPhone: string;
  customerContactChannel: 'line' | 'whatsapp' | 'phone';
  generalNotes?: string;
  items: InquiryItem[];
  createdAt: string;
}

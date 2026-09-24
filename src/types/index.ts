export type UserRole = "customer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  address?: string;
  city?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  unit: string;
  category: string;
  image: string;
  inStock: boolean;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | "Pending"
  | "Payment Verified"
  | "Processing"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryFee: number;
  paymentMethod: "bKash";
  bkashNumber: string;
  bkashTrxId: string;
  paymentStatus: "Pending" | "Verified" | "Failed";
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

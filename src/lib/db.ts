import fs from "fs";
import path from "path";
import { User, Product, Order, ChatMessage } from "@/types";

interface DatabaseSchema {
  users: User[];
  products: Product[];
  orders: Order[];
  chatMessages: { [sessionId: string]: ChatMessage[] };
}

const initialProducts: Product[] = [
  {
    id: "prod-1",
    name: "Chinigura Rice Premium",
    price: 139,
    originalPrice: 155,
    unit: "1 kg",
    category: "Groceries",
    image:
      "https://chaldn.com/_mpimage/chinigura-rice-premium-1-kg?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D48071&q=best&v=1&m=400&webp=1",
    inStock: true,
    description: "Aromatic fine grain Chinigura rice, perfect for special biryani, polao, and festive dishes.",
  },
  {
    id: "prod-2",
    name: "Chicken Eggs (Discounted)",
    price: 99,
    originalPrice: 120,
    unit: "12 pcs",
    category: "Groceries",
    image:
      "https://i.chaldn.com/_mpimage/chicken-eggs-discounted-12-pcs?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D77392&q=best&v=1&m=400",
    inStock: true,
    description: "Farm fresh brown layer chicken eggs, sorted and safely packed for daily nutrition.",
  },
  {
    id: "prod-3",
    name: "Potato Regular",
    price: 23,
    originalPrice: 30,
    unit: "1 kg",
    category: "Vegetables",
    image:
      "https://chaldn.com/_mpimage/potato-regular-50-gm-1-kg?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D164304&q=best&v=1&m=400&webp=1",
    inStock: true,
    description: "Freshly harvested local potatoes, clean and medium-sized for everyday cooking.",
  },
  {
    id: "prod-4",
    name: "Moshur Dal Imported",
    price: 55,
    originalPrice: 65,
    unit: "500 gm",
    category: "Groceries",
    image:
      "https://chaldn.com/_mpimage/moshur-dal-imported-500-gm?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D182353&q=best&v=1&m=400&webp=1",
    inStock: true,
    description: "Premium quality imported red lentils (moshur dal), clean and fast cooking.",
  },
  {
    id: "prod-5",
    name: "Red Tomato Fresh",
    price: 35,
    originalPrice: 45,
    unit: "500 gm",
    category: "Vegetables",
    image:
      "https://chaldn.com/_mpimage/red-tomato-25-gm-500-gm?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D64361&q=best&v=1&m=400&webp=1",
    inStock: true,
    description: "Ripe, juicy red tomatoes handpicked directly from selected local growers.",
  },
  {
    id: "prod-6",
    name: "Deshi Gajor (Local Carrot)",
    price: 29,
    originalPrice: 40,
    unit: "500 gm",
    category: "Vegetables",
    image:
      "https://chaldn.com/_mpimage/deshi-gajor-local-carrot-25-gm-500-gm?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D64363&q=best&v=1&m=400&webp=1",
    inStock: true,
    description: "Crisp and naturally sweet local carrots, ideal for salads, cooking, or fresh juices.",
  },
  {
    id: "prod-7",
    name: "Lal Shak (Red Spinach)",
    price: 25,
    originalPrice: 35,
    unit: "1 bundle",
    category: "Vegetables",
    image:
      "https://chaldn.com/_mpimage/lal-shak-red-spinach-1-bundle?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D7226&q=low&v=1&m=400&webp=1",
    inStock: true,
    description: "Freshly cut green and red leafy spinach, rich in iron and dietary antioxidants.",
  },
  {
    id: "prod-8",
    name: "Fresh Red Onion (Deshi Piaj)",
    price: 65,
    originalPrice: 80,
    unit: "1 kg",
    category: "Groceries",
    image:
      "https://chaldn.com/_mpimage/onion-local-50-gm-1-kg?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D129631&q=best&v=1&m=400&webp=1",
    inStock: true,
    description: "Pungent local red onions essential for rich curries and traditional Bengali tadka.",
  },
  {
    id: "prod-9",
    name: "Fresh Green Chili (Kacha Morich)",
    price: 30,
    originalPrice: 40,
    unit: "250 gm",
    category: "Vegetables",
    image:
      "https://chaldn.com/_mpimage/green-chilli-25-gm-250-gm?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D64365&q=best&v=1&m=400&webp=1",
    inStock: true,
    description: "Spicy and crisp farm fresh green chilies packed with vitamin C.",
  },
  {
    id: "prod-10",
    name: "Pure Mustard Oil (Shorishar Tel)",
    price: 185,
    originalPrice: 210,
    unit: "500 ml",
    category: "Oil & Ghee",
    image:
      "https://chaldn.com/_mpimage/radhuni-pure-mustard-oil-500-ml?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D58113&q=best&v=1&m=400&webp=1",
    inStock: true,
    description: "Cold-pressed pure mustard oil offering authentic traditional aroma and flavor.",
  },
];

const initialUsers: User[] = [
  {
    id: "user-admin-1",
    name: "Store Administrator",
    email: "admin@chaldal.com",
    password: "admin123", // Pre-configured admin password
    role: "admin",
    phone: "+8801975300759",
    address: "Chaldal HQ, Plot 14, Block C, Banani",
    city: "Dhaka",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-customer-1",
    name: "Rahim Chowdhury",
    email: "customer@chaldal.com",
    password: "customer123",
    role: "customer",
    phone: "01711223344",
    address: "House 24, Road 5, Dhanmondi",
    city: "Dhaka",
    createdAt: new Date().toISOString(),
  },
];

const initialOrders: Order[] = [
  {
    id: "ORD-94812",
    userId: "user-customer-1",
    customerName: "Rahim Chowdhury",
    customerEmail: "customer@chaldal.com",
    customerPhone: "01711223344",
    deliveryAddress: "House 24, Road 5, Dhanmondi",
    city: "Dhaka",
    items: [
      {
        productId: "prod-1",
        name: "Chinigura Rice Premium",
        price: 139,
        quantity: 2,
        image: initialProducts[0].image,
      },
      {
        productId: "prod-2",
        name: "Chicken Eggs (Discounted)",
        price: 99,
        quantity: 1,
        image: initialProducts[1].image,
      },
    ],
    totalAmount: 377,
    deliveryFee: 0,
    paymentMethod: "bKash",
    bkashNumber: "01711223344",
    bkashTrxId: "BKASH9X738A",
    paymentStatus: "Verified",
    status: "Delivered",
    notes: "Please deliver before 6 PM",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

function getDatabasePath(): string {
  // Use /tmp for serverless Vercel environments if root is read-only
  if (process.env.VERCEL) {
    return path.join("/tmp", "chaldal_db.json");
  }
  return path.join(process.cwd(), "data", "db.json");
}

let inMemoryDb: DatabaseSchema | null = null;

function readDb(): DatabaseSchema {
  const dbPath = getDatabasePath();
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, "utf-8");
      inMemoryDb = JSON.parse(data);
      return inMemoryDb!;
    }
  } catch (error) {
    console.warn("Failed to read database file from disk, using fallback:", error);
  }

  if (inMemoryDb) {
    return inMemoryDb;
  }

  // Initialize fresh database
  const freshDb: DatabaseSchema = {
    users: initialUsers,
    products: initialProducts,
    orders: initialOrders,
    chatMessages: {},
  };

  writeDb(freshDb);
  return freshDb;
}

function writeDb(data: DatabaseSchema): void {
  inMemoryDb = data;
  try {
    const dbPath = getDatabasePath();
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.warn("Failed to write database file to disk, stored in memory:", error);
  }
}

// User Operations
export async function getUsers(): Promise<User[]> {
  const db = readDb();
  return db.users.map(({ password: _, ...u }) => u as User);
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const db = readDb();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function findUserById(id: string): Promise<User | undefined> {
  const db = readDb();
  const user = db.users.find((u) => u.id === id);
  if (!user) return undefined;
  const { password: _, ...safeUser } = user;
  return safeUser as User;
}

export async function createUser(userData: Omit<User, "id" | "createdAt">): Promise<User> {
  const db = readDb();
  const existing = db.users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
  if (existing) {
    throw new Error("A user with this email already exists");
  }

  const newUser: User = {
    ...userData,
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  writeDb(db);

  const { password: _, ...safeUser } = newUser;
  return safeUser as User;
}

export async function updateUser(
  id: string,
  updates: Partial<Omit<User, "id" | "email">>
): Promise<User | undefined> {
  const db = readDb();
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) return undefined;

  db.users[index] = {
    ...db.users[index],
    ...updates,
  };

  writeDb(db);
  const { password: _, ...safeUser } = db.users[index];
  return safeUser as User;
}

// Product Operations
export async function getProducts(): Promise<Product[]> {
  const db = readDb();
  return db.products;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const db = readDb();
  return db.products.find((p) => p.id === id);
}

export async function addProduct(productData: Omit<Product, "id">): Promise<Product> {
  const db = readDb();
  const newProduct: Product = {
    ...productData,
    id: `prod-${Date.now()}`,
  };
  db.products.unshift(newProduct);
  writeDb(db);
  return newProduct;
}

export async function updateProduct(
  id: string,
  updates: Partial<Omit<Product, "id">>
): Promise<Product | undefined> {
  const db = readDb();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return undefined;

  db.products[index] = {
    ...db.products[index],
    ...updates,
  };
  writeDb(db);
  return db.products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = readDb();
  const initialLength = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length !== initialLength) {
    writeDb(db);
    return true;
  }
  return false;
}

// Order Operations
export async function getOrders(): Promise<Order[]> {
  const db = readDb();
  return db.orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const db = readDb();
  return db.orders
    .filter((o) => o.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const db = readDb();
  return db.orders.find((o) => o.id === id);
}

export async function createOrder(
  orderData: Omit<Order, "id" | "createdAt" | "updatedAt">
): Promise<Order> {
  const db = readDb();
  const newOrder: Order = {
    ...orderData,
    id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.orders.unshift(newOrder);
  writeDb(db);
  return newOrder;
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"],
  paymentStatus?: Order["paymentStatus"]
): Promise<Order | undefined> {
  const db = readDb();
  const order = db.orders.find((o) => o.id === id);
  if (!order) return undefined;

  order.status = status;
  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
  }
  order.updatedAt = new Date().toISOString();

  writeDb(db);
  return order;
}

// Support Chat History
export async function getSessionChat(sessionId: string): Promise<ChatMessage[]> {
  const db = readDb();
  return db.chatMessages[sessionId] || [];
}

export async function appendChatMessage(
  sessionId: string,
  message: ChatMessage
): Promise<ChatMessage[]> {
  const db = readDb();
  if (!db.chatMessages[sessionId]) {
    db.chatMessages[sessionId] = [];
  }
  db.chatMessages[sessionId].push(message);
  // Keep last 30 messages per session
  if (db.chatMessages[sessionId].length > 30) {
    db.chatMessages[sessionId].shift();
  }
  writeDb(db);
  return db.chatMessages[sessionId];
}

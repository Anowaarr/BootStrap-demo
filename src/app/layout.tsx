import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import GeminiChatbot from "@/components/GeminiChatbot";

export const metadata: Metadata = {
  title: "Chaldal - Online Grocery Shopping and Delivery in Bangladesh",
  description:
    "Order fresh fruits, vegetables, rice, dal, and everyday groceries in Bangladesh with 1-hour delivery and bKash payment.",
  icons: {
    icon: "/images/dim.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/dim.png" type="image/png" />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              {children}
              <CartDrawer />
              <CheckoutModal />
              <GeminiChatbot />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

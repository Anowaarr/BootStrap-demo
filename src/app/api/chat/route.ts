import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are "Chaldal Assistant", a helpful, polite, and friendly customer care AI for Chaldal - Bangladesh's leading online grocery shopping service.

Store Information & Policies:
- Available Cities: Dhaka, Chattogram, Sylhet, Noakhali, Sundarban, and neighboring regions.
- Delivery Times: 1-hour fast delivery or scheduled slots (8 AM - 10 PM daily).
- Delivery Fee: Standard ৳49. Free home delivery on orders over ৳500!
- Payment Method: bKash Only to Merchant/Store Number: +8801975300759. Customers must send payment via bKash and provide their bKash Number & Transaction ID (TrxID) during checkout.
- Return/Refund Policy: 100% replacement or refund within 24 hours of delivery if any item is damaged or unsatisfied.
- Helpline / Contact: Phone +8801975300759 or email support@chaldal.com.
- Languages: You are bilingual and can respond naturally in both English and Bengali (Bangla), depending on the language the user speaks.
- Keep answers concise, helpful, clear, and reassuring.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, history = [], customApiKey } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${SYSTEM_INSTRUCTION}\n\nUser Question: ${message}`,
                },
              ],
            },
          ],
        });

        const reply = response.text?.trim() || "I'm here to help with your grocery orders, bKash payments, and deliveries. How can I assist you today?";
        return NextResponse.json({ reply });
      } catch (geminiError: any) {
        console.warn("Gemini API call failed, falling back to intelligent assistant:", geminiError?.message);
        // Fallback to intelligent local customer care response if API key is invalid or quota exceeded
        const fallbackReply = generateFallbackResponse(message);
        return NextResponse.json({
          reply: fallbackReply,
          warning: "Served via local Chaldal knowledge base (Gemini key error: " + (geminiError?.message || "unavailable") + ")",
        });
      }
    }

    // Default intelligent grocery response if no API key is provided yet
    const fallbackReply = generateFallbackResponse(message);
    return NextResponse.json({
      reply: fallbackReply,
      note: "Add your Gemini API key in the chat settings or GEMINI_API_KEY environment variable to enable live Gemini AI.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to process chat message" },
      { status: 500 }
    );
  }
}

function generateFallbackResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("bkash") || q.includes("payment") || q.includes("pay") || q.includes("টাকা") || q.includes("পেমেন্ট")) {
    return "We accept bKash payment only! Please send money to our designated bKash number: +8801975300759. After sending, copy your Transaction ID (TrxID) and enter it during checkout. Your order will be verified immediately!";
  }

  if (q.includes("delivery") || q.includes("time") || q.includes("charge") || q.includes("ডেলিভারি")) {
    return "We offer 1-hour fast home delivery across Dhaka, Chattogram, Sylhet, and other cities. Delivery fee is ৳49, and it is completely FREE for orders over ৳500!";
  }

  if (q.includes("egg") || q.includes("rice") || q.includes("potato") || q.includes("price") || q.includes("দাম") || q.includes("চাল") || q.includes("ডিম")) {
    return "Our fresh groceries include Chinigura Rice Premium (৳139/kg), Chicken Eggs 12pcs (৳99), Potato (৳23/kg), Moshur Dal (৳55/500g), Fresh Tomatoes (৳35/500g), and more! You can add them straight to your cart.";
  }

  if (q.includes("contact") || q.includes("phone") || q.includes("call") || q.includes("help") || q.includes("যোগাযোগ")) {
    return "You can reach our 24/7 customer helpline at +8801975300759 or email us at support@chaldal.com. We are always happy to assist you!";
  }

  if (q.includes("admin") || q.includes("login") || q.includes("account")) {
    return "To manage your orders and profile, please click the Login / Profile button in the top navbar. If you have admin credentials, signing in with admin@chaldal.com grants access to the Admin Dashboard.";
  }

  return "Hello! I am your Chaldal Customer Care Assistant. I can help you with grocery items, delivery tracking, bKash payments (+8801975300759), and returns. What would you like to know today?";
}

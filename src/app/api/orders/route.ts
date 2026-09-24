import { NextResponse } from "next/server";
import { getOrders, getUserOrders, createOrder, updateOrderStatus } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (user.role === "admin") {
      const orders = await getOrders();
      return NextResponse.json({ orders });
    } else {
      const orders = await getUserOrders(user.id);
      return NextResponse.json({ orders });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to load orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      city,
      items,
      totalAmount,
      deliveryFee,
      bkashNumber,
      bkashTrxId,
      notes,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!customerName || !customerPhone || !deliveryAddress) {
      return NextResponse.json({ error: "Customer name, phone, and address are required" }, { status: 400 });
    }

    if (!bkashNumber || !bkashTrxId) {
      return NextResponse.json(
        { error: "bKash sender number and Transaction ID (TrxID) are required" },
        { status: 400 }
      );
    }

    const newOrder = await createOrder({
      userId: user?.id || "guest",
      customerName,
      customerEmail: customerEmail || user?.email || "",
      customerPhone,
      deliveryAddress,
      city: city || "Dhaka",
      items,
      totalAmount: Number(totalAmount),
      deliveryFee: Number(deliveryFee) || 0,
      paymentMethod: "bKash",
      bkashNumber,
      bkashTrxId,
      paymentStatus: "Pending",
      status: "Pending",
      notes: notes || "",
    });

    return NextResponse.json({
      success: true,
      order: newOrder,
      message: `Order #${newOrder.id} placed successfully! We are verifying your bKash payment.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create order" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await request.json();
    const { id, status, paymentStatus } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Order ID and status are required" }, { status: 400 });
    }

    const updated = await updateOrderStatus(id, status, paymentStatus);
    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update order" }, { status: 500 });
  }
}

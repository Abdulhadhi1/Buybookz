export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || "";
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (isSignatureValid) {
      // Update order status to PAID
      await prisma.order.updateMany({
        where: { paymentId: razorpay_order_id },
        data: { status: "PAID" },
      });

      // Clear the user's cart (optional, usually done after successful payment)
      const order = await prisma.order.findFirst({
        where: { paymentId: razorpay_order_id },
      });
      if (order) {
        await prisma.cartItem.deleteMany({
          where: { userId: order.userId },
        });
      }

      return NextResponse.json({ message: "Payment verified successfully" });
    } else {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}


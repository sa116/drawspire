import { NextRequest, NextResponse } from "next/server";

const keyId = process.env.RAZORPAY_KEY_ID!;
const keySecret = process.env.RAZORPAY_KEY_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const { amount, receipt } = await req.json();
    const amountInPaise = Math.round(parseFloat(amount) * 100);

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64"),
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: receipt || `rcpt_${Date.now()}`,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error?.description || "Failed to create Razorpay order" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      razorpayOrderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId,
    });
  } catch (err) {
    console.error("[/api/razorpay]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

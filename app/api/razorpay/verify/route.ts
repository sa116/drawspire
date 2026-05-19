import { createCodOrder, markOrderAsPaid } from "lib/shopify/admin";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const keySecret = process.env.RAZORPAY_KEY_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      meta,
      existingOrderId,
    } = await req.json();

    // Verify HMAC-SHA256 signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      console.error("[verify] Signature mismatch");
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    if (existingOrderId) {
      // Upsell: mark existing COD order as paid
      try {
        await markOrderAsPaid(decodeURIComponent(existingOrderId));
      } catch (e) {
        console.error("[verify] markOrderAsPaid failed:", e);
      }
    } else if (meta?.type === "prepaid" && meta.vid) {
      // New prepaid order: create in Shopify + mark paid
      const phone = meta.ph?.startsWith("+") ? meta.ph : `+91${meta.ph}`;
      try {
        const { orderId } = await createCodOrder({
          variantId: meta.vid,
          quantity: parseInt(meta.qty || "1", 10),
          firstName: meta.fn || "",
          lastName: meta.ln || "",
          phone,
          ...(meta.em && { email: meta.em }),
          address: meta.addr || "",
          city: meta.city || "",
          province: meta.st || "",
          zip: meta.zip || "",
        });
        await markOrderAsPaid(orderId);
      } catch (e) {
        console.error("[verify] createCodOrder/markOrderAsPaid failed:", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/razorpay/verify]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

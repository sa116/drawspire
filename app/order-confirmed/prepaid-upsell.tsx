"use client";

import { useRef, useState } from "react";

declare global {
  interface Window { Razorpay: any; }
}

const UPSELL_DISCOUNT = 200;

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(s);
  });
}

export function PrepaidUpsell({
  orderId,
  variantId,
  quantity,
  codPrice,
  firstName,
  lastName,
  phone,
  email,
  address,
  city,
  state,
  zip,
}: {
  orderId: string;
  variantId: string;
  quantity: string;
  codPrice: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}) {
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");
  const initiated               = useRef(false);

  const codAmount    = parseFloat(codPrice);
  const onlinePrice  = Math.max(0, codAmount - UPSELL_DISCOUNT);
  const fmtCod       = codAmount.toFixed(0);
  const fmtOnline    = onlinePrice.toFixed(0);

  const handlePayOnline = async () => {
    if (initiated.current) return;
    initiated.current = true;
    setLoading(true);
    setError("");

    try {
      const orderRes = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: onlinePrice.toFixed(2), receipt: `rcpt_upsell_${Date.now()}` }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.razorpayOrderId) {
        setError("Failed to initiate payment. Please try again.");
        setLoading(false);
        initiated.current = false;
        return;
      }

      await loadRazorpayScript();

      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Drawspire",
        description: "Save ₹200 — Pay online now",
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: `${firstName} ${lastName}`.trim() || undefined,
          email: email || undefined,
          contact: phone.startsWith("+91") ? phone.slice(3) : phone,
        },
        theme: { color: "#16a34a" },
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              existingOrderId: orderId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setSuccess(true);
            setLoading(false);
          } else {
            setError("Payment verification failed. Please contact support.");
            setLoading(false);
            initiated.current = false;
          }
        },
        modal: {
          ondismiss: () => { setLoading(false); initiated.current = false; },
        },
      });
      rzp.open();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      initiated.current = false;
    }
  };

  if (success) {
    return (
      <div className="mt-6 overflow-hidden rounded-2xl border-2 border-green-500 bg-white shadow-xl">
        <div className="bg-gradient-to-r from-green-600 to-green-500 px-4 py-3 text-center">
          <p className="text-sm font-bold text-white">✅ Payment Successful!</p>
        </div>
        <div className="p-5 text-center">
          <p className="text-2xl font-black text-green-700">₹{fmtOnline} Paid</p>
          <p className="mt-2 text-sm text-neutral-600">
            You saved ₹{UPSELL_DISCOUNT}! Your order is confirmed and will arrive in 4–7 business days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border-2 border-green-500 bg-white shadow-xl">
      {/* Urgency banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 px-4 py-2.5 text-center">
        <p className="text-sm font-bold text-white">🔥 LIMITED TIME — Expires in 10 minutes</p>
      </div>

      <div className="p-5">
        <div className="mb-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-green-700">Exclusive offer for you</p>
          <h2 className="mt-1 text-2xl font-black text-neutral-900">
            Pay Online — Save ₹{UPSELL_DISCOUNT}!
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Switch to online payment and get{" "}
            <span className="font-bold text-green-700">flat ₹{UPSELL_DISCOUNT} off</span>.
            This offer won&apos;t come again!
          </p>
        </div>

        {/* Price breakdown */}
        <div className="mb-5 rounded-xl bg-green-50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">COD Price</span>
            <span className="font-semibold text-neutral-500 line-through">₹{fmtCod}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Online Discount</span>
            <span className="font-bold text-green-600">−₹{UPSELL_DISCOUNT}</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-green-200 pt-2">
            <span className="font-bold text-neutral-900">You Pay</span>
            <span className="text-2xl font-black text-green-700">₹{fmtOnline}</span>
          </div>
        </div>

        <button
          onClick={handlePayOnline}
          disabled={loading}
          className="w-full rounded-xl bg-green-600 py-4 text-lg font-extrabold text-white shadow-lg transition-all hover:bg-green-700 hover:shadow-xl disabled:opacity-60"
        >
          {loading ? "Opening payment…" : `Pay ₹${fmtOnline} Online — Save ₹${UPSELL_DISCOUNT}`}
        </button>

        {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}

        <div className="mt-4 flex items-center justify-center gap-4 text-[11px] font-medium text-neutral-400">
          <span>🔒 Secure Payment</span>
          <span>⚡ Instant Confirmation</span>
          <span>💳 UPI / Card / NetBanking</span>
        </div>
      </div>
    </div>
  );
}

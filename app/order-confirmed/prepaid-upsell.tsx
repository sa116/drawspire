"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window { Razorpay: any; }
}

const UPSELL_DISCOUNT_PCT = 10;
const TIMER_SECONDS = 5 * 60;

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
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const initiated               = useRef(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const codAmount    = parseFloat(codPrice);
  const onlinePrice  = Math.round(codAmount * (1 - UPSELL_DISCOUNT_PCT / 100));
  const saving       = Math.round(codAmount * UPSELL_DISCOUNT_PCT / 100);
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
        description: `Save ${UPSELL_DISCOUNT_PCT}% — Pay online now`,
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

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  const expired = timeLeft <= 0;

  if (success) {
    return (
      <div className="mt-6 overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-md">
        <div className="bg-brand-600 px-4 py-3 text-center">
          <p className="text-sm font-bold text-white">Payment Successful!</p>
        </div>
        <div className="p-5 text-center">
          <p className="text-2xl font-black text-brand-700">₹{fmtOnline} Paid</p>
          <p className="mt-2 text-sm text-neutral-500">
            You saved ₹{saving} by paying online. Enjoy your Drawspire!
          </p>
        </div>
      </div>
    );
  }

  if (expired) return null;

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-md">
      {/* Soft header */}
      <div className="bg-brand-600 px-4 py-2.5 text-center">
        <p className="text-sm font-semibold text-white">
          One-time offer — expires in{" "}
          <span className="font-black tabular-nums">{mins}:{secs}</span>
        </p>
      </div>

      <div className="p-5">
        <div className="mb-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-500">While your order is processing</p>
          <h2 className="mt-1 text-xl font-black text-neutral-900">
            Switch to Online — Save {UPSELL_DISCOUNT_PCT}%
          </h2>
          <p className="mt-1.5 text-sm text-neutral-500">
            Pay now and get{" "}
            <span className="font-semibold text-brand-600">{UPSELL_DISCOUNT_PCT}% off</span>{" "}
            your order total. No extra steps.
          </p>
        </div>

        {/* Price breakdown */}
        <div className="mb-5 rounded-xl bg-brand-50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">COD Price</span>
            <span className="font-medium text-neutral-400 line-through">₹{fmtCod}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-neutral-500">Online Discount ({UPSELL_DISCOUNT_PCT}% off)</span>
            <span className="font-semibold text-brand-600">−₹{saving}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-brand-100 pt-3">
            <span className="font-bold text-neutral-900">You Pay</span>
            <span className="text-2xl font-black text-brand-700">₹{fmtOnline}</span>
          </div>
        </div>

        <button
          onClick={handlePayOnline}
          disabled={loading}
          className="w-full rounded-xl bg-brand-600 py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Opening payment…" : `Pay ₹${fmtOnline} Online — Save ${UPSELL_DISCOUNT_PCT}%`}
        </button>

        {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}

        <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-neutral-400">
          <span>🔒 Secure</span>
          <span>💳 UPI / Card / NetBanking</span>
          <span>⚡ Instant</span>
        </div>
      </div>
    </div>
  );
}

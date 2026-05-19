"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";

declare global {
  interface Window { Razorpay: any; }
}

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

function FailedContent() {
  const searchParams = useSearchParams();
  const amount  = searchParams.get("amount") ?? "2299";
  const metaStr = searchParams.get("meta") ?? "";
  const meta    = metaStr ? JSON.parse(decodeURIComponent(metaStr)) : null;
  const [retrying, setRetrying] = useState(false);
  const [error, setError]       = useState("");
  const initiated               = useRef(false);

  const handleRetry = async () => {
    if (initiated.current) return;
    initiated.current = true;
    setRetrying(true);
    setError("");

    try {
      const orderRes = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, receipt: `rcpt_retry_${Date.now()}` }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.razorpayOrderId) {
        setError(orderData.error || "Failed to create payment. Please try again.");
        setRetrying(false);
        initiated.current = false;
        return;
      }

      await loadRazorpayScript();

      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Drawspire",
        description: "Kids Double-Sided Drawing Board",
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: meta ? `${meta.fn || ""} ${meta.ln || ""}`.trim() : undefined,
          email: meta?.em || undefined,
          contact: meta?.ph?.startsWith("+91") ? meta.ph.slice(3) : meta?.ph,
        },
        theme: { color: "#9333ea" },
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              meta,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            window.location.href = `/payment-success?amount=${amount}`;
          } else {
            setError("Payment verification failed. Please contact support.");
            setRetrying(false);
            initiated.current = false;
          }
        },
        modal: {
          ondismiss: () => { setRetrying(false); initiated.current = false; },
        },
      });
      rzp.open();
    } catch {
      setError("Something went wrong. Please try again.");
      setRetrying(false);
      initiated.current = false;
    }
  };

  return (
    <>
      <style>{`nav, [data-sticky-cta], [data-announcement] { display: none !important; }`}</style>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-red-50 to-white px-4">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 text-red-500">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
            </svg>
          </div>

          <h1 className="mb-2 text-3xl font-black text-neutral-900">Payment Failed</h1>
          <p className="mb-8 text-neutral-600">
            Don&apos;t worry — your discount offer is still available. Please try again.
          </p>

          <button
            onClick={handleRetry}
            disabled={retrying}
            className="w-full rounded-xl bg-green-600 py-4 text-lg font-extrabold text-white shadow-lg transition-all hover:bg-green-700 disabled:opacity-60"
          >
            {retrying ? "Opening payment…" : "Retry Payment"}
          </button>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <a href="/" className="mt-4 block text-sm text-neutral-400 underline">Go back to home</a>
        </div>
      </div>
    </>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><p>Loading…</p></div>}>
      <FailedContent />
    </Suspense>
  );
}

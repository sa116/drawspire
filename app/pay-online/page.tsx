"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

function PayOnlineContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "error" | "cancelled">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const initiated = useRef(false);

  const amount   = searchParams.get("amount") ?? "2299";
  const firstName = searchParams.get("fn") ?? "";
  const lastName  = searchParams.get("ln") ?? "";
  const phone     = searchParams.get("ph") ?? "";
  const email     = searchParams.get("em") ?? "";
  const variantId = searchParams.get("vid") ?? "";
  const quantity  = searchParams.get("qty") ?? "1";
  const address   = searchParams.get("addr") ?? "";
  const city      = searchParams.get("city") ?? "";
  const state     = searchParams.get("st") ?? "";
  const zip       = searchParams.get("zip") ?? "";

  useEffect(() => {
    if (initiated.current) return;
    initiated.current = true;

    const meta = { type: "prepaid", vid: variantId, qty: quantity, fn: firstName, ln: lastName, ph: phone, em: email, addr: address, city, st: state, zip };

    async function init() {
      try {
        const orderRes = await fetch("/api/razorpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, receipt: `rcpt_${Date.now()}` }),
        });
        const orderData = await orderRes.json();
        if (!orderRes.ok || !orderData.razorpayOrderId) {
          setErrorMsg(orderData.error || "Failed to initiate payment.");
          setStatus("error");
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
            name: `${firstName} ${lastName}`.trim() || undefined,
            email: email || undefined,
            contact: phone.startsWith("+91") ? phone.slice(3) : phone,
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
              router.push(`/payment-success?amount=${amount}`);
            } else {
              router.push(`/payment-failed?amount=${amount}&meta=${encodeURIComponent(JSON.stringify(meta))}`);
            }
          },
          modal: {
            ondismiss: () => setStatus("cancelled"),
          },
        });
        rzp.open();
      } catch (e: any) {
        setErrorMsg("Something went wrong. Please try again.");
        setStatus("error");
      }
    }

    init();
  }, []);

  return (
    <>
      <style>{`nav, [data-sticky-cta], [data-announcement] { display: none !important; }`}</style>
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="mx-auto w-full max-w-sm text-center">
          {status === "loading" && (
            <>
              <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-brand-600" />
              <p className="text-lg font-semibold text-neutral-900">Opening payment…</p>
              <p className="mt-1 text-sm text-neutral-500">Please wait, do not close this page.</p>
            </>
          )}
          {status === "cancelled" && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-amber-500">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-bold text-neutral-900">Payment cancelled</h2>
              <p className="mb-6 text-sm text-neutral-500">Your COD order is safe. You can retry online payment anytime.</p>
              <button
                onClick={() => { setStatus("loading"); initiated.current = false; }}
                className="mb-3 w-full rounded-xl bg-brand-600 py-3.5 font-bold text-white hover:bg-brand-700"
              >
                Retry Payment
              </button>
              <a href="/" className="block text-sm text-neutral-400 underline">Go back to home</a>
            </>
          )}
          {status === "error" && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-red-500">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="mb-6 text-lg font-bold text-neutral-900">{errorMsg}</p>
              <a href="/" className="inline-flex rounded-full bg-brand-700 px-8 py-3 font-bold text-white hover:bg-brand-800">Go Back</a>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function PayOnlinePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-brand-600" /></div>}>
      <PayOnlineContent />
    </Suspense>
  );
}

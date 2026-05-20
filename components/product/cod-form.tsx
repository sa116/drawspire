"use client";

import clsx from "clsx";
import { checkoutWithForm } from "components/cart/actions";
import { Product, ProductVariant } from "lib/shopify/types";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

const PREPAID_DISCOUNT_PCT = 5;

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu and Kashmir",
  "Ladakh","Chandigarh","Puducherry","Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep","Andaman and Nicobar Islands",
];

type OtpStep = "idle" | "sending" | "sent" | "verifying" | "placing";

function SubmitButtons({
  availableForSale,
  selectedVariantId,
  price,
  prepaidPrice,
  onCodClick,
  onPrepaidClick,
  otpStep,
  prepaidOnly = false,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  price: string;
  prepaidPrice: string;
  onCodClick: () => void;
  onPrepaidClick: () => void;
  otpStep: OtpStep;
  prepaidOnly?: boolean;
}) {
  const { pending } = useFormStatus();

  if (!availableForSale) {
    return (
      <button disabled className="w-full cursor-not-allowed rounded-xl bg-neutral-200 py-4 text-center font-bold text-neutral-400">
        Out of Stock
      </button>
    );
  }
  if (!selectedVariantId) {
    return (
      <button disabled className="w-full cursor-not-allowed rounded-xl bg-neutral-200 py-4 text-center font-bold text-neutral-400">
        Select a Variant
      </button>
    );
  }

  const fmt = (amt: string) => `₹${Math.round(parseFloat(amt)).toLocaleString("en-IN")}`;
  const saving = Math.round(parseFloat(price) * PREPAID_DISCOUNT_PCT / 100);
  const codBusy = pending || otpStep === "sending";

  return (
    <div className="space-y-2.5">
      {!prepaidOnly && (
        <>
          {/* Primary: COD — intercepts click to trigger OTP */}
          <button
            type="button"
            onClick={onCodClick}
            disabled={codBusy}
            className="w-full rounded-xl border-2 border-neutral-200 bg-white px-5 py-4 transition-all hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.99] disabled:opacity-50"
          >
            {codBusy ? (
              <span className="flex items-center justify-center gap-2 text-sm font-semibold text-neutral-600">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {pending ? "Placing order…" : "Sending OTP…"}
              </span>
            ) : (
              <span className="flex items-center justify-between">
                <span className="text-base font-bold text-neutral-800">Pay on Delivery</span>
                <span className="text-base font-bold text-neutral-800">{fmt(price)}</span>
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-neutral-200" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">or save more</span>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>
        </>
      )}

      {/* Pay Online — sets flow="prepaid" then submits */}
      <button
        type="submit"
        onClick={onPrepaidClick}
        disabled={pending}
        className="w-full rounded-xl bg-green-600 px-5 py-4 text-white shadow-md transition-all hover:bg-green-700 hover:shadow-lg active:scale-[0.99] disabled:opacity-50"
      >
        {pending ? (
          <span className="flex items-center justify-center gap-2 text-sm font-semibold">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing…
          </span>
        ) : (
          <span className="flex flex-col gap-0.5">
            <span className="flex items-center justify-between">
              <span className="text-base font-bold">Pay Online</span>
              <span className="flex items-center gap-2">
                <span className="text-base font-bold">{fmt(prepaidPrice)}</span>
                <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs font-bold tracking-wide">
                  {PREPAID_DISCOUNT_PCT}% OFF
                </span>
              </span>
            </span>
            <span className="text-left text-xs font-medium text-white/70">
              You save ₹{saving} · Instant discount
            </span>
          </span>
        )}
      </button>

      {/* Razorpay trust badge */}
      <div className="flex justify-center">
        <Image
          src="/Screenshot_2024-08-30_at_1.31.00_PM-removebg-preview.png"
          alt="Secured by Razorpay"
          width={600}
          height={80}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}

function CodFormModal({
  open,
  onClose,
  product,
  prepaidOnly = false,
}: {
  open: boolean;
  onClose: () => void;
  product: Product;
  prepaidOnly?: boolean;
}) {
  const { variants, availableForSale } = product;
  const searchParams = useSearchParams();
  const [message, formAction] = useActionState(checkoutWithForm, null);
  const [quantity, setQuantity] = useState(1);
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [exitIntent, setExitIntent] = useState(false);
  const [exitDiscount, setExitDiscount] = useState(0);

  // OTP state
  const [otpStep, setOtpStep] = useState<OtpStep>("idle");
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [phoneForOtp, setPhoneForOtp] = useState("");

  const panelRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const flowInputRef = useRef<HTMLInputElement>(null);

  const tryClose = () => {
    if (exitDiscount > 0) { onClose(); return; }
    setExitIntent(true);
  };

  const handlePincode = async (val: string) => {
    if (val.length !== 6) return;
    setPincodeLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
      const data = await res.json();
      const po = data?.[0]?.PostOffice?.[0];
      if (po) {
        setCity(po.District || po.Block || "");
        setProvince(po.State || "");
      }
    } catch {}
    setPincodeLoading(false);
  };

  // --- OTP functions ---
  const handleCodClick = () => {
    const form = formRef.current;
    if (!form || !form.reportValidity()) return;
    const data = new FormData(form);
    const rawPhone = (data.get("phone") as string) || "";
    setPhoneForOtp(rawPhone);
    sendOtp(rawPhone);
  };

  const handlePrepaidClick = () => {
    if (flowInputRef.current) flowInputRef.current.value = "prepaid";
  };

  const sendOtp = async (phone: string) => {
    setOtpStep("sending");
    setOtpError("");
    setOtpCode("");
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error || "Failed to send OTP");
        setOtpStep("idle");
        return;
      }
      setOtpStep("sent");
    } catch {
      setOtpError("Network error. Please try again.");
      setOtpStep("idle");
    }
  };

  const resendOtp = async () => {
    setOtpError("");
    setOtpCode("");
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneForOtp }),
      });
      const data = await res.json();
      if (!res.ok) setOtpError(data.error || "Failed to resend OTP");
    } catch {
      setOtpError("Network error. Please try again.");
    }
  };

  const verifyOtp = async () => {
    if (otpCode.length < 6) return;
    setOtpStep("verifying");
    setOtpError("");
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneForOtp, code: otpCode }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setOtpError(data.error || "Invalid OTP. Please try again.");
        setOtpStep("sent");
        return;
      }
      // Verified — submit the form as COD
      setOtpStep("placing");
      if (flowInputRef.current) flowInputRef.current.value = "cod";
      formRef.current?.requestSubmit();
    } catch {
      setOtpError("Network error. Please try again.");
      setOtpStep("sent");
    }
  };

  // If server action returns an error while placing, close OTP overlay to show the error
  useEffect(() => {
    if (message && otpStep === "placing") {
      setOtpStep("idle");
      setOtpCode("");
    }
  }, [message, otpStep]);

  const variant = variants.find((v: ProductVariant) =>
    v.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const currentPrice = variant?.price ?? product.priceRange.maxVariantPrice;
  const unitPrice = parseFloat(currentPrice.amount);
  const baseTotal = unitPrice * quantity;
  const discountedTotal = Math.max(0, baseTotal - exitDiscount);
  const discountedTotalStr = discountedTotal.toFixed(2);
  const prepaidPrice = (discountedTotal * (1 - PREPAID_DISCOUNT_PCT / 100)).toFixed(2);
  const saving = Math.round(discountedTotal * PREPAID_DISCOUNT_PCT / 100);
  const compareAt = product.compareAtPriceRange?.maxVariantPrice?.amount
    ? (parseFloat(product.compareAtPriceRange.maxVariantPrice.amount) * quantity).toFixed(2)
    : null;
  const firstImage = product.images[0];

  // Masked phone for display in OTP overlay
  const maskedPhone = phoneForOtp.length >= 4
    ? `+91 ${phoneForOtp.slice(0, 2)}XXXXXX${phoneForOtp.slice(-2)}`
    : phoneForOtp;

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const stickyCta = document.querySelector("[data-sticky-cta]") as HTMLElement;
    if (stickyCta) stickyCta.style.display = "none";
    return () => {
      document.body.style.overflow = "";
      if (stickyCta) stickyCta.style.display = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const showOtpOverlay = otpStep === "sent" || otpStep === "verifying" || otpStep === "placing";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={(e) => {
        if (panelRef.current && !panelRef.current.contains(e.target as Node)) tryClose();
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        ref={panelRef}
        className="relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white shadow-2xl sm:max-w-md"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white px-5 py-4">
          <div>
            <h2 className="text-base font-extrabold text-neutral-900">Almost there!</h2>
            <p className="text-xs text-neutral-500">Fill in your details to confirm</p>
          </div>
          <button
            type="button"
            onClick={tryClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* Exit intent overlay */}
        {exitIntent && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-white px-6 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-brand-600">
                <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" clipRule="evenodd" />
                <path d="M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 5.022-2.051.75.75 0 1 0-1.202-.897 3.744 3.744 0 0 1-3.008 1.51c0-1.23.592-2.323 1.51-3.008Z" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-neutral-900">Wait! Here's a gift for you</h2>
            <p className="mt-2 text-sm text-neutral-500">
              We're giving you an extra{" "}
              <span className="font-bold text-brand-600">₹100 off</span> just for showing interest.
              Your order total drops to{" "}
              <span className="font-bold text-neutral-800">
                ₹{Math.round(baseTotal - 100).toLocaleString("en-IN")}
              </span>.
            </p>
            <div className="mt-4 w-full rounded-xl bg-brand-50 px-4 py-3 text-sm">
              <div className="flex justify-between text-neutral-500">
                <span>Original price</span>
                <span className="line-through">₹{Math.round(baseTotal).toLocaleString("en-IN")}</span>
              </div>
              <div className="mt-1 flex justify-between font-semibold text-brand-600">
                <span>Your discount</span>
                <span>−₹100</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-brand-100 pt-2 font-black text-neutral-900">
                <span>You pay</span>
                <span>₹{Math.round(baseTotal - 100).toLocaleString("en-IN")}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setExitDiscount(100); setExitIntent(false); }}
              className="mt-5 w-full rounded-xl bg-brand-600 py-4 text-base font-bold text-white shadow-md hover:bg-brand-700"
            >
              Claim ₹100 Off &amp; Continue
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 text-sm text-neutral-400 underline underline-offset-2"
            >
              Maybe later
            </button>
          </div>
        )}

        {/* OTP verification overlay */}
        {showOtpOverlay && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-white px-6 text-center">
            {otpStep === "placing" ? (
              <>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
                  <svg className="h-7 w-7 animate-spin text-brand-600" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
                <h2 className="text-xl font-black text-neutral-900">Placing your order…</h2>
                <p className="mt-2 text-sm text-neutral-500">Please don't close this window.</p>
              </>
            ) : (
              <>
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-brand-600">
                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-xl font-black text-neutral-900">Confirm your number</h2>
                <p className="mt-1 text-sm text-neutral-500">
                  We've sent a 6-digit OTP to{" "}
                  <span className="font-semibold text-neutral-800">{maskedPhone}</span>
                </p>

                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={6}
                  autoFocus
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="mt-5 w-full rounded-xl border-2 border-brand-200 bg-white px-4 py-4 text-center text-3xl font-black tracking-[0.5em] text-neutral-900 placeholder:text-neutral-300 outline-none focus:border-brand-500"
                  placeholder="······"
                />

                {otpError && (
                  <p className="mt-2 text-sm font-medium text-red-500">{otpError}</p>
                )}

                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={otpCode.length < 6 || otpStep === "verifying"}
                  className="mt-4 w-full rounded-xl bg-brand-600 py-4 text-base font-bold text-white shadow-md transition-all hover:bg-brand-700 disabled:opacity-50"
                >
                  {otpStep === "verifying" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Verifying…
                    </span>
                  ) : "Verify & Place Order"}
                </button>

                <div className="mt-3 flex items-center justify-center gap-4 text-sm">
                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={otpStep === "verifying"}
                    className="text-brand-600 underline underline-offset-2 disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                  <span className="text-neutral-300">·</span>
                  <button
                    type="button"
                    onClick={() => { setOtpStep("idle"); setOtpCode(""); setOtpError(""); }}
                    className="text-neutral-400 underline underline-offset-2"
                  >
                    Change number
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Savings nudge */}
        <div className="shrink-0 bg-green-50 px-5 py-2 text-center text-xs font-semibold text-green-700">
          {prepaidOnly
            ? `🎉 ${PREPAID_DISCOUNT_PCT}% instant discount applied! You pay only ₹${Math.round(parseFloat(prepaidPrice)).toLocaleString("en-IN")}`
            : exitDiscount > 0
            ? `🎉 ₹${exitDiscount} loyalty discount applied! Pay online to save another ₹${saving}`
            : `💳 Pay online & save ₹${saving}, only ₹${Math.round(parseFloat(prepaidPrice)).toLocaleString("en-IN")} with ${PREPAID_DISCOUNT_PCT}% off`}
        </div>

        <div className="px-5 pb-8 pt-4">
          <form ref={formRef} action={formAction}>
            <input type="hidden" name="variantId" value={selectedVariantId ?? ""} />
            <input type="hidden" name="quantity" value={quantity} />
            <input type="hidden" name="unitPrice" value={unitPrice.toFixed(2)} />
            <input type="hidden" name="extraDiscount" value={exitDiscount} />
            {/* flow is set programmatically before requestSubmit() for COD; prepaid sets it via button value */}
            <input ref={flowInputRef} type="hidden" name="flow" />

            {/* Product summary */}
            <div className="mb-4 rounded-xl border border-neutral-100 bg-neutral-50 p-3">
              <div className="flex items-center gap-3">
                {firstImage && (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-white">
                    <Image src={firstImage.url} alt={firstImage.altText ?? product.title} fill className="object-contain p-1" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  {/* Title row + qty stepper */}
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-neutral-900">{product.title}</p>
                    {/* Quantity */}
                    <div className="flex shrink-0 items-center gap-1 rounded-lg border border-neutral-200 bg-white px-1">
                      <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1}
                        className="flex h-8 w-8 items-center justify-center rounded font-bold text-neutral-500 transition-colors hover:bg-neutral-100 disabled:opacity-30">−</button>
                      <span className="min-w-[1.5rem] text-center text-sm font-bold text-neutral-900">{quantity}</span>
                      <button type="button" onClick={() => setQuantity((q) => Math.min(10, q + 1))} disabled={quantity >= 10}
                        className="flex h-8 w-8 items-center justify-center rounded font-bold text-neutral-500 transition-colors hover:bg-neutral-100 disabled:opacity-30">+</button>
                    </div>
                  </div>
                  {/* Price row — full width, no competition */}
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="text-base font-extrabold text-neutral-900">
                      ₹{Math.round(discountedTotal).toLocaleString("en-IN")}
                    </span>
                    {exitDiscount > 0 && (
                      <span className="text-sm text-neutral-400 line-through">
                        ₹{Math.round(baseTotal).toLocaleString("en-IN")}
                      </span>
                    )}
                    {exitDiscount > 0 && (
                      <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[11px] font-bold text-brand-600">−₹{exitDiscount}</span>
                    )}
                    {compareAt && exitDiscount === 0 && (
                      <>
                        <span className="text-sm text-neutral-400 line-through">
                          ₹{Math.round(parseFloat(compareAt)).toLocaleString("en-IN")}
                        </span>
                        <span className="rounded bg-red-50 px-1.5 py-0.5 text-[11px] font-bold text-red-500">50% OFF</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Free shipping */}
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2.5 text-sm font-semibold text-green-800">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-green-600">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
              </svg>
              Free shipping included
            </div>

            {/* Form fields */}
            <div className="space-y-3">
              <FormField name="firstName" label="First Name" placeholder="First name" required />
              <FormField name="lastName" label="Last Name" placeholder="Last name" />
              <FormField name="phone" label="Mobile Number" type="tel" placeholder="10-digit mobile number" required pattern="[6-9]\d{9}" maxLength={10} />
              <FormField name="email" label="Email (optional)" type="email" placeholder="your@email.com" />
              <FormField name="address" label="House No., Building Name, Street" placeholder="House No., Building Name, Street" required />
              <FormField name="landmark" label="Landmark" placeholder="Nearby landmark (optional)" />

              {/* Pincode with auto-fill */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-700">
                  Pincode<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="pincode"
                    type="tel"
                    placeholder="6-digit pincode"
                    required
                    pattern="\d{6}"
                    maxLength={6}
                    onChange={(e) => handlePincode(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />
                  {pincodeLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="h-4 w-4 animate-spin text-brand-500" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* State — auto-filled */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-700">
                  State<span className="text-red-500">*</span>
                </label>
                <select
                  name="state"
                  required
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                >
                  <option value="" disabled>Select State</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* City — auto-filled */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-700">
                  City<span className="text-red-500">*</span>
                </label>
                <input
                  name="city"
                  type="text"
                  placeholder="City"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>

            <div className="mt-5">
              <SubmitButtons
                availableForSale={availableForSale}
                selectedVariantId={selectedVariantId}
                price={discountedTotalStr}
                prepaidPrice={prepaidPrice}
                onCodClick={handleCodClick}
                onPrepaidClick={handlePrepaidClick}
                otpStep={otpStep}
                prepaidOnly={prepaidOnly}
              />
            </div>
            {message && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-600">{message}</p>
            )}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-neutral-400">
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 shrink-0">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                </svg>
                Secure Order
              </span>
              <span className="whitespace-nowrap">🔁 7-Day Replacement Guaranteed</span>
              <span className="whitespace-nowrap">🚚 Free Shipping</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function BuyNowWithCodModal({
  product,
  variant: styleVariant = "default",
  prepaidOnly = false,
}: {
  product: Product;
  variant?: "default" | "light";
  prepaidOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { variants, availableForSale } = product;
  const searchParams = useSearchParams();

  const variant = variants.find((v: ProductVariant) =>
    v.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const isLight = styleVariant === "light";

  return (
    <>
      {!availableForSale ? (
        <button disabled className="w-full cursor-not-allowed rounded-full py-4 text-center font-bold bg-neutral-200 text-neutral-400">
          Out of Stock
        </button>
      ) : !selectedVariantId ? (
        <button disabled className="w-full cursor-not-allowed rounded-full py-4 text-center font-bold bg-neutral-200 text-neutral-400">
          Select a Variant
        </button>
      ) : prepaidOnly ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative w-full overflow-hidden rounded-lg bg-green-600 py-3.5 text-base font-extrabold tracking-wide text-white shadow-md shadow-green-500/20 transition-all hover:bg-green-700 active:scale-[0.99]"
        >
          <span className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M2.5 4A1.5 1.5 0 0 0 1 5.5V6h18v-.5A1.5 1.5 0 0 0 17.5 4h-15ZM19 8.5H1v6A1.5 1.5 0 0 0 2.5 16h15a1.5 1.5 0 0 0 1.5-1.5v-6ZM3 13.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm4.75-.75a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z" clipRule="evenodd" />
            </svg>
            Pay Online · Save {PREPAID_DISCOUNT_PCT}%
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={clsx(
            "relative w-full overflow-hidden rounded-lg py-4 text-base font-extrabold tracking-wide transition-all active:scale-[0.99]",
            isLight
              ? "bg-white text-brand-800 shadow-2xl hover:bg-brand-50"
              : "bg-gradient-to-r from-accent-600 to-accent-500 text-white shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 hover:brightness-105",
          )}
        >
          <span className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M6 5v1H4.667a1.75 1.75 0 0 0-1.743 1.598l-.826 9.5A1.75 1.75 0 0 0 3.84 19H16.16a1.75 1.75 0 0 0 1.742-1.902l-.826-9.5A1.75 1.75 0 0 0 15.333 6H14V5a4 4 0 0 0-8 0Zm4-2.5A2.5 2.5 0 0 0 7.5 5v1h5V5A2.5 2.5 0 0 0 10 2.5ZM7.5 10a2.5 2.5 0 0 0 5 0V8.75a.75.75 0 0 1 1.5 0V10a4 4 0 0 1-8 0V8.75a.75.75 0 0 1 1.5 0V10Z" clipRule="evenodd" />
            </svg>
            Order Now · Pay on Delivery
          </span>
        </button>
      )}

      <CodFormModal open={open} onClose={() => setOpen(false)} product={product} prepaidOnly={prepaidOnly} />
    </>
  );
}

function FormField({
  name, label, placeholder, type = "text", required = false, pattern, maxLength,
}: {
  name: string; label: string; placeholder: string;
  type?: string; required?: boolean; pattern?: string; maxLength?: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-neutral-700">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name} type={type} placeholder={placeholder}
        required={required} pattern={pattern} maxLength={maxLength}
        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />
    </div>
  );
}

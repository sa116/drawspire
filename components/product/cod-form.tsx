"use client";

import clsx from "clsx";
import { checkoutWithForm } from "components/cart/actions";
import Price from "components/price";
import { Product, ProductVariant } from "lib/shopify/types";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu and Kashmir",
  "Ladakh","Chandigarh","Puducherry","Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep","Andaman and Nicobar Islands",
];

function SubmitButton({
  availableForSale,
  selectedVariantId,
  price,
  currencyCode,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  price: string;
  currencyCode: string;
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

  return (
    <button
      type="submit"
      name="flow"
      value="cod"
      disabled={pending}
      className={clsx(
        "relative w-full overflow-hidden rounded-xl py-4 text-base font-extrabold text-white transition-all",
        pending
          ? "bg-accent-400 opacity-70"
          : "bg-gradient-to-r from-accent-600 to-accent-500 shadow-lg shadow-accent-500/30 hover:shadow-accent-500/50 hover:brightness-105 active:scale-[0.99]",
      )}
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Placing your order…
        </span>
      ) : (
        <span className="flex flex-col items-center justify-center gap-0.5">
          <span className="flex items-center gap-2 text-base">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0">
              <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
              <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 16.125V4.875ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z" clipRule="evenodd" />
              <path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z" />
            </svg>
            Confirm Order — Pay on Delivery
          </span>
          <span className="text-sm font-medium opacity-90">
            Total: <Price amount={price} currencyCode={currencyCode} /> · Free Shipping
          </span>
        </span>
      )}
    </button>
  );
}

function CodFormModal({
  open,
  onClose,
  product,
}: {
  open: boolean;
  onClose: () => void;
  product: Product;
}) {
  const { variants, availableForSale } = product;
  const searchParams = useSearchParams();
  const [message, formAction] = useActionState(checkoutWithForm, null);
  const [quantity, setQuantity] = useState(1);
  const panelRef = useRef<HTMLDivElement>(null);

  const variant = variants.find((v: ProductVariant) =>
    v.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const currentPrice = variant?.price ?? product.priceRange.maxVariantPrice;
  const unitPrice = parseFloat(currentPrice.amount);
  const totalPrice = (unitPrice * quantity).toFixed(2);
  const compareAt = product.compareAtPriceRange?.maxVariantPrice?.amount
    ? (parseFloat(product.compareAtPriceRange.maxVariantPrice.amount) * quantity).toFixed(2)
    : null;
  const firstImage = product.images[0];

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

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center md:items-center"
      onClick={(e) => {
        if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        ref={panelRef}
        className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-md md:rounded-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white px-5 py-4">
          <div>
            <h2 className="text-base font-extrabold text-neutral-900">Almost there!</h2>
            <p className="text-xs text-neutral-500">Fill in your details to confirm</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <div className="px-5 pb-8 pt-4">
          {/* Product summary */}
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-3">
            {firstImage && (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-white">
                <Image src={firstImage.url} alt={firstImage.altText ?? product.title} fill className="object-contain p-1" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-neutral-900">{product.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-base font-extrabold text-neutral-900">
                  <Price amount={totalPrice} currencyCode={currentPrice.currencyCode} />
                </span>
                {compareAt && (
                  <span className="text-sm text-neutral-400 line-through">
                    <Price amount={compareAt} currencyCode={currentPrice.currencyCode} />
                  </span>
                )}
              </div>
            </div>
            {/* Quantity */}
            <div className="flex shrink-0 items-center gap-1 rounded-lg border border-neutral-200 bg-white px-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="flex h-8 w-8 items-center justify-center rounded font-bold text-neutral-500 transition-colors hover:bg-neutral-100 disabled:opacity-30"
              >
                −
              </button>
              <span className="min-w-[1.5rem] text-center text-sm font-bold text-neutral-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                disabled={quantity >= 10}
                className="flex h-8 w-8 items-center justify-center rounded font-bold text-neutral-500 transition-colors hover:bg-neutral-100 disabled:opacity-30"
              >
                +
              </button>
            </div>
          </div>

          {/* Free shipping callout */}
          <div className="mb-5 flex items-start gap-2 rounded-lg bg-green-50 px-3 py-2.5 text-sm font-semibold text-green-800">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-green-600">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
            </svg>
            <span>
              Free shipping included. You only pay{' '}
              <Price amount={totalPrice} currencyCode={currentPrice.currencyCode} /> on delivery.
            </span>
          </div>

          <form action={formAction}>
            <input type="hidden" name="variantId" value={selectedVariantId ?? ""} />
            <input type="hidden" name="quantity" value={quantity} />

            <div className="space-y-3">
              <FormField name="phone" label="Mobile Number" type="tel" placeholder="10-digit mobile number" required pattern="[6-9]\d{9}" maxLength={10} />

              <div className="grid grid-cols-2 gap-3">
                <FormField name="firstName" label="First Name" placeholder="First name" required />
                <FormField name="lastName" label="Last Name" placeholder="Last name" />
              </div>

              <FormField name="address" label="Delivery Address" placeholder="House No., Street, Area" required />

              <div className="grid grid-cols-2 gap-3">
                <FormField name="city" label="City" placeholder="City" required />
                <FormField name="pincode" label="Pincode" placeholder="6-digit pincode" required pattern="\d{6}" maxLength={6} />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-700">
                  State<span className="text-red-500">*</span>
                </label>
                <select
                  name="state"
                  required
                  defaultValue=""
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                >
                  <option value="" disabled>Select State</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <FormField name="email" label="Email (optional — for order updates)" type="email" placeholder="your@email.com" />
            </div>

            <div className="mt-5">
              <SubmitButton
                availableForSale={availableForSale}
                selectedVariantId={selectedVariantId}
                price={totalPrice}
                currencyCode={currentPrice.currencyCode}
              />
            </div>

            {message && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-600">{message}</p>
            )}
          </form>

          {/* Trust signals */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 shrink-0">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
              </svg>
              Secure Order
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">🔁 30-Day Returns</span>
            <span className="flex items-center gap-1 whitespace-nowrap">💳 Pay on Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BuyNowWithCodModal({
  product,
  variant: styleVariant = "default",
}: {
  product: Product;
  variant?: "default" | "light";
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
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={clsx(
            "relative w-full overflow-hidden rounded-full py-4 text-base font-extrabold tracking-wide transition-all active:scale-[0.99]",
            isLight
              ? "bg-white text-brand-800 shadow-2xl hover:bg-brand-50"
              : "bg-gradient-to-r from-accent-600 to-accent-500 text-white shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 hover:brightness-105",
          )}
        >
          <span className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M1 1.75A.75.75 0 0 1 1.75 1h1.628a1.75 1.75 0 0 1 1.734 1.51L5.18 3a65.25 65.25 0 0 1 13.36 1.412.75.75 0 0 1 .58.875 48.645 48.645 0 0 1-1.618 6.2.75.75 0 0 1-.712.513H6a2.5 2.5 0 0 0 0 5h8.5a.75.75 0 0 1 0 1.5H6a4 4 0 0 1-3.866-5.01l-.06-.3-.21-1.056H1.75A.75.75 0 0 1 1 11.25v-9.5Z" />
            </svg>
            Order Now — Pay on Delivery
          </span>
        </button>
      )}

      <CodFormModal open={open} onClose={() => setOpen(false)} product={product} />
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

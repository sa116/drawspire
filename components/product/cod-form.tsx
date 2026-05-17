"use client";

import clsx from "clsx";
import { checkoutWithForm } from "components/cart/actions";
import Price from "components/price";
import { Product, ProductVariant } from "lib/shopify/types";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Chandigarh",
  "Puducherry",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
  "Andaman and Nicobar Islands",
];

function SubmitButtons({
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
      <button
        disabled
        className="w-full cursor-not-allowed rounded-lg bg-neutral-300 py-3.5 text-center font-bold text-neutral-500"
      >
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-lg bg-neutral-300 py-3.5 text-center font-bold text-neutral-500"
      >
        Please Select a Size
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
        "flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 py-3.5 font-bold text-white transition-colors",
        pending ? "opacity-60" : "hover:bg-brand-800",
      )}
    >
      <CodIcon />
      {pending ? (
        "Processing…"
      ) : (
        <>
          Place Order (COD) –{" "}
          <Price amount={price} currencyCode={currencyCode} />
        </>
      )}
    </button>
  );
}

function CodIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
      <path
        fillRule="evenodd"
        d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 16.125V4.875ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z"
        clipRule="evenodd"
      />
      <path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z" />
    </svg>
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
  const totalPrice = (parseFloat(currentPrice.amount) * quantity).toFixed(2);

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
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center md:items-center"
      onClick={(e) => {
        if (panelRef.current && !panelRef.current.contains(e.target as Node))
          onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        ref={panelRef}
        className="relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 pb-8 shadow-2xl sm:max-w-md md:rounded-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900">
            Complete Your Order
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <form action={formAction}>
          <input
            type="hidden"
            name="variantId"
            value={selectedVariantId ?? ""}
          />
          <input type="hidden" name="quantity" value={quantity} />

          <p className="mb-4 text-center text-sm font-medium text-green-700">
            All Inclusive price. Free Shipping!
          </p>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                name="firstName"
                label="First Name"
                placeholder="In English Only"
                required
              />
              <FormField
                name="lastName"
                label="Last Name"
                placeholder="In English Only"
              />
            </div>

            <FormField
              name="phone"
              label="Mobile Number"
              type="tel"
              placeholder="10 digit mobile number"
              required
              pattern="[6-9]\d{9}"
              maxLength={10}
            />

            <FormField
              name="email"
              label="Email ID"
              type="email"
              placeholder="Email ID"
            />

            <FormField
              name="address"
              label="Complete Address"
              placeholder="Please Enter Complete Address!"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                name="pincode"
                label="Pincode"
                placeholder="6 Digit Pin Code"
                required
                pattern="\d{6}"
                maxLength={6}
              />
              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-700">
                  State<span className="text-red-500">*</span>
                </label>
                <select
                  name="state"
                  required
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Province (State)
                  </option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <FormField
              name="city"
              label="City"
              placeholder="City Name"
              required
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm font-medium text-neutral-600">Qty</span>
            <div className="flex items-center rounded-full border border-neutral-200 bg-neutral-50">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold text-neutral-500 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="min-w-[2rem] text-center text-sm font-semibold text-neutral-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold text-neutral-500 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={quantity >= 10}
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-4">
            <SubmitButtons
              availableForSale={availableForSale}
              selectedVariantId={selectedVariantId}
              price={totalPrice}
              currencyCode={currentPrice.currencyCode}
            />
          </div>

          {message && (
            <p className="mt-2 text-center text-sm text-red-600">{message}</p>
          )}
        </form>
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
  const buttonClasses = clsx(
    "relative flex w-full items-center justify-center rounded-full p-4 text-base font-bold tracking-wide transition-all",
    isLight
      ? "bg-white text-brand-800 shadow-2xl"
      : "bg-brand-700 text-white"
  );
  const disabledClasses = "cursor-not-allowed opacity-60";
  const hoverClasses = isLight ? "hover:bg-brand-50" : "hover:bg-brand-800";

  return (
    <>
      {!availableForSale ? (
        <button disabled className={clsx(buttonClasses, disabledClasses)}>
          Out Of Stock
        </button>
      ) : !selectedVariantId ? (
        <button disabled className={clsx(buttonClasses, disabledClasses)}>
          Select a Size
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={clsx(buttonClasses, hoverClasses)}
        >
          Buy Now — Free Shipping
        </button>
      )}

      <CodFormModal
        open={open}
        onClose={() => setOpen(false)}
        product={product}
      />
    </>
  );
}

function FormField({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
  pattern,
  maxLength,
}: {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  pattern?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-neutral-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        pattern={pattern}
        maxLength={maxLength}
        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
      />
    </div>
  );
}

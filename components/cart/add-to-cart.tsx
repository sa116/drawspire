"use client";

import clsx from "clsx";
import { buyNow } from "components/cart/actions";
import { Product, ProductVariant } from "lib/shopify/types";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton({
  availableForSale,
  selectedVariantId,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  const { pending } = useFormStatus();
  const buttonClasses =
    "relative flex w-full items-center justify-center rounded-full bg-brand-700 p-4 text-base font-bold tracking-wide text-white transition-all";
  const disabledClasses = "cursor-not-allowed opacity-60";

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        Select a Size
      </button>
    );
  }

  return (
    <button
      aria-label="Buy now"
      disabled={pending}
      className={clsx(buttonClasses, pending ? "opacity-70" : "hover:bg-brand-800")}
    >
      {pending ? "Redirecting to checkout…" : "Buy Now — Free Shipping"}
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const searchParams = useSearchParams();
  const [message, formAction] = useActionState(buyNow, null);
  const [quantity, setQuantity] = useState(1);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;

  return (
    <form action={formAction}>
      {/* Hidden inputs carry variantId and quantity to the server action */}
      <input type="hidden" name="variantId" value={selectedVariantId ?? ""} />
      <input type="hidden" name="quantity" value={quantity} />

      {/* Quantity selector */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm font-medium text-neutral-600">Qty</span>
        <div className="flex items-center rounded-full border border-neutral-200 bg-neutral-50">
          <button
            type="button"
            aria-label="Decrease quantity"
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
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold text-neutral-500 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={quantity >= 10}
          >
            +
          </button>
        </div>
      </div>

      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}

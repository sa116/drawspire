"use server";

import { TAGS } from "lib/constants";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "lib/shopify";
import { createCodOrder } from "lib/shopify/admin";
import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined
) {
  if (!selectedVariantId) {
    return "Error adding item to cart";
  }

  try {
    await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
    updateTag(TAGS.cart);
  } catch (e) {
    return "Error adding item to cart";
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      await removeFromCart([lineItem.id]);
      updateTag(TAGS.cart);
    } else {
      return "Item not found in cart";
    }
  } catch (e) {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart([lineItem.id]);
      } else {
        await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart([{ merchandiseId, quantity }]);
    }

    updateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return "Error updating item quantity";
  }
}

export async function redirectToCheckout() {
  let cart = await getCart();
  redirect(cart!.checkoutUrl);
}

export async function createCartAndSetCookie() {
  let cart = await createCart();
  (await cookies()).set("cartId", cart.id!);
}

const PREPAID_DISCOUNT = 200;

export async function checkoutWithForm(
  prevState: any,
  formData: FormData
) {
  const variantId = formData.get("variantId") as string;
  const quantity = Math.max(1, parseInt((formData.get("quantity") as string) || "1", 10));
  const flow = formData.get("flow") as "cod" | "prepaid";

  if (!variantId) {
    return "Please select a variant";
  }

  const rawPhone = (formData.get("phone") as string) || "";
  const phone = rawPhone.startsWith("+") ? rawPhone : `+91${rawPhone}`;
  const email = (formData.get("email") as string) || "";
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const province = formData.get("state") as string;
  const zip = formData.get("pincode") as string;

  if (flow === "prepaid") {
    const unitPrice = parseFloat((formData.get("unitPrice") as string) || "0");
    const prepaidAmount = Math.max(0, unitPrice * quantity - PREPAID_DISCOUNT).toFixed(2);
    const params = new URLSearchParams({
      amount: prepaidAmount,
      vid: variantId,
      qty: String(quantity),
      fn: firstName,
      ln: lastName ?? "",
      ph: rawPhone,
      addr: address,
      city,
      st: province,
      zip,
      ...(email && { em: email }),
    });
    redirect(`/pay-online?${params.toString()}`);
  }

  if (flow === "cod") {
    try {
      const { orderName, orderId, totalPrice } = await createCodOrder({
        variantId,
        quantity,
        firstName,
        lastName,
        phone,
        ...(email && { email }),
        address,
        city,
        province,
        zip,
      });
      const params = new URLSearchParams({
        order: orderName,
        oid: orderId,
        vid: variantId,
        qty: String(quantity),
        price: totalPrice,
        fn: firstName,
        ln: lastName,
        ph: rawPhone,
        addr: address,
        city,
        st: province,
        zip,
        ...(email && { em: email }),
      });
      redirect(`/order-confirmed?${params.toString()}`);
    } catch (e) {
      if ((e as any)?.digest?.startsWith("NEXT_REDIRECT")) throw e;
      console.error("COD order error:", e);
      const msg = e instanceof Error ? e.message : "Unknown error";
      return `Error: ${msg}`;
    }
  }
}

export async function buyNow(
  prevState: any,
  formData: FormData
) {
  const selectedVariantId = formData.get("variantId") as string | undefined;
  const quantity = Math.max(1, parseInt((formData.get("quantity") as string) || "1", 10));

  if (!selectedVariantId) {
    return "Please select a variant";
  }

  let cart;
  const cartId = (await cookies()).get("cartId")?.value;

  try {
    if (!cartId) {
      // No cart yet — create one with the exact quantity
      cart = await createCart([{ merchandiseId: selectedVariantId, quantity }]);
      (await cookies()).set("cartId", cart.id!);
    } else {
      // Cart exists — check if this variant is already a line item
      cart = await getCart();

      if (!cart) {
        cart = await createCart([{ merchandiseId: selectedVariantId, quantity }]);
        (await cookies()).set("cartId", cart.id!);
      } else {
        const existingLine = cart.lines.find(
          (line) => line.merchandise.id === selectedVariantId
        );

        if (existingLine) {
          // Update the line to exactly the chosen quantity
          cart = await updateCart([
            { id: existingLine.id!, merchandiseId: selectedVariantId, quantity },
          ]);
        } else {
          // New variant — add it fresh
          cart = await addToCart([{ merchandiseId: selectedVariantId, quantity }]);
        }
      }
    }
    updateTag(TAGS.cart);
  } catch (e) {
    return "Error adding item to cart";
  }

  redirect(cart.checkoutUrl);
}


import { ensureStartsWith } from "lib/utils";

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
  : "";
const adminEndpoint = domain
  ? `${domain}/admin/api/2023-01/graphql.json`
  : "";
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;

export async function shopifyAdminFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  console.log("[Admin API] Endpoint:", adminEndpoint);
  console.log("[Admin API] Token present:", !!adminToken);
  console.log("[Admin API] Variables:", JSON.stringify(variables, null, 2));

  const result = await fetch(adminEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": adminToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const body = await result.json();
  console.log("[Admin API] Status:", result.status);
  console.log("[Admin API] Response:", JSON.stringify(body, null, 2));

  if (body.errors) {
    const errMsg = Array.isArray(body.errors)
      ? body.errors.map((e: any) => e.message).join("; ")
      : JSON.stringify(body.errors);
    console.error("[Admin API] GraphQL errors:", errMsg);
    throw new Error(errMsg);
  }

  return body.data;
}

const restOrdersEndpoint = domain ? `${domain}/admin/api/2023-01/orders.json` : "";

export async function createCodOrder({
  variantId,
  quantity,
  firstName,
  lastName,
  phone,
  email,
  address,
  city,
  province,
  zip,
}: {
  variantId: string;
  quantity: number;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  province: string;
  zip: string;
}): Promise<{ orderId: string; orderName: string; totalPrice: string }> {
  // GID → numeric ID (gid://shopify/ProductVariant/12345 → 12345)
  const numericVariantId = variantId.split("/").pop()!;

  const shippingAddress = {
    first_name: firstName,
    last_name: lastName,
    address1: address,
    city,
    province,
    zip,
    country: "IN",
    phone,
  };

  const payload = {
    order: {
      line_items: [{ variant_id: numericVariantId, quantity }],
      shipping_address: shippingAddress,
      billing_address: shippingAddress,
      ...(email && { email }),
      phone,
      financial_status: "pending",
      tags: "COD",
      note: "Cash on Delivery order",
      send_receipt: false,
      send_fulfillment_receipt: false,
    },
  };

  console.log("[createCodOrder] REST payload:", JSON.stringify(payload, null, 2));

  const res = await fetch(restOrdersEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": adminToken,
    },
    body: JSON.stringify(payload),
  });

  const body = await res.json();
  console.log("[createCodOrder] REST status:", res.status);
  console.log("[createCodOrder] REST response:", JSON.stringify(body, null, 2));

  if (!res.ok || !body.order) {
    const errMsg = body.errors ? JSON.stringify(body.errors) : `HTTP ${res.status}`;
    throw new Error(errMsg);
  }

  const order = body.order;
  return {
    orderId: `gid://shopify/Order/${order.id}`,
    orderName: order.name,
    totalPrice: order.total_price ?? "0.00",
  };
}

const orderMarkAsPaidMutation = /* GraphQL */ `
  mutation orderMarkAsPaid($input: OrderMarkAsPaidInput!) {
    orderMarkAsPaid(input: $input) {
      order {
        id
        displayFinancialStatus
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function markOrderAsPaid(orderId: string): Promise<void> {
  await shopifyAdminFetch<{
    orderMarkAsPaid: {
      order: { id: string } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query: orderMarkAsPaidMutation,
    variables: {
      input: { id: orderId },
    },
  });
}

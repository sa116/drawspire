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

const draftOrderCreateMutation = /* GraphQL */ `
  mutation draftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        id
        name
        totalPrice
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const draftOrderCompleteMutation = /* GraphQL */ `
  mutation draftOrderComplete($id: ID!, $paymentPending: Boolean) {
    draftOrderComplete(id: $id, paymentPending: $paymentPending) {
      draftOrder {
        id
        name
        order {
          id
          name
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

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
  const draftResult = await shopifyAdminFetch<{
    draftOrderCreate: {
      draftOrder: { id: string; name: string; totalPrice: string } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query: draftOrderCreateMutation,
    variables: {
      input: {
        lineItems: [{ variantId, quantity }],
        shippingAddress: {
          firstName,
          lastName,
          address1: address,
          city,
          province,
          zip,
          country: "IN",
          phone,
        },
        ...(email && { email }),
        phone,
        tags: ["COD"],
        note: "Cash on Delivery order",
      },
    },
  });

  if (draftResult.draftOrderCreate.userErrors.length > 0) {
    const errs = draftResult.draftOrderCreate.userErrors.map((e) => `${e.field?.join(".")}: ${e.message}`).join("; ");
    console.error("[createCodOrder] draftOrderCreate userErrors:", errs);
    throw new Error(errs);
  }

  const draftOrder = draftResult.draftOrderCreate.draftOrder!;
  console.log("[createCodOrder] Draft created:", draftOrder.id, draftOrder.name);

  const completeResult = await shopifyAdminFetch<{
    draftOrderComplete: {
      draftOrder: {
        id: string;
        name: string;
        order: { id: string; name: string } | null;
      } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query: draftOrderCompleteMutation,
    variables: {
      id: draftOrder.id,
      paymentPending: true,
    },
  });

  if (completeResult.draftOrderComplete.userErrors.length > 0) {
    const errs = completeResult.draftOrderComplete.userErrors.map((e) => `${e.field?.join(".")}: ${e.message}`).join("; ");
    console.error("[createCodOrder] draftOrderComplete userErrors:", errs);
    throw new Error(errs);
  }
  console.log("[createCodOrder] Order completed:", completeResult.draftOrderComplete.draftOrder?.order?.name);

  const order = completeResult.draftOrderComplete.draftOrder?.order;

  return {
    orderId: order?.id ?? draftOrder.id,
    orderName: order?.name ?? draftOrder.name,
    totalPrice: draftOrder.totalPrice,
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

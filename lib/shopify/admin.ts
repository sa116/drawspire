import { ensureStartsWith } from "lib/utils";

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
  : "";
const adminEndpoint = domain
  ? `${domain}/admin/api/2023-01/graphql.json`
  : "";
const clientId = process.env.SHOPIFY_CLIENT_ID!;
const clientSecret = process.env.SHOPIFY_CLIENT_SECRET!;

// Cache token in memory — refreshed automatically when it expires
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getAdminToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;

  const res = await fetch(`${domain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });

  const data = await res.json();
  if (!data.access_token) throw new Error("Failed to get admin token: " + JSON.stringify(data));

  cachedToken = data.access_token;
  // Refresh 5 minutes before expiry
  tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000;
  return cachedToken!;
}

export async function shopifyAdminFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  const token = await getAdminToken();

  const result = await fetch(adminEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  const body = await result.json();

  if (body.errors) {
    const errMsg = Array.isArray(body.errors)
      ? body.errors.map((e: any) => e.message).join("; ")
      : JSON.stringify(body.errors);
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
    const errs = draftResult.draftOrderCreate.userErrors
      .map((e) => `${e.field?.join(".")}: ${e.message}`)
      .join("; ");
    throw new Error(errs);
  }

  const draftOrder = draftResult.draftOrderCreate.draftOrder!;

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
    const errs = completeResult.draftOrderComplete.userErrors
      .map((e) => `${e.field?.join(".")}: ${e.message}`)
      .join("; ");
    throw new Error(errs);
  }

  const order = completeResult.draftOrderComplete.draftOrder?.order;

  return {
    orderId: order?.id ?? draftOrder.id,
    orderName: order?.name ?? draftOrder.name,
    totalPrice: draftOrder.totalPrice,
  };
}

export async function markOrderAsPaid(orderId: string): Promise<void> {
  const markAsPaidMutation = /* GraphQL */ `
    mutation orderMarkAsPaid($input: OrderMarkAsPaidInput!) {
      orderMarkAsPaid(input: $input) {
        order { id displayFinancialStatus }
        userErrors { field message }
      }
    }
  `;
  await shopifyAdminFetch<any>({
    query: markAsPaidMutation,
    variables: { input: { id: orderId } },
  });
}

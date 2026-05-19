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

export async function createCodOrder({
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
  // Generate a local order number — format: DW-YYYYMMDD-XXXX
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  const orderName = `DW-${date}-${rand}`;
  const orderId = `local-${Date.now()}`;

  console.log("[createCodOrder] Local order created:", orderName, { firstName, lastName, phone, email, address, city, province, zip, quantity });

  return {
    orderId,
    orderName,
    totalPrice: "2499.00",
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

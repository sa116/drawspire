export const metadata = {
  title: "Order Confirmed - Drawspire",
};

type SearchParams = {
  order?: string;
};

export default async function OrderConfirmedPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await props.searchParams;

  return (
    <>
      <style>{`nav, [data-sticky-cta], [data-announcement] { display: none !important; }`}</style>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white px-4 py-10">
        <div className="mx-auto max-w-md">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-9 w-9 text-green-600"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <h1 className="mb-1 text-2xl font-bold text-neutral-900">
              Order Confirmed!
            </h1>

            {sp.order && (
              <p className="text-sm font-semibold text-brand-700">
                Order {sp.order}
              </p>
            )}

            <p className="mt-2 text-sm text-neutral-500">
              Your order has been placed successfully. We will call you to confirm delivery.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
            <p className="text-2xl">🎨</p>
            <h2 className="mt-2 text-lg font-bold text-neutral-900">
              Your Drawspire is on its way!
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Expected delivery in 4–7 business days. Free shipping included.
            </p>
            <a
              href="/"
              className="mt-4 inline-block rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

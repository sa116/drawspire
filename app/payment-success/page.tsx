export const metadata = { title: "Payment Successful — Drawspire" };

export default async function PaymentSuccessPage(props: {
  searchParams: Promise<{ amount?: string }>;
}) {
  const sp = await props.searchParams;
  const amount = sp.amount ?? "";

  return (
    <>
      <style>{`nav, [data-sticky-cta], [data-announcement] { display: none !important; }`}</style>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 text-green-600">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
            </svg>
          </div>

          <h1 className="mb-2 text-3xl font-black text-neutral-900">Payment Successful!</h1>

          {amount && (
            <p className="mb-1 text-lg font-bold text-green-700">₹{amount} paid successfully</p>
          )}

          <p className="mb-8 text-neutral-600">
            Your Drawspire is confirmed and will be{" "}
            <span className="font-semibold text-neutral-900">delivered in 4–7 business days</span>.
            You'll receive tracking details on WhatsApp/SMS shortly.
          </p>

          <div className="mb-8 space-y-3 rounded-xl border border-green-200 bg-green-50 p-5 text-left text-sm">
            {[
              "Payment received successfully",
              "You saved ₹200 with online payment",
              "Order confirmed & being processed",
              "Delivery in 4–7 business days",
            ].map((line) => (
              <div key={line} className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0 text-green-600">
                  <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                </svg>
                <span className="text-neutral-700">{line}</span>
              </div>
            ))}
          </div>

          <a href="/" className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-8 py-3 font-bold text-white transition-colors hover:bg-brand-700">
            Back to Home
          </a>
        </div>
      </div>
    </>
  );
}

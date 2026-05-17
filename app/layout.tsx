import { CartProvider } from 'components/cart/cart-context';
import { AnnouncementBar } from 'components/layout/announcement-bar';
import { Navbar } from 'components/layout/navbar';
import { StickyCTA } from 'components/layout/sticky-cta';
import { GeistSans } from 'geist/font/sans';
import { getCart, getProducts } from 'lib/shopify';
import { baseUrl } from 'lib/utils';
import { ReactNode, Suspense } from 'react';
import { Toaster } from 'sonner';
import './globals.css';

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cart = getCart();
  let product;
  try {
    const products = await getProducts({});
    product = products[0];
  } catch {
    // Shopify not configured yet
  }

  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-white text-neutral-900 selection:bg-brand-200">
        <CartProvider cartPromise={cart}>
          <AnnouncementBar />
          <Navbar />
          <main>
            {children}
            <Toaster closeButton />
          </main>
          <Suspense fallback={null}>
            <StickyCTA product={product} />
          </Suspense>
        </CartProvider>
      </body>
    </html>
  );
}

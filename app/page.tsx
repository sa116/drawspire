import Footer from "components/layout/footer";
import { ProductJsonLd } from "components/product/product-json-ld";
import { ScrollAnimate } from "components/scroll-animate";
import { Benefits } from "components/sections/benefits";
import { FAQ } from "components/sections/faq";
import { FinalCTA } from "components/sections/final-cta";
import { Hero } from "components/sections/hero";
import { HowItWorks } from "components/sections/how-it-works";
import { PainPoints } from "components/sections/pain-points";
import { ProductShowcase } from "components/sections/product-showcase";
import { SocialProof } from "components/sections/social-proof";
import { getProducts } from "lib/shopify";

export const metadata = {
  title: "Drawspire — Double-Sided Kids Drawing Board | Chalk & Whiteboard",
  description:
    "The double-sided kids drawing board every child loves. Chalkboard + whiteboard, built-in tray. Safe for ages 3+. Free shipping across India. 7-day replacement guarantee.",
  openGraph: {
    type: "website",
  },
};

export default async function HomePage() {
  let product;
  try {
    const products = await getProducts({});
    product = products[0];
  } catch {
    // Shopify not configured yet — render with placeholder data
  }

  return (
    <>
      {product && <ProductJsonLd product={product} />}
      <Hero product={product} />
      <ScrollAnimate>
        <PainPoints />
      </ScrollAnimate>
      <ScrollAnimate>
        <ProductShowcase />
      </ScrollAnimate>
      <ScrollAnimate>
        <HowItWorks />
      </ScrollAnimate>
      <ScrollAnimate>
        <Benefits />
      </ScrollAnimate>
      <ScrollAnimate>
        <SocialProof />
      </ScrollAnimate>
      <ScrollAnimate>
        <FAQ />
      </ScrollAnimate>
      <ScrollAnimate>
        <FinalCTA product={product} />
      </ScrollAnimate>
      <Footer />
    </>
  );
}

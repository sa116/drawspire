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
  title: "Drawspire — Kids Drawing Board | No-Mess, Reusable, Ages 3+",
  description:
    "The no-mess LCD drawing board every kid loves. Reusable 10,000+ times, safe for ages 3+. Free shipping across India. 30-day money-back guarantee.",
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
        <SocialProof />
      </ScrollAnimate>
      <ScrollAnimate>
        <ProductShowcase />
      </ScrollAnimate>
      <ScrollAnimate>
        <Benefits />
      </ScrollAnimate>
      <ScrollAnimate>
        <HowItWorks />
      </ScrollAnimate>
      <ScrollAnimate>
        <PainPoints />
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

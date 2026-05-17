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
import { ShoppableReels } from "components/sections/shoppable-reels";
import { SocialProof } from "components/sections/social-proof";
import { getProducts } from "lib/shopify";

export const metadata = {
  description:
    "Bracelite Breathable Back Support — medical-grade lumbar support for herniated disc, sciatica, and scoliosis relief.",
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
      <ShoppableReels />
      <ScrollAnimate>
        <Benefits />
      </ScrollAnimate>
      <ScrollAnimate>
        <HowItWorks />
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

import React from "react";
import HowItWorks from "../pages/HowItWorks";
import TopVendors from "../pages/TopVendors";
// import ProblemSection from "../Features/ProblemSection";
import BenefitsAudience from "../Features/BenefitsAudience";
// import CloudSection from "../Features/CloudSection";
import PricingSection from "../Features/PricingSection";
import AIAssistantSection from "../pages/AIAssistantSection";
import BecomeVendorSection from "../pages/BecomeVendorSection";
import StatsSection from "../pages/StatsSection";
import HeroSlider from "../components/Home/HeroSlider";
import CategoryGrid from "../components/Home/CategoryGrid";
import ProductSlider from "../components/Home/ProductSlider";
import FeatureSection from "../components/Home/FeatureSection";
import NewsletterSection from "../components/Home/NewsletterSection";
import { useSelector } from "react-redux";

const Index = () => {
  const { topRatedProducts, newProducts } = useSelector(
    (state) => state.product
  );
  return (
    <div className="min-h-screen">
      <HeroSlider />
      <div className="container mx-auto px-4 pt-20">
        {/* <ProblemSection /> */}
        {/* <FeatureSection /> */}
        <AIAssistantSection />
        <CategoryGrid />
        {newProducts.length > 0 && (
          <ProductSlider title="New Arrivals" products={newProducts} />
        )}
        <HowItWorks/>
        <BenefitsAudience />
        <TopVendors />
        {topRatedProducts.length > 0 && (
          <ProductSlider
            title="Top Rated Products"
            products={topRatedProducts}
          />
        )}
        {/* <CloudSection /> */}
        <PricingSection />
        <BecomeVendorSection />
        <StatsSection />
        <FeatureSection />
        <NewsletterSection />
      </div>
    </div>
  );
};

export default Index;

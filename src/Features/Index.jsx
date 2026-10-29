import React from "react";
import HeroSlider from "../components/Home/HeroSlider";
import CategoryGrid from "../components/Home/CategoryGrid";
import ProductSlider from "../components/Home/ProductSlider";
import FeatureSection from "../components/Home/FeatureSection";
import NewsletterSection from "../components/Home/NewsletterSection";
import AIAssistantSection from "../components/Home/AIAssistantSection";
import HowItWorks from "../components/Home/HowItWorks";
import BecomeVendorSection from "../components/Home/BecomeVendorSection";
import TopVendors from "../components/Home/TopVendors";
import StatsSection from "../components/Home/StatsSection";
import ProblemSection from "../components/Home/ProblemSection";
import BenefitsAudience from "../components/Home/BenefitsAudience";
import CloudSection from "../components/Home/CloudSection";
import PricingSection from "../components/Home/PricingSection";
import ContactSection from "../components/Home/ContactSection";
import { useSelector } from "react-redux";

const Index = () => {
  const { topRatedProducts, newProducts } = useSelector((state) => state.product);
  return (
    <div className="min-h-screen">
      <HeroSlider />
      <div className="container mx-auto px-4 pt-20">
        <ProblemSection />
        <FeatureSection />
        <AIAssistantSection />
        <CategoryGrid />
        {newProducts.length > 0 && (
          <ProductSlider title="New Arrivals" products={newProducts} />
        )}
        <HowItWorks />
        <BenefitsAudience />
        <TopVendors />
        {topRatedProducts.length > 0 && (
          <ProductSlider title="Top Rated Products" products={topRatedProducts} />
        )}
        <CloudSection />
        <PricingSection />
        <BecomeVendorSection />
        <StatsSection />
        <ContactSection />
        <NewsletterSection />
      </div>
    </div>
  );
};

export default Index;

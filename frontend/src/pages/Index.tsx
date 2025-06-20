import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import { Categories } from "@/components/Categories";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { Navbar } from "@/components/Navbar";
import FeatureSection from "@/components/Features";
import BrowseByCategory from "@/components/BrowseByCategory";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Stats />
      <HowItWorks />
      <FeatureSection />
      <BrowseByCategory />
      <Testimonials />
      <CTA />
    </div>
  );
};

export default Index;

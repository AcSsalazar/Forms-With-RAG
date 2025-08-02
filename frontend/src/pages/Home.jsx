import React from "react";
import HeroSection from "../components/home/HeroSection";
import ServicesSection from "../components/home/ServicesSection";
import WhyUsSection from "../components/home/WhyUsSection";
import FeacturesSection from "../components/home/FeaturesSection";

function Home() {
  return (
    <>
      <HeroSection />
      <main id="main">
        <ServicesSection />
        <WhyUsSection />
        <FeacturesSection />
      </main>
    </>
  );
}

export default Home;
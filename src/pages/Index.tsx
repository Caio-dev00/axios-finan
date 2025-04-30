
import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import DashboardDemo from "@/components/DashboardDemo";
import Pricing from "@/components/Pricing";
import FinancialTips from "@/components/FinancialTips";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-white">
      <Header />
      <main className="w-full">
        <Hero />
        <Features />
        <DashboardDemo />
        <FinancialTips />
        <Testimonials />
        <Pricing />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

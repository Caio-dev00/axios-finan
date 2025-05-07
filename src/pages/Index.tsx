
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
import FacebookApiTest from "@/components/FacebookApiTest";

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-white">
      <Header />
      <main className="w-full">
        <Hero />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Facebook Conversion API Test</h2>
          <p className="text-center mb-6">Use esse componente para testar a integração com a API de Conversão do Facebook</p>
          <FacebookApiTest />
        </div>
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

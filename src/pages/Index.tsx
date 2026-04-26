import BenefitsBar from "@/components/landing/BenefitsBar";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import AuthoritySection from "@/components/landing/AuthoritySection";
import ShowroomSection from "@/components/landing/ShowroomSection";
import PromotionSection from "@/components/landing/PromotionSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import OfferReinforcement from "@/components/landing/OfferReinforcement";
import ContactForm from "@/components/landing/ContactForm";
import MapSection from "@/components/landing/MapSection";
import Footer from "@/components/landing/Footer";
import FloatingElements from "@/components/landing/FloatingElements";
import LeadQualificationModal from "@/components/landing/LeadQualificationModal";

const Index = () => {
  return (
    <div className="min-h-screen">
      <BenefitsBar />
      <Header />
      <HeroSection />
      <AboutSection />
      <AuthoritySection />
      <ShowroomSection />
      <PromotionSection />
      <TestimonialsSection />
      <OfferReinforcement />
      <ContactForm />
      <MapSection />
      <Footer />
      <FloatingElements />
      <LeadQualificationModal />
    </div>
  );
};

export default Index;

import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import BookingSection from "@/components/BookingSection";
import LocationsSection from "@/components/LocationsSection";
import ReviewsSection from "@/components/ReviewsSection";
import KidneyAnalysisSection from "@/components/KidneyAnalysisSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

const Index = () => {
  // Track page visits for analytics
  useVisitorTracking("/");
  return (
    <>
      <Helmet>
        <title>د. نهى جمال عبدالمالك | استشاري أمراض وزراعة الكلى - أسيوط</title>
        <meta name="description" content="د. نهى جمال عبدالمالك - مدرس واستشاري أمراض وزراعة الكلى والباطنة العامة بجامعة أسيوط. احجز موعدك الآن للحصول على أفضل رعاية طبية متخصصة في علاج أمراض الكلى والغسيل الكلوي ومتابعة زراعة الكلى." />
        <meta name="keywords" content="دكتور كلى أسيوط, استشاري أمراض الكلى, غسيل كلوي, زراعة الكلى, نهى جمال, طبيب باطنة أسيوط, علاج الكلى, دكتورة نهى جمال" />
        <link rel="canonical" href="https://drnohagamal.online/" />
        <meta property="og:url" content="https://drnohagamal.online/" />
        <meta property="og:title" content="د. نهى جمال عبدالمالك | استشاري أمراض وزراعة الكلى" />
        <meta property="og:description" content="مدرس واستشاري أمراض وزراعة الكلى والباطنة العامة بجامعة أسيوط. احجز موعدك الآن." />
      </Helmet>
      
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <BookingSection />
        <LocationsSection />
        <ReviewsSection />
        <KidneyAnalysisSection />
        <ContactSection />
        <Footer />
      </main>
      <ChatBot />
    </>
  );
};

export default Index;

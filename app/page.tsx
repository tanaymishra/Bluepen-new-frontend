import Image from "next/image";
import Navbar from "@/components/user/navbar/navbar";
import ProcessSection from "@/components/ProcessSection";
import { getGoogleReviews } from "@/lib/customFunctions/getGoogleReviews";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import ServicesSection from "@/components/ServicesSection";
import ExpertsSection from "@/components/ExpertsSection";
import ReviewsSection from "@/components/ReviewsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

export default async function Home() {
  const { reviews, nextPageToken } = await getGoogleReviews();

  return (
    <>
      <Navbar />
      <HeroSection />

      {/* Section 2: Stats */}
      <StatsSection />

      {/* Section 3: Process */}
      <ProcessSection />

      {/* Section 4: Services */}
      <ServicesSection />

      {/* Section 5: Experts */}
      <ExpertsSection />

      {/* Section 6 and Footer */}
      {/* Reviews, FAQ, Footer */}
      <ReviewsSection reviews={reviews} />
      <FAQSection />
      <Footer />
    </>
  );
}

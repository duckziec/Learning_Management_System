import React from "react";
import AnimatedPage from "../../../components/ui/AnimatedPage";
import useRevealOnScroll from "../../../hooks/useRevealOnScroll";
import HomeHero from "../components/HomeHero";
import HomeHighlights from "../components/HomeHighlights";
import FeaturedCourses from "../components/FeaturedCourses";
import PracticeSection from "../components/PracticeSection";

export default function HomePage() {
  useRevealOnScroll();

  return (
    <AnimatedPage>
      <HomeHero />
      <HomeHighlights />
      <FeaturedCourses />
      <PracticeSection />
    </AnimatedPage>
  );
}

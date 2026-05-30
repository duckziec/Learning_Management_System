import AnimatedPage from "../../../components/ui/AnimatedPage";
import useRevealOnScroll from "../../../hooks/useRevealOnScroll";
import HeroAboutUs from "../components/us/HeroAboutUs";
import ContentAboutUs from "../components/us/ContentAboutUs";
import AboutCapabilities from "../components/us/AboutCapabilities";
import MissionAndVision from "../components/us/MissionAndVision";
import OurCoreValues from "../components/us/OurCoreValues";

export default function AboutUsPage() {
    useRevealOnScroll();

    return (
        <AnimatedPage>
            <HeroAboutUs />
            <ContentAboutUs />
            <AboutCapabilities />
            <MissionAndVision />
            <OurCoreValues />
        </AnimatedPage>
    );
}

import FooterComponent from "./commons/footer-component";
import HeroComponent from "./commons/hero/hero-component";
import SectionMotionWrapper from "./commons/SectionMotionWrapper";

export default function FooterSection() {
    const hero = {
      subheadingText: "Donate Blood",
      headingText: "Mỗi giọt máu cho đi, một cuộc đời nhận lại.",
      classHint: "donate-blood-page-hero",
    }
    return (
            
        <SectionMotionWrapper className="w-full h-screen flex flex-col items-center justify-start bg-blue-50 snap-start">
                {(inview) => (
                <>
                    <HeroComponent {...hero} />
                    <FooterComponent/>
                    
                </>
                )}
        </SectionMotionWrapper>
        
    );
}
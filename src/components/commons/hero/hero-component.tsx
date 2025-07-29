
import "./hero-component-styles.scss";
interface HeroComponentProps {
    subheadingText: string;
    headingText: string;
    classHint?: string;
}

const HeroComponent = ({ subheadingText, headingText, classHint }: HeroComponentProps) => {
    return (
        <section className={`main-wrapper ${classHint}`}>
            <div className="main-container">
                <div className="text-wrapper sm:w-[1000px] flex flex-col justify-center items-center">
                    <h3 className="subheading relative font-bold sm:text-[5rem] leading-[2em] text-center tracking-[0.2em] uppercase text-blue-600">
                        {subheadingText}
                    </h3>
                    <h1 className="font-bold text-[35px] sm:text-[90px] leading-tight text-center capitalize text-white w-full ">
                        {headingText}
                    </h1>
                </div>
            </div>
        </section>
    );
};

export default HeroComponent;
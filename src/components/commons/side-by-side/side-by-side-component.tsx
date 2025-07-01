import "./side-by-side-styles.scss";
import {ButtonComponent, GroupedHeadingComponent, ParaComponent, WrapperSection,} from "@/components";

interface SideBySideComponentProps {
  subheadingText: string;
  headingText: string;
  paraText: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  classHint?: string;
  buttonHave?: boolean;
}
const SideBySideComponent = ({
	subheadingText,
	headingText,
	paraText,
	imageUrl,
	buttonText,
	buttonLink,
	classHint,
	buttonHave,
}:SideBySideComponentProps) => {
	return (
		<WrapperSection>
			<div className="wrapper grid grid-cols0-1 lg:grid-cols-2">
				<div
					className={`my-image-col rounded-md z-[25] h-[400px] sm:h-[600px] w-full ${classHint}`}
				></div>
				<div className="content-wrapper p-[15px] py-[50px] sm:p-[50px] flex flex-col justify-center">
					<GroupedHeadingComponent
						subheadingText={subheadingText}
						headingText={headingText}
					/>
					<ParaComponent innerText={paraText} />

					{buttonHave && (
						<ButtonComponent
							buttonText={buttonText}
							buttonLink={buttonLink}
							buttonType={"fill"}
						/>
					)}
				</div>
			</div>
		</WrapperSection>
	);
};

export default SideBySideComponent;

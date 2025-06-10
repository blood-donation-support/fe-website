import "./two-cta-styles.scss";

import {WrapperSection,ButtonComponent} from "@/components"

const TwoCtaComponent = () => {
	const ctaDetails = [
		{
			key: "donate-blood",
			ctaClass: "first-cta-col",
			subheading: `"Cứu một mạng người hôm nay"`,
			heading: "Hiến máu tại DonationBlood",
			btnText: "Hiến máu",
			ctaLink: "/donateBlood",
		},
		{
			key: "request-blood",
			ctaClass: "second-cta-col",
			subheading: `"Cần máu gấp?"`,
			heading: "Yêu cầu để được nhận máu",
			btnText: "Yêu cầu máu",
			ctaLink: "/needBlood",
		},
	];

	return (
		<WrapperSection>
			<div className="cta-content-wrapper grid place-items-start sm:grid-cols-[1fr_1fr] gap-[20px] w-full ">
				{ctaDetails.map((ctaDetail) => (
					<a
						href={ctaDetail.ctaLink}
						key={ctaDetail.key}
						className={`cta-col sm:before:transition rounded-md overflow-hidden w-full relative z-[25] pt-[150px] pb-[30px] sm:pb-[50px] px-[30px] sm:px-[50px] ${ctaDetail.ctaClass}`}
					>
						<div className="cta-col-content relative z-50">
							<p className="cta-subheading not-italic font-medium text-sm sm:text-md leading-normal tracking-[0.1em] uppercase text-white">
								{ctaDetail.subheading}
							</p>
							<h2 className="cta-heading not-italic font-semibold text-[30px] sm:text-[40px] leading-tight capitalize text-white">
								{ctaDetail.heading}
							</h2>

							<ButtonComponent
								buttonText={ctaDetail.btnText}
								buttonLink={ctaDetail.ctaLink}
								buttonType={"line"}
							/>
						</div>
					</a>
				))}
			</div>
		</WrapperSection>
	);
};

export default TwoCtaComponent;
